'use client'

import { useEffect, useState } from 'react'

export default function AdminBlogpostsOverviewPage() {
  const [posts, setPosts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [message, setMessage] = useState(null)

  const fetchPosts = async () => {
    const res = await fetch('/api/admin/blogposts/all')
    const data = await res.json()
    setPosts(data.blogPosts || [])
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    let results = [...posts]

    if (search.trim()) {
      const term = search.toLowerCase()
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          (p.author?.name || p.author?.email || '')
            .toLowerCase()
            .includes(term)
      )
    }

    switch (filter) {
      case 'newest':
        results = results.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        break
      case 'oldest':
        results = results.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
        break
    }

    setFiltered(results)
  }, [search, filter, posts])

  const handleDelete = async (id, title) => {
    if (!confirm(`Soll der Blogpost "${title}" wirklich gelöscht werden?`)) return

    const res = await fetch(`/api/admin/blogposts/${id}`, {
      method: 'DELETE',
    })

    const data = await res.json()

    if (res.ok) {
      setMessage(`Blogpost "${title}" gelöscht.`)
      await fetchPosts()
    } else {
      setMessage(`Fehler: ${data.error}`)
    }

    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="bd-container !my-[5rem]">
      <h2 className="!mb-[2rem]">Übersicht aller Blogposts</h2>

      {message && <p>{message}</p>}

      <div className="bg-[#B1D4A5] rounded-t-[1rem] p-[1rem] pb-[2rem] flex gap-[1rem]">
        <input
          type="text"
          placeholder="Suche nach Titel oder Autor"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white rounded-[90px] p-[8px_16px] text-[0.7rem] w-[100%]"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white rounded-[90px] p-[8px_16px] text-[0.7rem]"
        >
          <option value="all">Alle</option>
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        {filtered.length > 0 ? (
          <table className="shelter-table rounded-[1rem] border-separate border-spacing-y-[1rem] bg-(--accent-color) p-[1rem] min-w-[800px]">
            <thead>
              <tr className="text-(--primary-color)">
                <th>Titel</th>
                <th>Autor</th>
                <th>Erstellt am</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody className="gap-[1rem]">
              {filtered.map((p) => (
                <tr key={p.id} className="bg-white rounded-[90px]">
                  <td className="rounded-l-[90px]">{p.title}</td>
                  <td>{p.author?.name || p.author?.email || '—'}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString('de-DE')}</td>
                  <td className="rounded-r-[90px] overflow-hidden">
                    <div className="flex gap-2 px-3">
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="global-btn-bg !bg-red-500 hover:bg-red-600 text-white"
                      >
                        Löschen
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Keine Blogposts gefunden.</p>
        )}
      </div>
    </div>
  )
}
