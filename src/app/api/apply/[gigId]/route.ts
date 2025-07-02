import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  context: { params: { gigId: string } }
) {
  try {
    const { reason, experience, portfolio, extra } = await req.json();
    const gigId = context.params.gigId; // ✅ Accessing params properly

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    const payload = JSON.parse(atob(token?.split('.')[1] || '{}'));
    const userId = payload?.id;

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    if (gig.postedById === userId) {
      return NextResponse.json({ message: "You cannot apply to your own gig." }, { status: 400 });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        userId,
        gigId,
      },
    });

    if (existingApplication) {
      return NextResponse.json({ message: "You have already applied to this gig." }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        userId,
        gigId,
        reason,
        experience,
        portfolio,
        extra,
      },
    });

    return NextResponse.json({ message: "Application submitted", application }, { status: 201 });
  } catch (err) {
    console.error("Apply error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
