import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/getUserFromServer'; // Ensure this path is correct

const prisma = new PrismaClient();

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
  console.log('Authenticated userId:', userId); // Debugging

  /* --- find gig --- */
  const gig = await prisma.gig.findUnique({ where: { id: gigId } });
  if (!gig) {
    return NextResponse.json({ message: 'Gig not found' }, { status: 404 });
  }
  console.log('Gig found, postedById:', gig.postedById); // Debugging

  /* --- check ownership --- */
  if (gig.postedById !== userId) {
    return NextResponse.json(
      { message: 'You are not allowed to delete this gig.' },
      { status: 403 }
    );
  }

  /* --- delete --- */
  await prisma.gig.delete({ where: { id: gigId } });
  return NextResponse.json({ message: 'Gig deleted successfully' }, { status: 200 });
}