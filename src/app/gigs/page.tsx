// app/gigs/page.tsx
export const dynamic = 'force-dynamic';

import React from 'react';
import GigsListClient from './GigsListClient';
import { prisma } from '@/lib/prisma';

interface Gig {
  id: string;
  title: string;
  category: string;
  budget: number;
  description: string;
  status: string;
  createdAt: string;
  isOpen?: boolean;
}

export async function generateMetadata() {
  return {
    title: 'Browse Gigs | GigsWall',
    description:
      'Explore a variety of freelance gigs posted by students on GigsWall. Filter by category and apply easily.',
  };
}

export default async function GigsPage() {
  // fetch gigs (as you already do)
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const raw = await fetch(`${base}/api/gigs`, { cache: 'no-store' });
  const { gigs: rawGigs } = await raw.json();
  const gigs: Gig[] = rawGigs;

  // build counts directly with Prisma
  const openIds = gigs
    .filter((g) => g.status?.toLowerCase?.() === 'open' || g.isOpen)
    .map((g) => g.id);

  const initialCounts: Record<string, number> = {};
  await Promise.all(
    openIds.map(async (gigId) => {
      const c = await prisma.application.count({ where: { gigId } });
      initialCounts[gigId] = c;
    })
  );

  return (
    <div className="mt-28">
      <GigsListClient gigs={gigs} initialCounts={initialCounts} />
    </div>
  );
}