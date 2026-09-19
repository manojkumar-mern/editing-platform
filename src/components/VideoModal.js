'use client';

import { useEffect, useState, useRef } from 'react';
import { soundManager } from '@/lib/audioManager';

export default function VideoModal({ isOpen, onClose, videoSrc, posterSrc, title = 'SHOWREEL 2026' }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  const activeVideo = videoSrc || '/videos/showreel.mp4';
  const activePoster = posterSrc || '/images/hero-poster.webp';

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      soundManager.playSubBoom();
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      soundManager.playClick();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      soundManager.playClick();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const frames = Math.floor((timeInSeconds % 1) * 24);
    return `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

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
        className="video-modal-content film-crop-marks silver-sheen"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          backgroundColor: '#0a0a0c',
          border: '1px solid var(--border-strong)',
          borderRadius: '16px',
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
            <span className="badge-tag video-modal-header-badge">CINEMATIC REAL PLAYER</span>
            <span className="meta-tag video-modal-title" style={{ color: 'var(--text-primary)' }}>{title}</span>
          </div>

          <button
            onClick={() => { soundManager.playClick(); onClose(); }}
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
          <video
            ref={videoRef}
            src={activeVideo}
            poster={activePoster}
            autoPlay
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              cursor: 'pointer',
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

          {/* Center Play/Pause Overlay */}
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
              onClick={togglePlay}
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
          className="video-modal-control-bar flex-col"
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
              height: '6px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              position: 'relative',
              cursor: 'pointer',
              borderRadius: '3px',
              overflow: 'hidden',
            }}
            onClick={(e) => {
              if (videoRef.current && duration > 0) {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = clickX / rect.width;
                videoRef.current.currentTime = pct * duration;
              }
            }}
          >
            <div
              style={{
                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                height: '100%',
                backgroundColor: 'var(--text-primary)',
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              }}
            />
          </div>

          <div className="video-modal-controls flex-row items-center justify-between">
            <div className="flex-row items-center video-modal-buttons-group" style={{ gap: '0.65rem' }}>
              <button
                onClick={togglePlay}
                className="btn-primary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', borderRadius: '20px', whiteSpace: 'nowrap' }}
              >
                {isPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                onClick={toggleMute}
                className="btn-secondary"
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', borderRadius: '20px', whiteSpace: 'nowrap' }}
              >
                {isMuted ? 'UNMUTE' : 'MUTE 🔊'}
              </button>
            </div>

            <div className="video-modal-timecode-container">
              <span className="timecode-tag video-modal-timecode" style={{ whiteSpace: 'nowrap' }}>
                {formatTime(currentTime)} // {formatTime(duration)}
              </span>
            </div>

            <div className="flex-row items-center video-modal-right-controls" style={{ gap: '0.75rem' }}>
              <span className="meta-tag video-modal-meta" style={{ whiteSpace: 'nowrap' }}>4K DCI // 24FPS</span>
              <span className="badge-tag video-modal-editorial-tag" style={{ borderRadius: '20px', whiteSpace: 'nowrap' }}>REAL EDITORIAL CUT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
