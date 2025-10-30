'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export default function DashboardLayout({
  children,
  menuItems,
  active,
  setActive,
}: {
  children: React.ReactNode;
  menuItems: { name: string; icon: IconType }[];
  active: string;
  setActive: (name: string) => void;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] font-bricolage">
      {/* Mobile Header */}
      <div className="md:hidden mt-28 px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6 text-[#3B2ECC]" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setSidebarOpen(false)}>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" />
          <div className="bg-[#4B55C3] text-white px-4 py-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            {menuItems.map(item => (
              <button
                key={item.name}
                onClick={() => { setActive(item.name); setSidebarOpen(false); }}
                className={`flex items-center w-full px-3 py-2 mb-2 rounded-lg transition ${
                  active === item.name ? 'bg-white text-[#3B2ECC]' : 'hover:bg-[#5A4ED3]'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${active === item.name ? 'text-[#3B2ECC]' : 'text-white'}`} />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[#4B55C3] text-white py-12 px-4 space-y-4 shadow-xl">
        {menuItems.map(item => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg transition ${
              active === item.name ? 'bg-white text-[#4B55C3] font-semibold shadow-md' : 'hover:bg-white/10'
            }`}
          >
            <item.icon className={`h-6 w-6 ${active === item.name ? 'text-[#4B55C3]' : 'text-white'}`} />
            <span className="text-lg">{item.name}</span>
          </button>
        ))}
      </aside>

      <main className="flex-1 px-4 md:px-10 pb-10 mt-6 md:mt-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}