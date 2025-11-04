import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { gigId, applicationId } = await req.json();

    if (!gigId || !applicationId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // fetch gig + application to know student & payment
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        gig: true,
        user: true
      }
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const studentId = application.userId; // ✅ correct student
    const gigAmount = application.gig?.budget ?? 0;

    if (gigAmount <= 0) {
      return NextResponse.json({ error: "Invalid gig amount" }, { status: 400 });
    }

    // transaction: complete job + credit wallet
    await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: {
          completed: true,
          paymentStatus: "released",
          escrow: false
        }
      }),
      prisma.user.update({
        where: { id: studentId },
        data: {
          walletBalance: { increment: gigAmount }
        }
      })
    ]);

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}