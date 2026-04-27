// src/components/dashboard/ProfileSection.tsx
'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import {
  GraduationCap,
  Building2,
  Phone,
  CalendarDays,
  Briefcase,
  Send,
  CheckCircle2,
  Mail,
  UserCircle2,
  Sparkles,
} from 'lucide-react';

import type { User } from '@/types/prisma';

function ProfileItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 transition hover:bg-white hover:shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 text-indigo-500">{icon}</div>

        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-gray-900">
            {value || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone = 'indigo',
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: 'indigo' | 'emerald' | 'blue';
}) {
  const styles = {
    indigo: 'bg-indigo-50 text-indigo-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
  }[tone];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className={`rounded-2xl p-3 ${styles}`}>{icon}</div>
      </div>
    </div>
  );
}

export default function ProfileSection({
  user,
  postedCount,
  appliedCount,
  acceptedCount,
}: {
  user: User;
  postedCount: number;
  appliedCount: number;
  acceptedCount: number;
}) {
  const isStudent = user.type === 'student';

  const joinedDate = user.createdAt
    ? format(new Date(user.createdAt), 'MMM d, yyyy')
    : 'N/A';

  return (
    <div className="mx-auto mt-10 max-w-6xl px-4">
      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* ================================================= */}
          {/* LEFT PROFILE PANEL */}
          {/* ================================================= */}
          <div className="relative overflow-hidden bg-indigo-600  px-8 py-10 text-white">
            {/* Glow */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="rounded-full border-4 border-white/70 bg-white p-1 shadow-xl">
                <div className="h-28 w-28 overflow-hidden rounded-full">
                  <Image
                    src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${
                      user.name ?? 'Guest'
                    }`}
                    alt="avatar"
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
              </div>

              {/* Name */}
              <h2 className="mt-5 text-2xl font-bold tracking-tight">
                {user.name || 'Guest User'}
              </h2>

              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
                <Mail className="h-4 w-4" />
                <span className="max-w-[220px] truncate">
                  {user.email}
                </span>
              </div>

              {/* Role */}
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4" />
                {isStudent ? 'Student Account' : 'Business Account'}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 grid w-full grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-wide text-white/70">
                    Posted
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {postedCount}
                  </p>
                </div>

                <div className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-wide text-white/70">
                    Accepted
                  </p>
                  <p className="mt-1 text-xl font-bold">
                    {acceptedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* RIGHT CONTENT */}
          {/* ================================================= */}
          <div className="col-span-2 px-6 py-8 md:px-8">
            {/* Heading */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                Profile Overview
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account details and activity.
              </p>
            </div>

            {/* Student Fields */}
            {isStudent ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProfileItem
                    icon={<Building2 className="h-5 w-5" />}
                    label="College"
                    value={user.college}
                  />

                  <ProfileItem
                    icon={<GraduationCap className="h-5 w-5" />}
                    label="Department"
                    value={user.department}
                  />

                  <ProfileItem
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Graduation Year"
                    value={user.gradYear}
                  />

                  <ProfileItem
                    icon={<Phone className="h-5 w-5" />}
                    label="Phone"
                    value={user.phone}
                  />

                  <ProfileItem
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Joined On"
                    value={joinedDate}
                  />

                  <ProfileItem
                    icon={<UserCircle2 className="h-5 w-5" />}
                    label="Account Type"
                    value="Student"
                  />
                </div>

                {/* Stats */}
                <div className="mt-8">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900">
                    Activity Insights
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <StatCard
                      icon={<Briefcase className="h-5 w-5" />}
                      label="Gigs Posted"
                      value={postedCount}
                      tone="indigo"
                    />

                    <StatCard
                      icon={<Send className="h-5 w-5" />}
                      label="Applications"
                      value={appliedCount}
                      tone="blue"
                    />

                    <StatCard
                      icon={<CheckCircle2 className="h-5 w-5" />}
                      label="Accepted"
                      value={acceptedCount}
                      tone="emerald"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ProfileItem
                    icon={<CalendarDays className="h-5 w-5" />}
                    label="Joined On"
                    value={joinedDate}
                  />

                  <ProfileItem
                    icon={<UserCircle2 className="h-5 w-5" />}
                    label="Account Type"
                    value="Business"
                  />
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <StatCard
                    icon={<Briefcase className="h-5 w-5" />}
                    label="Gigs Posted"
                    value={postedCount}
                    tone="indigo"
                  />

                  <StatCard
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    label="Active Presence"
                    value={1}
                    tone="emerald"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}