'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Check if cookie is already set
    const cookieConsent = document.cookie
      .split('; ')
      .find(row => row.startsWith('pawdiaCookieConsent='))
    if (!cookieConsent) {
      setVisible(true)
    }
  }, [])

  const handleChoice = (accepted) => {
    // Set cookie with 365-day expiry
    const date = new Date()
    date.setFullYear(date.getFullYear() + 1)
    document.cookie = `pawdiaCookieConsent=${accepted ? 'accepted' : 'declined'}; expires=${date.toUTCString()}; path=/`
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-[0.5rem] right-[0.5rem] max-w-[550px] shadow-[0px_0px_4px_rgba(0,0,0,0.4)] p-[1rem] flex flex-col gap-[1rem] rounded-[1rem] bg-white z-[10000]">
      <div className='flex gap-[1rem] items-center'>
        <img src="/images/logo/Logo.svg" className='h-[45px]'></img>
        <h4>Einstellungen verwalten</h4>
      </div>
      <p className='!text-[0.7rem]'>
        Um dir ein optimales Erlebnis zu bieten, verwenden wir Technologien wie Cookies, um Geräteinformationen zu speichern und/oder darauf zuzugreifen. Wenn du diesen Technologien zustimmst, können wir Daten wie das Surfverhalten oder eindeutige IDs auf dieser Website verarbeiten. Wenn du deine Einwillligung nicht erteilst oder zurückziehst, können bestimmte Merkmale und Funktionen beeinträchtigt werden.{' '}
      </p>
      <div className="flex gap-[0.5rem] justify-center">
                <button
          onClick={() => handleChoice(true)}
          className="global-btn-bg !w-full"
        >
          Verstanden
        </button>
        <button
          onClick={() => handleChoice(false)}
          className="global-btn !w-full"
        >
          Ablehnen
        </button>

      </div>
      <div className='flex gap-[0.5rem] justify-center'>
        <Link className='!text-[0.6rem] underline' href="/datenschutz">Datenschutz</Link>
        <Link className='!text-[0.6rem] underline' href="/impressum">Impressum</Link>
      </div>
    </div>
  )
}
