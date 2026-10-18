import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import {
  PROJECT_CATEGORIES,
  PROJECT_STATUSES,
  ALL_PROJECT_TECHNOLOGIES,
  type ProjectCategory,
  type ProjectStatus,
} from '../data/projects';
import type { ProjectFilterState } from '../utils/projectFilters';
import { TechIcon } from './TechIcons';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { playDrawerSound, playHoverSound, playSelectSound } from '../utils/audio';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ProjectFilterState;
  categoryCounts: Record<string, number>;
  filteredCount: number;
  hasActiveFilters: boolean;
  onCategorySelect: (category: ProjectCategory) => void;
  onTechToggle: (tech: string) => void;
  onClearTech: () => void;
  onStatusSelect: (status: ProjectStatus | 'all') => void;
  onClearFilters: () => void;
}

// Maps project technology strings to TechIcon IDs
function getTechIconId(name: string): string {
  const lower = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (lower.includes('reactthreefiber') || lower === 'r3f') return 'r3f';
  if (lower.includes('three')) return 'threejs';
  if (lower.includes('react')) return 'react';
  if (lower.includes('typescript')) return 'typescript';
  if (lower.includes('javascript')) return 'javascript';
  if (lower.includes('python')) return 'python';
  if (lower.includes('fastapi')) return 'fastapi';
  if (lower.includes('canvas')) return 'canvas';
  if (lower.includes('node')) return 'nodejs';
  if (lower.includes('sqlite') || lower.includes('sql')) return 'sql';
  if (lower.includes('html')) return 'html';
  if (lower.includes('css')) return 'css';
  return 'react';
}

