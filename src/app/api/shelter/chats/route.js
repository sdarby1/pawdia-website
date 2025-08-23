import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  try {
    const chats = await prisma.chat.findMany({
      where: {
        shelterId: token.id,
      },
      include: {
        user: { select: { name: true } },
        animal: { select: { name: true, id: true } },
        messages: {
  where: {
    read: false,
    isFromUser: true,
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
    console.error('[SHELTER_CHAT_FETCH_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Laden der Chats.' }, { status: 500 })
  }
}
