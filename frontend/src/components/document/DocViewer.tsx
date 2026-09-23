import { forwardRef, HTMLAttributes, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { sanitizeHtml } from '@/lib/sanitization';

export interface DocViewerProps extends HTMLAttributes<HTMLDivElement> {
  fileName: string;
  content: string;
  isLoading?: boolean;
}

export const DocViewer = forwardRef<HTMLDivElement, DocViewerProps>(
   function DocViewer({ fileName, content, isLoading = false, className = '', ...rest }, _ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    const paragraphs = (content || '')
      .split('\n')
      .filter((line) => line.trim().length > 0);

    useGSAP(() => {
      const el = containerRef.current;
      if (!el || reduceMotion) return;
      const ctx = gsap.context(() => {}, el);
      const lines = el.querySelectorAll('.doc-line');
      if (lines.length > 0) {
        gsap.from(lines, {
          y: 16,
          opacity: 0,
          duration: effective(0.3),
          ease: 'power2.out',
          stagger: effective(0.05),
        });
      }
      return () => ctx.revert();
    }, [reduceMotion, effective, content]);

    return (
      <div
        ref={containerRef}
        className={`doc-viewer ${className}`}
        aria-label={`Document viewer: ${fileName}`}
        {...rest}
      >
        <header className="doc-viewer__header">
          <h2 className="doc-viewer__title">{fileName}</h2>
        </header>
        <div className="doc-viewer__content">
          {isLoading ? (
            <div className="doc-viewer__loading" aria-live="polite">
              Loading document content…
            </div>
          ) : paragraphs.length === 0 ? (
            <p className="doc-viewer__empty" aria-live="polite">
              No extractable text content found in this document.
            </p>
          ) : (
            paragraphs.map((paragraph, i) => (
              <p key={i} className="doc-line" data-line-index={i}>
                {sanitizeHtml(paragraph)}
              </p>
            ))
          )}
        </div>
      </div>
    );
  }
);

DocViewer.displayName = 'DocViewer';
