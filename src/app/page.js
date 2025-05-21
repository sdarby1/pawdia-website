'use client';

import FaqBot from '@/components/FaqBot';
import Link from 'next/link'
import React from 'react'


const page = () => {
  return ( 
    <>
    <div className='video-wrapper'>
      <div className='video-overlay'></div>
      <video className='bg-video' src="/videos/home/home-background.mp4" autoPlay
        loop
        muted
        playsInline></video>
      <div className="bd-container">
        <div className="home-start-container">
          <h1 className='home-h1'>Finde dein neues Familienmitglied auf Pawdia</h1>
          <h2 className='home-h2'>Tierheime aus ganz Deutschland - vernetzt auf einer Plattform</h2>
          <div className="btn-container">
            <Link className="global-btn" href="/">Jetzt Tiere entdecken</Link>
            <Link className="global-btn" href="#benefits">Mehr erfahren</Link>
          </div>
        </div>
        </div>
      <FaqBot /> 
    </div>
    <div className='bd-container'>
      <div className='benefits-ct' id="benefits">
        <div className='benefit'>
          <p>Deutschlandweit vernetzt</p>
        </div>
        <div className='benefit'>
          <p>Direkte Kommunikation</p>
        </div>
        <div className='benefit'>
          <p>Gezielte Suche</p>
        </div>
      </div>
    </div>
       </>
  )
}

export default page