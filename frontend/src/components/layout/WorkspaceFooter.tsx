import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export interface WorkspaceFooterProps extends HTMLAttributes<HTMLElement> {
  actions: ReactNode;
}

export const WorkspaceFooter = forwardRef<HTMLElement, WorkspaceFooterProps>(
  function WorkspaceFooter({ actions, className = '', ...rest }, ref) {
    useGSAP(() => {
      const ctx = gsap.context(() => {}, ref as React.RefObject<HTMLElement>);
      if (ref && 'current' in ref && ref.current) {
        gsap.from(ref.current, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
      return () => ctx.revert();
    });

    return (
      <footer
        ref={ref}
        className={`workspace-footer ${className}`}
        aria-label="Workspace actions"
        {...rest}
      >
        <div className="workspace-footer__actions flex items-center gap-3 justify-center">
          {actions}
        </div>
      </footer>
    );
  }
);

WorkspaceFooter.displayName = 'WorkspaceFooter';
