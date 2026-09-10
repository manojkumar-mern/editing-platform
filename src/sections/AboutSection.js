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
        <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <div className="flex-row items-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="subheading" style={{ color: 'var(--text-dark-primary)' }}>[ 02 — ABOUT ]</span>
            <span className="timecode-tag" style={{ color: 'var(--text-dark-muted)' }}>STUDIO PHILOSOPHY</span>
          </div>
          <span className="meta-tag" style={{ color: 'var(--text-dark-secondary)' }}>CREATIVE VIDEO PRODUCTION & DIGITAL MARKETING</span>
        </div>

        {/* Section Headline */}
        <h2 className="heading-lg" style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.25rem)', color: 'var(--text-dark-primary)', lineHeight: 1.1 }}>
          {siteData.about.headline}
        </h2>

        {/* Dual Infinite Scroll Marquee Bands */}
        <div className="flex-col" style={{ gap: '0.75rem', width: '100vw', marginLeft: 'calc(-50vw + 50%)', margin: '0.5rem 0' }}>
          <div
            ref={marquee1Ref}
            className="flex-row items-center"
            style={{
              gap: '2rem',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(1.75rem, 4.5vw, 4rem)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-dark-primary)',
              opacity: 0.95,
              willChange: 'transform',
            }}
          >
            <span>WE CREATE • WE PROMOTE • WE GROW BRANDS • BRANDING FILMS • COMMERCIAL ADS •</span>
            <span>WE CREATE • WE PROMOTE • WE GROW BRANDS • BRANDING FILMS • COMMERCIAL ADS •</span>
          </div>

          <div
            ref={marquee2Ref}
            className="flex-row items-center"
            style={{
              gap: '2rem',
              whiteSpace: 'nowrap',
              fontSize: 'clamp(1.75rem, 4.5vw, 4rem)',
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
            <span>SOCIAL MEDIA HANDLING • META ADS • VIDEO EDITING • AI VIDEO PRODUCTION •</span>
            <span>SOCIAL MEDIA HANDLING • META ADS • VIDEO EDITING • AI VIDEO PRODUCTION •</span>
          </div>
        </div>

        {/* Main Content Grid: Image Studio + Philosophy */}
        <div className="grid-2col items-center" style={{ gap: 'var(--space-xl)', marginTop: 'var(--space-xs)' }}>
          {/* Left Column: Studio Workspace Photography */}
          <div className="video-container film-crop-marks" style={{ height: '360px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.12)', overflow: 'hidden' }}>
            <img
              src="/images/studio-suite.jpg"
              alt="ATZYNC Media Editing Studio Suite"
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
              <span className="badge-tag" style={{ color: '#fff', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                {siteData.about.founderText}
              </span>
            </div>
          </div>

          {/* Right Column: Statement & Founder Credit */}
          <div className="flex-col" style={{ gap: 'var(--space-md)' }}>
            <p className="body-lead" style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)', color: 'var(--text-dark-primary)' }}>
              {siteData.about.description}
            </p>

            {/* Founder Highlight Box */}
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-dark-primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                }}
              >
                TM
              </div>
              <div className="flex-col" style={{ gap: '0.2rem' }}>
                <span style={{ fontWeight: '700', fontSize: '0.9375rem', color: 'var(--text-dark-primary)' }}>
                  {siteData.founder.name}
                </span>
                <span className="subheading" style={{ fontSize: '0.75rem', color: 'var(--text-dark-secondary)' }}>
                  {siteData.founder.role}
                </span>
              </div>
            </div>

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
