import { prisma } from '@/lib/prisma';
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

export default async function GigsPage() {
  // only pull exactly the fields your UI needs
  const rawGigs = await prisma.gig.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      category: true,
      budget: true,
      description: true,
      status: true,
      createdAt: true,
    },
  });

  // convert Date → ISO string
  const gigs: Gig[] = rawGigs.map((g) => ({
    ...g,
    createdAt: g.createdAt.toISOString(),
  }));

  return (
    <div className='mt-28'> 
      <GigsListClient gigs={gigs} />
    </div>
  );
}
