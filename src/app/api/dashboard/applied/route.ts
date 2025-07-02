// /app/api/dashboard/applied/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    const payload = JSON.parse(atob(token?.split('.')[1] || '{}'));
    const userId = payload?.id;

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

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
