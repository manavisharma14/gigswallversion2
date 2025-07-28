'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import {
  Menu,
  X,
  LogIn,
  ChevronDown,
  UserCircle
} from 'lucide-react';
import logo from '../../public/assets/logo.png';

export default function Navbar() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateAuthState = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setLoggedIn(true);
          setUserName(parsedUser.name || '');
        } catch (e) {
          console.error('Failed to parse user data:', e);
          setLoggedIn(false);
          setUserName('');
        }
      } else {
        setLoggedIn(false);
        setUserName('');
      }
    };

    updateAuthState();
    window.addEventListener('storageChanged', updateAuthState);
    return () => window.removeEventListener('storageChanged', updateAuthState);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' }); // Clears cookie
    } catch (e) {
      console.error('Logout error:', e);
    }
  
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storageChanged'));
    window.location.href = '/signin';
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 font-bricolage">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="GigsWall Logo" width={130} height={130} priority />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 text-[16px] font-semibold text-gray-800">
          <li><Link href="/" className="relative underline-hover">Home</Link></li>
          <li><Link href="/#about" className="relative underline-hover">About</Link></li>
          <li><Link href="/post" className="relative underline-hover">Post</Link></li>
          <li><Link href="/gigs" className="relative underline-hover">Apply</Link></li>
          {loggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-[#4B55C3] font-semibold"
              >
                <UserCircle size={18} />
                <span>{userName || 'User'}</span>
                <ChevronDown size={16} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <li>
              <Link
                href="/signin"
                className="flex items-center gap-2 bg-[#4B55C3] hover:bg-[#3d49ad] text-white font-semibold px-5 py-2 rounded-full transition"
              >
                <LogIn size={18} />
                Sign In
              </Link>
            </li>
          )}
        </ul>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#4B55C3] p-2">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 py-5 border-t border-gray-200 bg-white shadow-md text-gray-800">
          <ul className="flex flex-col space-y-4 text-base font-semibold">
            <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link href="/#about" onClick={() => setMenuOpen(false)}>About</Link></li>
            <li><Link href="/post" onClick={() => setMenuOpen(false)}>Post</Link></li>
            <li><Link href="/gigs" onClick={() => setMenuOpen(false)}>Apply</Link></li>
            {loggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <li>
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 bg-[#4B55C3] text-white px-5 py-2 rounded-full"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