export function FilterDrawer({
  isOpen,
  onClose,
  filters,
  categoryCounts,
  filteredCount,
  hasActiveFilters,
  onCategorySelect,
  onTechToggle,
  onClearTech,
  onStatusSelect,
  onClearFilters,
}: FilterDrawerProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const [rendered, setRendered] = useState<boolean>(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const { prefersReducedMotion } = useDeviceCapability();

  // Sync rendered state with isOpen prop and trigger sounds
  useEffect(() => {
    if (isOpen) {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      playDrawerSound();
      setRendered(true);
      setIsClosing(false);
    } else if (rendered && !isClosing) {
      setIsClosing(true);
      closeTimeoutRef.current = window.setTimeout(() => {
        closeTimeoutRef.current = null;
        setRendered(false);
        setIsClosing(false);
      }, prefersReducedMotion ? 0 : 350);
    }
  }, [isOpen, rendered, isClosing, prefersReducedMotion]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    if (!rendered || isClosing) return;

    if (prefersReducedMotion) {
      onClose();
      return;
    }

    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      setRendered(false);
      setIsClosing(false);
    }, 350);
    onClose();
  }, [rendered, isClosing, prefersReducedMotion, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && rendered) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rendered, handleClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (rendered) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [rendered]);

  // GSAP slide-in and slide-out animation matching ProjectDrawer
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (rendered) {
      closeBtnRef.current?.focus();

      if (prefersReducedMotion) {
        gsap.set(overlayRef.current, { autoAlpha: 1 });
        gsap.set(drawerRef.current, { x: '0%' });
      } else if (isClosing) {
        gsap.to(overlayRef.current, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
        gsap.to(drawerRef.current, { x: '100%', duration: 0.35, ease: 'power3.in' });
      } else {
        gsap.set(overlayRef.current, { autoAlpha: 1 });
        gsap.set(drawerRef.current, { x: '0%' });
        gsap.fromTo(
          overlayRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo(
          drawerRef.current,
          { x: '100%' },
          { x: '0%', duration: 0.45, ease: 'power3.out' }
        );
      }
    }
  }, [rendered, prefersReducedMotion, isClosing]);

  if (!rendered) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label="Filter parameters"
      className="fixed inset-0 z-70 bg-ink/80 backdrop-blur-md flex justify-end"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        ref={drawerRef}
        className="w-full sm:max-w-md h-full bg-panel-raised border-l border-line-strong flex flex-col shadow-2xl relative overflow-hidden will-change-transform"
      >
        {/* Ambient top glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* Drawer Header */}
        <div className="p-5 border-b border-line flex items-center justify-between gap-4 bg-panel/70 backdrop-blur-md shrink-0 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="mono-label text-accent text-xs font-semibold tracking-wider">
              FILTERS // PARAMETERS & STACK
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => {
                  playSelectSound();
                  onClearFilters();
                }}
                onMouseEnter={playHoverSound}
                className="text-xs font-mono text-text-muted hover:text-accent transition-colors px-2 py-1 cursor-pointer"
              >
                Reset
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              onMouseEnter={playHoverSound}
              className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-text-muted hover:border-accent hover:text-accent transition-colors cursor-pointer"
              aria-label="Close filters drawer"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Category Domain */}
          <div>
            <p className="mono-label text-xs text-text-muted mb-2.5">
              1. DOMAINS & DISCIPLINES
            </p>
            <div className="flex flex-wrap gap-2">
              {PROJECT_CATEGORIES.map((cat) => {
                const isSelected = filters.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      onCategorySelect(cat);
                    }}
                    onMouseEnter={playHoverSound}
                    className={`text-xs rounded-xl px-3 py-1.5 font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-accent text-ink font-semibold border-accent shadow-sm'
                        : 'bg-panel border-line text-text-muted hover:border-line-strong hover:text-text'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1 rounded ${
                        isSelected ? 'bg-ink/20 text-ink' : 'bg-line text-text-dim'
                      }`}
                    >
                      {categoryCounts[cat] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Technology Stack Tags */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="mono-label text-xs text-text-muted">
                2. STACK & TECHNOLOGIES ({filters.technologies.length} active)
              </p>
              {filters.technologies.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    onClearTech();
                  }}
                  onMouseEnter={playHoverSound}
                  className="text-accent text-[11px] font-mono hover:underline cursor-pointer"
                >
                  Clear stack
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_PROJECT_TECHNOLOGIES.map((tech) => {
                const isSelected = filters.technologies.includes(tech);
                const iconId = getTechIconId(tech);
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      onTechToggle(tech);
                    }}
                    onMouseEnter={playHoverSound}
                    className={`text-xs rounded-lg px-2.5 py-1.5 font-mono transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isSelected
                        ? 'bg-accent/20 border-accent text-accent font-medium shadow-[0_0_10px_rgba(229,160,75,0.2)]'
                        : 'bg-panel border-line text-text-muted hover:border-line-strong hover:text-text'
                    }`}
                  >
                    <TechIcon id={iconId} size={12} className="shrink-0" />
                    <span>{tech}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="mono-label text-xs text-text-muted mb-2.5">
              3. PROJECT STATUS
            </p>
            <div className="flex flex-wrap gap-2">
              {PROJECT_STATUSES.map((st) => {
                const isSelected = filters.status === st.value;
                return (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      onStatusSelect(st.value);
                    }}
                    onMouseEnter={playHoverSound}
                    className={`text-xs rounded-xl px-3 py-1.5 font-mono transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-accent/15 border-accent text-accent font-semibold'
                        : 'bg-panel border-line text-text-muted hover:border-line-strong hover:text-text'
                    }`}
                  >
                    {st.value === 'live' && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                    )}
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-line bg-panel/80 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
          <span className="text-xs font-mono text-text-dim">
            {filteredCount} matching builds
          </span>
          <button
            type="button"
            onClick={handleClose}
            onMouseEnter={playHoverSound}
            className="bg-accent text-ink font-semibold px-5 py-2 rounded-xl text-xs font-mono hover:bg-accent-hover transition-all cursor-pointer shadow-md"
          >
            Apply & View ({filteredCount})
          </button>
        </div>
      </div>
    </div>
  );
}
