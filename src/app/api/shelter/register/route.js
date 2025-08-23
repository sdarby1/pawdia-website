import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { getToken } from 'next-auth/jwt'
import zipcodes from '@/data/zipcodes.de.json' 

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || token.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
    }

    const body = await req.json()
    const { name, email, password, postalCode } = body

    if (!name || !email || !password || !postalCode) {
      return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 })
    }

    const existingShelter = await prisma.shelter.findUnique({ where: { email } })
    if (existingShelter) {
      return NextResponse.json({ error: 'Ein Tierheim mit dieser E-Mail existiert bereits.' }, { status: 400 })
    }

    const zipEntry = zipcodes.find(z => z.zipcode === postalCode)
    if (!zipEntry) {
      return NextResponse.json({ error: 'PLZ nicht gefunden.' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newShelter = await prisma.shelter.create({
      data: {
        name,
        email,
        password: hashedPassword,
        latitude: parseFloat(zipEntry.latitude),
        longitude: parseFloat(zipEntry.longitude),
        postalCode,
      },
    })

    return NextResponse.json({ message: 'Shelter erfolgreich registriert!', shelter: newShelter })
  } catch (err) {
    console.error('[SHELTER_REGISTER_ERROR]', err)
    return NextResponse.json({ error: 'Serverfehler bei der Registrierung!' }, { status: 500 })
  }
}
