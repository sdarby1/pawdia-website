import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
  const { id: shelterId } = params;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "ADMIN") {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 403 });
  }

  try {
    await prisma.shelter.delete({
      where: { id: shelterId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[ADMIN_DELETE_SHELTER_ERROR]", err);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Tierheims." },
      { status: 500 }
    );
  }
}
