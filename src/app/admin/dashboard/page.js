'use client'

import { signOut, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status])

  const handleLogout = () => {
    localStorage.removeItem('token')
    signOut({ callbackUrl: '/login' })
  }

  if (status === 'loading') return <p>Lade Dashboard…</p>

  return (
    <div className="bd-container !my-[5rem] grid xl:grid-cols-[1fr_0.4fr] grid-cols-1 gap-[1rem] relative">
  
      <div className=' bg-(--secondary-color) rounded-[1rem] p-[2rem] flex flex-col gap-[1rem] relative'>
        <h2>Hi {session.user.name || 'Admin'}</h2>
       
          <Link href="/user/edit-profile" className=" absolute right-[2rem] top-[2rem]">
            <img src="/images/profile/edit-icon.svg" alt="Edit Button"/>
        </Link>
        <ul className='flex flex-col gap-[1rem]'>
          <li className='flex flex-col gap-[0.5rem]'>
            Name
            <p className='p-[8px_16px] bg-white rounded-[90px] w-fit'>{session.user.name}</p>
          </li>
          <li className='flex flex-col gap-[0.5rem]'>
            E-Mail
            <p className='p-[8px_16px] bg-white rounded-[90px] w-fit'>{session.user.email}</p>
          </li>
        </ul>

      </div>
      <div className='bg-(--accent-color) rounded-[1rem] p-[2rem] flex flex-col gap-[1rem]'>
        <Link href="/admin/blog/new" className='bg-white p-[8px_16px] rounded-[90px] text-[0.8rem] text-center shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>Neuen Blogpost erstellen</Link>
        <Link href="/admin/shelter/register" className='bg-white p-[8px_16px] rounded-[90px] text-[0.8rem] text-center shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>Neues Tierheim registrieren</Link>
        <Link href="/admin/users" className='bg-white p-[8px_16px] rounded-[90px] text-[0.8rem] text-center shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>Übersicht aller Nutzer</Link>
        <Link href="/admin/shelters" className='bg-white p-[8px_16px] rounded-[90px] text-[0.8rem] text-center shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>Übersicht aller Tierheime</Link>
        <Link href="/admin/blogposts" className='bg-white p-[8px_16px] rounded-[90px] text-[0.8rem] text-center shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>Übersicht aller Blog Beiträge</Link>
           <button className="global-btn-bg !w-full" onClick={handleLogout}>
            Abmelden
          </button>
      </div>
    </div>
  )
}
