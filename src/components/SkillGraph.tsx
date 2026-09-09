import { useState } from 'react';
import { skillGroups } from '../data/profile';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { triggerOpenProject } from '../utils/events';
import { playHoverSound, playSelectSound } from '../utils/audio';

// Skill to Project Cross-Referencing Map
const SKILL_PROJECT_MAP: Record<string, { name: string; tag: string }[]> = {
  'fe-0': [{ name: 'Terra Live', tag: 'Vector Dashboard' }], // React.js
  'fe-1': [
    { name: 'Terra Live', tag: 'Full-Stack' },
    { name: 'Solaris', tag: '3D Simulation' },
    { name: 'WebLens', tag: 'AI Vision' },
  ], // TypeScript
  'fe-2': [{ name: 'Solaris', tag: 'InstancedMesh WebGL' }], // Three.js & R3F
  'fe-3': [{ name: 'WebLens', tag: 'Chrome MV3' }], // JavaScript
  'fe-4': [{ name: 'Terra Live', tag: 'HUD Layout' }], // Tailwind CSS
  'be-1': [
    { name: 'Terra Live', tag: 'FastAPI Stream' },
    { name: 'WebLens', tag: 'Gemini Backend' },
  ], // Python & FastAPI
  'be-4': [{ name: 'Terra Live', tag: 'LRU Spatial Cache' }], // SQLite
  'be-5': [{ name: 'Terra Live', tag: 'GeoJSON REST' }, { name: 'WebLens', tag: 'Vision API' }], // REST APIs
  'mo-0': [{ name: 'WebLens', tag: 'Screen Intelligence' }], // Chrome Extension APIs
  'mo-3': [{ name: 'Solaris', tag: 'Rayleigh Scattering' }], // GLSL Shaders
  'mo-4': [{ name: 'Terra Live', tag: 'VCS & CI' }, { name: 'Solaris', tag: 'Repo' }, { name: 'WebLens', tag: 'Repo' }], // Git & GitHub
};

// Precision layout coordinates for 1000 x 560 viewBox
// Balanced 16:9 widescreen ratio that fits inside a single scroll-snap viewport
const VB_W = 1000;
const VB_H = 560;

const CENTER_NODE = { x: 500, y: 275, label: 'CORE STACK' };

interface SubNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface GroupConfig {
  id: string;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  subs: SubNode[];
}

