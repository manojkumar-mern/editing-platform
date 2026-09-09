'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

export default function WhatWeDoSection() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const layersRef = useRef([]);
  const mediaRef = useRef(null);

  const capabilities = [
    {
      number: '01',
      title: 'EDITORIAL VISION',
      subtitle: 'Creative Direction & Pacing',
      timecode: '00:01:24:12',
      format: '24FPS // CINEMATIC CUT',
      description: 'Pacing choreography, narrative structure, and thematic sequence design engineered to capture viewer attention.',
    },
    {
      number: '02',
      title: 'POST-PRODUCTION',
      subtitle: 'Visual & Audio Architecture',
      timecode: '00:02:48:06',
      format: '4K DCI // COLOR GRADED',
      description: 'Advanced color grading, bespoke sound architecture, dynamic rhythm transitions, and cutting precision.',
    },
    {
      number: '03',
      title: 'CONTENT SCALING',
      subtitle: 'Multi-Platform Optimization',
      timecode: '00:04:12:00',
      format: 'ASPECT 16:9 // 9:16 REEL',
      description: 'Optimized format adaptation tailored for cinema displays, broadcast commercials, and viral social engagement.',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current || !viewportRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Responsive GSAP Master ScrollTrigger Timeline for BOTH Desktop & Mobile
    const ctx = gsap.context(() => {
      const layers = layersRef.current;
      const isMobile = window.innerWidth < 768;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: 'top top',
          end: isMobile ? '+=120%' : '+=200%',
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(capabilities.length - 1, Math.floor(self.progress * capabilities.length * 0.99));
            setActiveSceneIndex(idx);
          },
        },
      });

      // Initial state
      gsap.set(layers[0], { opacity: 1, y: 0 });
      gsap.set([layers[1], layers[2]], { opacity: 0, y: 20 });

      // In-place crossfades
      masterTl
        .to(layers[0], { opacity: 0, y: -20, ease: 'power2.inOut', duration: 1 })
        .to(layers[1], { opacity: 1, y: 0, ease: 'power2.inOut', duration: 1 }, '-=0.5')
        .fromTo(mediaRef.current, { scale: 0.96 }, { scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.8');

      masterTl
        .to(layers[1], { opacity: 0, y: -20, ease: 'power2.inOut', duration: 1 })
        .to(layers[2], { opacity: 1, y: 0, ease: 'power2.inOut', duration: 1 }, '-=0.5')
        .fromTo(mediaRef.current, { scale: 0.96 }, { scale: 1, duration: 0.8, ease: 'power2.out' }, '-=0.8');

    }, sectionRef);

    return () => ctx.revert();
  }, [capabilities.length]);

  return (
    <section ref={sectionRef} className="border-bottom" id="what-we-do" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div ref={viewportRef} className="pinned-scene-viewport site-container">
        {/* Top Header Ribbon */}
        <div className="flex-row items-center justify-between" style={{ zIndex: 10 }}>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading">[ CAPABILITIES ]</span>
            <span className="timecode-tag">TIMELINE // EDITORIAL</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="meta-tag">SCENE 0{activeSceneIndex + 1} / 03</span>
            <span className="status-dot"></span>
          </div>
        </div>

        {/* Section Headline */}
        <h2 className="heading-lg" style={{ maxWidth: '1100px', zIndex: 10, marginTop: 'var(--space-2xs)' }}>
          Crafting visual narratives with mathematical editing precision.
        </h2>

        {/* Main Stage: In-Place Layer Grid */}
        <div className="scene-stage-container grid-2col" style={{ gap: 'var(--space-md)', marginTop: 'var(--space-2xs)' }}>
          {/* Left Column: Stacked In-Place Layers */}
          <div style={{ position: 'relative', width: '100%', minHeight: '260px' }}>
            {capabilities.map((cap, index) => (
              <div
                key={cap.number}
                ref={(el) => (layersRef.current[index] = el)}
                className="scene-layer-in-place flex-col"
                style={{ gap: '0.5rem' }}
              >
                <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
                  <span className="badge-tag">{cap.number} // {cap.title}</span>
                  <span className="timecode-tag">{cap.timecode}</span>
                </div>

                <h3 className="display-title" style={{ fontSize: 'clamp(1.75rem, 4.5vw, 4rem)' }}>
                  {cap.title}
                </h3>

                <span className="subheading" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  {cap.subtitle}
                </span>

                <p className="body-lead" style={{ fontSize: 'clamp(0.9375rem, 1.2vw, 1.125rem)', marginTop: '0.25rem', maxWidth: '550px' }}>
                  {cap.description}
                </p>

                <div className="flex-row items-center" style={{ gap: '1rem', marginTop: '0.5rem' }}>
                  <span className="meta-tag" style={{ color: 'var(--text-primary)' }}>FORMAT: {cap.format}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Dynamic Pinned Media Monitor Stage */}
          <div
            ref={mediaRef}
            className="video-container film-crop-marks"
            style={{
              width: '100%',
              minHeight: '220px',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-secondary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'var(--space-md)',
              overflow: 'hidden',
            }}
            data-cursor="MONITOR"
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.92) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />

            <div className="flex-row items-center justify-between" style={{ position: 'relative', zIndex: 2 }}>
              <span className="badge-tag">MONITOR 0{activeSceneIndex + 1}</span>
              <span className="timecode-tag">{capabilities[activeSceneIndex].timecode}</span>
            </div>

            <div
              className="flex-col items-center"
              style={{ position: 'relative', zIndex: 2, textAlign: 'center', margin: 'auto 0' }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              <h4 className="heading-md" style={{ marginTop: '0.75rem', textTransform: 'uppercase', fontSize: '1.125rem' }}>
                {capabilities[activeSceneIndex].title}
              </h4>
              <p className="subheading" style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.75 }}>
                {capabilities[activeSceneIndex].subtitle}
              </p>
            </div>

            <div className="flex-row items-center justify-between" style={{ position: 'relative', zIndex: 2 }}>
              <span className="meta-tag">STATE: ACTIVE SCENE</span>
              <span className="meta-tag">{capabilities[activeSceneIndex].format}</span>
            </div>
          </div>
        </div>

        {/* Bottom Scene Progress Navigation */}
        <div className="scene-progress-nav" style={{ zIndex: 10 }}>
          {capabilities.map((cap, idx) => (
            <span
              key={cap.number}
              className={`scene-progress-item ${activeSceneIndex === idx ? 'active' : ''}`}
            >
              0{idx + 1}
            </span>
          ))}

          <div className="scene-progress-bar-fill">
            <div
              className="scene-progress-bar-inner"
              style={{ width: `${((activeSceneIndex + 1) / capabilities.length) * 100}%` }}
            />
          </div>

          <span className="meta-tag">0{activeSceneIndex + 1} / 03</span>
        </div>
      </div>
    </section>
  );
}
