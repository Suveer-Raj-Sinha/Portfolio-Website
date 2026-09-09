import type { GeometryMode, SpeedMode, DensityMode, CanvasControlsState } from './HeroOrbitalCanvas';
import { playHoverSound, playSelectSound } from '../utils/audio';

interface Props {
  controls: CanvasControlsState;
  onChange: (next: CanvasControlsState) => void;
}

export function HeroCanvasControls({ controls, onChange }: Props) {
  const handleGeometry = (g: GeometryMode) => {
    playSelectSound();
    onChange({ ...controls, geometry: g });
  };

  const handleSpeed = (s: SpeedMode) => {
    playSelectSound();
    onChange({ ...controls, speed: s });
  };

  const handleDensity = (d: DensityMode) => {
    playSelectSound();
    onChange({ ...controls, density: d });
  };

  return (
    <div className="w-full max-w-[360px] lg:max-w-[400px] pointer-events-auto">
      <div className="bg-ink/90 backdrop-blur-md border border-line-strong rounded-xl p-3.5 text-[11px] mono-label shadow-2xl text-text transition-all">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2.5 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-semibold text-text tracking-wider text-xs">
              HUD RENDER MATRIX
            </span>
          </div>
          <span className="text-[10px] text-text-dim uppercase tracking-widest">
            INTERACTIVE 3D
          </span>
        </div>

        {/* Controls Grid */}
        <div className="pt-3 space-y-2.5">
          {/* Geometry Mode */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-text-dim text-[10px] w-20 shrink-0">GEOMETRY</span>
            <div className="grid grid-cols-3 gap-1 flex-1">
              {([
                { id: 'sphere', label: '● SPHERE' },
                { id: 'torus', label: '◎ TORUS' },
                { id: 'rings', label: '⎈ GIMBAL' },
              ] as { id: GeometryMode; label: string }[]).map(({ id, label }) => {
                const isActive = controls.geometry === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleGeometry(id)}
                    onMouseEnter={playHoverSound}
                    className={`py-1.5 px-2 rounded-md text-[10px] uppercase font-mono tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-accent text-ink font-semibold shadow-[0_0_12px_rgba(217,142,63,0.35)]'
                        : 'bg-surface/50 text-text-muted hover:text-text border border-line/60 hover:border-line-strong'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Velocity Multiplier */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-text-dim text-[10px] w-20 shrink-0">VELOCITY</span>
            <div className="grid grid-cols-3 gap-1 flex-1">
              {([0.5, 1, 2] as SpeedMode[]).map((s) => {
                const isActive = controls.speed === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSpeed(s)}
                    onMouseEnter={playHoverSound}
                    className={`py-1.5 px-2 rounded-md text-[10px] font-mono tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-accent text-ink font-semibold shadow-[0_0_12px_rgba(217,142,63,0.35)]'
                        : 'bg-surface/50 text-text-muted hover:text-text border border-line/60 hover:border-line-strong'
                    }`}
                  >
                    {s}x
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid Density */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-text-dim text-[10px] w-20 shrink-0">DENSITY</span>
            <div className="grid grid-cols-3 gap-1 flex-1">
              {(['compact', 'standard', 'dense'] as DensityMode[]).map((d) => {
                const isActive = controls.density === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDensity(d)}
                    onMouseEnter={playHoverSound}
                    className={`py-1.5 px-2 rounded-md text-[10px] capitalize font-mono tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? 'bg-accent text-ink font-semibold shadow-[0_0_12px_rgba(217,142,63,0.35)]'
                        : 'bg-surface/50 text-text-muted hover:text-text border border-line/60 hover:border-line-strong'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
