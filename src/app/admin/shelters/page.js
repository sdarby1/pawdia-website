'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminShelterOverviewPage() {
  const [shelters, setShelters] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [message, setMessage] = useState(null)

  const fetchShelters = async () => {
    const res = await fetch('/api/admin/shelters/all')
    const data = await res.json()
    setShelters(data.shelters || [])
  }

  useEffect(() => {
    fetchShelters()
  }, [])

  useEffect(() => {
    let results = [...shelters]

    if (search.trim()) {
      const term = search.toLowerCase()
      results = results.filter(
        (s) =>
          s.name.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term)
      )
    }

    switch (filter) {
      case 'verified':
        results = results.filter((s) => s.isVerified)
        break
      case 'unverified':
        results = results.filter((s) => !s.isVerified)
        break
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
  }, [search, filter, shelters])

  const handleVerify = async (id) => {
    const res = await fetch('/api/admin/shelters/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shelterId: id }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage('Shelter verifiziert.')
      await fetchShelters()
    } else {
      setMessage(`Fehler: ${data.error}`)
    }

    setTimeout(() => setMessage(null), 3000)
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Soll das Tierheim "${name}" wirklich gelöscht werden?`)) return

    const res = await fetch(`/api/admin/shelters/${id}/delete`, {
      method: 'DELETE',
    })

    const data = await res.json()

    if (res.ok) {
      setMessage(`Tierheim "${name}" gelöscht.`)
      await fetchShelters()
    } else {
      setMessage(`Fehler: ${data.error}`)
    }

    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <div className="bd-container !my-[5rem]">
      <h2 className="!mb-[2rem]">Übersicht aller Tierheime</h2>

      {message && <p>{message}</p>}

      <div className="bg-[#B1D4A5] rounded-t-[1rem] p-[1rem] pb-[2rem] flex gap-[1rem]">
        <input
          type="text"
          placeholder="Suche nach Name oder E-Mail"
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
          <option value="verified">Nur verifizierte</option>
          <option value="unverified">Nur nicht verifizierte</option>
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        {filtered.length > 0 ? (
          <table className="shelter-table rounded-[1rem] border-separate border-spacing-y-[1rem] bg-(--accent-color) p-[1rem] min-w-[800px]">
            <thead>
              <tr className="text-(--primary-color)">
                <th>Name</th>
                <th>E-Mail</th>
                <th>Erstellt am</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody className="gap-[1rem]">
              {filtered.map((s) => (
                <tr key={s.id} className="bg-white rounded-[90px]">
                  <td className="rounded-l-[90px]">
                    <Link href={`/shelter/profile/${s.id}`}>{s.name}</Link>
                  </td>
                  <td>{s.email}</td>
                  <td>{new Date(s.createdAt).toLocaleDateString('de-DE')}</td>
                  <td>
                    {s.isVerified ? '✅ Verifiziert' : '❌ Nicht verifiziert'}
                  </td>
                <td className="rounded-r-[90px] overflow-hidden">
                  <div className="flex gap-2 px-3">
                    {!s.isVerified && (
                      <button
                        onClick={() => handleVerify(s.id)}
                        className="global-btn"
                      >
                        Verifizieren
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
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
          <p>Keine Tierheime gefunden.</p>
        )}
      </div>
    </div>
  )
}
