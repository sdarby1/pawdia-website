'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const allCategories = ['TIERSCHUTZ', 'AKTUELLES', 'HUNDE', 'KATZEN', 'ERNAEHRUNG', 'ADOPTION']

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [search, setSearch] = useState('')

  const categoryLabels = {
  TIERSCHUTZ: 'Tierschutz',
  AKTUELLES: 'Aktuelles',
  HUNDE: 'Hunde',
  KATZEN: 'Katzen',
  ERNAEHRUNG: 'Ernährung',
  ADOPTION: 'Adoption',
}

const allCategories = Object.keys(categoryLabels)


  useEffect(() => {
    const fetchPosts = async () => {
      const params = new URLSearchParams()
      selectedCategories.forEach(cat => params.append('category', cat))
      if (search.trim()) params.append('q', search)

      const res = await fetch(`/api/blog/posts?${params.toString()}`)
      const data = await res.json()
      setPosts(data)
    }

    fetchPosts()
  }, [selectedCategories, search])

  const toggleCategory = category => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  function formatDate(dateString) {
    return new Intl.DateTimeFormat('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  }

  return (
    <>
      <div className='px-[1rem]'>
        <div className='video-wrapper !h-[60vh]'>
          <div className='video-overlay'></div>
          <video className='bg-video' src="/videos/home/background-2.mp4" autoPlay loop muted playsInline></video>
          <div className="w-[1280px] bd-container">
            <div className="home-start-container">
              <h1 className='!text-white'>Möchtest du ein<br /> Haustier adoptieren?</h1>
              <h3 className='!text-white'>Alles rund um Haustiere<br /> – entdecke unseren Blog!</h3>
              <div className="flex gap-[0.5rem] xl:flex-row flex-col">
                <Link className="global-btn-bg !bg-white !text-black" href="/">Jetzt Tiere entdecken</Link>
                <Link className="global-btn !border-white !text-white" href="#benefits">Mehr erfahren</Link>
              </div>
            </div>
          </div>

          {/* Suchfeld */}
          <div className='home-search-ct gap-[1rem] hidden xl:flex'>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className='bg-(--accent-color) !w-full'
              placeholder='Nach einem Artikel suchen'
            />
            <button
              type='button'
              onClick={() => setSearch(search.trim())}
              className='bg-(--primary-color) rounded-[90px] p-[12px] cursor-pointer'
            >
              <img src="/images/home/Suche.svg" />
            </button>
          </div>
        </div>
      </div>

      <div className="bd-container flex flex-col gap-[3.5rem] py-[3rem] xlpy-[5rem] items-center">
        {/* Kategorie-Filter */}
        <div className="flex flex-wrap gap-3">
        {allCategories.map(cat => (
          <button
            key={cat}
            className={`global-btn ${
              selectedCategories.includes(cat)
                ? 'bg-(--primary-color) !text-white'
                : 'bg-white text-(--primary-color)'
            }`}
            onClick={() => toggleCategory(cat)}
          >
            {categoryLabels[cat]}
          </button>
        ))}

        </div>

        {/* Blogposts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem]">
          {posts.map(post => (
            <div
              key={post.id}
              className="rounded-[1rem] p-4 bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] flex flex-col gap-[1rem] justify-between"
            >
              <div className='flex flex-col gap-[1rem]'>
                <img
                  src={post.coverImage}
                  className='rounded-[1rem] aspect-368/209 object-cover'
                  alt={post.title}
                />
                <p className="!text-[14px]">{formatDate(post.createdAt)}</p>
                <h4>{post.title}</h4>
              </div>
              <Link href={`/blog/${post.id}`} className="global-btn">Lesen</Link>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
