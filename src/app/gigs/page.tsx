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
  createdAt: string; // already string when fetched from API
}

export default async function GigsPage() {
  const rawGigs = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/gigs`, {
    cache: 'no-store',
  }).then(res => res.json()).then(data => data.gigs);

  const gigs: Gig[] = rawGigs; // No need to map unless renaming fields

  return (
    <div className='mt-28'> 
      <GigsListClient gigs={gigs} />
    </div>
  );
}