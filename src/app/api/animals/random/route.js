import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const animals = await prisma.animal.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { shelter: true }
    })

    const total = await prisma.animal.count()

    return NextResponse.json({ animals, total })
  } catch (err) {
    console.error('[RANDOM_ANIMALS_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Laden der Tiere.' }, { status: 500 })
  }
}
