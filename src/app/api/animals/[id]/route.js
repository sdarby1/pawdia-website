import { writeFile } from 'fs/promises'
import path from 'path'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'animals')

const saveFile = async (file, prefix = '') => {
  const buffer = Buffer.from(await file.arrayBuffer())
  const ext = file.name.split('.').pop()
  const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
  const filePath = path.join(uploadDir, fileName)
  await writeFile(filePath, buffer)
  return `/uploads/animals/${fileName}`
}

export async function GET(req, context) {
  const { params } = context
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  try {
    const animal = await prisma.animal.findFirst({
      where: {
        id: params.id,
        shelterId: token.id,
      },
    })

    if (!animal) {
      return NextResponse.json({ error: 'Tier nicht gefunden.' }, { status: 404 })
    }

    return NextResponse.json({ animal })
  } catch (err) {
    console.error('[ANIMAL_FETCH_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Abrufen.' }, { status: 500 })
  }
}

export async function PATCH(req, context) {
  const { params } = context
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const getBool = key => formData.get(key) === 'true'

    const name = formData.get('name')
    const species = formData.get('species')
    const breed = formData.get('breed')
    const gender = formData.get('gender')
    const birthDate = formData.get('birthDate')
    const age = parseInt(formData.get('age'))
    const size = formData.get('size')
    const description = formData.get('description')
    const adoptionFee = formData.get('adoptionFee') ? parseFloat(formData.get('adoptionFee')) : null

    const isFamilyFriendly = getBool('isFamilyFriendly')
    const isForExperienced = getBool('isForExperienced')
    const isEmergency = getBool('isEmergency')
    const isForBeginners = getBool('isForBeginners')
    const isForSeniors = getBool('isForSeniors')
    const goodWithCats = getBool('goodWithCats')
    const goodWithDogs = getBool('goodWithDogs')
    const goodWithChildren = getBool('goodWithChildren')
    const isNeutered = getBool('isNeutered')

    const imageFiles = formData.getAll('images')
    const videoFiles = formData.getAll('videos')

    const images = []
    for (const img of imageFiles) {
      if (img.name) images.push(await saveFile(img, 'img'))
    }

    const videos = []
    for (const vid of videoFiles) {
      if (vid.name) videos.push(await saveFile(vid, 'vid'))
    }

    if (!name?.trim() || !species?.trim() || !breed?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 })
    }

    const result = await prisma.animal.updateMany({
      where: { id: params.id, shelterId: token.id },
      data: {
        name,
        species,
        breed,
        gender,
        birthDate: new Date(birthDate),
        age,
        size,
        isFamilyFriendly,
        isForExperienced,
        isEmergency,
        isForBeginners,
        isForSeniors,
        goodWithCats,
        goodWithDogs,
        goodWithChildren,
        isNeutered,
        description,
        adoptionFee,
        ...(images.length > 0 ? { images } : {}),
        ...(videos.length > 0 ? { videos } : {}),
      },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: 'Tier nicht gefunden oder keine Berechtigung.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Tier erfolgreich aktualisiert.' })
  } catch (err) {
    console.error('[ANIMAL_EDIT_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Bearbeiten.' }, { status: 500 })
  }
}

export async function DELETE(req, context) {
  const { params } = context
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  try {
    const result = await prisma.animal.deleteMany({
      where: { id: params.id, shelterId: token.id },
    })

    if (result.count === 0) {
      return NextResponse.json({ error: 'Tier nicht gefunden oder keine Berechtigung.' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Tier erfolgreich gelöscht.' })
  } catch (err) {
    console.error('[ANIMAL_DELETE_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Löschen.' }, { status: 500 })
  }
}
