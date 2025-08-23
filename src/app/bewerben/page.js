'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

export default function ShelterRequestPage() {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    setStatus(null)

    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      const res = await fetch('/api/shelter-request', {
        method: 'POST',
        body: formData,
      })

      const result = await res.json()

      if (res.ok) {
        setStatus({ type: 'success', message: 'Vielen Dank für deine Anfrage! Wir melden uns bald.' })
        reset()
        setFiles([])
      } else {
        setStatus({ type: 'error', message: result.error || 'Fehler beim Versenden.' })
      }
    } catch {
      setStatus({ type: 'error', message: 'Serverfehler. Bitte später erneut versuchen.' })
    }
  }

  const handleFileChange = e => {
    setFiles(Array.from(e.target.files))
  }

  return (
    <div className="bd-container bg-(--secondary-color) rounded-[1rem] p-[2rem] !my-[5rem] flex flex-col gap-[2rem] text-[0.7rem]">
      <h2>Als Tierheim bewerben</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[2rem]" encType="multipart/form-data">
        <div className="grid grid-cols-2 gap-[2rem]">

          {/* Name */}
          <div className='flex flex-col gap-[0.5rem]'>
            {errors.name && <p className="error">{errors.name.message}</p>}
            <label>Name *</label>
            <input
              {...register('name', { required: 'Name ist erforderlich' })}
              className="bg-white p-[8px_16px] rounded-[90px] shadow"
            />
          </div>

          {/* Email */}
          <div className='flex flex-col gap-[0.5rem]'>
            {errors.email && <p className="error">{errors.email.message}</p>}
            <label>E-Mail *</label>
            <input
              type="email"
              {...register('email', {
                required: 'E-Mail ist erforderlich',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Ungültige E-Mail-Adresse',
                },
              })}
              className="bg-white p-[8px_16px] rounded-[90px] shadow"
            />
          </div>

          {/* Website */}
          <div className='flex flex-col gap-[0.5rem]'>
            <label>Website (optional)</label>
            <input
              {...register('website')}
              className="bg-white p-[8px_16px] rounded-[90px] shadow"
            />
          </div>

          {/* Straße */}
          <div className='flex flex-col gap-[0.5rem]'>
            <label>Straße</label>
            <input
              {...register('street')}
              className="bg-white p-[8px_16px] rounded-[90px] shadow"
            />
          </div>

          {/* Hausnummer */}
          <div className='flex flex-col gap-[0.5rem]'>
            <label>Hausnummer</label>
            <input
              {...register('houseNumber')}
              className="bg-white p-[8px_16px] rounded-[90px] shadow"
            />
          </div>

          {/* PLZ */}
          <div className='flex flex-col gap-[0.5rem]'>
            <label>PLZ</label>
            <input
              {...register('postalCode')}
              className="bg-white p-[8px_16px] rounded-[90px] shadow"
            />
          </div>

          {/* Ort */}
          <div className='flex flex-col gap-[0.5rem]'>
            <label>Ort</label>
            <input
              {...register('city')}
              className="bg-white p-[8px_16px] rounded-[90px] shadow"
            />
          </div>
        </div>

        {/* Nachricht */}
        <div className='flex flex-col gap-[0.5rem]'>
          {errors.message && <p className="error">{errors.message.message}</p>}
          <label>Nachricht *</label>
          <textarea
            {...register('message', { required: 'Nachricht ist erforderlich' })}
            className="bg-white p-[8px_16px] rounded-[1rem] shadow"
            rows={4}
          />
        </div>

        {/* Nachweise */}
        <div className='flex flex-col gap-[0.5rem]'>
          <label>Nachweise (optional):</label>
          <input
            type="file"
            multiple
            accept=".pdf,image/*"
            onChange={handleFileChange}
            className="bg-white p-[8px_16px] rounded-[1rem] shadow"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="global-btn-bg" disabled={isSubmitting}>
          {isSubmitting ? 'Senden...' : 'Anfrage senden'}
        </button>

        {/* Statusmeldung */}
        {status && (
          <p className={`mt-2 ${status.type === 'success' ? '!text-green-600' : '!text-red-600'}`}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  )
}
