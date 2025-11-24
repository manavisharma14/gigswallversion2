// // src/components/dashboard/DashboardClient.tsx
// 'use client';

// import { useState } from 'react';
// import { format } from 'date-fns';
// import ChatComponent from './ChatComponent';
// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import {
//   UserIcon,
//   BriefcaseIcon,
//   ClipboardDocumentCheckIcon,
//   TrashIcon,
//   Bars3Icon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline';

// // ---------------------------------------------------------------
// // 1. Use the *extended* Prisma types that include relations
// // ---------------------------------------------------------------
// import {
//   Gig,
//   ApplicationWithRelations,
//   User,
// } from '@/types/prisma';

// type MenuItem = 'Profile' | 'Posted Gigs' | 'Applied Gigs';

// export default function DashboardClient({
//   user,
//   postedGigs,
//   appliedGigs,
// }: {
//   user: User;
//   /** postedGigs now contain `applications` (with user) */
//   postedGigs: (Gig & { applications: ApplicationWithRelations[] })[];
//   appliedGigs: ApplicationWithRelations[];
// }) {
//   // ---------------------------------------------------------------
//   // 2. State – typed to the exact menu strings
//   // ---------------------------------------------------------------
//   const [active, setActive] = useState<MenuItem>('Profile');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [gigToDelete, setGigToDelete] = useState<{ id: string; title: string } | null>(null);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
//   const [openChatForGig, setOpenChatForGig] = useState<string | null>(null);

//   // ---------------------------------------------------------------
//   // 3. Guard – redirect if no user
//   // ---------------------------------------------------------------
//   if (!user) {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('token');
//       window.location.href = '/signin';
//     }
//     return null;
//   }

//   // ---------------------------------------------------------------
//   // 4. Menu definition – typed exactly
//   // ---------------------------------------------------------------
//   const menuItems: { name: MenuItem; icon: React.ComponentType<any> }[] = [
//     { name: 'Profile', icon: UserIcon },
//     { name: 'Posted Gigs', icon: BriefcaseIcon },
//     ...(user.type === 'student' ? [{ name: 'Applied Gigs', icon: ClipboardDocumentCheckIcon } as { name: MenuItem; icon: React.ComponentType<any> }] : []),
//   ];

//   // ---------------------------------------------------------------
//   // 5. Delete gig
//   // ---------------------------------------------------------------
//   const handleConfirmedDelete = async () => {
//     if (!gigToDelete) return;
//     const res = await fetch(`/api/dashboard/posted/${gigToDelete.id}`, { method: 'DELETE' });
//     const result = await res.json();

//     if (res.ok) {
//       setToast({ message: 'Gig deleted.', type: 'success' });
//       setTimeout(() => window.location.reload(), 1500);
//     } else {
//       setToast({ message: result.message ?? 'Failed.', type: 'error' });
//       setTimeout(() => setToast(null), 3000);
//     }
//     setGigToDelete(null);
//   };

//   // ---------------------------------------------------------------
//   // 6. Chat helpers
//   // ---------------------------------------------------------------
//   const toggleChat = (key: string) => setOpenChatForGig((p) => (p === key ? null : key));

//   const hasPosterStartedChat = async (gigId: string, posterId: string, applicantId: string) => {
//     const roomId = `${gigId}_${posterId}_${applicantId}`;
//     const snap = await getDoc(doc(db, 'chats', roomId));
//     return snap.exists();
//   };

//   // ---------------------------------------------------------------
//   // 7. Render
//   // ---------------------------------------------------------------
//   const renderContent = () => {
//     /* ──────────────────────── PROFILE ──────────────────────── */
//     if (active === 'Profile') {
//       const ProfileItem = ({ label, value }: { label: string; value: string | undefined }) => (
//         <div>
//           <p className="text-xs text-gray-500">{label}</p>
//           <p className="font-medium text-gray-900">{value ?? 'N/A'}</p>
//         </div>
//       );

//       const isStudent = user.type === 'student';

