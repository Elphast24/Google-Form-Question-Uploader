import { forwardRef, useRef } from 'react';
import gsap from 'gsap';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import type { QuestionType } from '@/types/form';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/types/form';

export interface FieldTypeSelectProps {
  id?: string;
  value: QuestionType;
  onChange: (value: QuestionType) => void;
  className?: string;
  disabled?: boolean;
}

const QUESTION_TYPE_OPTIONS: { value: QuestionType; label: string }[] =
  QUESTION_TYPES.map((type) => ({
    value: type,
    label: QUESTION_TYPE_LABELS[type],
  }));

export const FieldTypeSelect = forwardRef<HTMLSelectElement, FieldTypeSelectProps>(
  function FieldTypeSelect({ id, value, onChange, className = '', disabled, ...rest }, ref) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    const handleFocus = () => {
      if (!selectRef.current || reduceMotion) return;
      gsap.to(selectRef.current, {
        scale: 1.01,
        duration: effective(0.14),
        ease: 'power2.out',
        boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.2)',
      });
    };

    const handleBlur = () => {
      if (!selectRef.current || reduceMotion) return;
      gsap.to(selectRef.current, {
        scale: 1,
        duration: effective(0.14),
        ease: 'power2.out',
        boxShadow: 'none',
      });
    };

    return (
      <select
        ref={ref ?? selectRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as QuestionType)}
        className={`field-type-select ${className}`}
        disabled={disabled}
        aria-label="Question type"
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        {QUESTION_TYPE_OPTIONS.map(({ value: typeValue, label }) => (
          <option key={typeValue} value={typeValue}>
            {label}
          </option>
        ))}
      </select>
    );
  }
);

FieldTypeSelect.displayName = 'FieldTypeSelect';
