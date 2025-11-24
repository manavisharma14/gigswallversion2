"use client";

import { useState, useEffect, useRef } from "react";
import { UserCircle, ChevronDown, LogIn, Menu } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface Props {
  loggedIn: boolean;
  userName: string;
  userId: string | null;
  isMobile?: boolean;
}

export default function NavbarClient({ loggedIn, userName, userId, isMobile = false }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    if (loggedIn && userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.removeItem("userId");
    }
  }, [loggedIn, userId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="flex items-center gap-4 relative w-full z-50">
      {/* ---------- DESKTOP NAV ---------- */}
      {!isMobile && (
        <div ref={dropdownRef}>
          {!loggedIn ? (
            <Link href="/signin" className="flex items-center gap-2 bg-[#4B55C3] text-white px-5 py-2 rounded-full">
              <LogIn size={18} /> Sign In
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex gap-2 items-center px-3 py-2"
              >
                <UserCircle size={18} />
                <span className="truncate max-w-[120px]">{userName}</span>
                <ChevronDown size={16} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow border rounded-md z-50">
                  <Link href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                    Dashboard
                  </Link>

                  {/* Admin Panel — insert when ready */}
                  {/* {session?.user?.email === ADMIN && (
                    <Link href="/admin/escrow" className="block px-4 py-2 text-indigo-600 hover:bg-indigo-50">
                      Admin Panel
                    </Link>
                  )} */}

                  <button
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------- MOBILE MENU DROPDOWN ---------- */}
      {mobileMenuOpen && isMobile && (
  <div className="fixed top-[60px] left-0 w-full bg-white shadow-md border-t flex flex-col items-end z-50">
          <div className="w-full flex flex-col items-end space-y-2 p-4">
            <Link href="/" className="px-4 py-2 text-gray-800 hover:bg-gray-50">Home</Link>
            <Link href="/about" className="px-4 py-2 text-gray-800 hover:bg-gray-50">About</Link>
            <Link href="/post" className="px-4 py-2 text-gray-800 hover:bg-gray-50">Post</Link>
            <Link href="/gigs" className="px-4 py-2 text-gray-800 hover:bg-gray-50">Apply</Link>
            <Link href="/blog" className="px-4 py-2 text-gray-800 hover:bg-gray-50">Blog</Link>
          </div>

          <div className="w-full border-t p-4">
            {!loggedIn ? (
              <Link
                href="/signin"
                className="px-4 py-3 text-[#4B55C3] font-semibold hover:bg-gray-50 block w-full text-right"
              >
                Sign In
              </Link>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-50 text-right"
                >
                  Dashboard
                </Link>

                {/* Admin */}
                {/* {loggedIn && session?.user?.email === ADMIN && (
                  <Link
                    href="/admin/escrow"
                    className="block px-4 py-2 text-indigo-600 hover:bg-indigo-50 font-medium text-right"
                  >
                    Admin Panel
                  </Link>
                )} */}

                <button
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                  className="block w-full text-right px-4 py-2 text-red-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ---------- MOBILE HAMBURGER BUTTON ---------- */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
        >
          <Menu size={24} />
        </button>
      )}
    </nav>
  );
}