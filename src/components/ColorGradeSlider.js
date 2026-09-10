'use client';

import { useState, useRef, useEffect } from 'react';

export default function ColorGradeSlider({
  beforeImage = '/images/color-before.jpg',
  afterImage = '/images/color-after.jpg',
  beforeLabel = '[ RAW LOG FOOTAGE ]',
  afterLabel = '[ ARRI CINEMA GRADE ]',
  lutTag = 'LUT: ATZYNC_FILM_V3',
  filterBefore = 'contrast(0.65) saturate(0.35) brightness(1.15)',
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

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
        src={afterImage}
        alt="Color Graded ARRI Finish"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'src 0.4s ease',
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
          src={beforeImage}
          alt="RAW Camera LOG"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: containerWidth ? `${containerWidth}px` : '100%',
            height: '100%',
            objectFit: 'cover',
            maxWidth: 'none',
            filter: filterBefore,
            transition: 'src 0.4s ease, filter 0.4s ease',
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
          flexWrap: 'wrap',
          gap: '0.4rem',
        }}
      >
        <span
          className="badge-tag"
          style={{
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            opacity: sliderPos > 15 ? 1 : 0.2,
            transition: 'opacity 0.2s',
            fontSize: '0.6875rem',
          }}
        >
          {beforeLabel}
        </span>
        <span
          className="badge-tag"
          style={{
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            opacity: sliderPos < 85 ? 1 : 0.2,
            transition: 'opacity 0.2s',
            fontSize: '0.6875rem',
          }}
        >
          {afterLabel}
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
          flexWrap: 'wrap',
          gap: '0.4rem',
        }}
      >
        <span className="timecode-tag" style={{ backgroundColor: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.5rem', fontSize: '0.6875rem' }}>
          {lutTag}
        </span>
        <span className="meta-tag" style={{ backgroundColor: 'rgba(0,0,0,0.75)', padding: '0.2rem 0.5rem', color: 'var(--text-primary)', fontSize: '0.6875rem' }}>
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
