'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { gsap } from '@/lib/gsap';
import { projects } from '@/data/projects';
import { soundManager } from '@/lib/audioManager';
import LazyVideo from '@/components/LazyVideo';
import { useSectionInView } from '@/lib/useSectionInView';

export default function SelectedWorkSection({ onOpenModal }) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [sectionRef, isInView] = useSectionInView({ rootMargin: '350px' });
  const viewportRef = useRef(null);
  const cardsRef = useRef([]);

  const videoSources = [
    '/videos/project-01.mp4',
    '/videos/project-02.mp4',
    '/videos/project-03.mp4',
  ];

  const projectWatermarks = [
    'CINEMA',
    'COMMERCIAL',
    'VIRAL',
    'META ADS',
    'COLOR GRADE',
    'AI MOTION',
  ];

  const projectSpecs = [
    ['Cinematic Pacing', 'Custom Color Grade', 'Sound Architecture'],
    ['Conversion Hooks', 'Dynamic Rhythm Cuts', 'High-Impact SFX'],
    ['9:16 Retention Cuts', 'Viral Hook Design', 'Motion Typography'],
    ['Creative Testing', 'Multi-Hook Variations', 'Direct-Response Edits'],
    ['Precision Assembly', 'Master Export Suites', 'ARRI/LOG Color Mastery'],
    ['Generative Synthesis', 'Neural VFX Cleanup', 'AI Upscaling & Motion'],
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
          end: isMobile ? '+=340%' : '+=750%',
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
        backgroundColor: 'var(--bg-light)',
        color: 'var(--text-dark-primary)',
        position: 'relative',
      }}
    >
      {/* Pinned Viewport Deck Container */}
      <div
        ref={viewportRef}
        className="site-container flex-col justify-between"
        style={{
          minHeight: '100vh',
          paddingTop: 'clamp(6.5rem, 12vh, 8.5rem)',
          paddingBottom: 'clamp(2rem, 4vh, 3.5rem)',
          boxSizing: 'border-box',
        }}
      >
        {/* Section Header */}
        <div className="flex-row items-center justify-between scroll-reveal stagger-1" style={{ zIndex: 10, flexWrap: 'wrap', gap: '0.5rem 1rem', width: '100%' }}>
          <h2 className="heading-lg" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', color: 'var(--text-dark-primary)' }}>
            SELECTED WORK
          </h2>
          <div className="flex-row items-center justify-end" style={{ gap: '0.75rem', marginLeft: 'auto' }}>
            <span className="meta-tag" style={{ color: 'var(--text-dark-muted)', fontWeight: 600 }}>0{activeProjectIndex + 1} / 0{projects.length}</span>
            <Link
              href="/work"
              className="btn-secondary"
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.75rem',
                borderRadius: '20px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-strong)',
              }}
              onClick={() => soundManager.playClick()}
            >
              VIEW ALL WORK →
            </Link>
          </div>
        </div>

        {/* Premium Work Cards Deck Container */}
        <div className="cards-deck-stage">
          {projects.map((project, index) => {
            const isMediaLeft = index % 2 === 1; // Alternating desktop layout
            const watermark = projectWatermarks[index % projectWatermarks.length];
            const specs = projectSpecs[index % projectSpecs.length];
            const isCurrentOrNext = activeProjectIndex === index || activeProjectIndex + 1 === index;

            return (
              <div
                key={project.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="crazy-card-item film-crop-marks"
                style={{
                  position: index === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  maxWidth: '1200px',
                  height: '100%',
                  backgroundColor: '#0f1118',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '24px',
                  boxShadow: '0 30px 70px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  zIndex: index + 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  willChange: 'transform, opacity',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
                onClick={() => {
                  soundManager.playWhoosh();
                  if (onOpenModal) {
                    onOpenModal({
                      title: project.title,
                      videoSrc: videoSources[index % videoSources.length],
                      posterSrc: project.poster,
                    });
                  }
                }}
                data-cursor="WATCH PROJECT"
              >
                {/* Background Watermark Text */}
                <div
                  className="card-background-watermark"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: '-1%',
                    bottom: '-8%',
                    fontSize: 'clamp(5rem, 14vw, 13rem)',
                    fontWeight: 900,
                    color: 'rgba(255, 255, 255, 0.035)',
                    lineHeight: 0.8,
                    userSelect: 'none',
                    pointerEvents: 'none',
                    fontFamily: 'var(--font-display, Impact, sans-serif)',
                    zIndex: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {watermark}
                </div>

                {/* Card Inner Grid: Responsive layout (1 column on mobile, 2 columns on desktop) */}
                <div className={`stacked-card-grid ${isMediaLeft ? 'media-reversed' : ''}`}>
                  {/* Visual Media Showcase */}
                  <div className="stacked-card-media-wrap film-crop-marks">
                    <LazyVideo
                      poster={project.poster}
                      src={isInView && isCurrentOrNext ? videoSources[index % videoSources.length] : undefined}
                      autoPlay={activeProjectIndex === index}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <div className="stacked-card-img-overlay" />
                  </div>

                  {/* Narrative Body */}
                  <div className="stacked-card-body">
                    <div className="flex-col" style={{ gap: '0.5rem' }}>

                      <h3
                        className="stacked-card-title"
                        style={{
                          fontSize: 'clamp(1.4rem, 2.8vw, 2.5rem)',
                          fontWeight: 900,
                          color: '#ffffff',
                          lineHeight: 1.12,
                          letterSpacing: '-0.02em',
                          textTransform: 'uppercase',
                          margin: 0,
                        }}
                      >
                        {project.title}
                      </h3>

                      <p
                        className="body-lead"
                        style={{
                          fontSize: 'clamp(0.85rem, 1.2vw, 1.05rem)',
                          color: 'rgba(255, 255, 255, 0.9)',
                          lineHeight: 1.35,
                          fontWeight: 500,
                          marginTop: '0.1rem',
                        }}
                      >
                        {project.category} — {project.client}
                      </p>

                      <p
                        className="body-regular stacked-card-desc"
                        style={{
                          fontSize: 'clamp(0.78rem, 1vw, 0.88rem)',
                          color: 'rgba(255, 255, 255, 0.65)',
                          lineHeight: 1.5,
                          maxWidth: '540px',
                        }}
                      >
                        {project.description}
                      </p>
                    </div>

                    <div className="flex-col stacked-card-specs" style={{ gap: '0.85rem', marginTop: '0.75rem' }}>
                      <div className="flex-row items-center" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
                        {specs.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="stacked-card-spec-pill"
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              padding: '0.3rem 0.65rem',
                              borderRadius: '100px',
                              backgroundColor: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              color: 'rgba(255, 255, 255, 0.85)',
                            }}
                          >
                            ✓ {spec}
                          </span>
                        ))}
                      </div>

                      <div className="flex-row items-center" style={{ gap: '1rem' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundManager.playWhoosh();
                            if (onOpenModal) {
                              onOpenModal({
                                title: project.title,
                                videoSrc: videoSources[index % videoSources.length],
                                posterSrc: project.poster,
                              });
                            }
                          }}
                          className="btn-primary flex-row items-center"
                          style={{
                            padding: '0.55rem 1.25rem',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            borderRadius: '100px',
                            cursor: 'pointer',
                            gap: '0.5rem',
                          }}
                        >
                          <span>WATCH FULL CUT</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
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
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto',
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
                backgroundColor: activeProjectIndex === idx ? 'var(--accent-orange)' : 'rgba(0,0,0,0.25)',
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
              backgroundColor: 'rgba(0,0,0,0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${((activeProjectIndex + 1) / projects.length) * 100}%`,
                backgroundColor: 'var(--accent-orange)',
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
              color: 'var(--text-dark-muted)',
              fontWeight: 600,
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
