'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LogIn,
  ChevronDown,
  UserCircle,
} from 'lucide-react';
import logo from '../../public/assets/newlogo.png';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();
  const loggedIn = !!user;
  const userName = user?.name || '';
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }

    localStorage.clear();
    window.dispatchEvent(new Event('storageChanged'));
    router.push('/signin');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 font-bricolage">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="GigsWall Logo"
            width={80}
            height={80}
            sizes="(max-width: 768px) 100px, 130px"
            priority
          />
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
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-[#4B55C3] font-semibold"
              >
                <UserCircle size={18} />
                <span>{userName}</span>
                <ChevronDown size={16} />
              </button>
              <div
                className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 transform transition-all duration-200 ${
                  dropdownOpen
                    ? 'scale-100 opacity-100'
                    : 'scale-95 opacity-0 pointer-events-none'
                }`}
              >
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
          <button
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[#4B55C3] p-2"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu with Backdrop */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          <div className="md:hidden fixed top-0 right-0 w-2/3 h-screen bg-white shadow-lg z-50 transition-transform duration-300 p-6">
            <ul className="flex flex-col space-y-6 text-base font-semibold text-gray-800 mt-10">
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
                    className="flex items-center gap-2 bg-[#4B55C3] hover:bg-[#3d49ad] text-white px-5 py-2 rounded-full"
                  >
                    <LogIn size={18} />
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}