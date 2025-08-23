'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function EditAnimalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)

  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [message, setMessage] = useState(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/shelter/login')
    if (status === 'authenticated' && session.user.role !== 'SHELTER') {
      router.push('/')
    }

    const fetchAnimal = async () => {
      const res = await fetch(`/api/animals/${id}`)
      const data = await res.json()
      if (res.ok && data) {
        const animal = data.animal

        const ageFromBirth = birth => {
          const birthDate = new Date(birth)
          const now = new Date()
          const years = now.getFullYear() - birthDate.getFullYear()
          const months = now.getMonth() - birthDate.getMonth() + years * 12
          return {
            age: months >= 12 ? years : 0,
            ageMonths: months < 12 ? months : null,
          }
        }

        const { age, ageMonths } = ageFromBirth(animal.birthDate)

        setForm({
          ...animal,
          birthDate: animal.birthDate?.slice(0, 10),
          age,
          ageMonths,
        })

        setLoading(false)
      } else {
        alert('Tier nicht gefunden oder Zugriff verweigert.')
        router.push('/shelter/dashboard')
      }
    }

    if (status === 'authenticated') {
      fetchAnimal()
    }
  }, [status])

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    const val = type === 'checkbox' ? checked : value
    const updatedForm = { ...form, [name]: val }

    if (name === 'birthDate') {
      const birth = new Date(value)
      const now = new Date()
      const years = now.getFullYear() - birth.getFullYear()
      const months = (now.getMonth() - birth.getMonth()) + years * 12
      updatedForm.age = months >= 12 ? years : 0
      updatedForm.ageMonths = months < 12 ? months : null
    }

    setForm(updatedForm)
  }

  const handleFileChange = (e, setter, multiple = false) => {
    if (multiple) {
      setter(Array.from(e.target.files))
    } else {
      setter(e.target.files[0])
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setMessage(null)

    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value)
      }
    })

    images.forEach(img => formData.append('images', img))
    videos.forEach(vid => formData.append('videos', vid))

    const res = await fetch(`/api/animals/${id}`, {
      method: 'PATCH',
      body: formData,
    })

    const data = await res.json()

    if (res.ok) {
      alert('Tier erfolgreich aktualisiert.')
      router.push('/shelter/dashboard')
    } else {
      alert(`Fehler: ${data.error}`)
    }
  }

  const handleDelete = async () => {
    const confirmed = confirm('Bist du sicher, dass du dieses Tier löschen möchtest?')
    if (!confirmed) return

    const res = await fetch(`/api/animals/${id}`, {
      method: 'DELETE',
    })

    const data = await res.json()

    if (res.ok) {
      alert('Tier erfolgreich gelöscht.')
      router.push('/shelter/dashboard')
    } else {
      alert(`Fehler beim Löschen: ${data.error}`)
    }
  }

  if (loading || !form) return <p>Lade Tierdaten...</p>

  return (
    <div className="bd-container flex flex-col gap-[3rem] !my-[5rem] bg-(--secondary-color) rounded-[1rem] p-[2rem]">
      <h2>Tier bearbeiten</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-[1fr_2.5fr] gap-[3rem]">

          {/* Bild/Video-Upload */}
          <div className="grid grid-rows-[1fr_1fr] gap-[1rem] h-[100%]">
            <div>
              <label htmlFor="animal-more-img">Weitere Bilder (optional)</label>
              <label htmlFor="animal-more-img" className="bg-(--accent-color) h-[calc(100%-1rem)] p-[1rem] cursor-pointer rounded-[1rem] flex items-center justify-center">+</label>
              <input id="animal-more-img" className="hidden" type="file" multiple accept="image/*" onChange={e => handleFileChange(e, setImages, true)} />
            </div>
            <div>
              <label htmlFor="animal-more-vid">Videos (optional)</label>
              <label htmlFor="animal-more-vid" className="bg-(--accent-color) h-[calc(100%-1rem)] p-[1rem] cursor-pointer rounded-[1rem] flex items-center justify-center">+</label>
              <input id="animal-more-vid" className="hidden" type="file" multiple accept="video/*" onChange={e => handleFileChange(e, setVideos, true)} />
            </div>
          </div>

          {/* Textfelder */}
          <div className="grid grid-cols-4 gap-[2rem]">
            {[
              ['Name *', 'name'],
              ['Tierart *', 'species'],
              ['Rasse *', 'breed'],
            ].map(([label, name]) => (
              <div key={name} className="flex flex-col gap-[0.5rem]">
                <label>{label}</label>
                <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' name={name} value={form[name]} onChange={handleChange} required />
              </div>
            ))}

            <div className="flex flex-col gap-[0.5rem]">
              <label>Geschlecht *</label>
              <select className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Bitte wählen…</option>
                <option value="MAENNLICH">Männlich</option>
                <option value="WEIBLICH">Weiblich</option>
              </select>
            </div>

            <div className="flex flex-col gap-[0.5rem]">
              <label>Geburtsdatum *</label>
              <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' type="date" name="birthDate" value={form.birthDate} onChange={handleChange} required />
              <p className="text-sm">
                Alter: {form.age === 0 ? `${form.ageMonths || 'unter'} Monat(e)` : `${form.age} Jahr${form.age === 1 ? '' : 'e'}`}
              </p>
            </div>

            <div className="flex flex-col gap-[0.5rem]">
              <label>Größe *</label>
              <select className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' name="size" value={form.size} onChange={handleChange} required>
                <option value="">Bitte wählen…</option>
                <option value="KLEIN">Klein</option>
                <option value="MITTEL">Mittel</option>
                <option value="GROSS">Groß</option>
              </select>
            </div>

            <div className="flex flex-col gap-[0.5rem]">
              <label>Adoptionsgebühr</label>
              <input type="number" step="0.01" name="adoptionFee" value={form.adoptionFee || ''} onChange={handleChange} className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' />
            </div>

            {/* Checkboxes */}
            {[
              ['Notfall', 'isEmergency'],
              ['Kastriert', 'isNeutered'],
              ['Für Senioren', 'isForSeniors'],
              ['Für Anfänger', 'isForBeginners'],
              ['Für Profis', 'isForExperienced'],
              ['Für Familien', 'isFamilyFriendly'],
              ['Mit Katzen', 'goodWithCats'],
              ['Mit Hunden', 'goodWithDogs'],
              ['Mit Kindern', 'goodWithChildren']
            ].map(([label, name]) => (
              <label key={name} className="flex justify-between items-center col-span-2">
                {label}
                <input type="checkbox" name={name} checked={form[name] || false} onChange={handleChange} />
              </label>
            ))}

            <div className="flex flex-col gap-[0.5rem] col-span-4">
              <label>Beschreibung *</label>
              <textarea className='bg-white p-[8px_16px] rounded-[1rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' name="description" value={form.description} onChange={handleChange} rows={4} required />
            </div>

            <div className="col-span-4 flex flex-col gap-4">
              <button type="submit" className="global-btn-bg h-fit">Änderungen speichern</button>
              <button
                type="button"
                className="global-btn-bg !bg-red-500"
                onClick={handleDelete}
              >
                Tier löschen
              </button>
              {message && <p className="mt-2">{message}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
