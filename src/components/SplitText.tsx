import { useEffect, useRef, type ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  /** HTML element or component to render as the wrapper. Default: 'span'. */
  as?: ElementType;
  className?: string;
  /** Split by 'words' (default) or individual 'chars'. */
  type?: 'words' | 'chars';
  /** 'load' = plays on mount; 'scroll' = triggers when entering the viewport. */
  trigger?: 'load' | 'scroll';
  delay?: number;
  stagger?: number;
  duration?: number;
  /**
   * clip = true  → each unit slides up from behind an overflow:hidden mask (no opacity).
   *                 Best for large display headings — produces the classic kinetic type look.
   * clip = false → units fade + translate up. Works at any text size. (default)
   */
  clip?: boolean;
}

/**
 * Splits a string into word (or character) spans and staggers them in with GSAP.
 * When reduced-motion is on, renders plain text with zero GSAP involvement.
 * Screen-reader text is preserved via a visually-hidden duplicate.
 */
export function SplitText({
  children,
  as,
  className,
  type = 'words',
  trigger = 'scroll',
  delay = 0,
  stagger = 0.06,
  duration = 0.8,
  clip = false,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const { prefersReducedMotion, ready } = useDeviceCapability();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = (as ?? 'span') as any;

  const units = type === 'chars' ? children.split('') : children.split(' ');

  useEffect(() => {
    if (!ready || prefersReducedMotion || !containerRef.current) return;

    const spans = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('[data-unit]'),
    );

    const ctx = gsap.context(() => {
      const from = clip ? { yPercent: 110 } : { autoAlpha: 0, y: 18 };
      const to   = clip ? { yPercent: 0   } : { autoAlpha: 1, y: 0  };

      gsap.fromTo(spans, from, {
        ...to,
        duration,
        ease: 'power3.out',
        stagger,
        delay: trigger === 'load' ? delay : 0,
        ...(trigger === 'scroll'
          ? {
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 82%',
              },
            }
          : {}),
      });
    }, containerRef);

    return () => ctx.revert();
  }, [ready, prefersReducedMotion, trigger, delay, stagger, duration, clip]);

  return (
    <Tag ref={containerRef} className={className}>
      {units.map((unit, i) =>
        clip ? (
          /* Clip mode: overflow-hidden parent masks the slide-up travel */
          <span key={i} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
            <span data-unit="" className="inline-block">
              {unit}
              {type === 'words' && i < units.length - 1 ? '\u00A0' : ''}
            </span>
          </span>
        ) : (
          /* Fade mode: spans live inline, no clip boundary needed */
          <span key={i} data-unit="" className="inline-block" aria-hidden="true">
            {unit}
            {type === 'words' && i < units.length - 1 ? '\u00A0' : ''}
          </span>
        ),
      )}
      {/* Screen-reader duplicate — hidden visually, read by AT */}
      <span className="sr-only">{children}</span>
    </Tag>
  );
}
