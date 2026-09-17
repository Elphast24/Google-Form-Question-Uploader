import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';

export interface UploadControlsProps extends ButtonHTMLAttributes<HTMLDivElement> {
  onGenerate: () => void;
  onRemove: () => void;
  canGenerate: boolean;
  generating: boolean;
  hasFile: boolean;
  primaryLabel?: string;
  onSecondaryClick?: () => void;
  secondaryLabel?: string;
}

export const UploadControls = forwardRef<HTMLDivElement, UploadControlsProps>(
  function UploadControls(
    {
      onGenerate,
      onRemove,
      canGenerate,
      generating,
      hasFile,
      primaryLabel = 'Generate Form',
      secondaryLabel = 'Clear',
      onSecondaryClick,
      className = '',
      ...rest
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={`upload-controls ${className} flex items-center gap-3`}
        role="group"
        aria-label="Upload controls"
        {...rest}
      >
        {hasFile && (
          <button
            type="button"
            onClick={onRemove}
            className="btn btn--ghost btn--sm"
            aria-label="Remove file"
            disabled={generating}
          >
            <Trash2 size={16} />
            <span>Clear</span>
          </button>
        )}

        <button
          type="button"
          onClick={onGenerate}
          disabled={!canGenerate || generating}
          className="btn btn--primary btn--lg"
          aria-label={generating ? 'Generating form...' : primaryLabel}
        >
          {generating ? (
            <span className="spinner" aria-hidden="true" />
          ) : (
            <Sparkles size={20} />
          )}
          <span>{generating ? 'Processing…' : primaryLabel}</span>
        </button>

        {onSecondaryClick && secondaryLabel && (
          <button
            type="button"
            onClick={onSecondaryClick}
            className="btn btn--secondary btn--sm"
            disabled={generating}
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    );
  }
);

UploadControls.displayName = 'UploadControls';
