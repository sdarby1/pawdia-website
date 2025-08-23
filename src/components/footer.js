'use client'

import Link from 'next/link'
import React from 'react'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function Footer() {
  const router = useRouter();
  
  const [species, setSpecies] = useState('');
  const [plz, setPlz] = useState('');
  const [radius, setRadius] = useState('');

   const handleSearch = () => {
    const query = new URLSearchParams();
    if (species) query.append('species', species);
    if (plz) query.append('plz', plz);
    if (radius) query.append('radius', radius);
    router.push(`/tiervermittlung?${query.toString()}`);
  };

  return (
    <div className='fw-ct bg-(--secondary-color) xl:px-[10rem] py-[4rem] rounded-t-[1rem] flex flex-col items-center justify-center gap-[3rem]'>
    <Link href=""><img src="/images/logo/logo-text.svg" alt=""></img></Link>
    <h3 className='text-center'>Tierheime aus ganz Deutschland<br></br> - vernetzt auf einer Plattform</h3>
     <div className="footer-search-ct hidden xl:flex gap-[1rem] bg-white p-[1rem] rounded-[1rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)] items-center">
            <select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              <option value="">Tierart wählen…</option>
              <option value="Hund">Hund</option>
              <option value="Katze">Katze</option>
              <option value="Vögel">Vögel</option>
              <option value="Kleintier">Kleintier</option>
            </select>
            <input
              type="text"
              placeholder="PLZ"
              value={plz}
              onChange={(e) => setPlz(e.target.value)}
            />
            <input
              type="number"
              placeholder="Radius (km)"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
            />
            <button
              type="submit"
              onClick={handleSearch}
              className="bg-(--primary-color) rounded-[90px] p-[12px] cursor-pointer"
            >
              <img src="/images/home/Suche.svg" />
            </button>
          </div>
      <div className='xl:flex justify-between w-[100%] hidden'>
        <div className='flex gap-[1rem]'>
          <Link href="/login" className='global-btn-bg'>Anmelden</Link>
          <Link href="/register" className='global-btn'>Registrieren</Link>
        </div>
        <div className="flex gap-[1rem]">
          <Link href="/tiervermittlung" className='global-btn'>Haustiere</Link>
          <Link href="/shelter" className='global-btn'>Tierheime</Link>
          <Link href="/ueber-uns" className='global-btn'>Über uns</Link>
          <Link href="/blog" className='global-btn'>Blog</Link>
        </div>
        <div className='flex gap-[1rem]'>
          <Link href="/impressum" className='global-btn'>Impressum</Link>
          <Link href="/datenschutz" className='global-btn'>Datenschutz</Link>
        </div>
      </div>
    </div>
  )
}

