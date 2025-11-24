import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ gigId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { gigId } = await params;

  if (!gigId) {
    return NextResponse.json({ message: "Invalid gig ID" }, { status: 400 });
  }

  try {
    const gig = await prisma.gig.findUnique({
      where: { id: gigId },
      select: { postedById: true },
    });

    if (!gig) {
      return NextResponse.json({ message: "Gig not found" }, { status: 404 });
    }

    // ✅ Only poster can close gig
    if (gig.postedById !== session.user.id) {
      return NextResponse.json(
        { message: "Not authorized to close this gig" },
        { status: 403 }
      );
    }

    const updatedGig = await prisma.gig.update({
      where: { id: gigId },
      data: {
        status: "closed",
        isOpen: false,
      },
    });

    return NextResponse.json({
      message: "Gig closed successfully",
      gig: updatedGig,
    });
  } catch (error) {
    console.error("[GIG_CLOSE_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to close gig" },
      { status: 500 }
    );
  }
}