'use client';

import { useEffect, useState, useRef } from 'react';

export default function VideoModal({ isOpen, onClose, videoSrc, posterSrc, title = 'SHOWREEL 2026' }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    let interval;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div
      className="video-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.94)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-md)',
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
      onClick={onClose}
    >
      <div
        className="video-modal-content film-crop-marks"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          backgroundColor: '#0a0a0c',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.95)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          className="flex-row items-center justify-between"
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'rgba(15, 15, 18, 0.9)',
          }}
        >
          <div className="flex-row items-center" style={{ gap: '0.75rem' }}>
            <span className="status-dot"></span>
            <span className="badge-tag">CINEMATIC PLAYER</span>
            <span className="meta-tag" style={{ color: 'var(--text-primary)' }}>{title}</span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.25rem 0.5rem',
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Video Canvas Stage */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            maxHeight: '65vh',
            backgroundColor: '#000',
            overflow: 'hidden',
          }}
        >
          <img
            src={posterSrc || '/images/hero-poster.jpg'}
            alt={title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: isPlaying ? 'brightness(0.95)' : 'brightness(0.5)',
              transition: 'filter 0.3s ease',
            }}
          />

          {/* Vignette Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Center Play/Pause Big Button Overlay */}
          {!isPlaying && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setIsPlaying(true)}
            >
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: '6px',
                  boxShadow: '0 0 40px rgba(255,255,255,0.4)',
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div
          className="flex-col"
          style={{
            padding: '1rem 1.25rem',
            backgroundColor: 'rgba(12, 12, 15, 0.95)',
            borderTop: '1px solid var(--border-subtle)',
            gap: '0.75rem',
          }}
        >
          {/* Progress Timeline */}
          <div
            style={{
              width: '100%',
              height: '4px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const pct = (clickX / rect.width) * 100;
              setProgress(pct);
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: 'var(--text-primary)',
                transition: 'width 0.2s linear',
              }}
            />
          </div>

          <div className="flex-row items-center justify-between">
            <div className="flex-row items-center" style={{ gap: '1rem' }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
              >
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
              >
                {isMuted ? 'UNMUTE' : 'MUTE AUDIO'}
              </button>
              <span className="timecode-tag">
                00:00:{Math.floor(progress * 0.6).toString().padStart(2, '0')}:12 // 00:01:45:00
              </span>
            </div>

            <div className="flex-row items-center" style={{ gap: '1rem' }}>
              <span className="meta-tag">4K DCI // 24FPS</span>
              <span className="badge-tag">STEREO MASTER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
