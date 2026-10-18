import React, { useState, useRef, useEffect } from 'react';
import {
  TECH_BRANCHES,
  CENTER_NODE,
  ALL_TECHNOLOGIES,
  VB_W,
  VB_H,
  type TechnologyItem,
  type TechCategoryId,
} from '../data/technologies';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { triggerOpenProject } from '../utils/events';
import { playHoverSound, playSelectSound } from '../utils/audio';
import { TechIcon } from './TechIcons';

// Helper to generate smooth cubic bezier paths for SVG wiring
function getPath(x1: number, y1: number, x2: number, y2: number) {
  if (Math.abs(x1 - x2) < 0.1) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

export function SkillGraph() {
  const { ready } = useDeviceCapability();
  const [activeGroup, setActiveGroup] = useState<TechCategoryId | null>(null);
  const [hoveredTech, setHoveredTech] = useState<TechnologyItem | null>(null);
  const [pinnedTech, setPinnedTech] = useState<TechnologyItem | null>(null);
  const [mobileSelectedTech, setMobileSelectedTech] = useState<TechnologyItem | null>(null);
  const [mobileExpandedBranch, setMobileExpandedBranch] = useState<TechCategoryId | null>(null);

  // Active technology displayed in contextual popover
  const activeTech = hoveredTech || pinnedTech;

  const leaveTimeoutRef = useRef<number | null>(null);

  const clearLeaveTimeout = () => {
    if (leaveTimeoutRef.current !== null) {
      window.clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
  };

  const handleNodeMouseEnter = (tech: TechnologyItem, branchId: TechCategoryId) => {
    clearLeaveTimeout();
    setHoveredTech(tech);
    setActiveGroup(branchId);
    playHoverSound();
  };

  const handleNodeMouseLeave = () => {
    clearLeaveTimeout();
    leaveTimeoutRef.current = window.setTimeout(() => {
      setHoveredTech(null);
    }, 260);
  };

  const handleCardMouseEnter = () => {
    clearLeaveTimeout();
  };

  const handleCardMouseLeave = () => {
    clearLeaveTimeout();
    leaveTimeoutRef.current = window.setTimeout(() => {
      setHoveredTech(null);
    }, 200);
  };

  useEffect(() => {
    return () => clearLeaveTimeout();
  }, []);

  if (!ready) return null;

  // Intelligently compute popover position in empty space (on top or to the side)
  const getSmartPopoverStyle = (tech: TechnologyItem): React.CSSProperties => {
    // 1. Bottom sector nodes -> Appear ON TOP in the empty space above
    if (tech.y >= 460) {
      const bottomPercent = ((VB_H - tech.y + 22) / VB_H) * 100;
      const leftPercent = Math.min(Math.max((tech.x / VB_W) * 100, 15), 85);
      return {
        bottom: `${bottomPercent}%`,
        left: `${leftPercent}%`,
        transform: 'translateX(-50%)',
      };
    }

    // 2. Top sector nodes -> Appear ON BOTTOM in the empty space below
    if (tech.y <= 160) {
      const topPercent = ((tech.y + 24) / VB_H) * 100;
      const leftPercent = Math.min(Math.max((tech.x / VB_W) * 100, 15), 85);
      return {
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        transform: 'translateX(-50%)',
      };
    }

    // 3. Far-left nodes -> Appear to the RIGHT in the empty space toward the center
    if (tech.x <= 280) {
      const leftPercent = ((tech.x + 36) / VB_W) * 100;
      const topPercent = Math.min(Math.max(((tech.y - 35) / VB_H) * 100, 6), 70);
      return {
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
      };
    }

    // 4. Far-right nodes -> Appear to the LEFT in the empty space toward the center
    if (tech.x >= 920) {
      const rightPercent = ((VB_W - tech.x + 36) / VB_W) * 100;
      const topPercent = Math.min(Math.max(((tech.y - 35) / VB_H) * 100, 6), 70);
      return {
        right: `${rightPercent}%`,
        top: `${topPercent}%`,
      };
    }

    // 5. Mid-left inner nodes (CSS, Express, Firebase Storage) -> Appear to the top or right
    if (tech.x < 600) {
      const leftPercent = ((tech.x + 28) / VB_W) * 100;
      const topPercent = Math.min(Math.max(((tech.y - 45) / VB_H) * 100, 6), 70);
      return {
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
      };
    }

    // 6. Mid-right inner nodes (Rust, AI Dev Tools, VS Code, R) -> Appear to the left or top
    const rightPercent = ((VB_W - tech.x + 28) / VB_W) * 100;
    const topPercent = Math.min(Math.max(((tech.y - 45) / VB_H) * 100, 6), 70);
    return {
      right: `${rightPercent}%`,
      top: `${topPercent}%`,
    };
  };

  return (
    <div className="w-full">
      {/* DESKTOP VIEW (>= lg): One Big Tree with Smart Popovers in Empty Space */}
      <div
        className="hidden lg:block relative w-full rounded-2xl border border-line bg-panel/30 backdrop-blur-sm p-4 overflow-hidden shadow-2xl"
        onMouseLeave={() => {
          if (!pinnedTech) {
            setActiveGroup(null);
          }
          handleNodeMouseLeave();
        }}
      >
        {/* Ambient Technical Dot Grid */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--color-accent) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Top CAD Bar */}
        <div className="relative flex items-center justify-between pb-2 border-b border-line/60 font-mono text-xs select-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
            <span className="text-text font-bold tracking-wider">
              SYS_MAP // ONE COMPREHENSIVE TECHNOLOGY TREE
            </span>
            <span className="text-text-dim text-[11px] hidden sm:inline">
              | 6 BRANCHES • {ALL_TECHNOLOGIES.length} NODES
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-text-dim">
            <span>[ HOVER TO INSPECT • CLICK TO PIN ]</span>
            {pinnedTech && (
              <button
                type="button"
                onClick={() => {
                  setPinnedTech(null);
                  setActiveGroup(null);
                }}
                className="text-accent hover:underline cursor-pointer font-semibold"
              >
                UNPIN [✕]
              </button>
            )}
          </div>
        </div>

        {/* Constellation Canvas: All 6 Branches Visible Simultaneously */}
        <div className="relative w-full aspect-[1200/680] my-2 select-none">
          {/* SVG layer: Wiring lines with preserveAspectRatio="none" to guarantee 100% alignment */}
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <filter
                id="branchGlow"
                filterUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={VB_W}
                height={VB_H}
              >
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <style>{`
                @keyframes branchPulseFlow {
                  0% {
                    stroke-dashoffset: 28;
                    opacity: 0.45;
                  }
                  50% {
                    opacity: 1;
                  }
                  100% {
                    stroke-dashoffset: 0;
                    opacity: 0.45;
                  }
                }
                @keyframes branchBreathe {
                  0%, 100% {
                    stroke-width: 1.8px;
                  }
                  50% {
                    stroke-width: 2.8px;
                  }
                }
                .branch-pulse-active {
                  animation: branchBreathe 2s ease-in-out infinite, branchPulseFlow 1.4s linear infinite;
                }
              `}</style>
            </defs>

            {/* Backbone Lines: Center Core to the 6 Symmetrical Hubs */}
            {TECH_BRANCHES.map((b) => {
              const isSelected = activeGroup === b.id;
              const isDimmed = activeGroup !== null && !isSelected;

              return (
                <g key={`core-path-${b.id}`}>
                  <path
                    d={getPath(CENTER_NODE.x, CENTER_NODE.y, b.x, b.y)}
                    fill="none"
                    stroke={isSelected ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                    strokeWidth={isSelected ? 1.8 : 1}
                    strokeDasharray={isSelected ? 'none' : '4 4'}
                    className="transition-all duration-300"
                    opacity={isSelected ? 0.95 : isDimmed ? 0.08 : 0.28}
                  />

                  {isSelected && (
                    <path
                      d={getPath(CENTER_NODE.x, CENTER_NODE.y, b.x, b.y)}
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth={2.4}
                      strokeDasharray="8 12"
                      strokeLinecap="round"
                      filter="url(#branchGlow)"
                      className="branch-pulse-active"
                    />
                  )}
                </g>
              );
            })}

            {/* Sub-node Connecting Lines: Hubs to Technology Nodes */}
            {TECH_BRANCHES.map((b) => {
              const isBranchSelected = activeGroup === b.id;
              const isDimmed = activeGroup !== null && !isBranchSelected;

              return (
                <g key={`sub-paths-${b.id}`}>
                  {b.technologies.map((tech) => {
                    const isTechActive = activeTech?.id === tech.id;

                    return (
                      <g key={`path-${tech.id}`}>
                        <path
                          d={getPath(b.x, b.y, tech.x, tech.y)}
                          fill="none"
                          stroke={
                            isTechActive
                              ? 'var(--color-accent)'
                              : isBranchSelected
                              ? 'var(--color-accent)'
                              : 'var(--color-line)'
                          }
                          strokeWidth={isTechActive ? 2.4 : isBranchSelected ? 1.4 : 1}
                          className="transition-all duration-300"
                          opacity={
                            isTechActive
                              ? 1
                              : isBranchSelected
                              ? 0.85
                              : isDimmed
                              ? 0.06
                              : 0.2
                          }
                        />

                        {isBranchSelected && (
                          <path
                            d={getPath(b.x, b.y, tech.x, tech.y)}
                            fill="none"
                            stroke="var(--color-accent)"
                            strokeWidth={isTechActive ? 2.5 : 1.4}
                            strokeDasharray="6 10"
                            strokeLinecap="round"
                            filter="url(#branchGlow)"
                            className="branch-pulse-active"
                          />
                        )}

                        <circle
                          cx={tech.x}
                          cy={tech.y}
                          r={isTechActive ? 3.5 : isBranchSelected ? 2.5 : 1.5}
                          fill={isBranchSelected ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                          className="transition-all duration-300"
                          opacity={isBranchSelected ? 1 : isDimmed ? 0.12 : 0.3}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* Central Core Stack Engine Node */}
          <div
            className="absolute flex flex-col items-center justify-center w-26 h-26 rounded-full border border-accent/40 bg-ink/95 backdrop-blur-md shadow-2xl pointer-events-auto select-none transition-transform duration-300 hover:scale-105 z-25"
            style={{
              left: `${(CENTER_NODE.x / VB_W) * 100}%`,
              top: `${(CENTER_NODE.y / VB_H) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="relative flex items-center justify-center w-5 h-5 mb-0.5">
              <div className="absolute inset-0 rounded-full border border-accent/40 animate-ping opacity-40" />
              <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)] animate-pulse" />
            </div>
            <span className="mono-label text-[10px] font-bold text-accent tracking-widest text-center px-1">
              {CENTER_NODE.label}
            </span>
            <span className="text-[9px] text-text-dim text-center">
              {CENTER_NODE.sublabel}
            </span>
          </div>

          {/* 6 Category Hub Nodes */}
          {TECH_BRANCHES.map((b) => {
            const isSelected = activeGroup === b.id;
            const isDimmed = activeGroup !== null && !isSelected;

            return (
              <button
                key={`hub-${b.id}`}
                type="button"
                onClick={() => {
                  playSelectSound();
                  setActiveGroup(isSelected ? null : b.id);
                }}
                onMouseEnter={() => {
                  setActiveGroup(b.id);
                  playHoverSound();
                }}
                className={`absolute px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 pointer-events-auto shadow-lg flex items-center gap-2 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  isSelected
                    ? 'bg-accent text-ink border-accent scale-105 shadow-[0_0_20px_rgba(217,142,63,0.4)] z-30'
                    : isDimmed
                    ? 'bg-panel/60 border-line/60 text-text-muted z-10 opacity-35'
                    : 'bg-panel border-line text-text hover:border-accent hover:text-accent z-20'
                }`}
                style={{
                  left: `${(b.x / VB_W) * 100}%`,
                  top: `${(b.y / VB_H) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                aria-label={`${b.label} branch category with ${b.technologies.length} technologies`}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isSelected ? 'bg-ink' : 'bg-accent shadow-[0_0_6px_var(--color-accent)]'
                  }`}
                />
                <span>{b.shortLabel}</span>
                <span
                  className={`text-[10px] font-mono px-1 rounded ${
                    isSelected ? 'bg-ink/20 text-ink font-bold' : 'text-text-dim'
                  }`}
                >
                  {String(b.technologies.length).padStart(2, '0')}
                </span>
              </button>
            );
          })}

          {/* Technology Nodes: Permanently Visible Brand Logo + Name (Zero Overlaps) */}
          {TECH_BRANCHES.map((b) => {
            const isBranchActive = activeGroup === b.id;
            const isDimmed = activeGroup !== null && !isBranchActive;

            return b.technologies.map((tech) => {
              const isHovered = hoveredTech?.id === tech.id;
              const isPinned = pinnedTech?.id === tech.id;
              const isActive = isHovered || isPinned;

              return (
                <button
                  key={`tech-node-${tech.id}`}
                  type="button"
                  onMouseEnter={() => handleNodeMouseEnter(tech, b.id)}
                  onMouseLeave={handleNodeMouseLeave}
                  onFocus={() => handleNodeMouseEnter(tech, b.id)}
                  onBlur={handleNodeMouseLeave}
                  onClick={() => {
                    playSelectSound();
                    if (pinnedTech?.id === tech.id) {
                      setPinnedTech(null);
                    } else {
                      setPinnedTech(tech);
                      setActiveGroup(b.id);
                    }
                  }}
                  className={`absolute px-2.5 py-1 rounded-lg border text-xs font-mono transition-all duration-200 pointer-events-auto whitespace-nowrap select-none flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent cursor-pointer ${
                    isActive
                      ? 'bg-ink border-accent text-accent scale-105 shadow-[0_0_16px_rgba(217,142,63,0.35)] z-40'
                      : isBranchActive
                      ? 'bg-ink/95 border-line-strong text-text hover:border-accent hover:text-accent z-20'
                      : isDimmed
                      ? 'bg-ink/35 border-line/30 text-text-dim/35 opacity-30 z-10'
                      : 'bg-ink/80 border-line/70 text-text-muted hover:border-accent hover:text-text z-10'
                  }`}
                  style={{
                    left: `${(tech.x / VB_W) * 100}%`,
                    top: `${(tech.y / VB_H) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  aria-label={`${tech.name}: ${tech.description}`}
                >
                  <TechIcon id={tech.iconId} size={14} className="shrink-0" />
                  <span className="font-medium text-[11px]">{tech.name}</span>

                  {tech.status === 'learning' && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_6px_var(--color-accent)]"
                      title="Currently learning"
                    />
                  )}

                  {isPinned && (
                    <span className="w-1 h-1 rounded-full bg-accent" />
                  )}
                </button>
              );
            });
          })}

          {/* DYNAMIC CONTEXTUAL DETAIL CARD (Positioned on top / side where empty space is) */}
          {activeTech && (
            <div
              onMouseEnter={handleCardMouseEnter}
              onMouseLeave={handleCardMouseLeave}
              className="absolute w-72 sm:w-80 rounded-xl bg-panel/95 backdrop-blur-md border border-accent/60 p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(217,142,63,0.2)] z-50 pointer-events-auto transition-all duration-200 animate-in fade-in zoom-in-95"
              style={getSmartPopoverStyle(activeTech)}
            >
              {/* Corner CAD Reticles */}
              <span className="absolute top-1.5 left-1.5 font-mono text-[9px] text-accent/50 pointer-events-none">
                ┌
              </span>
              <span className="absolute top-1.5 right-1.5 font-mono text-[9px] text-accent/50 pointer-events-none">
                ┐
              </span>
              <span className="absolute bottom-1.5 left-1.5 font-mono text-[9px] text-accent/50 pointer-events-none">
                └
              </span>
              <span className="absolute bottom-1.5 right-1.5 font-mono text-[9px] text-accent/50 pointer-events-none">
                ┘
              </span>

              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-line/70 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-ink border border-accent/40 flex items-center justify-center">
                    <TechIcon id={activeTech.iconId} size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-xs leading-tight">
                      {activeTech.name}
                    </h4>
                    <span className="mono-label text-[8px] text-accent/80 uppercase tracking-wider block">
                      BRANCH // {activeTech.category}
                    </span>
                  </div>
                </div>

                {activeTech.statusLabel && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                      activeTech.status === 'learning'
                        ? 'bg-accent/20 border-accent text-accent font-semibold animate-pulse shadow-[0_0_8px_rgba(217,142,63,0.3)]'
                        : activeTech.status === 'dsa'
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400 font-medium'
                        : 'bg-ink/80 border-line text-text-dim'
                    }`}
                  >
                    {activeTech.statusLabel}
                  </span>
                )}
              </div>

              {/* Description Body */}
              <p className="text-xs text-text-muted leading-relaxed mb-2.5">
                {activeTech.description}
              </p>

              {/* Verified Project Links */}
              {activeTech.relatedProjects && activeTech.relatedProjects.length > 0 && (
                <div className="pt-2 border-t border-line/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="mono-label text-[8px] text-text-dim tracking-wider uppercase">
                      VERIFIED WORK:
                    </span>
                    <span className="text-[8px] text-accent/80 font-mono">
                      {activeTech.relatedProjects.length} LINKED
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {activeTech.relatedProjects.map((proj) => (
                      <button
                        key={proj.name}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playSelectSound();
                          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                          setTimeout(() => triggerOpenProject(proj.name), 350);
                        }}
                        className="text-[10px] font-mono bg-accent/15 hover:bg-accent hover:text-ink text-accent px-2 py-0.5 rounded border border-accent/40 transition-all flex items-center gap-1 cursor-pointer"
                        title={`Open architecture case study for ${proj.name}`}
                      >
                        <span>{proj.name}</span>
                        <span className="text-[9px] opacity-75">[{proj.tag}]</span>
                        <span aria-hidden="true">&rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Ambient Telemetry Readout Footnote */}
        <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-text-dim border-t border-line/50 pt-2 select-none">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-text-muted">
              Hover over any node to reveal its architectural specs in adjacent empty space. Click to pin.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span>6 BRANCHES</span>
            <span>•</span>
            <span className="text-accent/80">{ALL_TECHNOLOGIES.length} SYSTEM NODES</span>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET VIEW (< lg): Vertical Hierarchical Stack with Tree Metaphor */}
      <div className="lg:hidden space-y-4">
        {/* Core Stack Master Node */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-accent/40 bg-panel/80 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-4 h-4">
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)] animate-pulse" />
              <span className="absolute inset-0 rounded-full border border-accent animate-ping opacity-40" />
            </div>
            <div>
              <span className="mono-label text-[11px] font-bold text-accent tracking-widest block">
                {CENTER_NODE.label} // ENGINE
              </span>
              <span className="text-[10px] text-text-dim">
                6 Connected Branches • Tap any technology to inspect
              </span>
            </div>
          </div>
          <span className="mono-label text-[10px] px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/30 font-semibold">
            {ALL_TECHNOLOGIES.length} NODES
          </span>
        </div>

        {/* 6 Vertical Branches with Left Tree Spine */}
        <div className="relative pl-4 sm:pl-5 border-l-2 border-line space-y-3.5">
          {TECH_BRANCHES.map((branch) => {
            const isBranchActive =
              activeGroup === branch.id || mobileExpandedBranch === branch.id;

            return (
              <div
                key={`mob-branch-${branch.id}`}
                className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${
                  isBranchActive ? 'border-accent/60 bg-panel/70' : 'border-line bg-panel/20'
                }`}
              >
                {/* Tree Connector Node on Left Spine */}
                <span
                  className={`absolute -left-[21px] sm:-left-[25px] top-4 w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                    isBranchActive
                      ? 'border-accent bg-ink shadow-[0_0_8px_var(--color-accent)]'
                      : 'border-line-strong bg-ink'
                  }`}
                />

                {/* Branch Header */}
                <button
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    setMobileExpandedBranch(isBranchActive ? null : branch.id);
                    setActiveGroup(isBranchActive ? null : branch.id);
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isBranchActive ? 'bg-accent shadow-[0_0_6px_var(--color-accent)]' : 'bg-line-strong'
                      }`}
                    />
                    <span className="font-semibold text-text text-xs sm:text-sm">
                      {branch.label}
                    </span>
                  </div>
                  <span className="mono-label text-[10px] text-text-dim">
                    {String(branch.technologies.length).padStart(2, '0')}
                  </span>
                </button>

                {/* Technology Chips Grid */}
                <div className="px-3.5 pb-3.5 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {branch.technologies.map((tech) => {
                      const isSelected = mobileSelectedTech?.id === tech.id;

                      return (
                        <button
                          key={`mob-tech-${tech.id}`}
                          type="button"
                          onClick={() => {
                            playSelectSound();
                            setMobileSelectedTech(isSelected ? null : tech);
                            setActiveGroup(branch.id);
                          }}
                          className={`px-2.5 py-1 rounded-md border text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-accent/20 border-accent text-accent font-semibold shadow-[0_0_10px_rgba(217,142,63,0.25)]'
                              : 'bg-ink border-line text-text-muted hover:border-accent hover:text-text'
                          }`}
                        >
                          <TechIcon id={tech.iconId} size={13} className="shrink-0" />
                          <span>{tech.name}</span>
                          {tech.status === 'learning' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Inline Detail Panel for Active Technology on Mobile */}
                  {mobileSelectedTech &&
                    branch.technologies.some((t) => t.id === mobileSelectedTech.id) && (
                      <div className="mt-3 p-3 rounded-lg bg-ink/90 border border-accent/50 text-xs space-y-2 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-line/60 pb-1.5">
                          <div className="flex items-center gap-2">
                            <TechIcon id={mobileSelectedTech.iconId} size={15} />
                            <span className="font-semibold text-text">
                              {mobileSelectedTech.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {mobileSelectedTech.statusLabel && (
                              <span
                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase ${
                                  mobileSelectedTech.status === 'learning'
                                    ? 'bg-accent/20 border-accent text-accent animate-pulse font-semibold'
                                    : 'bg-panel border-line text-text-dim'
                                }`}
                              >
                                {mobileSelectedTech.statusLabel}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setMobileSelectedTech(null)}
                              className="text-text-dim hover:text-accent font-mono text-xs px-1"
                              aria-label="Close detail panel"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        <p className="text-text-muted leading-relaxed text-[11px]">
                          {mobileSelectedTech.description}
                        </p>

                        {mobileSelectedTech.relatedProjects &&
                          mobileSelectedTech.relatedProjects.length > 0 && (
                            <div className="pt-2 border-t border-line/50">
                              <span className="mono-label text-[9px] text-text-dim uppercase tracking-wider block mb-1">
                                LINKED PROJECTS:
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {mobileSelectedTech.relatedProjects.map((proj) => (
                                  <button
                                    key={proj.name}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      playSelectSound();
                                      document
                                        .getElementById('projects')
                                        ?.scrollIntoView({ behavior: 'smooth' });
                                      setTimeout(() => triggerOpenProject(proj.name), 350);
                                    }}
                                    className="text-[10px] font-mono bg-accent/15 text-accent px-2 py-0.5 rounded border border-accent/40"
                                  >
                                    {proj.name} ↗
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
