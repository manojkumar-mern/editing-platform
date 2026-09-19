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

  const handlePrevCard = () => {
    if (activeProjectIndex > 0) {
      soundManager.playWhoosh();
      setActiveProjectIndex((prev) => prev - 1);
    }
  };

  const handleNextCard = () => {
    if (activeProjectIndex < projects.length - 1) {
      soundManager.playWhoosh();
      setActiveProjectIndex((prev) => prev + 1);
    }
  };

  const handleSelectCard = (index) => {
    if (index !== activeProjectIndex) {
      soundManager.playWhoosh();
      setActiveProjectIndex(index);
    }
  };

  // Ensure card elements are initially set and animated smoothly on activeProjectIndex change
  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards || cards.length === 0) return;

    cards.forEach((card, index) => {
      if (!card) return;

      if (index === activeProjectIndex) {
        gsap.to(card, {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'all',
          zIndex: 10,
          pointerEvents: 'auto',
        });
      } else if (index < activeProjectIndex) {
        // Previous cards -> slide upside (-105%)
        gsap.to(card, {
          yPercent: -105,
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'all',
          zIndex: index + 1,
          pointerEvents: 'none',
        });
      } else {
        // Upcoming cards -> waiting downside (+105%)
        gsap.to(card, {
          yPercent: 105,
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: 'all',
          zIndex: projects.length - index,
          pointerEvents: 'none',
        });
      }
    });
  }, [activeProjectIndex]);

  return (
    <section
      ref={sectionRef}
      className="border-bottom"
      id="work"
      style={{
        backgroundColor: 'var(--bg-light)',
        color: 'var(--text-dark-primary)',
        position: 'relative',
        paddingTop: 'clamp(4rem, 8vh, 6rem)',
        paddingBottom: 'clamp(3.5rem, 7vh, 5rem)',
      }}
    >
      <div
        ref={viewportRef}
        className="site-container flex-col justify-between"
        style={{
          boxSizing: 'border-box',
          gap: '1.75rem',
        }}
      >
        {/* Section Header */}
        <div className="flex-row items-center justify-between scroll-reveal stagger-1" style={{ zIndex: 10, gap: '0.5rem 1rem', width: '100%', alignItems: 'center' }}>
          <h2 className="heading-lg" style={{ fontSize: 'clamp(1.15rem, 3.2vw, 3rem)', color: 'var(--text-dark-primary)', margin: 0 }}>
            FEATURED PORTFOLIO
          </h2>
          <div className="flex-row items-center justify-end" style={{ gap: '0.45rem', marginLeft: 'auto', flexShrink: 0 }}>
            <span className="meta-tag" style={{ color: 'var(--text-dark-muted)', fontWeight: 600, fontSize: '0.7rem' }}>0{activeProjectIndex + 1} / 0{projects.length}</span>
            <Link
              href="/work"
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.8rem',
                fontSize: '0.68rem',
                borderRadius: '20px',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-strong)',
                whiteSpace: 'nowrap',
              }}
              onClick={() => soundManager.playClick()}
            >
              VIEW ALL WORK →
            </Link>
          </div>
        </div>

        {/* Stage Wrapper holding Cards Deck + Arrow Controls on Right OUTSIDE card */}
        <div className="portfolio-main-stage-wrapper">
          {/* Cards Deck Container */}
          <div className="cards-deck-stage">
            {projects.map((project, index) => {
              const isMediaLeft = index % 2 === 1; // Alternating desktop layout
              const watermark = projectWatermarks[index % projectWatermarks.length];
              const specs = projectSpecs[index % projectSpecs.length];
              const isCurrentOrNext = activeProjectIndex === index || activeProjectIndex + 1 === index || activeProjectIndex - 1 === index;
              const isInitiallyActive = index === 0;

              return (
                <div
                  key={project.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className="crazy-card-item film-crop-marks"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#0f1118',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '24px',
                    boxShadow: '0 30px 70px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                    zIndex: isInitiallyActive ? 10 : projects.length - index,
                    opacity: isInitiallyActive ? 1 : 0,
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

                  {/* Card Inner Grid */}
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

          {/* Right Side Vertical Arrow Controls + Vertical Scroll Label OUTSIDE card */}
          <div className="portfolio-sidebar-controls-wrap">
            <div className="portfolio-arrow-controls" aria-label="Portfolio Navigation">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevCard();
                }}
                disabled={activeProjectIndex === 0}
                aria-label="Previous Project (Move Card Down)"
                className="portfolio-arrow-btn"
                title="Previous Project"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>

              <div className="flex-col items-center" style={{ gap: '5px' }}>
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCard(idx);
                    }}
                    aria-label={`Go to project ${idx + 1}`}
                    className={`portfolio-step-dot ${activeProjectIndex === idx ? 'active' : ''}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextCard();
                }}
                disabled={activeProjectIndex === projects.length - 1}
                aria-label="Next Project (Move Card Up)"
                className="portfolio-arrow-btn"
                title="Next Project"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>

            {/* 2. Middle: Center Red Down Arrow Indicator between Left Bar and Right Text */}
            <div className="portfolio-center-red-arrow">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3b30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>

            {/* 3. Right: Vertical Scroll Text Label */}
            <div className="portfolio-vertical-scroll-label">
              <span>SCROLL TO EXPLORE MORE</span>
            </div>
          </div>
        </div>

        {/* Bottom Progress Nav — dots + bar + counter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            zIndex: 10,
            paddingTop: '0.5rem',
            maxWidth: '1240px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          {/* Dot indicators */}
          {projects.map((proj, idx) => (
            <button
              key={proj.id}
              type="button"
              onClick={() => handleSelectCard(idx)}
              aria-label={`Go to ${proj.title} (project ${idx + 1} of ${projects.length})`}
              title={`Go to ${proj.title}`}
              className="portfolio-bottom-dot"
              style={{
                display: 'inline-block',
                width: activeProjectIndex === idx ? '1.5rem' : '0.4rem',
                height: '0.4rem',
                borderRadius: '99px',
                backgroundColor: activeProjectIndex === idx ? 'var(--accent-orange)' : 'rgba(0,0,0,0.25)',
                transition: 'all 0.4s ease',
                flexShrink: 0,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
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