//       return (
//         <div className="max-w-5xl mx-auto mt-20 px-4">
//           <div className="bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
//             {/* Avatar */}
//             <div className="bg-[#4B55C3] text-white flex flex-col items-center py-10 px-6">
//               <div className="relative w-28 h-28 rounded-full border-4 border-white overflow-hidden">
//                 <img
//                   src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name ?? 'Guest'}`}
//                   alt="avatar"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="mt-4 text-center">
//                 <h2 className="text-xl font-bold">{user.name}</h2>
//                 <p className="text-sm opacity-90">{user.email}</p>
//               </div>
//             </div>

//             {/* Details */}
//             <div className="col-span-2 p-8 space-y-6">
//               {isStudent ? (
//                 <>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
//                     <ProfileItem label="College" value={user.college ?? undefined} />
//                     <ProfileItem label="Department" value={user.department ?? undefined} />
//                     <ProfileItem label="Graduation Year" value={user.gradYear ?? undefined} />
//                     <ProfileItem label="Phone" value={user.phone ?? undefined} />
//                     <ProfileItem
//                       label="Joined On"
//                       value={user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
//                     />
//                   </div>

//                   <div className="border-t pt-6">
//                     <h3 className="text-lg font-semibold text-[#3B2ECC] mb-2">Activity Overview</h3>
//                     <ul className="text-sm text-gray-700 space-y-1">
//                       <li>Total Gigs Posted: {postedGigs.length}</li>
//                       <li>Total Gigs Applied: {appliedGigs.length}</li>
//                       <li>Accepted Gigs: {appliedGigs.filter((a) => a.status === 'accepted').length}</li>
//                     </ul>
//                   </div>
//                 </>
//               ) : (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
//                   <ProfileItem label="Total Gigs Posted" value={String(postedGigs.length)} />
//                   <ProfileItem
//                     label="Joined On"
//                     value={user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
//                   />
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       );
//     }

//     /* ──────────────────────── POSTED GIGS ──────────────────────── */
//     if (active === 'Posted Gigs') {
//       return (
//         <section className="space-y-6 mt-20 px-1">
//           <h2 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] mb-4 text-center md:text-left">
//             Your Posted Gigs
//           </h2>

//           {postedGigs.length === 0 ? (
//             <p className="text-center text-gray-600">No gigs posted yet.</p>
//           ) : (
//             postedGigs.map((gig) => (
//               <div key={gig.id} className="relative bg-white p-5 md:p-6 rounded-xl shadow-md border">
//                 {/* Delete button */}
//                 <button
//                   onClick={() => setGigToDelete({ id: gig.id, title: gig.title })}
//                   className="absolute top-3 right-3 text-red-500 hover:text-red-600"
//                   title="Delete gig"
//                 >
//                   <TrashIcon className="h-5 w-5" />
//                 </button>

//                 <div className="space-y-2">
//                   <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
//                   <p className="text-gray-700">{gig.description}</p>
//                 </div>

//                 {/* Applicants */}
//                 <div className="mt-4">
//                   <details className="text-sm text-gray-700">
//                     <summary className="cursor-pointer text-[#4B55C3] font-semibold">
//                       Applicants ({gig.applications.length})
//                     </summary>

//                     {gig.applications.length ? (
//                       <ul className="mt-3 space-y-4">
//                         {gig.applications.map((app) => {
//                           const applicant = app.user;
//                           const chatKey = `${gig.id}_${app.userId}_${gig.postedById}`;

//                           return (
//                             <li
//                               key={app.id}
//                               className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
//                             >
//                               {/* Applicant info */}
//                               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                                 <div>
//                                   <p className="font-semibold text-gray-900">
//                                     {applicant?.name ?? 'Unknown'}
//                                   </p>
//                                   <p className="text-xs text-gray-600">{applicant?.email}</p>
//                                   {applicant?.college && (
//                                     <p className="text-xs text-gray-500">
//                                       {applicant.college} • {applicant.department} • {applicant.gradYear}
//                                     </p>
//                                   )}
//                                 </div>

