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

async function getGigs(): Promise<Gig[]> {
  const res = await fetch('http://localhost:3000/api/gigs', { cache: 'no-store' });

  if (!res.ok) throw new Error('Failed to fetch gigs');
  const data = await res.json();
  return data.gigs;
}

export default async function GigsPage() {
  const gigs = await getGigs();

  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-20 px-4 sm:px-10 md:px-16 lg:px-24 font-bricolage">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#4B55C3]">
        Browse Gigs
      </h1>
      <GigsListClient gigs={gigs} />
    </div>
  );
}
