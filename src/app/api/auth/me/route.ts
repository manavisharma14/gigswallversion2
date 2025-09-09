import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/getUserFromToken';

export async function GET(req: Request) {
  const got = await getUserFromToken(req);
  if ('status' in got) return got; // 401/500 already formed

  const { userId } = got;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        phone: true,
        department: true,
        gradYear: true,
        college: true,
        createdAt: true,
      },
    });

    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    return NextResponse.json(user); // <-- user object directly
  } catch (err) {
    console.error('❌ /api/auth/me error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}