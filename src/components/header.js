'use client'

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import MobileMenu from './MobileMenu';

export const Header = () => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const userRole = session?.user?.role;

  const getDashboardLink = () => {
    if (userRole === 'ADMIN') return '/admin/dashboard';
    if (userRole === 'SHELTER') return '/shelter/dashboard';
    return '/profile';
  }

  return (
    <div className='header-container xl:px-[0rem] px-[1rem] bd-container'>
      <div className="header">
        <Link href="/">
          <img src="/images/logo/Logo-green.svg"  alt="Logo" className='h-[45px] xl:h-[60px]'/>
        </Link>

        <MobileMenu />

        <nav className="header-menu flex items-center justify-center">
          <ul className='text-[0.7rem]'>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/tiervermittlung">Tiervermittlung</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/ueber-uns">Über uns</Link></li>
          </ul>
        </nav>

        {isLoggedIn ? (
          <Link
            href={getDashboardLink()}
            className='sign-in-btn global-btn-bg justify-self-end'
          >
            {session.user.name || 'Benutzer'}
          </Link>
        ) : (
          <div className="flex gap-[0.5rem] justify-self-end">
            <Link href="/login" className='sign-in-btn global-btn-bg'>Anmelden</Link>
            <Link href="/shelter/login" className='sign-in-btn global-btn'>Als Tierheim anmelden</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
