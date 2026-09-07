import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

const INTERACTIVE = 'a, button, [role="button"], summary, label, select, input, textarea';

/**
 * Two-layer cursor:
 *  1. Filled circle  — mix-blend-mode: difference with orange fill.
 *                      → dark areas turn orange, orange areas turn black.
 *                      → white/light text turns dark (not blue) because
 *                         the white area sees |white - orange| ≈ dark.
 *  2. Outer ring     — no blend mode, always renders as a solid orange border
 *                      so the cursor is visible on any background.
 *
 * Only active on fine-pointer devices; returns null on touch / reduced-motion.
 */
export function Cursor() {
  const { hasFinePointer, prefersReducedMotion, ready } = useDeviceCapability();

  /** The blend circle (inner) */
  const blendRef = useRef<HTMLDivElement | null>(null);
  /** The border ring (outer) — separate stacking context so it ignores blend mode */
  const ringRef = useRef<HTMLDivElement | null>(null);

  const active = ready && hasFinePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!active || !blendRef.current || !ringRef.current) return;

    const blend = blendRef.current;
    const ring  = ringRef.current;

    // Centre both on the hot-spot and hide until first move
    gsap.set([blend, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 1 });

    // Independent quickTo instances so GSAP can track each element's tween
    const blendX = gsap.quickTo(blend, 'x', { duration: 0.4, ease: 'power3.out' });
    const blendY = gsap.quickTo(blend, 'y', { duration: 0.4, ease: 'power3.out' });
    const ringX  = gsap.quickTo(ring,  'x', { duration: 0.45, ease: 'power3.out' });
    const ringY  = gsap.quickTo(ring,  'y', { duration: 0.45, ease: 'power3.out' });

    let entered = false;

    const onMove = (e: MouseEvent) => {
      if (!entered) {
        gsap.to([blend, ring], { autoAlpha: 1, duration: 0.25 });
        entered = true;
      }
      blendX(e.clientX);
      blendY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) {
        gsap.to(blend, { scale: 3.5, duration: 0.3, ease: 'power2.out' });
        gsap.to(ring,  { scale: 3.5, duration: 0.3, ease: 'power2.out' });
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(INTERACTIVE)) {
        const next = e.relatedTarget as Element | null;
        if (!next?.closest(INTERACTIVE)) {
          gsap.to(blend, { scale: 1, duration: 0.3, ease: 'power2.out' });
          gsap.to(ring,  { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
      }
    };

    const hide = () => gsap.to([blend, ring], { autoAlpha: 0, duration: 0.25 });
    const show = () => { if (entered) gsap.to([blend, ring], { autoAlpha: 1, duration: 0.25 }); };

    window.addEventListener('mousemove',     onMove);
    document.addEventListener('mouseover',   onOver);
    document.addEventListener('mouseout',    onOut);
    document.addEventListener('mouseleave',  hide);
    document.addEventListener('mouseenter',  show);

    return () => {
      window.removeEventListener('mousemove',    onMove);
      document.removeEventListener('mouseover',  onOver);
      document.removeEventListener('mouseout',   onOut);
      document.removeEventListener('mouseleave', hide);
      document.removeEventListener('mouseenter', show);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/*
        Layer 1 — filled blend circle.
        mix-blend-mode: difference lives here, isolated from the ring
        so the ring never participates in the blend calculation.
      */}
      <div
        ref={blendRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9998] pointer-events-none will-change-transform"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="w-5 h-5 rounded-full bg-accent" />
      </div>

      {/*
        Layer 2 — border ring.
        No blend mode: always renders as a solid orange outline so the cursor
        remains visible on every background, including near-white text areas.
      */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="fixed top-0 left-0 z-[9999] pointer-events-none will-change-transform"
      >
        <div className="w-5 h-5 rounded-full border border-accent/70" />
      </div>
    </>
  );
}
