import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import zipcodes from '@/data/zipcodes.de.json'

function getCoordinatesFromZip(zip) {
  return zipcodes.find(z => z.zipcode === zip)
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const toRad = (value) => (value * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)

  const plz = searchParams.get('plz')
  const radius = Number(searchParams.get('radius'))

  const where = {}

  // Tierart
  if (searchParams.get('species')) {
    where.species = searchParams.get('species')
  }

  // Rasse
  if (searchParams.get('breed')) {
    where.breed = {
      contains: searchParams.get('breed').toLowerCase()
    }
  }

  // Alter
  if (searchParams.get('maxAge')) {
    where.age = { lte: Number(searchParams.get('maxAge')) }
  }

  // Größe
  if (searchParams.get('size')) {
    where.size = searchParams.get('size')
  }

  // Geschlecht
  if (searchParams.get('gender') && searchParams.get('gender') !== 'EGAL') {
    where.gender = searchParams.get('gender')
  }

  // Boolean-Filter
  const booleanFields = [
    'goodWithChildren',
    'goodWithDogs',
    'goodWithCats',
    'isForSeniors',
    'isForBeginners',
    'isFamilyFriendly',
    'isForExperienced',
    'isNeutered'
  ]

  booleanFields.forEach(field => {
    const val = searchParams.get(field)
    if (val === 'true') where[field] = true
    if (val === 'false') where[field] = false
  })

  // Tiere laden
  let animals = await prisma.animal.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      age: true,
      gender: true,
      size: true,
      coverImage: true,
      isForExperienced: true,
      isFamilyFriendly: true,
      shelter: {
        select: {
          name: true,
          city: true,
          postalCode: true,
          latitude: true,
          longitude: true,
        },
      },
    },
  })

  // Umkreisfilter
  if (plz && radius) {
    const reference = getCoordinatesFromZip(plz)

    if (!reference) {
      return NextResponse.json([], { status: 200 })
    }

    const { latitude: refLat, longitude: refLon } = reference

    animals = animals.filter(animal => {
      const shelter = animal.shelter
      if (!shelter || shelter.latitude == null || shelter.longitude == null) return false

      const distance = getDistance(
        Number(refLat),
        Number(refLon),
        shelter.latitude,
        shelter.longitude
      )

      return distance <= radius
    })
  }

  return NextResponse.json(animals)
}
