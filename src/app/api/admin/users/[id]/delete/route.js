import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function DELETE(_req, { params }) {
  const { id: userId } = params;

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new Response(JSON.stringify({ error: "Nicht autorisiert." }), {
      status: 403,
    });
  }

  try {
    await prisma.user.delete({
      where: { id: userId },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("[ADMIN_DELETE_USER_ERROR]", err);
    return new Response(
      JSON.stringify({ error: "Fehler beim Löschen des Users." }),
      { status: 500 }
    );
  }
}
