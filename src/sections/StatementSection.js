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
      // 1. Initial Dimmed State
      gsap.set([word1Ref.current, word2Ref.current, word3Ref.current], {
        opacity: 0.2,
        color: 'rgba(255, 255, 255, 0.22)',
        y: 15,
      });

      // 2. Smooth Interactive ScrollTrigger Timeline starting at 25% from bottom (top 75%)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: 0.8,
        },
      });

      tl.to(word1Ref.current, {
        opacity: 1,
        color: '#ffffff',
        y: 0,
        textShadow: '0 0 20px rgba(255,255,255,0.4)',
        ease: 'power1.inOut',
        duration: 1,
      })
      .to(word2Ref.current, {
        opacity: 1,
        color: '#ffffff',
        y: 0,
        textShadow: '0 0 20px rgba(255,255,255,0.4)',
        ease: 'power1.inOut',
        duration: 1,
      }, '-=0.2')
      .to(word3Ref.current, {
        opacity: 1,
        color: '#ffffff',
        y: 0,
        textShadow: '0 0 30px rgba(255,255,255,0.7)',
        scale: 1.02,
        ease: 'power1.inOut',
        duration: 1,
      }, '-=0.2')
      .fromTo(
        paragraphRef.current,
        { opacity: 0.3, y: 15 },
        { opacity: 1, y: 0, ease: 'power1.out', duration: 0.8 },
        '-=0.2'
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
            style={{ fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)', letterSpacing: '-0.03em', transition: 'text-shadow 0.3s' }}
          >
            IDEAS
          </h2>
          <h2
            ref={word2Ref}
            className="display-title"
            style={{
              fontSize: 'clamp(2.5rem, 7.5vw, 7.5rem)',
              letterSpacing: '-0.03em',
              paddingLeft: 'clamp(1rem, 6vw, 7rem)',
              transition: 'text-shadow 0.3s',
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
              transition: 'text-shadow 0.3s',
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
            We don&apos;t just cut video. We sculpt rhythm, visual tone, and audience retention. From high-pacing commercials to editorial branding films, ATZINC MEDIA translates raw vision into compelling motion.
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
