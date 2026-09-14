'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import LazyVideo from '@/components/LazyVideo';
import { useSectionInView } from '@/lib/useSectionInView';

export default function WhatWeDoSection() {
  const [sectionRef, isInView] = useSectionInView({ rootMargin: '350px' });
  const triggerRef = useRef(null);
  const trackRef = useRef(null);

  const capabilities = [
    {
      number: '01',
      title: 'EDITORIAL VISION',
      subtitle: 'Creative Direction & Narrative Pacing',
      timecode: '00:01:24:12',
      format: '24FPS // CINEMATIC CUT',
      description: 'Pacing choreography, narrative structure, and sequence design engineered to capture viewer attention within seconds.',
      poster: '/images/hero-poster.webp',
      video: '/videos/showreel.mp4',
      specs: ['Pacing Choreography', 'Rhythm Sequencing', 'Audience Retention'],
    },
    {
      number: '02',
      title: 'POST-PRODUCTION',
      subtitle: 'Visual & Audio Architecture',
      timecode: '00:02:48:06',
      format: '4K DCI // ARRI COLOR',
      description: 'Advanced color grading, bespoke sound architecture, dynamic rhythm transitions, and cutting precision.',
      poster: '/images/color-after.webp',
      video: '/videos/project-01.mp4',
      specs: ['Color Grading (ARRI/LOG)', 'Spatial Audio Design', 'VFX & Motion Cleanup'],
    },
    {
      number: '03',
      title: 'CONTENT SCALING',
      subtitle: 'Multi-Platform Optimization',
      timecode: '00:04:12:00',
      format: '16:9 CINEMA // 9:16 REEL',
      description: 'Optimized format adaptation tailored for cinema displays, broadcast commercials, and high-retention viral social reels.',
      poster: '/images/studio-suite.webp',
      video: '/videos/project-02.mp4',
      specs: ['9:16 & 16:9 Mastering', 'Sound Loudness Norms', 'Multi-Export Suites'],
    },
  ];

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 140);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount()) + 450}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Scroll horizontal cards
      tl.to(track, {
        x: getScrollAmount,
        duration: 1.0,
        ease: 'none',
      });

      // 2. End hold buffer so Card 3 stays stationary on screen before unpinning cleanly
      tl.to({}, { duration: 0.35 });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-bottom"
      id="what-we-do"
      style={{ backgroundColor: 'var(--bg-light)', color: 'var(--text-dark-primary)', overflow: 'hidden' }}
    >
      <div
        ref={triggerRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: 'clamp(4.5rem, 8vh, 6rem)',
          paddingBottom: 'clamp(1.5rem, 3vh, 2.5rem)',
        }}
      >
        {/* Section Header */}
        <div className="site-container flex-row items-end justify-between scroll-reveal stagger-1" style={{ marginBottom: 'clamp(0.35rem, 1vh, 0.75rem)', flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <div className="flex-col" style={{ gap: '0.35rem' }}>
            <span className="subheading" style={{ color: 'var(--text-dark-muted)', letterSpacing: '0.14em', fontWeight: 700 }}>
              WHAT WE DO
            </span>
          </div>
          <span className="meta-tag" style={{ color: 'var(--text-dark-muted)' }}>SCROLL HORIZONTALLY →</span>
        </div>

        {/* Section Headline */}
        <div className="site-container scroll-reveal stagger-2">
          <h2 className="heading-lg" style={{ maxWidth: '1000px', fontSize: 'clamp(1.25rem, 2.8vw, 2.5rem)', color: 'var(--text-dark-primary)', lineHeight: 1.15 }}>
            Crafting visual narratives with mathematical editing precision.
          </h2>
        </div>

        {/* Horizontal Track Slider with Cards */}
        <div
          ref={trackRef}
          className="flex-row items-stretch"
          style={{
            gap: '1.5rem',
            paddingLeft: 'var(--space-md)',
            paddingRight: 'var(--space-lg)',
            marginTop: 'clamp(0.75rem, 2vh, 1.5rem)',
            willChange: 'transform',
          }}
        >
          {capabilities.map((cap) => (
            <div
              key={cap.number}
              className="capability-card film-crop-marks silver-sheen flex-col justify-between"
              style={{
                minWidth: 'clamp(280px, 40vw, 560px)',
                maxHeight: 'calc(100vh - 220px)',
                backgroundColor: 'var(--bg-light-card)',
                border: '1px solid var(--border-light-subtle)',
                borderRadius: '20px',
                padding: 'clamp(1rem, 1.8vw, 1.5rem)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'border-color 0.3s ease, boxShadow 0.3s ease',
              }}
              data-cursor="CAPABILITY"
            >


              {/* Live Looping Video Frame */}
              <div
                className="video-container film-crop-marks"
                style={{
                  width: '100%',
                  height: 'clamp(140px, 18vh, 210px)',
                  margin: 'clamp(0.5rem, 1.2vh, 0.85rem) 0',
                  borderRadius: '14px',
                  border: '1px solid var(--border-light-subtle)',
                  overflow: 'hidden',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <LazyVideo
                  src={isInView ? cap.video : undefined}
                  poster={cap.poster}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                  }}
                />
                <div
                  className="flex-row items-center justify-between"
                  style={{
                    position: 'absolute',
                    bottom: '0.6rem',
                    left: '0.6rem',
                    right: '0.6rem',
                    zIndex: 2,
                  }}
                >
                  <span className="meta-tag" style={{ color: '#fff', fontSize: '0.6875rem' }}>{cap.format}</span>
                </div>
              </div>

              {/* Text & Specs */}
              <div className="flex-col" style={{ gap: '0.35rem' }}>
                <h3 className="display-title" style={{ fontSize: 'clamp(1.2rem, 2vw, 2rem)', color: 'var(--text-dark-primary)', lineHeight: 1.1 }}>
                  {cap.title}
                </h3>
                <span className="subheading" style={{ fontSize: '0.75rem', color: 'var(--text-dark-secondary)' }}>
                  {cap.subtitle}
                </span>
                <p className="body-regular" style={{ fontSize: 'clamp(0.8125rem, 0.95vw, 0.9375rem)', color: 'var(--text-dark-secondary)', marginTop: '0.15rem', lineHeight: 1.45 }}>
                  {cap.description}
                </p>

                {/* Specs Pills */}
                <div className="flex-row items-center" style={{ gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                  {cap.specs.map((spec, i) => (
                    <span key={i} className="meta-tag" style={{ backgroundColor: 'rgba(0,0,0,0.06)', color: 'var(--text-dark-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem' }}>
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
