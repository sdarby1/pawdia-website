import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 })
  }

  const shelter = await prisma.shelter.findUnique({
    where: { id: token.id },
    select: {
      id: true,
      name: true,
      email: true,
      postalCode: true,
      city: true,
      street: true,
      contactPerson: true,
      houseNumber: true,
      phoneNumber: true,
      isVerified: true,
      googleMapsLink: true,
      website: true,
      instagram: true,
      facebook: true,
      tiktok: true,
      linkedIn: true,
    },
  })

  const animals = await prisma.animal.findMany({
    where: { shelterId: token.id },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      age: true,
      gender: true,
      coverImage: true,
      isEmergency: true,
      isForExperienced: true,
      isFamilyFriendly: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ shelter, animals })
}
