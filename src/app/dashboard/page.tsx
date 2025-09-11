// app/dashboard/page.tsx
import { cookies } from 'next/headers';
import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'GigsWall Dashboard | Manage Gigs, Applications & Freelance Work',
  description:
    'Access your GigsWall dashboard to post gigs, track applications, manage your freelance profile, and connect with students and communities in the gig economy.',
  keywords: [
    'GigsWall dashboard',
    'student freelance dashboard',
    'manage gigs online',
    'track job applications',
    'post freelance gigs',
    'hire students',
    'freelance platform',
  ],
  openGraph: {
    title: 'GigsWall Dashboard',
    description:
      'Manage your gigs, applications, and freelance work directly from your GigsWall dashboard.',
    url: 'https://gigswall.com/dashboard',
    siteName: 'GigsWall',
    type: 'website',
  },
  
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  const userCookie = cookieStore.get('user')?.value;
  let user = null;

  if (userCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userCookie));
    } catch{
      console.error('Invalid user cookie format');
    }
  }

  let postedGigs = [];
  let appliedGigs = [];

  if (token) {
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [posted, applied] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/posted`, {
          headers,
          cache: 'no-store',
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/dashboard/applied`, {
          headers,
          cache: 'no-store',
        }),
      ]);

      if (posted.ok) {
        const postedData = await posted.json();
        postedGigs = postedData.gigs || [];
      }

      if (applied.ok) {
        const appliedData = await applied.json();
        appliedGigs = appliedData.applications || [];
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
  }

  return (
    <DashboardClient
      user={user}
      postedGigs={postedGigs}
      appliedGigs={appliedGigs}
    />
  );
}