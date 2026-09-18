'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { siteData } from '@/data/siteData';

export default function NavbarSection({ isLoaded, onOpenProjectModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef(null);
  const isNavClickRef = useRef(false);
  const pathname = usePathname();
  const isWorkPage = pathname === '/work';

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
      document.documentElement.style.overflow = 'hidden';
      if (typeof window !== 'undefined' && window.lenis) {
        window.lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined' && window.lenis) {
        window.lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (typeof window !== 'undefined' && window.lenis) {
        window.lenis.start();
      }
    };
  }, [mobileMenuOpen]);

  // Scroll Spy effect to highlight active nav item and sync URL hash on scroll
  useEffect(() => {
    if (pathname !== '/') return;

    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const valid = ['hero', 'about', 'services', 'work', 'cta'];
      if (valid.includes(hashId)) {
        setActiveSection(hashId);
      }
    }

    const sectionIds = ['hero', 'about', 'services', 'work', 'cta'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavClickRef.current) return;

        // If at the very top of the page, keep hero active
        if (typeof window !== 'undefined' && window.scrollY < 120) {
          setActiveSection('hero');
          if (window.location.hash !== '' && window.location.hash !== '#hero') {
            window.history.replaceState(null, '', '/#hero');
          }
          return;
        }

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
            if (typeof window !== 'undefined') {
              window.history.replaceState(null, '', `/#${id}`);
            }
          }
        });
      },
      {
        // Require section to cross the vertical center (middle 20%) of the screen
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
      observer.disconnect();
    };
  }, [pathname]);

  const handleNavClick = (e, item) => {
    if (pathname === '/') {
      const hashIndex = item.href.indexOf('#');
      if (hashIndex !== -1) {
        const hash = item.href.substring(hashIndex);
        const targetEl = document.querySelector(hash);
        if (targetEl && typeof window !== 'undefined' && window.lenis) {
          e.preventDefault();
          isNavClickRef.current = true;
          setActiveSection(item.id);
          window.history.pushState(null, '', item.href);
          window.lenis.scrollTo(targetEl, {
            offset: 0,
            duration: 1.2,
            onComplete: () => {
              isNavClickRef.current = false;
            },
          });
          setTimeout(() => {
            isNavClickRef.current = false;
          }, 1400);
        }
      }
    }
  };

  const navItems = [
    { label: 'HOME', href: '/#hero', id: 'hero', number: '01' },
    { label: 'ABOUT', href: '/#about', id: 'about', number: '02' },
    { label: 'SERVICES', href: '/#services', id: 'services', number: '03' },
    { label: 'WORK', href: '/#work', id: 'work', number: '04' },
    { label: 'CONTACT', href: '/#cta', id: 'cta', number: '05' },
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
          <a href="/" className="brand-logo flex-row items-center" style={{ gap: '0.75rem' }}>
            <span className="status-dot"></span>
            <img
              src="/logo-white.webp"
              alt="ATZYNC Media"
              style={{
                height: 'clamp(34px, 3.6vw, 44px)',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav flex-row items-center" style={{ gap: '2.5rem' }}>
            <div className="flex-row items-center" style={{ gap: '2rem' }}>
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`nav-link-item ${activeSection === item.id ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item)}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button
              onClick={() => {
                if (onOpenProjectModal) onOpenProjectModal();
              }}
              className="btn-secondary"
              style={{ padding: '0.55rem 1.4rem', fontSize: '0.75rem' }}
            >
              START PROJECT
            </button>
          </nav>

          {/* Creative Animated Mobile Menu Toggle Button */}
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className="hamburger-icon">
              <span className="hamburger-line line-1"></span>
              <span className="hamburger-line line-2"></span>
              <span className="hamburger-line line-3"></span>
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="flex-col" style={{ gap: '1.75rem', marginTop: '2rem' }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`mobile-nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleNavClick(e, item);
              }}
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

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenProjectModal) onOpenProjectModal();
            }}
          >
            START PROJECT
          </button>
        </div>
      </div>
    </>
  );
}
