'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ALL_CATEGORIES = ['TIERSCHUTZ', 'AKTUELLES', 'HUNDE', 'KATZEN', 'ERNAEHRUNG', 'ADOPTION']

export default function CreateBlogPostPage() {
  const [blocks, setBlocks] = useState([])
  const [categories, setCategories] = useState([])
  const [message, setMessage] = useState(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm()

  const toggleCategory = cat => {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const addBlock = type => {
    setBlocks(prev => [...prev, { type, content: '' }])
  }

  const updateBlock = (index, content) => {
    const updated = [...blocks]
    updated[index].content = content
    setBlocks(updated)
  }

  const removeBlock = index => {
    setBlocks(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async data => {
    setMessage(null)

    if (categories.length === 0) {
      setMessage('Bitte wähle mindestens eine Kategorie.')
      return
    }

    if (blocks.length === 0) {
      setMessage('Bitte füge mindestens einen Inhaltsblock hinzu.')
      return
    }

    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('subheadline', data.subheadline || '')
    formData.append('coverImage', data.coverImage[0])
    formData.append('categories', JSON.stringify(categories))
    formData.append('blocks', JSON.stringify(blocks))

    const res = await fetch('/api/blog/new', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    const result = await res.json()

    if (res.ok) {
      setMessage('Blogpost erfolgreich erstellt!')
      reset()
      setBlocks([])
      setCategories([])
      router.refresh()
    } else {
      setMessage(`Fehler: ${result.error}`)
    }
  }

  return (
    <div className="bd-container p-[2rem] bg-(--secondary-color) rounded-[1rem] !my-[5rem] flex flex-col gap-[3rem]">
      <h2>Neuen Blogpost erstellen</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[2rem] text-[0.7rem]" encType="multipart/form-data">

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[2rem]">
          {/* Titel */}
          <div className="flex flex-col gap-[0.5rem]">
            {errors.title && <p className="error">{errors.title.message}</p>}
            <label>Titel *</label>
            <input
              {...register('title', { required: 'Titel ist erforderlich' })}
              placeholder="Titel"
              className="rounded-[90px] shadow p-[8px_16px] bg-white"
            />
          </div>

          {/* Subheadline */}
          <div className="flex flex-col gap-[0.5rem]">
            <label>Subheadline</label>
            <input
              {...register('subheadline')}
              placeholder="Subheadline"
              className="rounded-[90px] shadow p-[8px_16px] bg-white"
            />
          </div>

          {/* Titelbild */}
          <div className="flex flex-col gap-[0.5rem]">
            {errors.coverImage && <p className="error">{errors.coverImage.message}</p>}
            <label>Titelbild *</label>
            <input
              type="file"
              accept="image/*"
              {...register('coverImage', { required: 'Titelbild ist erforderlich' })}
              className="rounded-[90px] shadow p-[8px_16px] bg-white"
            />
          </div>

          {/* Kategorien */}
          <div className="flex flex-col gap-[0.5rem]">
            <label>Kategorien *</label>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map(cat => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`global-btn ${
                    categories.includes(cat)
                      ? '!bg-(--primary-color) !text-white'
                      : '!bg-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Inhalt */}
        <div className="flex flex-col gap-[0.5rem]">
          <label>Inhalt *</label>
          <div className="flex flex-col gap-[1rem]">
            {blocks.map((block, index) => (
              <div key={index} className="shadow p-[1rem] rounded-[1rem] relative bg-white">
                <div className="text-sm text-gray-500 mb-1">{block.type}</div>
                {block.type === 'IMAGE' ? (
                  <input
                    className="w-full border"
                    type="text"
                    placeholder="Pfad zum Bild (z. B. /uploads/blog/hund.jpg)"
                    value={block.content}
                    onChange={e => updateBlock(index, e.target.value)}
                  />
                ) : (
                  <textarea
                    className="w-full border-1 rounded-[1rem] p-[1rem]"
                    rows={block.type === 'PARAGRAPH' ? 4 : 2}
                    placeholder={block.type === 'HEADING' ? 'Überschrift' : 'Absatz'}
                    value={block.content}
                    onChange={e => updateBlock(index, e.target.value)}
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="absolute top-1 right-2 text-red-500 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Blöcke hinzufügen */}
          <div className="mt-4 flex gap-2">
            <button type="button" className="global-btn" onClick={() => addBlock('HEADING')}>
              + Überschrift
            </button>
            <button type="button" className="global-btn" onClick={() => addBlock('PARAGRAPH')}>
              + Absatz
            </button>
            <button type="button" className="global-btn" onClick={() => addBlock('IMAGE')}>
              + Bild
            </button>
          </div>
        </div>

        {/* Senden */}
        <div>
          <button type="submit" className="global-btn-bg" disabled={isSubmitting}>
            {isSubmitting ? 'Erstellen...' : 'Erstellen'}
          </button>
          {message && <p className="text-sm !text-green-500 !mt-[1rem]">{message}</p>}
        </div>
      </form>
    </div>
  )
}
