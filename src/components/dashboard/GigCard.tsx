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
  // userWalletBalance?: number;
  hasPosterStartedChat?: (
    gigId: string,
    posterId: string,
    applicantId: string
  ) => Promise<boolean>;
  setToast: (t: { message: string; type: 'success' | 'error' } | null) => void;
  openChatForGig: string | null;
  setOpenChatForGig: (key: string | null) => void;
  chatKey?: string; // ← ADDED
}

export default function GigCard({
  gig,
  application,
  isPoster,
  userId,
  posterId,
  // userWalletBalance = 0,
  hasPosterStartedChat,
  setToast,
  openChatForGig,
  setOpenChatForGig,
  chatKey, // ← RECEIVE IT
}: Props) {


  const toggleChat = (key: string) => {
    setOpenChatForGig(openChatForGig === key ? null : key);
  };

  // const handleWithdraw = async () => {
  //   if (userWalletBalance < 100) {
  //     setToast({ message: 'Minimum ₹100 to withdraw', type: 'error' });
  //     setTimeout(() => setToast(null), 3000);
  //     return;
  //   }

  //   try {
  //     const res = await fetch('/api/withdraw', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ amount: userWalletBalance }),
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       setToast({ message: 'Withdrawal requested – check Earnings', type: 'success' });
  //       router.refresh();
  //     } else {
  //       setToast({ message: data.error ?? 'Withdrawal failed', type: 'error' });
  //     }
  //   } catch {
  //     setToast({ message: 'Network error', type: 'error' });
  //   }
  //   setTimeout(() => setToast(null), 3000);
  // };

  // ────── STUDENT VIEW ──────
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

        {/* Open Chat */}
        <button
          onClick={async () => {
            const allowed = await hasPosterStartedChat?.(gig.id, posterId!, userId!);
            if (allowed && chatKey) toggleChat(chatKey);
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

        {/* Chat Component – uses chatKey */}
        {openChatForGig === chatKey && (
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

        {/* Submit Work
        {application.status === 'accepted' && !application.completed && !application.workSubmitted && (
          <button
            className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium"
            onClick={async () => {
              try {
                const res = await fetch('/api/work/submit', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    applicationId: application.id,
                    gigId: gig.id,
                  }),
                });
                const data = await res.json();
                if (data.success) {
                  setToast({ message: 'Work submitted – waiting for approval', type: 'success' });
                  router.refresh();
                } else {
                  setToast({ message: data.error ?? 'Submit failed', type: 'error' });
                }
              } catch {
                setToast({ message: 'Server error', type: 'error' });
              }
              setTimeout(() => setToast(null), 2500);
            }}
          >
            Submit Work
          </button>
        )}

        Work Submitted
        {application.workSubmitted && !application.completed && (
          <p className="mt-3 text-sm font-medium text-yellow-600">
            Work submitted – awaiting poster approval
          </p>
        )}

        Work Approved
        {application.completed && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-semibold">
              Payment Received: ₹{gig.budget}
            </p>
            <p className="text-sm text-green-700 mt-1">
              Funds added to your wallet.
            </p>
          </div>
        )}

        Withdraw Button – Only Once
        {userWalletBalance > 0 && (
          <button
            onClick={handleWithdraw}
            className="mt-3 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Withdraw ₹{userWalletBalance} to UPI
          </button> */}
        {/* )} */}
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
                  application={app}
                  gig={gig}
                  setToast={setToast}
                  isChatOpen={openChatForGig === applicantChatKey}
                  onChatToggle={() => toggleChat(applicantChatKey)}
                />

                {/* REMOVE THIS ENTIRE BLOCK */}
                {/* {userId === app.userId && ...} → DELETE */}

                {/* Poster: Approve Work */}
                {/* {userId === gig.postedById &&
                  app.workSubmitted &&
                  !app.completed && (
                    <button
                      className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                      onClick={async () => {
                        const res = await fetch('/api/work/approve', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            applicationId: app.id,
                            gigId: gig.id,
                          }),
                        });
                        const data = await res.json();
                        if (res.ok) {
                          setToast({ message: 'Work approved – student can withdraw', type: 'success' });
                          router.refresh();
                        } else {
                          setToast({ message: data.error, type: 'error' });
                        }
                        setTimeout(() => setToast(null), 2500);
                      }}
                    >
                      Approve Work
                    </button>
                  )} */}

                {/* Status Messages */}
                {/* {app.workSubmitted && !app.completed && (
                  <p className="text-xs text-yellow-600 font-medium">
                    Work submitted – awaiting approval
                  </p>
                )}
                {app.completed && (
                  <p className="text-xs text-green-700 font-semibold">Work Approved</p>
                )} */}
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