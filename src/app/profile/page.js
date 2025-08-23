'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState([])
  const [chats, setChats] = useState([]) // 🆕
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }

    if (status === 'authenticated') {
      fetch('/api/user/favorites')
        .then(res => res.json())
        .then(data => {
          setFavorites(data.favorites || [])
          setLoading(false)
        })
        .catch(err => {
          console.error('[FAVORITES_LOAD_ERROR]', err)
          setLoading(false)
        })

      fetch('/api/user/chats') // 🆕
        .then(res => res.json())
        .then(data => {
          const sortedChats = [...(data.chats || [])].sort((a, b) => {
            const aDate = a.latestMessage?.[0]?.createdAt || a.updatedAt
            const bDate = b.latestMessage?.[0]?.createdAt || b.updatedAt
            return new Date(bDate) - new Date(aDate)
          })
          setChats(sortedChats)
        })
        .catch(err => console.error('[CHATS_LOAD_ERROR]', err))
    }
  }, [status])

  if (status === 'loading' || loading) {
    return <div className='w-[100%] h-[50vh] flex items-center justify-center'>
        <h2>
        Lade deine Profilinformationen…
        </h2>
      </div>
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    signOut({ callbackUrl: '/login' })
  }

  const userRole = session.user.role || 'Unbekannt'

  return (
    <div className='flex flex-col gap-[7rem] bd-container py-[5rem] pt-[2rem]'>

      {/* Nutzerinfos */}
      <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-[1rem]">
        <div className='flex flex-col gap-[2rem] bg-(--secondary-color) p-[2rem] rounded-[1rem] relative'>
          <h2 className='!font-semibold'>Hi, {session.user.name || 'Benutzer'}</h2>
             <Link href="/user/edit-profile" className=" absolute right-[2rem] top-[2rem]">
            <img src="/images/profile/edit-icon.svg" alt="Edit Button"/>
        </Link>

          <div className="o-u-1-ct user-infos-ct flex flex-col gap-[1rem]">
            <p className='!text-(--primary-color)'>Kontoinformationen</p>
            <div className='flex gap-[2rem]'>
              <p>Nutzername</p>
              <p className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{session.user.name}</p>
            </div>
            <div className='flex gap-[2rem]'>
              <p>E-Mail</p>
              <p className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{session.user.email}</p>
            </div>

          </div>

          {userRole === 'ADMIN' && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#ffe0e0' }}>
              <strong>Hallo Admin, Hier geht es zu deinem <Link href="/admin/dashboard">Dashboard</Link>.</strong>
            </div>
          )}
        </div>

        {/* Logout Buttons */}
        <div className='flex flex-col gap-[1rem]'>
          <div className='overflow-y-auto h-[100%] p-[1rem] rounded-[1rem] flex flex-col gap-[1rem] bg-(--accent-color)' >
              <h4 className=''>Deine Anfragen</h4>
              <div>
                {chats.length === 0 ? (
                  <p>Du hast noch keine Anfragen gestellt.</p>
                ) : (
                  <ul className="flex flex-col gap-[0.5rem]">
                    {chats.map((chat) => {
                      const hasUnread = chat.messages && chat.messages.length > 0
                      return (
                        <li key={chat.id} className="shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-[1rem] p-[0.5rem_1rem] bg-white">
                          <Link href={`/chat/${chat.id}`}>
                            <div className="flex flex-col gap-[0.5rem]">
                              <p><strong>Mit {chat.shelter?.name || 'Tierheim'}</strong></p>
                              {chat.animal && (
                                <p>Zu {chat.animal.name}</p>
                              )}
                              {hasUnread && (
                                <p className="!text-white bg-red-600 p-[8px_16px] rounded-[1rem] font-semibold w-fit !m-[0px]">Neue Nachricht</p>
                              )}
                            </div>
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
          </div>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-[0.5rem]'>
            <button className="global-btn-bg !w-full" onClick={handleLogout}>
              Abmelden
            </button>
            <button className="global-btn !w-full" onClick={handleLogout}>
              Account löschen
            </button>
          </div>
        </div>
      </div>

      {/* 🆕 Chatliste */}
  
      {/* Favoritenliste */}
      <div className='animal-list-ct-profile flex flex-col gap-[2rem]'>
        <h2>Favorisierte Haustiere</h2>
        {favorites.length > 0 ? (
          <ul>
            {favorites.map((animal) => (
              <li key={animal.id} className='rounded-[1rem] relative shadow-[0px_0px_4px_rgba(0,0,0,0.25)] bg-(--secondary-color)'>
                <Link href={`/animals/profile/${animal.id}`}>
                  <div className="image-box rounded-t-[1rem] relative z-0">
                    <img className="animal-cover-img z-0" src={animal.coverImage} />
                  </div>
                  <div className='bg-(--secondary-color) rounded-[1rem] translate-y-[-1rem] p-[1rem] flex flex-col relative z-10'>
                    <h4 className='pr-[1rem]'>{animal.name}</h4>
                    <span className='text-[0.9rem] text-(--primary-color) mb-[0.5rem]'>{animal.breed}</span>
                    <div className='flex gap-[0.5rem] flex-wrap'>
                      <p className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{animal.age} Jahre</p>
                      <p className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{animal.gender}</p>
                      {animal.shelter && (
                        <p className='bg-white p-[8px_16px] rounded-[90px] flex gap-[0.5rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>
                          <img src="/images/animals/icons/location-icon.svg" /> {animal.shelter.city}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>Du hast noch keine Tiere als Favoriten gespeichert.</p>
        )}
      </div>
    </div>
  )
}
