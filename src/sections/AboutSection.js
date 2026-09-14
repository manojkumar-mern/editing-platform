'use client';

import { useState, useRef } from 'react';
import { siteData } from '@/data/siteData';
import { useSectionInView } from '@/lib/useSectionInView';
import { soundManager } from '@/lib/audioManager';

export default function AboutSection() {
  const [sectionRef, isInView] = useSectionInView({ rootMargin: '350px' });
  const [activeFilter, setActiveFilter] = useState('normal'); // 'normal', 'lut', 'mono'
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRef = useRef(null);

  const stats = [
    { value: '500+', label: 'EDITORIAL CUTS COMPLETED' },
    { value: '40+', label: 'BRANDING FILMS MASTERED' },
    { value: '99.8%', label: 'CLIENT RETENTION RATE' },
  ];

  // Interactive 3D Card Tilt Effect following Cursor Position
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg X-rotation
    const rotateY = ((x - centerX) / centerX) * 9;  // Max 9 deg Y-rotation

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    });
  };

  // Image CSS filter generator based on active mode
  const getImageFilter = () => {
    switch (activeFilter) {
      case 'lut':
        return 'contrast(1.18) saturate(1.4) hue-rotate(-8deg) brightness(1.03)';
      case 'mono':
        return 'grayscale(1) contrast(1.3) brightness(0.95)';
      default:
        return 'none';
    }
  };

  return (
    <section
      ref={sectionRef}
      className="section-wrapper border-bottom"
      id="about"
      style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark-primary)', overflow: 'hidden' }}
    >
      <div className="site-container flex-col" style={{ gap: 'var(--space-xl)' }}>
        {/* Main Content Grid: Vertical Interactive Portrait Card + Right Content Column */}
        <div className="grid-2col items-start" style={{ gap: 'var(--space-xl)' }}>
          {/* Left Column: Interactive 3D Vertical Portrait Studio Card */}
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="scroll-reveal stagger-2"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '460px',
              height: 'clamp(540px, 66vh, 660px)',
              margin: '0 auto',
              borderRadius: '26px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.22)',
              background: '#07080c',
              cursor: 'pointer',
              ...tiltStyle,
            }}
          >
            {/* Background Portrait Image */}
            {isInView ? (
              <img
                src="/images/about-portrait.jpg"
                alt="ATZYNC Media Founder & Creative Director"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  filter: getImageFilter(),
                  transition: 'filter 0.4s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#07080c' }} />
            )}

            {/* Gradient Overlay Vignette */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(7, 8, 12, 0.75) 0%, rgba(0, 0, 0, 0.05) 45%, rgba(7, 8, 12, 0.92) 100%)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />

            {/* Top Viewfinder HUD Header with Live Equalizer */}
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
              <div
                className="flex-row items-center"
                style={{
                  gap: '0.5rem',
                  backgroundColor: 'rgba(7, 8, 12, 0.8)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <span className="status-dot" style={{ backgroundColor: '#ff3b30' }}></span>
                <span className="timecode-tag" style={{ fontSize: '0.68rem', color: '#ffffff', letterSpacing: '0.08em' }}>
                  REC • 4K PRORES
                </span>
              </div>

              {/* Animated Audio Equalizer Bars */}
              <div
                className="flex-row items-end"
                style={{
                  gap: '3px',
                  height: '18px',
                  backgroundColor: 'rgba(7, 8, 12, 0.8)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '16px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="eq-bar"></div>
                <div className="eq-bar"></div>
                <div className="eq-bar"></div>
                <div className="eq-bar"></div>
              </div>
            </div>

            {/* Bottom Interactive LUT Grade Mode Switcher Line (Placed down at the bottom) */}
            <div
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                left: '1.25rem',
                right: '1.25rem',
                zIndex: 3,
              }}
            >
              <div
                className="flex-row items-center justify-between"
                style={{
                  backgroundColor: 'rgba(7, 8, 12, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  borderRadius: '16px',
                  padding: '0.35rem 0.6rem',
                }}
              >
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.65)', paddingLeft: '0.5rem', fontWeight: 600, letterSpacing: '0.08em' }}>
                  LUT GRADE:
                </span>
                <div className="flex-row items-center" style={{ gap: '0.25rem' }}>
                  {[
                    { id: 'normal', label: 'RAW' },
                    { id: 'lut', label: 'CINEMA' },
                    { id: 'mono', label: 'MONO' },
                  ].map((mode) => {
                    const isActive = activeFilter === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          soundManager.playClick();
                          setActiveFilter(mode.id);
                        }}
                        style={{
                          padding: '0.3rem 0.65rem',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          borderRadius: '12px',
                          border: isActive ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                          backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title Header + Statement + Founder Credit */}
          <div className="flex-col" style={{ gap: 'var(--space-md)' }}>
            {/* Section Header on the Right Side */}
            <div className="flex-col scroll-reveal stagger-1" style={{ gap: '0.5rem' }}>
              <h2
                style={{
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  color: 'var(--text-dark-muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                ABOUT US
              </h2>
              <h3
                style={{
                  fontSize: 'clamp(1.5rem, 3.2vw, 2.5rem)',
                  fontFamily: 'var(--font-heading)',
                  color: 'var(--text-dark-primary)',
                  fontWeight: 800,
                  margin: 0,
                  lineHeight: 1.18,
                }}
              >
                {siteData.about.headline}
              </h3>
            </div>

            <p className="body-lead scroll-reveal stagger-3" style={{ fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)', color: 'var(--text-dark-primary)' }}>
              {siteData.about.description}
            </p>

            {/* Founder Highlight Box */}
            <div
              className="scroll-reveal stagger-4"
              style={{
                backgroundColor: 'rgba(0,0,0,0.04)',
                border: '1px solid var(--border-light-subtle)',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-display)',
                  flexShrink: 0,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
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

