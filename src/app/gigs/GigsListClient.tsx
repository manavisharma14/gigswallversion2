// GigsListClient.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ApplyModal from '@/components/ApplyModal';
import { Info } from 'lucide-react';

interface Gig {
  id: string;
  title: string;
  category: string;
  budget: number;
  description: string;
  status: string;
  createdAt: string;
  isOpen?: boolean;
}

interface ApplicationFormData {
  reason: string;
  experience: string;
  portfolio: string;
  extra: string;
}

export default function GigsListClient({
  gigs,
  initialCounts,
}: {
  gigs: Gig[];
  initialCounts: Record<string, number>;
}) {
  const { data: session, status } = useSession();
  const [selectedGig, setSelectedGig] = useState<Gig | null>(gigs[0] || null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [applicantsMap, setApplicantsMap] = useState<Record<string, number>>(
    initialCounts || {}
  );

  // Background refresh for applicant counts
  useEffect(() => {
    const openIds = gigs
      .filter((g) => g.status.toLowerCase() === 'open' || g.isOpen)
      .map((g) => g.id);

    if (openIds.length === 0) return;

    const url = `/api/gigs/applicants-count?ids=${encodeURIComponent(openIds.join(','))}`;
    fetch(url, {
      credentials: 'include', // Include cookies for NextAuth session
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch applicant counts');
        return res.json();
      })
      .then((data) => {
        const fresh = data?.counts ?? {};
        if (fresh && Object.keys(fresh).length) {
          setApplicantsMap((prev) => ({ ...prev, ...fresh }));
        }
      })
      .catch((error) => {
        console.error('Failed to fetch applicant counts:', error);
      });
  }, [gigs]);

  const handleSubmitApplication = (formData: ApplicationFormData) => {
    console.log('Application submitted:', {
      gigId: selectedGig?.id,
      ...formData,
    });
    setShowModal(false);
  };

  const checkCanApply = async (gigId: string) => {
    if (status === 'loading') {
      setErrors((prev) => ({
        ...prev,
        [gigId]: 'Checking authentication status...',
      }));
      return;
    }

    if (!session) {
      setErrors((prev) => ({
        ...prev,
        [gigId]: 'Please sign in to apply for gigs.',
      }));
      setTimeout(() => setErrors((prev) => ({ ...prev, [gigId]: null })), 2500);
      return;
    }

    const userType = session.user?.type; // Adjust based on your session.user structure
    if (userType !== 'student') {
      setErrors((prev) => ({
        ...prev,
        [gigId]: 'Only verified students can apply. If you&apos;re hiring, post a gig instead.'
      }));
      setTimeout(() => setErrors((prev) => ({ ...prev, [gigId]: null })), 2500);
      return;
    }

    try {
      const response = await fetch(`/api/gigs/${gigId}/can-apply`, {
        method: 'GET',
        credentials: 'include', // Include cookies for NextAuth session
      });

      const data = await response.json();
      if (response.ok) {
        setErrors((prev) => ({ ...prev, [gigId]: null }));
        setShowModal(true);
      } else {
        setErrors((prev) => ({ ...prev, [gigId]: data.message }));
        setTimeout(() => setErrors((prev) => ({ ...prev, [gigId]: null })), 2500);
      }
    } catch (error) {
      console.error('Eligibility check failed:', error);
      setErrors((prev) => ({
        ...prev,
        [gigId]: 'An unexpected error occurred. Please try again.',
      }));
      setTimeout(() => setErrors((prev) => ({ ...prev, [gigId]: null })), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-white font-bricolage mt-14 px-4 sm:px-6 md:px-12 py-10">
      {selectedGig && selectedGig.status.toLowerCase() === 'open' && showModal && (
        <ApplyModal
          gigId={selectedGig.id}
          gigTitle={selectedGig.title}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitApplication}
        />
      )}

      <div className="flex flex-col md:grid md:grid-cols-3 gap-8">
        {/* Gig List */}
        <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-y-auto max-h-[70vh] md:sticky md:top-24">
          {gigs.map((gig) => {
            const isSelected = selectedGig?.id === gig.id;
            const isOpen = gig.status.toLowerCase() === 'open' || gig.isOpen;
            const applicants = isOpen ? applicantsMap[gig.id] : undefined;

            return (
              <div
                key={gig.id}
                onClick={() => setSelectedGig(gig)}
                className={`px-4 py-3 border-b border-gray-200 cursor-pointer transition ${
                  isSelected ? 'bg-gray-50' : ''
                }`}
              >
                <h3 className="font-bold text-gray-900 text-base">{gig.title}</h3>
                <p className="text-xs text-gray-500">{gig.category}</p>

                <div className="mt-2 flex items-center justify-between">
                  <p
                    className={`font-bold text-sm ${
                      isOpen ? 'text-[#4B55C3]' : 'text-red-500'
                    }`}
                  >
                    {isOpen ? 'Open' : 'Closed'} • ₹{gig.budget.toLocaleString()}
                  </p>

                  {isOpen && (
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full shadow-sm inline-block min-w-[108px] text-center
                        ${typeof applicants === 'number' ? 'bg-[#EFF2FF] text-[#4B55C3]' : 'bg-gray-100 text-gray-300'}`}
                    >
                      {typeof applicants === 'number' ? `${applicants} applicants` : 'Loading…'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gig Details */}
        <div className="md:col-span-2">
          {selectedGig ? (
            <div className="bg-white rounded-md shadow-md p-6 space-y-6 border border-gray-200">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-4xl font-extrabold text-[#4B55C3]">
                  {selectedGig.title}
                </h2>
                {selectedGig.status.toLowerCase() === 'open' && (
                  <span className="self-start px-3 py-1 text-sm font-medium rounded-full bg-[#EFF2FF] text-[#4B55C3]">
                    Open for applications
                  </span>
                )}
              </div>

              <div className="text-gray-700 space-y-1 text-sm">
                <p><strong>Category:</strong> {selectedGig.category}</p>
                <p><strong>Budget:</strong> <span className="text-[#4B55C3] font-semibold">₹{selectedGig.budget.toLocaleString()}</span></p>
              </div>

              <div className="text-gray-800 whitespace-pre-line text-sm leading-relaxed">
                {selectedGig.description}
              </div>

              {selectedGig.status.toLowerCase() === 'open' && (
                <div className="relative inline-block">
                  <div className="flex items-center gap-2 relative">
                    <button
                      onClick={() => checkCanApply(selectedGig.id)}
                      className="bg-[#4B55C3] hover:bg-[#6D7BE4] text-white px-6 py-2 rounded-md text-sm font-medium transition"
                    >
                      Apply Now
                    </button>

                    <div className="relative group flex items-center">
                      <Info className="w-4 h-4 text-[#4B55C3] cursor-pointer" />
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-[#EFF2FF] text-[#4B55C3] text-xs px-3 py-1 rounded-md shadow-md whitespace-normal z-50 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition w-[220px] max-w-xs">
                        Only verified students can apply. If you&apos;re hiring, post a gig instead.
                      </div>
                    </div>
                  </div>
                  {errors[selectedGig.id] && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-red-100 text-red-700 text-xs p-1 rounded-md whitespace-nowrap">
                      {errors[selectedGig.id]}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-500 italic mt-6 sm:mt-10 text-center">
              Select a gig to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}