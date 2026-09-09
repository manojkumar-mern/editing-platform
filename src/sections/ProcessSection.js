'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function ProcessSection() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        stepsRef.current,
        { opacity: 0.3, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.25,
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

  const timecodes = ['00:00:15:00', '00:01:30:12', '00:03:00:00'];

  return (
    <section ref={sectionRef} className="section-wrapper section-wrapper--alt border-bottom" id="process">
      <div className="site-container flex-col" style={{ gap: 'var(--space-xl)' }}>
        <div className="flex-row items-center justify-between">
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading">[ EDITORIAL ARCHITECTURE ]</span>
            <span className="timecode-tag">SCENE 05 // WORKFLOW</span>
          </div>
          <span className="meta-tag">05 / THE PROCESS</span>
        </div>

        <h2 className="heading-lg">HOW WE TRANSFORM RAW FOOTAGE INTO IMPACT</h2>

        {/* 3 Process Stage Cards with Editorial Track Headers */}
        <div className="grid-3col" style={{ marginTop: 'var(--space-md)' }}>
          {siteData.processSteps.map((step, index) => (
            <div
              key={step.number}
              ref={(el) => (stepsRef.current[index] = el)}
              className="editorial-block"
              style={{
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-subtle)',
                padding: 'var(--space-lg)',
              }}
              data-cursor="PROCESS"
            >
              <div className="flex-row items-center justify-between">
                <span className="meta-tag">{step.number} // STAGE</span>
                <span className="timecode-tag">{timecodes[index]}</span>
              </div>

              <h3 className="heading-md" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
                {step.name}
              </h3>

              <p className="body-regular" style={{ marginTop: '0.5rem' }}>{step.desc}</p>

              <div className="flex-row items-center justify-between" style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="meta-tag" style={{ fontSize: '0.6875rem' }}>POST TRACK 0{index + 1}</span>
                <span className="status-dot"></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
