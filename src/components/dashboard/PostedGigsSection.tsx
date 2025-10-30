// components/dashboard/PostedGigsSection.tsx
'use client';

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import GigCard from './GigCard';
import DeleteGigModal from './DeleteGigModal';
import Toast from './Toast';
import { Gig } from './types';
import { useRouter } from 'next/navigation';

interface Props {
  gigs: Gig[];
}

export default function PostedGigsSection({ gigs }: Props) {
  const router = useRouter();
  const [gigToDelete, setGigToDelete] = useState<{ id: string; title: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [openChatForGig, setOpenChatForGig] = useState<string | null>(null);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] mb-4 text-center md:text-left">
          Your Posted Gigs
        </h2>

        {gigs.length === 0 ? (
          <p className="text-center text-gray-600">No gigs posted yet.</p>
        ) : (
          gigs.map((gig) => {
            const chatKey = `${gig.id}_${gig.postedById}`;
            return (
              <div key={gig.id} className="relative">
                <button
                  onClick={() => setGigToDelete({ id: gig.id, title: gig.title })}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-600 z-10"
                  title="Delete gig"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

                <GigCard
                  gig={gig}
                  isPoster={true}
                  setToast={setToast}
                  openChatForGig={openChatForGig}
                  setOpenChatForGig={setOpenChatForGig}
                  chatKey={chatKey}
                />
              </div>
            );
          })
        )}
      </section>

      {gigToDelete && (
        <DeleteGigModal
          gig={gigToDelete}
          onClose={() => setGigToDelete(null)}
          onConfirm={async () => {
            try {
              const res = await fetch(`/api/dashboard/posted/${gigToDelete.id}`, {
                method: 'DELETE',
              });
              if (res.ok) {
                setToast({ message: 'Gig deleted.', type: 'success' });
                router.refresh(); // ← SOFT REFRESH
              } else {
                setToast({ message: 'Failed to delete.', type: 'error' });
              }
            } catch {
              setToast({ message: 'Network error.', type: 'error' });
            } finally {
              setGigToDelete(null);
            }
          }}
        />
      )}
    </>
  );
}