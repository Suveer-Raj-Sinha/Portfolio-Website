import { useEffect, useState, useCallback, useRef } from 'react';
import { playSlideSound } from '../utils/audio';

export const SLIDES = [
  { id: 'hero', label: 'Hero', num: '01' },
  { id: 'manifesto', label: 'Manifesto', num: '02' },
  { id: 'skills', label: 'Skills', num: '03' },
  { id: 'project-0', label: 'Tesseract 3D', num: '04' },
  { id: 'project-1', label: 'Solaris', num: '05' },
  { id: 'project-2', label: 'Terra Live', num: '06' },
  { id: 'project-3', label: 'WebLens', num: '07' },
  { id: 'about', label: 'About', num: '08' },
  { id: 'journey', label: 'Journey', num: '09' },
  { id: 'contact', label: 'Contact', num: '10' },
];

export function SlideRail() {
  const [activeSlide, setActiveSlide] = useState<string>('hero');
  const [hoveredSlide, setHoveredSlide] = useState<string | null>(null);
  const isInitialMount = useRef(true);
  const isNavigatingRef = useRef(false);

  // Sound feedback on slide change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    playSlideSound();
  }, [activeSlide]);

  // Robust calculation of current slide index using actual viewport position
  const getCurrentSlideIndex = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportCenter = scrollY + window.innerHeight * 0.5;
    let closestIndex = 0;
    let minDistance = Infinity;

    SLIDES.forEach((slide, idx) => {
      const el = document.getElementById(slide.id);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = scrollY + rect.top + rect.height * 0.5;
      const distance = Math.abs(viewportCenter - elCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    return closestIndex;
  }, []);

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
      },
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
      isNavigatingRef.current = true;
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveSlide(id);
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 500);
    }
  }, []);

  // Jump by delta (-1 for previous, +1 for next) directly to full section
  const navigateDelta = useCallback(
    (delta: number) => {
      if (isNavigatingRef.current) return;
      const curIdx = getCurrentSlideIndex();
      const targetIdx = Math.min(Math.max(curIdx + delta, 0), SLIDES.length - 1);
      if (targetIdx !== curIdx) {
        scrollToSlide(SLIDES[targetIdx].id);
      }
    },
    [getCurrentSlideIndex, scrollToSlide],
  );

  // Keyboard navigation: ArrowDown / ArrowUp directly transitions to next/prev section (NO small scrolls)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when actively typing in inputs or textareas
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;

      // Don't intercept if body is locked by a modal dialog
      if (document.body.style.overflow === 'hidden') return;

      // Check if any modal is currently visible (ignoring hidden mobile-nav)
      const dialogs = document.querySelectorAll('[role="dialog"]');
      for (const d of dialogs) {
        if (d.id === 'mobile-nav') {
          const style = window.getComputedStyle(d);
          if (style.visibility !== 'hidden' && style.opacity !== '0' && style.display !== 'none') {
            return;
          }
          continue;
        }
        const style = window.getComputedStyle(d);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          return;
        }
      }

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        navigateDelta(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        navigateDelta(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateDelta]);

  return (
    <nav
      aria-label="Slide rail navigation"
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-2.5 select-none"
    >
      {/* Up Arrow Button: Directly jumps to previous section */}
      <button
        type="button"
        onClick={() => navigateDelta(-1)}
        className="p-1 rounded-md text-text-dim hover:text-accent hover:bg-panel/60 border border-transparent hover:border-line transition-all cursor-pointer mb-1 focus:outline-none"
        title="Go to previous section (Arrow Up)"
        aria-label="Previous section"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Slide Ticks */}
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
            {/* Slide Label Tooltip on Hover */}
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
              className="p-1 flex items-center justify-center focus:outline-none cursor-pointer"
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

      {/* Down Arrow Button: Directly jumps to next section */}
      <button
        type="button"
        onClick={() => navigateDelta(1)}
        className="p-1 rounded-md text-text-dim hover:text-accent hover:bg-panel/60 border border-transparent hover:border-line transition-all cursor-pointer mt-1 focus:outline-none"
        title="Go to next section (Arrow Down)"
        aria-label="Next section"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </nav>
  );
}
