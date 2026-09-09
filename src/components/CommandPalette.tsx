import { useState, useEffect, useRef, useMemo } from 'react';
import { profile, skillGroups } from '../data/profile';
import { projects } from '../data/projects';
import { triggerOpenProject, triggerOpenTerminal } from '../utils/events';
import { showToast } from '../hooks/useToast';
import {
  playDrawerSound,
  playHoverSound,
  playSelectSound,
  isAudioEnabled,
  setAudioEnabled,
} from '../utils/audio';

interface PaletteItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Case Studies' | 'Technologies' | 'Actions';
  hint?: string;
  icon?: string;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const openPalette = () => {
    setQuery('');
    setSelectedIndex(0);
    setOpen(true);
  };

  const closePalette = () => {
    setOpen(false);
  };

  // Close on Escape & Listen for global Ctrl+K / Cmd+K
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (e.key === 'Escape' && open) {
        closePalette();
      }
    };

    const onCustomOpen = () => openPalette();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('open-command-palette', onCustomOpen);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('open-command-palette', onCustomOpen);
    };
  }, [open]);

  // Audio feedback and body lock on open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      playDrawerSound();
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  // Build items index
  const allItems: PaletteItem[] = useMemo(() => {
    const navItems: PaletteItem[] = [
      { id: 'nav-hero', title: 'Hero // Initialization', category: 'Navigation', hint: 'Jump to start', action: () => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'nav-manifesto', title: 'Manifesto // Philosophy', category: 'Navigation', hint: 'Section 02', action: () => document.getElementById('manifesto')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'nav-skills', title: 'Skills // Network Graph', category: 'Navigation', hint: 'Interactive diagram', action: () => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'nav-projects', title: 'Projects // Selected Work', category: 'Navigation', hint: 'Featured builds', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'nav-about', title: 'About // Background & Philosophy', category: 'Navigation', hint: 'Core bio', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'nav-journey', title: 'Journey // Career & Timeline', category: 'Navigation', hint: 'Education & experience', action: () => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' }) },
      { id: 'nav-contact', title: 'Contact // Transmission', category: 'Navigation', hint: 'Get in touch', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
    ];

    const projectItems: PaletteItem[] = projects.map((p) => ({
      id: `proj-${p.index}`,
      title: `${p.name} — Architecture Specs & Case Study`,
      category: 'Case Studies',
      hint: p.category,
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => triggerOpenProject(p.name), 300);
      },
    }));

    const skillItems: PaletteItem[] = skillGroups.flatMap((g) =>
      g.items.map((s) => ({
        id: `skill-${s}`,
        title: s,
        category: 'Technologies',
        hint: g.label,
        action: () => {
          document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
          showToast(`Filtered: ${s}`, 'info');
        },
      })),
    );

    const actionItems: PaletteItem[] = [
      {
        id: 'act-email',
        title: 'Copy Email Address',
        category: 'Actions',
        hint: profile.email,
        action: () => {
          navigator.clipboard.writeText(profile.email);
          showToast(`Copied ${profile.email} to clipboard`, 'success');
          playSelectSound();
        },
      },
      {
        id: 'act-resume',
        title: 'Download Resume (PDF)',
        category: 'Actions',
        hint: 'Opens in new tab',
        action: () => {
          window.open(profile.resumeUrl, '_blank');
          showToast('Opening resume...', 'info');
        },
      },
      {
        id: 'act-terminal',
        title: 'Launch Cyber Terminal (~/suveer $)',
        category: 'Actions',
        hint: 'Interactive console CLI',
        action: () => {
          triggerOpenTerminal();
        },
      },
      {
        id: 'act-audio',
        title: isAudioEnabled() ? 'Disable Audio FX (Mute)' : 'Enable Audio FX (Procedural Web Audio)',
        category: 'Actions',
        hint: isAudioEnabled() ? 'Currently active' : 'Currently muted',
        action: () => {
          const next = !isAudioEnabled();
          setAudioEnabled(next);
          if (next) playSelectSound();
          showToast(next ? 'Sound FX enabled' : 'Sound FX muted', 'accent');
        },
      },
      {
        id: 'act-github',
        title: 'Open GitHub Profile',
        category: 'Actions',
        hint: profile.github,
        action: () => window.open(profile.github, '_blank'),
      },
      {
        id: 'act-linkedin',
        title: 'Open LinkedIn Profile',
        category: 'Actions',
        hint: profile.linkedin,
        action: () => window.open(profile.linkedin, '_blank'),
      },
    ];

    return [...actionItems, ...navItems, ...projectItems, ...skillItems];
  }, []);

  // Filter items based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 14);
    const q = query.toLowerCase();
    return allItems
      .filter((item) => item.title.toLowerCase().includes(q) || item.hint?.toLowerCase().includes(q) || item.category.toLowerCase().includes(q))
      .slice(0, 16);
  }, [allItems, query]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  const executeItem = (item: PaletteItem) => {
    playSelectSound();
    setOpen(false);
    item.action();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      playHoverSound();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      playHoverSound();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredItems[selectedIndex];
      if (target) executeItem(target);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      className="fixed inset-0 z-[120] flex items-start justify-center pt-[12vh] px-4 bg-ink/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-ink border border-line-strong rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[70vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line bg-surface/40">
          <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, project, technology, or action..."
            className="w-full bg-transparent text-sm text-text placeholder:text-text-dim focus:outline-none"
          />
          <kbd className="mono-label text-[10px] text-text-dim px-1.5 py-0.5 border border-line rounded">ESC</kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="overflow-y-auto p-2 divide-y divide-line/30">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-text-muted text-xs mono-label">
              No matching commands or resources found.
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => {
                    setSelectedIndex(idx);
                    playHoverSound();
                  }}
                  className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors ${
                    isSelected ? 'bg-accent/10 border border-accent/30 text-text' : 'hover:bg-surface/50 text-text-muted border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="mono-label text-[10px] text-accent/80 shrink-0 w-20 truncate">
                      {item.category}
                    </span>
                    <span className={`truncate font-medium ${isSelected ? 'text-accent' : 'text-text'}`}>
                      {item.title}
                    </span>
                  </div>
                  {item.hint && (
                    <span className="mono-label text-[10px] text-text-dim shrink-0 ml-2">
                      {item.hint}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-line bg-surface/20 flex items-center justify-between text-[10px] mono-label text-text-dim">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Dismiss</span>
          </div>
          <span className="text-accent/80">Command Suite</span>
        </div>
      </div>
    </div>
  );
}
