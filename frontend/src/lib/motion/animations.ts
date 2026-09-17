import gsap from 'gsap';

export const createEntranceTimeline = (targets: gsap.TweenTarget, options?: {
  y?: number;
  opacity?: number;
  scale?: number;
  duration?: number;
  ease?: string;
  stagger?: number;
  delay?: number;
}) => {
  const {
    y = 24,
    opacity = 0,
    scale = 1,
    duration = 0.6,
    ease = 'power3.out',
    stagger = 0,
    delay = 0,
  } = options ?? {};

  return gsap.from(targets, {
    y,
    opacity,
    scale,
    duration,
    ease,
    stagger,
    delay,
  });
};

export const createHoverAnimation = (target: gsap.TweenTarget) => {
  return gsap.to(target, {
    y: -2,
    boxShadow: '0 4px 12px rgba(60, 64, 67, 0.15)',
    duration: 0.12,
    ease: 'power2.out',
  });
};

export const createPressAnimation = (target: gsap.TweenTarget) => {
  return gsap.to(target, {
    scale: 0.97,
    duration: 0.12,
    ease: 'power1.out',
  });
};

export const createFocusRingAnimation = (target: gsap.TweenTarget) => {
  return gsap.to(target, {
    scale: 1.02,
    duration: 0.14,
    ease: 'power2.out',
    boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.3)',
  });
};

export const createFieldInsertAnimation = (target: gsap.TweenTarget) => {
  return gsap.from(target, {
    scale: 0.96,
    opacity: 0,
    duration: 0.3,
    ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  });
};

export const createFieldDeleteAnimation = (target: gsap.TweenTarget, onComplete?: () => void) => {
  return gsap.to(target, {
    scale: 0.92,
    opacity: 0,
    duration: 0.15,
    ease: 'power2.in',
    onComplete,
  });
};

export const createStaggeredTextReveal = (target: gsap.TweenTarget, options?: {
  stagger?: number;
  duration?: number;
  ease?: string;
}) => {
  return gsap.from(target, {
    y: 24,
    opacity: 0,
    duration: options?.duration ?? 0.4,
    ease: options?.ease ?? 'power2.out',
    stagger: options?.stagger ?? 0.06,
  });
};

export const createPulseLoop = (target: gsap.TweenTarget) => {
  return gsap.to(target, {
    scale: 1.02,
    duration: 1.2,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });
};
