import { useEffect, useState } from 'react';

interface Waypoint {
  id: string;
  label: string;
}

const WAYPOINTS: Waypoint[] = [
  { id: 'hero', label: 'Start' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export function MeridianSpine() {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState('hero');

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? scrollTop / max : 0);

      let current = WAYPOINTS[0].id;
      for (const wp of WAYPOINTS) {
        const el = document.getElementById(wp.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.5) {
          current = wp.id;
        }
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Desktop: vertical spine with waypoint ticks */}
      <nav
        aria-label="Section progress"
        className="hidden lg:flex fixed left-10 top-0 h-screen z-40 flex-col items-center"
      >
        <div className="relative flex-1 w-px bg-line my-24">
          <div
            className="absolute top-0 left-0 w-px bg-accent transition-[height] duration-150 ease-linear"
            style={{ height: `${progress * 100}%` }}
          />
          {WAYPOINTS.map((wp, i) => (
            <button
              key={wp.id}
              onClick={() => scrollTo(wp.id)}
              className="group absolute left-0 -translate-x-1/2 flex items-center"
              style={{ top: `${(i / (WAYPOINTS.length - 1)) * 100}%` }}
              aria-label={`Go to ${wp.label}`}
              aria-current={activeId === wp.id ? 'true' : undefined}
            >
              <span
                className={`block w-2.5 h-2.5 rounded-full border transition-colors ${
                  activeId === wp.id
                    ? 'bg-accent border-accent'
                    : 'bg-ink border-line-strong group-hover:border-text-muted'
                }`}
              />
              <span
                className={`mono-label absolute left-5 whitespace-nowrap transition-opacity ${
                  activeId === wp.id ? 'opacity-100 text-accent' : 'opacity-0 group-hover:opacity-60'
                }`}
              >
                {wp.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile/tablet: thin top progress bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-[2px] z-40 bg-line">
        <div
          className="h-full bg-accent transition-[width] duration-150 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </>
  );
}
