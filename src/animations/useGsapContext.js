'use client';

import { useLayoutEffect, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

// SSR-safe layout effect hook
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Custom React hook for GSAP animation context with auto-cleanup on unmount.
 * @param {Function} animationCallback - Function receiving (ctx, scopeRef)
 * @param {React.RefObject} scopeRef - Scoped container element
 * @param {Array} dependencies - Dependency array for effect re-trigger
 */
export function useGsapContext(animationCallback, scopeRef, dependencies = []) {
  useIsomorphicLayoutEffect(() => {
    if (!scopeRef.current) return;

    const ctx = gsap.context(() => {
      animationCallback(ctx);
    }, scopeRef);

    return () => ctx.revert();
  }, dependencies);
}
