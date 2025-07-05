export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const gigs = await prisma.gig.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ gigs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching gigs:', error);
    return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, budget, category, college, postedById } = await req.json();

    const newGig = await prisma.gig.create({
      data: {
        title,
        description,
        budget: parseInt(budget), // ✅ Fix type issue (Prisma expects Int)
        category,
        college,
        postedById,
        status: 'open',
      },
    });

    return NextResponse.json(newGig, { status: 201 });
  } catch (error) {
    console.error('Error creating gig:', error);
    return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 });
  }
}
