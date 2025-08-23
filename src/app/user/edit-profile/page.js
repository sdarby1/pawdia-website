'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function EditUserProfilePage() {
  const { status, update } = useSession()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState(null)

  const [form, setForm] = useState({ name: '', email: '' })
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    const load = async () => {
      try {
        const res = await fetch('/api/user/me/edit', { cache: 'no-store' })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Konnte Profil nicht laden.')

        const loadedName = data.user?.name ?? data.user?.username ?? ''
        setForm({ name: loadedName, email: data.user?.email ?? '' })
      } catch (e) {
        setError(e.message || 'Fehler beim Laden.')
      } finally {
        setLoading(false)
      }
    }

    if (status === 'authenticated') load()
  }, [status])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage(null)

    try {
      const res = await fetch('/api/user/me/edit', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Speichern fehlgeschlagen.')

      try {
        await update?.({
          name: data.user?.name ?? form.name,
          email: data.user?.email ?? form.email,
        })
      } catch {}

      setMessage('Profil erfolgreich aktualisiert.')
    } catch (e) {
      setError(e.message || 'Unerwarteter Fehler.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch('/api/user/me/edit', { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Löschen fehlgeschlagen.')

      await signOut({ callbackUrl: '/' })
    } catch (e) {
      setError(e.message || 'Unerwarteter Fehler.')
      setDeleting(false)
    }
  }

  if (loading) return <p>Lade Profildaten...</p>

  return (
    <div className="bd-container flex flex-col gap-[2rem] !my-[5rem] bg-(--secondary-color) rounded-[1rem] p-[2rem]">
      <h2>Profil bearbeiten</h2>

      {error && <div className="text-red-600">{error}</div>}
      {message && <div className="text-green-600">{message}</div>}

      {/* Profilformular */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-[1.5rem]">
        <div className="flex flex-col gap-[0.5rem]">
          <label>Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-white p-[8px_16px] rounded-[90px] shadow"
            placeholder="Dein Name"
          />
        </div>

        <div className="flex flex-col gap-[0.5rem]">
          <label>E-Mail *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-white p-[8px_16px] rounded-[90px] shadow"
            placeholder="name@beispiel.de"
          />
        </div>

        <button type="submit" disabled={saving} className="global-btn">
          {saving ? 'Speichere…' : 'Änderungen speichern'}
        </button>
      </form>


      {/* Account löschen */}
      <h3>Account löschen</h3>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="global-btn-bg !bg-red-600 hover:!bg-red-700 disabled:opacity-60"
      >
        {deleting ? 'Lösche…' : 'Account endgültig löschen'}
      </button>
    </div>
  )
}
