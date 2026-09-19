import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

type PillButtonVariant = 'coral' | 'white' | 'outline';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillButtonVariant;
  arrow?: boolean;
  children: ReactNode;
}

const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  ({ variant = 'coral', arrow = true, children, className = '', ...props }, ref) => {
    const variantClass = `btn-pill-${variant}`;

    return (
      <button
        ref={ref}
        type="button"
        className={`btn-pill ${variantClass} ${className}`}
        {...props}
      >
        <span>{children}</span>
        {arrow && (
          <span className="btn-arrow-orb">
            <ArrowUpRight size={16} />
          </span>
        )}
      </button>
    );
  }
);

PillButton.displayName = 'PillButton';

export default PillButton;
