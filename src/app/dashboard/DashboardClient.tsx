'use client';

import {
  UserIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  PencilIcon,
  Bars3Icon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

type Gig = {
  id: string;
  title: string;
  description: string;
  applications?: {
    id: string;
    reason: string;
    status: string;
    user?: {
      name: string;
      email: string;
    };
  }[];
};

type Application = {
  id: string;
  reason: string;
  status: string;
  gig?: {
    title: string;
  };
};

type User = {
  name?: string;
  email?: string;
  college?: string;
  createdAt?: string;
};

export default function DashboardClient({
  user,
  postedGigs,
  appliedGigs,
}: {
  user: User;
  postedGigs: Gig[];
  appliedGigs: Application[];
}) {
  const [active, setActive] = useState('Profile');
  const [username, setUsername] = useState(user?.name || '');
  const [editingName, setEditingName] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gigToDelete, setGigToDelete] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const menuItems = [
    { name: 'Profile', icon: UserIcon },
    { name: 'Posted Gigs', icon: BriefcaseIcon },
    { name: 'Applied Gigs', icon: ClipboardDocumentCheckIcon },
  ];

  const saveUsername = () => {
    const updated = { ...user, name: username };
    localStorage.setItem('user', JSON.stringify(updated));
    setEditingName(false);
  };

  const handleConfirmedDelete = async () => {
    if (!gigToDelete) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/dashboard/posted/${gigToDelete.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();
    if (res.ok) {
      setToast({ message: 'Gig deleted successfully.', type: 'success' });
      setTimeout(() => {
        setToast(null);
        window.location.reload();
      }, 2000);
    } else {
      setToast({ message: result.message || 'Failed to delete gig.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }

    setGigToDelete(null);
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
          <p className="text-gray-700">📧 <span className="font-medium">{user?.email || 'N/A'}</span></p>
          {user?.college && (
            <p className="text-gray-600">🎓 College: <span className="font-medium">{user.college}</span></p>
          )}
          <p className="text-gray-600">
            📅 Joined: <span className="font-medium">{user?.createdAt?.split('T')[0] || 'Unknown'}</span>
          </p>
          <div className="pt-4 border-t mt-4 text-left space-y-2">
            <h3 className="text-xl font-semibold text-[#3B2ECC]">Activity Overview</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Total Gigs Posted: {postedGigs.length}</li>
              <li>Total Gigs Applied: {appliedGigs.length}</li>
              <li>Accepted Gigs: {appliedGigs.filter(g => g.status === 'accepted').length}</li>
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
                <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
                <p className="text-gray-700 mb-2">{gig.description}</p>

                <button
                  onClick={() => setGigToDelete({ id: gig.id, title: gig.title })}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-600"
                  title="Delete gig"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

                <details className="text-sm text-gray-700 mt-2">
                  <summary className="cursor-pointer text-[#4B55C3] font-semibold">
                    Applicants ({gig.applications?.length || 0})
                  </summary>
                  {gig.applications?.length ? (
                    <ul className="mt-3 space-y-4">
                      {gig.applications.map((app) => (
                        <li key={app.id} className="p-3 border rounded-lg bg-gray-50 shadow-sm">
                          <p className="text-[#3B2ECC] font-medium">{app.user?.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-600">📧 {app.user?.email}</p>
                          <p className="text-xs text-gray-600">📝 {app.reason}</p>

                          {/* Status Buttons */}
                          <div className="flex gap-2 mt-2">
                            {['pending', 'accepted', 'rejected'].map((statusOption) => (
                              <button
                                key={statusOption}
                                onClick={async () => {
                                  const token = localStorage.getItem('token');
                                  const res = await fetch(`/api/applications/${app.id}/status`, {
                                    method: 'PATCH',
                                    headers: {
                                      'Content-Type': 'application/json',
                                      Authorization: `Bearer ${token}`,
                                    },
                                    body: JSON.stringify({ status: statusOption }),
                                  });
                                  const result = await res.json();
                                  if (res.ok) {
                                    setToast({ message: `Marked as ${statusOption}.`, type: 'success' });
                                    setTimeout(() => {
                                      setToast(null);
                                      window.location.reload();
                                    }, 2000);
                                  } else {
                                    setToast({ message: result.message || 'Failed to update status.', type: 'error' });
                                    setTimeout(() => setToast(null), 3000);
                                  }
                                }}
                                className={`text-xs px-3 py-1 rounded-md font-medium border ${
                                  app.status === statusOption
                                    ? statusOption === 'accepted'
                                      ? 'bg-green-100 border-green-600 text-green-700'
                                      : statusOption === 'rejected'
                                      ? 'bg-red-100 border-red-600 text-red-700'
                                      : 'bg-yellow-100 border-yellow-600 text-yellow-700'
                                    : 'text-gray-500 border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                {statusOption}
                              </button>
                            ))}
                          </div>

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
          Gigs You’ve Applied To
        </h2>
        {appliedGigs.length === 0 ? (
          <p className="text-center text-gray-600">You haven’t applied to any gigs yet.</p>
        ) : (
          appliedGigs.map(app => (
            <div key={app.id} className="bg-white p-5 md:p-6 rounded-xl shadow-md border">
              <h3 className="font-semibold text-lg text-[#4B55C3]">{app.gig?.title}</h3>
              <p className="text-sm text-gray-600">Reason: {app.reason}</p>
              <p className="text-sm mt-2">
                Status: <span className={`font-semibold ${
                  app.status === 'accepted' ? 'text-green-600' :
                  app.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {app.status}
                </span>
              </p>
            </div>
          ))
        )}
      </section>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] font-bricolage">
      {toast && (
        <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{toast.message}</div>
      )}
      {/* Sidebar logic */}

      {/* Mobile Sidebar */}
      <div className="md:hidden mt-28">
        <div className="flex justify-between items-center px-4">
          <button onClick={() => setSidebarOpen(prev => !prev)}>
            {sidebarOpen
              ? <XMarkIcon className="h-6 w-6" />
              : <Bars3Icon className="h-6 w-6 text-[#3B2ECC]" />}
          </button>
        </div>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setSidebarOpen(false)}>
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
        <div className="text-2xl font-extrabold px-2 mb-8">GigsWall</div>
        {menuItems.map(item => (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg transition
              ${active === item.name ? 'bg-white text-[#4B55C3] font-semibold shadow-md' : 'hover:bg-white/10'}`}
          >
            <item.icon className={`h-6 w-6 ${active === item.name ? 'text-[#4B55C3]' : 'text-white'}`} />
            <span className="text-lg">{item.name}</span>
          </button>
        ))}
      </aside>

      {/* Main Section */}
      <main className="flex-1 px-4 md:px-10 pb-10 mt-6 md:mt-8 overflow-y-auto">
        {renderContent()}
      </main>

      {/* ✅ Delete Modal */}
      {gigToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
            <h2 className="text-xl font-extrabold text-[#B91C1C]">Delete Gig?</h2>
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-semibold">&quot;{gigToDelete.title}&quot;</span>?
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
                onClick={() => setGigToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
                onClick={handleConfirmedDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
