'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">Honeypot App</div>
        <div>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className={`text-white ${pathname === '/' ? 'underline' : ''}`}>Home</Link>
            </li>
            <li>
              <Link href="/movies" className={`text-white ${pathname === '/movies' ? 'underline' : ''}`}>Movies</Link>
            </li>
            <li>
              <Link href="/actors" className={`text-white ${pathname === '/actors' ? 'underline' : ''}`}>Actors</Link>
            </li>
            <li>
              <Link href="/vulnerable" className={`text-white ${pathname === '/vulnerable' ? 'underline' : ''}`}>Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
