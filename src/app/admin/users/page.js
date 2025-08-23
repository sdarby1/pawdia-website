'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AdminUserOverviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sort, setSort] = useState('newest')

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
    if (status === 'authenticated') loadUsers()
  }, [status])

  const loadUsers = async () => {
    const res = await fetch('/api/admin/users/all')
    const data = await res.json()
    setUsers(data.users || [])
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Möchtest du den Nutzer "${name}" wirklich löschen?`)) return

    try {
      const res = await fetch(`/api/admin/users/${id}/delete`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id))
      } else {
        const data = await res.json()
        alert('Fehler: ' + data.error)
      }
    } catch (err) {
      console.error('[DELETE_USER_ERROR]', err)
    }
  }

  const filteredUsers = users
    .filter(u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(u => roleFilter === 'all' || u.role === roleFilter)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return sort === 'newest' ? dateB - dateA : dateA - dateB
    })

  if (status === 'loading') return <p>Lade Nutzerübersicht…</p>

  return (
    <div className="bd-container user-infos-ct !my-[5rem]">
      <h2 className='!mb-[2rem]'>Alle Nutzer</h2>

      <div className='bg-[#B1D4A5] rounded-t-[1rem] p-[1rem] pb-[2rem] flex gap-[1rem]'>
        <input
          type="text"
          placeholder="Suche nach Name oder E-Mail"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='bg-white rounded-[90px] p-[8px_16px] text-[0.7rem] w-[100%]'
        />
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}  
                className='bg-white rounded-[90px] p-[8px_16px] text-[0.7rem]'>
          <option value="all">Alle Rollen</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} 
                className='bg-white rounded-[90px] p-[8px_16px] text-[0.7rem]'>
          <option value="newest">Neueste zuerst</option>
          <option value="oldest">Älteste zuerst</option>
        </select>
      </div>

      {filteredUsers.length > 0 ? (
        <table className="shelter-table rounded-[1rem] border-separate border-spacing-y-[1rem] bg-(--accent-color) p-[1rem] overflow-y-auto">
          <thead>
            <tr className='text-(--primary-color)'>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Rolle</th>
              <th>Registriert am</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(u => (
              <tr key={u.id} className='bg-white rounded-[90px]'>
                <td className='rounded-l-[90px]'>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{new Date(u.createdAt).toLocaleDateString('de-DE')}</td>
                <td className='rounded-r-[90px] text-center'>
                  <button
                    onClick={() => handleDelete(u.id, u.name)}
                    className='global-btn-bg !bg-red-500'
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Keine Nutzer gefunden.</p>
      )}
    </div>
  )
}
