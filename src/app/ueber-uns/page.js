import React from 'react'
import Link from 'next/link'
import FaqAccordion from '@/components/FaqAccordion'

const page = () => {
  return (
    <div>
         <div className='px-[1rem]'>
        <div className='video-wrapper !h-[60vh]'>
          <div className='video-overlay'></div>
          <video className='bg-video' src="/videos/home/background-3.mp4" autoPlay loop muted playsInline></video>
          <div className="w-[1280px] bd-container">
            <div className="home-start-container">
              <h1 className='!text-white'>Über<br /> Pawdia</h1>
              <h3 className='!text-white'>Alles rund um Haustiere<br /> – entdecke unseren Blog!</h3>
              <div className="flex gap-[0.5rem]">
                <Link href="/tiervermittlung" className="global-btn-bg !bg-white !text-black">Haustiere entdecken</Link>
                <Link className="global-btn !border-white !text-white" href="#benefits">Mehr erfahren</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bd-container flex gap-[2rem] py-[5rem]'>
        <img src="/images/about/about-us-dog.png" className='rounded-[1rem] object-cover'/>
        <div className='flex flex-col gap-[2rem]'>
          <h2>Unsere Mission: Ein Zuhause für jedes Tier</h2>
          <p>Bei Pawdia glauben wir daran, dass jedes Tier ein liebevolles Zuhause verdient. Unsere Plattform verbindet Tierheime in ganz Deutschland mit Menschen, die bereit sind, einem Tier ein neues Zuhause zu schenken.

Wir bieten nicht nur eine Übersicht über Hunde, Katzen und andere Tiere in Not, sondern erleichtern mit modernen Funktionen wie Filtermöglichkeiten, Umkreissuche und direkten Kontaktmöglichkeiten den gesamten Vermittlungsprozess. Gleichzeitig möchten wir Bewusstsein für den Tierschutz schaffen und Tierheimen eine digitale Bühne geben, um ihre Arbeit sichtbar zu machen.

Unser Ziel ist es, Tier und Mensch nachhaltig zusammenzuführen – verantwortungsvoll, transparent und mit Herz.</p>
          <div className='flex gap-[0.5rem]'>
            <Link href="" className='global-btn-bg'>Haustiere entdecken</Link>
            <Link href="" className='global-btn'>Mehr erfahren</Link>
          </div>
        </div>
      </div>
         <div className='fw-ct px-[1rem] mb-[5rem]'>
            <div className=' bg-(--secondary-color) py-[2rem] xl:py-[5rem] rounded-[1rem]'>
            <div className='bd-container flex flex-col gap-[2rem]'>
              <h2 className='!font-[500]'>FAQs</h2>
              <div className=''>
                <FaqAccordion />
              </div>
              </div>
            </div>
          </div>
    </div>
  )
}

export default page