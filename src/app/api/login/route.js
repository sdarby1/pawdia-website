import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  let body = {}

  try {
    body = await req.json()
  } catch (err) {
    console.error('[LOGIN_BODY_PARSE_ERROR]', err)
    return NextResponse.json(
      { error: 'Ungültiger Request Body – kein JSON.' },
      { status: 400 }
    )
  }

  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'E-Mail und Passwort sind erforderlich.' },
      { status: 400 }
    )
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten.' },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten.' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      message: 'Login erfolgreich!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (err) {
    console.error('[LOGIN_FATAL_ERROR]', err)
    return NextResponse.json(
      { error: 'Ein interner Serverfehler ist aufgetreten.' },
      { status: 500 }
    )
  }
}
