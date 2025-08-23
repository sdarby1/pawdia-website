import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req, context) {
  const { params } = context
  const chatId = params.id

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) {
    return NextResponse.json({ error: 'Nicht authentifiziert.' }, { status: 401 })
  }

  const senderId = token.id
  const isFromUser = token.role === 'USER'

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    select: {
      id: true,
      userId: true,
      shelterId: true,
    },
  })

  if (!chat) {
    return NextResponse.json({ error: 'Chat nicht gefunden.' }, { status: 404 })
  }

  const istBerechtigt =
    (isFromUser && chat.userId === senderId) ||
    (!isFromUser && chat.shelterId === senderId)

  if (!istBerechtigt) {
    return NextResponse.json({ error: 'Keine Berechtigung für diesen Chat.' }, { status: 403 })
  }

  await prisma.message.updateMany({
    where: {
      chatId,
      isFromUser: !isFromUser, 
      read: false,
    },
    data: {
      read: true,
    },
  })

  return NextResponse.json({ success: true })
}
