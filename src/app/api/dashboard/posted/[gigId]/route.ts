// src/app/api/dashboard/posted/[gigId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/getUserFromServer';

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ gigId: string }> }
) {
  const { gigId } = await context.params;
  return deleteGig(req, gigId);
}

/* ───────── actual delete logic ───────── */
async function deleteGig(req: NextRequest, gigId: string) {
  /* --- auth --- */
  const userOrResponse = await getUserFromToken();
  if (!('userId' in userOrResponse)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = userOrResponse.userId;

  /* --- find gig --- */
  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    select: { postedById: true },
  });

  if (!gig) {
    return NextResponse.json({ message: 'Gig not found' }, { status: 404 });
  }

  /* --- check ownership --- */
  if (gig.postedById !== userId) {
    return NextResponse.json(
      { message: 'You are not allowed to delete this gig.' },
      { status: 403 }
    );
  }

  /* --- delete children first (MongoDB doesn't cascade) --- */
    /* --- delete children first (MongoDB doesn't cascade) --- */
    try {
      await prisma.$transaction(async (tx) => {
        await tx.application.deleteMany({ where: { gigId } });
        await tx.message.deleteMany({ where: { gigId } });
        await tx.review.deleteMany({ where: { gigId } });
        await tx.gig.delete({ where: { id: gigId } });
      });
  
      return NextResponse.json({ message: "Gig deleted successfully" }, { status: 200 });
    } catch (error: unknown) {
      console.error("Delete gig error:", error);
  
      const message = error instanceof Error ? error.message : "Unknown error";
  
      return NextResponse.json(
        { message: "Failed to delete gig", error: message },
        { status: 500 }
      );
    }
}