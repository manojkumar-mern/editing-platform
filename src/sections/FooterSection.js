'use client';

import { siteData } from '@/data/siteData';

export default function FooterSection() {
  return (
    <footer className="section-wrapper" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: 'none' }}>
      <div className="site-container flex-col" style={{ gap: 'var(--space-md)' }}>
        <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div className="flex-col" style={{ gap: '0.5rem' }}>
            <img
              src="/logo-white.png"
              alt="ATZYNC Media"
              style={{ height: 'clamp(45px, 4.5vw, 65px)', width: 'auto', objectFit: 'contain' }}
            />
            <span className="subheading" style={{ fontSize: '0.75rem' }}>{siteData.tagline}</span>
          </div>

          <div className="flex-row items-center" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
            <a href={`mailto:${siteData.contact.email}`} className="meta-tag" style={{ textDecoration: 'underline' }}>
              {siteData.contact.email}
            </a>
            <a href={siteData.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="meta-tag" style={{ textDecoration: 'underline' }}>
              {siteData.contact.phone}
            </a>
            <a href={siteData.contact.whatsappUrlSecondary} target="_blank" rel="noopener noreferrer" className="meta-tag" style={{ textDecoration: 'underline' }}>
              {siteData.contact.phoneSecondary}
            </a>
          </div>
        </div>

        <div className="border-top flex-row items-center justify-between" style={{ paddingTop: 'var(--space-sm)', flexWrap: 'wrap', gap: '1rem' }}>
          <span className="meta-tag">© {new Date().getFullYear()} {siteData.name}. ALL RIGHTS RESERVED.</span>
          <span className="meta-tag">{siteData.statement}</span>
        </div>
      </div>
    </footer>
  );
}
