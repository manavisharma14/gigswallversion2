import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ gigId: string }> }
) {
  const { gigId } = await context.params; // <-- await the promise, as you prefer
  return deleteGig(req, gigId);
}

/* ───────── actual delete logic ───────── */
async function deleteGig(req: NextRequest, gigId: string) {
  /* --- auth --- */
  const token = req.headers.get('authorization')?.split(' ')[1] ?? '';
  const payload = JSON.parse(atob(token.split('.')[1] ?? '{}'));
  const userId: string | undefined = payload?.id;

  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  /* --- find gig --- */
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

  /* --- delete --- */
  await prisma.gig.delete({ where: { id: gigId } });
  return NextResponse.json({ message: 'Gig deleted successfully' }, { status: 200 });
}