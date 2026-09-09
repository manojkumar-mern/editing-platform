'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function AboutSection() {
  const sectionRef = useRef(null);
  const titleLinesRef = useRef([]);
  const textRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleLinesRef.current,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const statementLines = [
    "WE DON'T JUST",
    'EDIT FOOTAGE.',
    'WE BUILD',
    'THE WAY IT FEELS.',
  ];

  return (
    <section ref={sectionRef} className="section-wrapper section-wrapper--large border-bottom" id="about">
      <div className="site-container flex-col" style={{ gap: 'var(--space-xl)' }}>
        <div className="flex-row items-center justify-between">
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading">[ ABOUT ATZYNC MEDIA ]</span>
            <span className="timecode-tag">SCENE 06 // MANIFESTO</span>
          </div>
          <span className="meta-tag">STUDIO PHILOSOPHY</span>
        </div>

        <div className="grid-2col items-center" style={{ gap: 'var(--space-xl)' }}>
          <div className="flex-col" style={{ gap: '0.25rem' }}>
            {statementLines.map((line, index) => (
              <div key={line} style={{ overflow: 'hidden' }}>
                <h2
                  ref={(el) => (titleLinesRef.current[index] = el)}
                  className="display-title"
                  style={{
                    fontSize: 'clamp(2.25rem, 5.5vw, 5rem)',
                    color: index >= 2 ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  {line}
                </h2>
              </div>
            ))}
          </div>

          <div ref={textRef} className="flex-col" style={{ gap: 'var(--space-md)' }}>
            <p className="body-lead" style={{ fontSize: '1.25rem' }}>
              {siteData.name} operates as a specialized post-production visual powerhouse. We focus exclusively on what makes video content convert, resonate, and endure.
            </p>
            <p className="body-regular" style={{ fontSize: '1.0625rem' }}>
              By blending high-fashion editorial aesthetics, precise rhythmic pacing, and bespoke audio sound architecture, we turn ordinary commercial and branding assets into captivating visual statements.
            </p>

            <div className="flex-row items-center" style={{ gap: '1.5rem', marginTop: '0.5rem' }}>
              <div className="badge-tag">EDITORIAL PACING</div>
              <div className="badge-tag">COLOR GRADED</div>
              <div className="badge-tag">SOUND ARCHITECTURE</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
