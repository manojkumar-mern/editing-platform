'use client';

import { siteData } from '@/data/siteData';
import { soundManager } from '@/lib/audioManager';

export default function ServicesSection({ onOpenProjectModal }) {
  const serviceImages = [
    '/images/project-01.jpg',
    '/images/project-02.jpg',
    '/images/project-03.jpg',
    '/images/studio-suite.jpg',
    '/images/hero-poster.jpg',
    '/images/brand-poster.jpg',
    '/images/color-after.jpg',
  ];

  const serviceItems = siteData.services.map((srv, idx) => ({
    ...srv,
    image: serviceImages[idx % serviceImages.length],
  }));

  return (
    <section className="section-wrapper border-bottom" id="services" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="site-container flex-col" style={{ gap: 'var(--space-lg)' }}>
        {/* Header Ribbon */}
        <div className="flex-row items-center justify-between scroll-reveal stagger-1" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <div className="flex-row items-center" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <span className="subheading">[ 03 — SERVICES ]</span>
            <span className="timecode-tag">07 CORE CAPABILITIES</span>
          </div>
          <div className="flex-row items-center" style={{ gap: '0.5rem' }}>
            <span className="meta-tag">CREATIVE PRODUCTION &amp; MARKETING</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="flex-row items-center justify-between scroll-reveal stagger-2" style={{ flexWrap: 'wrap', gap: '0.5rem 1rem' }}>
          <h2 className="heading-lg" style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)' }}>
            WHAT WE DO
          </h2>
          <span className="meta-tag" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)' }}>
            HOVER CARDS TO EXPLORE →
          </span>
        </div>

        {/* Creative Column Services Grid (Crazy Pencilz & Kabira Filmatics Inspired) */}
        <div className="services-card-grid scroll-reveal stagger-3">
          {serviceItems.map((item, index) => (
            <div
              key={item.id}
              className="service-card film-crop-marks"
              onClick={() => {
                soundManager.playClick();
                if (onOpenProjectModal) onOpenProjectModal(item.title);
              }}
            >
              {/* Background Image Visual */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="service-card-image"
              />

              {/* Vignette Overlay */}
              <div className="service-card-overlay" />

              {/* Card Content Layer */}
              <div className="service-card-content">
                {/* Top Bar: Service Number Badge */}
                <div className="service-card-top">
                  <span
                    className="badge-tag"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.75)',
                      backdropFilter: 'blur(6px)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: '0.68rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '20px',
                    }}
                  >
                    {item.number} // {item.title.toUpperCase()}
                  </span>
                </div>

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
