import { useState, useEffect, useRef } from 'react';
import { profile, skillGroups } from '../data/profile';
import { projects } from '../data/projects';
import { triggerOpenProject } from '../utils/events';
import {
  playDrawerSound,
  playSelectSound,
  playSynthNote,
  playSuccessSound,
  isAudioEnabled,
  setAudioEnabled,
} from '../utils/audio';
import { SnakeGame } from './terminal/SnakeGame';
import { TerminalSynth } from './terminal/TerminalSynth';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'accent';
  text: string | React.ReactNode;
}

type TerminalTheme = 'default' | 'matrix' | 'amber' | 'cyber' | 'synthwave';
type ActiveMode = 'default' | 'snake' | 'synth';

const THEME_STYLES: Record<
  TerminalTheme,
  {
    card: string;
    titleBar: string;
    accent: string;
    prompt: string;
    input: string;
  }
> = {
  default: {
    card: 'bg-ink/95 border-line-strong text-text',
    titleBar: 'bg-surface/60 border-line text-text-muted',
    accent: 'text-accent',
    prompt: 'text-accent',
    input: 'caret-accent',
  },
  matrix: {
    card: 'bg-black/95 border-emerald-500/40 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.18)]',
    titleBar: 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300',
    accent: 'text-emerald-300',
    prompt: 'text-emerald-400',
    input: 'caret-emerald-400',
  },
  amber: {
    card: 'bg-[#0c0903]/95 border-amber-500/40 text-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.18)]',
    titleBar: 'bg-[#1c1305]/60 border-amber-500/30 text-amber-400',
    accent: 'text-amber-400',
    prompt: 'text-amber-500',
    input: 'caret-amber-400',
  },
  cyber: {
    card: 'bg-[#020e17]/95 border-cyan-500/40 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.18)]',
    titleBar: 'bg-[#051c2e]/60 border-cyan-500/30 text-cyan-400',
    accent: 'text-cyan-400',
    prompt: 'text-cyan-400',
    input: 'caret-cyan-400',
  },
  synthwave: {
    card: 'bg-[#120317]/95 border-fuchsia-500/40 text-fuchsia-300 shadow-[0_0_30px_rgba(217,70,239,0.18)]',
    titleBar: 'bg-[#21062b]/60 border-fuchsia-500/30 text-fuchsia-400',
    accent: 'text-fuchsia-400',
    prompt: 'text-fuchsia-400',
    input: 'caret-fuchsia-400',
  },
};

