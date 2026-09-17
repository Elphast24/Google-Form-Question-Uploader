import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export interface SpinnerProps {
  size?: number;
  label?: string;
}

export const Spinner = ({ size = 32, label = 'Loading…' }: SpinnerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  useGSAP(() => {
    if (!arcRef.current) return;

    const ctx = gsap.context(() => {}, containerRef);
    const radius = 14;
    const circumference = 2 * Math.PI * radius;

    gsap.set(arcRef.current, {
      strokeDasharray: circumference,
      strokeDashoffset: circumference,
    });

    gsap.to(arcRef.current, {
      strokeDashoffset: 0,
      rotation: 360,
      duration: 1.8,
      ease: 'none',
      repeat: -1,
    });

    return () => ctx.revert();
  }, []);

  const viewBoxSize = 36;
  const radius = 14;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-label={label}
      className="spinner-container flex flex-col items-center justify-center gap-2"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        fill="none"
        className="spinner-svg"
      >
        <circle
          ref={arcRef}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          strokeWidth="3"
          stroke="currentColor"
          strokeLinecap="round"
          className="spinner-arc"
          style={{ color: 'var(--color-primary)' }}
        />
      </svg>
      {label && <span className="spinner-label text-xs text-gray-500">{label}</span>}
    </div>
  );
};

Spinner.displayName = 'Spinner';
