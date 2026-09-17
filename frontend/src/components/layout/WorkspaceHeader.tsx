import { forwardRef, HTMLAttributes, ReactNode, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';

export interface WorkspaceHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export const WorkspaceHeader = forwardRef<HTMLElement, WorkspaceHeaderProps>(
  function WorkspaceHeader({ title, subtitle, className = '' }, ref) {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    useGSAP(() => {
      const ctx = gsap.context(() => {
        if (titleRef.current) {
          gsap.from(titleRef.current, {
            y: 20,
            opacity: 0,
            duration: effective(0.5),
            ease: 'power2.out',
          });
        }
        if (subtitleRef.current) {
          gsap.from(subtitleRef.current, {
            y: 16,
            opacity: 0,
            duration: effective(0.4),
            ease: 'power2.out',
            delay: 0.1,
          });
        }
      }, ref as React.RefObject<HTMLElement>);

      return () => ctx.revert();
    }, [reduceMotion, effective]);

    return (
      <header
        ref={ref}
        className={`workspace-header ${className}`}
        aria-label="Workspace header"
      >
        <h1 ref={titleRef} className="workspace-header__title">
          {title}
        </h1>
        {subtitle && (
          <p ref={subtitleRef} className="workspace-header__subtitle">
            {subtitle}
          </p>
        )}
      </header>
    );
  }
);

WorkspaceHeader.displayName = 'WorkspaceHeader';
