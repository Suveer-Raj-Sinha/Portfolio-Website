import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

export function AboutHudCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useDeviceCapability();
  const [timeStr, setTimeStr] = useState<string>('');

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3D Perspective Tilt on Hover
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1.02,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (sheenRef.current) {
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      gsap.to(sheenRef.current, {
        opacity: 0.7,
        background: `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.14) 0%, transparent 60%)`,
        duration: 0.2,
      });
    }
  };

  const onMouseLeave = () => {
    if (prefersReducedMotion || !cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (sheenRef.current) {
      gsap.to(sheenRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative w-full max-w-sm aspect-[4/5] rounded-2xl bg-panel/80 border border-line p-6 flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] group select-none will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Corner CAD Reticles */}
      <span className="absolute top-2.5 left-2.5 font-mono text-[9px] text-accent/60 pointer-events-none">┌</span>
      <span className="absolute top-2.5 right-2.5 font-mono text-[9px] text-accent/60 pointer-events-none">┐</span>
      <span className="absolute bottom-2.5 left-2.5 font-mono text-[9px] text-accent/60 pointer-events-none">└</span>
      <span className="absolute bottom-2.5 right-2.5 font-mono text-[9px] text-accent/60 pointer-events-none">┘</span>

      {/* Top Header: System ID & Live Clock */}
      <div className="flex items-center justify-between border-b border-line/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="mono-label text-[10px] text-accent tracking-wider font-semibold">
            SYS_ID // 08-SINHA
          </span>
        </div>
        <div className="font-mono text-[10px] text-text-dim flex items-center gap-1.5">
          <span>{timeStr || '12:00:00'}</span>
          <span className="text-accent text-[9px]">IST</span>
        </div>
      </div>

      {/* Center Graphic: Geometric Hologram Radar & Monogram */}
      <div className="my-auto flex flex-col items-center justify-center relative py-4">
        {/* Animated Background Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div 
            className="absolute inset-0 rounded-full border border-dashed border-accent/30 animate-[spin_24s_linear_infinite]"
          />
          {/* Inner ring */}
          <div className="absolute inset-4 rounded-full border border-line-strong/60" />
          <div className="absolute inset-8 rounded-full border border-accent/20" />

          {/* Coordinate axes */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-line-strong/40" />
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-line-strong/40" />

          {/* Monogram Crest */}
          <div className="relative flex flex-col items-center justify-center z-10">
            <span className="font-display font-bold text-2xl tracking-tighter text-text group-hover:text-accent transition-colors">
              SRS
            </span>
            <span className="mono-label text-[8px] text-text-dim tracking-widest mt-0.5">
              DEV // 2025
            </span>
          </div>

          {/* Blinking radar pulse dot */}
          <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-ping" />
        </div>
      </div>

      {/* Bottom Readout Matrix */}
      <div className="space-y-2.5 border-t border-line/60 pt-3.5">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-text-dim">STATUS</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_currentColor]" />
            OPEN FOR ROLES
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-text-dim">BASE</span>
          <span className="text-text">INDIA // UTC+5:30</span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-text-dim">SPECIALTY</span>
          <span className="text-accent font-medium">3D & REAL-TIME WEB</span>
        </div>
      </div>

      {/* Dynamic Specular Light Sheen */}
      <div
        ref={sheenRef}
        className="absolute inset-0 pointer-events-none opacity-0 z-20 transition-opacity"
      />

      {/* Top Glass Edge Highlight */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />
    </div>
  );
}
