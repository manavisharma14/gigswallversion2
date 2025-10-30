// app/api/user/complete-profile/route.ts
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return Response.json({ message: 'Unauthorized' }, { status: 401 });

  const { college, department, gradYear, phone } = await req.json();

  if (!college || !department || !gradYear || !phone) {
    return Response.json({ message: 'All fields required' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { college, department, gradYear, phone },
  });

  return Response.json({ message: 'Profile updated' });
}