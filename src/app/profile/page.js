'use client';

import { signOut, useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Lade Profil...</p>;
  }

  if (!session) {
    return <p>Du bist nicht eingeloggt. Bitte melde dich an.</p>;
  }

  return (
    <div className='bd-container'>
      <h1>Profil</h1>
      <h2>Willkommen, {session.user.name || 'Benutzer'}! 🐶</h2>
      <p>{session.user.email}</p>
      <button onClick={() => signOut({ callbackUrl: '/' })} className='sign-out-btn global-btn'>Abmelden</button>
    </div>
  );
}
