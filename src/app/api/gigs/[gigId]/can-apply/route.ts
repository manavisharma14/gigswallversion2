// app/api/gigs/[gigId]/can-apply/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ gigId: string }> }
) {
  const { gigId } = await context.params;

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1] ?? '';
  let userId: string | undefined;
  let userType: string | undefined;
  let role: string | undefined;

  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? '{}'));
    userId = payload?.id;
    userType = payload?.userType;
    role = payload?.role; // Add role from token
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // First check: If role is 'external' or userType is 'other', deny application
  if (role === 'external' || userType === 'other') {
    return NextResponse.json(
      { message: 'Only verified students can apply for gigs. If you are looking to hire, you can post a gig instead.' },
      { status: 403 }
    );
  }

  const gig = await prisma.gig.findUnique({ where: { id: gigId } });
  if (!gig) {
    return NextResponse.json({ message: 'Gig not found' }, { status: 404 });
  }

  if (gig.postedById === userId) {
    return NextResponse.json(
      { message: 'You cannot apply to your own gig.' },
      { status: 403 }
    );
  }

  const existingApplication = await prisma.application.findFirst({
    where: { userId, gigId },
  });
  if (existingApplication) {
    return NextResponse.json(
      { message: 'You have already applied to this gig.' },
      { status: 400 }
    );
  }

  if (gig.status.toLowerCase() !== 'open') {
    return NextResponse.json(
      { message: 'This gig is not open for applications.' },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: 'You can apply to this gig.' }, { status: 200 });
}