'use client';

import {
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import ChatComponent from '../ChatComponent';
import { Application, Gig } from './types';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

interface RazorpayVerifyResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface Props {
  application: Application;
  gig: Gig;
  setToast: (t: { message: string; type: 'success' | 'error' } | null) => void;
  isChatOpen: boolean;
  onChatToggle: () => void;
}

export default function ApplicantCard({
  application,
  gig,
  setToast,
  isChatOpen,
  onChatToggle,
}: Props) {
  const {
    id: appId,
    user,
    status,
    reason,
    experience,
    portfolio,
    extraInfo,
    createdAt,
    paymentStatus,
    workSubmitted,
    completed,
  } = application;

  const router = useRouter();

  if (!user) {
    return (
      <li className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="text-sm font-medium">Error: Applicant data missing</p>
      </li>
    );
  }

  // pay and accept
  const handlePayAndAccept = async () => {
    try {
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: gig.budget,
          gigId: gig.id,
          studentId: user.id,
          applicationId: appId,
        }),
      });
      const { orderId } = await orderRes.json();
      if (!orderId) throw new Error();

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
        order_id: orderId,
        name: 'GIGSWALL',
        description: gig.title,
        theme: { color: '#7c3aed' },
        handler: async (resp: RazorpayVerifyResponse) => {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
              gigId: gig.id,
              studentId: user.id,
              applicationId: appId,
            }),
          });

          if (verifyRes.ok) {
            setToast({ message: 'Student accepted & funds secured!', type: 'success' });
            router.refresh();
          } else {
            setToast({ message: 'Payment failed', type: 'error' });
          }
        },
        modal: { ondismiss: () => setToast({ message: 'Payment cancelled', type: 'error' }) },
      });
      rzp.open();
    } catch {
      setToast({ message: 'Payment failed', type: 'error' });
    }
  };

  // APPROVE WORK
  const approveWork = async () => {
    try {
      const res = await fetch('/api/work/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, gigId: gig.id }),
      });
      if (res.ok) {
        setToast({ message: `Work approved – ₹${gig.budget} released`, type: 'success' });
        router.refresh();
      } else {
        const data = await res.json();
        setToast({ message: data.error ?? 'Approval failed', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error', type: 'error' });
    }
  };

  const isPending = status === 'pending';
  const isAcceptedPaid = status === 'accepted' && paymentStatus === 'paid';

  return (
    <li className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-base">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900 text-sm">{user.name}</h3>
            <p className="text-xs text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              {user.college} · {user.department} · Class of {user.gradYear}
            </p>
          </div>
        </div>

        {/* ONE-CLICK BUTTON */}
        {isPending && (
          <button
            onClick={handlePayAndAccept}
            className="px-4 py-1.5 text-sm rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Pay & Accept (₹{gig.budget})
          </button>
        )}

        {/* ACCEPTED & PAID BADGE */}
        {isAcceptedPaid && (
          <div className="flex items-center gap-1 text-green-700">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="font-medium text-sm">Accepted & Paid</span>
          </div>
        )}
      </div>

      {/* Rest of UI (details, chat, submit, approve) */}
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <CalendarIcon className="w-3.5 h-3.5" />
        Applied {format(new Date(createdAt), 'MMM d, yyyy • h:mm a')}
      </p>

      {reason && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Why they want this gig</p>
          <p className="text-sm text-gray-600 leading-relaxed">{reason}</p>
        </div>
      )}
      {experience && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Experience</p>
          <p className="text-sm text-gray-600 leading-relaxed">{experience}</p>
        </div>
      )}
      {portfolio && (
        <a href={portfolio} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:underline">
          View Portfolio
        </a>
      )}
      {extraInfo && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Additional Info</p>
          <p className="text-sm text-gray-600 leading-relaxed">{extraInfo}</p>
        </div>
      )}

      {/* CHAT */}
      <div className="pt-2">
        <button
          onClick={onChatToggle}
          className="text-xs px-3 py-1.5 rounded-full border border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition flex items-center gap-1"
        >
          <ChatBubbleLeftIcon className="w-3.5 h-3.5" />
          Message Applicant
        </button>
        {isChatOpen && (
          <div className="mt-3">
            <ChatComponent
              gigId={gig.id}
              posterId={gig.postedById}
              applicantId={user.id}
              recipient={user.id}
              setOpenChatForGig={() => {}}
            />
          </div>
        )}
      </div>

      {/* WORK SUBMITTED */}
      {workSubmitted && !completed && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
          <p className="font-medium text-blue-900 flex items-center gap-2">
            <DocumentIcon className="w-5 h-5" />
            Work Submitted
          </p>
          <p className="text-sm text-blue-800 mt-1">
            Student has marked the gig as complete.
          </p>
          <button
            onClick={approveWork}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
          >
            Approve & Release ₹{gig.budget}
          </button>
        </div>
      )}

      {/* WORK APPROVED */}
      {completed && (
        <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg">
          <p className="font-medium text-green-900">
            Work Approved – ₹{gig.budget} released
          </p>
        </div>
      )}

      {/* PAID BUT NO WORK */}
      {isAcceptedPaid && !workSubmitted && (
        <p className="mt-3 text-xs text-green-600 font-medium">
          Payment secured – waiting for student to submit work
        </p>
      )}
    </li>
  );
}