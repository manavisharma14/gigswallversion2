// src/components/dashboard/ProfileSection.tsx
'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import type { User } from "@/types/prisma";

const ProfileItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">{value ?? 'N/A'}</p>
  </div>
);

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

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="bg-white rounded-3xl shadow-xl grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {/* ────── Avatar ────── */}
        <div className="bg-[#4B55C3] text-white flex flex-col items-center py-10 px-6">
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden">
            <Image
              src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.name ?? 'Guest'}`}
              alt="avatar"
              width={112}
              height={112}
              className="w-full h-full object-cover"
              unoptimized   // <-- required for external SVG
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-90">{user.email}</p>
          </div>
        </div>

        {/* ────── Details ────── */}
        <div className="col-span-2 p-8 space-y-6">
          {isStudent ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <ProfileItem label="College" value={user.college} />
                <ProfileItem label="Department" value={user.department} />
                <ProfileItem label="Graduation Year" value={user.gradYear} />
                <ProfileItem label="Phone" value={user.phone} />
                {/* ← FIXED: format Date object */}
                <ProfileItem
                  label="Joined On"
                  value={user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-[#3B2ECC] mb-2">
                  Activity Overview
                </h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Total Gigs Posted: {postedCount}</li>
                  <li>Total Gigs Applied: {appliedCount}</li>
                  <li>Accepted Gigs: {acceptedCount}</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <ProfileItem label="Total Gigs Posted" value={String(postedCount)} />
              {/* ← FIXED: format Date object */}
              <ProfileItem
                label="Joined On"
                value={user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : 'N/A'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}