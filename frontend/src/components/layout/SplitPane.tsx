import {
  forwardRef,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { STORAGE_KEY, DEFAULT_SPLIT, MIN_PANE_WIDTH, MAX_PANE_PERCENT } from '@/lib/constants';

export interface SplitPaneProps {
  leftPane: ReactNode;
  rightPane: ReactNode;
  initialWidth?: number;
  minPaneWidth?: number;
  maxPaneWidth?: number;
  className?: string;
}

export const SplitPane = forwardRef<HTMLDivElement, SplitPaneProps>(
  function SplitPane(
    {
      leftPane,
      rightPane,
      initialWidth = DEFAULT_SPLIT,
      minPaneWidth: _minPaneWidth = MIN_PANE_WIDTH,
      maxPaneWidth = MAX_PANE_PERCENT,
      className = '',
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = useState(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? Number(saved) : initialWidth;
    });
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { reduceMotion, effective } = useGSAPAnimation();

    useEffect(() => {
      const checkMobile = () => {
        const match = window.matchMedia('(max-width: 767px)');
        setIsMobile(match.matches);
      };
      checkMobile();
      const mediaQuery = window.matchMedia('(max-width: 767px)');
      mediaQuery.addEventListener('change', checkMobile);
      return () => mediaQuery.removeEventListener('change', checkMobile);
    }, []);

    useGSAP(() => {
      if (!containerRef.current || reduceMotion) return;
      const ctx = gsap.context(() => {}, containerRef);
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 24,
        duration: effective(0.5),
        ease: 'power2.out',
      });
      return () => ctx.revert();
    }, []);

    const handleMouseDown = useCallback(
      (e: React.MouseEvent) => {
        if (isMobile) return;
        e.preventDefault();
        setIsDragging(true);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      },
      [isMobile]
    );

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      e.preventDefault();
    }, []);

    useEffect(() => {
      if (!containerRef.current) return;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - rect.left;
    const percent = Math.min(
      Math.max((deltaX / rect.width) * 100, 15),
      maxPaneWidth
    );
        setLeftWidth(percent);
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }, [isDragging, reduceMotion, effective, maxPaneWidth]);

    useEffect(() => {
      localStorage.setItem(STORAGE_KEY, String(leftWidth));
    }, [leftWidth]);

    useEffect(() => {
      const handleKeyResize = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isDragging) {
          setIsDragging(false);
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
        }
      };
      if (isDragging) {
        document.addEventListener('keydown', handleKeyResize);
      }
      return () => document.removeEventListener('keydown', handleKeyResize);
    }, [isDragging]);

    if (isMobile) {
      return (
        <div
          ref={ref ?? containerRef}
          className={`split-pane split-pane--stacked ${className}`}
        >
          <aside className="split-pane__left" aria-label="Document workspace">
            {leftPane}
          </aside>
          <aside className="split-pane__right" aria-label="Form preview workspace">
            {rightPane}
          </aside>
        </div>
      );
    }

    return (
      <div
        ref={ref ?? containerRef}
        className={`split-pane ${isDragging ? 'split-pane--dragging' : ''} ${className}`}
        aria-label="Split-pane workspace"
      >
        <aside
          className="split-pane__left"
          style={{ width: `${leftWidth}%` }}
          aria-label="Document workspace"
        >
          {leftPane}
        </aside>

        <div
          ref={dividerRef}
          className={`split-pane__divider ${isDragging ? 'split-pane__divider--active' : ''}`}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panes"
          onClick={handleMouseDown}
          onTouchStart={handleTouchStart}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
            }
          }}
        />

        <aside
          className="split-pane__right"
          style={{ width: `${100 - leftWidth}%` }}
          aria-label="Form preview workspace"
        >
          {rightPane}
        </aside>
      </div>
    );
  }
);

SplitPane.displayName = 'SplitPane';
