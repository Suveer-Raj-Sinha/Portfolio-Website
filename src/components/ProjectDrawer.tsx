import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import type { Project } from '../data/projects';
import { Magnetic } from './Magnetic';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { playDrawerSound, playSuccessSound } from '../utils/audio';
import { showToast } from '../hooks/useToast';

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDrawer({ project: requestedProject, onClose }: ProjectDrawerProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const [renderedProject, setRenderedProject] = useState<Project | null>(requestedProject);
  const [isClosing, setIsClosing] = useState(false);
  const { prefersReducedMotion } = useDeviceCapability();

  useEffect(() => {
    if (requestedProject) {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      playDrawerSound();
      setRenderedProject(requestedProject);
      setIsClosing(false);
    } else if (renderedProject && !isClosing) {
      setIsClosing(true);
      closeTimeoutRef.current = window.setTimeout(() => {
        closeTimeoutRef.current = null;
        setRenderedProject(null);
        setIsClosing(false);
      }, prefersReducedMotion ? 0 : 350);
    }
  }, [requestedProject, renderedProject, isClosing, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    if (!renderedProject || isClosing) return;

    if (prefersReducedMotion) {
      onClose();
      return;
    }

    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      closeTimeoutRef.current = null;
      setRenderedProject(null);
      setIsClosing(false);
    }, 350);
    onClose();
  }, [renderedProject, isClosing, prefersReducedMotion, onClose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && renderedProject) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [renderedProject, handleClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (renderedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [renderedProject]);

  // GSAP animation for open / close
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (renderedProject) {
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
        gsap.fromTo(overlayRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'power2.out' });
        gsap.fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.45, ease: 'power3.out' });
      }
    }
  }, [renderedProject, prefersReducedMotion, isClosing]);

  if (!renderedProject) return null;

  const project = renderedProject;
  const { caseStudy } = project;

  const badgeDotColor =
    project.statusBadge?.color === 'emerald'
      ? 'bg-emerald-400'
      : project.statusBadge?.color === 'amber'
      ? 'bg-amber-400'
      : 'bg-cyan-400';

  return (
    <div
      id="project-drawer"
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-70 bg-ink/80 backdrop-blur-md flex justify-end transition-colors"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div
        ref={drawerRef}
        className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-full bg-panel-raised border-l border-line-strong flex flex-col shadow-2xl relative overflow-hidden will-change-transform"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        {/* HUD Top Bar */}
        <div className="p-4 sm:p-6 border-b border-line flex items-center justify-between gap-4 shrink-0 bg-panel/70 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <span className="mono-label text-accent text-xs font-semibold tracking-wider">
              SPEC // {project.index}
            </span>
            <span className="text-line-strong">•</span>
            {project.statusBadge && (
              <span className="mono-label text-[10px] px-2.5 py-0.5 rounded-full border border-line bg-ink/70 flex items-center gap-1.5">
                <span className={'w-1.5 h-1.5 rounded-full ' + badgeDotColor + ' animate-pulse'} />
                <span className="text-text-muted">{project.statusBadge.text}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const slug = project.name.toLowerCase().replace(/\s+/g, '-');
                const shareUrl = `${window.location.origin}/#${slug}`;
                navigator.clipboard.writeText(shareUrl);
                playSuccessSound();
                showToast(`Share link copied: /#${slug}`, 'success');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line hover:border-accent bg-panel hover:bg-panel-raised text-[11px] mono-label text-text-muted hover:text-accent transition-colors cursor-pointer"
              title="Copy direct share link for this case study"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="hidden sm:inline">Share Specs</span>
            </button>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={handleClose}
              className="w-9 h-9 rounded-lg border border-line hover:border-accent bg-panel hover:bg-panel-raised flex items-center justify-center text-text-muted hover:text-accent transition-colors cursor-pointer group"
              aria-label="Close project case study drawer"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 relative z-10 text-text scroll-smooth">
          {/* Header Banner */}
          <div>
            <p className="mono-label text-xs text-text-dim mb-1">{project.category}</p>
            <h2 id="drawer-title" className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              {project.name}
            </h2>
            <p className="text-accent text-sm sm:text-base font-medium mb-4 leading-relaxed">
              {caseStudy.headline}
            </p>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Quick Action Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {project.liveUrl && (
                <Magnetic
                  href={project.liveUrl}
                  className="bg-accent text-ink font-medium px-4 py-2 rounded-xl text-xs hover:bg-accent-dim transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Launch Live Platform</span>
                  <span>&rarr;</span>
                </Magnetic>
              )}
              <Magnetic
                href={project.codeUrl}
                className="border border-line-strong hover:border-accent px-4 py-2 rounded-xl text-xs text-text-muted hover:text-accent transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub Source</span>
              </Magnetic>
            </div>
          </div>

          {/* Section 1: Telemetry & Metrics */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <h3 className="mono-label text-accent text-xs font-semibold tracking-wider">
                01 // PERFORMANCE TELEMETRY
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {caseStudy.metrics.map((m) => (
                <div
                  key={m.label}
                  className="p-3 rounded-xl border border-line bg-panel/50 backdrop-blur-xs"
                >
                  <span className="mono-label text-[10px] text-text-dim block mb-0.5">
                    {m.label.toUpperCase()}
                  </span>
                  <span className="font-mono font-bold text-base sm:text-lg text-accent block leading-tight">
                    {m.value}
                  </span>
                  <span className="text-[10px] text-text-muted block mt-1 leading-tight">
                    {m.detail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Feature Highlights */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <h3 className="mono-label text-accent text-xs font-semibold tracking-wider">
                02 // FEATURE HIGHLIGHTS
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {caseStudy.features.map((feature) => (
                <div
                  key={feature.name}
                  className="p-4 rounded-xl border border-line bg-panel/40 backdrop-blur-xs"
                >
                  <h4 className="text-xs sm:text-sm text-text font-medium mb-1.5">
                    {feature.name}
                  </h4>
                  <p className="text-xs text-text-muted leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Architecture & Data Flow */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <h3 className="mono-label text-accent text-xs font-semibold tracking-wider">
                02 // SYSTEM ARCHITECTURE & DATA FLOW
              </h3>
            </div>

            <div className="p-4 sm:p-5 rounded-xl border border-line bg-panel/40 backdrop-blur-xs space-y-4">
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                {caseStudy.architectureOverview}
              </p>

              {/* Data Pipeline Steps */}
              <div className="space-y-2 pt-2 border-t border-line/50">
                <span className="mono-label text-[10px] text-text-dim block mb-2">
                  PIPELINE FLOW SEQUENCE:
                </span>
                {caseStudy.dataPipeline.map((step, idx) => (
                  <div key={step} className="flex items-start gap-3 text-xs">
                    <span className="mono-label text-[10px] px-1.5 py-0.5 rounded bg-ink border border-line text-accent shrink-0 font-mono mt-0.5">
                      0{idx + 1}
                    </span>
                    <span className="text-text-muted font-mono leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Engineering Challenges & Solutions */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <h3 className="mono-label text-accent text-xs font-semibold tracking-wider">
                03 // ENGINEERING CHALLENGES & SOLUTIONS
              </h3>
            </div>

            <div className="space-y-3.5">
              {caseStudy.challenges.map((c, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-xl border border-line bg-panel/40 backdrop-blur-xs space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="mono-label text-[9px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/30 font-medium shrink-0 mt-0.5">
                      CHALLENGE
                    </span>
                    <p className="text-xs sm:text-sm text-text font-medium leading-relaxed">
                      {c.problem}
                    </p>
                  </div>

                  <div className="pl-3.5 border-l-2 border-accent/40 space-y-1.5 mt-2">
                    <p className="text-xs text-text-muted leading-relaxed">
                      <strong className="text-accent font-medium">Solution: </strong>
                      {c.solution}
                    </p>
                    <p className="text-xs text-emerald-400/90 leading-relaxed font-mono">
                      <strong className="text-emerald-400 font-medium">Impact: </strong>
                      {c.impact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Tech Stack Matrix */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <h3 className="mono-label text-accent text-xs font-semibold tracking-wider">
                04 // FULL TECHNOLOGY MATRIX
              </h3>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {caseStudy.techBreakdown.map((group) => (
                <div
                  key={group.category}
                  className="p-3.5 rounded-xl border border-line bg-panel/30"
                >
                  <span className="mono-label text-[10px] text-text-dim block mb-2">
                    {group.category.toUpperCase()}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((tech) => (
                      <span
                        key={tech}
                        className="mono-label text-[10px] px-2 py-0.5 rounded-md border border-line/60 bg-ink/50 text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-line flex items-center justify-between gap-3 shrink-0 bg-panel/80 backdrop-blur-md relative z-10">
          <span className="mono-label text-[10px] text-text-dim">
            CONFIDENTIAL // SYSTEM ARCHITECTURE BRIEF
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="mono-label text-xs text-text-muted hover:text-accent transition-colors px-3 py-1.5 rounded-lg border border-line/60 hover:border-accent cursor-pointer"
          >
            CLOSE DRAWER [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
