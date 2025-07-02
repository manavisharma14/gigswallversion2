// components/Sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Users, Lock, Settings, HelpCircle } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: <Home size={20} /> },
  { name: 'User Control', href: '/dashboard/user-control', icon: <Users size={20} /> },
  { name: 'Access Request', href: '/dashboard/access-request', icon: <Lock size={20} /> },
  { name: 'Admin', href: '/dashboard/admin', icon: <Settings size={20} /> },
  { name: 'Support', href: '/dashboard/support', icon: <HelpCircle size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="bg-green-700 text-white h-screen w-64 flex flex-col p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-6">🎓 GigsWall</h2>
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.name} href={item.href} className="relative">
            <div className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300
              ${isActive ? 'bg-white text-green-700 font-semibold shadow-md' : 'hover:bg-green-600'}
              ${isActive ? 'before:content-[""] before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:h-12 before:w-4 before:bg-white before:rounded-r-full' : ''}
            `}>
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
