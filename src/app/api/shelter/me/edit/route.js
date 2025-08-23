// /app/api/shelter/me/route.js
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 })
  }

  const data = await req.json()

  try {
    const updatedShelter = await prisma.shelter.update({
      where: { id: token.id },
      data: {
        name: data.name,
        contactPerson: data.contactPerson,
        email: data.email,
        phoneNumber: data.phoneNumber,
        street: data.street,
        houseNumber: data.houseNumber,
        postalCode: data.postalCode,
        city: data.city,
        website: data.website,
        instagram: data.instagram,
        facebook: data.facebook,
        tiktok: data.tiktok,
        linkedIn: data.linkedIn,
        googleMapsLink: data.googleMapsLink,
      },
    })

    return NextResponse.json({ shelter: updatedShelter })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Update fehlgeschlagen' }, { status: 500 })
  }
}
