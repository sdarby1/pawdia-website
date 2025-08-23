import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: token.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  })
  if (!user) return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 })
  return NextResponse.json({ user })
}

export async function PATCH(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { name, email } = body || {}

  if (!name || !email) {
    return NextResponse.json({ error: 'Name und E-Mail sind erforderlich.' }, { status: 400 })
  }

  try {
    const updated = await prisma.user.update({
      where: { id: token.id },
      data: { name, email },
      select: { id: true, name: true, email: true },
    })
    return NextResponse.json({ user: updated })
  } catch (err) {
    if (err?.code === 'P2002') {
      return NextResponse.json({ error: 'Diese E-Mail ist bereits vergeben.' }, { status: 409 })
    }
    console.error('PATCH /api/user/me error:', err)
    return NextResponse.json({ error: 'Update fehlgeschlagen.' }, { status: 500 })
  }
}

export async function DELETE(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })

  const { emailConfirm } = await req.json().catch(() => ({}))

  const me = await prisma.user.findUnique({
    where: { id: token.id },
    select: { id: true, email: true },
  })
  if (!me) return NextResponse.json({ error: 'Benutzer nicht gefunden.' }, { status: 404 })

  if (me.email) {
    if (!emailConfirm) {
      return NextResponse.json({ error: 'E-Mail-Bestätigung fehlt.' }, { status: 400 })
    }
    if (me.email !== emailConfirm) {
      return NextResponse.json({ error: 'E-Mail stimmt nicht überein.' }, { status: 400 })
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: token.id },
        data: {
          favorites: { set: [] }, 
        },
      })

      try { await tx.session.deleteMany({ where: { userId: token.id } }) } catch {}
      try { await tx.account.deleteMany({ where: { userId: token.id } }) } catch {}

      try { await tx.chat.deleteMany({ where: { userId: token.id } }) } catch {}
      try { await tx.blogPost.deleteMany({ where: { authorId: token.id } }) } catch {}

      await tx.user.delete({ where: { id: token.id } })
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/user/me/edit error:', err)
    return NextResponse.json({ error: 'Löschen fehlgeschlagen.' }, { status: 500 })
  }
}
