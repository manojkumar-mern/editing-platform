'use client';

import { useState } from 'react';
import PreloaderSection from '@/sections/PreloaderSection';
import NavbarSection from '@/sections/NavbarSection';
import HeroSection from '@/sections/HeroSection';
import StatementSection from '@/sections/StatementSection';
import WhatWeDoSection from '@/sections/WhatWeDoSection';
import ServicesSection from '@/sections/ServicesSection';
import SelectedWorkSection from '@/sections/SelectedWorkSection';
import ProcessSection from '@/sections/ProcessSection';
import AboutSection from '@/sections/AboutSection';
import CTASection from '@/sections/CTASection';
import FooterSection from '@/sections/FooterSection';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <main className="main-viewport">
      <PreloaderSection onComplete={() => setIsLoaded(true)} />
      <NavbarSection isLoaded={isLoaded} />
      <HeroSection isLoaded={isLoaded} />
      
      {/* Remaining sections maintained for scroll flow without redesign */}
      <StatementSection />
      <WhatWeDoSection />
      <ServicesSection />
      <SelectedWorkSection />
      <ProcessSection />
      <AboutSection />
      <CTASection />
      <FooterSection />
    </main>
  );
}
