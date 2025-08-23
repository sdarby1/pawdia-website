import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req, context) {
  const params = await context.params 
  const chatId = params.id

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ error: 'Nicht authentifiziert.' }, { status: 401 })
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        animal: true,
        shelter: { select: { name: true, id: true } },
        user: { select: { name: true, id: true } },
      },
    })

    if (!chat) {
      return NextResponse.json({ error: 'Chat nicht gefunden.' }, { status: 404 })
    }

    const senderId = token.id
    const isFromUser = token.role === 'USER'

    const istBerechtigt =
      (isFromUser && chat.userId === senderId) ||
      (!isFromUser && chat.shelterId === senderId)

    if (!istBerechtigt) {
      return NextResponse.json({ error: 'Keine Berechtigung für diesen Chat.' }, { status: 403 })
    }

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json({ chat, messages })
  } catch (err) {
    console.error('[MESSAGES_GET_ERROR]', err)
    return NextResponse.json({ error: 'Serverfehler beim Laden der Nachrichten.' }, { status: 500 })
  }
}
