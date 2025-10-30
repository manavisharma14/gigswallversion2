// app/dashboard/layout.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { prisma } from '@/lib/prisma';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/signin');

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { type: true },
  });

  if (!user) redirect('/signin');

  // Normalize to lowercase
  const normalizedUserType = user.type.toLowerCase() as 'student' | 'business' | 'other';

  return (
    <div className="flex mt-20 min-h-screen bg-gradient-to-br from-[#E9ECFF] to-[#F6F8FF] font-bricolage">
      <DashboardSidebar userType={normalizedUserType} />
      <main className="flex-1 p-4 md:p-10 mt-32 md:mt-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}