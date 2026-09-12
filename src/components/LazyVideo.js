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
    if (!videoRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (videoRef.current) {
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

    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={videoRef}
      src={isInView ? src : undefined}
      poster={poster}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      className={className}
      style={style}
      {...props}
    />
  );
}
