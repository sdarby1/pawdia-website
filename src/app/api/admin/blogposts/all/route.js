import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 403 })
  }

  try {
    const blogPosts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ blogPosts })
  } catch (err) {
    console.error('[ADMIN_GET_BLOGPOSTS_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Laden der Blogposts.' }, { status: 500 })
  }
}
