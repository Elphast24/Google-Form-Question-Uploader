import { forwardRef, HTMLAttributes } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

export interface FieldControlsProps extends HTMLAttributes<HTMLDivElement> {
  index: number;
  total: number;
  onDelete: () => void;
  isDragging?: boolean;
}

export const FieldControls = forwardRef<HTMLDivElement, FieldControlsProps>(
  function FieldControls({ index, total, onDelete, className = '', ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={`field-controls flex items-center gap-3 ${className}`}
        aria-label={`Question ${index + 1} of ${total} controls`}
        {...rest}
      >
        <span
          className="field-controls__drag-handle cursor-grab text-gray-400"
          aria-hidden="true"
          title="Drag to reorder"
        >
          <GripVertical size={18} />
        </span>
        <span className="field-controls__number text-sm font-medium text-gray-600">
          Q{index + 1}
        </span>
        <button
          type="button"
          onClick={onDelete}
          className="field-controls__delete text-red-500 hover:bg-red-50 rounded p-1 transition-colors"
          aria-label={`Delete question ${index + 1}`}
          title="Delete question"
        >
          <Trash2 size={16} />
        </button>
      </div>
    );
  }
);

FieldControls.displayName = 'FieldControls';
