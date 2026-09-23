import {
  forwardRef,
  ButtonHTMLAttributes,
  ReactNode,
  useRef,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'btn btn--primary',
  secondary: 'btn btn--secondary',
  ghost: 'btn btn--ghost',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      className = '',
      ...rest
    },
    ref
  ) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const spinnerRef = useRef<HTMLSpanElement>(null);
    const { reduceMotion, effective } = useGSAPAnimation();

    const isDisabled = disabled || loading;

    useGSAP(() => {
      if (!spinnerRef.current || reduceMotion) return;
      const ctx = gsap.context(() => {}, spinnerRef);
      gsap.to(spinnerRef.current, {
        rotation: 360,
        duration: 1.6,
        ease: 'none',
        repeat: -1,
      });
      return () => ctx.revert();
    }, { scope: spinnerRef, dependencies: [reduceMotion] });

    const tween = (vars: gsap.TweenVars) => {
      if (isDisabled || reduceMotion) return;
      if (btnRef.current) gsap.to(btnRef.current, vars);
    };

    return (
      <button
        ref={ref ?? btnRef}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-md font-medium focus:outline-none',
          variantClass[variant],
          sizeClass[size],
          isDisabled ? 'btn--disabled' : '',
          className,
        ].join(' ')}
        disabled={isDisabled}
        aria-busy={loading}
        onMouseEnter={() => tween({ y: -2, duration: effective(0.12), ease: 'power2.out' })}
        onMouseLeave={() => tween({ y: 0, duration: effective(0.12), ease: 'power2.out' })}
        onMouseDown={() => tween({ scale: 0.97, duration: effective(0.12), ease: 'power1.out' })}
        onMouseUp={() => tween({ scale: 1, y: -2, duration: effective(0.12), ease: 'power2.out' })}
        onFocus={() => tween({ boxShadow: '0 0 0 3px rgba(66,133,244,0.3)', duration: effective(0.14), ease: 'power2.out' })}
        onBlur={() => tween({ boxShadow: 'none', duration: effective(0.14), ease: 'power2.out' })}
        {...rest}
      >
        {loading ? (
          <>
            <span ref={spinnerRef} className="spinner" aria-hidden="true" />
            <span>Loading…</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="btn__icon">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="btn__icon">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
