// src/components/dashboard/GigCard.tsx
'use client';

import ApplicantCard from './ApplicantCard';
import ChatComponent from '../ChatComponent';
import { GigWithRelations, ApplicationWithRelations } from '@/types/prisma';


interface Props {
  gig: GigWithRelations;
  application?: ApplicationWithRelations;
  isPoster: boolean;
  userId?: string;
  posterId?: string;
  hasPosterStartedChat?: (
    gigId: string,
    posterId: string,
    applicantId: string
  ) => Promise<boolean>;
  setToast: (t: { message: string; type: 'success' | 'error' } | null) => void;
  openChatForGig: string | null;
  setOpenChatForGig: (key: string | null) => void;
  chatKey?: string;
}

export default function GigCard({
  gig,
  application,
  isPoster,
  userId,
  posterId,
  hasPosterStartedChat,
  setToast,
  openChatForGig,
  setOpenChatForGig,
  chatKey,
}: Props) {



  const toggleChat = (key: string) => {
    setOpenChatForGig(openChatForGig === key ? null : key);
  };

  // ────── STUDENT VIEW ──────
  if (!isPoster && application) {

    const canChat = true; // allow normal chat always


    return (
      <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border">
        <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
        <p className="text-sm text-gray-600">Reason: {application.reason}</p>

        <p className="text-sm mt-2">
          Status:{' '}
          <span
            className={`font-semibold ${
              application.status === 'accepted'
                ? 'text-green-600'
                : application.status === 'rejected'
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {application.status}
          </span>
        </p>

        {/* Escrow Status Badge
        <div className="mt-2">
          {application.escrowStatus === 'PAID' && (
            <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
              Payment Confirmed

            </span>
          )}
          {application.escrowStatus === 'PENDING' && (
            <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-300">
              Proof Submitted
            </span>
          )}
          {application.escrowStatus === 'NONE' && (
            <span className="inline-block px-2.5 py-1 text-xs rounded-full bg-gray-50 text-gray-700 border border-gray-200">
              No payment yet
            </span>
          )}
        </div> */}

        {/* Open Chat */}
        <button
          onClick={async () => {
            const allowed = await hasPosterStartedChat?.(gig.id, posterId!, userId!);
            if (allowed && chatKey) toggleChat(chatKey);
          }}
          className={`mt-4 px-4 py-2 rounded-lg font-medium transition ${
            canChat
              ? 'bg-[#4B55C3] text-white hover:bg-[#5C53E5]'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canChat}
        >
          Open Chat
        </button>

        {/* Chat Component */}
        {openChatForGig === chatKey && canChat && (
          <div className="mt-4">
            <ChatComponent
  gigId={gig.id}
  applicantId={userId!}
  posterId={posterId!}
  recipient={posterId!}
  setOpenChatForGig={setOpenChatForGig}
  escrowPaid={application.escrowStatus === "PAID"} 
  applicationId={application.id}
/>
          </div>
        )}
 
      </div>
    );
  }

  // ────── POSTER VIEW ──────
  return (
    <div className="bg-white p-5 md:p-6 rounded-xl shadow-md border">
      <div className="space-y-2">
        <h3 className="font-semibold text-lg text-[#4B55C3]">{gig.title}</h3>
        <p className="text-gray-700">{gig.description}</p>
      </div>

      <details className="mt-4 text-sm text-gray-700">
        <summary className="cursor-pointer text-[#4B55C3] font-semibold">
          Applicants ({gig.applications?.length ?? 0})
        </summary>

        {gig.applications?.length ? (
          <ul className="mt-3 space-y-4">
            {gig.applications.map((app) => {
              const applicantChatKey = `${gig.id}_${app.userId}_${gig.postedById}`;

              return (
                <li key={app.id} className="p-4 border rounded-lg space-y-3 bg-gray-50">
                  <ApplicantCard
                    application={{ ...app, gig }} 
                    gig={gig}
                    setToast={setToast}
                    isChatOpen={openChatForGig === applicantChatKey}
                    onChatToggle={() => toggleChat(applicantChatKey)}
                  />
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-xs mt-2 text-gray-500">No applicants yet.</p>
        )}
      </details>
    </div>
  );
}