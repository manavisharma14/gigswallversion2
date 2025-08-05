"use client"
import PostGigClient from './PostGigClient';

// export const metadata = {
//   title: 'Post a Gig | GigsWall',
//   description: 'Create and post a new gig on GigsWall. Share your task, set a budget, and connect with student freelancers from your college.',
//   keywords: ['GigsWall', 'Post gig', 'Student freelancing', 'Freelance jobs', 'MIT Manipal gigs'],
//   openGraph: {
//     title: 'Post a Gig | GigsWall',
//     description: 'Post your project and find student freelancers instantly on GigsWall.',
//     url: 'https://gigswall.com/post',
//     siteName: 'GigsWall',
//     type: 'website',
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
//   alternates: {
//     canonical: 'https://gigswall.com/post',
//   },
// };

export default function PostGigPage() {
  return <PostGigClient />;
}
