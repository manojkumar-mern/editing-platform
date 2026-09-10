'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

export default function WhatWeDoSection() {
  const sectionRef = useRef(null);
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
      poster: '/images/hero-poster.jpg',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-cinematic-shot-of-a-man-in-the-rain-43098-large.mp4',
      specs: ['Pacing Choreography', 'Rhythm Sequencing', 'Audience Retention'],
    },
    {
      number: '02',
      title: 'POST-PRODUCTION',
      subtitle: 'Visual & Audio Architecture',
      timecode: '00:02:48:06',
      format: '4K DCI // ARRI COLOR',
      description: 'Advanced color grading, bespoke sound architecture, dynamic rhythm transitions, and cutting precision.',
      poster: '/images/color-after.jpg',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-fast-on-a-tunnel-at-night-41555-large.mp4',
      specs: ['Color Grading (ARRI/LOG)', 'Spatial Audio Design', 'VFX & Motion Cleanup'],
    },
    {
      number: '03',
      title: 'CONTENT SCALING',
      subtitle: 'Multi-Platform Optimization',
      timecode: '00:04:12:00',
      format: '16:9 CINEMA // 9:16 REEL',
      description: 'Optimized format adaptation tailored for cinema displays, broadcast commercials, and high-retention viral social reels.',
      poster: '/images/studio-suite.jpg',
      video: 'https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-at-a-club-41544-large.mp4',
      specs: ['9:16 & 16:9 Mastering', 'Sound Loudness Norms', 'Multi-Export Suites'],
    },
  ];

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth + 100;

      gsap.to(track, {
        x: () => -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          invalidateOnRefresh: true,
        },
      });
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
          padding: 'var(--space-md) 0',
        }}
      >
        {/* Header Ribbon */}
        <div className="site-container flex-row items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading" style={{ color: 'var(--text-dark-primary)' }}>[ WHAT WE DO ]</span>
            <span className="timecode-tag" style={{ color: 'var(--text-dark-muted)' }}>03 CAPABILITIES</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '0.5rem' }}>
            <span className="meta-tag" style={{ color: 'var(--text-dark-secondary)' }}>SCROLL HORIZONTALLY →</span>
          </div>
        </div>

        {/* Section Headline */}
        <div className="site-container">
          <h2 className="heading-lg" style={{ maxWidth: '1000px', fontSize: 'clamp(1.75rem, 4vw, 3.25rem)', color: 'var(--text-dark-primary)' }}>
            Crafting visual narratives with mathematical editing precision.
          </h2>
        </div>

        {/* Horizontal Track Slider with Light Cards */}
        <div
          ref={trackRef}
          className="flex-row items-stretch"
          style={{
            gap: '2rem',
            paddingLeft: 'var(--space-md)',
            paddingRight: 'var(--space-lg)',
            marginTop: 'var(--space-md)',
            willChange: 'transform',
          }}
        >
          {capabilities.map((cap) => (
            <div
              key={cap.number}
              className="capability-card film-crop-marks flex-col justify-between"
              style={{
                minWidth: 'clamp(300px, 42vw, 620px)',
                backgroundColor: 'var(--bg-light-card)',
                border: '1px solid var(--border-light-subtle)',
                borderRadius: '20px',
                padding: 'var(--space-md)',
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
                transition: 'border-color 0.3s ease, transform 0.3s ease',
              }}
              data-cursor="CAPABILITY"
            >
              {/* Card Top Metadata */}
              <div className="flex-row items-center justify-between">
                <span className="badge-tag" style={{ backgroundColor: 'rgba(0,0,0,0.04)', color: 'var(--text-dark-primary)', border: '1px solid rgba(0,0,0,0.1)' }}>
                  {cap.number} // {cap.title}
                </span>
                <span className="timecode-tag" style={{ color: 'var(--text-dark-muted)' }}>{cap.timecode}</span>
              </div>

              {/* Live Looping Video Frame */}
              <div
                className="video-container film-crop-marks"
                style={{
                  width: '100%',
                  height: '240px',
                  margin: '1.25rem 0',
                  borderRadius: '14px',
                  border: '1px solid rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  src={cap.video}
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
                    bottom: '0.75rem',
                    left: '0.75rem',
                    right: '0.75rem',
                    zIndex: 2,
                  }}
                >
                  <span className="meta-tag" style={{ color: '#fff' }}>{cap.format}</span>
                  <span className="status-dot"></span>
                </div>
              </div>

              {/* Text & Specs */}
              <div className="flex-col" style={{ gap: '0.5rem' }}>
                <h3 className="display-title" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', color: 'var(--text-dark-primary)' }}>
                  {cap.title}
                </h3>
                <span className="subheading" style={{ fontSize: '0.8125rem', color: 'var(--text-dark-secondary)' }}>
                  {cap.subtitle}
                </span>
                <p className="body-regular" style={{ fontSize: '0.9375rem', color: 'var(--text-dark-secondary)', marginTop: '0.25rem' }}>
                  {cap.description}
                </p>

                {/* Specs Pills */}
                <div className="flex-row items-center" style={{ gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                  {cap.specs.map((spec, i) => (
                    <span key={i} className="meta-tag" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-dark-primary)', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
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
