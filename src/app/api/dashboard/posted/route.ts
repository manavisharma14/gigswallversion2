import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis'

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const cacheKey = `dashboard:posted:${userId}`

  try {
    const cached = await redis.get(cacheKey);

    if(cached){
      return NextResponse.json({ gigs: cached, source: "cache"})
    }

    const gigs = await prisma.gig.findMany({
      where: { postedById: session.user.id },
      include: {
        applications: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                college: true,
                department: true,
                gradYear: true,
                totalRatings: true,
                completedGigs: true
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    await redis.set(cacheKey, gigs, { ex: 30})

    return NextResponse.json({ gigs, source: "db" });
  } catch (error) {
    console.error('Error fetching posted gigs:', error);
    return NextResponse.json(
      { error: 'Failed to load posted gigs' },
      { status: 500 }
    );
  }
}