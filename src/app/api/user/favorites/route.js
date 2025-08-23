import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const userId = token?.id

    if (!userId) {
      return NextResponse.json({ error: 'Nicht eingeloggt.' }, { status: 401 })
    }

    const favorites = await prisma.userFavorite.findMany({
      where: { userId },
      select: {
        animal: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            age: true,
            gender: true,
            coverImage: true,
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
        },
      },
    })

    const animals = favorites.map(fav => fav.animal)

    return NextResponse.json({ favorites: animals }, { status: 200 })
  } catch (error) {
    console.error('[FAVORITES_FETCH_ERROR]', error)
    return NextResponse.json(
      { error: 'Serverfehler beim Abrufen der Favoriten' },
      { status: 500 }
    )
  }
}
