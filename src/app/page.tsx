// src/app/page.tsx
import React from 'react';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import AboutPage from './about/page';
import ContactUsPage from '@/components/ContactPage';
import Faq from '@/components/Faq';
import Footer from '@/components/Footer';
import WhatAreGigs from '@/components/WhatAreGigs';

export default function HomePage() {

  
  return (
    <main>
      <Hero />
      <WhatAreGigs />
      <HowItWorks />
      <AboutPage />
      <Faq />
      <ContactUsPage />
      <Footer />
    </main>
  );
}
