import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/getUserFromToken'; // your custom token decoder

export async function GET(req: NextRequest) {
  const result = await getUserFromToken(req);

  if ('userId' in result === false) {
    return result; // return the error response from getUserFromToken
  }

  const { userId } = result;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        college: true,
        department: true,
        gradYear: true,
        phone: true,
        skills: true,
        aim: true,
        bio: true,
        type: true, // include this if you want conditional rendering on frontend
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}