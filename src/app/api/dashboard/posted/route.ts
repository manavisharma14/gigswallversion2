import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Use singleton
import { getUserFromToken } from '@/lib/getUserFromToken'; // Update path as needed

export async function GET(req: NextRequest) {
  const userOrResponse = await getUserFromToken(req);
  if (typeof userOrResponse !== 'object' || !('userId' in userOrResponse)) {
    return userOrResponse as NextResponse;
  }

  const { userId } = userOrResponse;

  if (!userId || !/^[0-9a-fA-F]{24}$/.test(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const gigs = await prisma.gig.findMany({
      where: { postedById: userId },
      include: {
        applications: {
          include: { user: true },
        },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        college: true,
        department: true,
        gradYear: true,
        aim: true,
        skills: true,
        bio: true,
        role: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ gigs, user });
  } catch (error) {
    console.error('Error in /api/dashboard/posted:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}