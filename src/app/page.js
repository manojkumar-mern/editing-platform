'use client';

import { useState } from 'react';
import PreloaderSection from '@/sections/PreloaderSection';
import NavbarSection from '@/sections/NavbarSection';
import HeroSection from '@/sections/HeroSection';
import AboutSection from '@/sections/AboutSection';
import ServicesSection from '@/sections/ServicesSection';
import WhatWeDoSection from '@/sections/WhatWeDoSection';
import SelectedWorkSection from '@/sections/SelectedWorkSection';
import CTASection from '@/sections/CTASection';
import FooterSection from '@/sections/FooterSection';
import VideoModal from '@/components/VideoModal';
import ProjectModal from '@/components/ProjectModal';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: 'SHOWREEL 2026', posterSrc: '/images/hero-poster.jpg' });

  // Project Inquiry Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectService, setProjectService] = useState('');

  const handleOpenModal = (data) => {
    if (data) setModalData(data);
    setIsModalOpen(true);
  };

  const handleOpenProjectModal = (serviceTitle = '') => {
    setProjectService(serviceTitle || '');
    setIsProjectModalOpen(true);
  };

  return (
    <main className="main-viewport">
      <PreloaderSection onComplete={() => setIsLoaded(true)} />
      <NavbarSection isLoaded={isLoaded} onOpenProjectModal={handleOpenProjectModal} />

      <HeroSection isLoaded={isLoaded} onOpenModal={handleOpenModal} onOpenProjectModal={handleOpenProjectModal} />
      <AboutSection />
      <ServicesSection onOpenProjectModal={handleOpenProjectModal} />
      <WhatWeDoSection />
      <SelectedWorkSection onOpenModal={handleOpenModal} />
      <CTASection onOpenModal={handleOpenModal} onOpenProjectModal={handleOpenProjectModal} />
      <FooterSection />

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalData.title}
        videoSrc={modalData.videoSrc}
        posterSrc={modalData.posterSrc}
      />

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        initialService={projectService}
      />
    </main>
  );
}
