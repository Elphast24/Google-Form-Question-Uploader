import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';

export interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
  persistent?: boolean;
}

export const ErrorBanner = ({
  message,
  onClose,
  persistent = false,
}: ErrorBannerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {}, containerRef);
    gsap.from(containerRef.current, {
      y: -10,
      opacity: 0,
      scale: 0.98,
      duration: 0.22,
      ease: 'power2.out',
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!persistent) {
      const timer = setTimeout(() => {
        if (containerRef.current) {
          gsap.to(containerRef.current, {
            opacity: 0,
            y: -8,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: onClose,
          });
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [persistent, onClose]);

  return (
    <div
      ref={containerRef}
      role="alert"
      aria-live="polite"
      className="error-banner flex items-center justify-between gap-3 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800"
    >
      <span className="error-banner__message flex-1">{message}</span>
      {!persistent && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss error"
          className="error-banner__close rounded p-1 text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

ErrorBanner.displayName = 'ErrorBanner';
