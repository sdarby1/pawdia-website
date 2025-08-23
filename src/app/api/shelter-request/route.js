import { writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { sendShelterRequestMail } from '@/lib/sendMail'

const uploadDir = path.join(process.cwd(), 'tmp')

export async function POST(req) {
  try {
    const formData = await req.formData()

    const getField = name => formData.get(name) || ''
    const name = getField('name')
    const email = getField('email')
    const website = getField('website')
    const message = getField('message')
    const street = getField('street')
    const houseNumber = getField('houseNumber')
    const postalCode = getField('postalCode')
    const city = getField('city')

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Bitte alle Pflichtfelder ausfüllen.' }, { status: 400 })
    }

    const address = [street, houseNumber, postalCode, city].filter(Boolean).join(', ')
    const mapsLink = street && postalCode && city
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${street} ${houseNumber}, ${postalCode} ${city}`)}`
      : null

    const files = formData.getAll('files')
    const attachments = []

    for (const file of files) {
      if (!(file instanceof File)) continue
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: file.name,
        content: buffer,
      })
    }

    await sendShelterRequestMail({ name, email, website, message, address, mapsLink, attachments })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[SHELTER_REQUEST_ERROR]', err)
    return NextResponse.json({ error: 'Serverfehler beim Versenden.' }, { status: 500 })
  }
}
