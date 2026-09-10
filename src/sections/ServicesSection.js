'use client';

import { useState } from 'react';
import ColorGradeSlider from '@/components/ColorGradeSlider';
import { siteData } from '@/data/siteData';

export default function ServicesSection() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const serviceComparisons = [
    {
      beforeImage: '/images/color-before.jpg',
      afterImage: '/images/color-after.jpg',
      beforeLabel: '[ RAW LOG FOOTAGE ]',
      afterLabel: '[ ARRI CINEMA GRADE ]',
      lutTag: 'LUT: ATZYNC_BRAND_ARRI',
      filterBefore: 'contrast(0.65) saturate(0.35) brightness(1.15)',
      hudHeader: 'ARRI ALEXA LUT',
    },
    {
      beforeImage: '/images/project-02.jpg',
      afterImage: '/images/project-02.jpg',
      beforeLabel: '[ RAW UNGRADED CUT ]',
      afterLabel: '[ COMMERCIAL RETENTION MASTER ]',
      lutTag: 'SPEED: 60FPS // BROADCAST',
      filterBefore: 'contrast(0.6) saturate(0.25) brightness(1.2)',
      hudHeader: 'COMMERCIAL RETENTION CUT',
    },
    {
      beforeImage: '/images/project-03.jpg',
      afterImage: '/images/project-03.jpg',
      beforeLabel: '[ UNEDITED REEL CLIPS ]',
      afterLabel: '[ VIRAL REEL MASTER ]',
      lutTag: 'FORMAT: 9:16 VERTICAL',
      filterBefore: 'contrast(0.7) saturate(0.35) brightness(1.15)',
      hudHeader: '9:16 SHORT-FORM REEL',
    },
    {
      beforeImage: '/images/studio-suite.jpg',
      afterImage: '/images/studio-suite.jpg',
      beforeLabel: '[ UNCURATED FEED ]',
      afterLabel: '[ MANAGED BRAND CHANNEL ]',
      lutTag: 'STRATEGY: BRAND_GROWTH_V2',
      filterBefore: 'grayscale(0.85) contrast(0.7)',
      hudHeader: 'BRAND CHANNEL GROWTH',
    },
    {
      beforeImage: '/images/hero-poster.jpg',
      afterImage: '/images/hero-poster.jpg',
      beforeLabel: '[ UNTESTED AD CREATIVE ]',
      afterLabel: '[ HIGH-ROAS META AD ]',
      lutTag: 'CAMPAIGN: META_ROAS_BOOST',
      filterBefore: 'contrast(0.65) saturate(0.3) brightness(1.2)',
      hudHeader: 'HIGH-CONVERTING META AD',
    },
    {
      beforeImage: '/images/project-01.jpg',
      afterImage: '/images/project-01.jpg',
      beforeLabel: '[ UNEDITED RAW CLIPS ]',
      afterLabel: '[ PACING & SOUND MASTER ]',
      lutTag: 'EDIT: PACING_CHOREOGRAPHY',
      filterBefore: 'contrast(0.6) saturate(0.2) brightness(1.2) sepia(0.2)',
      hudHeader: 'PRECISION EDITORIAL & PACING',
    },
    {
      beforeImage: '/images/brand-poster.jpg',
      afterImage: '/images/brand-poster.jpg',
      beforeLabel: '[ RAW AI PROMPTED BASE ]',
      afterLabel: '[ SYNTHETIC MOTION VFX ]',
      lutTag: 'AI: NEURAL_STYLE_V5',
      filterBefore: 'contrast(0.7) saturate(0.3) hue-rotate(45deg)',
      hudHeader: 'AI GENERATIVE VFX',
    },
  ];

  const activeComparison = serviceComparisons[activeServiceIndex] || serviceComparisons[0];

  return (
    <section className="section-wrapper border-bottom" id="services" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container flex-col" style={{ gap: 'var(--space-md)' }}>
        {/* Header Ribbon */}
        <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <div className="flex-row items-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="subheading">[ 03 — SERVICES ]</span>
            <span className="timecode-tag">07 CORE CAPABILITIES</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '0.5rem' }}>
            <span className="meta-tag">CREATIVE PRODUCTION & MARKETING</span>
          </div>
        </div>

        {/* Section Heading */}
        <h2 className="heading-lg" style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)' }}>
          WHAT WE DO
        </h2>

        {/* Main Stage Grid: Interactive Accordion + Live Color Grade Canvas */}
        <div className="grid-2col" style={{ gap: 'var(--space-lg)', marginTop: 'var(--space-xs)' }}>
          {/* Left Column: Interactive Editorial Accordion for 7 Services */}
          <div className="flex-col" style={{ gap: '0.75rem' }}>
            {siteData.services.map((service, index) => {
              const isActive = activeServiceIndex === index;
              return (
                <div
                  key={service.id}
                  className="film-crop-marks"
                  style={{
                    backgroundColor: isActive ? 'var(--bg-primary)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${isActive ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                    padding: 'clamp(0.85rem, 1.5vw, 1.25rem)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setActiveServiceIndex(index)}
                >
                  <div className="flex-row items-center justify-between">
                    <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
                      <span className="badge-tag" style={{ borderRadius: '20px', padding: '0.2rem 0.6rem' }}>
                        {service.number}
                      </span>
                      <h3 className="heading-md" style={{ textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: 'clamp(1rem, 1.5vw, 1.25rem)' }}>
                        {service.title}
                      </h3>
                    </div>
                    <span className="meta-tag">{isActive ? '− LESS' : '+ MORE'}</span>
                  </div>

                  {isActive && (
                    <div className="flex-col" style={{ gap: '0.5rem', marginTop: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
                      <p className="body-lead" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        {service.tagline}
                      </p>
                      <p className="body-regular" style={{ fontSize: '0.875rem', opacity: 0.85 }}>
                        {service.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Color Grading Split Canvas */}
          <div className="flex-col" style={{ gap: '0.75rem' }}>
            <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
              <span className="subheading" style={{ fontSize: '0.75rem' }}>
                [ BEFORE / AFTER COMPARISON // DRAG SLIDER ]
              </span>
              <span className="timecode-tag">{activeComparison.hudHeader}</span>
            </div>

            <ColorGradeSlider
              key={activeServiceIndex}
              beforeImage={activeComparison.beforeImage}
              afterImage={activeComparison.afterImage}
              beforeLabel={activeComparison.beforeLabel}
              afterLabel={activeComparison.afterLabel}
              lutTag={activeComparison.lutTag}
              filterBefore={activeComparison.filterBefore}
            />

            <div className="flex-row items-center justify-between" style={{ opacity: 0.8, fontSize: '0.75rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span className="meta-tag">← SLIDE LEFT FOR MASTER FINISH</span>
              <span className="meta-tag">SLIDE RIGHT FOR UNEDITED RAW →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
