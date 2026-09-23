import {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  useRef,
  useState,
} from 'react';
import { Upload } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import { VALID_FILE_TYPES, MAX_FILE_SIZE } from '@/hooks/useFileUpload';
import type { ParsingStage } from '@/types/form';

export interface DropZoneProps extends HTMLAttributes<HTMLDivElement> {
  file: File | null;
  parsingStage: ParsingStage;
  disabled?: boolean;
  onDropFile: (file: File) => void;
  onRemoveFile: () => void;
  dragActive: boolean;
  setDragActive: (active: boolean) => void;
}

export const DropZone = forwardRef<HTMLDivElement, DropZoneProps>(
  function DropZone(
    {
      file,
      parsingStage,
      disabled = false,
      onDropFile,
      onRemoveFile,
      dragActive,
      setDragActive,
       className = '',
       ...rest
     },
      _ref
    ) {
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const iconRef = useRef<HTMLSpanElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    const [focused, setFocused] = useState(false);

    const validateFile = (selectedFile: File): string | null => {
      if (!VALID_FILE_TYPES.has(selectedFile.type)) {
        return 'Please upload only DOCX or TXT files';
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        return 'File size must be less than 10MB';
      }
      return null;
    };

    const handleFile = (selectedFile: File) => {
      const error = validateFile(selectedFile);
      if (error) {
        const event = new CustomEvent('upload-error', { detail: error });
        window.dispatchEvent(event);
        return;
      }
      onDropFile(selectedFile);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (disabled) return;
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setDragActive(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    };

    const handleClick = () => {
      if (!disabled && !file && inputRef.current) {
        inputRef.current.click();
      }
    };

    useGSAP(() => {
      const ctx = gsap.context(() => {}, dropZoneRef);
      if (!reduceMotion) {
        gsap.from(dropZoneRef.current, {
          y: 16,
          opacity: 0,
          duration: effective(0.4),
          ease: 'power2.out',
        });
      }
      return () => ctx.revert();
    }, [reduceMotion, effective]);

    const tween = (target: Element | null, vars: gsap.TweenVars) => {
      if (!target || disabled || reduceMotion) return;
      gsap.to(target, vars);
    };

    const handleMouseEnter = () => {
      tween(iconRef.current, {
        scale: 1.05,
        duration: effective(0.12),
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      tween(iconRef.current, {
        scale: 1,
        duration: effective(0.12),
        ease: 'power2.out',
      });
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemoveFile();
    };

    const isInteractive = !disabled && parsingStage !== 'parsing';
    const showUpload = !file && parsingStage !== 'parsing';
    const showFile = !!file && parsingStage !== 'parsing';

    return (
      <div
        ref={dropZoneRef}
        className={[
          'dropzone',
          dragActive ? 'dropzone--drag' : '',
          disabled ? 'dropzone--disabled' : '',
          focused ? 'dropzone--focused' : '',
          showUpload ? 'dropzone--empty' : '',
          showFile ? 'dropzone--filled' : '',
          className,
        ].join(' ')}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={handleClick}
        role="button"
        tabIndex={isInteractive ? 0 : -1}
        aria-label={file ? `${file.name}, click to remove` : 'Upload document (DOCX or TXT)'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        {...rest}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".docx,.txt,text/plain"
          onChange={handleChange}
          disabled={disabled}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        {showUpload && (
          <div
            className="dropzone__content"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span ref={iconRef} className="dropzone__icon" aria-hidden="true">
              <Upload size={40} />
            </span>
            <h3 className="dropzone__title">Upload your file</h3>
            <p className="dropzone__text">
              Drag and drop your DOCX or TXT file here, or click to browse
            </p>
            <p className="dropzone__hint">Maximum file size: 10MB</p>
          </div>
        )}

        {showFile && file && (
          <div className="dropzone__file">
            <span
              ref={iconRef}
              className="dropzone__icon"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-hidden="true"
            >
              <Upload size={40} />
            </span>
            <div className="dropzone__file-info">
              <span
                className="dropzone__file-name"
                title={file.name}
              >
                {file.name}
              </span>
              <span className="dropzone__file-size">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
            <button
              type="button"
              className="dropzone__remove"
              onClick={handleRemove}
              disabled={disabled}
              aria-label={`Remove ${file.name}`}
            >
              ×
            </button>
          </div>
        )}
      </div>
    );
  }
);

DropZone.displayName = 'DropZone';
