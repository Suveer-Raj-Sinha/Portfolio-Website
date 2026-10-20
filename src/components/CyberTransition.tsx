import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { playRouteTransitionSound } from '../utils/audio';

export interface RouteTransitionEventDetail {
  targetLabel: string;
  targetSub: string;
  onMidpoint: () => void;
}

export function triggerRouteTransition(detail: RouteTransitionEventDetail) {
  window.dispatchEvent(
    new CustomEvent<RouteTransitionEventDetail>('app:route-transition', {
      detail,
    })
  );
}

export function CyberTransition() {
  const [isActive, setIsActive] = useState(false);
  const [targetLabel, setTargetLabel] = useState('ALL BUILDS ARCHIVE');
  const [targetSub, setTargetSub] = useState('INITIALIZING ARCHIVE MATRIX');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const topShutterRef = useRef<HTMLDivElement | null>(null);
  const bottomShutterRef = useRef<HTMLDivElement | null>(null);
  const centerHudRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const laserBeamRef = useRef<HTMLDivElement | null>(null);

  const { prefersReducedMotion } = useDeviceCapability();

  useEffect(() => {
    const handleTransition = (e: Event) => {
      const custom = e as CustomEvent<RouteTransitionEventDetail>;
      const { targetLabel: label, targetSub: sub, onMidpoint } = custom.detail || {};

      if (prefersReducedMotion) {
        if (onMidpoint) onMidpoint();
        return;
      }

      setTargetLabel(label || 'ALL BUILDS ARCHIVE');
      setTargetSub(sub || 'INITIALIZING MATRIX');
      setIsActive(true);

      // Play cyber sound
      playRouteTransitionSound();

      // Ensure elements are mounted before running GSAP
      requestAnimationFrame(() => {
        if (
          !topShutterRef.current ||
          !bottomShutterRef.current ||
          !centerHudRef.current ||
          !progressBarRef.current ||
          !laserBeamRef.current
        ) {
          if (onMidpoint) onMidpoint();
          setIsActive(false);
          return;
        }

        // Reset positions
        gsap.set(topShutterRef.current, { yPercent: -100 });
        gsap.set(bottomShutterRef.current, { yPercent: 100 });
        gsap.set(centerHudRef.current, { opacity: 0, scale: 0.95 });
        gsap.set(progressBarRef.current, { width: '0%' });
        gsap.set(laserBeamRef.current, { opacity: 0, scaleX: 0 });

        const tl = gsap.timeline({
          onComplete: () => {
            setIsActive(false);
          },
        });

        // 1. Shutters snap shut towards horizon
        tl.to(
          [topShutterRef.current, bottomShutterRef.current],
          {
            yPercent: 0,
            duration: 0.28,
            ease: 'power3.inOut',
          }
        );

        // 2. Center laser beam flares across the seam
        tl.to(
          laserBeamRef.current,
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.16,
            ease: 'power2.out',
          },
          '-=0.12'
        );

        // 3. Telemetry HUD fades in & progress fills
        tl.to(
          centerHudRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.14,
            ease: 'power2.out',
          },
          '-=0.1'
        );

        tl.to(
          progressBarRef.current,
          {
            width: '100%',
            duration: 0.14,
            ease: 'power1.inOut',
          },
          '-=0.08'
        );

        // 4. Exact Midpoint: screen is 100% occluded
        tl.add(() => {
          if (onMidpoint) onMidpoint();
        });

        // Brief hold for state update & scroll placement
        tl.to({}, { duration: 0.06 });

        // 5. HUD and laser fade
        tl.to(
          centerHudRef.current,
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.12,
            ease: 'power2.in',
          }
        );

        tl.to(
          laserBeamRef.current,
          {
            opacity: 0,
            duration: 0.1,
          },
          '-=0.08'
        );

        // 6. Shutters split apart vertically revealing the new screen
        tl.to(
          topShutterRef.current,
          {
            yPercent: -100,
            duration: 0.32,
            ease: 'power3.out',
          },
          '-=0.04'
        );

        tl.to(
          bottomShutterRef.current,
          {
            yPercent: 100,
            duration: 0.32,
            ease: 'power3.out',
          },
          '<'
        );
      });
    };

    window.addEventListener('app:route-transition', handleTransition);
    return () => window.removeEventListener('app:route-transition', handleTransition);
  }, [prefersReducedMotion]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-[110] pointer-events-auto overflow-hidden select-none"
    >
      {/* Top Shutter Curtain */}
      <div
        ref={topShutterRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-ink border-b border-accent/40 shadow-2xl flex flex-col justify-end"
      >
        {/* Subtle grid pattern inside shutter */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d98e3f_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Bottom Shutter Curtain */}
      <div
        ref={bottomShutterRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-ink border-t border-accent/40 shadow-2xl flex flex-col justify-start"
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d98e3f_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Glowing Horizontal Laser Beam at the Seam */}
      <div
        ref={laserBeamRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[2px] bg-accent shadow-[0_0_20px_#d98e3f,0_0_40px_#d98e3f] z-20 pointer-events-none origin-center"
      />

      {/* Central Cyber Telemetry HUD Card */}
      <div
        ref={centerHudRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
      >
        <div className="bg-panel-raised/95 border border-line-strong rounded-2xl px-6 py-4 shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col items-center min-w-[280px] sm:min-w-[340px] relative overflow-hidden">
          {/* Reticle corner accents */}
          <span className="absolute top-1.5 left-2 text-[9px] font-mono text-accent/60">┌</span>
          <span className="absolute top-1.5 right-2 text-[9px] font-mono text-accent/60">┐</span>
          <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-accent/60">└</span>
          <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-accent/60">┘</span>

          {/* Header pill */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span className="mono-label text-[10px] text-accent tracking-widest font-semibold uppercase">
              ROUTING PROTOCOL // TRANSFER
            </span>
          </div>

          {/* Target destination */}
          <div className="text-center mb-2.5">
            <p className="font-display font-bold text-sm sm:text-base text-text tracking-wide uppercase">
              {targetLabel}
            </p>
            <p className="font-mono text-[10px] text-text-muted tracking-tight">
              {targetSub}
            </p>
          </div>

          {/* Cyber progress gauge */}
          <div className="w-full bg-ink/80 h-1.5 rounded-full overflow-hidden border border-line p-[1px]">
            <div
              ref={progressBarRef}
              className="h-full bg-accent rounded-full shadow-[0_0_8px_var(--color-accent)] w-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
