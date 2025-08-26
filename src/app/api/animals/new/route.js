import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import cloudinary from '@/lib/cloudinary'

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  try {
    const formData = await req.formData()

    // Text-Felder
    const name = formData.get('name')
    const species = formData.get('species')
    const breed = formData.get('breed')
    const gender = formData.get('gender')
    const birthDate = formData.get('birthDate')
    const age = parseInt(formData.get('age'))
    const size = formData.get('size')
    const description = formData.get('description')

    // Checkboxen
    const getBool = key => formData.get(key) === 'true'
    const isFamilyFriendly = getBool('isFamilyFriendly')
    const isForExperienced = getBool('isForExperienced')
    const isEmergency = getBool('isEmergency')
    const isForBeginners = getBool('isForBeginners')
    const isForSeniors = getBool('isForSeniors')
    const goodWithCats = getBool('goodWithCats')
    const goodWithDogs = getBool('goodWithDogs')
    const goodWithChildren = getBool('goodWithChildren')
    const isNeutered = getBool('isNeutered')

    // Dateien
    const coverFile = formData.get('coverImage')
    const imageFiles = formData.getAll('images')
    const videoFiles = formData.getAll('videos')

    const uploadToCloudinary = async (file, folder) => {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'auto', // erkennt automatisch ob Bild oder Video
          },
          (err, result) => {
            if (err) return reject(err)
            resolve(result.secure_url)
          }
        )
        stream.end(buffer)
      })
    }

    const coverImage = coverFile && coverFile.name
      ? await uploadToCloudinary(coverFile, 'pawdia/animals')
      : null

    const images = []
    for (const img of imageFiles) {
      if (img.name) {
        const url = await uploadToCloudinary(img, 'pawdia/animals')
        images.push(url)
      }
    }

    const videos = []
    for (const vid of videoFiles) {
      if (vid.name) {
        const url = await uploadToCloudinary(vid, 'pawdia/animals')
        videos.push(url)
      }
    }

    if (
      !name?.trim() || !species?.trim() || !breed?.trim() ||
      !gender?.trim() || !birthDate || isNaN(age) ||
      !size?.trim() || !description?.trim() || !coverImage
    ) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 })
    }

    const newAnimal = await prisma.animal.create({
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
        coverImage,
        images,
        videos,
        shelter: { connect: { id: token.id } },
      },
    })

    return NextResponse.json({ message: 'Tier erfolgreich erstellt.', animal: newAnimal })
  } catch (err) {
    console.error('[ANIMAL_UPLOAD_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Hochladen.' }, { status: 500 })
  }
}
