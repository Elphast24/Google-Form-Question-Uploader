import {
  forwardRef,
  HTMLAttributes,
} from 'react';
import { CheckCircle, Dot } from 'lucide-react';

export interface MilestoneItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  isActive: boolean;
  isComplete: boolean;
  index: number;
}

export const MilestoneItem = forwardRef<HTMLDivElement, MilestoneItemProps>(
  function MilestoneItem({ label, isActive, isComplete, index, className = '', ...rest }, ref) {
    const iconColor = isComplete
      ? 'var(--color-success, #0F9D58)'
      : isActive
        ? 'var(--color-primary, #4285F4)'
        : 'var(--color-grey-300, #DADCE0)';

    return (
      <div
        ref={ref}
        className={`milestone-item flex items-center gap-3 ${className}`}
        aria-label={`Milestone ${index + 1}: ${label}`}
        {...rest}
      >
        <span
          className="milestone-item__icon"
          aria-hidden="true"
          style={{ color: iconColor }}
        >
          {isComplete ? <CheckCircle size={20} /> : <Dot size={20} />}
        </span>
        <span
          className={`milestone-item__label ${
            isComplete ? 'milestone-item__label--complete' : isActive ? 'milestone-item__label--active' : ''
          }`}
        >
          {label}
        </span>
      </div>
    );
  }
);

MilestoneItem.displayName = 'MilestoneItem';
