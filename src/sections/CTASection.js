'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function CTASection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 40, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power3.out' }
      )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.4'
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-wrapper section-wrapper--large section-wrapper--alt border-bottom"
      id="cta"
    >
      <div className="site-container flex-col items-center" style={{ gap: 'var(--space-xl)', textAlign: 'center' }}>
        <div className="flex-row items-center" style={{ gap: '1rem' }}>
          <span className="subheading">[ INITIATE PROJECT ]</span>
          <span className="timecode-tag">SCENE 07 // END SEQUENCE</span>
        </div>

        <div className="flex-col items-center" style={{ gap: '0.25rem' }}>
          <span className="subheading" style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>
            GOT A STORY?
          </span>
          <h2 ref={titleRef} className="display-hero" style={{ letterSpacing: '-0.04em' }}>
            LET&apos;S TURN IT INTO IMPACT.
          </h2>
        </div>

        <p ref={textRef} className="body-lead" style={{ maxWidth: '700px', opacity: 0.85 }}>
          Have a video editing project, branding film, or commercial campaign ready to elevate? Connect directly with the ATZYNC MEDIA studio.
        </p>

        <div
          ref={buttonsRef}
          className="flex-row"
          style={{ gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-sm)' }}
        >
          <a
            href={siteData.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            data-cursor="WHATSAPP"
          >
            WHATSAPP: {siteData.contact.phone}
          </a>
          <a
            href={`mailto:${siteData.contact.email}`}
            className="btn-secondary"
            data-cursor="EMAIL"
          >
            EMAIL: {siteData.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}
