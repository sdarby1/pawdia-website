'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function StartChatButton({ shelterId, animalId }) {
  const router = useRouter()
  const { status } = useSession()

  const handleStartChat = async () => {
    if (status !== 'authenticated') {
      router.push('/login')
      return
    }

    const res = await fetch('/api/chat/start', {
      method: 'POST',
      body: JSON.stringify({ shelterId, animalId }), 
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await res.json()
    if (res.ok && data.chat) {
      router.push(`/chat/${data.chat.id}`)
    } else {
      alert(data.error || 'Fehler beim Starten des Chats')
    }
  }
  console.log('Starte Chat mit:', { shelterId, animalId })


  return (
    <button onClick={handleStartChat} className="global-btn-bg mt-[2rem]">
      Chat starten
    </button>
  )
}
