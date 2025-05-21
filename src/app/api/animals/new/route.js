
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const shelterId = decoded.id;

    const {
      name,
      species,
      breed,
      gender,
      birthDate,
      age,
      size,
      isFamilyFriendly,
      isForExperienced,
      isEmergency,
      description,
      coverImage,
      images,
      videos,
    } = await req.json();

    // Pflichtfelder prüfen
    if (!name || !species || !breed || !gender || !birthDate || !age || !size || !description || !coverImage) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen.' }, { status: 400 });
    }

    const newAnimal = await prisma.animal.create({
      data: {
        name,
        species,
        breed,
        gender,
        birthDate: new Date(birthDate),
        age,
        size,
        isFamilyFriendly,
        isForExperienced,
        isEmergency,
        description,
        coverImage,
        images: images ?? [],
        videos: videos ?? [],
        shelter: { connect: { id: shelterId } },
      },
    });

    return NextResponse.json({ message: 'Tier erfolgreich hinzugefügt!', animal: newAnimal });
  } catch (err) {
    console.error('[ANIMAL_CREATE_ERROR]', err);
    return NextResponse.json({ error: 'Serverfehler beim Erstellen des Tiers.' }, { status: 500 });
  }
}
