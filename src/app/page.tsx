// src/app/page.tsx
export const dynamic = 'force-static';

import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import AboutPage from './about/page';
import ContactUsPage from '@/components/ContactPage';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import WhatAreGigs from '@/components/WhatAreGigs';

// ✅ import the floating ticker component
import SuccessStories from '@/components/SuccessStories';

export const metadata = {
  title: 'GigsWall | Student Freelance Gigs Made Easy',
  description:
    'GigsWall is the ultimate platform for students to post and apply for freelance gigs on campus. Find work, build your skills, and earn on your terms.',
  keywords: [
    'student freelance',
    'freelance gigs for students',
    'campus jobs',
    'college freelance',
    'GigsWall',
    'student gigs',
    'freelance platform',
    'earn money as a student',
  ],
};

export default function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <WhatAreGigs />
      <HowItWorks />
      <AboutPage />
      <Faq />
      <ContactUsPage />
      <Footer />

      {/* ✅ fixed ticker so it stays while scrolling */}
      <SuccessStories />

    </main>
  );
}