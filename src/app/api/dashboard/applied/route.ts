// app/api/dashboard/applied/route.ts
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

  const userId = session?.user.id;
  const cacheKey = `dashboard:applied:${userId}`

  const cached = await redis.get(cacheKey);

  if(cached){
    return NextResponse.json({ applications: cached, source: "cache"})
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    include: { gig: true },
    orderBy: { createdAt: 'desc' },
  });

  await redis.set(cacheKey, applications, {ex: 30})

  return NextResponse.json({ applications, source: "db" });
}