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
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Menu } from '@headlessui/react';
import ChatComponent from '../ChatComponent';
import { ApplicationWithRelations, GigWithRelations } from '@/types/prisma';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import RatingModal from '../RatingModal';

interface Props {
  application: ApplicationWithRelations;
  gig: GigWithRelations;
  setToast: (
    t: { message: string; type: 'success' | 'error' } | null
  ) => void;
  isChatOpen: boolean;
  onChatToggle: () => void;
}

const Badge = ({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant:
    | 'success'
    | 'warning'
    | 'info'
    | 'gray'
    | 'purple'
    | 'indigo'
    | 'red'
    | 'green';
}) => {
  const styles = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    green: 'bg-green-100 text-green-700 border-green-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles}`}
    >
      {children}
    </span>
  );
};

function getStatusConfig(status: string) {
  switch (status) {
    case 'accepted':
      return {
        label: 'Accepted',
        variant: 'success' as const,
        icon: <CheckCircleIcon className="h-3.5 w-3.5" />,
      };
    case 'rejected':
      return {
        label: 'Rejected',
        variant: 'red' as const,
        icon: <XCircleIcon className="h-3.5 w-3.5" />,
      };
    default:
      return {
        label: 'Pending',
        variant: 'warning' as const,
        icon: <ClockIcon className="h-3.5 w-3.5" />,
      };
  }
}

function getMatchMeta(score?: number | null) {
  if (score == null) {
    return {
      label: 'Unscored',
      variant: 'gray' as const,
      highlight: false,
    };
  }

  if (score >= 90) {
    return {
      label: 'Top Match',
      variant: 'green' as const,
      highlight: true,
    };
  }

  if (score >= 75) {
    return {
      label: 'Strong Fit',
      variant: 'indigo' as const,
      highlight: true,
    };
  }

  if (score >= 60) {
    return {
      label: 'Good Fit',
      variant: 'info' as const,
      highlight: false,
    };
  }

  return {
    label: 'Potential Fit',
    variant: 'gray' as const,
    highlight: false,
  };
}

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
    semanticMatchScore,
  } = application;

  const [expanded, setExpanded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reviewData, setReviewData] = useState<{
    applicationId: string;
    freelancerName: string;
    gigTitle: string;
  } | null>(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setCurrentUserId(id);
  }, []);

  const statusMeta = useMemo(() => getStatusConfig(status), [status]);
  const matchMeta = useMemo(
    () => getMatchMeta(semanticMatchScore),
    [semanticMatchScore]
  );

  const closeGig = async () => {
    const res = await fetch(`/api/gigs/${gig.id}/close`, {
      method: 'PATCH',
    });

    if (res.ok) {
      setToast({
        message: 'Gig closed successfully',
        type: 'success',
      });

      if (status === 'accepted') {
        setReviewData({
          applicationId: application.id,
          freelancerName: user.name || 'Freelancer',
          gigTitle: gig.title || 'Gig',
        });
        setShowRatingModal(true);
      }

      router.refresh();
    } else {
      setToast({
        message: 'Failed to close gig',
        type: 'error',
      });
    }
  };

  const updateStatus = async (
    newStatus: 'accepted' | 'pending' | 'rejected'
  ) => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        return setToast({
          message: data.message ?? 'Failed',
          type: 'error',
        });
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
      setToast({
        message: 'Network error',
        type: 'error',
      });
    }
  };

  return (
    <div
      className={`rounded-3xl border bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        matchMeta.highlight
          ? 'border-indigo-200 ring-1 ring-indigo-100'
          : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-base font-bold text-white shadow-sm">
            {user.name?.[0]?.toUpperCase() ?? 'U'}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-base font-bold text-gray-900">
                {user.name || 'Unknown Applicant'}
              </p>

              {semanticMatchScore !== null &&
                semanticMatchScore !== undefined && (
                  <Badge variant={matchMeta.variant}>
                    <SparklesIcon className="h-3.5 w-3.5" />
                    {matchMeta.label} • {semanticMatchScore}%
                  </Badge>
                )}

              <Badge variant={statusMeta.variant}>
                {statusMeta.icon}
                {statusMeta.label}
              </Badge>
            </div>

            <p className="mt-1 truncate text-sm text-gray-600">
              {user.email}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {[user.college, user.department, user.gradYear]
                .filter(Boolean)
                .join(' • ') || 'No academic details'}
            </p>
          </div>
        </div>

        <Menu as="div" className="relative shrink-0">
          <Menu.Button className="rounded-full p-2 transition hover:bg-gray-100">
            <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
          </Menu.Button>

          <Menu.Items className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-lg">
            <Menu.Item>
              <button
                onClick={() => updateStatus('accepted')}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50"
              >
                Accept
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => updateStatus('pending')}
                className="block w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50"
              >
                Move to Pending
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => updateStatus('rejected')}
                className="block w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Reject
              </button>
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>

      {/* Sub row */}
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span className="inline-flex items-center gap-1">
          <CalendarIcon className="h-3.5 w-3.5" />
          Applied {format(new Date(createdAt), 'MMM d, yyyy • h:mm a')}
        </span>

        {portfolio && (
          <a
            href={portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-700"
          >
            <LinkIcon className="h-3.5 w-3.5" />
            Portfolio
          </a>
        )}
      </div>

      {/* Quick summary */}
      <div className="mt-4 rounded-2xl bg-gray-50 p-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Application Snapshot
        </p>
        <p className="line-clamp-2 text-sm leading-6 text-gray-700">
          {reason || experience || extraInfo || 'No application details provided.'}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          View Details
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <button
          onClick={onChatToggle}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          title={
            escrowStatus !== 'PAID'
              ? 'Files unlock after payment screenshot is verified'
              : ''
          }
        >
          <ChatBubbleLeftIcon className="h-4 w-4" />
          {isChatOpen ? 'Close Chat' : 'Message Applicant'}
        </button>

        {gig.isOpen &&
          currentUserId &&
          currentUserId === gig.postedById?.toString() &&
          status === 'accepted' && (
            <button
              onClick={() => setShowConfirmClose(true)}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              Close Gig
            </button>
          )}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-5 space-y-4 rounded-2xl border border-gray-100 bg-white p-4">
          {reason && (
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                <UserCircleIcon className="h-4 w-4 text-indigo-500" />
                Why this gig
              </div>
              <p className="text-sm leading-6 text-gray-700">{reason}</p>
            </div>
          )}

          {experience && (
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                <BriefcaseIcon className="h-4 w-4 text-indigo-500" />
                Relevant experience
              </div>
              <p className="text-sm leading-6 text-gray-700">{experience}</p>
            </div>
          )}

          {extraInfo && (
            <div className="rounded-2xl bg-gray-50 p-4">
              <div className="mb-2 text-sm font-semibold text-gray-800">
                Additional context
              </div>
              <p className="text-sm leading-6 text-gray-700">{extraInfo}</p>
            </div>
          )}
        </div>
      )}

      {/* Chat */}
      {isChatOpen && (
        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-3">
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

      {/* Close confirmation */}
      {showConfirmClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900">
              Close Gig?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Are you sure you want to close this gig? All applicants will be
              locked and no more actions can be taken.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmClose(false)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  setShowConfirmClose(false);
                  await closeGig();
                }}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Yes, Close Gig
              </button>
            </div>
          </div>
        </div>
      )}

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