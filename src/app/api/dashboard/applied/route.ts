import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/getUserFromToken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const userOrResponse = await getUserFromToken(req);
  if (!('userId' in userOrResponse)) return userOrResponse as NextResponse;

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
            createdAt: true,
            postedBy: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter out any applications where gig or postedBy is null (in case of broken foreign keys)
    const validApplications = applications.filter(
      (app) => app.gig && app.gig.postedBy
    );

    return NextResponse.json({ applications: validApplications }, { status: 200 });
  } catch (err) {
    console.error('❌ Error fetching applied gigs:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}