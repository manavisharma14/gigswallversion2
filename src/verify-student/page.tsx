// // app/verify-student/page.tsx
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { CameraIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// export default function VerifyStudentPage() {
//   const router = useRouter();
//   const [step, setStep] = useState<'method' | 'upload' | 'email' | 'success'>('method');
//   const [file, setFile] = useState<File | null>(null);
//   const [email, setEmail] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

//   const showToast = (msg: string, type: 'success' | 'error') => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 4000);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0];
//     if (f && f.type.startsWith('image/')) {
//       setFile(f);
//     } else {
//       showToast('Please upload a valid image (JPG/PNG)', 'error');
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     setLoading(true);
//     const formData = new FormData();
//     formData.append('idCard', file);

//     try {
//       const res = await fetch('/api/verify/student/upload', {
//         method: 'POST',
//         body: formData,
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setStep('success');
//         showToast('Verification submitted! We’ll review in 24 hrs.', 'success');
//       } else {
//         showToast(data.message || 'Upload failed', 'error');
//       }
//     } catch {
//       showToast('Network error. Try again.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEmailVerify = async () => {
//     if (!email.endsWith('.edu')) {
//       showToast('Please use a .edu email', 'error');
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch('/api/verify/student/email', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         showToast('Check your .edu email for verification link!', 'success');
//         setStep('success');
//       } else {
//         showToast(data.message || 'Failed', 'error');
//       }
//     } catch {
//       showToast('Network error', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] flex items-center justify-center p-4 font-bricolage">
//       {toast && (
//         <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
//           {toast.msg}
//         </div>
//       )}

//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8">
//         {/* Back Button */}
//         {step !== 'method' && (
//           <button
//             onClick={() => setStep('method')}
//             className="mb-6 flex items-center gap-2 text-[#4B55C3] hover:text-[#3B2ECC] transition"
//           >
//             <ArrowLeftIcon className="h-5 w-5" />
//             Back
//           </button>
//         )}

//         {/* Step: Choose Method */}
//         {step === 'method' && (
//           <>
//             <h1 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] text-center mb-2">
//               Verify as Staudent
//             </h1>
//             <p className="text-center text-gray-600 mb-8">
//               {`Unlock student-only gigs by proving you're enrolled`}
//             </p>

//             <div className="space-y-4">
//               <button
//                 onClick={() => setStep('upload')}
//                 className="w-full p-5 border-2 border-dashed border-[#4B55C3] rounded-2xl hover:bg-[#4B55C3]/5 transition flex items-center justify-center gap-3 text-[#4B55C3] font-medium"
//               >
//                 <CameraIcon className="h-6 w-6" />
//                 Upload College ID
//               </button>

//               <button
//                 onClick={() => setStep('email')}
//                 className="w-full p-5 bg-[#4B55C3] text-white rounded-2xl hover:bg-[#5C53E5] transition font-medium"
//               >
//                 Verify with .edu Email
//               </button>
//             </div>

//             <p className="text-xs text-center text-gray-500 mt-8">
//               Your data is secure and only used for verification.
//             </p>
//           </>
//         )}

//         {/* Step: Upload ID */}
//         {step === 'upload' && (
//           <>
//             <h2 className="text-xl font-bold text-[#3B2ECC] mb-4">Upload College ID</h2>
//             <p className="text-sm text-gray-600 mb-6">
//               Take a clear photo of your student ID (name, college, expiry visible)
//             </p>

//             <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
//               {file ? (
//                 <div className="space-y-4">
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt="ID preview"
//                     className="mx-auto max-h-48 rounded-lg shadow-md"
//                   />
//                   <p className="text-sm font-medium text-gray-700">{file.name}</p>
//                   <button
//                     onClick={() => setFile(null)}
//                     className="text-sm text-red-600 hover:text-red-700"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ) : (
//                 <label className="cursor-pointer">
//                   <div className="flex flex-col items-center gap-2 text-[#4B55C3]">
//                     <CameraIcon className="h-12 w-12" />
//                     <span className="font-medium">Click to upload</span>
//                     <span className="text-xs text-gray-500">JPG, PNG up to 5MB</span>
//                   </div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={handleFileChange}
//                   />
//                 </label>
//               )}
//             </div>

//             <button
//               onClick={handleUpload}
//               disabled={!file || loading}
//               className="mt-6 w-full py-3 bg-[#4B55C3] text-white rounded-xl font-medium hover:bg-[#5C53E5] disabled:opacity-50 disabled:cursor-not-allowed transition"
//             >
//               {loading ? 'Uploading...' : 'Submit for Review'}
//             </button>
//           </>
//         )}

//         {/* Step: Email Verify */}
//         {step === 'email' && (
//           <>
//             <h2 className="text-xl font-bold text-[#3B2ECC] mb-4">Verify with .edu Email</h2>
//             <p className="text-sm text-gray-600 mb-6">
//               We’ll send a verification link to your college email
//             </p>

//             <input
//               type="email"
//               placeholder="you@college.edu"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4B55C3] focus:border-transparent"
//             />

//             <button
//               onClick={handleEmailVerify}
//               disabled={!email || loading}
//               className="mt-4 w-full py-3 bg-[#4B55C3] text-white rounded-xl font-medium hover:bg-[#5C53E5] disabled:opacity-50 disabled:cursor-not-allowed transition"
//             >
//               {loading ? 'Sending...' : 'Send Verification Email'}
//             </button>
//           </>
//         )}

//         {/* Success */}
//         {step === 'success' && (
//           <div className="text-center py-8">
//             <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-[#3B2ECC]">Verification Submitted!</h2>
//             <p className="text-gray-600 mt-2">
//               {file ? 'We’ll review your ID within 24 hours.' : 'Check your email for the verification link.'}
//             </p>
//             <button
//               onClick={() => router.push('/dashboard')}
//               className="mt-6 px-6 py-3 bg-[#4B55C3] text-white rounded-xl font-medium hover:bg-[#5C53E5] transition"
//             >
//               Back to Dashboard
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }