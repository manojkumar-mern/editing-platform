'use client';

import { useState, useRef } from 'react';

export default function ColorGradeSlider() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      className="color-grade-slider-wrapper film-crop-marks"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '320px',
        maxHeight: '480px',
        backgroundColor: '#000',
        border: '1px solid var(--border-strong)',
        overflow: 'hidden',
        cursor: 'ew-resize',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      data-cursor="DRAG SLIDER"
    >
      {/* Background Image: Final Color Graded (After) */}
      <img
        src="/images/color-after.jpg"
        alt="Color Graded ARRI Finish"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Foreground Image Clipped: Raw Log Footage (Before) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${sliderPos}%`,
          overflow: 'hidden',
        }}
      >
        <img
          src="/images/color-before.jpg"
          alt="RAW Camera LOG"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: containerRef.current ? `${containerRef.current.offsetWidth}px` : '100vw',
            height: '100%',
            objectFit: 'cover',
            maxWidth: 'none',
          }}
        />
      </div>

      {/* Camera HUD Overlays */}
      <div
        className="flex-row items-center justify-between"
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1.25rem',
          right: '1.25rem',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <span
          className="badge-tag"
          style={{
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            opacity: sliderPos > 15 ? 1 : 0.2,
            transition: 'opacity 0.2s',
          }}
        >
          [ RAW LOG FOOTAGE ]
        </span>
        <span
          className="badge-tag"
          style={{
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            opacity: sliderPos < 85 ? 1 : 0.2,
            transition: 'opacity 0.2s',
          }}
        >
          [ ARRI CINEMA GRADE ]
        </span>
      </div>

      {/* Bottom Specs Bar */}
      <div
        className="flex-row items-center justify-between"
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1.25rem',
          right: '1.25rem',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <span className="timecode-tag" style={{ backgroundColor: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.5rem' }}>
          LUT: ATZINC_FILM_V3
        </span>
        <span className="meta-tag" style={{ backgroundColor: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.5rem', color: 'var(--text-primary)' }}>
          SPLIT: {Math.round(sliderPos)}%
        </span>
      </div>

      {/* Slider Split Bar Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${sliderPos}%`,
          width: '2px',
          backgroundColor: 'var(--text-primary)',
          boxShadow: '0 0 12px rgba(255,255,255,0.8)',
          zIndex: 20,
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
        }}
      >
        {/* Handle Knob */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-primary)',
            border: '2px solid var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0,0,0,0.8)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
