'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';
import { soundManager } from '@/lib/audioManager';

export default function HeroSection({ isLoaded, onOpenModal }) {
  const sectionRef = useRef(null);
  const mediaRef = useRef(null);
  const metaRef = useRef(null);
  const ctaRef = useRef(null);
  const statementRef = useRef(null);
  const scrollCueRef = useRef(null);
  const timelineBarRef = useRef(null);

  // Typewriter effect state for ATZYNC MEDIA title
  const targetLine1 = 'ATZYNC';
  const targetLine2 = 'MEDIA';
  const [typedLine1, setTypedLine1] = useState('');
  const [typedLine2, setTypedLine2] = useState('');

  useEffect(() => {
    if (!isLoaded) return;

    let idx1 = 0;
    let idx2 = 0;

    const timer1 = setInterval(() => {
      if (idx1 <= targetLine1.length) {
        setTypedLine1(targetLine1.slice(0, idx1));
        idx1++;
      } else {
        clearInterval(timer1);
        const timer2 = setInterval(() => {
          if (idx2 <= targetLine2.length) {
            setTypedLine2(targetLine2.slice(0, idx2));
            idx2++;
          } else {
            clearInterval(timer2);
          }
        }, 70);
      }
    }, 60);

    return () => {
      clearInterval(timer1);
    };
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
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
            metaRef.current,
            statementRef.current,
            ctaRef.current,
            timelineBarRef.current,
            scrollCueRef.current,
          ],
          { opacity: 1, y: 0, scale: 1, yPercent: 0, scaleX: 1, clipPath: 'inset(0% 0% 0% 0%)' }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section ref={sectionRef} className="hero-section border-bottom" id="hero" style={{ position: 'relative' }}>
      {/* Real Local Video Ambient Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.2,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          src="/videos/showreel.mp4"
          poster="/images/hero-poster.jpg"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(24px) brightness(0.7)' }}
        />
      </div>

      <div className="site-container flex-col" style={{ gap: 'var(--space-md)', position: 'relative', zIndex: 1 }}>
        {/* Header Metadata Ribbon */}
        <div
          ref={metaRef}
          className="flex-row items-center justify-between hero-meta-ribbon"
          style={{ opacity: isLoaded ? 1 : 0, flexWrap: 'wrap', gap: '0.5rem 1rem' }}
        >
          <div className="badge-tag" style={{ fontSize: 'clamp(0.65rem, 2.2vw, 0.75rem)' }}>
            <span>CREATIVE VIDEO EDITING STUDIO</span>
          </div>

          <div className="flex-row items-center hero-meta-contact" style={{ gap: '0.75rem 1.25rem', flexWrap: 'wrap' }}>
            <span className="timecode-tag" style={{ fontSize: 'clamp(0.65rem, 2.2vw, 0.75rem)' }}>
              PH: {siteData.contact.phone} / {siteData.contact.phoneSecondary}
            </span>
            <span className="meta-tag" style={{ fontSize: 'clamp(0.65rem, 2.2vw, 0.75rem)' }}>[ {siteData.contact.email} ]</span>
          </div>
        </div>

        {/* Oversized Kinetic Display Title with Typewriter Effect */}
        <div className="hero-display-wrapper film-crop-marks" style={{ marginTop: 'var(--space-xs)' }}>
          <div className="hero-title-line">
            <h1 className="display-hero" style={{ opacity: isLoaded ? 1 : 0 }}>
              {typedLine1 || targetLine1}
            </h1>
          </div>
          <div className="hero-title-line hero-title-line-secondary" style={{ marginTop: '-0.12em' }}>
            <h1
              className="display-hero"
              style={{
                opacity: isLoaded ? 1 : 0,
                color: 'transparent',
                WebkitTextStroke: '1.5px var(--text-primary)',
              }}
            >
              {typedLine2 || targetLine2}
            </h1>
          </div>
        </div>

        {/* Subtitle & Brand Statement */}
        <div
          ref={statementRef}
          className="grid-2col items-center hero-statement-grid"
          style={{ opacity: isLoaded ? 1 : 0, marginTop: 'var(--space-xs)' }}
        >
          <div className="flex-col hero-text-col" style={{ gap: '0.5rem' }}>
            <span className="subheading" style={{ color: 'var(--text-primary)' }}>
              {siteData.tagline}
            </span>
            <h2 className="heading-md" style={{ letterSpacing: '0.04em', opacity: 0.95, textTransform: 'uppercase' }}>
              {siteData.headline}
            </h2>
          </div>

          <p className="body-lead hero-paragraph" style={{ opacity: 0.85 }}>
            Transforming raw concept footage into high-impact editorial stories. Precision choreography, color grading, and digital marketing suites engineered for modern screens.
          </p>
        </div>

        {/* Hero CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex-row items-center justify-between hero-cta-wrapper"
          style={{ opacity: isLoaded ? 1 : 0, marginTop: 'var(--space-xs)', flexWrap: 'wrap', gap: '1.25rem' }}
        >
          <div className="flex-row items-center hero-cta-group" style={{ gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#work" className="btn-primary" onClick={() => soundManager.playWhoosh()}>
              VIEW OUR WORK
            </a>
            <a href="#cta" className="btn-secondary" onClick={() => soundManager.playClick()}>
              START A PROJECT
            </a>
            <button
              onClick={() => {
                soundManager.playSubBoom();
                if (onOpenModal) onOpenModal({ title: 'ATZYNC SHOWREEL 2026', videoSrc: '/videos/showreel.mp4', posterSrc: '/images/hero-poster.jpg' });
              }}
              className="btn-secondary flex-row items-center"
              style={{ gap: '0.5rem' }}
              data-cursor="PLAY REEL"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>WATCH SHOWREEL</span>
            </button>
          </div>

          {/* Scroll Cue Indicator */}
          <div ref={scrollCueRef} className="flex-row items-center hero-scroll-cue" style={{ gap: '0.5rem', opacity: 0.7 }}>
            <span className="meta-tag" style={{ fontSize: '0.6875rem' }}>SCROLL FOR CINEMATIC MOTIONS</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Real Local Video Monitor */}
        <div
          ref={mediaRef}
          className="hero-media-wrapper film-crop-marks silver-sheen"
          style={{ opacity: isLoaded ? 1 : 0, cursor: 'pointer', marginTop: 'var(--space-md)' }}
          onClick={() => {
            soundManager.playSubBoom();
            if (onOpenModal) onOpenModal({ title: 'ATZYNC SHOWREEL 2026', videoSrc: '/videos/showreel.mp4', posterSrc: '/images/hero-poster.jpg' });
          }}
          data-cursor="PLAY SHOWREEL"
        >
          <div className="hero-media-content" style={{ position: 'relative', width: '100%', height: '100%' }}>
            {/* Local Video Stream */}
            <video
              autoPlay
              muted
              loop
              playsInline
              src="/videos/showreel.mp4"
              poster="/images/hero-poster.jpg"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                display: 'block',
                filter: 'brightness(0.92)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.8) 100%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />

            <div className="hero-play-badge" style={{ zIndex: 3 }}>
              <span className="status-dot"></span>
              <span>SHOWREEL 2026 // CLICK TO PLAY FULLSCREEN</span>
            </div>

            {/* Glowing Center Play Icon */}
            <div
              className="flex-col items-center justify-center"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                textAlign: 'center',
                padding: 'var(--space-md)',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '5px',
                  boxShadow: '0 0 35px rgba(255,255,255,0.5)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span className="subheading" style={{ fontSize: '0.75rem', marginTop: '1rem', letterSpacing: '0.15em' }}>
                IDEAS → VISUALS → IMPACT
              </span>
            </div>
          </div>
        </div>

        {/* Audio Track Bar */}
        <div
          ref={timelineBarRef}
          className="flex-row items-center justify-between"
          style={{
            marginTop: '0.75rem',
            padding: '0.6rem 1rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            transformOrigin: 'left',
            flexWrap: 'wrap',
            gap: '0.5rem 1rem',
          }}
        >
          <div className="flex-row items-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="timecode-tag" style={{ fontSize: '0.7rem' }}>V1 // AUDIO MASTER</span>
            <span className="meta-tag desktop-nav" style={{ color: 'var(--text-primary)', fontSize: '0.7rem' }}>
              ATZYNC_SHOWREEL_4K.MP4
            </span>
          </div>

          <div className="flex-row items-center" style={{ gap: '0.2rem' }}>
            <div className="audio-bar" style={{ height: '12px' }}></div>
            <div className="audio-bar" style={{ height: '16px' }}></div>
            <div className="audio-bar" style={{ height: '8px' }}></div>
            <div className="audio-bar" style={{ height: '20px' }}></div>
            <div className="audio-bar" style={{ height: '10px' }}></div>
            <div className="audio-bar" style={{ height: '16px' }}></div>
          </div>

          <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
            <span className="timecode-tag" style={{ fontSize: '0.7rem' }}>-12dB // STEREO</span>
            <span className="meta-tag" style={{ fontSize: '0.7rem' }}>[ 24 FPS ]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
