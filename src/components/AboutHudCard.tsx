import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { profile } from '../data/profile';
import { showToast } from '../hooks/useToast';
import { playHoverSound, playSelectSound, playSuccessSound, isAudioEnabled } from '../utils/audio';

type CardMode = 'radar' | 'specs' | 'telemetry';

export function AboutHudCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useDeviceCapability();
  const [timeStr, setTimeStr] = useState<string>('');
  const [cardMode, setCardMode] = useState<CardMode>('radar');
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [viewport, setViewport] = useState<{ w: number; h: number }>({ w: 1920, h: 1080 });

  // Live IST Clock & Session Uptime
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
        }),
      );
      setSessionSeconds((prev) => prev + 1);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Viewport tracking
  useEffect(() => {
    const handleResize = () => {
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const cycleMode = () => {
    playSelectSound();
    setCardMode((prev) => {
      if (prev === 'radar') return 'specs';
      if (prev === 'specs') return 'telemetry';
      return 'radar';
    });
  };

  const handleRecruiterContact = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(profile.email);
    }
    playSuccessSound();
    showToast(`RECRUITER DISPATCH: COPIED ${profile.email}`, 'success');
  };

  const formatUptime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

      {/* Top Header & Instrument Tabs */}
      <div>
        <div className="flex items-center justify-between border-b border-line/60 pb-2.5">
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

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 pt-2">
          {(['radar', 'specs', 'telemetry'] as const).map((mode) => (
            <button
              key={mode}
              onClick={(e) => {
                e.stopPropagation();
                playSelectSound();
                setCardMode(mode);
              }}
              onMouseEnter={() => playHoverSound()}
              className={`py-1 text-[9px] font-mono rounded tracking-wider transition-all uppercase cursor-pointer ${
                cardMode === mode
                  ? 'bg-accent/20 text-accent border border-accent/40 font-semibold'
                  : 'text-text-dim hover:text-text hover:bg-panel/60 border border-transparent'
              }`}
            >
              {mode === 'radar' && '● RADAR'}
              {mode === 'specs' && '⎈ SPECS'}
              {mode === 'telemetry' && '∿ TELEM'}
            </button>
          ))}
        </div>
      </div>

      {/* Center Dynamic Visualizer Deck (Click to Cycle Mode) */}
      <div
        onClick={cycleMode}
        title="Click to cycle HUD display mode"
        className="my-auto flex flex-col items-center justify-center relative py-2 cursor-pointer group/center"
      >
        {/* MODE 1: RADAR & MONOGRAM */}
        {cardMode === 'radar' && (
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Outer rotating dashed ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-accent/30 animate-[spin_24s_linear_infinite]" />
            {/* Inner rings */}
            <div className="absolute inset-4 rounded-full border border-line-strong/60" />
            <div className="absolute inset-8 rounded-full border border-accent/20" />

            {/* Coordinate axes */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-line-strong/40" />
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-line-strong/40" />

            {/* Monogram Crest */}
            <div className="relative flex flex-col items-center justify-center z-10">
              <span className="font-display font-bold text-2xl tracking-tighter text-text group-hover/center:text-accent transition-colors">
                SRS
              </span>
              <span className="mono-label text-[8px] text-text-dim tracking-widest mt-0.5">
                DEV // 2025
              </span>
            </div>

            {/* Blinking radar pulse dot */}
            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-ping" />
          </div>
        )}

        {/* MODE 2: WORKSTATION SPECS */}
        {cardMode === 'specs' && (
          <div className="w-full max-w-[280px] p-3 rounded-xl border border-line-strong/80 bg-ink/70 font-mono text-[10px] space-y-2">
            <div className="flex items-center justify-between border-b border-line/60 pb-1 text-accent font-semibold">
              <span>WORKSTATION SPECS</span>
              <span className="text-[9px] text-text-dim">[RIG-01]</span>
            </div>
            <div className="space-y-1.5 text-text-muted">
              <div className="flex justify-between">
                <span className="text-text-dim">DEV RIG</span>
                <span className="text-text">WIN 11 + WSL2 (UBUNTU)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">SHELL</span>
                <span className="text-text">ZSH + STARSHIP + NVIM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">CORE STACK</span>
                <span className="text-accent font-medium">REACT 19 • THREE.JS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">SERVICES</span>
                <span className="text-text">FASTAPI • PYTHON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">FPS LOCK</span>
                <span className="text-emerald-400 font-semibold">&lt; 16.6ms / 60 FPS</span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: LIVE TELEMETRY */}
        {cardMode === 'telemetry' && (
          <div className="w-full max-w-[280px] p-3 rounded-xl border border-line-strong/80 bg-ink/70 font-mono text-[10px] space-y-2">
            <div className="flex items-center justify-between border-b border-line/60 pb-1 text-accent font-semibold">
              <span>DIAGNOSTICS & TELEMETRY</span>
              <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                STREAMING
              </span>
            </div>
            <div className="space-y-1.5 text-text-muted">
              <div className="flex justify-between">
                <span className="text-text-dim">SESSION TIME</span>
                <span className="text-text font-semibold">{formatUptime(sessionSeconds)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">NODE PING</span>
                <span className="text-emerald-400">14ms (OPTIMAL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">VIEWPORT</span>
                <span className="text-text">{viewport.w} × {viewport.h}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-dim">AUDIO ENGINE</span>
                <span className={isAudioEnabled() ? 'text-accent' : 'text-text-dim'}>
                  {isAudioEnabled() ? 'SYNTH (ACTIVE)' : 'SYNTH (MUTED)'}
                </span>
              </div>
            </div>

            {/* Micro Equalizer Frequency Bars */}
            <div className="flex items-end justify-between h-4 pt-1 px-1 border-t border-line/40">
              <span className="w-1 bg-accent/80 rounded-t animate-[pulse_1.1s_ease-in-out_infinite] h-2" />
              <span className="w-1 bg-accent/90 rounded-t animate-[pulse_0.7s_ease-in-out_infinite] h-3.5" />
              <span className="w-1 bg-accent rounded-t animate-[pulse_1.4s_ease-in-out_infinite] h-2.5" />
              <span className="w-1 bg-accent/70 rounded-t animate-[pulse_0.9s_ease-in-out_infinite] h-4" />
              <span className="w-1 bg-accent/90 rounded-t animate-[pulse_1.3s_ease-in-out_infinite] h-3" />
              <span className="w-1 bg-accent/80 rounded-t animate-[pulse_0.8s_ease-in-out_infinite] h-1.5" />
            </div>
          </div>
        )}

        <span className="mono-label text-[8px] text-text-dim tracking-widest mt-2 group-hover/center:text-accent transition-colors">
          [ CLICK TO CYCLE HUD // {cardMode.toUpperCase()} ]
        </span>
      </div>

      {/* Bottom Readout Matrix */}
      <div className="space-y-2 border-t border-line/60 pt-3">
        {cardMode === 'radar' && (
          <>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-text-dim">STATUS</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRecruiterContact();
                }}
                onMouseEnter={() => playHoverSound()}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-500/20 hover:border-emerald-500/70 text-emerald-400 font-medium transition-all group/btn cursor-pointer"
                title="Click to copy direct recruiter contact"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_currentColor]" />
                <span>OPEN FOR ROLES</span>
                <span className="text-[9px] text-emerald-400/60 group-hover/btn:text-emerald-300">📋</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-text-dim">BASE</span>
              <span className="text-text">INDIA // UTC+5:30</span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-text-dim">SPECIALTY</span>
              <span className="text-accent font-medium">3D & REAL-TIME WEB</span>
            </div>
          </>
        )}

        {cardMode === 'specs' && (
          <>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-text-dim">COMPILER</span>
              <span className="text-text">VITE + ESBUILD (0.3s)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-text-dim">LINTER</span>
              <span className="text-emerald-400 font-medium">OXLINT (0 ERRORS)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-accent font-medium">CSS ENGINE</span>
              <span className="text-accent font-medium">TAILWIND CSS v4</span>
            </div>
          </>
        )}

        {cardMode === 'telemetry' && (
          <>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-text-dim">FPS TARGET</span>
              <span className="text-emerald-400 font-medium">60 FPS (RAF LOCKED)</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-text-dim">MEMORY PROFILE</span>
              <span className="text-text">ZERO-LEAK LEAN</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-text-dim">BUNDLE GZIP</span>
              <span className="text-accent font-medium">135 kB TOTAL</span>
            </div>
          </>
        )}
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
