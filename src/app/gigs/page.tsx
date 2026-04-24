// app/gigs/page.tsx
export const dynamic = 'force-dynamic';

import React from 'react';
import GigsListClient from './GigsListClient';
import { prisma } from '@/lib/prisma';

// interface Gig {
//   id: string;
//   title: string;
//   category: string;
//   budget: number;
//   description: string;
//   status: string;
//   createdAt: string;
//   isOpen?: boolean;
// }

export async function generateMetadata() {
  return {
    title: 'Browse Freelance Gigs | GigsWall',
    description:
      'Discover and apply to freelance gigs on GigsWall. Students and freelancers can find short-term jobs, side hustles, and project opportunities posted by the community.',
    keywords: [
      'freelance gigs',
      'student freelance jobs',
      'find gigs online',
      'apply to gigs',
      'post freelance work',
      'part-time jobs for students',
      'side hustles',
      'short-term freelance',
      'GigsWall gigs',
    ],
    openGraph: {
      title: 'Browse Freelance Gigs | GigsWall',
      description:
        'Find freelance gigs, side hustles, and short-term jobs on GigsWall. Perfect for students and community freelancers.',
      url: 'https://gigswall.com/gigs',
      siteName: 'GigsWall',
      
      type: 'website',
    },
    
  };
}

export default async function GigsPage() {
  // fetch gigs (as you already do)
  // const base = process.env.NEXT_PUBLIC_BASE_URL!;
  // const raw = await fetch(`${base}/api/gigs`, { cache: 'no-store' });
  // const { gigs: rawGigs } = await raw.json();
  // const gigs: Gig[] = Array.isArray(rawGigs) ? rawGigs : [];

  const rawGigs = await prisma.gig.findMany({
  take: 20,
  orderBy: { createdAt: 'desc' },
  select: {
    id: true,
    title: true,
    category: true,
    budget: true,
    description: true,
    status: true,
    createdAt: true,
    isOpen: true,
  },
});

const gigs = rawGigs.map((gig) => ({
  ...gig,
  createdAt: gig.createdAt.toISOString(),
}));

  // build counts directly with Prisma
  const openIds = gigs
    .filter((g) => g.status?.toLowerCase?.() === 'open' || g.isOpen)
    .map((g) => g.id);

  const groupedCounts = openIds.length
  ? await prisma.application.groupBy({
      by: ['gigId'],
      _count: {
        gigId: true,
      },
      where: {
        gigId: {
          in: openIds,
        },
      },
    })
  : [];

const initialCounts: Record<string, number> = {};

groupedCounts.forEach((item) => {
  initialCounts[item.gigId] = item._count.gigId;
});
  

  return (
    <div className="mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <GigsListClient gigs={gigs} initialCounts={initialCounts} />
    </div>
  );
}