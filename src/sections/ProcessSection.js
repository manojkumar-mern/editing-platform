'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const playheadRef = useRef(null);
  const stepsRef = useRef([]);

  const processSteps = [
    {
      number: '01',
      name: 'CONCEPT & CURATION',
      desc: 'Analyzing raw footage selects, storyboards, pacing requirements, and audio reference tracks.',
      timecode: '00:00:05:00',
      track: 'INGEST & SELECTS',
    },
    {
      number: '02',
      name: 'ROUGH ASSEMBLY',
      desc: 'Structuring narrative rhythm, key cut points, initial transition sync, and frame-by-frame pacing.',
      timecode: '00:01:20:12',
      track: 'TIMELINE CHOREOGRAPHY',
    },
    {
      number: '03',
      name: 'COLOR & SOUND DESIGN',
      desc: 'Applying custom film LUTs, sound effects layering, dialogue enhancement, and atmospheric audio mixing.',
      timecode: '00:02:45:00',
      track: 'ARRI GRADED // 7.1 MIX',
    },
    {
      number: '04',
      name: 'MASTER EXPORT',
      desc: 'Final high-bitrate ProRes 4444 XQ mastering, platform-specific aspect ratios, and archival delivery.',
      timecode: '00:04:00:00',
      track: 'PRORES 4444 EXPORT',
    },
  ];

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Animate Playhead line across timeline as user scrolls
      if (playheadRef.current) {
        gsap.fromTo(
          playheadRef.current,
          { width: '0%' },
          {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              end: 'bottom 40%',
              scrub: 0.5,
            },
          }
        );
      }

      gsap.fromTo(
        stepsRef.current,
        { opacity: 0.3, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-wrapper section-wrapper--alt border-bottom" id="process">
      <div className="site-container flex-col" style={{ gap: 'var(--space-lg)' }}>
        {/* Section Header */}
        <div className="flex-col" style={{ gap: '0.35rem' }}>
          <span className="subheading" style={{ color: 'var(--text-secondary)', letterSpacing: '0.14em', fontWeight: 700 }}>
            OUR PROCESS
          </span>
          <h2 className="heading-lg" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
            HOW WE TRANSFORM RAW FOOTAGE INTO IMPACT
          </h2>
        </div>

        {/* Timeline Scrubbing Track Bar */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            margin: 'var(--space-xs) 0',
            overflow: 'hidden',
          }}
        >
          <div
            ref={playheadRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              backgroundColor: 'var(--text-primary)',
              boxShadow: '0 0 15px rgba(255,255,255,0.8)',
            }}
          />
        </div>

        {/* 4 Process Filmstrip Cards */}
        <div className="grid-2col" style={{ gap: 'var(--space-md)' }}>
          {processSteps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => (stepsRef.current[index] = el)}
              className="editorial-block film-crop-marks flex-col justify-between"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                padding: 'var(--space-md)',
                minHeight: '200px',
              }}
              data-cursor="PROCESS"
            >
              <div className="flex-col" style={{ margin: '0.5rem 0', gap: '0.35rem' }}>
                <h3 className="heading-md" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>
                  {step.name}
                </h3>
                <p className="body-regular" style={{ fontSize: '0.9375rem', opacity: 0.85 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
