'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function HeroSection({ isLoaded }) {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const metaRef = useRef(null);
  const ctaRef = useRef(null);
  const statementRef = useRef(null);
  const scrollCueRef = useRef(null);
  const timelineBarRef = useRef(null);

  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // 1. Cinematic Opening Timeline
      if (!prefersReducedMotion) {
        const entranceTl = gsap.timeline({
          defaults: { ease: 'power3.out' },
        });

        entranceTl
          .fromTo(
            mediaRef.current,
            { clipPath: 'inset(10% 10% 10% 10%)', scale: 0.9, opacity: 0 },
            { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1, duration: 1.15 }
          )
          .fromTo(
            line1Ref.current,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.85 },
            '-=0.75'
          )
          .fromTo(
            line2Ref.current,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.85 },
            '-=0.75'
          )
          .fromTo(
            metaRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            '-=0.5'
          )
          .fromTo(
            statementRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            '-=0.4'
          )
          .fromTo(
            ctaRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            '-=0.4'
          )
          .fromTo(
            timelineBarRef.current,
            { opacity: 0, scaleX: 0.9 },
            { opacity: 1, scaleX: 1, duration: 0.6 },
            '-=0.3'
          )
          .fromTo(
            scrollCueRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.2'
          );
      } else {
        gsap.set(
          [
            mediaRef.current,
            line1Ref.current,
            line2Ref.current,
            metaRef.current,
            statementRef.current,
            ctaRef.current,
            timelineBarRef.current,
            scrollCueRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, yPercent: 0, scaleX: 1, clipPath: 'inset(0% 0% 0% 0%)' }
        );
      }

      // 2. Hero Scroll Transformation & Bridge
      if (!prefersReducedMotion) {
        const isMobile = window.innerWidth < 768;

        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        scrollTl
          .to(
            line1Ref.current,
            {
              xPercent: isMobile ? -8 : -20,
              yPercent: -45,
              opacity: 0.15,
              ease: 'none',
            },
            0
          )
          .to(
            line2Ref.current,
            {
              xPercent: isMobile ? 8 : 20,
              yPercent: -45,
              opacity: 0.15,
              ease: 'none',
            },
            0
          )
          .to(
            mediaRef.current,
            {
              scale: isMobile ? 1.03 : 1.12,
              yPercent: 15,
              borderColor: 'rgba(255, 255, 255, 0.55)',
              ease: 'none',
            },
            0
          )
          .to(
            statementRef.current,
            {
              opacity: 0.25,
              yPercent: -25,
              ease: 'none',
            },
            0
          )
          .to(
            scrollCueRef.current,
            {
              opacity: 0,
              ease: 'none',
            },
            0
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section ref={sectionRef} className="hero-section border-bottom" id="hero">
      <div className="site-container flex-col" style={{ gap: 'var(--space-md)' }}>
        {/* Header Metadata Ribbon */}
        <div
          ref={metaRef}
          className="flex-row items-center justify-between"
          style={{ opacity: isLoaded ? 1 : 0, flexWrap: 'wrap', gap: '0.75rem' }}
        >
          <div className="badge-tag">
            <span className="status-dot"></span>
            <span>CREATIVE VIDEO EDITING STUDIO</span>
          </div>

          <div className="flex-row items-center" style={{ gap: '1.5rem' }}>
            <span className="timecode-tag">TIMELINE // 00:00:01:00</span>
            <span className="meta-tag">[ BRANDING FILMS // COMMERCIALS // SOCIAL MEDIA ]</span>
          </div>
        </div>

        {/* Editorial Oversized Display Title */}
        <div className="hero-display-wrapper film-crop-marks" style={{ marginTop: 'var(--space-xs)' }}>
          <div className="hero-title-line">
            <h1
              ref={line1Ref}
              className="display-hero"
              style={{ opacity: isLoaded ? 1 : 0 }}
            >
              ATZYNC
            </h1>
          </div>
          <div className="hero-title-line" style={{ alignSelf: 'flex-end', marginTop: '-0.12em' }}>
            <h1
              ref={line2Ref}
              className="display-hero"
              style={{
                opacity: isLoaded ? 1 : 0,
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--text-primary)',
              }}
            >
              MEDIA
            </h1>
          </div>
        </div>

        {/* Subtitle & Brand Statement */}
        <div
          ref={statementRef}
          className="grid-2col items-center"
          style={{ opacity: isLoaded ? 1 : 0, marginTop: 'var(--space-xs)' }}
        >
          <div className="flex-col" style={{ gap: '0.5rem' }}>
            <span className="subheading" style={{ color: 'var(--text-primary)' }}>
              {siteData.tagline}
            </span>
            <h2 className="heading-md" style={{ letterSpacing: '0.08em', opacity: 0.9 }}>
              {siteData.statement}
            </h2>
          </div>

          <p className="body-lead" style={{ opacity: 0.85 }}>
            Transforming raw concept footage into high-impact editorial stories. Specialized post-production, precision cuts, and sound architecture engineered for modern screens.
          </p>
        </div>

        {/* Hero CTA Actions & Scroll Cue */}
        <div
          ref={ctaRef}
          className="flex-row items-center justify-between"
          style={{ opacity: isLoaded ? 1 : 0, marginTop: 'var(--space-xs)', flexWrap: 'wrap', gap: '1.25rem' }}
        >
          <div className="flex-row items-center" style={{ gap: '1.25rem', flexWrap: 'wrap' }}>
            <a href="#services" className="btn-primary">
              EXPLORE SERVICES
            </a>
            <a
              href="#work"
              className="btn-secondary flex-row items-center"
              style={{ gap: '0.5rem' }}
              data-cursor="PLAY REEL"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>WATCH SHOWREEL</span>
            </a>
          </div>

          {/* Scroll Cue Indicator */}
          <div ref={scrollCueRef} className="flex-row items-center" style={{ gap: '0.5rem', opacity: 0.7 }}>
            <span className="meta-tag" style={{ fontSize: '0.6875rem' }}>SCROLL TO EXPLORE</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Cinematic Video Showreel Monitor */}
        <div
          ref={mediaRef}
          className="hero-media-wrapper film-crop-marks"
          style={{ opacity: isLoaded ? 1 : 0 }}
          data-cursor="SHOWREEL"
        >
          <div className="hero-media-content">
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.88) 100%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />

            <video
              className="hero-video-element"
              autoPlay
              muted
              loop
              playsInline
              poster="/images/hero-poster.jpg"
            >
              {/* <source src="/videos/atzync-showreel.mp4" type="video/mp4" /> */}
            </video>

            <div className="hero-play-badge">
              <span className="status-dot"></span>
              <span>SHOWREEL 2026 // ATZYNC EDITORIAL REEL</span>
            </div>

            {/* Visual Center Graphic / Graphic Fallback */}
            <div
              className="flex-col items-center justify-between"
              style={{
                position: 'absolute',
                zIndex: 3,
                textAlign: 'center',
                padding: 'var(--space-md)',
                pointerEvents: 'none',
              }}
            >
              <span className="meta-tag" style={{ letterSpacing: '0.2em' }}>[ EDITORIAL CUT SHOWCASE ]</span>
              <div style={{ margin: 'var(--space-md) 0' }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                </svg>
              </div>
              <span className="subheading" style={{ fontSize: '0.75rem', opacity: 0.75 }}>
                IDEAS → VISUALS → IMPACT
              </span>
            </div>
          </div>
        </div>

        {/* Editing Timeline Control Track Bar */}
        <div
          ref={timelineBarRef}
          className="flex-row items-center justify-between"
          style={{
            marginTop: '0.75rem',
            padding: '0.75rem 1.25rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            transformOrigin: 'left',
          }}
        >
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="timecode-tag">V1 // TRACK</span>
            <span className="meta-tag" style={{ color: 'var(--text-primary)' }}>ATZYNC_SHOWREEL_4K_CUT.MP4</span>
          </div>

          <div className="flex-row items-center" style={{ gap: '0.25rem' }}>
            <div className="audio-bar" style={{ height: '14px' }}></div>
            <div className="audio-bar" style={{ height: '18px' }}></div>
            <div className="audio-bar" style={{ height: '10px' }}></div>
            <div className="audio-bar" style={{ height: '22px' }}></div>
            <div className="audio-bar" style={{ height: '12px' }}></div>
          </div>

          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="timecode-tag">-12dB // STEREO AUDIO</span>
            <span className="meta-tag">[ 24 FPS ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
