'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';
import { soundManager } from '@/lib/audioManager';
import { useSectionInView } from '@/lib/useSectionInView';

export default function ServicesSection({ onOpenProjectModal }) {
  const [sectionRef, isInView] = useSectionInView({ rootMargin: '350px' });
  const zoomStageRef = useRef(null);
  const zoomTextRef = useRef(null);
  const cardsGridRef = useRef(null);

  const serviceImages = [
    '/images/project-01.webp',
    '/images/project-02.webp',
    '/images/project-03.webp',
    '/images/studio-suite.webp',
    '/images/hero-poster.webp',
    '/images/brand-poster.webp',
    '/images/color-after.webp',
  ];

  const serviceItems = siteData.services.map((srv, idx) => ({
    ...srv,
    image: serviceImages[idx % serviceImages.length],
  }));

  useEffect(() => {
    if (!sectionRef.current || !zoomTextRef.current || !cardsGridRef.current || !zoomStageRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Pin the section during the zoom phase so top cards do not scroll off-screen
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=75%',
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. Kinetic Typography Zoom on "SERVICES" (scale 1x -> 65x)
      tl.fromTo(
        zoomTextRef.current,
        {
          scale: 1,
          autoAlpha: 1,
        },
        {
          scale: 65,
          ease: 'power2.in',
          duration: 1.0,
        },
        0
      );

      // 2. Fade out the zooming word as it expands past the viewport edges
      tl.to(
        zoomTextRef.current,
        {
          autoAlpha: 0,
          duration: 0.25,
          ease: 'power1.out',
        },
        0.55
      );

      // 3. Completely hide zoom stage overlay so cards are 100% interactive
      tl.to(
        zoomStageRef.current,
        {
          autoAlpha: 0,
          duration: 0.25,
          ease: 'power1.out',
        },
        0.65
      );

      // 4. Cards reveal quickly while text is zooming (starts at 0.30, full at 0.75)
      tl.fromTo(
        cardsGridRef.current,
        {
          autoAlpha: 0.15,
          scale: 0.96,
        },
        {
          autoAlpha: 1,
          scale: 1,
          ease: 'power2.out',
          duration: 0.45,
        },
        0.30
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="border-bottom"
      id="services"
      style={{
        backgroundColor: '#0a0a0e',
        position: 'relative',
        paddingTop: 'clamp(6.8rem, 12vh, 8rem)',
        paddingBottom: 'clamp(3.5rem, 6vh, 5rem)',
        overflow: 'hidden',
        minHeight: '100vh',
      }}
    >
      {/* Pinned Kinetic Zoom Stage Overlay on "SERVICES" */}
      <div
        ref={zoomStageRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          zIndex: 30,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#0a0a0e',
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          style={{
            position: 'absolute',
            width: '60vw',
            height: '60vw',
            maxWidth: '650px',
            maxHeight: '650px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(235, 94, 40, 0.14) 0%, rgba(10, 10, 14, 0) 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Vector SVG Word: SERVICES */}
        <div
          ref={zoomTextRef}
          style={{
            position: 'relative',
            zIndex: 5,
            width: '90vw',
            maxWidth: '1200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform, opacity',
            transformOrigin: '50% 50%',
            transform: 'translate3d(0, 0, 0)',
            pointerEvents: 'none',
          }}
        >
          <svg
            viewBox="0 0 1000 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: '100%',
              height: 'auto',
              overflow: 'visible',
            }}
          >
            <text
              x="50%"
              y="58%"
              dominantBaseline="middle"
              textAnchor="middle"
              fill="#ffffff"
              fontFamily="var(--font-display, Impact, sans-serif)"
              fontSize="190"
              fontWeight="900"
              letterSpacing="0.04em"
              style={{
                textTransform: 'uppercase',
              }}
            >
              SERVICES
            </text>
          </svg>
        </div>
      </div>

      {/* 3-Column Medium Sized Cards Grid (NO Header - Cards Only, Revealed Directly Behind Zoom) */}
      <div className="site-container flex-col" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
        <div
          ref={cardsGridRef}
          className="services-card-grid"
          style={{
            width: '100%',
            willChange: 'transform, opacity',
          }}
        >
          {serviceItems.map((item, index) => (
            <div
              key={item.id}
              className={`service-card film-crop-marks ${index === serviceItems.length - 1 ? 'card-centered-col2' : ''}`}
              onClick={() => {
                soundManager.playClick();
                if (onOpenProjectModal) onOpenProjectModal(item.title);
              }}
            >
              {/* Background Image Visual */}
              <img
                src={isInView ? item.image : undefined}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="service-card-image"
                style={{ opacity: isInView ? 1 : 0, transition: 'opacity 0.5s ease' }}
              />

              {/* Vignette Overlay */}
              <div className="service-card-overlay" />

              {/* Card Content Layer */}
              <div className="service-card-content">


                {/* Bottom Bar: Title & Hover-Revealed Details */}
                <div className="service-card-bottom">
                  <h3 className="service-card-title">{item.title}</h3>

                  {/* Revealed on Hover */}
                  <div className="service-card-details">
                    <p className="body-lead" style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.95)', lineHeight: 1.45, fontWeight: 500 }}>
                      {item.tagline}
                    </p>

                    <p className="body-regular" style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.45 }}>
                      {item.description}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playClick();
                        if (onOpenProjectModal) onOpenProjectModal(item.title);
                      }}
                      className="btn-secondary"
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.72rem',
                        alignSelf: 'flex-start',
                        marginTop: '0.25rem',
                        backgroundColor: '#ffffff',
                        color: '#000000',
                        fontWeight: 700,
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                      }}
                    >
                      INQUIRE THIS SERVICE →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
