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
    const userId = decoded.id;

    const { animalId } = await req.json();

    if (!animalId) {
      return NextResponse.json({ error: 'Tier-ID fehlt.' }, { status: 400 });
    }

    
    await prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          connect: { id: animalId },
        },
      },
    });

    return NextResponse.json({ message: 'Tier wurde zu deinen Favoriten hinzugefügt.' });
  } catch (error) {
    console.error('[FAVORITE_ADD_ERROR]', error);
    return NextResponse.json({ error: 'Fehler beim Hinzufügen zu Favoriten.' }, { status: 500 });
  }
}
