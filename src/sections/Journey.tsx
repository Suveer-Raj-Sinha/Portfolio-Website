import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { experienceEntries, educationEntries, type JourneyEntry } from '../data/journey';
import { profile } from '../data/profile';
import { showToast } from '../hooks/useToast';
import { playHoverSound, playSelectSound, playSuccessSound } from '../utils/audio';

type JourneyFilter = 'all' | 'experience' | 'education';

interface MetricItem {
  id: 'experience' | 'education' | 'status';
  val: string;
  label: string;
  desc: string;
}

const METRICS: MetricItem[] = [
  { id: 'experience', val: '02', label: 'Internships', desc: 'Full-Stack & Mobile' },
  { id: 'education', val: 'MCA', label: 'Postgraduate Track', desc: 'JECRC Univ (2026–Present)' },
  { id: 'education', val: 'BCA Grad', label: 'Undergraduate', desc: 'Poornima Univ (2023–26)' },
  { id: 'status', val: 'Available', label: 'Status', desc: 'Open for Opportunities' },
];

function TimelineGroup({ label, entries }: { label: string; entries: JourneyEntry[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <p className="mono-label text-accent text-xs font-semibold tracking-wider">
          {label.toUpperCase()}
        </p>
      </div>

      <div className="relative border-l border-line-strong pl-6 lg:pl-8 flex flex-col gap-3.5">
        {entries.map((entry, idx) => (
          <div key={entry.title + entry.org} className="relative">
            {/* Timeline node dot on the left line */}
            <span
              className={`absolute -left-[calc(1.5rem+4px)] lg:-left-[calc(2rem+4px)] top-4 w-2 h-2 rounded-full transition-all duration-300 ${
                idx === 0
                  ? 'bg-accent shadow-[0_0_8px_var(--color-accent)] animate-pulse'
                  : 'bg-line-strong'
              }`}
            />

            {/* Timeline Card */}
            <div
              onMouseEnter={() => playHoverSound()}
              className="p-3.5 sm:p-4 rounded-xl border border-line bg-panel/40 backdrop-blur-xs hover:border-accent/60 hover:bg-panel/70 transition-all duration-300 shadow-sm group"
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                <span className="mono-label text-[11px] text-text-dim">{entry.period}</span>
                {entry.badge && (
                  <span className="mono-label text-[9px] px-2 py-0.5 rounded-full border border-line bg-ink/70 text-accent font-medium">
                    {entry.badge}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-sm sm:text-base text-text group-hover:text-accent transition-colors mb-0.5">
                {entry.title}
              </h3>
              <p className="text-text-muted text-xs font-mono mb-2">{entry.org}</p>

              {entry.bullets && (
                <ul className="space-y-1 mb-2">
                  {entry.bullets.slice(0, 2).map((b) => (
                    <li key={b} className="text-text-muted text-xs leading-relaxed flex gap-2">
                      <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0 mt-1.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {entry.tech && (
                <div className="flex flex-wrap gap-1 pt-2 border-t border-line/40">
                  {entry.tech.map((t) => (
                    <span
                      key={t}
                      className="mono-label text-[9px] px-1.5 py-0.5 rounded border border-line/50 bg-ink/40 text-text-dim hover:text-accent hover:border-accent/40 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Journey() {
  const [filter, setFilter] = useState<JourneyFilter>('all');

  const handleMetricClick = (item: MetricItem) => {
    if (item.id === 'experience') {
      playSelectSound();
      setFilter('experience');
      showToast('FILTERED // INDUSTRY EXPERIENCE', 'info');
    } else if (item.id === 'education') {
      playSelectSound();
      setFilter('education');
      showToast('FILTERED // ACADEMIC TRACK', 'info');
    } else if (item.id === 'status') {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(profile.email);
      }
      playSuccessSound();
      showToast(`RECRUITER DISPATCH: COPIED ${profile.email}`, 'success');
    }
  };

  return (
    <section
      id="journey"
      className="min-h-screen min-h-svh flex flex-col justify-center px-6 lg:pl-40 lg:pr-24 py-8 lg:py-12 relative"
    >
      {/* Header & Milestone Ticker */}
      <div className="mb-5 lg:mb-6 max-w-5xl">
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
            <div>
              <p className="mono-label text-accent text-xs mb-1">TRACK RECORD // 06</p>
              <h2 className="font-semibold tracking-tight text-[clamp(1.75rem,3.5vw,2.5rem)]">
                Journey so far
              </h2>
            </div>
            <p className="text-text-muted text-xs font-mono">
              Timeline of practical experience & education
            </p>
          </div>
        </Reveal>

        {/* Milestone Stats Bar (Click to Filter) */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {METRICS.map((m) => {
              const isSelected =
                (m.id === 'experience' && filter === 'experience') ||
                (m.id === 'education' && filter === 'education');

              return (
                <div
                  key={m.label}
                  onClick={() => handleMetricClick(m)}
                  onMouseEnter={() => playHoverSound()}
                  className={`p-3 rounded-xl border backdrop-blur-xs transition-all cursor-pointer group select-none ${
                    isSelected
                      ? 'border-accent bg-panel/70 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : 'border-line bg-panel/30 hover:border-accent/50 hover:bg-panel/50'
                  }`}
                  title={
                    m.id === 'status'
                      ? 'Click to copy direct recruiter contact'
                      : `Click to filter timeline by ${m.label}`
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-lg text-accent block leading-tight group-hover:scale-105 transition-transform">
                      {m.val}
                    </span>
                    <span className="mono-label text-[9px] text-text-dim group-hover:text-accent transition-colors">
                      {m.id === 'status' ? '📋' : 'FILTER ↗'}
                    </span>
                  </div>
                  <span className="mono-label text-[10px] text-text font-semibold block mt-0.5">
                    {m.label}
                  </span>
                  <span className="text-text-dim text-[10px] block truncate">{m.desc}</span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>

      {/* Mode Switcher Tabs */}
      <Reveal delay={0.12}>
        <div className="flex items-center gap-1.5 mb-5 max-w-md">
          {(['all', 'experience', 'education'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                playSelectSound();
                setFilter(tab);
                showToast(
                  tab === 'all'
                    ? 'VIEW: ALL TIMELINES'
                    : tab === 'experience'
                    ? 'VIEW: INDUSTRY EXPERIENCE'
                    : 'VIEW: ACADEMIC TRACK',
                  'info',
                );
              }}
              onMouseEnter={() => playHoverSound()}
              className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer uppercase ${
                filter === tab
                  ? 'bg-accent/15 border-accent/60 text-accent font-semibold shadow-xs'
                  : 'border-line/60 bg-panel/30 text-text-muted hover:text-text hover:border-line-strong'
              }`}
            >
              {tab === 'all' && '● ALL'}
              {tab === 'experience' && '01 // EXPERIENCE'}
              {tab === 'education' && '02 // EDUCATION'}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Timeline Cards (Filtered or Dual-Column) */}
      <div className="max-w-5xl">
        {filter === 'all' && (
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
            <Reveal delay={0.15}>
              <TimelineGroup label="Experience" entries={experienceEntries} />
            </Reveal>
            <Reveal delay={0.22}>
              <TimelineGroup label="Education" entries={educationEntries} />
            </Reveal>
          </div>
        )}

        {filter === 'experience' && (
          <div className="max-w-2xl">
            <Reveal delay={0.15}>
              <TimelineGroup label="Industry Experience" entries={experienceEntries} />
            </Reveal>
          </div>
        )}

        {filter === 'education' && (
          <div className="max-w-2xl">
            <Reveal delay={0.15}>
              <TimelineGroup label="Academic Track" entries={educationEntries} />
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
