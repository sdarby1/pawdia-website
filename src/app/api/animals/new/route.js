import { writeFile } from 'fs/promises'
import path from 'path'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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

    // Checkboxen (Boolean-Felder)
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

    // Dateien (Coverbild, Bilder, Videos)
    const coverFile = formData.get('coverImage')
    const imageFiles = formData.getAll('images')
    const videoFiles = formData.getAll('videos')

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'animals')
    const timeStamp = Date.now()

    // Funktion zum Speichern einer Datei und Rückgabe des relativen Pfads
    const saveFile = async (file, prefix = '') => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const ext = file.name.split('.').pop()
      const fileName = `${prefix}-${timeStamp}-${Math.random().toString(36).substring(2)}.${ext}`
      const filePath = path.join(uploadDir, fileName)
      await writeFile(filePath, buffer)
      return `/uploads/animals/${fileName}`
    }

    const coverImage = coverFile && coverFile.name ? await saveFile(coverFile, 'cover') : null

    const images = []
    for (const img of imageFiles) {
      if (img.name) {
        const imgPath = await saveFile(img, 'img')
        images.push(imgPath)
      }
    }

    const videos = []
    for (const vid of videoFiles) {
      if (vid.name) {
        const vidPath = await saveFile(vid, 'vid')
        videos.push(vidPath)
      }
    }

    if (
  !name?.trim() ||
  !species?.trim() ||
  !breed?.trim() ||
  !gender?.trim() ||
  !birthDate ||
  isNaN(age) ||
  !size?.trim() ||
  !description?.trim() ||
  !coverFile || !coverFile.name
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
