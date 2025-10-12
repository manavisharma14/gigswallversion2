import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendGigApplicationEmail } from '@/lib/emailSender';
import { getUserFromToken } from '@/lib/getUserFromServer';

// 🟢 Apply to Gig
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ gigId: string }> } // Correct type for params
) {
  const userOrResponse = await getUserFromToken();
  if (!('userId' in userOrResponse)) return userOrResponse; // ❌ Not logged in

  const { userId } = userOrResponse;
  const { gigId } = await params;
  const { reason, experience, portfolio, extra } = await req.json();

  try {
    // 1️⃣ Check if gig exists
    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) {
      return NextResponse.json({ message: 'Gig not found' }, { status: 404 });
    }

    // 2️⃣ Prevent applying to own gig
    if (gig.postedById === userId) {
      return NextResponse.json(
        { message: 'You cannot apply to your own gig.' },
        { status: 400 }
      );
    }

    // 3️⃣ Prevent duplicate applications
    const existing = await prisma.application.findFirst({ where: { userId, gigId } });
    if (existing) {
      return NextResponse.json(
        { message: 'You have already applied to this gig.' },
        { status: 400 }
      );
    }

    // 4️⃣ Create application
    const application = await prisma.application.create({
      data: { userId, gigId, reason, experience, portfolio, extra },
    });

    // 5️⃣ Send email notification to poster
    const applicant = await prisma.user.findUnique({ where: { id: userId } });
    const gigPoster = await prisma.user.findUnique({ where: { id: gig.postedById } });

    if (gigPoster?.email && applicant?.name && applicant?.email) {
      try {
        await sendGigApplicationEmail({
          to: gigPoster.email,
          gigTitle: gig.title,
          applicantName: applicant.name,
          applicantEmail: applicant.email,
        });
      } catch (error) {
        console.error('Failed to send email notification:', error);
      }
    }

    return NextResponse.json(
      { message: 'Application submitted', application },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Error applying to gig:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// 🗑️ Delete Gig (Poster only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ gigId: string }> } // Correct type for params
) {
  const userOrResponse = await getUserFromToken();
  if (!('userId' in userOrResponse)) return userOrResponse;

  const { userId } = userOrResponse;
  const { gigId } = await params;

  try {
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
  } catch (error) {
    console.error('❌ Error deleting gig:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}