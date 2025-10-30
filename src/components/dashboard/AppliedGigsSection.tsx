// components/dashboard/AppliedGigsSection.tsx
'use client';

import { useState } from 'react';
import GigCard from './GigCard';
import Toast from './Toast';
import { Application } from './types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AppliedGigsSection({
  applications,
  userId,
}: {
  applications: Application[];
  userId: string;
}) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [openChatForGig, setOpenChatForGig] = useState<string | null>(null);

  const hasPosterStartedChat = async (gigId: string, posterId: string, applicantId: string) => {
    const roomId = `${gigId}_${posterId}_${applicantId}`;
    const docRef = doc(db, 'chats', roomId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <section className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3B2ECC] mb-4 text-center md:text-left">
          Gigs You’ve Applied To
        </h2>

        {applications.length === 0 ? (
          <p className="text-center text-gray-600">No applications yet.</p>
        ) : (
          applications.map(app => {
            const gig = app.gig;
            if (!gig) return null;
            const posterId = gig.postedById;
            const chatKey = `${gig.id}_${posterId}_${userId}`;

            return (
              <GigCard
                key={app.id}
                gig={gig}
                application={app}
                isPoster={false}
                userId={userId}
                posterId={posterId}
                hasPosterStartedChat={hasPosterStartedChat}
                setToast={setToast}
                openChatForGig={openChatForGig}
                setOpenChatForGig={setOpenChatForGig}
                chatKey={chatKey}
              />
            );
          })
        )}
      </section>
    </>
  );
}