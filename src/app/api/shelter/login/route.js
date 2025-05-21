import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort sind erforderlich.' }, { status: 400 });
    }

    const shelter = await prisma.shelter.findUnique({
      where: { email },
    });

    if (!shelter || !(await bcrypt.compare(password, shelter.password))) {
      return NextResponse.json({ error: 'Ungültige Anmeldedaten.' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: shelter.id, email: shelter.email, role: 'shelter' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token, shelter: { id: shelter.id, name: shelter.name } });
  } catch (err) {
    console.error('[SHELTER_LOGIN_ERROR]', err);
    return NextResponse.json({ error: 'Serverfehler beim Login.' }, { status: 500 });
  }
}
