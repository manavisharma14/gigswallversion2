'use client';

import { useEffect, useState } from 'react';
import {
  UserIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  ArrowLeftOnRectangleIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { name: 'Profile', icon: UserIcon },
  { name: 'Posted Gigs', icon: BriefcaseIcon },
  { name: 'Applied Gigs', icon: ClipboardDocumentCheckIcon },
];

export default function DashboardPage() {
  const [active, setActive] = useState('Profile');
  const [postedGigs, setPostedGigs] = useState<any[]>([]);
  const [appliedGigs, setAppliedGigs] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token'); // ⬅️ Move inside here
  
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setUsername(parsedUser.name);
    }
  
    if (!token) return;
  
    const fetchPosted = async () => {
      try {
        const res = await fetch('/api/dashboard/posted', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        console.log('Fetched posted gigs:', data);
        setPostedGigs(data.gigs || []);
      } catch (err) {
        console.error('Error fetching posted gigs:', err);
      }
    };
  
    const fetchApplied = async () => {
      try {
        const res = await fetch('/api/dashboard/applied', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAppliedGigs(data.applications || []);
      } catch (err) {
        console.error('Error fetching applied gigs:', err);
      }
    };
  
    fetchPosted();
    fetchApplied();
  }, []);
  

  const handleSaveUsername = () => {
    const updatedUser = { ...user, name: username };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setEditingUsername(false);
  };

  const renderContent = () => {
    switch (active) {
      case 'Profile':
        return (
          <div className="bg-white rounded-2xl shadow-lg mt-28 p-8 max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              {editingUsername ? (
                <>
                  <input
                    className="border rounded-md px-2 py-1 text-[#3B2ECC] text-lg font-bold text-center"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button onClick={handleSaveUsername} className="text-sm bg-[#3B2ECC] text-white px-3 py-1 rounded-md ml-2">
                    Save
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-extrabold text-[#3B2ECC]">Welcome, {username || 'User'}</h2>
                  <button onClick={() => setEditingUsername(true)}>
                    <PencilIcon className="h-5 w-5 text-[#3B2ECC]" />
                  </button>
                </>
              )}
            </div>

            <p className="text-gray-700">📧 <span className="font-medium">{user?.email}</span></p>
            {user?.college && (
              <p className="text-gray-600">🎓 College: <span className="font-medium break-words">{user.college}</span></p>
            )}
            <p className="text-gray-600">📅 Joined: <span className="font-medium">{user?.createdAt?.split('T')[0]}</span></p>

            <div className="pt-4 border-t mt-4 text-left space-y-2">
              <h3 className="text-xl font-semibold text-[#3B2ECC]">Activity Overview</h3>
              <ul className="text-gray-700 space-y-1 list-disc list-inside">
                <li>Total Gigs Posted: {postedGigs?.length || 0}</li>
                <li>Total Gigs Applied: {appliedGigs?.length || 0}</li>
                <li>Accepted Gigs: {appliedGigs?.filter((g) => g.status === 'Accepted')?.length || 0}</li>
              </ul>
            </div>
          </div>
        );

      case 'Posted Gigs':
        return (
          <div className="space-y-6 mt-20">
            <h2 className="text-3xl font-bold text-[#3B2ECC] mb-4">Your Posted Gigs</h2>
            {postedGigs?.length === 0 ? (
              <p className="text-gray-600 text-center">No gigs posted yet.</p>
            ) : (
              postedGigs.map((gig) => (
                <div key={gig.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#4B55C3]">{gig.title}</h3>
                  <p className="text-gray-700 mb-2">{gig.description}</p>
                  <div className="mt-4">
  <details className="text-sm text-gray-700">
    <summary className="cursor-pointer text-[#4B55C3] font-semibold">
      Applicants ({gig.applications?.length || 0})
    </summary>
    {gig.applications?.length > 0 ? (
      <ul className="mt-3 space-y-4">
        {gig.applications.map((app: any) => (
          <li key={app.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
            <p className="text-base font-medium text-[#3B2ECC]">{app.user?.name}</p>
            <p className="text-sm text-gray-600">📧 {app.user?.email}</p>
            <p className="text-sm text-gray-600">📝 Reason: {app.reason}</p>
            <p className="text-sm text-gray-600">⏱ Availability: {app.availability}</p>
            <p className="text-sm text-gray-600">🔗 Portfolio: 
              {app.portfolio ? (
                <a
                  href={app.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3B2ECC] underline ml-1"
                >
                  View
                </a>
              ) : (
                <span className="italic text-gray-400 ml-1">Not provided</span>
              )}
            </p>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-gray-500 mt-2">No applicants yet.</p>
    )}
  </details>
</div>

                </div>
              ))
            )}
          </div>
        );

      case 'Applied Gigs':
        return (
          <div className="space-y-6 mt-20">
            <h2 className="text-3xl font-bold text-[#3B2ECC] mb-4">Gigs You've Applied To</h2>
            {appliedGigs?.length === 0 ? (
              <p className="text-gray-600 text-center">You haven’t applied to any gigs yet.</p>
            ) : (
              appliedGigs.map((app) => (
                <div key={app.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                  <h3 className="text-lg font-semibold text-[#4B55C3]">{app.gig?.title}</h3>
                  <p className="text-sm text-gray-600">Reason: {app.reason}</p>
                  <p className="text-sm text-gray-500">Status: {app.status}</p>
                </div>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] font-bricolage">
      {/* Sidebar */}
      <aside className="z-20 w-64 bg-[#4B55C3] text-white flex flex-col py-6 relative">
        <h1 className="text-3xl font-extrabold text-center mb-8">GigsWall</h1>

        <nav className="flex flex-col gap-2 px-4">
          {menuItems.map((item) => {
            const isActive = active === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`flex items-center px-4 py-2 my-1 transition-all text-left w-full ${
                  isActive
                    ? 'bg-white text-[#3B2ECC] font-semibold rounded-l-full rounded-r-3xl ml-2 pr-6 shadow-md'
                    : 'text-white hover:bg-[#5A4ED3] rounded-lg'
                }`}
              >
                <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-[#3B2ECC]' : 'text-white'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto px-4 z-20">
          <button className="w-full mt-6 flex items-center justify-center py-2 bg-[#3B2ECC] hover:bg-[#5C53E5] rounded-xl font-semibold text-white transition">
            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto mt-8">
        {renderContent()}
      </main>
    </div>
  );
}
