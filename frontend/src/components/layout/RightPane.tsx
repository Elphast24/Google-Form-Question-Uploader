import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

export interface RightPaneProps extends HTMLAttributes<HTMLElement> {
  parsingStage: 'idle' | 'uploading' | 'parsing' | 'ready' | 'error';
  children: ReactNode;
}

export const RightPane = forwardRef<HTMLElement, RightPaneProps>(
  function RightPane({ parsingStage, children, className = '', ...rest }, ref) {
    return (
      <aside
        ref={ref}
        className={`workspace-pane workspace-pane--right ${className}`}
        aria-label="Form preview workspace"
        data-state={parsingStage}
        {...rest}
      >
        {children}
      </aside>
    );
  }
);

RightPane.displayName = 'RightPane';
