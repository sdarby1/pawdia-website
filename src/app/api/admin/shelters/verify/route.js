import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  const { shelterId } = await req.json()

  if (!shelterId) {
    return NextResponse.json({ error: 'Shelter-ID fehlt.' }, { status: 400 })
  }

  const updated = await prisma.shelter.update({
    where: { id: shelterId },
    data: { isVerified: true },
  })

  return NextResponse.json({ message: 'Shelter verifiziert.', shelter: updated })
}
