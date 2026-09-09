import { useRef, type ReactNode, type ElementType, type ComponentPropsWithoutRef } from 'react';
import gsap from 'gsap';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { playHoverSound } from '../utils/audio';

interface MagneticProps<T extends ElementType> {
  as?: T;
  children: ReactNode;
  strength?: number;
  className?: string;
}

/**
 * Wraps a link/button and gives it a subtle pull toward the cursor on hover.
 * Falls back to a plain element (no listeners, no transform) on touch devices
 * or when the visitor has reduced motion enabled — never gated behind a spinner,
 * just renders inert immediately.
 */
export function Magnetic<T extends ElementType = 'a'>({
  as,
  children,
  strength = 0.35,
  className,
  ...rest
}: MagneticProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof MagneticProps<T>>) {
  const ref = useRef<HTMLElement | null>(null);
  const { hasFinePointer, prefersReducedMotion, ready } = useDeviceCapability();
  const Tag = (as ?? 'a') as ElementType;
  const active = ready && hasFinePointer && !prefersReducedMotion;
  const href = typeof rest.href === 'string' ? rest.href : undefined;
  const isExternalLink =
    typeof href === 'string' &&
    !href.startsWith('#') &&
    !href.startsWith('mailto:') &&
    !href.startsWith('tel:') &&
    !href.startsWith('/');
  const linkProps = Tag === 'a' && isExternalLink && !rest.download ? {
    target: rest.target ?? '_blank',
    rel: rest.rel ?? 'noopener noreferrer',
  } : {};

  const handleMove = (e: React.MouseEvent) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    gsap.to(ref.current, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleLeave = () => {
    if (!active || !ref.current) return;
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
  };

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseEnter={() => {
        if (active) playHoverSound();
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...linkProps}
      {...rest}
    >
      {children}
    </Tag>
  );
}
