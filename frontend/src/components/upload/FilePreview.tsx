import { forwardRef, HTMLAttributes } from 'react';
import { FileText } from 'lucide-react';
import { sanitizeParsedText } from '@/lib/sanitization';

export interface FilePreviewProps extends HTMLAttributes<HTMLDivElement> {
  fileName: string;
  fileSize: number;
  fileType: string;
}

export const FilePreview = forwardRef<HTMLDivElement, FilePreviewProps>(
  function FilePreview({ fileName, fileSize, fileType, className = '', ...rest }, ref) {
    const displayName = sanitizeParsedText(fileName);
    const sizeKB = (fileSize / 1024).toFixed(1);

    return (
      <div
        ref={ref}
        className={`file-preview ${className}`}
        aria-label={`File preview: ${displayName}`}
        {...rest}
      >
        <div className="file-preview__icon" aria-hidden="true">
          <FileText size={32} />
        </div>
        <div className="file-preview__details">
          <span className="file-preview__name" title={displayName}>
            {displayName}
          </span>
          <span className="file-preview__meta">
            {sizeKB} KB · {sanitizeParsedText(fileType)}
          </span>
        </div>
      </div>
    );
  }
);

FilePreview.displayName = 'FilePreview';
