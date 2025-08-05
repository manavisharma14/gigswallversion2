export const dynamic = 'force-dynamic';

import React from 'react';
import GigsListClient from './GigsListClient';

interface Gig {
  id: string;
  title: string;
  category: string;
  budget: number;
  description: string;
  status: string;
  createdAt: string;
}

// ✅ Add metadata for SEO
export async function generateMetadata() {
  return {
    title: "Browse Gigs | GigsWall",
    description: "Explore a variety of freelance gigs posted by students on GigsWall. Filter by category and apply easily.",
  };
}

export default async function GigsPage() {
  const rawGigs = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gigs`, {
    cache: 'no-store',
  }).then(res => res.json()).then(data => data.gigs);

  const gigs: Gig[] = rawGigs;

  return (
    <div className='mt-28'> 
      <GigsListClient gigs={gigs} />
    </div>
  );
}