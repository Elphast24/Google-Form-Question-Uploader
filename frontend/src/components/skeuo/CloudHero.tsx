import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';

gsap.registerPlugin(MorphSVGPlugin);

const CloudHero: React.FC = () => {
  const cloudRef = useRef<SVGPathElement>(null);
  const arrowUpRef = useRef<SVGPathElement>(null);
  const arrowDownRef = useRef<SVGPathElement>(null);
  const { reduceMotion } = useGSAPAnimation();

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      if (!arrowUpRef.current || !arrowDownRef.current) return;

      const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      arrowTl.to(arrowUpRef.current, {
        morphSVG: '#doc-shape',
        duration: 1.2,
        ease: 'power2.inOut',
      });
      arrowTl.to(arrowDownRef.current, {
        morphSVG: '#form-shape',
        duration: 1.2,
        ease: 'power2.inOut',
      }, '<0.2');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arrowTl.to(arrowUpRef.current as any, {
        morphSVG: '#arrow-up-orig',
        duration: 1.2,
        ease: 'power2.inOut',
      }, '+=1.5');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arrowTl.to(arrowDownRef.current as any, {
        morphSVG: '#arrow-down-orig',
        duration: 1.2,
        ease: 'power2.inOut',
      }, '+=1.5');
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div className="cloud-hero-wrap">
      <div className="cloud-hero-glow" />
      <svg
        className="cloud-hero-svg"
        viewBox="0 0 800 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <path id="arrow-up-orig" d="M400,340 L340,420 L380,420 L380,520 L420,520 L420,420 L460,420 Z" />
          <path id="arrow-down-orig" d="M400,560 L340,480 L380,480 L380,380 L420,380 L420,480 L460,480 Z" />
          <path id="doc-shape" d="M340,340 L460,340 L460,520 L340,520 Z M360,380 L440,380 M360,420 L440,420 M360,460 L420,460" />
          <path id="form-shape" d="M340,380 L460,380 L460,560 L340,560 Z M360,420 L400,420 M360,460 L440,460 M360,500 L420,500" />

          <linearGradient id="orange-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5C978" />
            <stop offset="100%" stopColor="#D97F1E" />
          </linearGradient>
          <linearGradient id="navy-metal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3A5A9F" />
            <stop offset="100%" stopColor="#0F1F42" />
          </linearGradient>

          <filter id="cloud-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.18" />
          </filter>
        </defs>

        <path
          ref={cloudRef}
          className="cloud-outline"
          d="M200,320 C180,260 260,200 340,220 C360,160 460,160 500,220 C580,210 640,270 620,340 C640,380 620,440 560,440 L240,440 C180,440 160,380 200,320 Z"
          fill="none"
          stroke="url(#orange-metal)"
          strokeWidth="14"
          strokeLinejoin="round"
          filter="url(#cloud-shadow)"
        />

        <path ref={arrowUpRef} className="arrow-up" fill="url(#navy-metal)" />
        <path ref={arrowDownRef} className="arrow-down" fill="url(#navy-metal)" />
      </svg>
    </div>
  );
};

CloudHero.displayName = 'CloudHero';

export default CloudHero;
