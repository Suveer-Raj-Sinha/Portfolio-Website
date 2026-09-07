import { useEffect, useRef } from 'react';
import { SLIDES } from '../components/SlideRail';

export function useTouchSwipe() {
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);
  const isLocked = useRef<boolean>(false);

  useEffect(() => {
    // Native phone scrolling is more predictable than jumping between full-screen slides.
    if (window.matchMedia('(max-width: 767px)').matches) return;

    const handleTouchStart = (e: TouchEvent) => {
      // If user is interacting with an open modal/drawer or button/link, ignore
      const target = e.target as HTMLElement | null;
      if (
        target?.closest('[role="dialog"]') ||
        target?.closest('#mobile-nav') ||
        target?.closest('button') ||
        target?.closest('a') ||
        target?.closest('input')
      ) {
        touchStartY.current = null;
        touchStartX.current = null;
        return;
      }

      if (e.touches.length === 1) {
        touchStartY.current = e.touches[0].clientY;
        touchStartX.current = e.touches[0].clientX;
        touchStartTime.current = Date.now();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null || isLocked.current) {
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const deltaY = touchStartY.current - touchEndY;
      const deltaX = touchStartX.current - touchEndX;
      const elapsedTime = Date.now() - touchStartTime.current;

      touchStartY.current = null;
      touchStartX.current = null;

      // Minimum swipe distance: 50px, predominantly vertical, max time 800ms
      if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX) * 1.4 && elapsedTime < 800) {
        // Find current slide in view
        const windowCenter = window.innerHeight / 2;
        let closestIndex = 0;
        let minDistance = Infinity;

        SLIDES.forEach((slide, idx) => {
          const el = document.getElementById(slide.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const elemCenter = rect.top + rect.height / 2;
            const dist = Math.abs(elemCenter - windowCenter);
            if (dist < minDistance) {
              minDistance = dist;
              closestIndex = idx;
            }
          }
        });

        if (deltaY > 0) {
          // Swipe up -> advance to next slide
          if (closestIndex < SLIDES.length - 1) {
            isLocked.current = true;
            const nextEl = document.getElementById(SLIDES[closestIndex + 1].id);
            nextEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              isLocked.current = false;
            }, 600);
          }
        } else {
          // Swipe down -> go to previous slide
          if (closestIndex > 0) {
            isLocked.current = true;
            const prevEl = document.getElementById(SLIDES[closestIndex - 1].id);
            prevEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              isLocked.current = false;
            }, 600);
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);
}
