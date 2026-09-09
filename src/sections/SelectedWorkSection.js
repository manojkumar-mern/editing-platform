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
    const mobileScreen = window.innerWidth < 768;

    if (prefersReducedMotion || mobileScreen) return;

    // Desktop In-Viewport Project Stacking Timeline
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: 'top top',
          end: `+=150%`,
          scrub: 0.8,
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
              opacity: 0.45,
              yPercent: -6,
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
  }, [isMobile]);

  const timecodes = ['00:01:45:12', '00:03:12:08', '00:05:08:00'];

  return (
    <section ref={sectionRef} className="border-bottom" id="work" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {isMobile ? (
        /* Mobile Viewport: Unpinned Vertical Flow */
        <div className="site-container flex-col" style={{ gap: 'var(--space-xl)', paddingTop: 'var(--space-xl)', paddingBottom: 'var(--space-xl)' }}>
          <div className="flex-row items-center justify-between">
            <span className="subheading">[ SELECTED WORK ]</span>
            <span className="meta-tag">04 / CINEMATIC REEL</span>
          </div>

          <h2 className="display-title">FEATURED PROJECTS</h2>

          <div className="flex-col" style={{ gap: 'var(--space-xl)' }}>
            {projects.map((project, index) => (
              <div key={project.id} className="flex-col" style={{ gap: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="flex-row items-center justify-between">
                  <span className="badge-tag">PROJECT 0{index + 1} // {project.category}</span>
                  <span className="timecode-tag">{timecodes[index]}</span>
                </div>

                <div className="video-container" style={{ aspectRatio: '16/9' }}>
                  <video autoPlay muted loop playsInline poster={project.poster} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <h3 className="heading-lg">{project.title}</h3>
                <span className="subheading" style={{ fontSize: '0.8125rem' }}>CLIENT: {project.client}</span>
                <p className="body-regular">{project.description}</p>

                <div>
                  <a href={`#project-${project.slug}`} className="btn-secondary">
                    VIEW CASE STUDY →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop Viewport: True Pinned In-Viewport Stacking */
        <div ref={viewportRef} className="pinned-scene-viewport site-container">
          {/* Top Ribbon */}
          <div className="flex-row items-center justify-between" style={{ zIndex: 10 }}>
            <div className="flex-row items-center" style={{ gap: '1.25rem' }}>
              <span className="subheading">[ SELECTED WORK ]</span>
              <span className="timecode-tag">PORTFOLIO REEL // 3 CINEMATIC SCENES</span>
            </div>
            <div className="flex-row items-center" style={{ gap: '1.5rem' }}>
              <span className="meta-tag">PROJECT 0{activeProjectIndex + 1} / 03</span>
              <span className="status-dot"></span>
            </div>
          </div>

          {/* Section Heading */}
          <h2 className="display-title" style={{ zIndex: 10, marginTop: 'var(--space-2xs)' }}>
            FEATURED PROJECTS
          </h2>

          {/* Stack Stage Container (Fitting 100% inside viewport height) */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '62vh',
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
                  padding: 'var(--space-md) var(--space-lg)',
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
                <div className="flex-row items-center justify-between">
                  <div className="flex-row items-center" style={{ gap: '0.85rem' }}>
                    <span className="status-dot"></span>
                    <span className="meta-tag">PROJECT 0{index + 1} // {project.category.toUpperCase()}</span>
                  </div>
                  <div className="flex-row items-center" style={{ gap: '1rem' }}>
                    <span className="timecode-tag">{timecodes[index]}</span>
                    <span className="badge-tag">{project.year}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="grid-2col items-center" style={{ gap: 'var(--space-lg)', flex: 1, margin: 'var(--space-xs) 0' }}>
                  {/* Media Frame (Left Dominant Feature) */}
                  <div className="video-container" style={{ height: '100%', maxHeight: '360px', border: '1px solid var(--border-subtle)' }}>
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
                    <div className="flex-col items-center justify-between" style={{ position: 'absolute', zIndex: 3, inset: 0, padding: '1rem', pointerEvents: 'none' }}>
                      <span className="meta-tag">[ ATZYNC EDITORIAL CUT ]</span>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                      </svg>
                      <span className="meta-tag">2.39:1 CINEMATIC SCOPE</span>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-col" style={{ gap: 'var(--space-xs)' }}>
                    <span className="subheading" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      CLIENT: {project.client}
                    </span>
                    <h3 className="display-title" style={{ fontSize: 'clamp(1.85rem, 3.8vw, 3.8rem)' }}>
                      {project.title}
                    </h3>
                    <p className="body-regular" style={{ fontSize: '1rem' }}>
                      {project.description}
                    </p>
                    <div style={{ marginTop: '0.5rem' }}>
                      <a href={`#project-${project.slug}`} className="btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.75rem' }}>
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
                0{idx + 1} {proj.title}
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
      )}
    </section>
  );
}
