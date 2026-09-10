'use client';

import { useState } from 'react';
import ColorGradeSlider from '@/components/ColorGradeSlider';
import { siteData } from '@/data/siteData';

export default function ServicesSection() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  const formatSpecs = [
    { aspect: '2.39:1 SCOPE', label: 'CINEMATIC BRANDING FILM', fps: '24FPS // ARRI ALEXA LOOK', deliverable: 'Master ProRes 4444 XQ' },
    { aspect: '16:9 COMMERCIAL', label: 'COMMERCIAL SPEED CUT', fps: '60FPS // HIGH RETENTION', deliverable: 'Broadcast Master & Social Edits' },
    { aspect: '9:16 VERTICAL REEL', label: 'SOCIAL MEDIA EDITORIAL', fps: '30FPS // MOBILE FORMAT', deliverable: 'Platform-Optimized Vertical Package' },
  ];

  return (
    <section className="section-wrapper border-bottom" id="services" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container flex-col" style={{ gap: 'var(--space-md)' }}>
        {/* Header Ribbon */}
        <div className="flex-row items-center justify-between">
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="subheading">[ OUR CORE SERVICES ]</span>
            <span className="timecode-tag">SCENE 03 // COLOR & EDITORIAL SPECS</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '1rem' }}>
            <span className="meta-tag">INTERACTIVE CANVAS</span>
            <span className="status-dot"></span>
          </div>
        </div>

        {/* Section Heading */}
        <h2 className="heading-lg" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)' }}>
          SPECIALIZED EDITORIAL & COLOR SERVICES
        </h2>

        {/* Main Stage Grid: Interactive Accordion + Live Color Grade Canvas */}
        <div className="grid-2col" style={{ gap: 'var(--space-lg)', marginTop: 'var(--space-xs)' }}>
          {/* Left Column: Interactive Editorial Accordion */}
          <div className="flex-col" style={{ gap: '1rem' }}>
            {siteData.services.map((service, index) => {
              const isActive = activeServiceIndex === index;
              return (
                <div
                  key={service.id}
                  className="film-crop-marks"
                  style={{
                    backgroundColor: isActive ? 'var(--bg-primary)' : 'rgba(0,0,0,0.2)',
                    border: `1px solid ${isActive ? 'var(--text-primary)' : 'var(--border-subtle)'}`,
                    padding: 'var(--space-md)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setActiveServiceIndex(index)}
                >
                  <div className="flex-row items-center justify-between">
                    <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
                      <span className="badge-tag">0{index + 1}</span>
                      <h3 className="heading-md" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {service.title}
                      </h3>
                    </div>
                    <span className="timecode-tag">{formatSpecs[index].aspect}</span>
                  </div>

                  {isActive && (
                    <div className="flex-col" style={{ gap: '0.75rem', marginTop: '1rem', animation: 'fadeIn 0.3s ease' }}>
                      <p className="body-lead" style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                        {service.tagline}
                      </p>

                      <p className="body-regular" style={{ fontSize: '0.9375rem', opacity: 0.85 }}>
                        {service.description}
                      </p>

                      <div className="flex-row items-center justify-between border-top" style={{ paddingTop: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span className="meta-tag" style={{ color: 'var(--text-primary)' }}>
                          RATE: {formatSpecs[index].fps}
                        </span>
                        <span className="meta-tag">
                          MASTER: {formatSpecs[index].deliverable}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Live Interactive Color Grading Split Canvas */}
          <div className="flex-col" style={{ gap: '0.75rem' }}>
            <div className="flex-row items-center justify-between">
              <span className="subheading" style={{ fontSize: '0.75rem' }}>
                [ COLOR GRADE COMPARISON // DRAG SLIDER TO TEST ]
              </span>
              <span className="timecode-tag">ARRI ALEXA LUT</span>
            </div>

            <ColorGradeSlider />

            <div className="flex-row items-center justify-between" style={{ opacity: 0.8, fontSize: '0.75rem' }}>
              <span className="meta-tag">← DRAG LEFT FOR RAW LOG</span>
              <span className="meta-tag">DRAG RIGHT FOR FILM GRADE →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
