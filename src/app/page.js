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
import VideoModal from '@/components/VideoModal';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: 'SHOWREEL 2026', posterSrc: '/images/hero-poster.jpg' });

  const handleOpenModal = (data) => {
    if (data) setModalData(data);
    setIsModalOpen(true);
  };

  return (
    <main className="main-viewport">
      <PreloaderSection onComplete={() => setIsLoaded(true)} />
      <NavbarSection isLoaded={isLoaded} />

      <HeroSection isLoaded={isLoaded} onOpenModal={handleOpenModal} />
      <AboutSection />
      <ServicesSection />
      <WhatWeDoSection />
      <SelectedWorkSection onOpenModal={handleOpenModal} />
      <CTASection onOpenModal={handleOpenModal} />
      <FooterSection />

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalData.title}
        videoSrc={modalData.videoSrc}
        posterSrc={modalData.posterSrc}
      />
    </main>
  );
}
