'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function StatementSection() {
  const sectionRef = useRef(null);
  const word1Ref = useRef(null);
  const word2Ref = useRef(null);
  const word3Ref = useRef(null);
  const paragraphRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 20%',
          scrub: 0.8,
        },
      });

      tl.fromTo(
        word1Ref.current,
        { opacity: 0.2, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, ease: 'none' }
      )
      .fromTo(
        word2Ref.current,
        { opacity: 0.2, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, ease: 'none' },
        '+=0.1'
      )
      .fromTo(
        word3Ref.current,
        { opacity: 0.2, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1.05, color: '#ffffff', ease: 'none' },
        '+=0.1'
      )
      .fromTo(
        paragraphRef.current,
        { opacity: 0.3, y: 20 },
        { opacity: 1, y: 0, ease: 'none' },
        '-=0.1'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper section-wrapper--alt border-bottom" id="statement">
      <div className="site-container flex-col" style={{ gap: 'var(--space-lg)' }}>
        <div className="flex-row items-center justify-between">
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading">[ BRAND MANIFESTO ]</span>
            <span className="timecode-tag">SCENE 01 // MANIFESTO CUT</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '0.25rem' }}>
            <div className="audio-bar" style={{ height: '12px' }}></div>
            <div className="audio-bar" style={{ height: '16px' }}></div>
            <div className="audio-bar" style={{ height: '20px' }}></div>
            <div className="audio-bar" style={{ height: '14px' }}></div>
          </div>
        </div>

        {/* Choreographed Editorial Words */}
        <div className="flex-col film-crop-marks" style={{ gap: 'var(--space-xs)' }}>
          <h2
            ref={word1Ref}
            className="display-title"
            style={{ fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)', letterSpacing: '-0.03em' }}
          >
            IDEAS
          </h2>
          <h2
            ref={word2Ref}
            className="display-title"
            style={{
              fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)',
              letterSpacing: '-0.03em',
              color: 'var(--text-secondary)',
              paddingLeft: 'clamp(1rem, 6vw, 7rem)',
            }}
          >
            → VISUALS
          </h2>
          <h2
            ref={word3Ref}
            className="display-title"
            style={{
              fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)',
              letterSpacing: '-0.03em',
              paddingLeft: 'clamp(2rem, 12vw, 14rem)',
            }}
          >
            → IMPACT
          </h2>
        </div>

        <div className="border-top flex-row items-center justify-between" style={{ paddingTop: 'var(--space-md)', flexWrap: 'wrap', gap: '1.5rem' }}>
          <p
            ref={paragraphRef}
            className="body-lead"
            style={{ maxWidth: 'var(--max-width-narrow)', opacity: 0.9 }}
          >
            We don&apos;t just cut video. We sculpt rhythm, visual tone, and audience retention. From high-pacing commercials to editorial branding films, ATZYNC MEDIA translates raw vision into compelling motion.
          </p>

          <div className="flex-col" style={{ gap: '0.35rem' }}>
            <span className="timecode-tag">PACING: MATHEMATICAL</span>
            <span className="timecode-tag">AUDIO: BESPOKE SOUND</span>
          </div>
        </div>
      </div>
    </section>
  );
}
