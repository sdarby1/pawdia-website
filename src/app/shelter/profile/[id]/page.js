import prisma from '@/lib/prisma'
import Link from 'next/link'

export async function generateStaticParams() {
  const shelters = await prisma.shelter.findMany({
    select: { id: true },
  })
  return shelters.map(s => ({ id: s.id }))
}

export default async function ShelterPublicProfilePage({ params }) {
  const shelter = await prisma.shelter.findUnique({
    where: { id: params.id },
    include: {
      animals: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!shelter) return <p>Tierheim nicht gefunden.</p>

  return (
    <div className="bd-container !my-[5rem] flex flex-col gap-[2rem]">
      <div className='grid grid-cols-[1fr_0.4fr] gap-[1rem]'>
      <div className="bg-(--secondary-color) p-[2rem] rounded-[1rem] flex flex-col gap-[1rem]">
        <h2>{shelter.name}</h2>

        <div className="grid grid-cols-2 gap-[1rem]">

             <div className='flex flex-col gap-[0.5rem]'>
            <p>Ansprechpartner</p>
            <p className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelter.contactPerson}</p>
          </div>

          <div className='flex flex-col gap-[0.5rem]'>
            <p>E-Mail</p>
            <Link href={`mailto:${shelter.email}`} className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelter.email}</Link>
          </div>

           <div className='flex flex-col gap-[0.5rem]'>
             <p>Telefonnummer</p>
            <Link href={`tel:${shelter.phoneNumber}`} className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelter.phoneNumber}</Link>
          </div>

          <div className='flex flex-col gap-[0.5rem]'>
            <p>Adresse</p>
            <p className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelter.street} {shelter.houseNumber}, {shelter.postalCode} {shelter.city}</p>
          </div>

           {shelter.website && (
            <div className='flex flex-col gap-[0.5rem]'>
            <p>Website{' '}</p>
              <a href={shelter.website} target="_blank" rel="noopener noreferrer" className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)] flex gap-[0.5rem]'>
                <img src="/images/profile/website-icon.svg" alt="Website Icon"/>
                {shelter.website}
              </a>
            </div>
          )}


          <div className='flex flex-col gap-[0.5rem]'>
            <p>Verifiziert</p>
            <p className='bg-white w-fit p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{shelter.isVerified ? 'Ja' : 'Nein'}</p>
          </div>

          {(shelter.instagram || shelter.facebook || shelter.tiktok || shelter.linkedIn) && (
            <>
              <h3>Social Media:</h3>
              <ul>
                {shelter.instagram && (
                  <li>Instagram:{' '}
                    <a href={shelter.instagram} target="_blank" rel="noopener noreferrer">
                      {shelter.instagram}
                    </a>
                  </li>
                )}
                {shelter.facebook && (
                  <li>Facebook:{' '}
                    <a href={shelter.facebook} target="_blank" rel="noopener noreferrer">
                      {shelter.facebook}
                    </a>
                  </li>
                )}
                {shelter.tiktok && (
                  <li>TikTok:{' '}
                    <a href={shelter.tiktok} target="_blank" rel="noopener noreferrer">
                      {shelter.tiktok}
                    </a>
                  </li>
                )}
                {shelter.linkedIn && (
                  <li>LinkedIn:{' '}
                    <a href={shelter.linkedIn} target="_blank" rel="noopener noreferrer">
                      {shelter.linkedIn}
                    </a>
                  </li>
                )}
              </ul>
            </>
          )}
        </div>

        </div>
        {shelter.googleMapsLink && (
          <iframe
            className="w-full h-[100%] rounded-[1rem]"
            src={shelter.googleMapsLink}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}

      </div>

      <div className="animal-list-ct-profile flex flex-col gap-[1rem]">
        <h2>Unsere Tiere</h2>
        {shelter.animals.length === 0 ? (
          <p>Keine Tiere verfügbar.</p>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1rem]">
            {shelter.animals.map(animal => (
               <li key={animal.id} className='rounded-[1rem] relative shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>
                    <Link href={`/animals/profile/${animal.id}`}>
                      <div className="image-box rounded-t-[1rem] relative z-0">
                        <img className="animal-cover-img z-0" src={animal.coverImage} />
                      </div>
                      <div className='bg-white rounded-[1rem] translate-y-[-1rem] p-[1rem] flex flex-col relative z-10'>
                        <h4 className='pr-[1rem]'>{animal.name}</h4>
                        <span className='text-[0.9rem] text-(--primary-color) mb-[0.5rem]'>{animal.breed}</span>
                        {animal.isForExperienced === true ? <img className='absolute right-[1rem] top-[1rem]' src="/images/animals/icons/experienced-icon.svg" /> : animal.isForExperienced}
                        <div className='flex gap-[0.5rem] flex-wrap'>
                          <p className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{animal.age} {animal.age === 1 ? "Jahr" : "Jahre"}</p>
                          <p className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{animal.gender === 'MAENNLICH' ? <img src="/images/animals/icons/male-icon.svg" /> : animal.gender === 'WEIBLICH' ? <img src="/images/animals/icons/female-icon.svg" /> : animal.gender}</p>
                          <span className='bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'>{animal.isFamilyFriendly === true ? <img className='' src="/images/animals/icons/familyFriendly.svg" /> : animal.isFamilyFriendly === false ? <img className='opacity-22' src="/images/animals/icons/familyFriendly.svg" /> : animal.isFamilyFriendly}</span>
                          {animal.shelter && (
                            <p className='bg-white p-[8px_16px] rounded-[90px] flex gap-[0.5rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]'><img src="/images/animals/icons/location-icon.svg" /> {animal.shelter.city || 'Unbekannt'}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
