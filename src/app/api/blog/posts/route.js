import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const categories = searchParams.getAll('category')
    const search = searchParams.get('q')?.trim()

    const where = {}

    if (categories.length > 0) {
      where.categories = {
        some: {
          category: { in: categories },
        },
      }
    }

    if (search) {
      where.title = {
        contains: search, 
      }
    }

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        categories: true,
        author: true,
      },
    })

    return NextResponse.json(posts)
  } catch (err) {
    console.error('[BLOG_FETCH_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Laden der Blogposts.' }, { status: 500 })
  }
}
