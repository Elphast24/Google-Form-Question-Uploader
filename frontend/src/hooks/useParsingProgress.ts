import { useState, useEffect, useRef, useCallback } from 'react';

export type ParseMilestone =
  | 'Reading document...'
  | 'Extracting fields...'
  | 'Rendering preview...';

export const PARSE_MILESTONES: ParseMilestone[] = [
  'Reading document...',
  'Extracting fields...',
  'Rendering preview...',
];

export type ParseStatus = 'idle' | 'in-progress' | 'complete' | 'error';

export interface UseParsingProgressReturn {
  status: ParseStatus;
  milestone: string;
  progress: number;
  activeIndex: number;
  start: () => void;
  cancel: () => void;
}

export const useParsingProgress = (
  milestones: string[] = PARSE_MILESTONES
): UseParsingProgressReturn => {
  const [status, setStatus] = useState<ParseStatus>('idle');
  const [milestone, setMilestone] = useState('');
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const cancel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    cancel();
    setStatus('in-progress');
    setProgress(0);
    setActiveIndex(0);
    setMilestone(milestones[0] || '');

    const stepDuration = 1800 / milestones.length;
    let currentStep = 0;

    intervalRef.current = setInterval(() => {
      const nextStep = currentStep + 1;
      const nextIndex = Math.min(nextStep, milestones.length - 1);

      setProgress(Math.round((nextStep / milestones.length) * 100));
      setMilestone(nextStep < milestones.length ? milestones[nextStep] : milestones[milestones.length - 1]);
      setActiveIndex(nextIndex);
      currentStep = nextStep;

      if (nextStep >= milestones.length) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        timeoutRef.current = setTimeout(() => {
          setStatus('complete');
          setProgress(100);
        }, 400);
      }
    }, stepDuration);

    return () => cancel();
  }, [milestones, cancel]);

  useEffect(() => {
    return () => cancel();
  }, [cancel]);

  return {
    status,
    milestone,
    progress,
    activeIndex,
    start,
    cancel,
  };
};
