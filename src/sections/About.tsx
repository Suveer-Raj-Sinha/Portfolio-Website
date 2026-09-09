import { Reveal } from '../components/Reveal';
import { Magnetic } from '../components/Magnetic';
import { AboutHudCard } from '../components/AboutHudCard';
import { KineticSandbox } from '../components/KineticSandbox';
import { profile, soundtracks } from '../data/profile';
import { triggerOpenTerminal } from '../utils/events';
import { showToast } from '../hooks/useToast';
import { playHoverSound, playSelectSound, playSuccessSound } from '../utils/audio';

export function About() {
  return (
    <section
      id="about"
      className="min-h-screen min-h-svh flex flex-col justify-center px-6 lg:pl-40 lg:pr-24 py-8 lg:py-10 relative"
    >
      <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-16 items-center">
        {/* Left: Technical Profile HUD Card */}
        <Reveal>
          <AboutHudCard />
        </Reveal>

        {/* Right: Biography & "Now" Focus Suite */}
        <div>
          <Reveal delay={0.1}>
            <div className="mb-2">
              <p className="mono-label text-accent text-xs mb-1">PROFILE // 05</p>
              <h2 className="font-semibold tracking-tight text-[clamp(1.75rem,3.5vw,2.5rem)] mb-4">
                {profile.aboutTitle}
              </h2>
            </div>

            <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
              I build <span className="text-text font-medium">real-time web applications</span>,{' '}
              <span className="text-text font-medium">geospatial monitoring dashboards</span>, and{' '}
              <span className="text-text font-medium">interactive 3D experiences</span>. My work spans
              aggregating live disaster feeds into Leaflet overlays, simulating planetary geology with{' '}
              <span className="text-accent font-mono text-xs">custom GLSL shaders</span>, and engineering
              AI-driven visual search extensions backed by{' '}
              <span className="text-accent font-mono text-xs">FastAPI & Python</span>.
            </p>
          </Reveal>

          {/* 3 "Now" Focus Cards: Obsession Sandbox, Culture & Study, Active Radar */}
          <Reveal delay={0.2}>
            <div className="grid sm:grid-cols-3 gap-3.5 mb-5 max-w-2xl">
              {/* Card 1: Kinetic Particle Sandbox */}
              <div className="p-3.5 rounded-xl border border-line bg-panel/40 backdrop-blur-xs flex flex-col justify-between">
                <div className="mb-2">
                  <span className="mono-label text-[10px] text-accent block mb-1">
                    01 // CURRENT OBSESSION
                  </span>
                  <p className="text-text-muted text-xs leading-relaxed">
                    Real-time particle kinematics & GPU shader fields.
                  </p>
                </div>
                <KineticSandbox />
              </div>

              {/* Card 2: Reading & Ingestion */}
              <div className="p-3.5 rounded-xl border border-line bg-panel/40 backdrop-blur-xs flex flex-col justify-between">
                <div>
                  <span className="mono-label text-[10px] text-accent block mb-1">
                    02 // READING & FOCUS
                  </span>
                  <div className="space-y-2 text-xs mt-1.5">
                    <div>
                      <span className="font-mono text-[9px] text-text-dim block">STUDYING</span>
                      <p className="text-text font-medium text-xs leading-snug">
                        Designing Data-Intensive Applications
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-text-dim block mb-1">
                        ON REPEAT // SOUNDTRACK
                      </span>
                      <div className="space-y-1">
                        {soundtracks.map((track) => (
                          <a
                            key={track.title}
                            href={track.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onMouseEnter={() => playHoverSound()}
                            onClick={() => playSelectSound()}
                            className="flex items-center justify-between text-[11px] font-mono px-1.5 py-0.5 rounded border border-line/40 bg-ink/40 hover:border-accent/60 hover:bg-panel/80 text-text-muted hover:text-accent transition-all group/track"
                            title={`Watch ${track.title} by ${track.artist} on YouTube`}
                          >
                            <span className="truncate">
                              <span className="text-text font-medium group-hover/track:text-accent">
                                {track.title}
                              </span>
                              <span className="text-text-dim text-[10px]"> — {track.artist}</span>
                            </span>
                            <span className="text-[9px] text-accent opacity-70 group-hover/track:opacity-100 ml-1">
                              ▶ ↗
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-line/40 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-text-dim">STANDARD</span>
                  <span className="text-emerald-400 font-medium">60 FPS LOCKED</span>
                </div>
              </div>

              {/* Card 3: Active Radar & Status */}
              <div className="p-3.5 rounded-xl border border-line bg-panel/40 backdrop-blur-xs flex flex-col justify-between">
                <div>
                  <span className="mono-label text-[10px] text-accent block mb-1">
                    03 // ACTIVE RADAR
                  </span>
                  <div className="space-y-2 text-xs mt-1.5">
                    <div>
                      <span className="font-mono text-[9px] text-text-dim block">AVAILABILITY</span>
                      <p className="text-text font-medium text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_currentColor]" />
                        Open for Roles
                      </p>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-text-dim block">LOCATION</span>
                      <p className="text-text-muted text-[11px]">India (UTC+5:30) • Remote</p>
                    </div>
                  </div>
                </div>
                <div className="pt-2.5 mt-2 border-t border-line/40 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-text-dim">DISPATCH</span>
                  <button
                    onClick={() => {
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(profile.email);
                      }
                      playSuccessSound();
                      showToast(`COPIED EMAIL: ${profile.email}`, 'success');
                    }}
                    onMouseEnter={() => playHoverSound()}
                    className="text-accent hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    title="Copy direct recruiter email"
                  >
                    <span>Copy Email</span>
                    <span>📋</span>
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Action Row - Permanently Visible (No ScrollTrigger disappearing) */}
          <div className="flex flex-wrap items-center gap-3.5 relative z-10 pt-1">
            <Magnetic
              href={profile.resumeUrl}
              download
              onClick={() => {
                playSuccessSound();
                showToast('INITIALIZING RESUME DOWNLOAD // RESUME.PDF', 'success');
              }}
              onMouseEnter={() => playHoverSound()}
              className="bg-accent text-ink font-medium px-5 py-2.5 rounded-full text-xs hover:bg-accent-dim transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <svg
                aria-hidden="true"
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download Resume
            </Magnetic>

            {/* Terminal Bridge Button */}
            <button
              onClick={() => {
                playSelectSound();
                triggerOpenTerminal('cat bio.txt');
                showToast('LAUNCHING TERMINAL // cat bio.txt', 'accent');
              }}
              onMouseEnter={() => playHoverSound()}
              className="font-mono text-xs px-4 py-2.5 rounded-full border border-line-strong bg-panel/60 hover:border-accent hover:text-accent transition-all inline-flex items-center gap-2 group cursor-pointer"
              title="Execute 'cat bio.txt' directly in the cyber terminal"
            >
              <span className="text-accent group-hover:translate-x-0.5 transition-transform font-bold">&gt;_</span>
              <span>cat bio.txt</span>
            </button>

            <a
              href="#contact"
              onMouseEnter={() => playHoverSound()}
              onClick={() => playSelectSound()}
              className="text-text-muted hover:text-accent font-mono text-xs transition-colors ml-1"
            >
              Get in touch &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
