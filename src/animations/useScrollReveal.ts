import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface RevealOptions {
  /** Skip animation entirely (reduced motion / not ready yet) — element stays fully visible */
  disabled: boolean;
  y?: number;
  duration?: number;
  delay?: number;
}

/**
 * Attach to a section/element ref. When enabled, the element fades and rises into place
 * as it enters the viewport. When disabled (reduced motion), no inline styles are ever
 * applied, so the element is simply visible from the start — no flash, no hidden content.
 */
export function useScrollReveal<T extends HTMLElement>(options: RevealOptions) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (options.disabled || !ref.current) return;

    const el = ref.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: options.y ?? 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: options.duration ?? 0.9,
          delay: options.delay ?? 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.disabled]);

  return ref;
}
