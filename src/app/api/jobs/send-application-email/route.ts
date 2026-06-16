import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendGigApplicationEmail } from "@/lib/emailSender";

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json();

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { error: "application not found" },
        { status: 404 }
      );
    }

    const applicant = await prisma.user.findUnique({
      where: { id: application.userId },
    });

    const gig = await prisma.gig.findUnique({
      where: { id: application.gigId },
    });

    if (!gig) {
      return NextResponse.json(
        { error: "gig not found" },
        { status: 404 }
      );
    }

    const poster = await prisma.user.findUnique({
      where: { id: gig.postedById },
    });

    if (
      poster?.email &&
      applicant?.name &&
      applicant?.email
    ) {
      await sendGigApplicationEmail({
        to: poster.email,
        gigTitle: gig.title,
        applicantName: applicant.name,
        applicantEmail: applicant.email,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "worker failed" },
      { status: 500 }
    );
  }
}