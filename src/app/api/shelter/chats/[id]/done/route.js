import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  const chatId = params.id

  try {
    const updated = await prisma.chat.updateMany({
      where: {
        id: chatId,
        shelterId: token.id,
      },
      data: {
        status: 'ERLEDIGT',
      },
    })

    if (updated.count === 0) {
      return NextResponse.json({ error: 'Kein Zugriff oder Chat nicht gefunden.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[CHAT_DONE_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Chats.' }, { status: 500 })
  }
}
