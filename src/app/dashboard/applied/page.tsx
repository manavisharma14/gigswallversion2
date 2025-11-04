// app/dashboard/applied/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getAppliedGigs } from '@/lib/dashboard-queries';
import AppliedGigsSection from '@/components/dashboard/AppliedGigsSection';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AppliedGigsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return <div>Please login</div>;

  const [applications, user] = await Promise.all([
    getAppliedGigs(userId),
    prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    }),
  ]);

  return (
    <AppliedGigsSection
      applications={applications}
      userId={userId}
      userWalletBalance={user?.walletBalance ?? 0}
    />
  );
}