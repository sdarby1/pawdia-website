import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token || token.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 403 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get('title')
    const subheadline = formData.get('subheadline')
    const categories = JSON.parse(formData.get('categories') || '[]')
    const blocks = JSON.parse(formData.get('blocks') || '[]')
    const coverImageFile = formData.get('coverImage')

    if (!title || !categories.length || !blocks.length || !coverImageFile?.name) {
      return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })
    }

    const bytes = await coverImageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = coverImageFile.name.split('.').pop()?.toLowerCase() || 'png'
    const filename = `cover-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const uploadDir = path.join(process.cwd(), 'uploads', 'blog')
    await mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    const coverImage = `/uploads/blog/${filename}`

    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        subheadline,
        coverImage,
        author: { connect: { id: token.id } },
        categories: {
          create: categories.map(cat => ({ category: cat })),
        },
        blocks: {
          create: blocks.map((block, index) => ({
            type: block.type,
            content: block.content,
            order: index,
          })),
        },
      },
      include: {
        categories: true,
        blocks: true,
      },
    })

    return NextResponse.json({
        message: 'Blogpost erfolgreich erstellt',
        blogPost,
        coverImage,
        redirectUrl: `/blog/${blogPost.id}`
      })

  } catch (err) {
    console.error('[BLOG_CREATE_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Blogposts' }, { status: 500 })
  }
}
