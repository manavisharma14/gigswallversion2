// components/dashboard/DashboardClient.tsx
'use client';

import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import ProfileSection from './ProfileSection';
import PostedGigsSection from './PostedGigsSection';
import AppliedGigsSection from './AppliedGigsSection';
import { GigWithRelations, ApplicationWithRelations } from '@/types/prisma';

import {
  UserIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';

import type { User } from '@/types/prisma';

export default function DashboardClient({
  user,
  postedGigs,
  appliedGigs,
}: {
  user: User;
  postedGigs: GigWithRelations[];
  appliedGigs: ApplicationWithRelations[];
}) {
  const [active, setActive] = useState('Profile');

  const menuItems = [
    { name: 'Profile', icon: UserIcon },
    { name: 'Posted Gigs', icon: BriefcaseIcon },
    ...(user?.type === 'student' ? [{ name: 'Applied Gigs', icon: ClipboardDocumentCheckIcon }] : []),
  ];

  const renderContent = () => {
    if (active === 'Profile') {
      return (
        <ProfileSection
          user={user}
          postedCount={postedGigs.length}
          appliedCount={appliedGigs.length}
          acceptedCount={appliedGigs.filter(a => a.status === 'accepted').length}
        />
      );
    }
    if (active === 'Posted Gigs') {
      return <PostedGigsSection gigs={postedGigs} />;
    }
    if (active === 'Applied Gigs') {
      return <AppliedGigsSection applications={appliedGigs} userId={user.id}  />;
    }
    return null;
  };

  return (
    <DashboardLayout menuItems={menuItems} active={active} setActive={setActive}>
      {renderContent()}
    </DashboardLayout>
  );
}