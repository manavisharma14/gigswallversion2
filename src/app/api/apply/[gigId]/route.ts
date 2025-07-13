import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendGigApplicationEmail } from '@/lib/emailSender';

const prisma = new PrismaClient();

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ gigId: string }> }
) {
  const { gigId } = await context.params;
  const body = await req.json();
  return applyToGig(req, gigId, body);
}

async function applyToGig(
  req: NextRequest,
  gigId: string,
  {
    reason,
    experience,
    portfolio,
    extra,
  }: { reason: string; experience: string; portfolio?: string; extra?: string }
) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1] ?? '';
  const payload = JSON.parse(atob(token.split('.')[1] ?? '{}'));
  const userId = payload?.id;

  if (!userId)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const gig = await prisma.gig.findUnique({ where: { id: gigId } });
  if (!gig)
    return NextResponse.json({ message: 'Gig not found' }, { status: 404 });

  if (gig.postedById === userId)
    return NextResponse.json(
      { message: 'You cannot apply to your own gig.' },
      { status: 400 }
    );

  const dup = await prisma.application.findFirst({ where: { userId, gigId } });
  if (dup)
    return NextResponse.json(
      { message: 'You have already applied to this gig.' },
      { status: 400 }
    );

  const application = await prisma.application.create({
    data: { userId, gigId, reason, experience, portfolio, extra },
  });

  // Get user and poster info
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const gigPoster = await prisma.user.findUnique({ where: { id: gig.postedById } });

  // Send email to the gig poster
  if (gigPoster?.email && user?.name && user?.email) {
    await sendGigApplicationEmail({
      to: gigPoster.email,
      gigTitle: gig.title,
      applicantName: user.name,
      applicantEmail: user.email,
    });
  }

  return NextResponse.json(
    { message: 'Application submitted', application },
    { status: 201 }
  );
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ gigId: string }> }
) {
  const { gigId } = await context.params;
  return deleteGig(req, gigId);
}

async function deleteGig(req: NextRequest, gigId: string) {
  const token = req.headers.get('authorization')?.split(' ')[1] ?? '';
  const payload = JSON.parse(atob(token.split('.')[1] ?? '{}'));
  const userId: string | undefined = payload?.id;

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const gig = await prisma.gig.findUnique({ where: { id: gigId } });
  if (!gig) {
    return NextResponse.json({ message: 'Gig not found' }, { status: 404 });
  }

  if (gig.postedById !== userId) {
    return NextResponse.json(
      { message: 'You are not allowed to delete this gig.' },
      { status: 403 }
    );
  }

  await prisma.gig.delete({ where: { id: gigId } });
  return NextResponse.json({ message: 'Gig deleted successfully' }, { status: 200 });
}
