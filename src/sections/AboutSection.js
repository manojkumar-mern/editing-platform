'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function AboutSection() {
  const sectionRef = useRef(null);

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
        <div className="flex-row items-center justify-between scroll-reveal stagger-1" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <div className="flex-row items-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="subheading" style={{ color: 'var(--text-dark-primary)' }}>[ 02 — ABOUT ]</span>
            <span className="timecode-tag" style={{ color: 'var(--text-dark-muted)' }}>STUDIO PHILOSOPHY</span>
          </div>
          <span className="meta-tag" style={{ color: 'var(--text-dark-secondary)' }}>CREATIVE VIDEO PRODUCTION &amp; DIGITAL MARKETING</span>
        </div>

        {/* Section Headline */}
        <h2 className="heading-lg scroll-reveal stagger-2" style={{ fontSize: 'clamp(1.75rem, 3.8vw, 3.25rem)', color: 'var(--text-dark-primary)', lineHeight: 1.1 }}>
          {siteData.about.headline}
        </h2>

        {/* Main Content Grid: Creative Vertical Image Card + Philosophy */}
        <div className="grid-2col items-center" style={{ gap: 'var(--space-xl)', marginTop: 'var(--space-xs)' }}>
          {/* Left Column: Creative Straight Vertical Long Studio Photography Card */}
          <div
            className="film-crop-marks scroll-reveal stagger-2"
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(480px, 58vh, 620px)',
              borderRadius: '24px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.18)',
              background: '#0a0b0e',
            }}
          >
            {/* Background Image with Hover Zoom */}
            <img
              src="/images/studio-suite.jpg"
              alt="ATZYNC Media Editing Studio Suite"
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />

            {/* Gradient Overlay Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            {/* Top Viewfinder HUD Header */}
            <div
              className="flex-row items-center justify-between"
              style={{
                position: 'absolute',
                top: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                zIndex: 3,
              }}
            >
              <span
                className="badge-tag"
                style={{
                  fontSize: '0.68rem',
                  padding: '0.35rem 0.85rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                [ EDITING SUITE // MASTERING ]
              </span>

              <div
                className="flex-row items-center"
                style={{
                  gap: '0.4rem',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <span className="status-dot" style={{ backgroundColor: '#ff3b30' }}></span>
                <span className="timecode-tag" style={{ fontSize: '0.65rem', color: '#ffffff' }}>
                  REC 4K ULTRA HD
                </span>
              </div>
            </div>

            {/* Subtle Viewfinder HUD Crosshair Overlay in Center */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                borderRight: '1px solid rgba(255, 255, 255, 0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                pointerEvents: 'none',
                opacity: 0.45,
                zIndex: 3,
              }}
            />

            {/* Bottom Overlay Badge */}
            <div
              className="flex-col"
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                zIndex: 3,
                gap: '0.4rem',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(10, 11, 15, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '14px',
                  padding: '0.85rem 1.15rem',
                  color: '#ffffff',
                }}
              >
                <span className="meta-tag" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginBottom: '0.2rem' }}>
                  STUDIO ARCHITECTURE &amp; PRODUCTION
                </span>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>
                  {siteData.about.founderText}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Statement & Founder Credit */}
          <div className="flex-col" style={{ gap: 'var(--space-md)' }}>
            <p className="body-lead scroll-reveal stagger-3" style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)', color: 'var(--text-dark-primary)' }}>
              {siteData.about.description}
            </p>

            {/* Founder Highlight Box */}
            <div
              className="scroll-reveal stagger-4"
              style={{
                backgroundColor: 'rgba(0,0,0,0.04)',
                border: '1px solid var(--border-light-subtle)',
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
                  backgroundColor: '#ffffff',
                  color: '#000000',
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
            <div className="grid-3col border-top" style={{ paddingTop: 'var(--space-md)', gap: '1rem', borderTopColor: 'var(--border-light-subtle)' }}>
              {stats.map((stat, i) => (
                <div key={i} className={`flex-col scroll-reveal stagger-${i + 3}`} style={{ gap: '0.25rem' }}>
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
