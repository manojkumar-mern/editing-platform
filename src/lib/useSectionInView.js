'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * useSectionInView hook
 * Defers loading of heavy media/assets until the section is within rootMargin of the viewport.
 * Once triggered, latches to true to prevent unnecessary re-fetches or flashing.
 *
 * @param {Object} options - IntersectionObserver options
 * @param {string} [options.rootMargin='300px'] - Anticipation distance before section enters viewport
 * @param {number} [options.threshold=0.01] - Trigger threshold
 * @returns {[React.MutableRefObject, boolean]} [sectionRef, isInView]
 */
export function useSectionInView({ rootMargin = '300px', threshold = 0.01 } = {}) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    if (isInView || typeof window === 'undefined') return;

    const el = elementRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin,
        threshold,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [isInView, rootMargin, threshold]);

  return [elementRef, isInView];
}
