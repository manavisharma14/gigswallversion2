import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getUserProfile } from '@/lib/dashboard-queries';
import ProfileSection from '@/components/dashboard/ProfileSection';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user!.id;

  const { user, counts } = await getUserProfile(userId);

  return (
    <ProfileSection
      user={user}
      postedCount={counts.posted}
      appliedCount={counts.applied}
      acceptedCount={counts.accepted}
    />
  );
}
