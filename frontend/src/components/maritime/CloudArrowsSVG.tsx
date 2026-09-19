import React, { SVGProps } from 'react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';

interface CloudArrowsSVGProps extends SVGProps<SVGSVGElement> {
  size?: number;
  strokeColor?: string;
  arrowColor?: string;
  animate?: boolean;
}

const CloudArrowsSVG: React.FC<CloudArrowsSVGProps> = ({
  size = 240,
  strokeColor = '#0F3560',
  arrowColor = '#F15A29',
  animate = true,
  ...props
}) => {
  const { reduceMotion } = useGSAPAnimation();
  const scaledHeight = Math.round(size * 0.583);

  return (
    <svg
      width={size}
      height={scaledHeight}
      viewBox="0 0 240 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={animate && !reduceMotion ? 'hero-cloud' : undefined}
      {...props}
    >
      <defs>
        <path id="checkmark-big" d="M30,70 L70,110 L160,50 L154,44 L70,98 Z" />
        <path id="checkmark-small" d="M75,35 L98,58 L128,32 L123,27 Z" />
        <filter id="cloud-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.18" />
        </filter>
      </defs>

      <path
        className="cloud-outline"
        d="M45,70 C30,65 20,45 30,28 C42,10 68,3 88,25 C103,8 125,8 140,25 C160,8 185,10 198,30 C215,50 205,75 190,85 L55,85 C45,85 38,80 40,70 C42,70 45,70 45,70 Z"
        fill="none"
        stroke={strokeColor}
        strokeWidth="6"
        strokeLinejoin="round"
        filter="url(#cloud-shadow)"
      />

      <path
        className="arrow-up"
        d="M85,25 L68,58 L82,58 L82,100 L96,100 L96,58 L110,58 Z"
        fill={arrowColor}
      />

      <path
        className="arrow-down"
        d="M145,105 L128,72 L142,72 L142,30 L156,30 L156,72 L170,72 Z"
        fill={arrowColor}
      />
    </svg>
  );
};

CloudArrowsSVG.displayName = 'CloudArrowsSVG';

export default CloudArrowsSVG;