export function CyberTerminal() {
  const [open, setOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [activeMode, setActiveMode] = useState<ActiveMode>('default');
  const [theme, setTheme] = useState<TerminalTheme>('default');

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'accent',
      text: 'SYSTEM INITIALIZED // SUVEER RAJ SINHA OS [v2.4.0-PROD]',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'Type "help" for available commands, "snake" for arcade game, or "synth" for 8-bit audio.',
    },
  ]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const handleCommandRef = useRef<(cmd: string) => void>(() => {});

  // Listen for open-terminal event & Escape to close
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ command?: string }>;
      setOpen(true);
      if (customEvent.detail?.command) {
        const cmd = customEvent.detail.command;
        setTimeout(() => {
          handleCommandRef.current(cmd);
        }, 120);
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        if (activeMode !== 'default') {
          setActiveMode('default');
        } else {
          setOpen(false);
        }
      }
    };

    window.addEventListener('open-terminal', handleOpen);
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('open-terminal', handleOpen);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [open, activeMode]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      playDrawerSound();
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  useEffect(() => {
    if (activeMode === 'default') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines, open, activeMode]);

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    playSelectSound();
    setHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [
      { id: `cmd-${Date.now()}`, type: 'input', text: `guest@suveer:~$ ${cmd}` },
    ];

    const args = cmd.toLowerCase().split(' ');
    const main = args[0];

    switch (main) {
      case 'help':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-2.5 my-1 text-xs">
              <div>
                <p className="text-accent font-semibold mb-1"># Navigation & Telemetry</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-text-muted">
                  <p><span className="text-text font-mono">neofetch</span> - System telemetry & role overview</p>
                  <p><span className="text-text font-mono">projects</span> - List engineering portfolio projects</p>
                  <p><span className="text-text font-mono">project &lt;name&gt;</span> - Open detailed case study drawer</p>
                  <p><span className="text-text font-mono">skills</span> - Display categorized technical stack</p>
                  <p><span className="text-text font-mono">about</span> / <span className="text-text font-mono">cat bio.txt</span> - View developer bio</p>
                  <p><span className="text-text font-mono">journey</span> - View education & internship timeline</p>
                  <p><span className="text-text font-mono">contact</span> - Display email and social links</p>
                  <p><span className="text-text font-mono">sudo hire</span> - Priority transmission to hire Suveer</p>
                </div>
              </div>

              <div>
                <p className="text-accent font-semibold mb-1"># Interactive Mini-Games & Audio</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-text-muted">
                  <p><span className="text-emerald-400 font-mono">snake</span> - Play retro ASCII Snake arcade game [1]</p>
                  <p><span className="text-emerald-400 font-mono">synth</span> / <span className="text-emerald-400 font-mono">soundboard</span> - 8-bit Web Audio synthesizer [3]</p>
                </div>
              </div>

              <div>
                <p className="text-accent font-semibold mb-1"># Terminal Easter Eggs & Tools</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 text-text-muted">
                  <p><span className="text-amber-400 font-mono">theme &lt;name&gt;</span> - Switch CRT theme (matrix, amber, cyber, synthwave, default) [6]</p>
                  <p><span className="text-amber-400 font-mono">coffee</span> / <span className="text-amber-400 font-mono">tea</span> - Brew animated ASCII coffee (+100 Mana) [9]</p>
                  <p><span className="text-text font-mono">audio</span> - Toggle procedural Web Audio FX</p>
                  <p><span className="text-text font-mono">clear</span> - Flush terminal screen buffer</p>
                  <p><span className="text-text font-mono">exit</span> - Close terminal console</p>
                </div>
              </div>
            </div>
          ),
        });
        break;

      // 1: Retro ASCII Snake
      case 'snake':
        setActiveMode('snake');
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'accent',
          text: 'Booting Terminal Snake v1.0... Use WASD or Arrow Keys to navigate.',
        });
        break;

      // 3: 8-Bit Web Audio Synthesizer
      case 'synth':
      case 'soundboard':
        setActiveMode('synth');
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'accent',
          text: 'Initializing Web Audio Synthesizer... Press 1-8 to play notes, [L/G/P/K] for SFX, [Q] to exit.',
        });
        break;

      // 6: Theme Switcher
      case 'theme': {
        const requestedTheme = args[1] as TerminalTheme;
        if (['default', 'matrix', 'amber', 'cyber', 'synthwave'].includes(requestedTheme)) {
          setTheme(requestedTheme);
          playSuccessSound();
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'accent',
            text: `Terminal colorway updated to "${requestedTheme.toUpperCase()}".`,
          });
        } else {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: `Invalid theme. Available options: default, matrix, amber, cyber, synthwave`,
          });
        }
        break;
      }

      // 9: Coffee / Tea Machine
      case 'coffee':
      case 'tea':
        playSynthNote(440, 'triangle', 0.2);
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="my-1.5 font-mono text-xs">
              <pre className="text-amber-400 leading-tight">
{`      (  )   (   )  )
       ) (   )  (  (
       ( )  (    ) )
     _____________
    <_____________> ___
    |             |/ _ \\
    |  SRS ROAST  | | | |
    |             |\\ - /
    \\_____________/ \\_/`}
              </pre>
              <p className="text-accent font-semibold mt-1">
                ☕ Fresh artisan roast dispatched: +100 Engineering Mana Restored!
              </p>
            </div>
          ),
        });
        break;

      case 'neofetch':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="flex flex-col sm:flex-row gap-4 my-2 text-xs font-mono">
              <pre className="text-accent font-bold leading-tight select-none">
{`   _____ _____   _____ 
  / ____|  __ \\ / ____|
 | (___ | |__) | (___  
  \\___ \\|  _  / \\___ \\ 
  ____) | | \\ \\ ____) |
 |_____/|_|  \\_\\_____/ `}
              </pre>
              <div className="space-y-0.5 text-text-muted">
                <p><span className="text-text font-semibold">suveer@portfolio</span></p>
                <p>-------------------------</p>
                <p><span className="text-accent">OS:</span> Cyber HUD WebOS 2.4.0 [{theme.toUpperCase()}]</p>
                <p><span className="text-accent">Role:</span> {profile.role}</p>
                <p><span className="text-accent">Location:</span> Jaipur, Rajasthan, India (UTC+5:30)</p>
                <p><span className="text-accent">Stack:</span> React 19, TypeScript, Vite, Tailwind v4, GSAP</p>
                <p><span className="text-accent">Backend:</span> FastAPI, Node.js, Python, SQLite</p>
                <p><span className="text-accent">3D Graphics:</span> HTML5 Canvas, WebGL, Three.js, GLSL</p>
                <p><span className="text-accent">Status:</span> <span className="text-emerald-400 font-semibold">ONLINE — AVAILABLE FOR HIRE</span></p>
              </div>
            </div>
          ),
        });
        break;

      case 'projects':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-2 my-1 text-xs">
              <p className="text-accent font-semibold">Featured Projects (Click to inspect specs):</p>
              {projects.map((p) => (
                <div key={p.name} className="border-l-2 border-line-strong pl-3 py-0.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setOpen(false);
                        triggerOpenProject(p.name);
                      }}
                      className="text-text font-semibold hover:text-accent underline text-left"
                    >
                      {p.name}
                    </button>
                    <span className="text-text-dim">[{p.category}]</span>
                  </div>
                  <p className="text-text-muted text-[11px]">{p.tech.join(' • ')}</p>
                </div>
              ))}
            </div>
          ),
        });
        break;

      case 'project': {
        const targetName = args.slice(1).join(' ');
        const found = projects.find((p) => p.name.toLowerCase().includes(targetName));
        if (found) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'accent',
            text: `Launching architecture case study for ${found.name}...`,
          });
          setOpen(false);
          triggerOpenProject(found.name);
        } else {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: `Project not found. Available: ${projects.map((p) => p.name).join(', ')}`,
          });
        }
        break;
      }

      case 'skills':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-2 my-1 text-xs">
              {skillGroups.map((g) => (
                <div key={g.id}>
                  <p className="text-accent font-semibold"># {g.label}</p>
                  <p className="text-text-muted">{g.items.join(', ')}</p>
                </div>
              ))}
            </div>
          ),
        });
        break;

      case 'about':
      case 'cat':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-1.5 my-1 text-xs leading-relaxed text-text-muted">
              <p className="text-text font-semibold">{profile.name} — {profile.aboutTitle}</p>
              <p>{profile.bio}</p>
              <p className="text-accent pt-1">Tagline: {profile.tagline}</p>
            </div>
          ),
        });
        break;

      case 'journey':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-2 my-1 text-xs">
              <p className="text-accent font-semibold">Career & Education Milestones:</p>
              <p className="text-text">● Master of Computer Applications (MCA) — JECRC University (2026 - Present)</p>
              <p className="text-text">● Full-Stack Engineering Intern — Vinternship (Nov 2025 - Dec 2025)</p>
              <p className="text-text">● Bachelor of Computer Applications (BCA) — JECRC University (2023 - 2026)</p>
            </div>
          ),
        });
        break;

      case 'contact':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          text: (
            <div className="space-y-1 my-1 text-xs">
              <p><span className="text-accent">Email:</span> {profile.email}</p>
              <p><span className="text-accent">GitHub:</span> {profile.github}</p>
              <p><span className="text-accent">LinkedIn:</span> {profile.linkedin}</p>
            </div>
          ),
        });
        break;

      case 'audio': {
        const next = !isAudioEnabled();
        setAudioEnabled(next);
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'accent',
          text: next ? 'Procedural Web Audio FX enabled.' : 'Procedural Web Audio FX muted.',
        });
        break;
      }

      case 'sudo':
        if (args[1] === 'hire') {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'accent',
            text: (
              <div className="space-y-1 text-emerald-400 font-semibold my-1">
                <p>[ACCESS GRANTED] Initiating recruiter priority transmission protocol...</p>
                <p>
                  Click to open direct email client:{' '}
                  <a
                    href={`mailto:${profile.email}?subject=Job%20Opportunity%20via%20Portfolio%20Terminal`}
                    className="underline text-accent"
                  >
                    {profile.email} ↗
                  </a>
                </p>
              </div>
            ),
          });
        } else {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'error',
            text: 'sudo: command not allowed. Did you mean "sudo hire"?',
          });
        }
        break;

      case 'clear':
        setLines([]);
        setInputVal('');
        return;

      case 'exit':
        setOpen(false);
        setInputVal('');
        return;

      default:
        newLines.push({
          id: `err-${Date.now()}`,
          type: 'error',
          text: `zsh: command not found: ${cmd}. Type "help" for recognized commands.`,
        });
        break;
    }

    setLines((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  useEffect(() => {
    handleCommandRef.current = handleCommand;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  if (!open) return null;

  const currentTheme = THEME_STYLES[theme] || THEME_STYLES.default;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cyber Terminal"
      className="fixed inset-0 z-[125] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      <div
        className={`w-full max-w-2xl border rounded-xl shadow-2xl overflow-hidden flex flex-col h-[540px] max-h-[88vh] font-mono text-xs animate-in zoom-in-95 duration-150 transition-colors ${currentTheme.card}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Title Bar */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-b select-none transition-colors ${currentTheme.titleBar}`}
        >
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-rose-500/80 cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => setOpen(false)}
              title="Close terminal"
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-amber-500/80 cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => handleCommand('clear')}
              title="Clear screen"
            />
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 cursor-pointer hover:opacity-100 transition-opacity"
              onClick={() => handleCommand('snake')}
              title="Launch Snake [1]"
            />
            <span className="ml-2 mono-label text-[11px] text-text-muted flex items-center gap-2">
              <span>guest@suveer-raj-sinha: ~ (zsh)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-text-dim hidden sm:inline">
              [{theme}]
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-text-dim hover:text-text transition-colors p-1"
              aria-label="Close terminal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        {activeMode === 'snake' ? (
          <div className="flex-1 p-3 overflow-y-auto">
            <SnakeGame
              onExit={() => {
                setActiveMode('default');
                setLines((l) => [
                  ...l,
                  {
                    id: `exit-snake-${Date.now()}`,
                    type: 'output',
                    text: '[SNAKE TERMINATED] High score saved to session.',
                  },
                ]);
              }}
            />
          </div>
        ) : activeMode === 'synth' ? (
          <div className="flex-1 p-3 overflow-y-auto">
            <TerminalSynth
              onExit={() => {
                setActiveMode('default');
                setLines((l) => [
                  ...l,
                  {
                    id: `exit-synth-${Date.now()}`,
                    type: 'output',
                    text: '[SYNTH ENGINE DETACHED] Audio synthesizer offline.',
                  },
                ]);
              }}
            />
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto p-4 space-y-2 cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line) => (
              <div key={line.id}>
                {line.type === 'input' && (
                  <p className="text-text font-medium">{line.text}</p>
                )}
                {line.type === 'output' && (
                  <div className="text-text-muted">{line.text}</div>
                )}
                {line.type === 'accent' && (
                  <div className={`${currentTheme.accent} font-semibold`}>{line.text}</div>
                )}
                {line.type === 'error' && (
                  <div className="text-rose-400">{line.text}</div>
                )}
              </div>
            ))}

            {/* Active Input Line */}
            <div className="flex items-center gap-2 text-text pt-1">
              <span className={`${currentTheme.prompt} font-bold shrink-0`}>
                guest@suveer:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 bg-transparent text-text focus:outline-none ${currentTheme.input}`}
                autoFocus
                spellCheck="false"
                autoComplete="off"
              />
            </div>
            <div ref={bottomRef} />
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-1.5 bg-surface/30 border-t border-line text-[10px] text-text-dim flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <span>Type &quot;help&quot; for commands</span>
            <span className="hidden sm:inline text-text-dim/60">• &quot;snake&quot;, &quot;synth&quot;, &quot;theme&quot;, &quot;coffee&quot;</span>
          </div>
          <span className={currentTheme.accent}>UTF-8 • TTY1 • {theme.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}
