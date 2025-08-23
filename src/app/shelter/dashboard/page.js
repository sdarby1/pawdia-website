'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ShelterDashboardPage() {
  const { data: session, status } = useSession()
  const [shelterData, setShelterData] = useState(null)
  const [animals, setAnimals] = useState([])
  const router = useRouter()
  const [chats, setChats] = useState([])
  const [activeTab, setActiveTab] = useState('OFFEN') // oder 'ERLEDIGT'



  useEffect(() => {
  if (status === 'unauthenticated') router.push('/shelter/login')
  if (status === 'authenticated' && session.user.role !== 'SHELTER') {
    router.push('/')
  }

  const fetchData = async () => {
    const res = await fetch('/api/shelter/me')
    const data = await res.json()
    setShelterData(data.shelter)
    setAnimals(data.animals)
  }

  const fetchChats = async () => {
    const res = await fetch('/api/shelter/chats')
    const data = await res.json()

    // Sortiere nach Datum der neuesten Nachricht oder updatedAt
    const sortedChats = [...(data.chats || [])].sort((a, b) => {
      const aDate = a.latestMessage?.[0]?.createdAt || a.updatedAt
      const bDate = b.latestMessage?.[0]?.createdAt || b.updatedAt
      return new Date(bDate) - new Date(aDate)
    })

    setChats(sortedChats)
  }

  if (status === 'authenticated') {
    fetchData()
    fetchChats()
  }
}, [status])




  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || !shelterData) {
    return <p>Lade Dashboard...</p>
  }

  return (
    <div className='flex flex-col gap-[3rem] bd-container py-[3rem] xl:py-[5rem]'>

    <div className="grid grid-cols-1 xl:grid-cols-[2.5fr_1fr] gap-[1rem]">

      <div className='flex flex-col gap-[2rem] bg-(--secondary-color) p-[2rem] rounded-[1rem] relative'>
         <h2>{shelterData.name}</h2>
         <div className='flex gap-[1rem] xl:flex-row flex-col'>
            <div>
              <button onClick={handleLogout} className="global-btn-bg">Abmelden</button>
            </div>
            <div>
              <Link href="/shelter/animal/new" className="global-btn-bg">Neues Tier hinzufügen</Link>
            </div>
         </div>
        <Link href="/shelter/dashboard/edit" className=" absolute right-[2rem] top-[2rem]">
          <img src="/images/profile/edit-icon.svg" alt="Edit Button"/>
        </Link>

        <div className='grid grid-cols-1 xl:grid-cols-2 gap-[1rem] '>


          <div className='flex flex-col gap-[0.5rem]'>
            <p>Ansprechpartner</p>
            <p className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelterData.contactPerson}</p>
          </div>

          <div className='flex flex-col gap-[0.5rem]'>
            <p>E-Mail</p>
            <Link href={`mailto:${shelterData.email}`} className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>
              {shelterData.email}
            </Link>
          </div>

          <div className='flex flex-col gap-[0.5rem]'>
             <p>Telefonnummer</p>
            <Link href={`tel:${shelterData.phoneNumber}`} className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelterData.phoneNumber}</Link>
          </div>

          <div className='flex flex-col gap-[0.5rem]'>
            <p>Adresse</p>
            <p className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelterData.street} {shelterData.houseNumber}, {shelterData.postalCode} {shelterData.city}</p>
          </div>

          {shelterData.website && (
            <div className='flex flex-col gap-[0.5rem]'>
            <p>Website{' '}</p>
              <a href={shelterData.website} target="_blank" rel="noopener noreferrer" className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)] flex gap-[0.5rem]'>
                <img src="/images/profile/website-icon.svg" alt="Website Icon"/>
                {shelterData.website}
              </a>
            </div>
          )}


          <div className='flex flex-col gap-[0.5rem]'>
            <p>Verifiziert</p>
            <p className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelterData.isVerified ? 'Ja' : 'Nein'}</p>
          </div>

          {(shelterData.instagram || shelterData.facebook || shelterData.tiktok || shelterData.linkedIn) && (
            <>
              <h3>Social Media:</h3>
              <ul>
                {shelterData.instagram && (
                  <li>Instagram:{' '}
                    <a href={shelterData.instagram} target="_blank" rel="noopener noreferrer">
                      {shelterData.instagram}
                    </a>
                  </li>
                )}
                {shelterData.facebook && (
                  <li>Facebook:{' '}
                    <a href={shelterData.facebook} target="_blank" rel="noopener noreferrer">
                      {shelterData.facebook}
                    </a>
                  </li>
                )}
                {shelterData.tiktok && (
                  <li>TikTok:{' '}
                    <a href={shelterData.tiktok} target="_blank" rel="noopener noreferrer">
                      {shelterData.tiktok}
                    </a>
                  </li>
                )}
                {shelterData.linkedIn && (
                  <li>LinkedIn:{' '}
                    <a href={shelterData.linkedIn} target="_blank" rel="noopener noreferrer">
                      {shelterData.linkedIn}
                    </a>
                  </li>
                )}
              </ul>
            </>
          )}

        </div>

       
      </div>
      <div className='grid grid-rows-[0.4fr_0.6fr] gap-[1rem]'>
        <iframe
            className='w-[100%] h-[250px] xl:h-[100%] rounded-[1rem]'
            src={shelterData.googleMapsLink}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

  <div className='overflow-y-auto h-[250px] xl:h-[100%] p-[1rem] rounded-[1rem] flex flex-col gap-[1rem] bg-(--accent-color)'>
  <h4>Anfragen von Nutzern</h4>

  {/* Tabs für OFFEN und ERLEDIGT */}
  <div className="flex gap-[0.5rem] mb-[1rem]">
    <button
      className={`global-btn-bg  ${activeTab === 'OFFEN' ? '' : '!bg-white !text-(--primary-color) shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'}`}
      onClick={() => setActiveTab('OFFEN')}
    >
      Offen
    </button>
    <button
      className={`global-btn-bg ${activeTab === 'ERLEDIGT' ? '' : '!bg-white !text-(--primary-color) shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'}`}
      onClick={() => setActiveTab('ERLEDIGT')}
    >
      Erledigt
    </button>
  </div>

  {/* Gefilterte Chats */}
  {chats.filter(chat => chat.status === activeTab).length === 0 ? (
    <p>Keine {activeTab === 'OFFEN' ? 'offenen' : 'erledigten'} Anfragen vorhanden.</p>
  ) : (
    <ul className="flex flex-col gap-[0.5rem]">
      {chats
        .filter(chat => chat.status === activeTab)
        .map((chat) => {
          const hasUnread = chat.messages && chat.messages.length > 0
          return (
            <li key={chat.id} className="shadow-[0px_0px_4px_rgba(0,0,0,0.25)] rounded-[1rem] p-[0.5rem_1rem] bg-white relative">
              <Link href={`/chat/${chat.id}`}>
                <div className="flex flex-col gap-[0.5rem]">
                  <p><strong>Von {chat.user?.name || 'Unbekannt'}</strong></p>

                  {chat.animal && (
                    <p>
                      Zu {chat.animal.name}
                    </p>
                  )}

                  {hasUnread && (
                    <p className="!text-white bg-red-600 p-[8px_16px] rounded-[1rem] font-semibold w-fit !m-[0px]">Neue Nachricht</p>
                  )}
                </div>
              </Link>

              {/* Abhaken / Statusanzeige */}
              <div className="absolute right-[0.5rem] top-[0.5rem]">
                {chat.status !== 'ERLEDIGT' && (
                  <button
                    onClick={async (e) => {
                      e.preventDefault()
                      try {
                        const res = await fetch(`/api/shelter/chats/${chat.id}/done`, {
                          method: 'PATCH',
                        })
                        if (res.ok) {
                          setChats(prev =>
                            prev.map(c =>
                              c.id === chat.id ? { ...c, status: 'ERLEDIGT' } : c
                            )
                          )
                        }
                      } catch (err) {
                        console.error('Fehler beim Erledigt-Melden:', err)
                      }
                    }}
                  >
                    <img src="/images/profile/unchecked-icon.svg" alt="Als erledigt markieren" />
                  </button>
                )}
                {chat.status === 'ERLEDIGT' && (
                  <img src="/images/profile/check-icon.svg" alt="Erledigt" />
                )}
              </div>
            </li>
          )
        })}
    </ul>
  )}
