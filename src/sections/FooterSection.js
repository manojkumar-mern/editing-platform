'use client';

import { siteData } from '@/data/siteData';

export default function FooterSection() {
  return (
    <footer className="section-wrapper" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: 'none' }}>
      <div className="site-container flex-col" style={{ gap: 'var(--space-md)' }}>
        <div className="flex-row items-center justify-between scroll-reveal stagger-1" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div className="flex-col" style={{ gap: '0.5rem' }}>
            <img
              src="/logo-white.webp"
              alt="ATZYNC Media"
              loading="lazy"
              decoding="async"
              style={{ height: 'clamp(45px, 4.5vw, 65px)', width: 'auto', objectFit: 'contain' }}
            />
            <span className="subheading" style={{ fontSize: '0.75rem' }}>{siteData.tagline}</span>
          </div>

          <div className="flex-row items-center" style={{ gap: '1.25rem', flexWrap: 'wrap' }}>
            <a
              href={`mailto:${siteData.contact.email}`}
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                color: 'rgba(255, 255, 255, 0.95)',
                textDecoration: 'none',
                textTransform: 'lowercase',
                letterSpacing: '0.04em',
                padding: '0.35rem 0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                transition: 'all 0.2s ease',
              }}
            >
              {siteData.contact.email}
            </a>
            <a
              href={siteData.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                padding: '0.35rem 0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                transition: 'all 0.2s ease',
              }}
            >
              {siteData.contact.phone}
            </a>
            <a
              href={siteData.contact.whatsappUrlSecondary}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.8125rem',
                fontFamily: 'var(--font-mono)',
                color: 'rgba(255, 255, 255, 0.8)',
                textDecoration: 'none',
                letterSpacing: '0.05em',
                padding: '0.35rem 0.85rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                transition: 'all 0.2s ease',
              }}
            >
              {siteData.contact.phoneSecondary}
            </a>
          </div>
        </div>

        <div className="border-top flex-row items-center justify-between scroll-reveal stagger-2" style={{ paddingTop: 'var(--space-sm)', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="meta-tag">© {new Date().getFullYear()} {siteData.name}. ALL RIGHTS RESERVED.</span>
          <span className="meta-tag">{siteData.statement}</span>
        </div>
      </div>
    </footer>
  );
}
