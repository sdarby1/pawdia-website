'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
    const { data: session, status } = useSession();

   const userRole = session?.user?.role;
  const isLoggedIn = status === "authenticated";

  const getDashboardLink = () => {
    if (userRole === 'ADMIN') return '/admin/dashboard';
    if (userRole === 'SHELTER') return '/shelter/dashboard';
    return '/profile';
  }  

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Open Button */}
      {!isOpen && (
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Menü öffnen">
          <Menu size={28} />
        </button>
      )}

      {/* Mobile Menü */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        {/* Close Button */}
        <button className="menu-close-btn" onClick={toggleMenu} aria-label="Menü schließen">
          <X size={28} />
        </button>

        <nav>
          <Link href="/" onClick={toggleMenu}>Startseite</Link>
          <Link href="/tiervermittlung" onClick={toggleMenu}>Tiervermittlung</Link>
          <Link href="/blog" onClick={toggleMenu}>Blog</Link>
          <Link href="/ueber-uns" onClick={toggleMenu}>Über uns</Link>
           {isLoggedIn ? (
              <Link
                href={getDashboardLink()}
                className='global-btn-bg text-center'
              >
                {session.user.name || 'Benutzer'}
              </Link>
            ) : (
              <div className="flex gap-[0.5rem] flex-col pb-1">
                <Link href="/login" className='global-btn-bg text-center'>Anmelden</Link>
                <Link href="/shelter/login" className='global-btn text-center'>Als Tierheim anmelden</Link>
              </div>
            )}
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
