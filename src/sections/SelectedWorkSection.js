'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { projects } from '@/data/projects';
import { soundManager } from '@/lib/audioManager';
import LazyVideo from '@/components/LazyVideo';

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

      const numCards = projects.length;
      const HOLD_DURATION = 1.0;
      const TRANSITION_DURATION = 1.0;
      const FINAL_HOLD_DURATION = 2.0;
      const totalDuration = HOLD_DURATION * numCards + TRANSITION_DURATION * (numCards - 1) + FINAL_HOLD_DURATION;

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: sectionRef.current,
          pinSpacing: true,
          start: 'top top',
          end: isMobile ? '+=550%' : '+=850%',
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const currentTime = self.progress * totalDuration;
            let currentIdx = 0;
            for (let i = 1; i < numCards; i++) {
              const startTime = HOLD_DURATION + (i - 1) * (TRANSITION_DURATION + HOLD_DURATION);
              if (currentTime >= startTime) {
                currentIdx = i;
              } else {
                break;
              }
            }
            setActiveProjectIndex(currentIdx);
          },
        },
      });

      // Ensure all cards from index 1 onward start off-screen & transparent
      cards.forEach((card, index) => {
        if (index > 0 && card) {
          gsap.set(card, {
            yPercent: 115,
            opacity: 0,
            scale: 0.97,
          });
        }
      });

      // Build sequential 1-by-1 card stacking timeline with equal hold & transition times for all 6 cards
      for (let i = 1; i < numCards; i++) {
        const card = cards[i];
        const prevCard = cards[i - 1];
        if (!card) continue;

        const startTime = HOLD_DURATION + (i - 1) * (TRANSITION_DURATION + HOLD_DURATION);

        masterTl
          .to(
            prevCard,
            {
              scale: 0.94,
              opacity: 0.35,
              yPercent: -4,
              ease: 'power2.inOut',
              duration: TRANSITION_DURATION,
            },
            startTime
          )
          .to(
            card,
            {
              yPercent: 0,
              opacity: 1,
              scale: 1,
              ease: 'power2.out',
              duration: TRANSITION_DURATION,
            },
            startTime
          );
      }

      // Add a generous final hold so Card 6 stays 100% stationary before unpinning cleanly into CTA section
      masterTl.to({}, { duration: FINAL_HOLD_DURATION });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-bottom"
      id="work"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        position: 'relative',
      }}
    >
      {/* Pinned Viewport Deck Container */}
      <div
        ref={viewportRef}
        className="site-container flex-col justify-between"
        style={{
          minHeight: '100vh',
          paddingTop: 'clamp(5.5rem, 10vh, 7rem)',
          paddingBottom: 'clamp(2rem, 4vh, 3.5rem)',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Section Ribbon */}
        <div className="flex-row items-center justify-between scroll-reveal stagger-1" style={{ zIndex: 10, flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <div className="flex-row items-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="subheading">[ 04 — OUR WORK ]</span>
            <span className="timecode-tag">CRAZY MOTION CARDS // {projects.length} SHOWCASES</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
            <span className="meta-tag">PROJECT 0{activeProjectIndex + 1} / 0{projects.length}</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex-row items-center justify-between scroll-reveal stagger-2" style={{ zIndex: 10, flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <h2 className="heading-lg" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)' }}>
            SELECTED WORK
          </h2>
          <a
            href="#cta"
            className="btn-secondary"
            style={{ padding: '0.45rem 1.1rem', fontSize: '0.75rem', borderRadius: '20px' }}
            onClick={() => soundManager.playClick()}
          >
            VIEW ALL WORK →
          </a>
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
            overflow: 'hidden',
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
                <div className="flex-row items-center justify-between" style={{ gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="flex-row items-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge-tag" style={{ borderRadius: '20px', padding: '0.3rem 0.8rem' }}>
                      0{index + 1} // {project.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-row items-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
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
                    <div className="flex-col" style={{ gap: '0.5rem' }}>
                      <span className="subheading" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        CLIENT: {project.client}
                      </span>
                      <h3
                        className="display-title"
                        style={{
                          fontSize: 'clamp(1.35rem, 3.5vw, 3.5rem)',
                          lineHeight: 1.08,
                          letterSpacing: '-0.01em',
                          wordBreak: 'normal',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {project.title}
                      </h3>
                      <p className="body-regular" style={{ fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)', opacity: 0.88, maxWidth: '500px' }}>
                        {project.description}
                      </p>
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          onClick={() => {
                            soundManager.playWhoosh();
                            onOpenModal && onOpenModal({ title: project.title, videoSrc: videoSources[index % videoSources.length], posterSrc: project.poster });
                          }}
                          className="btn-primary"
                          style={{ borderRadius: '30px', padding: '0.65rem 1.4rem', fontSize: '0.75rem' }}
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
                        minHeight: '200px',
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
                      <LazyVideo
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
                          flexWrap: 'wrap',
                          gap: '0.4rem',
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
                        minHeight: '200px',
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
                      <LazyVideo
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
                          flexWrap: 'wrap',
                          gap: '0.4rem',
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
                    <div className="flex-col" style={{ gap: '0.5rem' }}>
                      <span className="subheading" style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        CLIENT: {project.client}
                      </span>
                      <h3
                        className="display-title"
                        style={{
                          fontSize: 'clamp(1.35rem, 3.5vw, 3.5rem)',
                          lineHeight: 1.08,
                          letterSpacing: '-0.01em',
                          wordBreak: 'normal',
                          overflowWrap: 'break-word',
                        }}
                      >
                        {project.title}
                      </h3>
                      <p className="body-regular" style={{ fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)', opacity: 0.88, maxWidth: '500px' }}>
                        {project.description}
                      </p>
                      <div style={{ marginTop: '0.5rem' }}>
                        <button
                          onClick={() => {
                            soundManager.playWhoosh();
                            onOpenModal && onOpenModal({ title: project.title, videoSrc: videoSources[index % videoSources.length], posterSrc: project.poster });
                          }}
                          className="btn-primary"
                          style={{ borderRadius: '30px', padding: '0.65rem 1.4rem', fontSize: '0.75rem' }}
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

        {/* Bottom Progress Nav — dots + bar + counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            zIndex: 10,
            paddingTop: '0.5rem',
          }}
        >
          {/* Dot indicators */}
          {projects.map((proj, idx) => (
            <span
              key={proj.id}
              style={{
                display: 'inline-block',
                width: activeProjectIndex === idx ? '1.5rem' : '0.4rem',
                height: '0.4rem',
                borderRadius: '99px',
                backgroundColor: activeProjectIndex === idx ? '#fff' : 'rgba(255,255,255,0.25)',
                transition: 'all 0.4s ease',
                flexShrink: 0,
              }}
            />
          ))}

          {/* Progress bar fill */}
          <div
            style={{
              flex: 1,
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${((activeProjectIndex + 1) / projects.length) * 100}%`,
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderRadius: '2px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>

          {/* Right counter */}
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.65rem',
              letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.45)',
              flexShrink: 0,
            }}
          >
            0{activeProjectIndex + 1} / 0{projects.length}
          </span>
        </div>
      </div>
    </section>
  );
}
