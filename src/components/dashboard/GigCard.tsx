// components/dashboard/GigCard.tsx
'use client';

import ApplicantCard from './ApplicantCard';
import ChatComponent from '../ChatComponent';
import { Gig, Application } from './types';

interface Props {
  gig: Gig;
  application?: Application;
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
}: Props) {


  const toggleChat = (key: string) => {
    setOpenChatForGig(openChatForGig === key ? null : key);
  };

  // ────── STUDENT VIEW (applied gig) ──────
  if (!isPoster && application) {
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

        <button
          onClick={async () => {
            const allowed = await hasPosterStartedChat?.(
              gig.id,
              posterId!,
              userId!
            );
            if (allowed) toggleChat(`${gig.id}_${posterId}_${userId}`);
            else {
              setToast({
                message: 'Chat not available until poster starts it.',
                type: 'error',
              });
              setTimeout(() => setToast(null), 3000);
            }
          }}
          className="mt-4 px-4 py-2 rounded-lg font-medium bg-[#4B55C3] text-white hover:bg-[#5C53E5]"
        >
          Open Chat
        </button>

        {openChatForGig === `${gig.id}_${posterId}_${userId}` && (
          <div className="mt-4">
            <ChatComponent
              gigId={gig.id}
              applicantId={userId!}
              posterId={posterId!}
              recipient={posterId!}
              setOpenChatForGig={setOpenChatForGig}
            />
          </div>
        )}
      </div>
    );
  }

  // ────── POSTER VIEW (list of applicants) ──────
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
              const chatKey = `${gig.id}_${app.userId}_${gig.postedById}`;
              return (
                <ApplicantCard
                  key={app.id}
                  application={app}
                  gig={gig}
                  setToast={setToast}
                  isChatOpen={openChatForGig === chatKey}
                  onChatToggle={() => toggleChat(chatKey)}
                />
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