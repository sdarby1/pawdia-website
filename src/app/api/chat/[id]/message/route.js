import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req, context) {
  try {
    const { params } = context 
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    const chatId = params.id

    if (!token) {
      return NextResponse.json({ error: 'Nicht authentifiziert.' }, { status: 401 })
    }

    const { content } = await req.json()
    if (!content || content.trim() === '') {
      return NextResponse.json({ error: 'Nachricht darf nicht leer sein.' }, { status: 400 })
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
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

    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId,
        isFromUser,
        chatId,
      },
    })

    return NextResponse.json({ message: newMessage })
  } catch (err) {
    console.error('[MESSAGE_SEND_ERROR]', err)
    return NextResponse.json({ error: 'Serverfehler beim Senden der Nachricht.' }, { status: 500 })
  }
}
