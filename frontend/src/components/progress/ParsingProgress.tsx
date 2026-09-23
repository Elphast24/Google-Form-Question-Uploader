import {
  forwardRef,
  useRef,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { MilestoneItem } from './MilestoneItem';
import { DURATION, EASING } from '@/lib/motion/tokens';

export interface ParsingProgressProps {
  milestones: string[];
  activeIndex: number;
  status: 'idle' | 'in-progress' | 'complete' | 'error';
}

export const ParsingProgress = forwardRef<HTMLDivElement, ParsingProgressProps>(
  function ParsingProgress({ milestones, activeIndex, status }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement[]>([]);
    const { reduceMotion, effective } = useGSAPAnimation();

    useGSAP(() => {
      if (!containerRef.current || reduceMotion) return;

      const ctx = gsap.context(() => {}, containerRef);
      const tl = gsap.timeline({ defaults: { ease: EASING.power2Out } });

      milestones.forEach((_, i) => {
        tl.from(itemsRef.current[i], {
          y: 24,
          opacity: 0,
          duration: effective(DURATION.parsingMilestone / 1000),
          ease: EASING.power2Out,
        }, i === 0 ? 0 : `+=${effective(0.12)}`);
      });

      if (status === 'complete') {
        tl.to(containerRef.current, {
          opacity: 0,
          y: -10,
          duration: effective(0.2),
          ease: 'power2.in',
        }, '+=0.3');
      }

      return () => {
        tl.kill();
        ctx.revert();
      };
    }, [milestones, activeIndex, status, reduceMotion, effective]);

    return (
      <div
        ref={ref ?? containerRef}
        className="parsing-progress"
        aria-label="Document parsing progress"
        aria-live="polite"
      >
        <div className="parsing-progress__header">
          <span className="parsing-progress__status">
            {status === 'complete' ? 'Ready!' : 'Processing document…'}
          </span>
        </div>

        <div className="parsing-progress__list">
          {milestones.map((label, i) => {
            const isActive = i === activeIndex && status === 'in-progress';
            const isComplete = i < activeIndex || status === 'complete';

            return (
              <MilestoneItem
                key={label}
                ref={(el) => {
                  itemsRef.current[i] = el as HTMLDivElement;
                }}
                label={label}
                isActive={isActive}
                isComplete={isComplete}
                index={i}
                className={isActive ? 'milestone-item--active' : ''}
              />
            );
          })}
        </div>

        <div className="parsing-progress__bar">
          <div
            className="parsing-progress__fill"
            style={{
              width: status === 'complete' ? '100%' : `${((activeIndex + 1) / milestones.length) * 100}%`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }
);

ParsingProgress.displayName = 'ParsingProgress';
