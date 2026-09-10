'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';
import { soundManager } from '@/lib/audioManager';

export default function CTASection({ onOpenModal }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);

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
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      <div className="site-container flex-col items-center" style={{ gap: 'var(--space-lg)', textAlign: 'center' }}>
        {/* Header Ribbon */}
        <div className="flex-row items-center" style={{ gap: '1rem' }}>
          <span className="subheading">[ INITIATE PROJECT ]</span>
          <span className="timecode-tag">SCENE 07 // FINAL CUT</span>
        </div>

        {/* Big Action Box */}
        <div
          className="film-crop-marks flex-col items-center"
          style={{
            width: '100%',
            maxWidth: '1000px',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-strong)',
            padding: 'clamp(2rem, 5vw, 4rem) var(--space-md)',
            gap: 'var(--space-md)',
            boxShadow: '0 0 50px rgba(255,255,255,0.03)',
            position: 'relative',
          }}
        >
          <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
            <span className="status-dot"></span>
            <span className="badge-tag">STUDIO BOOKING OPEN</span>
          </div>

          <div className="flex-col items-center" style={{ gap: '0.5rem' }}>
            <span className="subheading" style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              READY TO ELEVATE YOUR VIDEO ASSETS?
            </span>
            <h2
              ref={titleRef}
              className="display-hero"
              style={{
                fontSize: 'clamp(1.6rem, 5.5vw, 6rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
                maxWidth: '100%',
              }}
            >
              LET&apos;S TURN VISION INTO IMPACT.
            </h2>
          </div>

          <p ref={textRef} className="body-lead" style={{ maxWidth: '680px', opacity: 0.85, fontSize: 'clamp(0.9rem, 1.2vw, 1.125rem)' }}>
            Have a commercial campaign, branding film, or social video suite ready for high-precision post-production? Connect directly with our lead editors.
          </p>

          <div
            className="flex-row"
            style={{ gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem', width: '100%' }}
          >
            <a
              href={siteData.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="btn-primary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', maxWidth: '100%' }}
              data-cursor="WHATSAPP 1"
            >
              WHATSAPP 1: {siteData.contact.phone}
            </a>

            <a
              href={siteData.contact.whatsappUrlSecondary}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', maxWidth: '100%' }}
              data-cursor="WHATSAPP 2"
            >
              WHATSAPP 2: {siteData.contact.phoneSecondary}
            </a>

            <a
              href={`mailto:${siteData.contact.email}`}
              onClick={() => soundManager.playClick()}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.25rem', fontSize: '0.75rem', maxWidth: '100%' }}
              data-cursor="EMAIL"
            >
              EMAIL: {siteData.contact.email}
            </a>
          </div>

          <div
            className="flex-row items-center justify-between"
            style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}
          >
            <span className="meta-tag">RESPONSE TIME: &lt; 2 HOURS</span>
            <span className="timecode-tag">ATZINC MEDIA STUDIO</span>
            <span className="meta-tag">GLOBAL POST-PRODUCTION</span>
          </div>
        </div>
      </div>
    </section>
  );
}
