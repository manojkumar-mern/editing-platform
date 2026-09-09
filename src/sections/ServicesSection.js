'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function ServicesSection() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const layersRef = useRef([]);
  const mediaRef = useRef(null);

  const formatSpecs = [
    { aspect: '2.39:1 SCOPE', label: 'CINEMATIC BRANDING FILM', fps: '24FPS // ARRI ALEXA LOOK' },
    { aspect: '16:9 COMMERCIAL', label: 'COMMERCIAL SPEED CUT', fps: '60FPS // HIGH RETENTION' },
    { aspect: '9:16 VERTICAL REEL', label: 'SOCIAL MEDIA EDITORIAL', fps: '30FPS // MOBILE FORMAT' },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !viewportRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Master ScrollTrigger Timeline for both Mobile and Desktop
    const ctx = gsap.context(() => {
      const layers = layersRef.current;
      const mobileScreen = window.innerWidth < 768;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: 'top top',
          end: mobileScreen ? '+=120%' : '+=200%',
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(siteData.services.length - 1, Math.floor(self.progress * siteData.services.length * 0.99));
            setActiveServiceIndex(idx);
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
  }, []);

  return (
    <section ref={sectionRef} className="border-bottom" id="services" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Unified Pinned Viewport Scene for both Desktop & Mobile */}
      <div ref={viewportRef} className="pinned-scene-viewport site-container">
        {/* Top Header Ribbon */}
        <div className="flex-row items-center justify-between" style={{ zIndex: 10 }}>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading">[ OUR CORE SERVICES ]</span>
            <span className="timecode-tag">SCENE 03 // EDITORIAL SPECS</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="meta-tag">SERVICE 0{activeServiceIndex + 1} / 03</span>
            <span className="status-dot"></span>
          </div>
        </div>

        {/* Section Heading */}
        <h2 className="heading-lg" style={{ zIndex: 10, marginTop: 'var(--space-2xs)', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
          SPECIALIZED EDITORIAL SERVICES
        </h2>

        {/* Main Stage Grid with In-Place Overlays */}
        <div className="scene-stage-container grid-2col" style={{ gap: 'var(--space-md)', marginTop: 'var(--space-2xs)' }}>
          {/* Left Column: Stacked In-Place Service Layers */}
          <div style={{ position: 'relative', width: '100%', minHeight: '260px' }}>
            {siteData.services.map((service, index) => (
              <div
                key={service.id}
                ref={(el) => (layersRef.current[index] = el)}
                className="scene-layer-in-place flex-col"
                style={{ gap: '0.5rem' }}
              >
                <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
                  <span className="badge-tag">0{index + 1} // {service.title.toUpperCase()}</span>
                  <span className="timecode-tag">{formatSpecs[index].aspect}</span>
                </div>

                <h3 className="display-title" style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.75rem)' }}>
                  {service.title}
                </h3>

                <p className="body-lead" style={{ fontSize: 'clamp(0.9375rem, 1.2vw, 1.125rem)', color: 'var(--text-primary)' }}>
                  {service.tagline}
                </p>

                <p className="body-regular" style={{ fontSize: 'clamp(0.875rem, 1vw, 1rem)', marginTop: '0.25rem', maxWidth: '550px' }}>
                  {service.description}
                </p>

                <div className="flex-row items-center" style={{ gap: '1rem', marginTop: '0.5rem' }}>
                  <span className="meta-tag" style={{ color: 'var(--text-primary)' }}>SPECS: {formatSpecs[index].fps}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Dynamic Media Showcase Stage */}
          <div
            ref={mediaRef}
            className="video-container film-crop-marks"
            style={{
              width: '100%',
              minHeight: '220px',
              border: '1px solid var(--border-strong)',
              backgroundColor: 'var(--bg-primary)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 'var(--space-md)',
              overflow: 'hidden',
            }}
            data-cursor="SHOWCASE"
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
              <span className="badge-tag">{formatSpecs[activeServiceIndex].aspect}</span>
              <span className="timecode-tag">ATZYNC EDITORIAL</span>
            </div>

            <div
              className="flex-col items-center"
              style={{ position: 'relative', zIndex: 2, textAlign: 'center', margin: 'auto 0' }}
            >
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <path d="M10 8l6 4-6 4V8z" fill="currentColor" />
              </svg>
              <h4 className="heading-md" style={{ marginTop: '0.75rem', textTransform: 'uppercase', fontSize: '1.125rem' }}>
                {siteData.services[activeServiceIndex].title}
              </h4>
              <p className="subheading" style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.8 }}>
                {formatSpecs[activeServiceIndex].label}
              </p>
            </div>

            <div className="flex-row items-center justify-between" style={{ position: 'relative', zIndex: 2 }}>
              <span className="meta-tag">PULSE: ACTIVE</span>
              <span className="meta-tag">{formatSpecs[activeServiceIndex].fps}</span>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="scene-progress-nav" style={{ zIndex: 10 }}>
          {siteData.services.map((service, idx) => (
            <span
              key={service.id}
              className={`scene-progress-item ${activeServiceIndex === idx ? 'active' : ''}`}
            >
              0{idx + 1}
            </span>
          ))}

          <div className="scene-progress-bar-fill">
            <div
              className="scene-progress-bar-inner"
              style={{ width: `${((activeServiceIndex + 1) / siteData.services.length) * 100}%` }}
            />
          </div>

          <span className="meta-tag">0{activeServiceIndex + 1} / 03</span>
        </div>
      </div>
    </section>
  );
}
