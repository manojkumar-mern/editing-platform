'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function NavbarSection({ isLoaded }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  // Scroll listener for sticky background transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Entrance animation trigger
  useEffect(() => {
    if (!isLoaded || !navRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        navRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }, navRef);

    return () => ctx.revert();
  }, [isLoaded]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'WORK', href: '#work', number: '01' },
    { label: 'SERVICES', href: '#services', number: '02' },
    { label: 'ABOUT', href: '#about', number: '03' },
    { label: 'CONTACT', href: '#cta', number: '04' },
  ];

  return (
    <>
      <header
        ref={navRef}
        className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}
        style={{ opacity: isLoaded ? 1 : 0 }}
      >
        <div className="site-container flex-row items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="brand-logo flex-row items-center" style={{ gap: '0.75rem' }}>
            <span className="status-dot"></span>
            <div className="flex-col" style={{ lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.125rem',
                  fontWeight: '800',
                  letterSpacing: '0.06em',
                  color: 'var(--text-primary)',
                  textTransform: 'uppercase',
                }}
              >
                ATZYNC
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.65rem',
                  fontWeight: '600',
                  letterSpacing: '0.25em',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                }}
              >
                MEDIA
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav flex-row items-center" style={{ gap: '2.5rem' }}>
            <div className="flex-row items-center" style={{ gap: '2rem' }}>
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="nav-link-item">
                  {item.label}
                </a>
              ))}
            </div>

            <a
              href={siteData.contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '0.55rem 1.4rem', fontSize: '0.75rem' }}
            >
              START PROJECT
            </a>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            <span>{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
            <span className="status-dot" style={{ width: '5px', height: '5px' }}></span>
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="flex-col" style={{ gap: '1.75rem', marginTop: '2rem' }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="meta-tag" style={{ fontSize: '0.875rem' }}>
                {item.number}
              </span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div className="border-top flex-col" style={{ paddingTop: '1.5rem', gap: '1rem' }}>
          <div className="flex-col" style={{ gap: '0.25rem' }}>
            <span className="meta-tag">DIRECT CONTACT</span>
            <a href={`mailto:${siteData.contact.email}`} className="body-regular" style={{ color: 'var(--text-primary)' }}>
              {siteData.contact.email}
            </a>
            <a href={siteData.contact.whatsappUrl} target="_blank" rel="noopener noreferrer" className="body-regular" style={{ color: 'var(--text-primary)' }}>
              WhatsApp: {siteData.contact.phone}
            </a>
          </div>

          <a
            href={siteData.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            START PROJECT
          </a>
        </div>
      </div>
    </>
  );
}