//                                 {/* Status buttons */}
//                                 <div className="flex flex-wrap gap-2">
//                                   {(['pending', 'accepted', 'rejected'] as const).map((s) => (
//                                     <button
//                                       key={s}
//                                       onClick={async () => {
//                                         const res = await fetch(`/api/applications/${app.id}/status`, {
//                                           method: 'PATCH',
//                                           headers: { 'Content-Type': 'application/json' },
//                                           body: JSON.stringify({ status: s }),
//                                         });
//                                         const data = await res.json();
//                                         setToast({
//                                           message: res.ok ? `Marked as ${s}.` : data.message ?? 'Failed.',
//                                           type: res.ok ? 'success' : 'error',
//                                         });
//                                         if (res.ok) setTimeout(() => window.location.reload(), 1200);
//                                       }}
//                                       className={`text-xs px-3 py-1 rounded-md font-medium border transition ${
//                                         app.status === s
//                                           ? s === 'accepted'
//                                             ? 'bg-green-100 border-green-600 text-green-700'
//                                             : s === 'rejected'
//                                             ? 'bg-red-100 border-red-600 text-red-700'
//                                             : 'bg-yellow-100 border-yellow-600 text-yellow-700'
//                                           : 'text-gray-600 border-gray-300 hover:bg-gray-100'
//                                       }`}
//                                     >
//                                       {s}
//                                     </button>
//                                   ))}

//                                   {/* Chat */}
//                                   <button
//                                     onClick={() => toggleChat(chatKey)}
//                                     className="text-xs px-3 py-1 rounded-md font-medium bg-[#4B55C3] text-white hover:bg-[#5C53E5]"
//                                   >
//                                     Chat
//                                   </button>
//                                 </div>
//                               </div>

//                               {/* Extra info */}
//                               {app.portfolio && (
//                                 <a
//                                   href={app.portfolio}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="mt-2 block text-[#4B55C3] underline hover:text-[#3B2ECC]"
//                                 >
//                                   Portfolio
//                                 </a>
//                               )}
//                               {app.extra && <p className="text-xs text-gray-600 mt-1">{app.extra}</p>}

