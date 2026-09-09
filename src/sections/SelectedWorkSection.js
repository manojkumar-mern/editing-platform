'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { projects } from '@/data/projects';

export default function SelectedWorkSection() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const cardsRef = useRef([]);

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

    // Master In-Viewport Project Stacking Timeline for Desktop & Mobile
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      const mobileScreen = window.innerWidth < 768;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: 'top top',
          end: mobileScreen ? '+=120%' : '+=150%',
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(projects.length - 1, Math.floor(self.progress * projects.length * 0.99));
            setActiveProjectIndex(idx);
          },
        },
      });

      cards.forEach((card, index) => {
        if (index === 0) return;

        const prevCard = cards[index - 1];

        masterTl
          .to(
            prevCard,
            {
              scale: 0.92,
              opacity: 0.4,
              yPercent: -5,
              ease: 'power2.inOut',
            },
            index - 1
          )
          .fromTo(
            card,
            {
              yPercent: 100,
              opacity: 0.8,
              scale: 0.96,
            },
            {
              yPercent: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.inOut',
            },
            index - 1
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const timecodes = ['00:01:45:12', '00:03:12:08', '00:05:08:00'];

  return (
    <section ref={sectionRef} className="border-bottom" id="work" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Unified Pinned Viewport Deck Stacking Scene for Desktop & Mobile */}
      <div ref={viewportRef} className="pinned-scene-viewport site-container">
        {/* Top Ribbon */}
        <div className="flex-row items-center justify-between" style={{ zIndex: 10 }}>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading">[ SELECTED WORK ]</span>
            <span className="timecode-tag">PORTFOLIO REEL // 3 SCENES</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="meta-tag">PROJECT 0{activeProjectIndex + 1} / 03</span>
            <span className="status-dot"></span>
          </div>
        </div>

        {/* Section Heading */}
        <h2 className="heading-lg" style={{ zIndex: 10, marginTop: 'var(--space-2xs)', fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
          FEATURED PROJECTS
        </h2>

        {/* Stack Stage Container (Fitting 100% inside viewport height) */}
        <div
          className="selected-work-stage"
          style={{
            position: 'relative',
            width: '100%',
            height: '58vh',
            maxHeight: '520px',
            marginTop: 'var(--space-2xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => (cardsRef.current[index] = el)}
              style={{
                position: index === 0 ? 'relative' : 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-strong)',
                padding: 'var(--space-md)',
                boxShadow: '0 -15px 45px rgba(0,0,0,0.85)',
                zIndex: index + 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                willChange: 'transform, opacity',
              }}
              data-cursor="WATCH PROJECT"
            >
              {/* Card Top Bar */}
              <div className="flex-row items-center justify-between" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                <div className="flex-row items-center" style={{ gap: '0.65rem' }}>
                  <span className="status-dot"></span>
                  <span className="meta-tag">PROJECT 0{index + 1} // {project.category.toUpperCase()}</span>
                </div>
                <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
                  <span className="timecode-tag">{timecodes[index]}</span>
                  <span className="badge-tag">{project.year}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="selected-work-card-body grid-2col items-center" style={{ gap: 'var(--space-md)', flex: 1, margin: 'var(--space-2xs) 0' }}>
                {/* Media Frame (Dominant Feature) */}
                <div className="video-container film-crop-marks" style={{ height: '100%', minHeight: '160px', maxHeight: '340px', border: '1px solid var(--border-subtle)' }}>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.92) 100%)',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                  />
                  <video autoPlay muted loop playsInline poster={project.poster} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="flex-col items-center justify-between" style={{ position: 'absolute', zIndex: 3, inset: 0, padding: '0.75rem', pointerEvents: 'none' }}>
                    <span className="meta-tag">[ ATZYNC EDITORIAL CUT ]</span>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                    </svg>
                    <span className="meta-tag">2.39:1 CINEMATIC SCOPE</span>
                  </div>
                </div>

                {/* Text Details */}
                <div className="flex-col" style={{ gap: '0.35rem' }}>
                  <span className="subheading" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    CLIENT: {project.client}
                  </span>
                  <h3 className="display-title" style={{ fontSize: 'clamp(1.5rem, 3.2vw, 3.2rem)' }}>
                    {project.title}
                  </h3>
                  <p className="body-regular" style={{ fontSize: 'clamp(0.8125rem, 1vw, 0.95rem)' }}>
                    {project.description}
                  </p>
                  <div style={{ marginTop: '0.5rem' }}>
                    <a href={`#project-${project.slug}`} className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.75rem' }}>
                      VIEW CASE STUDY →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Progress Bar */}
        <div className="scene-progress-nav" style={{ zIndex: 10 }}>
          {projects.map((proj, idx) => (
            <span
              key={proj.id}
              className={`scene-progress-item ${activeProjectIndex === idx ? 'active' : ''}`}
            >
              0{idx + 1}
            </span>
          ))}

          <div className="scene-progress-bar-fill">
            <div
              className="scene-progress-bar-inner"
              style={{ width: `${((activeProjectIndex + 1) / projects.length) * 100}%` }}
            />
          </div>

          <span className="meta-tag">0{activeProjectIndex + 1} / 03</span>
        </div>
      </div>
    </section>
  );
}
