import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendGigApplicationEmail } from '@/lib/emailSender';

import { createEmbedding } from "@/lib/ai/embed"
import {
  cosineSimilarity,
  similarityToPercent
} from "@/lib/ai/cosine"

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

    const combinedText = `
      Reason: ${reason || ""}
      Experience: ${experience || ""}
      Portfolio: ${portfolio || ""}
      Extra: ${extra || ""}
    `;

    const applicationEmbedding = await createEmbedding(combinedText);


    let semanticMatchScore = 0;
    if (
      gig.aiGigEmbedding &&
      gig.aiGigEmbedding.length > 0 &&
      applicationEmbedding.length > 0
    ) {
      const similarity = cosineSimilarity(
        applicationEmbedding,
        gig.aiGigEmbedding
      )

      semanticMatchScore = similarityToPercent(similarity)
    }



    const application = await prisma.application.create({
      data: {
        gigId,
        userId,
        reason,
        experience,
        portfolio,
        extra,

        applicationEmbedding,

        semanticMatchScore,

        aiModelVersion: "embedding-v1",
      },
    });

    // Notify the gig poster
    const applicant = await prisma.user.findUnique({ where: { id: userId } });
    const poster = await prisma.user.findUnique({ where: { id: gig.postedById } });

    if (poster?.email && applicant?.name && applicant?.email) {
      await sendGigApplicationEmail({
        to: poster.email,
        gigTitle: gig.title,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
      });
    }

    return NextResponse.json({ message: 'Application submitted', application }, { status: 201 });
  } catch (error) {
    console.error('❌ Error applying to gig:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}