// src/components/dashboard/GigCard.tsx
'use client';

import { useMemo, useState } from 'react';
import {
  Briefcase,
  Users,
  ChevronDown,
  ChevronUp,
  Trash2,
  MessageSquare,
  CheckCircle2,
  IndianRupee,
  Sparkles,
} from 'lucide-react';

import ApplicantCard from './ApplicantCard';
import ChatComponent from '../ChatComponent';
import {
  GigWithRelations,
  ApplicationWithRelations,
} from '@/types/prisma';

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
  setToast: (
    t: { message: string; type: 'success' | 'error' } | null
  ) => void;
  openChatForGig: string | null;
  setOpenChatForGig: (key: string | null) => void;
  chatKey?: string;
  onDeleteRequest?: () => void;
}

function StatusBadge({
  isOpen,
}: {
  isOpen: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isOpen
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {isOpen ? 'Open' : 'Closed'}
    </span>
  );
}

function MetaPill({
  children,
  tone = 'gray',
}: {
  children: React.ReactNode;
  tone?: 'gray' | 'blue' | 'indigo' | 'green';
}) {
  const styles = {
    gray: 'bg-gray-100 text-gray-700',
    blue: 'bg-blue-50 text-blue-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-emerald-50 text-emerald-700',
  }[tone];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${styles}`}
    >
      {children}
    </span>
  );
}

function StudentStatusBadge({
  status,
}: {
  status: string;
}) {
  const styles =
    status === 'accepted'
      ? 'bg-emerald-100 text-emerald-700'
      : status === 'rejected'
      ? 'bg-red-100 text-red-700'
      : 'bg-amber-100 text-amber-700';

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {status}
    </span>
  );
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
  onDeleteRequest,
}: Props) {
  const [showApplicants, setShowApplicants] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const toggleChat = (key: string) => {
    setOpenChatForGig(openChatForGig === key ? null : key);
  };

  const applicantsCount = gig.applications?.length ?? 0;

  const sortedApplications = useMemo(() => {
    if (!gig.applications?.length) return [];
    return [...gig.applications].sort(
      (a, b) => (b.semanticMatchScore ?? 0) - (a.semanticMatchScore ?? 0)
    );
  }, [gig.applications]);

  const topMatch =
    sortedApplications.length > 0
      ? sortedApplications[0]?.semanticMatchScore ?? null
      : null;

  // STUDENT VIEW
  if (!isPoster && application) {
    const canChat = true;

    return (
      <div className="group rounded-3xl border border-gray-200 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-bold tracking-tight text-gray-900">
                {gig.title}
              </h3>
              <StudentStatusBadge status={application.status} />
            </div>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-600">
              {gig.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <MetaPill tone="indigo">
                <IndianRupee className="h-3.5 w-3.5" />
                {gig.budget}
              </MetaPill>

              <MetaPill>
                <Briefcase className="h-3.5 w-3.5" />
                {gig.category}
              </MetaPill>


            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={async () => {
              if (!hasPosterStartedChat || !posterId || !userId || !chatKey) return;

              try {
                setChatLoading(true);
                const allowed = await hasPosterStartedChat(
                  gig.id,
                  posterId,
                  userId
                );

                if (allowed) {
                  toggleChat(chatKey);
                } else {
                  setToast({
                    message: 'Chat is not available yet.',
                    type: 'error',
                  });
                }
              } catch {
                setToast({
                  message: 'Failed to open chat.',
                  type: 'error',
                });
              } finally {
                setChatLoading(false);
              }
            }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!canChat || chatLoading}
          >
            <MessageSquare className="h-4 w-4" />
            {chatLoading ? 'Opening...' : 'Open Chat'}
          </button>
        </div>

        {openChatForGig === chatKey && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <ChatComponent
              gigId={gig.id}
              applicantId={userId!}
              posterId={posterId!}
              recipient={posterId!}
              setOpenChatForGig={setOpenChatForGig}
              escrowPaid={application.escrowStatus === 'PAID'}
              applicationId={application.id}
            />
          </div>
        )}
      </div>
    );
  }

  // POSTER VIEW
  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white/90 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      <div className="p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                {gig.title}
              </h3>
              <StatusBadge isOpen={gig.isOpen} />
              {topMatch !== null && (
                <MetaPill tone="indigo">
                  <Sparkles className="h-3.5 w-3.5" />
                  Top Match {topMatch}%
                </MetaPill>
              )}
            </div>

            <p className="mt-3 max-w-5xl text-[15px] leading-7 text-gray-600">
              {gig.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <MetaPill>
                <Briefcase className="h-3.5 w-3.5" />
                {gig.category}
              </MetaPill>

   

              <MetaPill tone="blue">
                <Users className="h-3.5 w-3.5" />
                {applicantsCount} Applicant{applicantsCount !== 1 ? 's' : ''}
              </MetaPill>
            </div>
          </div>

          <div className="flex shrink-0 flex-row items-start gap-3 md:flex-col md:items-end">
            <div className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700">
              <IndianRupee className="mr-1 h-4 w-4" />
              {gig.budget}
            </div>

            {onDeleteRequest && (
              <button
                onClick={onDeleteRequest}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 text-red-500 transition hover:bg-red-50"
                aria-label="Delete gig"
                title="Delete gig"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowApplicants((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
          >
            {showApplicants ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Applicants
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                View Applicants
              </>
            )}
          </button>
        </div>

        {showApplicants && (
          <div className="mt-7 border-t border-gray-100 pt-6">
            {sortedApplications.length > 0 ? (
              <div className="space-y-4">
                {sortedApplications.map((app, index) => {
                  const applicantChatKey = `${gig.id}_${app.userId}_${gig.postedById}`;

                  return (
                    <div
                      key={app.id}
                      className={`rounded-2xl border p-1 ${
                        index === 0 && (app.semanticMatchScore ?? 0) >= 80
                          ? 'border-indigo-200 bg-indigo-50/30'
                          : 'border-transparent'
                      }`}
                    >
                      <ApplicantCard
                        application={{ ...app, gig }}
                        gig={gig}
                        setToast={setToast}
                        isChatOpen={openChatForGig === applicantChatKey}
                        onChatToggle={() => toggleChat(applicantChatKey)}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-10 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-9 w-9 text-gray-300" />
                <p className="text-sm font-semibold text-gray-600">
                  No applicants yet
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Applicants will appear here once students apply.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}