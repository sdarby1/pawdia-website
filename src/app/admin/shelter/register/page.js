'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminShelterCreatePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    postalCode: '',
  })
  const [message, setMessage] = useState(null)
  const router = useRouter()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage(null)

    const res = await fetch('/api/shelter/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage({ type: 'success', text: 'Tierheim erfolgreich angelegt.' })
      setForm({ name: '', email: '', password: '', postalCode: '' })
    } else {
      setMessage({ type: 'error', text: `Fehler: ${data.error}` })
    }
  }

  return (
    <div className="bd-container !my-[5rem] bg-(--secondary-color) p-[2rem] rounded-[1rem] flex flex-col gap-[2rem]">
      <h2>Neues Tierheim registrieren</h2>

      {message && (
        <p
          className={`${
            message.type === 'success' ? '!text-green-500' : '!text-red-500'
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[2rem]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[1rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <label>Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name des Tierheimes"
              required
              className="bg-white rounded-[90px] p-[8px_16px] w-fit"
            />
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            <label>E-Mail *</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-Mail"
              type="email"
              required
              className="bg-white rounded-[90px] p-[8px_16px] w-fit"
            />
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            <label>Passwort *</label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Passwort"
              type="password"
              required
              className="bg-white rounded-[90px] p-[8px_16px] w-fit"
            />
          </div>

          <div className="flex flex-col gap-[0.5rem]">
            <label>Postleitzahl *</label>
            <input
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Postleitzahl"
              required
              pattern="\d{5}"
              className="bg-white rounded-[90px] p-[8px_16px] w-fit"
            />
          </div>
        </div>
        <button type="submit" className="global-btn">
          Registrieren
        </button>
      </form>
    </div>
  )
}
