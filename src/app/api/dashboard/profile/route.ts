import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/getUserFromToken'; // your custom token decoder

export async function GET(req: NextRequest) {
  const result = await getUserFromToken(req);

  if (result instanceof Response) return result;
  
  console.log('📥 Profile Request:', result);

  // If result is a Response (an error), return it directly
  if (result instanceof Response) {
    return result;
  }

  const { userId } = result;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        college: true,
        department: true,
        gradYear: true,
        phone: true,
        type: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}