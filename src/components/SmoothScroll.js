'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing for cinematic inertia
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
    });

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Attach to window object for modal & overlay scroll control
    window.lenis = lenis;

    // Synchronize Lenis raf loop with GSAP ticker
    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Global Scroll Reveal Observer for smooth down-to-up content arranging
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1,
      }
    );

    // Observe initial scroll reveal elements without heavy polling
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => revealObserver.observe(el));

    // Handle any delayed mounts safely once
    const timeoutId = setTimeout(() => {
      document.querySelectorAll('.scroll-reveal:not(.is-revealed)').forEach((el) => {
        revealObserver.observe(el);
      });
      ScrollTrigger.refresh();
    }, 800);

    return () => {
      if (window.lenis === lenis) window.lenis = null;
      gsap.ticker.remove(updateTicker);
      clearTimeout(timeoutId);
      revealObserver.disconnect();
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
