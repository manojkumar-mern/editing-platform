'use client';

import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { siteData } from '@/data/siteData';
import { soundManager } from '@/lib/audioManager';

export default function ServicesSection({ onOpenProjectModal }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  const serviceImages = [
    '/images/brand-poster.jpg',
    '/images/project-01.jpg',
    '/images/project-02.jpg',
    '/images/studio-suite.jpg',
    '/images/hero-poster.jpg',
    '/images/color-after.jpg',
    '/images/project-03.jpg',
  ];

  const serviceWatermarks = [
    'BRANDING',
    'COMMERCIAL',
    'SOCIAL',
    'CHANNELS',
    'META ADS',
    'EDITING',
    'AI VIDEO',
  ];

  const serviceSpecs = [
    ['Cinematic Pacing', 'Custom Color Grade', 'Sound Architecture'],
    ['Conversion Hooks', 'Dynamic Rhythm Cuts', 'High-Impact SFX'],
    ['9:16 Retention Cuts', 'Viral Hook Design', 'Motion Typography'],
    ['Channel Strategy', 'Content Curation', 'Audience Growth'],
    ['Creative Testing', 'Multi-Hook Variations', 'Direct-Response Edits'],
    ['Precision Assembly', 'Master Export Suites', 'ARRI/LOG Color Mastery'],
    ['Generative Synthesis', 'Neural VFX Cleanup', 'AI Upscaling & Motion'],
  ];

  const serviceItems = siteData.services.map((srv, idx) => ({
    ...srv,
    image: serviceImages[idx % serviceImages.length],
    watermark: serviceWatermarks[idx % serviceWatermarks.length],
    specs: serviceSpecs[idx % serviceSpecs.length],
  }));

  useEffect(() => {
    if (!containerRef.current || cardRefs.current.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Create stacking card depth effect for each card except the last
      cardRefs.current.forEach((cardEl, index) => {
        if (!cardEl || index === cardRefs.current.length - 1) return;

        const nextCard = cardRefs.current[index + 1];
        if (!nextCard) return;

        // As nextCard scrolls up to stack over this card, scale down and dim this card
        gsap.to(cardEl, {
          scale: 0.94,
          filter: 'brightness(0.68)',
          opacity: 0.82,
          transformOrigin: 'top center',
          ease: 'none',
          scrollTrigger: {
            trigger: nextCard,
            start: 'top 85%',
            end: 'top 120px',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="services-stacking-section border-bottom"
      id="services"
      style={{
        backgroundColor: '#07080c',
        position: 'relative',
        paddingTop: 'clamp(4rem, 8vh, 6rem)',
        paddingBottom: 'clamp(5rem, 10vh, 8rem)',
        width: '100%',
        overflow: 'visible',
      }}
    >
      <div className="site-container flex-col" style={{ gap: 'clamp(2.5rem, 5vh, 4rem)' }}>
        {/* Section Header */}
        <div className="flex-col" style={{ gap: '0.85rem' }}>
          <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
            <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
              <span className="subheading" style={{ color: 'var(--accent-orange)' }}>
                [ 03 — CAPABILITIES ]
              </span>
              <span className="timecode-tag">07 BESPOKE SERVICES</span>
            </div>
            <span className="meta-tag">IDEAS → VISUALS → IMPACT</span>
          </div>

          <div className="flex-row items-baseline justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
            <h2
              className="heading-lg"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
                color: '#ffffff',
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              CORE CAPABILITIES
            </h2>
            <span className="meta-tag" style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.8rem' }}>
              SCROLL TO ARRANGE CARDS ↓
            </span>
          </div>
        </div>

        {/* Stacking Cards Deck (One-by-One Arranging) */}
        <div className="stacking-deck-container flex-col" style={{ width: '100%', gap: 'clamp(2rem, 4vh, 3.5rem)' }}>
          {serviceItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className="stacked-service-card"
              style={{
                position: 'sticky',
                top: 'clamp(75px, 11vh, 100px)',
                zIndex: index + 1,
                willChange: 'transform, filter, opacity',
                transform: 'translate3d(0, 0, 0)',
              }}
              onClick={() => {
                soundManager.playClick();
                if (onOpenProjectModal) onOpenProjectModal(item.title);
              }}
            >
              {/* Giant Background Watermark Text (CrazyPencilz Inspired) */}
              <div
                className="card-background-watermark"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: '-1%',
                  bottom: '-8%',
                  fontSize: 'clamp(5rem, 14vw, 13rem)',
                  fontWeight: 900,
                  color: 'rgba(255, 255, 255, 0.035)',
                  lineHeight: 0.8,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  fontFamily: 'var(--font-display, Impact, sans-serif)',
                  zIndex: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {item.watermark}
              </div>

              {/* Card Inner Grid: Visual Media (Left) + Detailed Narrative (Right) */}
              <div className="stacked-card-grid">
                {/* Left Column: Visual Media Showcase */}
                <div className="stacked-card-media-wrap film-crop-marks">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="stacked-card-img"
                  />
                  <div className="stacked-card-img-overlay" />

                  {/* Corner Badge */}
                  <div
                    className="flex-row items-center justify-between"
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      right: '1rem',
                      zIndex: 3,
                    }}
                  >
                    <span
                      className="badge-tag"
                      style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                        color: 'var(--accent-orange)',
                        borderColor: 'rgba(235, 94, 40, 0.4)',
                        fontSize: '0.68rem',
                      }}
                    >
                      {item.number} // CAPABILITY
                    </span>
                    <span className="timecode-tag" style={{ fontSize: '0.65rem', background: 'rgba(0,0,0,0.6)' }}>
                      4K MASTER
                    </span>
                  </div>

                  {/* Bottom Preview Hint */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      left: '1rem',
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-orange)',
                        display: 'inline-block',
                      }}
                    />
                    STUDIO PRODUCTION
                  </div>
                </div>

                {/* Right Column: Narrative & Action */}
                <div className="stacked-card-body flex-col justify-between" style={{ position: 'relative', zIndex: 1 }}>
                  {/* Top: Header & Tagline */}
                  <div className="flex-col" style={{ gap: '0.75rem' }}>
                    <div className="flex-row items-center" style={{ gap: '0.6rem' }}>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: 'var(--accent-orange)',
                          letterSpacing: '0.1em',
                        }}
                      >
                        [ {item.number} ]
                      </span>
                      <span className="meta-tag" style={{ fontSize: '0.75rem' }}>
                        ATZYNC STUDIO SERVICE
                      </span>
                    </div>

                    <h3
                      className="stacked-card-title"
                      style={{
                        fontSize: 'clamp(1.75rem, 3.2vw, 2.75rem)',
                        fontWeight: 900,
                        color: '#ffffff',
                        lineHeight: 1.1,
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      className="body-lead"
                      style={{
                        fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)',
                        color: 'rgba(255, 255, 255, 0.9)',
                        lineHeight: 1.4,
                        fontWeight: 500,
                        marginTop: '0.2rem',
                      }}
                    >
                      {item.tagline}
                    </p>

                    <p
                      className="body-regular"
                      style={{
                        fontSize: 'clamp(0.82rem, 1.1vw, 0.92rem)',
                        color: 'rgba(255, 255, 255, 0.65)',
                        lineHeight: 1.6,
                        maxWidth: '540px',
                      }}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Bottom: Capability Pills & CTA */}
                  <div className="flex-col" style={{ gap: '1.25rem', marginTop: '1.5rem' }}>
                    {/* Capability Tags */}
                    <div className="flex-row items-center" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                      {item.specs.map((spec, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '0.35rem 0.75rem',
                            borderRadius: '100px',
                            backgroundColor: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            color: 'rgba(255, 255, 255, 0.85)',
                            letterSpacing: '0.02em',
                          }}
                        >
                          ✓ {spec}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div className="flex-row items-center" style={{ gap: '1rem' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playClick();
                          if (onOpenProjectModal) onOpenProjectModal(item.title);
                        }}
                        className="btn-primary flex-row items-center"
                        style={{
                          padding: '0.65rem 1.4rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          borderRadius: '100px',
                          cursor: 'pointer',
                          gap: '0.5rem',
                        }}
                      >
                        <span>INQUIRE THIS SERVICE</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>

                      <span
                        className="meta-tag"
                        style={{
                          fontSize: '0.72rem',
                          color: 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        FAST 48H TURNAROUND
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
