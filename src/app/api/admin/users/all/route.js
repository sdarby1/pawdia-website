import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return new Response(JSON.stringify({ error: 'Nicht autorisiert.' }), {
      status: 401,
    })
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return new Response(JSON.stringify({ users }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[ADMIN_USERS_ERROR]', err)
    return new Response(JSON.stringify({ error: 'Fehler beim Laden der Nutzer.' }), {
      status: 500,
    })
  }
}
