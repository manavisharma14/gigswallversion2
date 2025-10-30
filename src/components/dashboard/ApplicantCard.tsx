// components/dashboard/ApplicantCard.tsx
'use client';

import { useState } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,

} from '@heroicons/react/24/outline';
import ChatComponent from '../ChatComponent';
import { Application, Gig } from './types';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

type Status = 'pending' | 'accepted' | 'rejected';

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
  const { user, status, reason, experience, portfolio, extraInfo, createdAt } = application;
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  // ────── SAFETY: Check if user exists ──────
  if (!user) {
    return (
      <li className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        <p className="text-sm font-medium">Error: Applicant data missing</p>
        <p className="text-xs mt-1">User information could not be loaded.</p>
      </li>
    );
  }

  const updateStatus = async (newStatus: Status) => {
    if (updating || status === newStatus) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/applications/${application.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: `Application ${newStatus}.`, type: 'success' });
        router.refresh();
      } else {
        setToast({ message: data.message ?? 'Failed.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Network error.', type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  const statusConfig = {
    pending: {
      Icon: ClockIcon,
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      label: 'Pending',
    },
    accepted: {
      Icon: CheckCircleIcon,
      bg: 'bg-green-50',
      border: 'border-green-400',
      text: 'text-green-800',
      label: 'Accepted',
    },
    rejected: {
      Icon: XCircleIcon,
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      label: 'Rejected',
    },
  };


  return (
    <li className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        
        {/* Avatar + Info */}
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
  
        {/* Status Pills */}
        <div className="flex gap-2">
          {(['pending','accepted','rejected'] as const).map(s => {
            const active = status === s;
            const cfg = statusConfig[s];
  
            return (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                disabled={updating || active}
                className={`
                  px-3 py-1 text-xs rounded-full border transition
                  flex items-center gap-1
                  ${active 
                    ? `${cfg.bg} ${cfg.border} ${cfg.text} border` 
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }
                  ${updating ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <cfg.Icon className="w-3.5 h-3.5" />
                {cfg.label}
              </button>
            );
          })}
        </div>
  
      </div>
  
      {/* Meta */}
      <p className="text-xs text-gray-400 flex items-center gap-1">
        <CalendarIcon className="w-3.5 h-3.5" />
        Applied {format(new Date(createdAt), "MMM d, yyyy • h:mm a")}
      </p>
  
      {/* Reason */}
      {reason && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Why they want this gig</p>
          <p className="text-sm text-gray-600 leading-relaxed">{reason}</p>
        </div>
      )}
  
      {/* Experience */}
      {experience && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Experience</p>
          <p className="text-sm text-gray-600 leading-relaxed">{experience}</p>
        </div>
      )}
  
      {/* Portfolio */}
      {portfolio && (
        <a
          href={portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          View Portfolio
        </a>
      )}
  
      {/* Extra Info */}
      {extraInfo && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-700">Additional Info</p>
          <p className="text-sm text-gray-600 leading-relaxed">{extraInfo}</p>
        </div>
      )}
  
      {/* Chat */}
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
    </li>
  );
}