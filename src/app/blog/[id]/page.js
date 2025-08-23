'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function BlogPostPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/blog/${id}`)
      const data = await res.json()
      if (res.ok) setPost(data)
    }

    if (id) fetchPost()
  }, [id])

  if (!post) return <p>Loading...</p>

  return (
    <div className="bd-container flex flex-col gap-[5rem] !mb-[5rem]">

    <div className='flex flex-col gap-[1rem]'>
        {post.coverImage && (
          <img src={post.coverImage} alt="Cover" className="aspect-1152/536 rounded-[1rem] object-cover" />
        )}
        <div className="flex gap-[1rem] items-center justify-center flex-wrap">
          {post.categories.map(cat => (
            <p key={cat.id} className="bg-(--accent-color) p-[8px_16px] rounded-[90px]">
              {cat.category === 'TIERSCHUTZ' ? 'Tierschutz' : cat.category === 'AKTUELLES' ? 'Aktuelles' : cat.category === 'KATZEN' ? 'Katzen'  : cat.category === 'HUNDE' ? 'Hunde' : cat.category  === 'ERNAEHRUNG' ? 'Ernährung' : cat.category === 'ADOPTION' ? 'Adoption' : cat.category }
            </p>
          ))}
          <p className="">Autor: {post.author?.name || 'Unbekannt'}</p>
        </div>
      </div>

      <div className='flex flex-col gap-[2rem]'>
      <h1 className="max-w-[1000px]">{post.title}</h1>
      {post.subheadline && <h2 className="max-w-[1000px]">{post.subheadline}</h2>}

        {post.blocks.map(block => {
          switch (block.type) {
            case 'HEADING':
              return <h3 key={block.id} className="max-w-[1000px]">{block.content}</h3>
            case 'PARAGRAPH':
              return <p className='max-w-[1000px]' key={block.id}>{block.content}</p>
            case 'IMAGE':
              return <img key={block.id} src={block.content} alt="" className="aspect-1152/536 rounded-[1rem] object-cover" />
            default:
              return null
          }
        })}
    </div>
    </div>
  )
}
