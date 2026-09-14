'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing for cinematic inertia
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: false,
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

    // Global Scroll Reveal Observer for smooth content entry
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
        rootMargin: '0px 0px -20px 0px',
        threshold: 0.05,
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal');
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

      elements.forEach((el) => {
        if (el.classList.contains('is-revealed')) return;

        const rect = el.getBoundingClientRect();
        // If element is in or near viewport, reveal immediately
        if (rect.top <= windowHeight + 100 && rect.bottom >= -100) {
          el.classList.add('is-revealed');
        } else {
          revealObserver.observe(el);
        }
      });
    };

    // Run initial check
    observeElements();

    // MutationObserver to automatically catch and observe dynamically mounted elements
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });
    if (document.body) {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Handle tab focus, screen wake (visibilitychange), and window resize
    const handleScreenWakeOrResize = () => {
      observeElements();
      ScrollTrigger.refresh();
    };

    window.addEventListener('visibilitychange', handleScreenWakeOrResize);
    window.addEventListener('resize', handleScreenWakeOrResize);
    window.addEventListener('focus', handleScreenWakeOrResize);

    // Failsafe timer: ensure all scroll-reveal elements are visible after loading
    const failsafeId = setTimeout(() => {
      document.querySelectorAll('.scroll-reveal:not(.is-revealed)').forEach((el) => {
        el.classList.add('is-revealed');
      });
      ScrollTrigger.refresh();
    }, 1200);

    return () => {
      if (window.lenis === lenis) window.lenis = null;
      gsap.ticker.remove(updateTicker);
      clearTimeout(failsafeId);
      revealObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('visibilitychange', handleScreenWakeOrResize);
      window.removeEventListener('resize', handleScreenWakeOrResize);
      window.removeEventListener('focus', handleScreenWakeOrResize);
      lenis.destroy();
    };
  }, []);

  // On route changes (pathname changes), reset scroll, re-observe elements, and refresh GSAP ScrollTrigger
  useEffect(() => {
    if (typeof window !== 'undefined' && window.lenis) {
      window.lenis.scrollTo(0, { immediate: true });
    }

    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-reveal');
      const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= windowHeight + 100 && rect.bottom >= -100) {
          el.classList.add('is-revealed');
        }
      });
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}

