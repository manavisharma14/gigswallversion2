'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react'; // Icon library (or use any SVGs)

const staticLinks = [
  { href: '/', label: 'Home' },
  { href: '/post', label: 'Post' },
  { href: '/gigs', label: 'Apply' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setLoggedIn(true);
          setUserName(parsedUser.name || '');
        } catch (e) {
          console.error('Failed to parse user data from localStorage:', e);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/signin';
  };

  const navLinks = [
    ...staticLinks,
    ...(loggedIn ? [{ href: '/dashboard', label: 'Dashboard' }] : []),
    ...(!loggedIn ? [{ href: '/signup', label: 'Sign In / Sign Up' }] : []),
  ];

  return (
<nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl px-8 py-6 bg-white/90 shadow-xl border border-gray-200 backdrop-blur-xl rounded-full z-50 font-bricolage">
  <div className="flex justify-between items-center w-full">
    {/* Logo */}
    <h1 className="text-2xl font-bold text-[#3B2ECC] tracking-tight">GigsWall</h1>

    {/* Links */}
    <ul className="hidden md:flex items-center space-x-8 text-[15px] font-medium text-gray-800">
      <li><Link href="/">Home</Link></li>
      <li><Link href="/post">Post</Link></li>
      <li><Link href="/gigs">Apply</Link></li>
      {loggedIn ? (
        <>
          <li className="text-[#3B2ECC]">Hi {userName || 'there'} 👋</li>
          <li>
            <button onClick={handleLogout} className="hover:text-red-600 transition">
              Logout
            </button>
          </li>
        </>
      ) : (
        <li>
          <Link
            href="/signup"
            className="bg-[#3B2ECC] hover:bg-[#2d23b0] text-white font-semibold px-5 py-2 rounded-full transition"
          >
            Sign In / Sign Up
          </Link>
          
        </li>
      )}
    </ul>

    {/* Mobile Menu Icon */}
    <div className="md:hidden">
      <button onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  </div>

  {/* Mobile Dropdown */}
  {menuOpen && (
    <div className="md:hidden mt-4 bg-white border-t border-gray-200 py-4 px-6 shadow rounded-2xl">
      <ul className="flex flex-col space-y-4 text-base font-medium text-gray-800">
        <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link href="/post" onClick={() => setMenuOpen(false)}>Post</Link></li>
        <li><Link href="/gigs" onClick={() => setMenuOpen(false)}>Apply</Link></li>
        {loggedIn ? (
          <>
            <li className="text-[#3B2ECC]">Hi {userName || 'there'} 👋</li>
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="hover:text-red-600 transition"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              href="/signup"
              onClick={() => setMenuOpen(false)}
              className="bg-[#3B2ECC] text-white px-5 py-2 rounded-full"
            >
              Sign In / Sign Up
            </Link>
          </li>
        )}
      </ul>
    </div>
  )}
</nav>


  );
}