const GRAPH_LAYOUT: GroupConfig[] = [
  {
    id: 'frontend',
    label: 'Frontend Development',
    shortLabel: 'Frontend',
    x: 500,
    y: 145,
    subs: [
      { id: 'fe-0', label: 'React.js', x: 170, y: 80 },
      { id: 'fe-1', label: 'TypeScript', x: 330, y: 48 },
      { id: 'fe-2', label: 'Three.js & R3F', x: 500, y: 38 },
      { id: 'fe-3', label: 'JavaScript (ES6+)', x: 670, y: 48 },
      { id: 'fe-4', label: 'Tailwind CSS', x: 830, y: 80 },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Data',
    shortLabel: 'Backend & Data',
    x: 270,
    y: 350,
    subs: [
      { id: 'be-0', label: 'Node.js & Express.js', x: 110, y: 255 },
      { id: 'be-1', label: 'Python & FastAPI', x: 80, y: 335 },
      { id: 'be-2', label: 'MongoDB', x: 95, y: 415 },
      { id: 'be-3', label: 'Firebase & Firestore', x: 155, y: 490 },
      { id: 'be-4', label: 'SQLite', x: 275, y: 525 },
      { id: 'be-5', label: 'REST APIs', x: 395, y: 475 },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile & Additional',
    shortLabel: 'Mobile & Tools',
    x: 730,
    y: 350,
    subs: [
      { id: 'mo-0', label: 'Chrome Extension APIs', x: 890, y: 255 },
      { id: 'mo-1', label: 'Flutter & Dart', x: 920, y: 335 },
      { id: 'mo-2', label: 'Kotlin & Java', x: 905, y: 415 },
      { id: 'mo-3', label: 'GLSL Shaders', x: 845, y: 490 },
      { id: 'mo-4', label: 'Git & GitHub', x: 725, y: 525 },
    ],
  },
];

// Helper to generate paths — uses straight L for vertical alignments to ensure perfect dashing
function getPath(x1: number, y1: number, x2: number, y2: number) {
  if (Math.abs(x1 - x2) < 0.1) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
}

export function SkillGraph() {
  const { ready } = useDeviceCapability();
  // Off by default: pulse effect only activates on hover / interaction
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [hoveredSub, setHoveredSub] = useState<string | null>(null);

  if (!ready) return null;

  return (
    <div className="w-full">
      {/* DESKTOP VIEW: Clean, full-canvas interactive circuit / node constellation */}
      <div 
        className="hidden md:block relative w-full rounded-2xl border border-line bg-panel/30 backdrop-blur-sm p-3 overflow-hidden shadow-2xl"
        onMouseLeave={() => {
          setActiveGroup(null);
          setHoveredSub(null);
        }}
      >
        {/* Ambient background grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(var(--color-accent) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative w-full max-h-[58vh] aspect-[1000/560]">
          {/* SVG layer for connection paths and glowing nodes */}
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              {/* filterUnits="userSpaceOnUse" prevents vertical/zero-width lines (e.g. Three.js) from being clipped */}
              <filter id="branchGlow" filterUnits="userSpaceOnUse" x="0" y="0" width={VB_W} height={VB_H}>
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

            {/* Core backbone lines connecting Center to 3 Main Hubs */}
            {GRAPH_LAYOUT.map((g) => {
              const isSelected = activeGroup === g.id;
              const isDimmed = activeGroup !== null && !isSelected;

              return (
                <g key={`core-path-${g.id}`}>
                  {/* Base static path */}
                  <path
                    d={getPath(CENTER_NODE.x, CENTER_NODE.y, g.x, g.y)}
                    fill="none"
                    stroke={isSelected ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                    strokeWidth={isSelected ? 1.5 : 1}
                    strokeDasharray={isSelected ? 'none' : '4 4'}
                    className="transition-all duration-300"
                    opacity={isSelected ? 0.9 : isDimmed ? 0.1 : 0.25}
                  />

                  {/* Pulse effect directly on the branch from center to outer node */}
                  {isSelected && (
                    <path
                      d={getPath(CENTER_NODE.x, CENTER_NODE.y, g.x, g.y)}
                      fill="none"
                      stroke="var(--color-accent)"
                      strokeWidth={2.5}
                      strokeDasharray="8 12"
                      strokeLinecap="round"
                      filter="url(#branchGlow)"
                      className="branch-pulse-active"
                    />
                  )}
                </g>
              );
            })}

            {/* Sub-node connecting lines */}
            {GRAPH_LAYOUT.map((g) => {
              const isSelected = activeGroup === g.id;
              const isDimmed = activeGroup !== null && !isSelected;

              return (
                <g key={`sub-paths-${g.id}`}>
                  {g.subs.map((sub) => {
                    const isSubHovered = hoveredSub === sub.id;
                    return (
                      <g key={`path-${sub.id}`}>
                        {/* Base sub-path */}
                        <path
                          d={getPath(g.x, g.y, sub.x, sub.y)}
                          fill="none"
                          stroke={
                            isSubHovered
                              ? 'var(--color-accent)'
                              : isSelected
                              ? 'var(--color-accent)'
                              : 'var(--color-line)'
                          }
                          strokeWidth={isSubHovered ? 2.5 : isSelected ? 1.4 : 1}
                          className="transition-all duration-300"
                          opacity={
                            isSubHovered
                              ? 1
                              : isSelected
                              ? 0.85
                              : isDimmed
                              ? 0.08
                              : 0.18
                          }
                        />

                        {/* Pulse effect directly on the sub-branch */}
                        {isSelected && (
                          <path
                            d={getPath(g.x, g.y, sub.x, sub.y)}
                            fill="none"
                            stroke="var(--color-accent)"
                            strokeWidth={isSubHovered ? 2.5 : 1.5}
                            strokeDasharray="6 10"
                            strokeLinecap="round"
                            filter="url(#branchGlow)"
                            className="branch-pulse-active"
                          />
                        )}

                        {/* Terminal connector dot */}
                        <circle
                          cx={sub.x}
                          cy={sub.y}
                          r={isSubHovered ? 3.5 : isSelected ? 2.5 : 1.5}
                          fill={isSelected ? 'var(--color-accent)' : 'var(--color-line-strong)'}
                          className="transition-all duration-300"
                          opacity={isSelected ? 1 : isDimmed ? 0.15 : 0.3}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>

          {/* Center Hub: System Core */}
          <div
            className="absolute flex flex-col items-center justify-center w-28 h-28 rounded-full border border-accent/40 bg-ink/90 backdrop-blur-md shadow-2xl pointer-events-auto select-none"
            style={{
              left: `${(CENTER_NODE.x / VB_W) * 100}%`,
              top: `${(CENTER_NODE.y / VB_H) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-accent mb-1 shadow-[0_0_10px_var(--color-accent)] animate-pulse" />
            <span className="mono-label text-[10px] text-accent tracking-widest text-center px-1">
              CORE STACK
            </span>
            <span className="text-[10px] text-text-dim text-center">Engine</span>
          </div>

          {/* 3 Main Category Hubs (Clean button with no pulse) */}
          {GRAPH_LAYOUT.map((g) => {
            const isSelected = activeGroup === g.id;
            const isDimmed = activeGroup !== null && !isSelected;

            return (
              <button
                key={`hub-${g.id}`}
                type="button"
                onClick={() => setActiveGroup(isSelected ? null : g.id)}
                onMouseEnter={() => setActiveGroup(g.id)}
                className={`absolute px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all duration-300 pointer-events-auto shadow-lg flex items-center gap-2 ${
                  isSelected
                    ? 'bg-accent text-ink border-accent scale-105 shadow-[0_0_18px_rgba(217,142,63,0.35)] z-30'
                    : isDimmed
                    ? 'bg-panel/60 border-line/60 text-text-muted z-10 opacity-40'
                    : 'bg-panel border-line text-text hover:border-accent hover:text-accent z-20'
                }`}
                style={{
                  left: `${(g.x / VB_W) * 100}%`,
                  top: `${(g.y / VB_H) * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-ink'
                      : 'bg-text-dim'
                  }`}
                />
                {g.label}
              </button>
            );
          })}

          {/* Sub-node Badges */}
          {GRAPH_LAYOUT.map((g) => {
            const isSelected = activeGroup === g.id;
            const isDimmed = activeGroup !== null && !isSelected;

            return g.subs.map((sub) => {
              const isSubHovered = hoveredSub === sub.id;

              const projectsLinked = SKILL_PROJECT_MAP[sub.id] || [];

              return (
                <div
                  key={`sub-node-${sub.id}`}
                  onMouseEnter={() => {
                    setHoveredSub(sub.id);
                    setActiveGroup(g.id);
                    playHoverSound();
                  }}
                  onMouseLeave={() => setHoveredSub(null)}
                  className={`absolute px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 pointer-events-auto whitespace-nowrap shadow-sm select-none ${
                    isSubHovered
                      ? 'bg-ink border-accent text-accent scale-105 shadow-[0_0_15px_rgba(217,142,63,0.25)] z-40'
                      : isSelected
                      ? 'bg-ink/95 border-line-strong text-text hover:border-accent z-20'
                      : isDimmed
                      ? 'bg-ink/30 border-line/30 text-text-dim/30 opacity-25 z-0 pointer-events-none'
                      : 'bg-ink/70 border-line/60 text-text-muted hover:border-accent z-10'
                  }`}
                  style={{
                    left: `${(sub.x / VB_W) * 100}%`,
                    top: `${(sub.y / VB_H) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSubHovered
                          ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]'
                          : isSelected
                          ? 'bg-accent'
                          : 'bg-line-strong'
                      }`}
                    />
                    <span>{sub.label}</span>

                    {/* Quick Cross-Link Pill on hover */}
                    {isSubHovered && projectsLinked.length > 0 && (
                      <div className="flex items-center gap-1 ml-1.5 pl-2 border-l border-line-strong">
                        <span className="text-[9px] text-text-dim uppercase tracking-wider">PROJECT:</span>
                        {projectsLinked.map((proj) => (
                          <button
                            key={proj.name}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playSelectSound();
                              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                              setTimeout(() => triggerOpenProject(proj.name), 350);
                            }}
                            className="text-[10px] bg-accent/20 hover:bg-accent hover:text-ink text-accent px-1.5 py-0.5 rounded border border-accent/40 transition-colors cursor-pointer"
                          >
                            {proj.name} ↗
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* MOBILE VIEW (< md): Responsive compact stack */}
      <div className="md:hidden space-y-3">
        {skillGroups.map((group) => {
          const isSelected = activeGroup === group.id;
          return (
            <div
              key={`mobile-group-${group.id}`}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isSelected ? 'border-accent bg-panel/60' : 'border-line bg-panel/20'
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveGroup(isSelected ? null : group.id)}
                className="w-full px-4 py-3 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'bg-line-strong'
                    }`}
                  />
                  <span className="font-medium text-text text-sm">
                    {group.label}
                  </span>
                </div>
                <span className="mono-label text-[11px] text-text-dim">
                  {String(group.items.length).padStart(2, '0')}
                </span>
              </button>

              {isSelected && (
                <div className="px-4 pb-4 pt-2 border-t border-line/40">
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span
                        key={`mob-item-${item}`}
                        className="px-2.5 py-1 rounded-md bg-ink border border-line text-xs font-mono text-text flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
