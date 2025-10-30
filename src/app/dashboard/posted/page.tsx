import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPostedGigs } from '@/lib/dashboard-queries';
import PostedGigsSection from '@/components/dashboard/PostedGigsSection';

export const dynamic = 'force-dynamic';

export default async function PostedGigsPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user!.id;

  const gigs = await getPostedGigs(userId);

  return <PostedGigsSection gigs={gigs} />;
}