import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { profile } from '../data/profile';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { triggerOpenCommandPalette, triggerOpenTerminal } from '../utils/events';
import { isAudioEnabled, setAudioEnabled, playHoverSound, playSelectSound, playSuccessSound } from '../utils/audio';
import { showToast } from '../hooks/useToast';
import { THEMES, getSavedTheme, getThemeConfig, applyTheme, type ThemeId } from '../utils/theme';

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
  const [soundOn, setSoundOn] = useState(() => isAudioEnabled());
  const [themeOpen, setThemeOpen] = useState(false);
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => getSavedTheme());
  const { prefersReducedMotion } = useDeviceCapability();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const themeDropdownRef = useRef<HTMLDivElement | null>(null);

  const activeTheme = getThemeConfig(currentThemeId);

  // Sync theme with global state changes
  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const custom = e as CustomEvent<{ themeId: ThemeId }>;
      if (custom.detail?.themeId) {
        setCurrentThemeId(custom.detail.themeId);
      }
    };
    window.addEventListener('app-theme-changed', handleThemeChange);
    return () => window.removeEventListener('app-theme-changed', handleThemeChange);
  }, []);

  // Close theme dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    if (themeOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [themeOpen]);

  const handleSelectTheme = (id: ThemeId) => {
    playSelectSound();
    applyTheme(id);
    setCurrentThemeId(id);
    setThemeOpen(false);
    showToast(`COLORWAY // ${getThemeConfig(id).label.toUpperCase()}`, 'accent');
  };

  // Sync sound with global state changes
  useEffect(() => {
    const handleAudioChange = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (custom.detail) setSoundOn(custom.detail.enabled);
    };
    window.addEventListener('audio-state-changed', handleAudioChange);
    return () => window.removeEventListener('audio-state-changed', handleAudioChange);
  }, []);

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
    if (window.location.pathname.startsWith('/projects')) {
      window.history.pushState(null, '', `/#${id}`);
      window.dispatchEvent(new CustomEvent('app:route-change'));
      const delay = prefersReducedMotion ? 50 : 350;
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, delay);
      return;
    }
    // Wait for close animation before scrolling
    const delay = prefersReducedMotion ? 0 : 300;
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, delay);
  };

  const toggleAudio = () => {
    const next = !soundOn;
    setAudioEnabled(next);
    setSoundOn(next);
    if (next) {
      playSuccessSound();
      showToast('Sound FX active', 'accent');
    } else {
      showToast('Sound FX muted', 'info');
    }
  };

  return (
    <>
      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-transparent h-24 lg:h-28" />

        <div className="relative px-4 sm:px-6 lg:px-20 py-4 sm:py-5 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="pointer-events-auto flex items-center gap-4 min-w-0">
            <a
              href="#hero"
              onClick={(e) => {
                if (window.location.pathname.startsWith('/projects')) {
                  e.preventDefault();
                  window.history.pushState(null, '', '/');
                  window.dispatchEvent(new CustomEvent('app:route-change'));
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }
              }}
              onMouseEnter={playHoverSound}
              className="font-semibold tracking-tight text-base sm:text-lg text-text hover:text-accent transition-colors shrink-0 cursor-pointer"
            >
              {profile.name}
            </a>
          </div>

          {/* Right: Actions & Tools */}
          <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3">
            {/* Command Palette Trigger */}
            <button
              onClick={() => {
                playSelectSound();
                triggerOpenCommandPalette();
              }}
              onMouseEnter={playHoverSound}
              className="flex items-center gap-1.5 mono-label text-[11px] border border-line-strong rounded-full px-3 py-1.5 bg-ink/60 backdrop-blur-sm hover:border-accent hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent"
              title="Open Command Palette (Ctrl+K)"
            >
              <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Commands</span>
              <kbd className="hidden sm:inline-block text-[9px] text-text-dim border border-line/60 rounded px-1 ml-0.5">⌘K</kbd>
            </button>

            {/* Cyber Terminal Trigger */}
            <button
              onClick={() => {
                playSelectSound();
                triggerOpenTerminal();
              }}
              onMouseEnter={playHoverSound}
              className="hidden sm:flex items-center gap-1.5 mono-label text-[11px] border border-line-strong rounded-full px-3 py-1.5 bg-ink/60 backdrop-blur-sm hover:border-accent hover:text-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent"
              title="Open Cyber Terminal Console"
            >
              <span className="text-accent font-mono">&gt;_</span>
              <span>Terminal</span>
            </button>

            {/* Theme Colorway Switcher Pill */}
            <div className="relative" ref={themeDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  setThemeOpen((prev) => !prev);
                }}
                onMouseEnter={playHoverSound}
                className="flex items-center gap-1.5 mono-label text-[11px] border border-line-strong rounded-full px-2.5 sm:px-3 py-1.5 bg-ink/60 backdrop-blur-sm hover:border-accent hover:text-accent transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-accent"
                title={`Active Theme: ${activeTheme.label}. Click to switch colorway.`}
                aria-expanded={themeOpen}
                aria-haspopup="true"
              >
                <span
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] shrink-0"
                  style={{ backgroundColor: activeTheme.accentHex }}
                />
                <span className="hidden sm:inline font-mono">{activeTheme.shortLabel}</span>
                <span className="text-[8px] text-text-dim">▼</span>
              </button>

              {/* Theme Dropdown HUD */}
              {themeOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-line-strong bg-panel/95 backdrop-blur-md shadow-2xl p-1.5 z-60 animate-in fade-in zoom-in-95 duration-150 font-mono text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2.5 py-1 text-[9px] text-text-dim border-b border-line/60 uppercase tracking-widest flex items-center justify-between">
                    <span>SYS_COLORWAY</span>
                    <span>6 PRESETS</span>
                  </div>
                  <div className="py-1 space-y-0.5">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTheme(t.id)}
                        onMouseEnter={playHoverSound}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                          activeTheme.id === t.id
                            ? 'bg-accent/20 text-accent font-semibold border border-accent/40'
                            : 'text-text-muted hover:text-text hover:bg-panel border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-line shrink-0"
                            style={{ backgroundColor: t.accentHex }}
                          />
                          <span>{t.label}</span>
                        </div>
                        {activeTheme.id === t.id && (
                          <span className="text-[10px] text-accent">●</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Synthesizer Toggle */}
            <button
              onClick={toggleAudio}
              onMouseEnter={playHoverSound}
              className={`flex items-center gap-1.5 mono-label text-[11px] border rounded-full px-3 py-1.5 backdrop-blur-sm transition-all focus-visible:outline-2 focus-visible:outline-accent ${
                soundOn
                  ? 'border-accent text-accent bg-accent/10 shadow-[0_0_12px_color-mix(in_srgb,var(--color-accent)_35%,transparent)]'
                  : 'border-line-strong text-text-muted bg-ink/60 hover:border-accent hover:text-accent'
              }`}
              title={soundOn ? 'Mute procedural audio' : 'Enable procedural audio'}
            >
              {soundOn ? (
                <div className="flex items-center gap-0.5 h-2.5">
                  <span className="w-0.5 h-full bg-accent animate-pulse" />
                  <span className="w-0.5 h-2/3 bg-accent animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-1/2 bg-accent animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <span className="text-text-dim">🔇</span>
              )}
              <span className="hidden md:inline">{soundOn ? 'AUDIO ON' : 'AUDIO OFF'}</span>
            </button>

            {/* Resume — desktop */}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={playHoverSound}
              className="hidden lg:inline-block mono-label text-[11px] border border-line-strong rounded-full px-3.5 py-1.5 bg-ink/60 backdrop-blur-sm hover:border-accent hover:text-accent transition-colors"
            >
              Resume ↗
            </a>

            {/* Hamburger — mobile / tablet only */}
            <button
              ref={hamburgerRef}
              className="lg:hidden w-9 h-9 flex flex-col justify-center items-center gap-[4px] rounded-full border border-line-strong bg-ink/60 backdrop-blur-sm hover:border-accent transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              onClick={() => {
                playSelectSound();
                setOpen(true);
              }}
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <span className="block w-4 h-px bg-text rounded-full" />
              <span className="block w-4 h-px bg-text rounded-full" />
              <span className="block w-2.5 h-px bg-text rounded-full self-start ml-[5px]" />
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
        className="fixed inset-0 z-[55] bg-ink/[0.97] backdrop-blur-md flex flex-col px-6 pt-6 pb-8 lg:hidden overflow-y-auto"
        // Hidden by default; GSAP drives visibility so it never flashes
        style={{ visibility: 'hidden', opacity: 0 }}
        onKeyDown={handleOverlayKeyDown}
      >
        {/* Top row inside overlay */}
        <div className="flex justify-between items-center mb-auto">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-tight text-lg select-none">{profile.name}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <button
            ref={closeRef}
            onClick={() => {
              playSelectSound();
              setOpen(false);
            }}
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
          className="flex-1 flex flex-col justify-center gap-0 my-4"
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
              className="group flex items-baseline gap-5 py-3.5 border-b border-line hover:border-accent transition-colors focus-visible:outline-none focus-visible:text-accent"
            >
              <span className="mono-label text-accent shrink-0 w-7">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[clamp(1.5rem,7vw,2.25rem)] font-semibold tracking-tight leading-none group-hover:text-accent transition-colors">
                {link.label}
              </span>
            </a>
          ))}
          <a
            href="/projects"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              window.history.pushState(null, '', '/projects');
              window.dispatchEvent(new CustomEvent('app:route-change'));
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="group flex items-baseline gap-5 py-3.5 border-b border-accent/40 bg-accent/5 hover:bg-accent/10 transition-colors focus-visible:outline-none"
          >
            <span className="mono-label text-accent shrink-0 w-7">08</span>
            <span className="text-[clamp(1.5rem,7vw,2.25rem)] font-semibold tracking-tight leading-none text-accent">
              All Projects ↗
            </span>
          </a>
        </nav>

        {/* Quick Tools & Theme Colorway in Mobile Menu */}
        <div className="pt-4 border-t border-line space-y-3">
          <div className="flex items-center justify-between pb-1">
            <span className="mono-label text-[10px] text-text-dim">SYS_COLORWAY //</span>
            <div className="flex items-center gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTheme(t.id)}
                  title={t.label}
                  className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                    activeTheme.id === t.id
                      ? 'border-accent scale-110 shadow-[0_0_8px_currentColor]'
                      : 'border-line/60 hover:scale-105'
                  }`}
                  style={{ backgroundColor: t.inkHex }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: t.accentHex }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setOpen(false);
                triggerOpenCommandPalette();
              }}
              className="mono-label text-xs border border-line-strong rounded-full px-3.5 py-1.5 hover:border-accent hover:text-accent transition-colors"
            >
              ⌘K Commands
            </button>
            <button
              onClick={() => {
                setOpen(false);
                triggerOpenTerminal();
              }}
              className="mono-label text-xs border border-line-strong rounded-full px-3.5 py-1.5 hover:border-accent hover:text-accent transition-colors"
            >
              &gt;_ Terminal
            </button>
            <button
              onClick={toggleAudio}
              className={`mono-label text-xs border rounded-full px-3.5 py-1.5 transition-colors ${
                soundOn ? 'border-accent text-accent' : 'border-line-strong text-text-muted'
              }`}
            >
              {soundOn ? 'Audio ON' : 'Audio OFF'}
            </button>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="mono-label text-xs border border-line-strong rounded-full px-3.5 py-1.5 text-center hover:border-accent hover:text-accent transition-colors ml-auto"
            >
              Resume ↗
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
