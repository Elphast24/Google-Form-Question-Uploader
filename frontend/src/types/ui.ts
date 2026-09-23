export interface MotionToken {
  duration: number;
  ease: string;
  stagger?: number;
}

export type MotionPreset = 'micro' | 'stateChange' | 'transition' | 'entrance' | 'hero';

export interface StaggerConfig {
  each: number;
  from?: 'start' | 'center' | 'end' | 'random';
}
