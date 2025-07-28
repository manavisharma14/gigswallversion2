// app/api/dashboard/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/getUserFromToken';

export async function GET(req: NextRequest) {
  // ── 1.  Auth ─────────────────────────────────────────────
  const auth = await getUserFromToken(req);

  if (auth instanceof Response) {
    // getUserFromToken already built the error response
    return auth;
  }

  const { userId, type } = auth;          // <- log & validate
  console.log('[profile] decoded token →', { userId, type });

  if (!userId) {
    return NextResponse.json(
      { message: 'Missing userId in token' },
      { status: 400 }
    );
  }

  // ── 2.  DB fetch ─────────────────────────────────────────
  try {
    const user = await prisma.user.findUnique({
      where:  { id: userId },             // for MongoDB Prisma this is a string
      select: {
        id:  true,
        name:true,
        email:true,
        createdAt:true,
        college:true,
        department:true,
        gradYear:true,
        phone:true,
        type:true,
      },
    });

    if (!user) {
      console.warn('[profile] no user row for', userId);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.error('[profile] DB error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}