</div>

        </div>
    </div>

        <div className='animal-list-ct-profile flex flex-col gap-[1rem]'>
        <h2>Deine Haustiere</h2>
        {animals.length === 0 ? (
          <p>Keine Tiere gefunden.</p>
        ) : (
          <ul>
            {animals.map((animal) => (
              <li key={animal.id} className='rounded-[1rem] relative bg-(--secondary-color) shadow-[0_0_4px_rgba(0,0,0,0.25)]' >
                <Link href={`/animals/profile/${animal.id}`}>
                <div className="image-box rounded-t-[1rem] relative z-0">
                  <img className="animal-cover-img z-0" src={animal.coverImage} />
                </div>
                <div className='rounded-[1rem] p-[1rem] flex flex-col gap-[0.5rem] translate-y-[-1rem] relative z-10 bg-(--secondary-color)'>
                  <h4 className='pr-[1rem]'>{animal.name}</h4>
                  <span className='text-[0.9rem] text-(--primary-color) mb-[0.5rem]'>{animal.breed}</span>
                  <div className='flex gap-[0.5rem] flex-wrap'>
                    <p className='bg-white p-[8px_16px] rounded-[90px] shadow-[0_0_4px_rgba(0,0,0,0.25)]'>{animal.age} {animal.age === 1 ? "Jahr" : "Jahre"}</p>
                    <p className='bg-white p-[8px_16px] rounded-[90px] shadow-[0_0_4px_rgba(0,0,0,0.25)]'>{animal.gender === 'MAENNLICH' ? <img src="/images/animals/icons/male-icon.svg" /> : animal.gender === 'WEIBLICH' ? <img src="/images/animals/icons/female-icon.svg" /> : animal.gender}</p>
                    {animal.shelter && (
                    <p className='bg-white p-[8px_16px] rounded-[90px] flex gap-[0.5rem] shadow-[0_0_4px_rgba(0,0,0,0.25)]'><img src="/images/animals/icons/location-icon.svg" /> {animal.shelter.city || 'Unbekannt'}</p>
                    )}
                  </div>
                </div>
                </Link>
                <Link className='absolute top-[0.5rem] right-[0.5rem] bg-white rounded-[90px] p-[0.5rem]' href={`/shelter/animal/edit/${animal.id}`}><img src="/images/profile/edit-icon.svg"/></Link>
              </li>

            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
