import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

// 📦 Cloudinary Konfiguration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 🔧 Hilfsfunktion zum Hochladen auf Cloudinary
const uploadToCloudinary = async (file, folder, prefix = '') => {
  const buffer = Buffer.from(await file.arrayBuffer())
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: `pawdia/${folder}`,
        public_id: `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2)}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })
  return uploadResult.secure_url
}

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
    let blocks = JSON.parse(formData.get('blocks') || '[]')
    const coverImageFile = formData.get('coverImage')

    if (!title || !categories.length || !blocks.length || !coverImageFile?.name) {
      return NextResponse.json({ error: 'Fehlende Daten' }, { status: 400 })
    }

    // 🖼️ Coverbild hochladen
    const coverImage = await uploadToCloudinary(coverImageFile, 'blog/cover', 'cover')

    // 🖼️ Bilder in Inhaltsblöcken hochladen
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i]
      if (block.type === 'image' && block.localFileName) {
        const file = formData.get(block.localFileName)
        if (file && file.name) {
          const imageUrl = await uploadToCloudinary(file, 'blog/content', 'block')
          blocks[i].content = imageUrl
        }
      }
    }

    // 📝 Blogpost speichern
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
      redirectUrl: `/blog/${blogPost.id}`,
    })
  } catch (err) {
    console.error('[BLOG_CREATE_ERROR]', err)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Blogposts' }, { status: 500 })
  }
}
