import { forwardRef, HTMLAttributes } from 'react';
import { sanitizeHtml } from '@/lib/sanitization';

export interface DocContentProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  contentType?: 'text' | 'html';
}

export const DocContent = forwardRef<HTMLDivElement, DocContentProps>(
  function DocContent({ content, contentType = 'text', className = '', ...rest }, ref) {
    const safeContent =
      contentType === 'html' ? sanitizeHtml(content) : sanitizeHtml(content);

    return (
      <div
        ref={ref}
        className={`doc-content ${className}`}
        aria-live="polite"
        {...rest}
      >
        {safeContent
          ? safeContent.split('\n').map((line, i) => (
              <p key={i} className="doc-content__line">
                {line}
              </p>
            ))
          : null}
      </div>
    );
  }
);

DocContent.displayName = 'DocContent';
