import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || !token.id) {
      return NextResponse.json(
        { error: 'Du musst angemeldet sein, um Tiere zu favorisieren.' },
        { status: 401 }
      )
    }

    const { animalId } = await req.json()

    // prüfen, ob Favorit bereits existiert
    const existing = await prisma.userFavorite.findUnique({
      where: {
        userId_animalId: {
          userId: token.id,
          animalId,
        },
      },
    })

    if (existing) {
      // Favorit entfernen
      await prisma.userFavorite.delete({
        where: {
          userId_animalId: {
            userId: token.id,
            animalId,
          },
        },
      })
      return NextResponse.json({ message: 'Favorit entfernt.', favorited: false })
    } else {
      // Favorit hinzufügen
      await prisma.userFavorite.create({
        data: {
          userId: token.id,
          animalId,
        },
      })
      return NextResponse.json({ message: 'Favorit hinzugefügt.', favorited: true })
    }
  } catch (err) {
    console.error('[FAVORITE_TOGGLE_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Favoriten-Toggle.' }, { status: 500 })
  }
}
