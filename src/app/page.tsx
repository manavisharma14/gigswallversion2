// src/app/page.tsx
// export const dynamic = "force-dynamic";

import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import ContactUsPage from '@/components/ContactPage';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import WhatAreGigs from '@/components/WhatAreGigs';
import TestimonialsSection from '@/components/TestimonialsSection';



export const metadata = {
  title: 'GigsWall | Freelance Gigs Made Easy',
  description:
    'GigsWall is the ultimate freelance platform where anyone can post gigs and students can work, earn, and build experience. Find short-term jobs, side hustles, and projects tailored for students and communities.',
  keywords: [
    'freelance gigs',
    'student freelance',
    'student gigs',
    'freelance jobs for students',
    'short-term freelance',
    'part-time jobs',
    'hire students',
    'post gigs online',
    'earn money as a student',
    'side hustle for students',
    'online freelance platform',
    'GigsWall',
  ],
};

export default function HomePage() {
  return (
    <main className="relative">
      <Hero />
      <TestimonialsSection />
      <WhatAreGigs />

      <HowItWorks />
      <Faq />
      <ContactUsPage />
      <Footer />

      {/* ✅ fixed ticker so it stays while scrolling */}
      {/* <SuccessStories /> */}

    </main>
  );
}