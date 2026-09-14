'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';
import { soundManager } from '@/lib/audioManager';

export default function CTASection({ onOpenModal, onOpenProjectModal }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const marquee1Ref = useRef(null);
  const marquee2Ref = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-wrapper border-bottom"
      id="cta"
      style={{
        position: 'relative',
        backgroundColor: '#07080c',
        backgroundImage: "linear-gradient(180deg, rgba(7, 8, 12, 0.88) 0%, rgba(7, 8, 12, 0.72) 50%, rgba(7, 8, 12, 0.94) 100%), url('/images/contact-bg.jpg')",
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        color: '#ffffff',
        overflow: 'hidden',
        paddingTop: 'clamp(3.5rem, 8vh, 6rem)',
        paddingBottom: 'clamp(3.5rem, 8vh, 6rem)',
      }}
    >

      {/* Subtle Ambient Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '70vw',
          height: '70vw',
          maxWidth: '800px',
          maxHeight: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(235, 94, 40, 0.15) 0%, rgba(7, 8, 12, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <div className="site-container flex-col items-center" style={{ gap: 'var(--space-md)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        {/* Section Header */}
        <div className="flex-col items-center scroll-reveal stagger-1" style={{ gap: '0.35rem', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(1.25rem, 2.4vw, 1.85rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              color: 'rgba(255, 255, 255, 0.9)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            CONTACT US
          </h2>
        </div>

        {/* Dual Infinite Scroll Marquee Bands directly above Contact Card */}
        <div className="flex-col scroll-reveal stagger-2" style={{ gap: '0.75rem', width: '100vw', marginLeft: 'calc(-50vw + 50%)', margin: '0.5rem 0 1.5rem 0', overflow: 'hidden' }}>
          <div ref={marquee1Ref} style={{ willChange: 'transform', width: '100%' }}>
            <div
              className="flex-row items-center marquee-band-left"
              style={{
                gap: '2rem',
                whiteSpace: 'nowrap',
                fontSize: 'clamp(1.75rem, 4.5vw, 4rem)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: '#ffffff',
                opacity: 0.95,
                width: 'max-content',
              }}
            >
              <span>WE CREATE • WE PROMOTE • WE GROW BRANDS • BRANDING FILMS • COMMERCIAL ADS • </span>
              <span>WE CREATE • WE PROMOTE • WE GROW BRANDS • BRANDING FILMS • COMMERCIAL ADS • </span>
              <span>WE CREATE • WE PROMOTE • WE GROW BRANDS • BRANDING FILMS • COMMERCIAL ADS • </span>
            </div>
          </div>

          <div ref={marquee2Ref} style={{ willChange: 'transform', width: '100%' }}>
            <div
              className="flex-row items-center marquee-band-right"
              style={{
                gap: '2rem',
                whiteSpace: 'nowrap',
                fontSize: 'clamp(1.75rem, 4.5vw, 4rem)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.65)',
                opacity: 0.65,
                width: 'max-content',
              }}
            >
              <span>REAL ESTATE VIDEO EDITING • AI VIDEO PRODUCTION • BRANDING FILMS • COMMERCIAL ADS • </span>
              <span>REAL ESTATE VIDEO EDITING • AI VIDEO PRODUCTION • BRANDING FILMS • COMMERCIAL ADS • </span>
              <span>REAL ESTATE VIDEO EDITING • AI VIDEO PRODUCTION • BRANDING FILMS • COMMERCIAL ADS • </span>
            </div>
          </div>
        </div>

        {/* Action Content Layer (Clean floating letters & buttons over fixed image) */}
        <div
          className="flex-col items-center scroll-reveal stagger-2"
          style={{
            width: '100%',
            maxWidth: '1000px',
            padding: 'clamp(1.5rem, 3.5vw, 3rem) var(--space-md)',
            gap: 'var(--space-md)',
            position: 'relative',
          }}
        >
          <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
            <span className="status-dot"></span>
            <span
              className="badge-tag"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--accent-orange)',
                borderColor: 'rgba(235, 94, 40, 0.4)',
              }}
            >
              STUDIO BOOKING OPEN
            </span>
          </div>

          <div className="flex-col items-center" style={{ gap: '0.5rem' }}>
            <span className="subheading" style={{ fontSize: '1.1rem', color: 'rgba(255, 255, 255, 0.85)' }}>
              HAVE A PROJECT IN MIND? LET&apos;S TALK.
            </span>
            <h2
              ref={titleRef}
              className="display-hero"
              style={{
                fontSize: 'clamp(1.6rem, 5.5vw, 5.5rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                maxWidth: '100%',
                color: '#ffffff',
                textShadow: '0 4px 30px rgba(0,0,0,0.8)',
              }}
            >
              LET&apos;S CREATE SOMETHING GREAT.
            </h2>
          </div>

          <p ref={textRef} className="body-lead" style={{ maxWidth: '680px', opacity: 0.88, fontSize: 'clamp(0.9rem, 1.2vw, 1.125rem)', color: 'rgba(255, 255, 255, 0.85)', textShadow: '0 2px 15px rgba(0,0,0,0.7)' }}>
            Connect directly with Atzyncmedia for video production, digital marketing, commercial ads, or Meta ad campaigns.
          </p>

          <div
            className="flex-row"
            style={{ gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem', width: '100%' }}
          >
            <button
              onClick={() => {
                soundManager.playClick();
                if (onOpenProjectModal) onOpenProjectModal();
              }}
              className="btn-primary"
              style={{ padding: '0.85rem 1.6rem', fontSize: '0.8125rem', maxWidth: '100%', cursor: 'pointer' }}
              data-cursor="START PROJECT"
            >
              START A PROJECT →
            </button>

            <a
              href={siteData.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="btn-secondary"
              style={{
                padding: '0.85rem 1.6rem',
                fontSize: '0.8125rem',
                maxWidth: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
              }}
              data-cursor="WHATSAPP US"
            >
              WHATSAPP US → ({siteData.contact.phone})
            </a>

            <a
              href={`mailto:${siteData.contact.email}`}
              onClick={() => soundManager.playClick()}
              className="btn-secondary"
              style={{
                padding: '0.85rem 1.6rem',
                fontSize: '0.8125rem',
                maxWidth: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
              }}
              data-cursor="EMAIL"
            >
              EMAIL: <span style={{ textTransform: 'lowercase', letterSpacing: '0.03em' }}>{siteData.contact.email}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
