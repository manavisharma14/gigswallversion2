import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { qstash } from "@/lib/qstash"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gigId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { gigId } = await params; // Await params to get gigId
    const { reason, experience, portfolio, extra } = await req.json();


    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) {
      return NextResponse.json({ message: 'Gig not found' }, { status: 404 });
    }

    if (gig.postedById === userId) {
      return NextResponse.json(
        { message: 'You cannot apply to your own gig.' },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findFirst({
      where: { gigId, userId },
    });

    if (existing) {
      return NextResponse.json(
        { message: 'You have already applied to this gig.' },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        gigId,
        userId,
        reason,
        experience,
        portfolio,
        extra,

        aiModelVersion: "embedding-v1",
      },
    });

    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/process-applications`,
      body: {
        applicationId: application.id,
      },
    });


    await qstash.publishJSON({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/send-application-email`,
      body: {
        applicationId: application.id,
      },
    });

    return NextResponse.json({ message: 'Application submitted', application }, { status: 201 });
  } catch (error) {
    console.error('❌ Error applying to gig:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}