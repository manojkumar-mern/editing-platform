'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { projects } from '@/data/projects';
import { soundManager } from '@/lib/audioManager';

export default function SelectedWorkSection({ onOpenModal }) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const cardsRef = useRef([]);

  const videoSources = [
    '/videos/project-01.mp4',
    '/videos/project-02.mp4',
    '/videos/project-03.mp4',
  ];

  useEffect(() => {
    if (!sectionRef.current || !viewportRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current;
      const isMobile = window.innerWidth < 768;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: viewportRef.current,
          start: 'top top',
          end: isMobile ? '+=150%' : '+=220%',
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(projects.length - 1, Math.floor(self.progress * projects.length * 0.99));
            setActiveProjectIndex(idx);
          },
        },
      });

      // Card stacking timeline: cards slide up one by one from bottom with scale depth
      cards.forEach((card, index) => {
        if (index === 0) return;

        const prevCard = cards[index - 1];

        masterTl
          .to(
            prevCard,
            {
              scale: 0.93,
              opacity: 0.35,
              yPercent: -4,
              ease: 'power2.inOut',
            },
            index - 1
          )
          .fromTo(
            card,
            {
              yPercent: 110,
              opacity: 0.8,
              scale: 0.97,
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

  return (
    <section ref={sectionRef} className="border-bottom" id="work" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Pinned Viewport Deck Container */}
      <div
        ref={viewportRef}
        className="pinned-scene-viewport site-container flex-col justify-between"
        style={{
          height: '100vh',
          maxHeight: '920px',
          paddingTop: 'clamp(4.5rem, 8vh, 6.5rem)',
          paddingBottom: 'var(--space-md)',
        }}
      >
        {/* Top Section Ribbon */}
        <div className="flex-row items-center justify-between" style={{ zIndex: 10 }}>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading">[ SELECTED WORK ]</span>
            <span className="timecode-tag">CRAZY MOTION CARDS // 03 SHOWCASES</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="meta-tag">PROJECT 0{activeProjectIndex + 1} / 03</span>
            <span className="status-dot"></span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex-row items-center justify-between" style={{ zIndex: 10 }}>
          <h2 className="heading-lg" style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.75rem)' }}>
            FEATURED PROJECTS & EDITORIAL CUTS
          </h2>
          <span className="meta-tag" style={{ color: 'var(--text-secondary)' }}>
            SCROLL TO UNSTACK CARDS ↓
          </span>
        </div>

        {/* Medium Cards Deck Container */}
        <div
          className="cards-deck-stage"
          style={{
            position: 'relative',
            width: '100%',
            height: '58vh',
            maxHeight: '520px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'var(--space-xs) 0',
          }}
        >
          {projects.map((project, index) => {
            const isMediaLeft = index % 2 === 1; // Alternating layout like CrazyPencilz!
            return (
              <div
                key={project.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="crazy-card-item film-crop-marks silver-sheen"
                style={{
                  position: index === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#121215',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '24px',
                  padding: 'clamp(1.25rem, 2.5vw, 2.25rem)',
                  boxShadow: '0 -20px 50px rgba(0,0,0,0.9)',
                  zIndex: index + 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  willChange: 'transform, opacity',
                  overflow: 'hidden',
                }}
                data-cursor="WATCH PROJECT"
              >
                {/* Card Top Header Bar */}
                <div className="flex-row items-center justify-between" style={{ gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div className="flex-row items-center" style={{ gap: '0.65rem' }}>
                    <span className="badge-tag" style={{ borderRadius: '20px', padding: '0.3rem 0.8rem' }}>
                      0{index + 1} // {project.category.toUpperCase()}
                    </span>
                    <span className="status-dot"></span>
                  </div>
                  <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
                    <span className="timecode-tag">24FPS // 4K DCI</span>
                    <span className="badge-tag" style={{ borderRadius: '20px' }}>{project.year}</span>
                  </div>
                </div>

                {/* Card Body: Alternating 2-Column Split Grid */}
                <div
                  className="crazy-card-body grid-2col items-center"
                  style={{
                    gap: 'clamp(1rem, 3vw, 2.5rem)',
                    flex: 1,
                  }}
                >
                  {/* Left Column (Text or Media depending on layout) */}
                  {!isMediaLeft ? (
                    /* Left Text */
                    <div className="flex-col" style={{ gap: '0.6rem' }}>
                      <span className="subheading" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        CLIENT: {project.client}
                      </span>
                      <h3
                        className="display-title"
                        style={{
                          fontSize: 'clamp(1.75rem, 3.5vw, 3.5rem)',
                          lineHeight: 1.05,
                          letterSpacing: '-0.01em',
                          wordBreak: 'keep-all',
                          overflowWrap: 'normal',
                        }}
                      >
                        {project.title}
                      </h3>
                      <p className="body-regular" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)', opacity: 0.88, maxWidth: '500px' }}>
                        {project.description}
                      </p>
                      <div style={{ marginTop: '0.75rem' }}>
                        <button
                          onClick={() => {
                            soundManager.playWhoosh();
                            onOpenModal && onOpenModal({ title: project.title, videoSrc: videoSources[index % videoSources.length], posterSrc: project.poster });
                          }}
                          className="btn-primary"
                          style={{ borderRadius: '30px', padding: '0.75rem 1.75rem', fontSize: '0.75rem' }}
                        >
                          WATCH FULL CUT →
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Left Media (Video Playing inside image card!) */
                    <div
                      className="crazy-media-card"
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        minHeight: '220px',
                        maxHeight: '340px',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        soundManager.playWhoosh();
                        onOpenModal && onOpenModal({ title: project.title, videoSrc: videoSources[index % videoSources.length], posterSrc: project.poster });
                      }}
                    >
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={project.poster}
                        src={videoSources[index % videoSources.length]}
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
                          background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                          pointerEvents: 'none',
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
                          pointerEvents: 'none',
                        }}
                      >
                        <span className="badge-tag" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
                          ▶ PLAYING VIDEO
                        </span>
                        <span className="timecode-tag" style={{ color: '#fff' }}>2.39:1 CINEMATIC</span>
                      </div>
                    </div>
                  )}

                  {/* Right Column (Media or Text depending on layout) */}
                  {!isMediaLeft ? (
                    /* Right Media (Video Playing inside image card!) */
                    <div
                      className="crazy-media-card"
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        minHeight: '220px',
                        maxHeight: '340px',
                        borderRadius: '18px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.12)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        soundManager.playWhoosh();
                        onOpenModal && onOpenModal({ title: project.title, videoSrc: videoSources[index % videoSources.length], posterSrc: project.poster });
                      }}
                    >
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={project.poster}
                        src={videoSources[index % videoSources.length]}
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
                          background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                          pointerEvents: 'none',
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
                          pointerEvents: 'none',
                        }}
                      >
                        <span className="badge-tag" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}>
                          ▶ PLAYING VIDEO
                        </span>
                        <span className="timecode-tag" style={{ color: '#fff' }}>2.39:1 CINEMATIC</span>
                      </div>
                    </div>
                  ) : (
                    /* Right Text */
                    <div className="flex-col" style={{ gap: '0.6rem' }}>
                      <span className="subheading" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        CLIENT: {project.client}
                      </span>
                      <h3
                        className="display-title"
                        style={{
                          fontSize: 'clamp(1.75rem, 3.5vw, 3.5rem)',
                          lineHeight: 1.05,
                          letterSpacing: '-0.01em',
                          wordBreak: 'keep-all',
                          overflowWrap: 'normal',
                        }}
                      >
                        {project.title}
                      </h3>
                      <p className="body-regular" style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1.05rem)', opacity: 0.88, maxWidth: '500px' }}>
                        {project.description}
                      </p>
                      <div style={{ marginTop: '0.75rem' }}>
                        <button
                          onClick={() => {
                            soundManager.playWhoosh();
                            onOpenModal && onOpenModal({ title: project.title, videoSrc: videoSources[index % videoSources.length], posterSrc: project.poster });
                          }}
                          className="btn-primary"
                          style={{ borderRadius: '30px', padding: '0.75rem 1.75rem', fontSize: '0.75rem' }}
                        >
                          WATCH FULL CUT →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
