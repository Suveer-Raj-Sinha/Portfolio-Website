import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { profile } from '../data/profile';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

const NAV_LINKS = [
  { id: 'hero', label: 'Start' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const { prefersReducedMotion } = useDeviceCapability();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  // ── Close on Escape ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // ── Body scroll lock ─────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // ── GSAP open / close ────────────────────────────────────────────────────
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    if (open) {
      // Move focus into the menu immediately
      closeRef.current?.focus();

      if (prefersReducedMotion) {
        gsap.set(overlay, { autoAlpha: 1 });
        gsap.set(linksRef.current, { autoAlpha: 1, y: 0 });
      } else {
        gsap.fromTo(
          overlay,
          { autoAlpha: 0, yPercent: -3 },
          { autoAlpha: 1, yPercent: 0, duration: 0.35, ease: 'power3.out' },
        );
        gsap.fromTo(
          linksRef.current,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.055,
            ease: 'power3.out',
            delay: 0.1,
          },
        );
      }
    } else {
      if (prefersReducedMotion) {
        gsap.set(overlay, { autoAlpha: 0 });
      } else {
        gsap.to(overlay, { autoAlpha: 0, duration: 0.25, ease: 'power2.in' });
      }
      // Return focus to the button that opened the menu
      hamburgerRef.current?.focus();
    }
  }, [open, prefersReducedMotion]);

  // ── Simple focus trap ────────────────────────────────────────────────────
  const handleOverlayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const focusable = (
      [closeRef.current, ...linksRef.current] as (HTMLElement | null)[]
    ).filter((el): el is HTMLElement => el !== null);
    const first = focusable[0] ?? null;
    const last = focusable[focusable.length - 1] ?? null;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  // ── Smooth scroll + close ────────────────────────────────────────────────
  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setOpen(false);
    // Wait for close animation before scrolling
    const delay = prefersReducedMotion ? 0 : 300;
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, delay);
  };

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-transparent h-24 lg:h-28" />

        <div className="relative px-6 lg:px-24 py-6 flex items-center justify-between">
          {/* Logo / name */}
          <a
            href="#hero"
            className="pointer-events-auto font-semibold tracking-tight text-lg text-text hover:text-accent transition-colors"
          >
            {profile.name}
          </a>

          <div className="pointer-events-auto flex items-center gap-4">
            {/* Resume — desktop only */}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-block mono-label border border-line-strong rounded-full px-4 py-2 bg-ink/60 backdrop-blur-sm hover:border-accent hover:text-accent transition-colors"
            >
              Resume
            </a>

            {/* Hamburger — mobile / tablet only */}
            <button
              ref={hamburgerRef}
              className="lg:hidden w-10 h-10 flex flex-col justify-center items-center gap-[5px] rounded-full border border-line-strong bg-ink/60 backdrop-blur-sm hover:border-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              onClick={() => setOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <span className="block w-5 h-px bg-text rounded-full" />
              <span className="block w-5 h-px bg-text rounded-full" />
              <span className="block w-3 h-px bg-text rounded-full self-start ml-[5px]" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Full-screen mobile overlay ────────────────────────────────────── */}
      <div
        id="mobile-nav"
        ref={overlayRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="fixed inset-0 z-[55] bg-ink/[0.97] backdrop-blur-md flex flex-col px-6 pt-6 pb-8 lg:hidden"
        // Hidden by default; GSAP drives visibility so it never flashes
        style={{ visibility: 'hidden', opacity: 0 }}
        onKeyDown={handleOverlayKeyDown}
      >
        {/* Top row inside overlay */}
        <div className="flex justify-between items-center mb-auto">
          <span className="font-semibold tracking-tight text-lg select-none">{profile.name}</span>

          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-line-strong hover:border-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
          >
            {/* × icon */}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M2 2l12 12M14 2L2 14" />
            </svg>
          </button>
        </div>

        {/* Section links */}
        <nav
          className="flex-1 flex flex-col justify-center gap-0"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              ref={(el) => {
                linksRef.current[i] = el;
              }}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link.id)}
              className="group flex items-baseline gap-5 py-4 border-b border-line hover:border-accent transition-colors focus-visible:outline-none focus-visible:text-accent"
            >
              <span className="mono-label text-accent shrink-0 w-7">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[clamp(1.75rem,8vw,2.5rem)] font-semibold tracking-tight leading-none group-hover:text-accent transition-colors">
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Resume at the bottom */}
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 mono-label border border-line-strong rounded-full px-4 py-3 text-center hover:border-accent hover:text-accent transition-colors self-start focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
        >
          Resume ↗
        </a>
      </div>
    </>
  );
}
