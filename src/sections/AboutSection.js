'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function AboutSection() {
  const sectionRef = useRef(null);
  const marquee1Ref = useRef(null);
  const marquee2Ref = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Marquee scroll velocity skew effect
      gsap.to(marquee1Ref.current, {
        xPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(marquee2Ref.current, {
        xPercent: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: '500+', label: 'EDITORIAL CUTS COMPLETED' },
    { value: '40+', label: 'BRANDING FILMS MASTERED' },
    { value: '99.8%', label: 'CLIENT RETENTION RATE' },
  ];

  return (
    <section
      ref={sectionRef}
      className="section-wrapper border-bottom"
      id="about"
      style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark-primary)', overflow: 'hidden' }}
    >
      <div className="site-container flex-col" style={{ gap: 'var(--space-xl)' }}>
        {/* Header Ribbon */}
        <div className="flex-row items-center justify-between">
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading" style={{ color: 'var(--text-dark-primary)' }}>[ ABOUT ATZINC MEDIA ]</span>
            <span className="timecode-tag" style={{ color: 'var(--text-dark-muted)' }}>SCENE 06 // STUDIO PHILOSOPHY</span>
          </div>
          <span className="meta-tag" style={{ color: 'var(--text-dark-secondary)' }}>POST-PRODUCTION POWERHOUSE</span>
        </div>

        {/* Dual Infinite Scroll Marquee Bands */}
        <div className="flex-col" style={{ gap: '0.75rem', width: '100vw', marginLeft: 'calc(-50vw + 50%)', margin: '1rem 0' }}>
          <div
            ref={marquee1Ref}
            className="flex-row items-center"
            style={{
              gap: '2rem',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-dark-primary)',
              opacity: 0.95,
              willChange: 'transform',
            }}
          >
            <span>EDITORIAL DIRECTION • COLOR GRADING • SOUND ARCHITECTURE • COMMERCIAL CUTS •</span>
            <span>EDITORIAL DIRECTION • COLOR GRADING • SOUND ARCHITECTURE • COMMERCIAL CUTS •</span>
          </div>

          <div
            ref={marquee2Ref}
            className="flex-row items-center"
            style={{
              gap: '2rem',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(2rem, 5vw, 4.5rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'transparent',
              WebkitTextStroke: '1.5px var(--text-dark-primary)',
              opacity: 0.6,
              willChange: 'transform',
            }}
          >
            <span>RHYTHMIC PACING • 4K DCI • ARRI LOOK • HIGH RETENTION REELS •</span>
            <span>RHYTHMIC PACING • 4K DCI • ARRI LOOK • HIGH RETENTION REELS •</span>
          </div>
        </div>

        {/* Main Content Grid: Image Studio + Philosophy */}
        <div className="grid-2col items-center" style={{ gap: 'var(--space-xl)', marginTop: 'var(--space-md)' }}>
          {/* Left Column: Studio Workspace Photography */}
          <div className="video-container film-crop-marks" style={{ height: '360px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.12)', overflow: 'hidden' }}>
            <img
              src="/images/studio-suite.jpg"
              alt="ATZINC Media Editing Studio Suite"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)',
                zIndex: 2,
              }}
            />
            <div className="flex-row items-center justify-between" style={{ position: 'absolute', bottom: '1rem', left: '1.25rem', right: '1.25rem', zIndex: 3 }}>
              <span className="badge-tag" style={{ color: '#fff', backgroundColor: 'rgba(0,0,0,0.8)' }}>SUITE 01 // EDITORIAL BAY</span>
            </div>
          </div>

          {/* Right Column: Statement & Stats Grid */}
          <div className="flex-col" style={{ gap: 'var(--space-md)' }}>
            <p className="body-lead" style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.35rem)', color: 'var(--text-dark-primary)' }}>
              {siteData.name} operates as a specialized post-production visual powerhouse. We focus exclusively on what makes video content convert, resonate, and endure across modern screens.
            </p>

            <p className="body-regular" style={{ fontSize: '1rem', color: 'var(--text-dark-secondary)' }}>
              By blending high-fashion editorial aesthetics, precise rhythmic pacing, and bespoke audio sound architecture, we turn ordinary commercial and branding assets into captivating visual statements.
            </p>

            {/* Stats Grid */}
            <div className="grid-3col border-top" style={{ paddingTop: 'var(--space-md)', gap: '1rem', borderTopColor: 'rgba(0,0,0,0.12)' }}>
              {stats.map((stat, i) => (
                <div key={i} className="flex-col" style={{ gap: '0.25rem' }}>
                  <span className="display-title" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: 'var(--text-dark-primary)' }}>
                    {stat.value}
                  </span>
                  <span className="meta-tag" style={{ fontSize: '0.6875rem', color: 'var(--text-dark-muted)' }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
