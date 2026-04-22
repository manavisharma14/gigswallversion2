// src/components/dashboard/ApplicantCard.tsx
'use client';

import {
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  ChevronDownIcon,
  CalendarIcon,
  BriefcaseIcon,
  LinkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import ChatComponent from '../ChatComponent';
import { ApplicationWithRelations, GigWithRelations } from '@/types/prisma';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import RatingModal from "../RatingModal"

interface Props {
  application: ApplicationWithRelations;   // ← Full relation with gig.applications
  gig: GigWithRelations;                   // ← Full gig with applications[]
  setToast: (t: { message: string; type: 'success' | 'error' } | null) => void;
  isChatOpen: boolean;
  onChatToggle: () => void;
}

const Badge = ({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: 'success' | 'warning' | 'info' | 'gray' | 'purple' | 'indigo';
}) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    warning: 'bg-amber-100 text-amber-700 border-amber-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  }[variant];

  return (
    <span className={`px-2.5 py-1 text-xs rounded-full border ${styles}`}>
      {children}
    </span>
  );
};

export default function ApplicantCard({
  application,
  gig,
  setToast,
  isChatOpen,
  onChatToggle,
}: Props) {
  const router = useRouter();



  const {
    id: appId,
    user,
    status,
    reason,
    experience,
    portfolio,
    extra: extraInfo,
    createdAt,
    escrowStatus,
    // escrowAmount,
    // workSubmitted,
    // completed,
  } = application;

  const [expanded, setExpanded] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reviewData, setReviewData] = useState<{
    applicationId: string;
    freelancerName: string;
    gigTitle: string;
  } | null>(null);


  useEffect(() => {
    const id = localStorage.getItem("userId");
    console.log(" Logged-in userId from localStorage:", id);
    console.log(" Gig postedById:", gig.postedById);
    console.log(" Full gig object:", gig);
    console.log(" Full application object:", application);
    setCurrentUserId(id);
  }, [gig, application]);

  const closeGig = async () => {
    // This function now only performs the API call.
    const res = await fetch(`/api/gigs/${gig.id}/close`, { method: 'PATCH' });

    if (res.ok) {
      setToast({ message: "Gig closed successfully", type: "success" });

      if (status === "accepted") {
        setReviewData({
          applicationId: application.id,
          freelancerName: user.name || "Freelancer",
          gigTitle: gig.title || "Gig",
        });
        setShowRatingModal(true);
      }

      router.refresh();
    } else {
      setToast({ message: "Failed to close gig", type: "error" });
    }
  };

  const updateStatus = async (newStatus: 'accepted' | 'pending' | 'rejected') => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        return setToast({ message: data.message ?? 'Failed', type: 'error' });
      }

      setToast({
        message:
          newStatus === 'accepted'
            ? 'Applicant accepted'
            : newStatus === 'rejected'
              ? 'Applicant rejected'
              : 'Moved to pending',
        type: 'success',
      });
      router.refresh();
    } catch {
      setToast({ message: 'Network error', type: 'error' });
    }
  };


  const [showConfirmClose, setShowConfirmClose] = useState(false);
  // const canShowPay = status === 'accepted' && gig.postedById === me && escrowStatus === 'NONE';

  // const escrowPill = (() => {
  //   if (escrowStatus === 'PAID') return <Badge variant="success">Payment Verified</Badge>;
  //   if (escrowStatus === 'PENDING') return <Badge variant="warning">Proof Submitted</Badge>;
  //   if (escrowStatus === 'RELEASED') return <Badge variant="info">Funds Released</Badge>;
  //   return <Badge variant="gray">no escrow</Badge>;
  // })();

  // const releaseFunds = async () => {
  //   if (!confirm(`Release ₹${escrowAmount} to ${user.name ?? 'freelancer'}?`)) return;

  //   const res = await fetch('/api/escrow/release', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ applicationId: appId }),
  //   });

  //   const data = await res.json();
  //   setToast({
  //     message: res.ok ? 'Marked as Paid Out' : data.error ?? 'Failed',
  //     type: res.ok ? 'success' : 'error',
  //   });
  //   if (res.ok) router.refresh();
  // };



  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-200 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-base">
            {user.name?.[0]?.toUpperCase() ?? 'U'}
          </div>

          <div className="space-y-0.5">
            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
            <p className="text-xs text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-400">
              {user.college} • {user.department} • {user.gradYear}
            </p>
            {/* <div className="mt-1 flex gap-2 flex-wrap">
              {escrowPill}
              {workSubmitted && <Badge variant="purple">Work Submitted</Badge>}
              {completed && <Badge variant="indigo">Gig Completed</Badge>}
            </div> */}
            {/*
 <div className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
  {application.user.totalRatings > 0 ? (
    <>
      <span>⭐ {application.user.averageRating.toFixed(1)}</span>
      <span className="text-gray-500">({application.user.totalRatings})</span>
    </>
  ) : (
    <span className="text-gray-400">No reviews yet</span>
  )}
</div> 
*/}
          </div>
        </div>

        <div className="flex items-center gap-2">

          {application.semanticMatchScore !== null &&
            application.semanticMatchScore !== undefined && (
              <Badge variant="indigo">
                🔥 {application.semanticMatchScore}% Match
              </Badge>
            )}
          <Badge
            variant={
              status === 'accepted' ? 'success' :
                status === 'pending' ? 'warning' :
                  'gray'
            }
          >
            {status}
          </Badge>

          <Menu as="div" className="relative">
            <Menu.Button className="p-1.5 rounded-full hover:bg-gray-100 transition">
              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 bg-white border rounded-lg shadow-md w-40 z-50 py-1 text-sm">
              <Menu.Item>
                <button onClick={() => updateStatus('accepted')} className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                  Accept
                </button>
              </Menu.Item>
              <Menu.Item>
                <button onClick={() => updateStatus('pending')} className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                  Move to Pending
                </button>
              </Menu.Item>
              <Menu.Item>
                <button onClick={() => updateStatus('rejected')} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50">
                  Reject
                </button>
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>

      {/* APPLIED DATE */}
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <CalendarIcon className="w-3.5 h-3.5" />
        Applied {format(new Date(createdAt), 'MMM d, yyyy • h:mm a')}
      </p>

      {/* EXPANDABLE INFO */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs flex items-center gap-1 text-indigo-600 font-medium hover:underline"
      >
        View application details
        <ChevronDownIcon className={`w-4 h-4 transition ${expanded && 'rotate-180'}`} />
      </button>

      {expanded && (
        <div className="space-y-3 pl-1 border-l border-gray-200 ml-1">
          {reason && (
            <div className="text-sm text-gray-700">
              <span className="flex gap-1 font-medium text-gray-800">
                <UserCircleIcon className="h-4 w-4" /> Why this gig:
              </span>
              <p className="mt-1">{reason}</p>
            </div>
          )}
          {experience && (
            <div className="text-sm text-gray-700">
              <span className="flex gap-1 font-medium text-gray-800">
                <BriefcaseIcon className="h-4 w-4" /> Experience:
              </span>
              <p className="mt-1">{experience}</p>
            </div>
          )}
          {portfolio && (
            <a
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 flex items-center gap-1 font-medium hover:underline"
            >
              <LinkIcon className="h-4 w-4" /> Portfolio
            </a>
          )}
          {extraInfo && <p className="text-sm text-gray-700">{extraInfo}</p>}
        </div>
      )}


      {/* CHAT */}
      <button
        onClick={onChatToggle}
        className="text-xs px-3 py-1.5 rounded-full border border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition flex items-center gap-1"
        title={escrowStatus !== 'PAID' ? 'Files unlock after payment screenshot is verified' : ''}
      >
        <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
        Message Applicant
      </button>


      {/* Show Close Gig only when one applicant is accepted */}
      {gig.isOpen &&
        currentUserId &&
        currentUserId === gig.postedById?.toString() &&
        status === "accepted" && (
          <button
            onClick={() => setShowConfirmClose(true)}
            className="text-xs px-3 py-1.5 rounded-full border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 transition flex items-center gap-1"
          >
            Close Gig
          </button>
        )}

      {showConfirmClose && (
        <div className="fixed inset-0 flex items-center shadow-xl justify-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-sm p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Close Gig?
            </h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to close this gig? All applicants will be locked and no more actions can be taken.
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmClose(false)}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowConfirmClose(false);
                  await closeGig();
                }}
                className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Close Gig
              </button>
            </div>
          </div>
        </div>
      )}


      {isChatOpen && (
        <div className="mt-2 border p-2 rounded-lg bg-gray-50">
          <ChatComponent
            gigId={gig.id}
            posterId={gig.postedById}
            applicantId={user.id}
            recipient={user.id}
            setOpenChatForGig={onChatToggle}
            escrowPaid={escrowStatus === 'PAID'}
            applicationId={application.id}
          />
        </div>
      )}

      {/* UPI PAYMENT MODAL */}
      {/* {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[360px] space-y-4">
            <h2 className="font-semibold text-gray-900 text-lg">Upload Payment Proof to Start Work (Beta)
            </h2>
            <p className="text-sm text-gray-600">
              Send <span className="font-semibold text-black">₹{gig.budget}</span> to secure this gig.
            </p>
            <div className="bg-gray-50 p-3 rounded-md border text-xs space-y-1">
              <p className="font-medium text-gray-800">Pay to UPI:</p>
              <p className="font-mono text-sm text-indigo-700">
                {process.env.NEXT_PUBLIC_ESCROW_UPI_ID ?? 'manav@upi'}
              </p>
              <p className="text-gray-500">Reference: GIG_{gig.id}_APP_{appId}</p>
            </div>

            <form
              className="space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmittingProof(true);
                const form = e.currentTarget;
                const file = (form.elements.namedItem('screenshot') as HTMLInputElement).files?.[0];
                const txn = (form.elements.namedItem('txn') as HTMLInputElement).value;

                if (!file || !txn) {
                  setToast({ message: 'Upload screenshot & enter transaction id', type: 'error' });
                  setSubmittingProof(false);
                  return;
                }

                const data = new FormData();
                data.append('file', file);
                data.append('upiReference', txn);
                data.append('gigId', gig.id);
                data.append('applicationId', appId);
                data.append('amount', gig.budget.toString());

                const res = await fetch('/api/escrow/upload', { method: 'POST', body: data });

                if (res.ok) {
                  setToast({ message: "Proof uploaded — awaiting verification", type: 'success' });
                  setShowPaymentModal(false);
                  router.refresh();
                } else {
                  const j = await res.json().catch(() => ({}));
                  setToast({ message: j?.error ?? 'Upload failed', type: 'error' });
                }
                setSubmittingProof(false);
              }}
            >
              <input type="text" name="txn" placeholder="Transaction ID" className="w-full border rounded p-2 text-sm" required />
              <input type="file" name="screenshot" accept="image/*" className="w-full border rounded p-2 text-sm" required />
              <button
                type="submit"
                disabled={submittingProof}
                className="w-full bg-indigo-600 text-white text-sm font-medium rounded-lg px-3 py-2 hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {submittingProof ? 'Uploading...' : 'Upload Proof & Submit'}
              </button>
            </form>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="text-xs text-gray-500 hover:underline w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}

      {reviewData && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          applicationId={reviewData.applicationId}
          freelancerName={reviewData.freelancerName}
          gigTitle={reviewData.gigTitle}
          onSubmitted={() => {
            setShowRatingModal(false);
            router.refresh();
          }}
        />
      )}

    </div>
  );
}