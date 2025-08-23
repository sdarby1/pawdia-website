'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function EditShelterProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    website: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    linkedIn: '',
    googleMapsLink: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/shelter/login')
    if (status === 'authenticated' && session.user.role !== 'SHELTER') {
      router.push('/')
    }

    const fetchData = async () => {
      const res = await fetch('/api/shelter/me')
      const data = await res.json()
      if (data?.shelter) {
        setForm(data.shelter)
      }
      setLoading(false)
    }

    if (status === 'authenticated') {
      fetchData()
    }
  }, [status])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('/api/shelter/me/edit', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      alert('Profil erfolgreich aktualisiert.')
      router.push('/shelter/dashboard')
    } else {
      alert('Fehler beim Aktualisieren.')
    }
  }

  if (loading) return <p>Lade Profil...</p>

  return (
    <div className="bd-container p-[2rem] !my-[5rem] bg-(--secondary-color) rounded-[1rem] flex flex-col gap-[2rem]">
      <h2 className="mb-[2rem]">Profil bearbeiten</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-[2rem] gap-y-[1rem]">
        
        <label className='flex flex-col gap-[0.5rem]'>Name
          <input type="text" name="name" className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' value={form.name || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Ansprechpartner
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="text" name="contactPerson" value={form.contactPerson || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>E-Mail
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="email" name="email" value={form.email || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Telefonnummer
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="tel" name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Straße
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="text" name="street" value={form.street || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Hausnummer
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="text" name="houseNumber" value={form.houseNumber || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>PLZ
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="text" name="postalCode" value={form.postalCode || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Stadt
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="text" name="city" value={form.city || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Website
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="url" name="website" value={form.website || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Google Maps Link
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="url" name="googleMapsLink" value={form.googleMapsLink || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Instagram
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="url" name="instagram" value={form.instagram || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>Facebook
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="url" name="facebook" value={form.facebook || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>TikTok
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="url" name="tiktok" value={form.tiktok || ''} onChange={handleChange} />
        </label>

        <label className='flex flex-col gap-[0.5rem]'>LinkedIn
          <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="url" name="linkedIn" value={form.linkedIn || ''} onChange={handleChange} />
        </label>

        <button type="submit" className="global-btn-bg mt-[2rem]">Änderungen speichern</button>
      </form>
    </div>
  )
}
