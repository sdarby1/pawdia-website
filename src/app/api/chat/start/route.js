import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { shelterId, animalId } = body

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    if (!token || token.role !== 'USER') {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
    }

    const userId = token.id

    let existingChat
    if (animalId) {
      existingChat = await prisma.chat.findFirst({
        where: {
          userId,
          shelterId,
          animalId,
          status: 'OFFEN',
        },
      })
    } else {
      existingChat = await prisma.chat.findFirst({
        where: {
          userId,
          shelterId,
          animalId: null,
          status: 'OFFEN',
        },
      })
    }

    if (existingChat) {
      return NextResponse.json({ chat: existingChat })
    }

    // Neuen Chat erstellen
    const newChat = await prisma.chat.create({
      data: {
        user: { connect: { id: userId } },
        shelter: { connect: { id: shelterId } },
        animal: animalId ? { connect: { id: animalId } } : undefined,
      },
      include: {
        animal: true,
        shelter: { select: { name: true, id: true } },
        user: { select: { name: true, id: true } },
      },
    })

    return NextResponse.json({ chat: newChat })
  } catch (err) {
    console.error('[CHAT_START_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Starten des Chats.' }, { status: 500 })
  }
}
