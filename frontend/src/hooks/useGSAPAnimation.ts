import { useState, useEffect, useCallback } from 'react';

export interface GSAPAnimationHelpers {
  reduceMotion: boolean;
  effective: (duration: number) => number;
  staggerDelay: (base: number) => number;
}

export const useGSAPAnimation = (): GSAPAnimationHelpers => {
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const effective = useCallback(
    (duration: number): number => (reduceMotion ? 0.001 : duration),
    [reduceMotion]
  );

  const staggerDelay = useCallback(
    (base: number): number => (reduceMotion ? 0 : base),
    [reduceMotion]
  );

  return { reduceMotion, effective, staggerDelay };
};
