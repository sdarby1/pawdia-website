import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import prisma from '@/lib/prisma'

export async function GET(_req, { params }) {
  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: 'INVALID_ID' }, { status: 400 })
  }
  try {
    const animal = await prisma.animal.findUnique({ where: { id } })
    if (!animal) return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 })
    return NextResponse.json({ ok: true, data: animal })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ ok: false, error: 'Nicht autorisiert' }, { status: 403 })
  }

  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: 'INVALID_ID' }, { status: 400 })
  }

  try {
    const existing = await prisma.animal.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 })
    if (existing.shelterId !== token.id) {
      return NextResponse.json({ ok: false, error: 'FORBIDDEN' }, { status: 403 })
    }

    const body = await req.json()
    const allowedFields = [
      'name',
      'species',
      'breed',
      'age',
      'gender',           
      'coverImage',
      'description',       
      'isEmergency',
      'isForExperienced',
      'isFamilyFriendly',
    ]
    const data = {}
    for (const f of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(body, f)) data[f] = body[f]
    }

    if (data.age === '') data.age = null
    if (typeof data.age === 'string') {
      const n = Number(data.age)
      data.age = Number.isNaN(n) ? null : n
    }

    const updated = await prisma.animal.update({ where: { id }, data })
    return NextResponse.json({ ok: true, data: updated })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (!token || token.role !== 'SHELTER') {
    return NextResponse.json({ ok: false, error: 'Nicht autorisiert' }, { status: 403 })
  }

  const id = Number(params.id)
  if (Number.isNaN(id)) {
    return NextResponse.json({ ok: false, error: 'INVALID_ID' }, { status: 400 })
  }

  try {
    const existing = await prisma.animal.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ ok: false, error: 'NOT_FOUND' }, { status: 404 })
    if (existing.shelterId !== token.id) {
      return NextResponse.json({ ok: false, error: 'FORBIDDEN' }, { status: 403 })
    }

    await prisma.animal.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 })
  }
}
