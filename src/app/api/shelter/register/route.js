import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log('📥 Eingehende Daten:', body);

    const { name, email, password } = body;

    if (!name || !email || !password) {
      console.warn('⚠️ Fehlende Felder:', { name, email, password });
      return NextResponse.json({ error: 'Alle Felder sind erforderlich.' }, { status: 400 });
    }

    const existingShelter = await prisma.shelter.findUnique({
      where: { email },
    });

    if (existingShelter) {
      console.warn('⚠️ Shelter bereits vorhanden:', email);
      return NextResponse.json({ error: 'Ein Tierheim mit dieser E-Mail existiert bereits.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Passwort gehasht:', hashedPassword);

    const newShelter = await prisma.shelter.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    console.log('✅ Shelter erfolgreich erstellt:', newShelter);

    return NextResponse.json({ message: 'Shelter erfolgreich registriert!', shelter: newShelter });
  } catch (err) {
    console.error('❌ [SHELTER_REGISTER_ERROR]', err.message, err);
    return NextResponse.json({ error: 'Serverfehler bei der Registrierung!' }, { status: 500 });
  }
}
