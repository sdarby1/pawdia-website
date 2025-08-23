import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function DELETE(req) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ message: 'Account erfolgreich gelöscht.' }, { status: 200 })
  } catch (error) {
    console.error('[USER_DELETE_ERROR]', error)
    return NextResponse.json({ error: 'Fehler beim Löschen des Accounts.' }, { status: 500 })
  }
}
