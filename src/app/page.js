'use client';

import FaqAccordion from '@/components/FaqAccordion';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FaqBot from '@/components/FaqBot';

export default function Page() {
  const router = useRouter();

  const [animals, setAnimals] = useState([]);
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [blogPosts, setBlogPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

  // Neue States für Filter
  const [species, setSpecies] = useState('');
  const [plz, setPlz] = useState('');
  const [radius, setRadius] = useState('');

  useEffect(() => {
    const fetchAnimals = async () => {
      const res = await fetch('/api/animals/random');
      const data = await res.json();
      setAnimals(data.animals);
      setTotalAnimals(data.total);
    };
    fetchAnimals();
  }, []);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const res = await fetch('/api/blog/random');
      const data = await res.json();
      setBlogPosts(data.posts);
      setTotalPosts(data.total);
    };
    fetchBlogPosts();
  }, []);

  function formatDate(dateString) {
    return new Intl.DateTimeFormat('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString));
  }

  const handleSearch = () => {
    const query = new URLSearchParams();
    if (species) query.append('species', species);
    if (plz) query.append('plz', plz);
    if (radius) query.append('radius', radius);
    router.push(`/tiervermittlung?${query.toString()}`);
  };

  return (
    <>
      <div className="px-[1rem]">
        <div className="video-wrapper">
          <div className="video-overlay"></div>
          <video
            className="bg-video"
            src="/videos/home/home-background.mp4"
            autoPlay
            loop
            muted
            playsInline
          ></video>
          <div className="w-[1280px] bd-container">
            <div className="home-start-container">
              <h1 className="!text-white">
                Finde dein<br />Haustier auf<br /> Pawdia
              </h1>
              <h3 className="!text-white">
                Tierheime aus ganz Deutschland<br /> - vernetzt auf einer Plattform
              </h3>
              <div className="flex gap-[0.5rem] flex-col xl:flex-row">
                <Link className="global-btn-bg !bg-white !text-black" href="/tiervermittlung">
                  Jetzt Tiere entdecken
                </Link>
                <Link className="global-btn !border-white !text-white" href="#benefits">
                  Mehr erfahren
                </Link>
              </div>
            </div>
          </div>

          <div className="home-search-ct hidden xl:flex gap-[1rem] bg-white p-[1rem] rounded-[1rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)] items-center">
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
        </div>
      </div>

      <div className="py-[2rem] xl:py-[5rem] !mt-[1rem] grid xl:grid-cols-4 grid-cols-1 gap-[1rem] justify-between bd-container">
        {[
          { label: 'Hund', icon: 'Hund-Home' },
          { label: 'Katze', icon: 'Katze-Home' },
          { label: 'Vögel', icon: 'Vogel-Home' },
          { label: 'Kleintier', icon: 'Kleintier-Home' },
        ].map(({ label, icon }) => (
          <Link
            href={`/tiervermittlung?species=${label}`}
            key={label}
            className="shadow-[0px_0px_4px_rgba(0,0,0,0.25)] w-full p-[1rem] rounded-[1rem] flex flex-col gap-[1rem] items-center justify-between"
          >
            <p className="!text-(--primary-color)">{label}</p>
            <img src={`/images/home/${icon}.svg`} />
          </Link>
        ))}
      </div>

      <div className="fw-ct bg-(--secondary-color) py-[2rem] xl:py-[5rem] rounded-[1rem]">
        <div className="bd-container flex flex-col gap-[2rem]">
          <h2 className="!font-[500]">Unsere Tiere</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1rem]">
            {animals.map((animal) => (
              <Link
                href={`/animals/profile/${animal.id}`}
                key={animal.id}
                className="bg-white rounded-[1rem] relative shadow-[0px_0px_4px_rgba(0,0,0,0.25)]"
              >
                <div className="image-box rounded-t-[1rem] relative z-0">
                  <img className="animal-cover-img z-0" src={animal.coverImage} />
                </div>
                <div className="bg-white rounded-[1rem] translate-y-[-1rem] p-[1rem] flex flex-col gap-[0.5rem] relative z-10">
                  <h4 className="pr-[1rem]">{animal.name}</h4>
                  <span className="text-[0.9rem] text-(--primary-color) mb-[0.5rem]">
                    {animal.breed}
                  </span>
                  <div className="flex gap-[0.5rem] flex-wrap">
                    <p className="bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
                      {animal.age} {animal.age === 1 ? 'Jahr' : 'Jahre'}
                    </p>
                    <p className="bg-white p-[8px_16px] rounded-[90px] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
                      {animal.gender === 'MAENNLICH' ? (
                        <img src="/images/animals/icons/male-icon.svg" />
                      ) : animal.gender === 'WEIBLICH' ? (
                        <img src="/images/animals/icons/female-icon.svg" />
                      ) : (
                        animal.gender
                      )}
                    </p>
                    {animal.shelter && (
                      <p className="bg-white p-[8px_16px] rounded-[90px] flex gap-[0.5rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
                        <img src="/images/animals/icons/location-icon.svg" />{' '}
                        {animal.shelter.city || 'Unbekannt'}
                      </p>
                    )}
                    <p
                      className="bg-white p-[8px_16px] rounded-[90px] shadow-[0_0_4px_rgba(0,0,0,0.25)] truncate max-w-[200px]"
                      title={animal.shelter.name}
                    >
                      {animal.shelter.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
            <div className="bg-(--primary-color) !text-white rounded-[1rem] p-[2rem] flex flex-col items-center justify-center gap-[2rem] shadow-[0px_0px_4px_rgba(0,0,0,0.25)]">
              <p className="text-center !text-white">
                <span className="text-[3.2rem] font-[500]">{totalAnimals}</span>
                <br />
                weitere Haustiere warten auf dich
              </p>
              <Link href="/tiervermittlung" className="global-btn !bg-white !border-white">
                Tiere entdecken
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="fw-ct py-[2rem] xl:py-[5rem] rounded-[1rem]">
        <div className="bd-container flex flex-col gap-[2rem]">
          <h2 className="!font-[500]">Blogbeiträge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1rem]">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-[1rem] p-4 bg-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] flex flex-col gap-[1rem] justify-between"
              >
                <div className="flex flex-col gap-[1rem]">
                  <img
                    src={post.coverImage}
                    className="rounded-[1rem] aspect-368/209 object-cover"
                    alt={post.title}
                  />
                  <p className="!text-[14px]">{formatDate(post.createdAt)}</p>
                  <h4>{post.title}</h4>
                </div>
                <Link className="global-btn" href={`/blog/${post.id}`}>
                  Lesen
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fw-ct px-[1rem]">
        <div className="bg-(--secondary-color) py-[2rem] xl:py-[5rem] rounded-[1rem]">
          <div className="bd-container flex flex-col gap-[2rem]">
            <h2 className="!font-[500]">FAQs</h2>
            <FaqAccordion />
          </div>
        </div>
      </div>
    </>
  );
}
