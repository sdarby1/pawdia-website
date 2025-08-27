'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function TierListe() {
  const [tiere, setTiere] = useState([])
  const [favoriten, setFavoriten] = useState(new Set())
  const [info, setInfo] = useState(null)
  const { data: session } = useSession()
  const role = session?.user?.role  

  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter States
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [maxAge, setMaxAge] = useState(15)
  const [size, setSize] = useState('')
  const [gender, setGender] = useState('EGAL')
  const [plz, setPlz] = useState('')
  const [radius, setRadius] = useState('')

  const [goodWithChildren, setGoodWithChildren] = useState(false)
  const [goodWithDogs, setGoodWithDogs] = useState(false)
  const [goodWithCats, setGoodWithCats] = useState(false)

  const [isForFamilies, setIsForFamilies] = useState(false)
  const [isForExperienced, setIsForExperienced] = useState(false)
  const [isForBeginners, setIsForBeginners] = useState(false)
  const [isForSeniors, setIsForSeniors] = useState(false)

  const [isNeutered, setIsNeutered] = useState('EGAL')

  // Tiere laden, wenn sich searchParams ändern
  useEffect(() => {
    const fetchTiere = async () => {
      try {
        const query = []

        const species = searchParams.get('species')
        const breed = searchParams.get('breed')
        const maxAge = searchParams.get('maxAge')
        const size = searchParams.get('size')
        const gender = searchParams.get('gender')
        const plz = searchParams.get('plz')
        const radius = searchParams.get('radius')
        const goodWithChildren = searchParams.get('goodWithChildren')
        const goodWithDogs = searchParams.get('goodWithDogs')
        const goodWithCats = searchParams.get('goodWithCats')
        const isForFamilies = searchParams.get('isFamilyFriendly')
        const isForExperienced = searchParams.get('isForExperienced')
        const isForBeginners = searchParams.get('isForBeginners')
        const isForSeniors = searchParams.get('isForSeniors')
        const isNeutered = searchParams.get('isNeutered')

        if (species) query.push(`species=${species}`)
        if (breed) query.push(`breed=${breed}`)
        if (maxAge) query.push(`maxAge=${maxAge}`)
        if (size) query.push(`size=${size}`)
        if (gender && gender !== 'EGAL') query.push(`gender=${gender}`)
        if (plz) query.push(`plz=${plz}`)
        if (radius) query.push(`radius=${radius}`)

        if (goodWithChildren) query.push('goodWithChildren=true')
        if (goodWithDogs) query.push('goodWithDogs=true')
        if (goodWithCats) query.push('goodWithCats=true')
        if (isForFamilies) query.push('isFamilyFriendly=true')
        if (isForExperienced) query.push('isForExperienced=true')
        if (isForBeginners) query.push('isForBeginners=true')
        if (isForSeniors) query.push('isForSeniors=true')
        if (isNeutered && isNeutered !== 'EGAL') query.push(`isNeutered=${isNeutered}`)

        const url = `/api/animals/all${query.length > 0 ? '?' + query.join('&') : ''}`
        const res = await fetch(url)
        const data = await res.json()
        setTiere(data)
      } catch (err) {
        console.error('[ANIMAL_LOAD_ERROR]', err)
        setInfo('Fehler beim Laden der Tiere.')
      }
    }

    fetchTiere()
  }, [searchParams])

  // URL-Filter in States übernehmen
  useEffect(() => {
    const s = searchParams.get('species')
    const b = searchParams.get('breed')
    const a = searchParams.get('maxAge')
    const sz = searchParams.get('size')
    const g = searchParams.get('gender')
    const p = searchParams.get('plz')
    const r = searchParams.get('radius')
    const gwc = searchParams.get('goodWithChildren')
    const gwd = searchParams.get('goodWithDogs')
    const gwct = searchParams.get('goodWithCats')
    const ff = searchParams.get('isFamilyFriendly')
    const exp = searchParams.get('isForExperienced')
    const beg = searchParams.get('isForBeginners')
    const sen = searchParams.get('isForSeniors')
    const neut = searchParams.get('isNeutered')

    if (s) setSpecies(s)
    if (b) setBreed(b)
    if (a) setMaxAge(Number(a))
    if (sz) setSize(sz)
    if (g) setGender(g)
    if (p) setPlz(p)
    if (r) setRadius(r)
    if (gwc) setGoodWithChildren(true)
    if (gwd) setGoodWithDogs(true)
    if (gwct) setGoodWithCats(true)
    if (ff) setIsForFamilies(true)
    if (exp) setIsForExperienced(true)
    if (beg) setIsForBeginners(true)
    if (sen) setIsForSeniors(true)
    if (neut) setIsNeutered(neut)
  }, [])

  // Filter anwenden 
  const applyFiltersToURL = () => {
    const query = new URLSearchParams()

    if (species) query.append('species', species)
    if (breed) query.append('breed', breed)
    if (maxAge) query.append('maxAge', maxAge)
    if (size) query.append('size', size)
    if (gender && gender !== 'EGAL') query.append('gender', gender)
    if (plz) query.append('plz', plz)
    if (radius) query.append('radius', radius)
    if (goodWithChildren) query.append('goodWithChildren', 'true')
    if (goodWithDogs) query.append('goodWithDogs', 'true')
    if (goodWithCats) query.append('goodWithCats', 'true')
    if (isForFamilies) query.append('isFamilyFriendly', 'true')
    if (isForExperienced) query.append('isForExperienced', 'true')
    if (isForBeginners) query.append('isForBeginners', 'true')
    if (isForSeniors) query.append('isForSeniors', 'true')
    if (isNeutered && isNeutered !== 'EGAL') query.append('isNeutered', isNeutered)

    router.push(`/tiervermittlung?${query.toString()}`)
  }

  // Favoriten beim ersten Laden holen
  useEffect(() => {
    fetch('/api/user/favorites', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        const favSet = new Set(data.favorites?.map(t => t.id))
        setFavoriten(favSet)
      })
      .catch(err => console.warn('[FAV_LOAD_WARN]', err))
  }, [])


  const toggleFavorite = async (animalId) => {
    let headers = { 'Content-Type': 'application/json' }
    const token = localStorage.getItem('token')
    if (token) headers['Authorization'] = `Bearer ${token}`

    try {
      const res = await fetch('/api/favorites/add', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ animalId }),
      })

      const data = await res.json()

      if (res.ok) {
        const newSet = new Set(favoriten)
        if (data.favorited) newSet.add(animalId)
        else newSet.delete(animalId)
        setFavoriten(newSet)
        setInfo(`✅ ${data.message}`)
      } else {
        setInfo(`${data.error || 'Fehler beim Favorisieren.'}`)
      }
    } catch (err) {
      console.error('[FAVORITE_TOGGLE_ERROR]', err)
      setInfo('Fehler beim Favorisieren.')
    }

    setTimeout(() => setInfo(null), 3000)
  }
  return (
    <div className="tiere-seite bd-container pt-[2rem] pb-[5rem]">
      <div className="bg-container flex flex-col gap-[3rem]">
        <div className="xl:grid grid-cols-[1fr_3fr] gap-[1rem] flex flex-col">

          {/* Filterleiste */}
          <div className="h-fit bg-white rounded-[1rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)] flex flex-col">
            <div className='bg-(--accent-color) p-[1rem] rounded-t-[1rem]'>
              <h3>Filter</h3>
            </div>

            <div className='p-[1rem] flex flex-col gap-[2rem]'>

              <div className='flex flex-col gap-[1rem]'>
                <p className='font-semibold text-[0.8rem]'>Tierart</p>
                <div className="flex gap-[1rem] flex-wrap">
                  {['Hund', 'Katze', 'Vögel', 'Kleintier'].map((type) => (
                    <img
                      key={type}
                      src={`/images/animals/icons/${type}.svg`}
                      alt={type}
                      onClick={() => setSpecies(type)}
                      className={`cursor-pointer transition-opacity duration-200 ${
                        species === type ? 'opacity-100' : 'opacity-30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className='flex flex-col gap-[1rem]'>
                <p className='font-semibold !text-[0.8rem]'>Rasse</p>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Rasse"
                  className="bg-white p-2 rounded-[90px] w-full shadow-[0px_0px_4px_rgba(0,0,0,0.25)] text-[0.7rem]"
                />
              </div>

              <div className='flex flex-col gap-[1rem]'>
                <p className='font-semibold !text-[0.8rem]'>Alter (max.): {maxAge} Jahre</p>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={maxAge}
                  onChange={(e) => setMaxAge(e.target.value)}
                  className="w-full accent-(--primary-color)"
                />
              </div>

              <div className='flex flex-col gap-[1rem]'>
                <p className='font-semibold !text-[0.8rem]'>Größe</p>
                <div className="flex gap-[1rem] flex-wrap">
                  {['klein', 'mittel', 'groß'].map((s) => (
                    <img
                      key={s}
                      src={`/images/animals/icons/${s.charAt(0).toUpperCase() + s.slice(1)}.svg`}
                      alt={s}
                      onClick={() => setSize(s)}
                      className={`cursor-pointer transition-opacity duration-200 ${
                        size === s ? 'opacity-100' : 'opacity-30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className='flex flex-col gap-[1rem]'>
                <p className='font-semibold !text-[0.8rem]'>Geschlecht</p>
                <div className="flex gap-[1rem] items-center">
                  <div
                    onClick={() => setGender('EGAL')}
                    className={`text-sm font-medium cursor-pointer transition-opacity duration-200 ${
                      gender === 'EGAL' ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <p className='!text-(--primary-color) !text-[0.8rem]'>Alle</p>
                  </div>
                  <img
                    src="/images/animals/icons/male-icon.svg"
                    alt="Männlich"
                    onClick={() => setGender('MAENNLICH')}
                    className={`cursor-pointer transition-opacity duration-200 ${
                      gender === 'MAENNLICH' ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                  <img
                    src="/images/animals/icons/female-icon.svg"
                    alt="Weiblich"
                    onClick={() => setGender('WEIBLICH')}
                    className={`cursor-pointer transition-opacity duration-200 ${
                      gender === 'WEIBLICH' ? 'opacity-100' : 'opacity-30'
                    }`}
                  />
                </div>
              </div>

              <div className='flex flex-col gap-[1rem]'>
                <p className='font-semibold !text-[0.8rem]'>PLZ und Umkreis</p>
                <div className="flex gap-[0.5rem]">
                  <input
                    type="text"
                    value={plz}
                    onChange={(e) => setPlz(e.target.value)}
                    placeholder="PLZ"
                    className='bg-white p-2 rounded-[90px] !w-fit max-w-[80px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)] text-[0.7rem]'
                  />
                  <select value={radius} onChange={(e) => setRadius(e.target.value)} className='bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] text-[0.7rem] p-[8px_16px] rounded-[90px] w-fit'>
                    <option value="">Umkreis…</option>
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                    <option value="50">50 km</option>
                    <option value="100">100 km</option>
                    <option value="150">150 km</option>
                    <option value="200">200 km</option>
                    <option value="500">500 km</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-[0.5rem]">
                <p className="font-semibold !text-[0.8rem]">Versteht sich mit:</p>

                {[
                  { label: 'Kinder', state: goodWithChildren, setter: setGoodWithChildren },
                  { label: 'Hunde', state: goodWithDogs, setter: setGoodWithDogs },
                  { label: 'Katzen', state: goodWithCats, setter: setGoodWithCats },
                ].map(({ label, state, setter }, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-[0.7rem]">
                    <input
                      type="checkbox"
                      checked={state}
                      onChange={() => setter(!state)}
                      className="w-[1.2rem] h-[1.2rem] rounded accent-(--primary-color)  cursor-pointer"
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div className="flex flex-col gap-[0.5rem]">
                <p className="font-semibold !text-[0.8rem]">Eignung:</p>

                {[
                  { label: 'Familien', state: isForFamilies, setter: setIsForFamilies },
                  { label: 'Hundeprofis', state: isForExperienced, setter: setIsForExperienced },
                  { label: 'Anfänger', state: isForBeginners, setter: setIsForBeginners },
                  { label: 'Senioren', state: isForSeniors, setter: setIsForSeniors },
                ].map(({ label, state, setter }, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-[0.7rem]">
                    <input
                      type="checkbox"
                      checked={state}
                      onChange={() => setter(!state)}
                      className="w-[1.2rem] h-[1.2rem] rounded-[1rem] accent-(--primary-color) cursor-pointer"
                    />
                    {label}
                  </label>
                ))}
              </div>


              <div className='flex flex-col gap-[1rem]'>
                <p className='font-semibold !text-[0.8rem]'>Kastriert:</p>
                <div className="flex gap-2">
                  {['EGAL', 'true', 'false'].map(val => (
                    <button
                      key={val}
                      type="button"
                      className={`rounded-[90px] px-4 py-2 shadow cursor-pointer !text-[0.8rem] ${isNeutered === val ? 'bg-(--primary-color) text-white' : 'bg-white text-black opacity-50 !text-[0.8rem]'}`}
                      onClick={() => setIsNeutered(val)}
                    >
                      {val === 'EGAL' ? 'Egal' : val === 'true' ? 'Ja' : 'Nein'}
                    </button>
                  ))}
                </div>
              </div>

              <button type="button" onClick={applyFiltersToURL} className="global-btn-bg w-full mt-4">
                Filter anwenden
              </button>

            </div>
          </div>

          {/* Tierliste */}
          <div className='animal-list-ct'>
            {info && <p>{info}</p>}
            {tiere.length === 0 ? (
              <p>Keine Tiere gefunden.</p>
            ) : (
              <ul>
                {tiere.map((tier) => (
                  <li key={tier.id} className='rounded-[1rem] relative shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>
                    <Link href={`/animals/profile/${tier.id}`}>
                      <div className="image-box rounded-t-[1rem] relative z-0">
                        <img className="animal-cover-img z-0" src={tier.coverImage} />
                      </div>
                      <div className='bg-white rounded-[1rem] translate-y-[-1rem] p-[1rem] flex flex-col relative z-10'>
                        <h4 className='pr-[1rem]'>{tier.name}</h4>
                        <span className='text-[0.9rem] text-(--primary-color) mb-[0.5rem]'>{tier.breed}</span>
                        {tier.isForExperienced === true ? <img className='absolute right-[1rem] top-[1rem]' src="/images/animals/icons/experienced-icon.svg" /> : tier.isForExperienced}
                        <div className='flex gap-[0.5rem] flex-wrap'>
                          <p className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{tier.age} {tier.age === 1 ? "Jahr" : "Jahre"}</p>
                          <p className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{tier.gender === 'MAENNLICH' ? <img src="/images/animals/icons/male-icon.svg" /> : tier.gender === 'WEIBLICH' ? <img src="/images/animals/icons/female-icon.svg" /> : tier.gender}</p>
                          <span className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{tier.isFamilyFriendly === true ? <img className='' src="/images/animals/icons/familyFriendly.svg" /> : tier.isFamilyFriendly === false ? <img className='opacity-22' src="/images/animals/icons/familyFriendly.svg" /> : tier.isFamilyFriendly}</span>
                          {tier.shelter && (
                            <p className='bg-white p-[8px_16px] rounded-[90px] flex gap-[0.5rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'><img src="/images/animals/icons/location-icon.svg" /> {tier.shelter.city || 'Unbekannt'}</p>
                          )}
                          <p className="bg-white p-[8px_16px] rounded-[90px] shadow-[0_0_4px_rgba(0,0,0,0.25)] truncate max-w-[200px]" title={tier.shelter.name}>{tier.shelter.name}</p>
                        </div>
                      </div>
                    </Link>
                    {role === 'USER' && (
                      <button
                        onClick={() => toggleFavorite(tier.id)}
                        className="absolute top-[1rem] right-[1rem] cursor-pointer"
                      >
                        {favoriten.has(tier.id)
                          ? <img className="w-[2rem]" src="/images/animals/icons/fav.svg" />
                          : <img className="w-[2rem]" src="/images/animals/icons/no-fav.svg" />
                        }
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
