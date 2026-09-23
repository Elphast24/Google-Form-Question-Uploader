import {
  forwardRef,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Plus } from 'lucide-react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import type { Question } from '@/types/form';
import { FormTitleField } from './FormTitleField';
import { FormFieldItem } from './FormFieldItem';

export interface FormPreviewProps {
  title: string;
  questions: Question[];
  onTitleChange: (_title: string) => void;
  onUpdateQuestion: (_id: string, _patch: Partial<Question>) => void;
  onDeleteQuestion: (_id: string) => void;
  onAddQuestion: () => void;
  className?: string;
}

export const FormPreview = forwardRef<HTMLDivElement, FormPreviewProps>(
  function FormPreview(
    {
      title,
      questions,
      onTitleChange,
      onUpdateQuestion,
      onDeleteQuestion,
      onAddQuestion,
      className = '',
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    const [showAddSuccess, setShowAddSuccess] = useState(false);

    const handleAddQuestion = () => {
      onAddQuestion();
      setShowAddSuccess(true);
      setTimeout(() => setShowAddSuccess(false), 1000);
    };

    useGSAP(() => {
      if (!listRef.current || questions.length === 0 || reduceMotion) return;
      const ctx = gsap.context(() => {}, listRef);
      const items = listRef.current.querySelectorAll('.form-field-item');
      if (items.length > 0) {
        gsap.from(items, {
          y: 20,
          opacity: 0,
          scale: 0.97,
          duration: effective(0.3),
          ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          stagger: effective(0.05),
          delay: effective(0.1),
        });
      }
      return () => ctx.revert();
    }, [questions.length, reduceMotion, effective]);

    const handleDelete = (id: string) => {
      const item = listRef.current?.querySelector(`[data-field-id="${id}"]`);
      if (item && !reduceMotion) {
        gsap.to(item, {
          scale: 0.92,
          opacity: 0,
          x: -20,
          duration: effective(0.15),
          ease: 'power2.in',
          onComplete: () => onDeleteQuestion(id),
        });
      } else {
        onDeleteQuestion(id);
      }
    };

    return (
      <div
        ref={ref ?? containerRef}
        className={`form-preview ${className}`}
        aria-label="Form preview workspace"
      >
        <FormTitleField
          title={title}
          onTitleChange={onTitleChange}
          placeholder="Form title…"
        />

        <div ref={listRef} className="form-preview__list">
          {questions.length === 0 ? (
            <div className="form-preview__empty" aria-live="polite">
              <p className="form-preview__empty-text">
                No questions yet. Upload a document or add one manually.
              </p>
            </div>
          ) : (
            questions.map((q, i) => (
              <FormFieldItem
                key={q.id}
                question={q}
                index={i}
                total={questions.length}
                onUpdate={(patch) => onUpdateQuestion(q.id, patch)}
                onDelete={() => handleDelete(q.id)}
              />
            ))
          )}
        </div>

        <button
          type="button"
          onClick={handleAddQuestion}
          className="form-preview__add-btn btn btn--secondary"
          aria-label="Add question"
        >
          <Plus size={18} />
          <span>Add Question</span>
        </button>

        {showAddSuccess && (
          <p className="form-preview__success-message" aria-live="polite">
            +1 Question added
          </p>
        )}
      </div>
    );
  }
);

FormPreview.displayName = 'FormPreview';
