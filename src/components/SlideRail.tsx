import { useEffect, useState, useCallback, useRef } from 'react';
import { playSlideSound } from '../utils/audio';

export const SLIDES = [
  { id: 'hero', label: 'Hero', num: '01' },
  { id: 'manifesto', label: 'Manifesto', num: '02' },
  { id: 'skills', label: 'Skills', num: '03' },
  { id: 'project-0', label: 'Terra Live', num: '04' },
  { id: 'project-1', label: 'Solaris', num: '05' },
  { id: 'project-2', label: 'WebLens', num: '06' },
  { id: 'about', label: 'About', num: '07' },
  { id: 'journey', label: 'Journey', num: '08' },
  { id: 'contact', label: 'Contact', num: '09' },
];

export function SlideRail() {
  const [activeSlide, setActiveSlide] = useState<string>('hero');
  const [hoveredSlide, setHoveredSlide] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  // Play subtle pneumatic slide transition sound when changing slides
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    playSlideSound();
  }, [activeSlide]);

  // Active slide observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlide(entry.target.id);
          }
        });
      },
      {
        threshold: 0.45,
      }
    );

    SLIDES.forEach((slide) => {
      const el = document.getElementById(slide.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSlide = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs or textareas, or when a modal dialog is open
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      if (document.body.style.overflow === 'hidden' || document.querySelector('[role="dialog"]')) return;

      const currentIndex = SLIDES.findIndex((s) => s.id === activeSlide);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        if (currentIndex < SLIDES.length - 1) {
          e.preventDefault();
          scrollToSlide(SLIDES[currentIndex + 1].id);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        if (currentIndex > 0) {
          e.preventDefault();
          scrollToSlide(SLIDES[currentIndex - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSlide, scrollToSlide]);

  return (
    <nav
      aria-label="Slide rail navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 select-none"
    >
      {SLIDES.map((slide) => {
        const isActive = activeSlide === slide.id;
        const isHovered = hoveredSlide === slide.id;

        return (
          <div
            key={slide.id}
            className="relative flex items-center justify-end group"
            onMouseEnter={() => setHoveredSlide(slide.id)}
            onMouseLeave={() => setHoveredSlide(null)}
          >
            {/* Slide Label Tooltip on Hover or when Active */}
            <span
              className={`absolute right-6 px-2.5 py-1 rounded-md font-mono text-[10px] whitespace-nowrap tracking-wider pointer-events-none transition-all duration-200 border ${
                isHovered
                  ? 'opacity-100 translate-x-0 bg-ink/95 border-line text-accent shadow-lg'
                  : 'opacity-0 translate-x-2'
              }`}
            >
              {slide.num} // {slide.label.toUpperCase()}
            </span>

            {/* Clickable Tick Button */}
            <button
              type="button"
              onClick={() => scrollToSlide(slide.id)}
              aria-label={`Jump to slide ${slide.num}: ${slide.label}`}
              className="p-1 flex items-center justify-center focus:outline-hidden"
            >
              <span
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-2 h-6 bg-accent shadow-[0_0_10px_var(--color-accent)]'
                    : 'w-1.5 h-1.5 bg-line-strong group-hover:bg-text-muted group-hover:scale-125'
                }`}
              />
            </button>
          </div>
        );
      })}
    </nav>
  );
}
