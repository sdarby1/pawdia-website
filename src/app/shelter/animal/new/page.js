'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AnimalCreatePage() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    species: '',
    breed: '',
    gender: '',
    birthDate: '',
    age: '',
    ageMonths: null,
    size: '',
    isFamilyFriendly: false,
    isForExperienced: false,
    isEmergency: false,
    isForBeginners: false,
    isForSeniors: false,
    adoptionFee: false,
    goodWithCats: false,
    goodWithDogs: false,
    goodWithChildren: false,
    isNeutered: false,
    description: '',
  })

  const [coverImage, setCoverImage] = useState(null)
  const [images, setImages] = useState([])
  const [videos, setVideos] = useState([])
  const [message, setMessage] = useState(null)

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
      formData.append(key, value)
    })

    if (coverImage) formData.append('coverImage', coverImage)
    images.forEach((img, i) => formData.append('images', img))
    videos.forEach((vid, i) => formData.append('videos', vid))

    const res = await fetch('/api/animals/new', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })

    const data = await res.json()
    if (res.ok) {
      setMessage('Tier erfolgreich hinzugefügt.')
      setForm({
        name: '',
        species: '',
        breed: '',
        gender: '',
        birthDate: '',
        age: '',
        ageMonths: null,
        size: '',
        isFamilyFriendly: false,
        isForExperienced: false,
        isEmergency: false,
        isForBeginners: false,
        isForSeniors: false,
        goodWithCats: false,
        goodWithDogs: false,
        goodWithChildren: false,
        isNeutered: false,
        description: '',
      })
      setCoverImage(null)
      setImages([])
      setVideos([])
      router.refresh()
    } else {
      setMessage(`Fehler: ${data.error}`)
    }
  }

  return (
    <div className="bd-container flex flex-col gap-[3rem] !my-[5rem] bg-(--secondary-color) rounded-[1rem] p-[2rem]">
      <h2>Neues Tier hinzufügen</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_2.5fr] gap-[3rem]">

          {/* Bild/Video-Upload */}
          <div className="grid grid-rows-[1fr_1fr] gap-[2rem] h-[100%]">
            <div className=''>
              <label htmlFor='cover-img'>Coverbild hinzufügen *</label>
              <label htmlFor="cover-img" className='bg-(--accent-color) h-[calc(100%-1.5rem)] cursor-pointer rounded-[1rem] flex items-center justify-center'> + </label>
              <input id="cover-img" className='text-[0.6rem]' type="file" accept="image/*" required onChange={e => handleFileChange(e, setCoverImage)} />
            </div>
            <div className=''>
              <label htmlFor='animal-more-img'>Weitere Bilder</label>
              <label htmlFor="animal-more-img" className='bg-(--accent-color) h-[calc(100%-1.5rem)] p-[1rem] cursor-pointer rounded-[1rem] flex items-center justify-center'>+</label>
              <input id="animal-more-img" className='text-[0.6rem]' type="file" multiple accept="image/*" onChange={e => handleFileChange(e, setImages, true)} />
            </div>
            <div className='pb-[2rem]'>
              <label htmlFor='animal-more-vid'>Videos</label>
              <label htmlFor="animal-more-vid" className='bg-(--accent-color) h-[100%] p-[1rem] cursor-pointer rounded-[1rem] flex items-center justify-center'>+</label>
              <input id="animal-more-vid" className='text-[0.6rem]' type="file" multiple accept="video/*" onChange={e => handleFileChange(e, setVideos, true)} />
            </div>
          </div>

          {/* Textfelder */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-[2rem]">

            <div className="flex flex-col gap-[0.5rem]">
              <label>Name *</label>
              <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' name="name" value={form.name} onChange={handleChange} required />
            </div>

              <div className="flex flex-col gap-[0.5rem]">
              <label>Tierart *</label>
              <select
                className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'
                name="species"
                value={form.species}
                onChange={handleChange}
                required
              >
                <option value="">Bitte wählen…</option>
                <option value="Hund">Hund</option>
                <option value="Katze">Katze</option>
                <option value="Vogel">Vogel</option>
                <option value="Kleintier">Kleintier</option>
              </select>
            </div>

            <div className="flex flex-col gap-[0.5rem]">
              <label>Rasse *</label>
              <input className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' name="breed" value={form.breed} onChange={handleChange} required />
            </div>

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
              <p className="!text-[1rem]">
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
              <label key={name} className="flex justify-between items-center xl:col-span-2">
                {label}
                <input type="checkbox" name={name} checked={form[name]} onChange={handleChange} />
              </label>
            ))}

            {/* Beschreibung */}
            <div className="flex flex-col gap-[0.5rem] xl:col-span-4">
              <label>Beschreibung *</label>
              <textarea className='bg-white p-[8px_16px] rounded-[1rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]' name="description" value={form.description} onChange={handleChange} rows={4} required />
            </div>

            {/* Button */}
            <div className="col-span-1 xl:col-span-4">
              <button type="submit" className="global-btn-bg h-fit">
                Tier hinzufügen
              </button>
              {message && <p className="mt-2">{message}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
