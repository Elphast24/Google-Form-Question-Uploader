import {
  forwardRef,
  useRef,
  ChangeEvent,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import type { Question, QuestionType } from '@/types/form';
import { TYPES_REQUIRING_OPTIONS, QUESTION_TYPE_LABELS } from '@/types/form';
import { FieldControls } from './FieldControls';
import { FieldTypeSelect } from './FieldTypeSelect';
import { FieldOptions } from './FieldOptions';

export interface FormFieldItemProps {
  question: Question;
  index: number;
  total: number;
  onUpdate: (_patch: Partial<Question>) => void;
  onDelete: () => void;
  className?: string;
}

export const FormFieldItem = forwardRef<HTMLDivElement, FormFieldItemProps>(
  function FormFieldItem(
    { question, index, total, onUpdate, onDelete, className = '' },
    ref
  ) {
    const itemRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLTextAreaElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    useGSAP(() => {
      if (!itemRef.current || reduceMotion) return;
      gsap.from(itemRef.current, {
        y: 24,
        opacity: 0,
        scale: 0.97,
        duration: effective(0.35),
        ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        delay: index * effective(0.04),
      });
    }, { scope: itemRef, dependencies: [index, reduceMotion, effective, question.id] });

    const handleTextFocus = () => {
      if (!textRef.current || reduceMotion) return;
      gsap.to(textRef.current, {
        boxShadow: '0 0 0 3px rgba(66, 133, 244, 0.2)',
        duration: effective(0.14),
        ease: 'power2.out',
      });
    };

    const handleTextBlur = () => {
      if (!textRef.current || reduceMotion) return;
      gsap.to(textRef.current, {
        boxShadow: '0 0 0 2px rgba(60, 64, 67, 0.12)',
        duration: effective(0.14),
        ease: 'power2.out',
      });
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      onUpdate({ question_text: e.target.value });
    };

    const handleTypeChange = (newType: QuestionType) => {
      const needsOptions = TYPES_REQUIRING_OPTIONS.includes(newType);
      const wasNeedingOptions = TYPES_REQUIRING_OPTIONS.includes(question.question_type);
      const patch: Partial<Question> = { question_type: newType };
      if (needsOptions && !wasNeedingOptions) {
        patch.options = ['', ''];
      } else if (!needsOptions && question.options.length > 0) {
        patch.options = [];
      }
      if (newType === 'LINEAR_SCALE' && !question.scale_min) {
        patch.scale_min = 1;
        patch.scale_max = 5;
      }
      onUpdate(patch);
    };

    const handleRequiredChange = (e: ChangeEvent<HTMLInputElement>) => {
      onUpdate({ required: e.target.checked });
    };

    const handleOptionsChange = (options: string[]) => {
      onUpdate({ options });
    };

    const handleScaleChange = (field: 'scale_min' | 'scale_max', value: number) => {
      onUpdate({ [field]: value });
    };

    const needsOptions = TYPES_REQUIRING_OPTIONS.includes(question.question_type);
    const isScale = question.question_type === 'LINEAR_SCALE';

    return (
      <div
        ref={ref ?? itemRef}
        className={`form-field-item ${className}`}
        data-field-id={question.id}
        aria-label={`Question ${index + 1}: ${QUESTION_TYPE_LABELS[question.question_type]}`}
      >
        <header className="form-field-item__header">
          <FieldControls
            index={index}
            total={total}
            onDelete={onDelete}
          />
        </header>

        <div className="form-field-item__body">
          <div className="form-field-item__group">
            <label
              htmlFor={`question-text-${question.id}`}
              className="form-field-item__label"
            >
              Question Text *
            </label>
            <textarea
              ref={textRef}
              id={`question-text-${question.id}`}
              value={question.question_text}
              onChange={handleTextChange}
              onFocus={handleTextFocus}
              onBlur={handleTextBlur}
              className="form-field-item__input"
              placeholder="Enter your question"
              rows={3}
              aria-label={`Question text for question ${index + 1}`}
            />
          </div>

          <div className="form-field-item__row">
            <div className="form-field-item__group">
              <label
                htmlFor={`question-type-${question.id}`}
                className="form-field-item__label"
              >
                Question Type *
              </label>
              <FieldTypeSelect
                id={`question-type-${question.id}`}
                value={question.question_type}
                onChange={handleTypeChange}
              />
            </div>

            <div className="form-field-item__group">
              <label className="form-field-item__checkbox-label flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={question.required || false}
                  onChange={handleRequiredChange}
                  className="form-field-item__checkbox"
                  aria-label="Mark this question as required"
                />
                <span>This question is required</span>
              </label>
            </div>
          </div>

          {needsOptions && (
            <div className="form-field-item__group">
              <label className="form-field-item__label">Options</label>
              <FieldOptions
                options={question.options.length >= 2 ? question.options : ['', '']}
                onChange={handleOptionsChange}
              />
            </div>
          )}

          {isScale && (
            <div className="form-field-item__row">
              <div className="form-field-item__group">
                <label
                  htmlFor={`scale-min-${question.id}`}
                  className="form-field-item__label"
                >
                  Minimum Value
                </label>
                <input
                  id={`scale-min-${question.id}`}
                  type="number"
                  value={question.scale_min ?? 1}
                  onChange={(e) =>
                    handleScaleChange('scale_min', parseInt(e.target.value, 10))
                  }
                  className="form-field-item__input"
                  min={0}
                  max={10}
                  aria-label="Minimum scale value"
                />
              </div>
              <div className="form-field-item__group">
                <label
                  htmlFor={`scale-max-${question.id}`}
                  className="form-field-item__label"
                >
                  Maximum Value
                </label>
                <input
                  id={`scale-max-${question.id}`}
                  type="number"
                  value={question.scale_max ?? 5}
                  onChange={(e) =>
                    handleScaleChange('scale_max', parseInt(e.target.value, 10))
                  }
                  className="form-field-item__input"
                  min={0}
                  max={10}
                  aria-label="Maximum scale value"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

FormFieldItem.displayName = 'FormFieldItem';
