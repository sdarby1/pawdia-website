import StartChatButton from '@/components/StartChatBtn'
import prisma from '@/lib/prisma'
import Link from 'next/link'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route' 

export default async function AnimalProfilePage({ params }) {
  const { id } = await params;

  const session = await getServerSession(authOptions)
  const userRole = session?.user?.role ?? null
  const isUser = userRole === 'USER'

  const animal = await prisma.animal.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      species: true,
      breed: true,
      age: true,
      gender: true,
      coverImage: true,
      description: true,
      birthDate: true,
      size: true,
      images: true,
      videos: true,
      isFamilyFriendly: true,
      isForExperienced: true,
      adoptionFee: true,
      goodWithCats: true,
      goodWithDogs: true,
      goodWithChildren: true,
      isForBeginners: true,
      isForSeniors: true,
      isNeutered: true,
      shelter: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!animal) {
    return <p>Tier nicht gefunden.</p>
  }

  const bilder = Array.isArray(animal.images) ? animal.images : []
  const videos = Array.isArray(animal.videos) ? animal.videos : []

  return (
    <div className="p-[1rem]">
      <div className="fw-container">
        <div className=''>
        <div className="bd-container flex flex-col gap-[2rem]  bg-(--secondary-color)  rounded-[1rem] p-[2rem]">
          <div className="animal-profile-infos">

            <div className="image-box animal-profile-img">
              <img
                className="animal-cover-img"
                src={animal.coverImage}
                alt={`Profilbild von ${animal.name}`}
              />
            </div>

            {/* Tierinformationen */}
            <div className="global-ct">
              <h1>{animal.name}</h1>
              <div className="animal-info-ct">
                <div className="animal-i">
                  <p>Alter:</p>
                  <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">
                    {animal.age} {animal.age === 1 ? 'Jahr' : 'Jahre'} ({animal.birthDate.toLocaleDateString('de-DE')})
                  </p>
                </div>

                <div className="animal-i">
                  <p>Geschlecht:</p>
             <div className="bg-white p-[8px_16px] rounded-[90px] w-fit">
                {animal.gender === 'MAENNLICH' ? (
                  <div className="flex items-center justify-center gap-[0.5rem]">
                    <img src="/images/animals/icons/male-icon.svg" alt="Männlich" />
                    <p>Männlich</p>
                  </div>
                ) : animal.gender === 'WEIBLICH' ? (
                  <div className="flex items-center justify-center gap-[0.5rem]">
                    <img src="/images/animals/icons/female-icon.svg" alt="Weiblich" />
                    <p>Weiblich</p>
                  </div>
                ) : (
                  <span>{animal.gender}</span>
                )}
              </div>

                </div>

                <div className="animal-i">
                  <p>Größe:</p>
                  <p className="bg-white p-[8px_16px] rounded-[90px] w-fit flex gap-[0.5rem]">
                    <img src="/images/animals/icons/size-icon.svg" />
                    {animal.size === 'GROSS' ? 'Groß' : animal.size === 'MITTEL' ? 'Mittel' : animal.size === 'KLEIN' ? 'Klein' : animal.size}
                  </p>
                </div>

                <div className="animal-i">
                  <p>Rasse:</p>
                  <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">{animal.breed}</p>
                </div>

                <div className="animal-i">
                  <p>Kastriert:</p>
                  <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">
                    {animal.isNeutered === true ? 'Ja' : animal.isNeutered === false ? 'Nein' : animal.isNeutered}
                  </p>
                </div>
                  
                {(animal.goodWithChildren || animal.goodWithDogs || animal.goodWithCats) && (
                  <div className="animal-i">
                    <p>Versteht sich mit:</p>
                    <div className="flex gap-[0.5rem] flex-wrap">
                      {animal.goodWithChildren && (
                        <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">Kindern</p>
                      )}
                      {animal.goodWithDogs && (
                        <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">Hunden</p>
                      )}
                      {animal.goodWithCats && (
                        <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">Katzen</p>
                      )}
                    </div>
                  </div>
                )}


             {(animal.isForBeginners || animal.isForSeniors || animal.isFamilyFriendly) && (
              <div className="animal-i">
                <p>Geeignet für:</p>
                <div className="flex gap-[0.5rem] flex-wrap">
                  {animal.isForBeginners && (
                    <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">Anfänger</p>
                  )}
                  {animal.isForSeniors && (
                    <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">Senioren</p>
                  )}
                  {animal.isFamilyFriendly && (
                    <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">Familien</p>
                  )}
                </div>
              </div>
            )}


              

                <div className="animal-i">
                  <p>Tierheim:</p>
                  <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">
                    <Link href={`/shelter/profile/${animal.shelter.id}`} className='flex gap-[0.5rem]'>
                      <img src="/images/animals/icons/location-icon.svg" />
                      {animal.shelter.name}
                    </Link>
                  </p>
                </div>

                <div className="animal-i">
                  <p>Adoptionsgebühr:</p>
                  <p className="bg-white p-[8px_16px] rounded-[90px] w-fit">{animal.adoptionFee} €</p>
                </div>

              {/* Button zum Chat-Start nur für User sichtbar */}

              </div>
                  {isUser && (
                  <StartChatButton shelterId={animal.shelter.id} animalId={animal.id} />
                )}
              </div>
              </div>

            </div>
            </div>

              
           <div className='bd-container py-[3rem] flex flex-col gap-[3rem]'>
            {/* Beschreibung */}
            <div className='flex flex-col gap-[1rem] max-w-[1000px]'>
              <h4>Über {animal.name}</h4>
              <p>{animal.description}</p>
            </div>
       


          {/* Medienbereich */}
          {(bilder.length > 0 || videos.length > 0) && (
            <div>
              <div className='grid xl:grid-cols-3 gap-[1rem]'>
                {/* Bilder */}
                {bilder.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Bild ${i + 1} von ${animal.name}`}
                    className='rounded-[1rem]'
                  />
                ))}

                {/* Videos */}
                {videos.map((vid, i) => (
                  <video
                    key={`vid-${i}`}
                    src={vid}
                    controls
                    className='rounded-[1rem]'
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        </div>
    </div>
  )
}
