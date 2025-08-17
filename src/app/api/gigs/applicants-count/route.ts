import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Accepts: GET /api/gigs/applicants-count?ids=id1,id2,id3
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get('ids');
  if (!idsParam) {
    return NextResponse.json({ error: 'ids query param required' }, { status: 400 });
  }

  const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean);
  if (ids.length === 0) return NextResponse.json({ counts: {} });

  // Only open gigs
  const openGigs = await prisma.gig.findMany({
    where: {
      id: { in: ids },
      OR: [{ status: 'open' }, { isOpen: true }],
    },
    select: { id: true },
  });

  const openIds = openGigs.map(g => g.id);
  if (openIds.length === 0) return NextResponse.json({ counts: {} });

  // Count applications per open gig
  const counts: Record<string, number> = {};
  await Promise.all(
    openIds.map(async (gigId) => {
      const c = await prisma.application.count({ where: { gigId } });
      counts[gigId] = c;
    })
  );

  return NextResponse.json({ counts });
}