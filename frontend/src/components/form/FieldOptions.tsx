import {
  forwardRef,
  useRef,
} from 'react';
import { Trash2, Plus } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';

export interface OptionInputProps {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
  className?: string;
}

const OptionInput = forwardRef<HTMLInputElement, OptionInputProps>(
  function OptionInput(
    { value, index, onChange, onRemove, canRemove, className = '' },
    _inputRef
  ) {
    const rowRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    useGSAP(() => {
      if (!rowRef.current || reduceMotion) return;
      const ctx = gsap.context(() => {}, rowRef);
      gsap.from(rowRef.current, {
        x: 16,
        opacity: 0,
        duration: effective(0.25),
        ease: 'power2.out',
        delay: index * effective(0.04),
      });
      return () => ctx.revert();
    }, [index, reduceMotion, effective]);

    const handleRemove = () => {
      const row = rowRef.current;
      if (row && !reduceMotion) {
        gsap.to(row, {
          x: -20,
          opacity: 0,
          scale: 0.95,
          duration: effective(0.15),
          ease: 'power2.in',
          onComplete: () => onRemove(index),
        });
      } else {
        onRemove(index);
      }
    };

    return (
      <div ref={rowRef} className="option-input flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(index, e.target.value)}
          className={`option-input__field flex-1 ${className}`}
          placeholder={`Option ${index + 1}`}
          aria-label={`Option ${index + 1}`}
          onFocus={() => {
            if (!inputRef.current || reduceMotion) return;
            gsap.to(inputRef.current, {
              boxShadow: '0 0 0 2px rgba(66, 133, 244, 0.3)',
              duration: effective(0.14),
              ease: 'power2.out',
            });
          }}
          onBlur={() => {
            if (!inputRef.current || reduceMotion) return;
            gsap.to(inputRef.current, {
              boxShadow: '0 0 0 1px rgba(60, 64, 67, 0.23)',
              duration: effective(0.14),
              ease: 'power2.out',
            });
          }}
        />
        {canRemove && (
          <button
            type="button"
            onClick={handleRemove}
            className="option-input__remove text-red-500 hover:bg-red-50 rounded p-1"
            aria-label={`Remove option ${index + 1}`}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    );
  }
);

OptionInput.displayName = 'OptionInput';

export interface FieldOptionsProps {
  options: string[];
  onChange: (options: string[]) => void;
  allowRemove?: boolean;
  className?: string;
}

export const FieldOptions = forwardRef<HTMLDivElement, FieldOptionsProps>(
  function FieldOptions({ options, onChange, allowRemove = true, className = '' }, ref) {
    const handleOptionChange = (idx: number, val: string) => {
      const newOptions = [...options];
      newOptions[idx] = val;
      onChange(newOptions);
    };

    const handleRemove = (idx: number) => {
      const newOptions = options.filter((_, i) => i !== idx);
      onChange(newOptions);
    };

    const handleAddOption = () => {
      const newOptions = [...options, ''];
      onChange(newOptions);
    };

    return (
      <div
        ref={ref}
        className={`field-options ${className}`}
        aria-label="Question options"
      >
        {options.map((option, idx) => (
          <OptionInput
            key={`${idx}`}
            value={option}
            index={idx}
            onChange={handleOptionChange}
            onRemove={handleRemove}
            canRemove={allowRemove && options.length > 1}
          />
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="field-options__add btn btn--ghost btn--sm"
          aria-label="Add option"
          disabled={options.length >= 10}
        >
          <Plus size={14} />
          <span>Add Option</span>
        </button>
      </div>
    );
  }
);

FieldOptions.displayName = 'FieldOptions';