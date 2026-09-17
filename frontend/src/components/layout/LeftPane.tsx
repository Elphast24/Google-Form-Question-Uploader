import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';
import type { ParsingStage } from '@/types/form';

export interface LeftPaneProps extends HTMLAttributes<HTMLElement> {
  file: File | null;
  parsingStage: ParsingStage;
  children: ReactNode;
}

export const LeftPane = forwardRef<HTMLElement, LeftPaneProps>(
  function LeftPane({ file, parsingStage, children, className = '', ...rest }, ref) {
    return (
      <aside
        ref={ref}
        className={`workspace-pane workspace-pane--left ${className}`}
        aria-label="Document input workspace"
        data-state={file ? 'filled' : parsingStage === 'parsing' ? 'parsing' : 'empty'}
        {...rest}
      >
        {children}
      </aside>
    );
  }
);

LeftPane.displayName = 'LeftPane';
