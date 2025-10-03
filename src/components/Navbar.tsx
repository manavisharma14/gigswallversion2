'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, LogIn, ChevronDown, UserCircle } from 'lucide-react';
import whiteLogo from '../../public/assets/whitelogo.png';
import purpleLogo from '../../public/assets/purplelogo.png';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const loggedIn = !!user;
  const userName = user?.name ?? '';
  const isLanding = pathname === '/';

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Hide/show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowNavbar(false); // scrolling down → hide
      } else {
        setShowNavbar(true); // scrolling up → show
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setDropdownOpen(false);
      logout();
      router.replace('/signin');
    }
  };

  return (
    <nav
      className={`w-full z-50 fixed top-0 left-0 transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${isLanding ? 'bg-transparent' : 'bg-white shadow-sm'}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 font-bricolage">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src={isLanding ? whiteLogo : purpleLogo}
            alt="GigsWall Logo"
            width={80}
            height={80}
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <ul
  className={`hidden md:flex items-center space-x-8 text-[16px] font-semibold ${
    isLanding ? 'text-white' : 'text-gray-800'
  }`}
>
  {[
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/post', label: 'Post' },
    { href: '/gigs', label: 'Apply' },
    { href: '/blog', label: 'Blog' },
  ].map((item) => (
    <li key={item.href}>
      <Link
        href={item.href}
        className={`px-4 py-2 rounded-2xl transition-colors duration-200 ${
          isLanding
            ? 'hover:bg-white/10 hover:text-white'
            : 'hover:bg-gray-100 hover:text-[#4B55C3]'
        }`}
      >
        {item.label}
      </Link>
    </li>
  ))}

  {loggedIn ? (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-haspopup="menu"
        aria-expanded={dropdownOpen}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2 font-semibold px-3 py-1 rounded-md transition-colors duration-200 ${
          isLanding
            ? 'hover:bg-white/10 hover:text-white'
            : 'hover:bg-gray-100 hover:text-[#4B55C3]'
        }`}
      >
        <UserCircle size={18} />
        <span>{userName}</span>
        <ChevronDown size={16} />
      </button>
      <div
        role="menu"
        className={`absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50 transform transition-all duration-200 ${
          dropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >
        <Link
          href="/dashboard"
          role="menuitem"
          onClick={() => setDropdownOpen(false)}
          className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
        >
          Dashboard
        </Link>
        <button
          role="menuitem"
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
            className={`${isLanding ? 'text-white' : 'text-[#4B55C3]'} p-2`}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>
    </nav>
  );
}