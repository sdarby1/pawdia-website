import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const total = await prisma.blogPost.count()

    if (total === 0) return NextResponse.json({ posts: [], total: 0 })

    const skip = Math.max(0, Math.floor(Math.random() * Math.max(1, total - 3)))

    const posts = await prisma.blogPost.findMany({
      take: 3,
      skip,
      orderBy: { createdAt: 'desc' }, 
    })

    return NextResponse.json({ posts, total })
  } catch (err) {
    console.error('[RANDOM_POST_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Laden der Posts' }, { status: 500 })
  }
}