//                               {/* Chat component */}
//                               {openChatForGig === chatKey && (
//                                 <div className="mt-3">
//                                   <ChatComponent
//                                     gigId={gig.id}
//                                     posterId={gig.postedById}
//                                     applicantId={app.userId}
//                                     recipient={app.userId}
//                                     setOpenChatForGig={setOpenChatForGig}
//                                     escrowPaid={app.escrowStatus === 'PAID'} // <-- required
//                                   />
//                                 </div>
//                               )}
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     ) : (
//                       <p className="text-xs mt-2 text-gray-500">No applicants yet.</p>
//                     )}
//                   </details>
//                 </div>
//               </div>
//             ))
//           )}
//         </section>
//       );
//     }

//     /* ──────────────────────── APPLIED GIGS ──────────────────────── */
//     if (active === 'Applied Gigs' && user.type === 'student') {
//       return (
//         <section className="space-y-6 mt-20 px-1">
//           <h2 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] mb-4 text-center md:text-left">
//             Gigs You’ve Applied To
//           </h2>

//           {appliedGigs.length === 0 ? (
//             <p className="text-center text-gray-600">You haven’t applied to any gigs yet.</p>
//           ) : (
//             appliedGigs.map((app) => {
//               const gig = app.gig;
//               if (!gig) return null;

//               const posterId = gig.postedById;
//               const chatKey = `${gig.id}_${posterId}_${user.id}`;

//               return (
//                 <div key={app.id} className="bg-white p-5 md:p-6 rounded-xl shadow-md border">
//                   <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
//                   <p className="text-sm text-gray-600">Reason: {app.reason}</p>
//                   <p className="text-sm mt-2">
//                     Status:{' '}
//                     <span
//                       className={`font-semibold ${
//                         app.status === 'accepted'
//                           ? 'text-green-600'
//                           : app.status === 'rejected'
//                           ? 'text-red-600'
//                           : 'text-yellow-600'
//                       }`}
//                     >
//                       {app.status}
//                     </span>
//                   </p>

//                   <button
//                     onClick={async () => {
//                       const allowed = await hasPosterStartedChat(gig.id, posterId, user.id);
//                       if (allowed) toggleChat(chatKey);
//                       else {
//                         setToast({ message: 'Chat not available until poster starts.', type: 'error' });
//                         setTimeout(() => setToast(null), 3000);
//                       }
//                     }}
//                     className="text-sm mt-4 px-4 py-2 rounded-lg font-medium bg-[#4B55C3] text-white hover:bg-[#5C53E5] transition"
//                   >
//                     Open Chat
//                   </button>

//                   {openChatForGig === chatKey && (
//                     <div className="mt-3">
//                       <ChatComponent
//                         gigId={gig.id}
//                         applicantId={user.id}
//                         posterId={posterId}
//                         recipient={posterId}
//                         setOpenChatForGig={setOpenChatForGig}
//                         escrowPaid={app.escrowStatus === 'PAID'} // <-- required
//                       />
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </section>
//       );
//     }

//     return null;
//   };

//   // ---------------------------------------------------------------
//   // 8. JSX
//   // ---------------------------------------------------------------
//   return (
//     <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] font-bricolage">
//       {/* Toast */}
//       {toast && (
//         <div
//           className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg transition-all ${
//             toast.type === 'success'
//               ? 'bg-green-500 text-white'
//               : 'bg-red-500 text-white'
//           }`}
//         >
//           {toast.message}
//         </div>
//       )}

//       {/* Mobile sidebar */}
//       <div className="md:hidden mt-28">
//         <div className="flex justify-between items-center px-4">
//           <button onClick={() => setSidebarOpen((p) => !p)}>
//             {sidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6 text-[#3B2ECC]" />}
//           </button>
//         </div>

//         {sidebarOpen && (
//           <div className="fixed inset-0 z-50 flex flex-col" onClick={() => setSidebarOpen(false)}>
//             <div className="flex-1 bg-black/40 backdrop-blur-sm" />
//             <div className="bg-[#4B55C3] text-white px-4 py-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
//               {menuItems.map((item) => (
//                 <button
//                   key={item.name}
//                   onClick={() => {
//                     setActive(item.name);
//                     setSidebarOpen(false);
//                   }}
//                   className={`flex items-center w-full px-3 py-2 mb-2 rounded-lg transition ${
//                     active === item.name ? 'bg-white text-[#3B2ECC]' : 'hover:bg-[#5A4ED3]'
//                   }`}
//                 >
//                   <item.icon className={`h-5 w-5 mr-3 ${active === item.name ? 'text-[#3B2ECC]' : 'text-white'}`} />
//                   {item.name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Desktop sidebar */}
//       <aside className="hidden md:flex md:flex-col md:w-64 bg-[#4B55C3] text-white py-12 px-4 space-y-4 shadow-xl">
//         {menuItems.map((item) => (
//           <button
//             key={item.name}
//             onClick={() => setActive(item.name)}
//             className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-lg transition ${
//               active === item.name ? 'bg-white text-[#4B55C3] font-semibold shadow-md' : 'hover:bg-white/10'
//             }`}
//           >
//             <item.icon className={`h-6 w-6 ${active === item.name ? 'text-[#4B55C3]' : 'text-white'}`} />
//             <span className="text-lg">{item.name}</span>
//           </button>
//         ))}
//       </aside>

//       {/* Main */}
//       <main className="flex-1 px-4 md:px-10 pb-10 mt-6 md:mt-8 overflow-y-auto">{renderContent()}</main>

//       {/* Delete modal */}
//       {gigToDelete && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4 text-center">
//             <h2 className="text-xl font-extrabold text-[#B91C1C]">Delete Gig?</h2>
//             <p className="text-gray-700">
//               Are you sure you want to delete <span className="font-semibold">&quot;{gigToDelete.title}&quot;</span>?
//             </p>
//             <div className="flex justify-center gap-4 mt-6">
//               <button
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
//                 onClick={() => setGigToDelete(null)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
//                 onClick={handleConfirmedDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }