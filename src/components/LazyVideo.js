'use client';

import { useRef, useEffect, useState } from 'react';

export default function LazyVideo({
  src,
  poster,
  style,
  className,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  ...props
}) {
  const videoRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (videoRef.current && autoPlay) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          if (videoRef.current) {
            videoRef.current.pause();
          }
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoPlay]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (autoPlay && isInView && src) {
      videoRef.current.play().catch(() => {});
    } else if (!autoPlay && videoRef.current) {
      videoRef.current.pause();
    }
  }, [autoPlay, isInView, src]);

  return (
    <video
      ref={videoRef}
      src={isInView ? src : undefined}
      poster={poster}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload="none"
      className={className}
      style={style}
      {...props}
    />
  );
}
