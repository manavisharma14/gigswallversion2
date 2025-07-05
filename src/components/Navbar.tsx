'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import logo from "../../public/assets/logo.png"

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storageChanged'));
    window.location.href = '/signin';
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl px-6 py-4 bg-white/90 shadow-xl border border-gray-200 backdrop-blur-xl z-50 font-bricolage rounded-xl md:rounded-full">
      <div className="flex justify-between items-center w-full">
        {/* Logo only (no text) */}
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="GigsWall Logo" width={130} height={130} priority />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 text-[16px] font-semibold text-gray-800">
          <li><Link href="/" className="relative underline-hover">Home</Link></li>
          <li><Link href="/#about" className="relative underline-hover">About</Link></li>
          <li><Link href="/post" className="relative underline-hover">Post</Link></li>
          <li><Link href="/gigs" className="relative underline-hover">Apply</Link></li>
          {loggedIn && (
            <li><Link href="/dashboard" className="relative underline-hover">Dashboard</Link></li>
          )}
          {loggedIn ? (
            <>
              <li className="text-[#4B55C3] font-semibold">Hi {userName || 'there'} 👋</li>
              <li>
                <button onClick={handleLogout} className="hover:text-red-600 transition font-semibold">
                  Logout
                </button>
              </li>
            </>
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
        <div className="md:hidden absolute top-[70px] left-0 w-full bg-white shadow-xl px-6 py-5 border-t border-gray-200 z-40">
          <ul className="flex flex-col space-y-4 text-base font-semibold text-gray-800">
            <li><Link href="/" onClick={() => setMenuOpen(false)} className="relative underline-hover">Home</Link></li>
            <li><Link href="/#about" onClick={() => setMenuOpen(false)} className="relative underline-hover">About</Link></li>
            <li><Link href="/post" onClick={() => setMenuOpen(false)} className="relative underline-hover">Post</Link></li>
            <li><Link href="/gigs" onClick={() => setMenuOpen(false)} className="relative underline-hover">Apply</Link></li>
            {loggedIn && (
              <li><Link href="/dashboard" onClick={() => setMenuOpen(false)} className="relative underline-hover">Dashboard</Link></li>
            )}
            {loggedIn ? (
              <>
                <li className="text-[#4B55C3]">Hi {userName || 'there'} 👋</li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="text-red-600 hover:underline text-left font-semibold"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-[#4B55C3] text-white px-5 py-2 rounded-full text-center"
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
