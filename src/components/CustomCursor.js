'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Set initial position offscreen
    gsap.set(cursor, { xPercent: -50, yPercent: -50, scale: 1 });

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.3, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.3, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const text = target.getAttribute('data-cursor');
        setCursorText(text || '');
        setIsHovered(true);
        gsap.to(cursor, { scale: text ? 4 : 2, duration: 0.3, ease: 'power3.out' });
      } else {
        const link = e.target.closest('a, button');
        if (link) {
          setCursorText('');
          setIsHovered(true);
          gsap.to(cursor, { scale: 1.8, duration: 0.3, ease: 'power3.out' });
        } else {
          setCursorText('');
          setIsHovered(false);
          gsap.to(cursor, { scale: 1, duration: 0.3, ease: 'power3.out' });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s ease',
      }}
    >
      {cursorText && (
        <span
          ref={textRef}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#000000',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          {cursorText}
        </span>
      )}
    </div>
  );
}
