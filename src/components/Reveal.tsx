import type { ReactNode } from 'react';
import { useScrollReveal } from '../animations/useScrollReveal';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

interface RevealProps {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}

export function Reveal({ children, className, y, delay }: RevealProps) {
  const { prefersReducedMotion, ready } = useDeviceCapability();
  const ref = useScrollReveal<HTMLDivElement>({ disabled: !ready || prefersReducedMotion, y, delay });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
