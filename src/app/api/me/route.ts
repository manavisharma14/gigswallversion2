import { getUserFromToken } from '@/lib/getUserFromToken';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // or wherever you’ve initialized Prisma

export async function GET(req: Request) {
  const userOrResponse = await getUserFromToken(req);

  // Handle error (getUserFromToken might return a NextResponse)
  if ('status' in userOrResponse) return userOrResponse;

  const { userId } = userOrResponse;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('❌ Error in /api/me:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}