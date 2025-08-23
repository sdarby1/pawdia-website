import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'USER') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId: token.id,
      },
      include: {
        shelter: { select: { name: true } },
        animal: { select: { name: true, id: true } },
        messages: {
          where: {
            read: false,
            isFromUser: false,
          },
          select: { id: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json({ chats })
  } catch (err) {
    console.error('[USER_CHAT_FETCH_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Laden der Chats.' }, { status: 500 })
  }
}
