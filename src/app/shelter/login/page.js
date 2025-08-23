'use client'

import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

export default function ShelterLoginForm() {
  const router = useRouter()
  const [error, setError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    setError(null)

    const res = await signIn('shelter-login', {
      redirect: false,
      email: data.email,
      password: data.password,
    })

    if (res.ok) {
      router.push('/shelter/dashboard')
    } else {
      setError('Login fehlgeschlagen')
    }
  }

  return (
    <div className="bd-container grid !grid-cols-[auto_1fr] gap-[8rem] pt-[2rem] pb-[5rem]">
      <div className="flex flex-col gap-[3rem] items-center">
        <h1 className="text-center">Tierheim<br />Anmeldung</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
          {error && <p className="error">{error}</p>}

          <input
            type="email"
            placeholder="E-Mail"
            {...register('email', {
              required: 'E-Mail ist erforderlich',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Ungültige E-Mail-Adresse',
              },
            })}
          />
          {errors.email && <p className="error">{errors.email.message}</p>}

          <input
            type="password"
            placeholder="Passwort"
            {...register('password', {
              required: 'Passwort ist erforderlich',
              minLength: {
                value: 6,
                message: 'Mindestens 6 Zeichen',
              },
            })}
          />
          {errors.password && <p className="error">{errors.password.message}</p>}

          <button type="submit" className="xl:!w-100 global-btn-bg" disabled={isSubmitting}>
            {isSubmitting ? 'Lädt...' : 'Einloggen'}
          </button>
        </form>
      </div>

      <div className="w-[100%] h-[100%] flex items-align justify-center">
        <img className="w-[65%]" src="/images/signIn/allAnimals.svg" />
      </div>
    </div>
  )
}
