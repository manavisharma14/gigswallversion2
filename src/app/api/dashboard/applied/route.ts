import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/getUserFromToken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userOrResponse = await getUserFromToken(req);
  if ('userId' in userOrResponse === false) return userOrResponse as NextResponse;

  const { userId } = userOrResponse;

  try {
    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            budget: true,
            category: true,
            college: true,
            postedBy: {
              select: {
                id: true,
                name: true,
              },
            },
            
            
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (err) {
    console.error('Error fetching applied gigs:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
