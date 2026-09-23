import type { MotionToken } from '@/types/ui';

export const MOTION: Record<string, MotionToken> = {
  micro: { duration: 0.12, ease: 'power2.out' },
  stateChange: { duration: 0.22, ease: 'power2.out' },
  transition: { duration: 0.32, ease: 'power2.out' },
  entrance: { duration: 0.6, ease: 'power3.out' },
  hero: { duration: 1.0, ease: 'power3.out' },
} as const;

export const STAGGER = {
  item: 0.05,
  line: 0.06,
  milestone: 0.12,
  field: 0.06,
} as const;

export const EASING = {
  springOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  softSpring: 'cubic-bezier(0.4, 0, 0.2, 1.4)',
  gentleIn: 'cubic-bezier(0.42, 0, 1, 1)',
  gentleOut: 'cubic-bezier(0, 0, 0.2, 1)',
  expoOut: 'expo.out',
  power2Out: 'power2.out',
  power3Out: 'power3.out',
  sineInOut: 'sine.inOut',
} as const;

export const DURATION = {
  micro: 120,
  stateChange: 220,
  transition: 320,
  entrance: 600,
  hero: 1000,
  parsingMilestone: 400,
  fieldInsert: 300,
  fieldDelete: 150,
  morph: 300,
  staggerLine: 60,
} as const;
