'use client';

import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import {
  UserIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  PencilIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

/* ───── nav items ───── */
const menuItems = [
  { name: 'Profile', icon: UserIcon },
  { name: 'Posted Gigs', icon: BriefcaseIcon },
  { name: 'Applied Gigs', icon: ClipboardDocumentCheckIcon },
];

interface User {
  id: string;
  name: string;
  email: string;
  college?: string;
  createdAt: string;
}

interface Gig {
  id: string;
  title: string;
  description: string;
  applications?: Application[];
}

interface Application {
  id: string;
  reason: string;
  status: string;
  user?: {
    name: string;
    email: string;
  };
  gig?: {
    title: string;
  };
}

export default function DashboardPage() {
  const [active, setActive] = useState('Profile');
  const [postedGigs, setPostedGigs] = useState<Gig[]>([]);
  const [appliedGigs, setAppliedGigs] = useState<Application[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gigToDelete, setGigToDelete] = useState<Gig | null>(null); // modal control

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setUsername(parsed.name);
    }
    if (!token) return;

    const fetchData = async () => {
      const [pRes, aRes] = await Promise.all([
        fetch('/api/dashboard/posted', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/dashboard/applied', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const pData = await pRes.json();
      const aData = await aRes.json();
      setPostedGigs(pData.gigs || []);
      setAppliedGigs(aData.applications || []);
    };
    fetchData();
  }, []);

  const saveUsername = () => {
    if (!user) return;
    const updated = { ...user, name: username };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    setEditingName(false);
  };

  const handleDeleteGig = async (gigId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`/api/dashboard/posted/${gigId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPostedGigs(prev => prev.filter(gig => gig.id !== gigId));
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete gig.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Something went wrong.');
    }
  };

  const renderContent = () => {
    if (active === 'Profile') {
      return (
        <div className="bg-white rounded-2xl shadow-lg mt-20 p-6 md:p-8 max-w-3xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {editingName ? (
              <>
                <input
                  className="border rounded-md px-2 py-1 text-center text-lg font-bold text-[#3B2ECC]"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={saveUsername}
                  className="text-sm bg-[#3B2ECC] text-white px-3 py-1 rounded-md"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#3B2ECC]">
                  Welcome, {username || 'User'}
                </h2>
                <button onClick={() => setEditingName(true)}>
                  <PencilIcon className="h-5 w-5 text-[#3B2ECC]" />
                </button>
              </>
            )}
          </div>
          <p className="text-gray-700">📧 <span className="font-medium">{user?.email}</span></p>
          {user?.college && (
            <p className="text-gray-600">🎓 College: <span className="font-medium">{user.college}</span></p>
          )}
          <p className="text-gray-600">📅 Joined: <span className="font-medium">{user?.createdAt?.split('T')[0]}</span></p>
          <div className="pt-4 border-t mt-4 text-left space-y-2">
            <h3 className="text-xl font-semibold text-[#3B2ECC]">Activity Overview</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Total Gigs Posted: {postedGigs.length}</li>
              <li>Total Gigs Applied: {appliedGigs.length}</li>
              <li>Accepted Gigs: {appliedGigs.filter(g => g.status === 'Accepted').length}</li>
            </ul>
          </div>
        </div>
      );
    }

    if (active === 'Posted Gigs') {
      return (
        <section className="space-y-6 mt-20 px-1">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] mb-4 text-center md:text-left">
            Your Posted Gigs
          </h2>
          {postedGigs.length === 0 ? (
            <p className="text-center text-gray-600">No gigs posted yet.</p>
          ) : (
            postedGigs.map(gig => (
              <div key={gig.id} className="relative bg-white p-5 md:p-6 rounded-xl shadow-md border">
                <button
                  onClick={() => setGigToDelete(gig)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-600 hover:scale-110 transition-transform"
                  title="Delete gig"
                >
                  <Trash2 size={20} />
                </button>
                <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
                <p className="text-gray-700 mb-2">{gig.description}</p>
                <details className="text-sm text-gray-700 mt-2">
                  <summary className="cursor-pointer text-[#4B55C3] font-semibold">
                    Applicants ({gig.applications?.length || 0})
                  </summary>
                  {gig.applications?.length ? (
                    <ul className="mt-3 space-y-4">
                      {gig.applications.map((app: Application) => (
                        <li key={app.id} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                          <p className="text-[#3B2ECC] font-medium">{app.user?.name}</p>
                          <p className="text-xs text-gray-600">📧 {app.user?.email}</p>
                          <p className="text-xs text-gray-600">📝 {app.reason}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs mt-2 text-gray-500">No applicants yet.</p>
                  )}
                </details>
              </div>
            ))
          )}
        </section>
      );
    }

    return (
      <section className="space-y-6 mt-20 px-1">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] mb-4 text-center md:text-left">
          Gigs You&rsquo;ve Applied To
        </h2>
        {appliedGigs.length === 0 ? (
          <p className="text-center text-gray-600">You haven&rsquo;t applied to any gigs yet.</p>
        ) : (
          appliedGigs.map(app => (
            <div key={app.id} className="bg-white p-5 md:p-6 rounded-xl shadow-md border">
              <h3 className="font-semibold text-lg text-[#4B55C3]">{app.gig?.title}</h3>
              <p className="text-sm text-gray-600">Reason: {app.reason}</p>
            </div>
          ))
        )}
      </section>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] font-bricolage">
        {/* Mobile Nav */}
        <div className="md:hidden mt-28">
          <div className="flex justify-between items-center px-4 text-white">
            <button onClick={() => setSidebarOpen(o => !o)}>
              {sidebarOpen
                ? <XMarkIcon className="h-6 w-6" />
                : <Bars3Icon className="h-6 w-6 text-[#3B2ECC]" />}
            </button>
          </div>
          {sidebarOpen && (
            <div className="fixed inset-0 z-[100] flex flex-col" onClick={() => setSidebarOpen(false)}>
              <div className="flex-1 bg-black/40 backdrop-blur-sm" />
              <div className="bg-[#4B55C3] text-white px-4 py-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                {menuItems.map(item => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActive(item.name);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 mb-2 rounded-lg transition
                      ${active === item.name ? 'bg-white text-[#3B2ECC]' : 'hover:bg-[#5A4ED3]'}`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${active === item.name ? 'text-[#3B2ECC]' : 'text-white'}`} />
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-64 bg-[#4B55C3] text-white py-12 px-4 space-y-4 shadow-xl">
          <div className="text-2xl font-extrabold text-white px-2 mb-8">GigsWall</div>
          {menuItems.map(item => {
            const isActive = active === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg transition
                  ${isActive ? 'bg-white text-[#4B55C3] font-semibold shadow-md' : 'hover:bg-white/10 text-white'}`}
              >
                <item.icon className={`h-6 w-6 ${isActive ? 'text-[#4B55C3]' : 'text-white'}`} />
                <span className="text-lg">{item.name}</span>
              </button>
            );
          })}
        </aside>

        <main className="flex-1 px-4 md:px-10 pb-10 mt-6 md:mt-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>

      {/* Delete Modal */}
      {gigToDelete && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-[90%] max-w-md text-center relative space-y-4 border border-[#E0E7FF]">
      <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-gradient-to-br from-[#667EEA] to-[#A991F7] shadow-lg">
        <Trash2 className="text-white" size={28} />
      </div>

      <h3 className="text-2xl font-bold text-[#3B2ECC]">Are you sure?</h3>
      <p className="text-gray-600 px-3">
        You’re about to delete <span className="font-semibold text-[#4B55C3]">{gigToDelete.title}</span>. This action cannot be undone.
      </p>

      <div className="flex justify-center gap-4 pt-2">
        <button
          onClick={() => {
            handleDeleteGig(gigToDelete.id);
            setGigToDelete(null);
          }}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:brightness-110 transition"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setGigToDelete(null)}
          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}
