'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis smooth scroll with exponential cinematic easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    window.lenis = lenis;

    const updateTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Global Scroll Reveal Observer for smooth, staggered down-to-up entry
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
        rootMargin: '0px 0px 50px 0px',
        threshold: 0.05,
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

      elements.forEach((el) => {
        if (el.classList.contains('is-revealed')) return;

        const rect = el.getBoundingClientRect();
        // If element is already visible inside the active viewport at load, reveal it
        if (rect.top <= windowHeight * 0.9 && rect.bottom >= 0) {
          el.classList.add('is-revealed');
        } else {
          revealObserver.observe(el);
        }
      });
    };

    // Run initial observation check
    const initTimer = setTimeout(observeElements, 50);

    // MutationObserver to automatically catch dynamically mounted elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    if (document.body) {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    const handleResizeOrFocus = () => {
      observeElements();
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResizeOrFocus);
    window.addEventListener('focus', handleResizeOrFocus);

    return () => {
      if (window.lenis === lenis) window.lenis = null;
      gsap.ticker.remove(updateTicker);
      clearTimeout(initTimer);
      revealObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', handleResizeOrFocus);
      window.removeEventListener('focus', handleResizeOrFocus);
      lenis.destroy();
    };
  }, []);

  // On route changes (pathname changes), re-observe elements and refresh GSAP ScrollTrigger
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-reveal');
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.9 && rect.bottom >= 0) {
          el.classList.add('is-revealed');
        }
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
