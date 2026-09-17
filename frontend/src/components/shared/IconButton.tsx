import {
  forwardRef,
  ButtonHTMLAttributes,
  ReactNode,
  useRef,
} from 'react';
import gsap from 'gsap';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  ariaLabel: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, ariaLabel, className = '', disabled, ...rest }, ref) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    const tween = (vars: gsap.TweenVars) => {
      if (disabled || reduceMotion) return;
      if (btnRef.current) gsap.to(btnRef.current, vars);
    };

    return (
      <button
        ref={ref ?? btnRef}
        type="button"
        aria-label={ariaLabel}
        className={[
          'icon-btn focus:outline-none',
          disabled ? 'icon-btn--disabled' : '',
          className,
        ].join(' ')}
        disabled={disabled}
        onMouseEnter={() => tween({ scale: 1.05, duration: effective(0.12), ease: 'power2.out' })}
        onMouseLeave={() => tween({ scale: 1, duration: effective(0.12), ease: 'power2.out' })}
        onMouseDown={() => tween({ scale: 0.95, duration: effective(0.12), ease: 'power1.out' })}
        onMouseUp={() => tween({ scale: 1.05, duration: effective(0.12), ease: 'power2.out' })}
        {...rest}
      >
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
