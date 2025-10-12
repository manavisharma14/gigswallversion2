import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ gigId: string }> }
) {
  const { gigId } = await params;

  try {
    // Fetch all applications for this gig
    const applicants = await prisma.application.findMany({
      where: { gigId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            college: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ applicants });
  } catch (error) {
    console.error('Error fetching applicants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applicants' },
      { status: 500 }
    );
  }
}