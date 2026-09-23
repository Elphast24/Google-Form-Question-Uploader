import { forwardRef, useRef } from 'react';
import gsap from 'gsap';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';

export interface FormTitleFieldProps {
  title: string;
  onTitleChange: (_title: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const FormTitleField = forwardRef<HTMLInputElement, FormTitleFieldProps>(
  function FormTitleField(
    { title, onTitleChange, placeholder = 'Form title…', disabled, className = '' },
    ref
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    return (
      <div className="form-title-field">
        <label htmlFor="form-title-input" className="form-title-field__label">
          Form Title
        </label>
        <input
          ref={ref ?? inputRef}
          id="form-title-input"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className={`form-title-field__input ${className}`}
          aria-label="Form title"
          onFocus={() => {
            if (!inputRef.current || reduceMotion) return;
            gsap.to(inputRef.current, {
              scale: 1.01,
              duration: effective(0.14),
              ease: 'power2.out',
              boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.2)',
            });
          }}
          onBlur={() => {
            if (!inputRef.current || reduceMotion) return;
            gsap.to(inputRef.current, {
              scale: 1,
              duration: effective(0.14),
              ease: 'power2.out',
              boxShadow: '0 0 0 2px rgba(60, 64, 67, 0.12)',
            });
          }}
        />
      </div>
    );
  }
);

FormTitleField.displayName = 'FormTitleField';
