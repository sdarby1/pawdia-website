'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

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
          <Link href="/tiere" onClick={toggleMenu}>Tiere entdecken</Link>
          <Link href="/tierschutz" onClick={toggleMenu}>Tierschutz</Link>
          <Link href="/login" onClick={toggleMenu}>Login</Link>
          <Link href="/register" onClick={toggleMenu}>Registrieren</Link>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;
