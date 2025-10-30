'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserIcon, BriefcaseIcon, ClipboardDocumentCheckIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const menuItems = [
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Posted Gigs', href: '/dashboard/posted', icon: BriefcaseIcon },
  { name: 'Applied Gigs', href: '/dashboard/applied', icon: ClipboardDocumentCheckIcon, requiresStudent: true },
];

export default function DashboardSidebar({ userType }: { userType: 'student' | 'business' | 'other' }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = menuItems.filter(item => !item.requiresStudent || userType === 'student');

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 mt-20 left-4 z-50">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2">
         {mobileOpen ? <XMarkIcon className="h-6 w-6 text-[#3B2ECC]" /> : <Bars3Icon className="h-6 w-6 text-[#3B2ECC]" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" onClick={() => setMobileOpen(false)}>
          <div className="flex-1 bg-black/40" />
          <div className="w-64 bg-[#4B55C3] text-white p-6" onClick={e => e.stopPropagation()}>
            {filteredItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${isActive ? 'bg-white text-[#4B55C3]' : 'hover:bg-white/10'}`}>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#4B55C3]' : 'text-white'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#4B55C3] text-white py-12 px-4 space-y-4 shadow-xl">
        {filteredItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg transition ${isActive ? 'bg-white text-[#4B55C3] font-semibold shadow-md' : 'hover:bg-white/10'}`}>
              <Icon className={`h-6 w-6 ${isActive ? 'text-[#4B55C3]' : 'text-white'}`} />
              <span className="text-lg">{item.name}</span>
            </Link>
          );
        })}
      </aside>
    </>
  );
}