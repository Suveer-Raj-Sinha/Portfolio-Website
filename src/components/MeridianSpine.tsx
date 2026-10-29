import { useEffect, useState, useCallback } from 'react';

interface Waypoint {
  id: string;
  label: string;
  targetId?: string;
}

const WAYPOINTS: Waypoint[] = [
  { id: 'hero', label: 'Start', targetId: 'hero' },
  { id: 'manifesto', label: 'Manifesto', targetId: 'manifesto' },
  { id: 'skills', label: 'Skills', targetId: 'skills' },
  { id: 'projects', label: 'Projects', targetId: 'project-0' },
  { id: 'about', label: 'About', targetId: 'about' },
  { id: 'journey', label: 'Journey', targetId: 'journey' },
  { id: 'contact', label: 'Contact', targetId: 'contact' },
];

export function MeridianSpine() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState('hero');

  const updateSpine = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportCenter = scrollY + window.innerHeight * 0.5;

    // Get the vertical centers of all waypoint targets in page space
    const targetPositions = WAYPOINTS.map((wp) => {
      const elId = wp.targetId || wp.id;
      const el = document.getElementById(elId) || document.getElementById(wp.id);
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return scrollY + rect.top + rect.height * 0.5;
    });

    // 1. Determine active waypoint by finding the closest waypoint center to viewport center
    let bestWpIndex = 0;
    let minDistance = Infinity;

    targetPositions.forEach((pos, idx) => {
      const dist = Math.abs(viewportCenter - pos);
      if (dist < minDistance) {
        minDistance = dist;
        bestWpIndex = idx;
      }
    });

    setActiveId(WAYPOINTS[bestWpIndex].id);

    // 2. Compute smooth spine progress line that connects mathematically to the waypoint ticks
    // Each waypoint tick 'i' is located at (i / (WAYPOINTS.length - 1)) * 100%
    const totalWaypoints = WAYPOINTS.length;
    if (totalWaypoints <= 1) {
      setProgress(0);
      return;
    }

    // Find the two waypoints that sandwich the current viewport center
    let computedRatio = 0;
    if (viewportCenter <= targetPositions[0]) {
      computedRatio = 0;
    } else if (viewportCenter >= targetPositions[targetPositions.length - 1]) {
      computedRatio = 1;
    } else {
      for (let i = 0; i < targetPositions.length - 1; i++) {
        const start = targetPositions[i];
        const end = targetPositions[i + 1];
        if (viewportCenter >= start && viewportCenter <= end) {
          const span = end - start;
          const localFraction = span > 0 ? (viewportCenter - start) / span : 0;
          computedRatio = (i + localFraction) / (totalWaypoints - 1);
          break;
        }
      }
    }

    setProgress(Math.max(0, Math.min(1, computedRatio)));
  }, []);

  useEffect(() => {
    const rafId = requestAnimationFrame(updateSpine);
    window.addEventListener('scroll', updateSpine, { passive: true });
    window.addEventListener('resize', updateSpine, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', updateSpine);
      window.removeEventListener('resize', updateSpine);
    };
  }, [updateSpine]);

  const scrollTo = (wp: Waypoint) => {
    const elId = wp.targetId || wp.id;
    const el = document.getElementById(elId) || document.getElementById(wp.id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      {/* Desktop: vertical spine with mathematically aligned waypoint ticks */}
      <nav
        aria-label="Section progress"
        className="hidden lg:flex fixed left-10 top-0 h-screen z-40 flex-col items-center select-none"
      >
        <div className="relative flex-1 w-px bg-line my-24">
          {/* Active orange spine line: exactly connects to active waypoint ticks without lagging or overshooting */}
          <div
            className="absolute top-0 left-0 w-px bg-accent shadow-[0_0_8px_var(--color-accent)] transition-[height] duration-200 ease-out"
            style={{ height: `${progress * 100}%` }}
          />

          {WAYPOINTS.map((wp, i) => {
            const isActive = activeId === wp.id;
            const dotPosition = (i / (WAYPOINTS.length - 1)) * 100;
            const isPassed = progress * 100 >= dotPosition - 1.5;

            return (
              <button
                key={wp.id}
                onClick={() => scrollTo(wp)}
                className="group absolute left-0 -translate-x-1/2 flex items-center cursor-pointer focus:outline-none"
                style={{ top: `${dotPosition}%` }}
                aria-label={`Go to ${wp.label}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span
                  className={`block w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                    isActive
                      ? 'bg-accent border-accent scale-125 shadow-[0_0_10px_var(--color-accent)]'
                      : isPassed
                      ? 'bg-accent/80 border-accent/80'
                      : 'bg-ink border-line-strong group-hover:border-text-muted'
                  }`}
                />
                <span
                  className={`mono-label absolute left-5 whitespace-nowrap transition-all duration-200 text-xs font-mono tracking-wider ${
                    isActive
                      ? 'opacity-100 text-accent font-semibold translate-x-0'
                      : 'opacity-0 -translate-x-1 group-hover:opacity-80 group-hover:translate-x-0 text-text-muted'
                  }`}
                >
                  {wp.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile/tablet: thin top progress bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-[2px] z-[51] bg-line">
        <div
          className="h-full bg-accent transition-[width] duration-200 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </>
  );
}
