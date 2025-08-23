'use client'

import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRef } from 'react'

const fetcher = url => fetch(url).then(res => res.json())

export default function ChatPage() {
  const params = useParams()
  const chatId = params.id
  const [newMessage, setNewMessage] = useState('')
  const { data: session } = useSession()
 const scrollContainerRef = useRef(null)




  const {
    data,
    mutate,
    isLoading,
    error
  } = useSWR(`/api/chat/${chatId}/messages`, fetcher, { refreshInterval: 3000 })

  useEffect(() => {
  if (chatId) {
    fetch(`/api/chat/${chatId}/read`, {
      method: 'PATCH',
    })
  }
}, [chatId])

useEffect(() => {
  if (scrollContainerRef.current) {
    requestAnimationFrame(() => {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    })
  }
}, [data?.messages])






  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const res = await fetch(`/api/chat/${chatId}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ content: newMessage }),
    })

    if (res.ok) {
      setNewMessage('')
      mutate()
    }
  }

  if (isLoading) return <p>Lade Nachrichten...</p>
  if (error) return <p>Fehler beim Laden der Nachrichten</p>

  const chat = data.chat
  const messages = data.messages || []

  return (
    <div className="bd-container rounded-[1rem] p-[2rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)] !mb-[5rem] !mt-[2rem] flex flex-col gap-[2rem] max-h-[70vh]">
      {/* Zusatzinfos */}
      {chat?.animal && (
        <h2 style={{ marginBottom: '0.5rem' }}>
          Anfrage zu <Link className="!text-[3.2rem] text-(--primary-color)" href={`/animals/profile/${chat.animal.id}`}>
            {chat.animal.name}
          </Link>
        </h2>
      )}

      {session?.user?.role === 'USER' && chat?.shelter && (
        <p>Tierheim: <Link href={`/shelter/dashboard/${chat.shelter.id}`}>{chat.shelter.name}</Link></p>
      )}

      {session?.user?.role === 'SHELTER' && chat?.user && (
        <p>Interessent: <strong>{chat.user.name}</strong></p>
      )}

      {/* Nachrichtenliste */}
      <div className='flex flex-col gap-[1rem] overflow-y-auto p-[1rem] border rounded-[1rem]' ref={scrollContainerRef}>

        {messages.length === 0 ? (
          <p>Noch keine Nachrichten</p>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId === session?.user?.id

            return (
              <div
                key={msg.id}
                className={`
                  max-w-[70%] p-3 rounded-[1rem]
                  ${isOwn ? 'self-end bg-(--accent-color) !text-white text-right' : 'self-start bg-white !text-black text-left shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'}
                `}
              >
                 <p className={isOwn ? '!text-black !text-left' : 'text-black'}>{msg.content}</p>
                <small className='text-gray-400 hidden'>
                  {new Date(msg.createdAt).toLocaleString('de-DE')}
                </small>
              </div>
            )
          })
        )}
      </div>

      {/* Nachricht senden */}
      <form onSubmit={sendMessage} className='flex gap-[0.5rem]'>
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Nachricht schreiben..."
          className='bg-white w-[100%] p-[8px_16px] rounded-[1rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'
        />
        <button type="submit" className="global-btn">Senden</button>
      </form>
    </div>
  )
}
