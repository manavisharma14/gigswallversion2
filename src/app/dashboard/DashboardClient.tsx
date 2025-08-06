/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import ChatComponent from '../../components/ChatComponent';
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  UserIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  PencilIcon,
  Bars3Icon,
  XMarkIcon,
  TrashIcon,
  CameraIcon,
} from '@heroicons/react/24/outline';

type Gig = {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  college: string;
  isOpen: boolean;
  status: string;
  createdAt: string;
  postedById: string;
  postedBy?: User;
  applications?: Application[];
  applicantId?: string;
};

type Application = {
  id: string;
  reason: string;
  status: string;
  gigId: string;
  userId: string;
  user?: User;
  gig?: Gig;
};

type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Usually omitted when sending to frontend
  phone?: string;
  college: string;
  department: string;
  gradYear: string;
  gigPreference?: 'finder' | 'poster' | 'both'; // from Prisma enum
  type?: 'student' | 'other'; // matches UserType enum
  isVerified?: boolean;
  otpCode?: string;
  otpExpires?: string;
  createdAt?: string;
  updatedAt?: string;
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
  // const [profile, setProfile] = useState<User>(user); // includes extended fields
// const [username, setUsername] = useState(user?.name || '');
  // const [editingName, setEditingName] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [gigToDelete, setGigToDelete] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [openChatForGig, setOpenChatForGig] = useState<string | null>(null); // composite key: gigId_userId
  const [chatEligibilityMap, setChatEligibilityMap] = useState<Record<string, boolean>>({});
  const [chatAllowed, setChatAllowed] = useState({});

  const profile = user;

  

  // Save userId to localStorage for ChatComponent
  // useEffect(() => {
  //   const fetchProfile = async () => {

  //    const token = localStorage.getItem('token');   // may be null
  
  //     const res = await fetch('/api/dashboard/profile', {
  //      headers: token ? { Authorization: `Bearer ${token}` } : {},
  //      credentials: 'include',           // ❷ send the cookie
  //     });
  
  //     if (!res.ok) {
  //       console.error('Failed profile:', await res.text());
  //       return;
  //     }
  //     const data = await res.json();
  //     setProfile(data);
  //     setUsername(data.name ?? '');
  //   };
  
  //   fetchProfile();
  // }, []);

  const menuItems = [
    { name: 'Profile', icon: UserIcon },
    { name: 'Posted Gigs', icon: BriefcaseIcon },
    ...(user?.type === 'student' ? [{ name: 'Applied Gigs', icon: ClipboardDocumentCheckIcon }] : []),
  ];

  // const saveUsername = () => {
  //   const updated = { ...user, name: user.name };
  //   localStorage.setItem('user', JSON.stringify(updated));
  //   setEditingName(false);
  // };

  const checkIfChatStarted = async (roomId: string) => {
  const chatDocRef = doc(db, "chats", roomId);
  const chatDoc = await getDoc(chatDocRef);
  return chatDoc.exists();
};

  

  const handleConfirmedDelete = async () => {
    if (!gigToDelete) return;
    const token = localStorage.getItem('token');

    const res = await fetch(`/api/dashboard/posted/${gigToDelete.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
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

  const toggleChat = (chatKey: string) => {
    setOpenChatForGig((prev) => (prev === chatKey ? null : chatKey));
  };


  // const handlePayment = async (gigTitle: string, amount: number) => {
  //   const res = await fetch("/api/payment/checkout-session", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ gigTitle, amount }),
  //   });
  
  //   const data = await res.json();
  //   if (data.url) {
  //     window.location.href = data.url;
  //   }
  // };

  

  const hasPosterStartedChat = async (gigId: string, posterId: string, applicantId: string) => {
    const roomId = `${gigId}_${posterId}_${applicantId}`;
    const docRef = doc(db, "chats", roomId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  
  const renderContent = () => {
    if (active === 'Profile') {

    
      const ProfileItem = ({ label, value }: { label: string; value: string | undefined }) => (
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="font-medium text-gray-900">{value || 'N/A'}</p>
        </div>
      );
    
      
      if (!profile) {
        console.log(profile)
        return (
          <div className="mt-40 text-center text-gray-500">
            Loading profile…
          </div>
        );
      }
      // 🛡️ 2. NOW IT’S SAFE TO USE profile.type
      const isStudent = profile.type === 'student';
    
      return (
        <div className="max-w-5xl mx-auto mt-12 px-4 mt-40">
          <div className="bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
            
            {/* Left: Profile Card */}
            <div className="bg-[#4B55C3] text-white flex flex-col items-center py-10 px-6">
              <div className="relative w-28 h-28 rounded-full border-4 border-white overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
                {/* <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md cursor-pointer">
                  <CameraIcon className="w-5 h-5 text-[#3B2ECC]" />
                  <input type="file" hidden />
                </label> */}
              </div>
    
              {/* Name & Email */}
              <div className="mt-4 text-center">
                <div className="flex justify-center items-center gap-2">
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  {/* <button onClick={() => setEditingName(true)}>
                    <PencilIcon className="w-5 h-5" />
                  </button> */}
                </div>
                <p className="text-sm opacity-90">{profile?.email}</p>

              </div>
            </div>
    
            {/* Right: Conditional Profile Details */}
            <div className="col-span-2 p-8 space-y-6">
              {isStudent ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <ProfileItem label="College" value={profile.college} />
                    <ProfileItem label="Department" value={profile.department} />
                    <ProfileItem label="Graduation Year" value={profile.gradYear} />
                    <ProfileItem label="Phone" value={profile.phone} />
                    <ProfileItem label="Joined On" value={profile.createdAt?.split("T")[0]} />
                  </div>
    
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-[#3B2ECC] mb-2">
                      Activity Overview
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>Total Gigs Posted: {postedGigs.length}</li>
                      <li>Total Gigs Applied: {appliedGigs.length}</li>
                      <li>
                        Accepted Gigs:{" "}
                        {appliedGigs.filter((g) => g.status === "accepted").length}
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
  <ProfileItem label="Total Gigs Posted" value={String(postedGigs.length)} />
  <ProfileItem label="Joined On" value={profile.createdAt?.split("T")[0]} />
</div>
              )}
            </div>
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
    postedGigs.map((gig) => (
<div key={gig.id} className="relative bg-white p-5 md:p-6 rounded-xl shadow-md border  md:gap-6">        {/* Gig Info */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
          <p className="text-gray-700">{gig.description}</p>
        </div>

        {/* Top Right Delete Button */}
        <button
          onClick={() => setGigToDelete({ id: gig.id, title: gig.title })}
          className="absolute top-3 right-3 text-red-500 hover:text-red-600"
          title="Delete gig"
        >
          <TrashIcon className="h-5 w-5" />
        </button>

        {/* Applicants */}
        <div className="md:col-span-2 mt-4">
          <details className="text-sm text-gray-700">
            <summary className="cursor-pointer text-[#4B55C3] font-semibold">
              Applicants ({gig.applications?.length || 0})
            </summary>

            {gig.applications?.length ? (
              <ul className="mt-3 space-y-4">
                {gig.applications.map((app) => {
                  const recipient = app.userId;
                  const chatKey = `${gig.id}_${app.userId}`;

                  return (
                    <li key={app.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm md:flex md:items-start md:justify-between md:gap-6">
                      {/* Applicant Info */}
                      <div className="flex-1 space-y-1">
                        <p className="text-[#3B2ECC] font-medium">{app.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-600">📧 {app.user?.email}</p>
                        <p className="text-xs text-gray-600">📝 {app.reason}</p>

                        {/* Status Buttons */}
                        <div className="flex flex-wrap gap-2 mt-2">
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
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 md:mt-0 flex flex-col gap-2 items-end md:w-52">
                        <button
                          onClick={() => toggleChat(chatKey)}
                          className="text-sm text-[#3B2ECC] hover:underline"
                        >
                          Open Chat
                        </button>

                        {/* <button
                          onClick={() => handlePayment("Custom Logo Design", 25)}
                          className="bg-purple-600 px-4 py-2 text-white rounded text-sm"
                        >
                          Pay $25
                        </button> */}
                      </div>

                      {/* Chat Component */}
                      {openChatForGig === chatKey && (
                        <div className="mt-3 md:col-span-2">
                          <ChatComponent
                            gigId={gig.id}
                            applicantId={app.userId}
                            posterId={gig.postedById}
                            recipient={recipient}
                            setOpenChatForGig={setOpenChatForGig}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs mt-2 text-gray-500">No applicants yet.</p>
            )}
          </details>
        </div>
      </div>
    ))
  )}
</section>
      );
    }

    // Applied Gigs View

//     if (active === 'Applied Gigs') {
//       if (user.type !== 'student') return null;
//     return (
//       <section className="space-y-6 mt-20 px-1">
//         <h2 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] mb-4 text-center md:text-left">
//           Gigs You’ve Applied To
//         </h2>
//         {appliedGigs.length === 0 ? ( 
//           <p className="text-center text-gray-600">You haven’t applied to any gigs yet.</p>
//         ) : (
//           appliedGigs.map((app) => {
//             const gig = app.gig;
//             if (!gig) return null;
//             const recipient = gig.postedBy?.id || gig.postedById;
//             const chatKey = `${gig.id}_${user.id}`;
//             console.log(recipient);

//             return (
//               <div key={`${app.id}-${gig.id}`} className="bg-white p-5 md:p-6 rounded-xl shadow-md border">
//                 <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
//                 <p className="text-sm text-gray-600">Reason: {app.reason}</p>
//                 <p className="text-sm mt-2">
//                   Status:{' '}
//                   <span
//                     className={`font-semibold ${
//                       app.status === 'accepted'
//                         ? 'text-green-600'
//                         : app.status === 'rejected'
//                         ? 'text-red-600'
//                         : 'text-yellow-600'
//                     }`}
//                   >
//                     {app.status}
//                   </span>
//                 </p>

//                 {/* <button
// onClick={async () => {
//   const allowed = await hasPosterStartedChat(gig.id, recipient, user.id);
//   if (allowed) {
//     toggleChat(chatKey);
//     setChatEligibilityMap((prev) => ({ ...prev, [chatKey]: true }));
//   } else {
//     setToast({ message: "Chat not available until poster initiates it.", type: 'error' });
//     setTimeout(() => setToast(null), 3000);
//   }
// }}
//   className="text-[#3B2ECC] hover:underline mt-3"
// >
//   Open Chat
// </button> */}


// {/* {app.status === 'accepted' && (
//   <> */}
//     <button
//       onClick={() => toggleChat(chatKey)}
//       className="text-[#3B2ECC] hover:underline mt-3"
//     >
//       Open Chat
//     </button>

//     {openChatForGig === chatKey && (
//       <ChatComponent
//         gigId={gig.id}
//         applicantId={user.id}
//         posterId={recipient}
//         recipient={recipient}
//         setOpenChatForGig={setOpenChatForGig}
//       />
//   //   )}
//   // </>
// )}

                

//                 {openChatForGig === chatKey && (gig.postedBy?.id || gig.postedById) && chatEligibilityMap[chatKey] &&(
//   <ChatComponent
//     key={chatKey}
//     gigId={gig.id}
//     applicantId={user.id}
//     posterId={gig.postedBy?.id || gig.postedById}
//     recipient={recipient}
//     setOpenChatForGig={setOpenChatForGig}
//   />
// )}
//               </div>
//             );
//           })
//         )}
//       </section>
//     );
//   };

if (active === 'Applied Gigs') {
  if (user.type !== 'student') return null;

  return (
    <section className="space-y-6 mt-20 px-1">
      <h2 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] mb-4 text-center md:text-left">
        Gigs You’ve Applied To
      </h2>

      {appliedGigs.length === 0 ? (
        <p className="text-center text-gray-600">You haven’t applied to any gigs yet.</p>
      ) : (
        appliedGigs.map((app) => {
          const gig = app.gig;
          if (!gig) return null;

          const posterId = gig.postedBy?.id || gig.postedById;
          const chatKey = `${gig.id}_${posterId}_${user.id}`;
          const recipient = posterId;

          return (
            <div key={`${app.id}-${gig.id}`} className="bg-white p-5 md:p-6 rounded-xl shadow-md border">
              <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
              <p className="text-sm text-gray-600">Reason: {app.reason}</p>
              <p className="text-sm mt-2">
                Status:{' '}
                <span
                  className={`font-semibold ${
                    app.status === 'accepted'
                      ? 'text-green-600'
                      : app.status === 'rejected'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {app.status}
                </span>
              </p>

              {/* {app.status === 'accepted' && ( */}
                <button
                  onClick={async () => {
                    const allowed = await hasPosterStartedChat(gig.id, posterId, user.id);
                    if (allowed) {
                      setOpenChatForGig(chatKey);
                    } else {
                      setToast({
                        message: 'Chat not available until the poster initiates it.',
                        type: 'error',
                      });
                      setTimeout(() => setToast(null), 3000);
                    }
                  }}
                  className="text-[#3B2ECC] hover:underline mt-3"
                >
                  Open Chat
                </button>
              {/* ) */}
              {/* } */}

              {openChatForGig === chatKey && (
                <ChatComponent
                  key={chatKey}
                  gigId={gig.id}
                  applicantId={user.id}
                  posterId={posterId}
                  recipient={recipient}
                  setOpenChatForGig={setOpenChatForGig}
                />
              )}
            </div>
          );
        })
      )}
    </section>
  );
}
};


return (
  <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] font-bricolage">
    {toast && (
      <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{toast.message}</div>
    )}
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

    <aside className="hidden md:flex md:flex-col md:w-64 bg-[#4B55C3] text-white py-12 px-4 space-y-4 shadow-xl">
      <div className="text-2xl font-extrabold px-2 mb-8"></div>
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
    <main className="flex-1 px-4 md:px-10 pb-10 mt-6 md:mt-8 overflow-y-auto">
      {renderContent()}
    </main>

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