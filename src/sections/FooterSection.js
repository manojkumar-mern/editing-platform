'use client';

import { siteData } from '@/data/siteData';

export default function FooterSection() {
  return (
    <footer className="section-wrapper" style={{ paddingTop: 'var(--space-lg)', paddingBottom: 'var(--space-lg)', borderBottom: 'none' }}>
      <div className="site-container flex-col" style={{ gap: 'var(--space-md)' }}>
        <div className="flex-row items-center justify-between" style={{ flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
          <div className="flex-col" style={{ gap: '0.5rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800 }}>
              {siteData.name}
            </span>
            <span className="subheading" style={{ fontSize: '0.75rem' }}>{siteData.tagline}</span>
          </div>

          <div className="flex-row" style={{ gap: '2rem' }}>
            <a href={`mailto:${siteData.contact.email}`} className="meta-tag" style={{ textDecoration: 'underline' }}>
              {siteData.contact.email}
            </a>
            <a href={siteData.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="meta-tag" style={{ textDecoration: 'underline' }}>
              {siteData.contact.phone}
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
