'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';
import { soundManager } from '@/lib/audioManager';

export default function ServicesSection({ onOpenProjectModal }) {
  const sectionRef = useRef(null);
  const titleContainerRef = useRef(null);
  const cardsContentRef = useRef(null);

  const serviceImages = [
    '/images/project-01.jpg',
    '/images/project-02.jpg',
    '/images/project-03.jpg',
    '/images/studio-suite.jpg',
    '/images/hero-poster.jpg',
    '/images/brand-poster.jpg',
    '/images/color-after.jpg',
  ];

  const serviceItems = siteData.services.map((srv, idx) => ({
    ...srv,
    image: serviceImages[idx % serviceImages.length],
  }));

  useEffect(() => {
    if (!sectionRef.current || !titleContainerRef.current || !cardsContentRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const targetScale = isMobile ? 2.2 : 2.8;

      let glideDistance = 0;
      const calculateGlide = () => {
        if (!cardsContentRef.current) return;
        const contentHeight = cardsContentRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        const diff = contentHeight - viewportHeight + 90;
        glideDistance = diff > 0 ? diff : 0;
      };
      calculateGlide();

      // Ensure title has mathematical centering coordinates
      gsap.set(titleContainerRef.current, {
        left: '50%',
        top: '50%',
        xPercent: -50,
        yPercent: -50,
      });

      // Ensure cards are hidden initially with autoAlpha
      gsap.set(cardsContentRef.current, {
        autoAlpha: 0,
      });

      // Single master timeline pinning the cinematic stage
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          pinSpacing: true,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.0 + glideDistance}`,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: calculateGlide,
        },
      });

      // ==========================================
      // PHASE 1: TITLE ENTERS TO DEAD CENTER (0.00 -> 0.20)
      // ==========================================
      masterTl.fromTo(
        titleContainerRef.current,
        {
          y: 90,
          autoAlpha: 0,
          scale: 0.92,
        },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.20,
          ease: 'power2.out',
        },
        0
      );

      // ==========================================
      // PHASE 2: CENTER / LOCK HOLD (0.20 -> 0.35)
      // Text stays locked dead-centered with balanced space
      // ==========================================
      masterTl.to({}, { duration: 0.15 }, 0.20);

      // ==========================================
      // PHASE 3: SMOOTH ZOOM INTO TYPOGRAPHY (0.35 -> 0.65)
      // Word scales up smoothly (scale: 1 -> 2.8) so letters never cut off
      // ==========================================
      masterTl.to(
        titleContainerRef.current,
        {
          scale: targetScale,
          ease: 'power1.inOut',
          duration: 0.30,
        },
        0.35
      );

      // Title dissolves smoothly between 0.48 and 0.65
      masterTl.to(
        titleContainerRef.current,
        {
          autoAlpha: 0,
          duration: 0.17,
          ease: 'power1.out',
        },
        0.48
      );

      // ==========================================
      // PHASE 4: REVEAL CARDS CONTENT (0.48 -> 0.68)
      // Cards container fades in smoothly behind zoom
      // ==========================================
      masterTl.fromTo(
        cardsContentRef.current,
        {
          autoAlpha: 0,
          scale: 0.96,
          y: 25,
          pointerEvents: 'none',
        },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.20,
          ease: 'power2.out',
          pointerEvents: 'auto',
        },
        0.48
      );

      // ==========================================
      // PHASE 5: DYNAMIC GLIDE FOR ALL CARDS (0.70 -> 0.95)
      // Uses pre-calculated glideDistance to prevent layout thrashing lag
      // ==========================================
      masterTl.to(
        cardsContentRef.current,
        {
          y: () => -glideDistance,
          ease: 'power1.inOut',
          duration: 0.25,
        },
        0.70
      );

      // ==========================================
      // PHASE 6: HOLD BUFFER & SMOOTH RELEASE (0.95 -> 1.05)
      // ==========================================
      masterTl.to({}, { duration: 0.10 }, 0.95);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-bottom"
      id="services"
      style={{
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100vh',
      }}
    >
      {/* 100vh Cinematic Pinned Stage */}
      <div
        className="service-cinematic-stage"
        style={{
          height: '100vh',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          boxSizing: 'border-box',
          isolation: 'isolate',
        }}
      >
        {/* LAYER 1: GIANT CENTERING WORD 'SERVICES' (SCROLL-DRIVEN ZOOM) */}
        <div
          ref={titleContainerRef}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            zIndex: 25,
            pointerEvents: 'none',
            textAlign: 'center',
            width: '100%',
            maxWidth: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          <h2
            className="display-hero"
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 4.8rem)',
              lineHeight: 0.95,
              fontWeight: 900,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: '#ffffff',
              margin: 0,
              whiteSpace: 'nowrap',
              textShadow: '0 4px 20px rgba(0, 0, 0, 0.6)',
            }}
          >
            SERVICES
          </h2>
        </div>

        {/* LAYER 2: REVEALED SERVICES CARDS CONTENT */}
        <div
          ref={cardsContentRef}
          className="site-container flex-col"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            margin: '0 auto',
            gap: 'clamp(1rem, 2vh, 1.4rem)',
            zIndex: 10,
            width: '100%',
            paddingTop: 'clamp(5.2rem, 10vh, 6.8rem)',
            paddingBottom: 'clamp(3.5rem, 6vh, 5rem)',
            boxSizing: 'border-box',
            justifyContent: 'flex-start',
            opacity: 0,
            willChange: 'transform, opacity',
          }}
        >
          {/* Header Ribbon */}
          <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <div className="flex-row items-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
              <span className="subheading" style={{ color: 'var(--text-secondary)' }}>[ 03 — SERVICES ]</span>
              <span className="timecode-tag">07 CORE CAPABILITIES</span>
            </div>
            <div className="flex-row items-center" style={{ gap: '0.5rem' }}>
              <span className="meta-tag">CREATIVE PRODUCTION &amp; MARKETING</span>
            </div>
          </div>

          {/* Section Heading */}
          <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem', marginBottom: '0.2rem' }}>
            <h2 className="heading-lg" style={{ fontSize: 'clamp(1.4rem, 2.7vw, 2.2rem)' }}>
              CORE CAPABILITIES &amp; SERVICES
            </h2>
            <span className="meta-tag" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
              HOVER CARDS TO EXPLORE →
            </span>
          </div>

          {/* Creative Column Services Grid */}
          <div className="services-card-grid">
            {serviceItems.map((item, index) => (
              <div
                key={item.id}
                className={`service-card film-crop-marks ${index === serviceItems.length - 1 ? 'card-featured-wide' : ''}`}
                onClick={() => {
                  soundManager.playClick();
                  if (onOpenProjectModal) onOpenProjectModal(item.title);
                }}
              >
                {/* Background Image Visual */}
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="service-card-image"
                />

                {/* Vignette Overlay */}
                <div className="service-card-overlay" />

                {/* Card Content Layer */}
                <div className="service-card-content">
                  {/* Top Bar: Service Number Badge */}
                  <div className="service-card-top">
                    <span
                      className="badge-tag"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(6px)',
                        color: '#ffffff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        fontSize: '0.68rem',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '20px',
                      }}
                    >
                      {item.number} // {item.title.toUpperCase()}
                    </span>
                  </div>

                  {/* Bottom Bar: Title & Hover-Revealed Details */}
                  <div className="service-card-bottom">
                    <h3 className="service-card-title">{item.title}</h3>

                    {/* Revealed on Hover */}
                    <div className="service-card-details">
                      <p className="body-lead" style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.4, fontWeight: 500 }}>
                        {item.tagline}
                      </p>

                      <p className="body-regular" style={{ fontSize: '0.76rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.4 }}>
                        {item.description}
                      </p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playClick();
                          if (onOpenProjectModal) onOpenProjectModal(item.title);
                        }}
                        className="btn-secondary"
                        style={{
                          padding: '0.45rem 0.9rem',
                          fontSize: '0.7rem',
                          alignSelf: 'flex-start',
                          marginTop: '0.25rem',
                          backgroundColor: '#ffffff',
                          color: '#000000',
                          fontWeight: 700,
                          border: 'none',
                          borderRadius: '20px',
                          cursor: 'pointer',
                        }}
                      >
                        INQUIRE THIS SERVICE →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
