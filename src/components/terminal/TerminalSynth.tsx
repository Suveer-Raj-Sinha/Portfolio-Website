import { useState, useEffect, useCallback } from 'react';
import {
  playSynthNote,
  playLaserSound,
  playGlitchSound,
  playPowerUpSound,
  playKonamiFanfare,
} from '../../utils/audio';

interface TerminalSynthProps {
  onExit: () => void;
}

interface Note {
  key: string;
  name: string;
  freq: number;
}

const NOTES: Note[] = [
  { key: '1', name: 'C4', freq: 261.63 },
  { key: '2', name: 'D4', freq: 293.66 },
  { key: '3', name: 'E4', freq: 329.63 },
  { key: '4', name: 'F4', freq: 349.23 },
  { key: '5', name: 'G4', freq: 392.00 },
  { key: '6', name: 'A4', freq: 440.00 },
  { key: '7', name: 'B4', freq: 493.88 },
  { key: '8', name: 'C5', freq: 523.25 },
];

const WAVEFORMS: OscillatorType[] = ['square', 'triangle', 'sawtooth', 'sine'];

export function TerminalSynth({ onExit }: TerminalSynthProps) {
  const [waveform, setWaveform] = useState<OscillatorType>('square');
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const triggerNote = useCallback((note: Note) => {
    setActiveNote(note.key);
    playSynthNote(note.freq, waveform, 0.22);
    setTimeout(() => setActiveNote(null), 180);
  }, [waveform]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      const isSynthKey = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        'l',
        'g',
        'p',
        'k',
        'q',
        'escape',
      ].includes(key);

      if (isSynthKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }

      if (key === 'escape' || key === 'q') {
        onExit();
        return;
      }

      // Check note keys 1-8
      const found = NOTES.find((n) => n.key === key);
      if (found) {
        triggerNote(found);
        return;
      }

      // SFX shortcuts
      if (key === 'l') {
        playLaserSound();
      } else if (key === 'g') {
        playGlitchSound();
      } else if (key === 'p') {
        playPowerUpSound();
      } else if (key === 'k') {
        playKonamiFanfare();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [triggerNote, onExit]);

  return (
    <div className="my-2 p-3 bg-ink/90 border border-line-strong rounded-lg font-mono text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-line text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-accent font-bold">CYBER SYNTHESIZER 8-BIT</span>
          <span className="text-text-muted hidden sm:inline">[Keys 1-8 to Play]</span>
        </div>
        <button
          onClick={onExit}
          className="px-2 py-0.5 text-[10px] bg-surface hover:bg-surface-elevated text-text-muted hover:text-text rounded border border-line transition-colors"
        >
          Exit Synth [Q]
        </button>
      </div>

      {/* Waveform Selector */}
      <div className="flex items-center gap-2 mb-3 text-[11px]">
        <span className="text-text-dim">WAVEFORM:</span>
        <div className="flex gap-1">
          {WAVEFORMS.map((wf) => (
            <button
              key={wf}
              onClick={() => setWaveform(wf)}
              className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold border transition-all ${
                waveform === wf
                  ? 'bg-accent/20 border-accent text-accent'
                  : 'bg-surface border-line text-text-muted hover:text-text'
              }`}
            >
              {wf}
            </button>
          ))}
        </div>
      </div>

      {/* Musical Piano Keys */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mb-3">
        {NOTES.map((n) => {
          const isActive = activeNote === n.key;
          return (
            <button
              key={n.key}
              onClick={() => triggerNote(n)}
              className={`h-16 rounded flex flex-col items-center justify-between py-1.5 px-1 border transition-all active:scale-95 ${
                isActive
                  ? 'bg-accent text-ink border-accent font-bold shadow-lg shadow-accent/20'
                  : 'bg-surface/80 border-line hover:border-accent/50 text-text'
              }`}
            >
              <span className="text-[10px] opacity-60">[{n.key}]</span>
              <span className="text-xs font-bold">{n.name}</span>
              <span className="text-[9px] opacity-40">{Math.round(n.freq)}Hz</span>
            </button>
          );
        })}
      </div>

      {/* SFX Action Pads */}
      <div className="pt-2 border-t border-line/60">
        <div className="flex items-center justify-between mb-1.5 text-[10px] text-text-dim">
          <span>PROCEDURAL SFX PADS:</span>
          <span className="hidden sm:inline">Shortcuts: [L]aser • [G]litch • [P]owerup • [K]onami</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => playLaserSound()}
            className="px-2.5 py-1.5 bg-surface hover:bg-surface-elevated border border-line hover:border-accent/40 rounded text-left flex items-center justify-between text-xs transition-colors group"
          >
            <span className="text-text group-hover:text-accent font-medium">⚡ Laser</span>
            <span className="text-[10px] text-text-dim">[L]</span>
          </button>
          <button
            onClick={() => playGlitchSound()}
            className="px-2.5 py-1.5 bg-surface hover:bg-surface-elevated border border-line hover:border-accent/40 rounded text-left flex items-center justify-between text-xs transition-colors group"
          >
            <span className="text-text group-hover:text-accent font-medium">👾 Glitch</span>
            <span className="text-[10px] text-text-dim">[G]</span>
          </button>
          <button
            onClick={() => playPowerUpSound()}
            className="px-2.5 py-1.5 bg-surface hover:bg-surface-elevated border border-line hover:border-accent/40 rounded text-left flex items-center justify-between text-xs transition-colors group"
          >
            <span className="text-text group-hover:text-accent font-medium">🍄 Powerup</span>
            <span className="text-[10px] text-text-dim">[P]</span>
          </button>
          <button
            onClick={() => playKonamiFanfare()}
            className="px-2.5 py-1.5 bg-surface hover:bg-surface-elevated border border-line hover:border-accent/40 rounded text-left flex items-center justify-between text-xs transition-colors group"
          >
            <span className="text-text group-hover:text-amber-400 font-medium">👑 Fanfare</span>
            <span className="text-[10px] text-text-dim">[K]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
