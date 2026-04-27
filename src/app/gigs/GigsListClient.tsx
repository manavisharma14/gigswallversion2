'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from 'react';
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

  const [query, setQuery] = useState('');
  const [displayGigs, setDisplayGigs] = useState(gigs);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
  const timer = setTimeout(async () => {
    if (!query.trim()) {
      setDisplayGigs(gigs);
      return;
    }

    try {
      setSearchLoading(true);

      const res = await fetch(
        `/api/gigs/search?q=${encodeURIComponent(query)}`
      );

      const data = await res.json();

      const results = data.gigs || [];

      setDisplayGigs(results);

      if (results.length > 0) {

  setSelectedGig(results[0]);

} else {

  setSelectedGig(null);

}
    } catch (error) {
      console.error(error);
    } finally {
      setSearchLoading(false);
    }
  }, 350);

  return () => clearTimeout(timer);
}, [query, gigs]);



  const handleSubmitApplication = (formData: ApplicationFormData) => {
    console.log('Application submitted:', {
      gigId: selectedGig?.id,
      ...formData,
    });
    setShowModal(false);
  };

  const checkCanApply = async (gigId: string) => {
    if (status === 'loading') return;

    if (!session) {
      setErrors((prev) => ({
        ...prev,
        [gigId]: 'Please sign in to apply for gigs.',
      }));
      setTimeout(() => setErrors({}), 2500);
      return;
    }

    if (session.user?.type !== 'student') {
      setErrors((prev) => ({
        ...prev,
        [gigId]: 'Only verified students can apply.',
      }));
      setTimeout(() => setErrors({}), 2500);
      return;
    }

    try {
      const response = await fetch(`/api/gigs/${gigId}/can-apply`, {
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setErrors({});
        setShowModal(true);
      } else {
        setErrors((prev) => ({ ...prev, [gigId]: data.message }));
        setTimeout(() => setErrors({}), 2500);
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        [gigId]: 'An unexpected error occurred.',
      }));
      setTimeout(() => setErrors({}), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-white font-bricolage mt-14 px-4 sm:px-6 md:px-12 py-10">
      {selectedGig && selectedGig.status?.toLowerCase() === 'open' && showModal && (
        <ApplyModal
          gigId={selectedGig.id}
          gigTitle={selectedGig.title}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmitApplication}
        />
      )}

          <div className="mb-8 mx-5">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#4B55C3]">
              Explore Gigs
            </h1>
            {/* <p className="text-sm md:text-base text-gray-600 mt-1">
              Find campus-verified opportunities. Clean, minimal, welcoming.
            </p> */}
          </div>

          <div className="mb-6">
  <input
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Search gigs by skill, title, or intent..."
    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4B55C3]"
  />

  {searchLoading && (
    <p className="text-sm text-gray-500 mt-2">
      Searching...
    </p>
  )}
</div>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-8">

        
        
        {/* Sidebar Gigs */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-y-auto max-h-[70vh] md:sticky md:top-24">
          {displayGigs.length === 0 && (
  <div className="p-6 text-center">
    <p className="text-sm font-medium text-gray-700">
      No matching gigs found
    </p>
    <p className="text-xs text-gray-500 mt-1">
      Try another skill, title, or category.
    </p>
  </div>
)}
          {displayGigs.map((gig) => {
            const isSelected = selectedGig?.id === gig.id;
            const isOpen = gig.status?.toLowerCase() === 'open' || gig.isOpen;

            return (
              <div
                key={gig.id}
                onClick={() => setSelectedGig(gig)}
                className={`px-4 py-4 border-b border-gray-200 cursor-pointer transition 
                ${isSelected ? 'bg-[#F8F9FF]' : 'hover:bg-gray-50'}`}
              >
                <h3 className="font-semibold text-gray-900 text-base">{gig.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{gig.category}</p>

                <div className="mt-2 flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isOpen ? 'text-[#4B55C3]' : 'text-red-500'}`}>
                    {isOpen ? 'Open' : 'Closed'} • ₹{gig.budget.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gig Detail Section */}
        <div className="md:col-span-2">
          {selectedGig ? (
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200 space-y-6">
              
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-extrabold text-[#4B55C3]">{selectedGig.title}</h2>
                {selectedGig.status?.toLowerCase() === 'open' && (
                  <span className="self-start px-3 py-1 text-xs font-medium rounded-full bg-[#EFF2FF] text-[#4B55C3]">
                    Open for applications
                  </span>
                )}
              </div>

              <div className="text-gray-700 text-sm space-y-1">
                <p><strong>Category:</strong> {selectedGig.category}</p>
                <p><strong>Budget:</strong> <span className="text-[#4B55C3] font-bold">₹{selectedGig.budget.toLocaleString()}</span></p>
              </div>

              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
                {selectedGig.description}
              </p>

              {selectedGig.status?.toLowerCase() === 'open' && (
                <div className="relative inline-block">
                  <div className="flex items-center gap-3">
                    
                    {/* Apply Button */}
                    <button
                      onClick={() => checkCanApply(selectedGig.id)}
                      className="bg-[#4B55C3] hover:bg-[#6D7BE4] text-white px-6 py-2 rounded-md text-sm font-medium transition shadow-sm hover:shadow"
                    >
                      Apply Now
                    </button>

                    {/* Info Tooltip */}
                    <div className="relative group">
                      <Info className="w-4 h-4 text-[#4B55C3] cursor-pointer opacity-80 group-hover:opacity-100 transition" />

                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 z-50 hidden group-hover:block">
                        <div className="bg-white text-[#4B55C3] border border-[#E5E7FF] shadow-xl rounded-xl px-4 py-3 text-xs w-60 animate-fade-slide">
                          <p className="text-[10px] text-gray-700 mt-1 leading-tight">
                            {`Only verified students can apply. If you're hiring, post a gig instead.`}
                          </p>
                        </div>
                        <div className="w-2 h-2 bg-white border-l border-t border-[#E5E7FF] rotate-45 mx-auto -mt-1"></div>
                      </div>
                    </div>
                  </div>

                  {errors[selectedGig.id] && (
                    <p className="text-xs text-red-600 mt-2">{errors[selectedGig.id]}</p>
                  )}
                </div>
              )}

            </div>
          ) : (
            <p className="text-gray-500 italic text-center mt-6">Select a gig to view details</p>
          )}
        </div>
      </div>

      {/* Tooltip animation */}
      <style>{`
        @keyframes fade-slide {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide {
          animation: fade-slide .18s ease-out;
        }
      `}</style>
    </div>
  );
}