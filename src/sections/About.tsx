import { Reveal } from '../components/Reveal';
import { Magnetic } from '../components/Magnetic';
import { AboutHudCard } from '../components/AboutHudCard';
import { profile } from '../data/profile';

const PILLARS = [
  {
    num: '01',
    title: 'Architecture',
    desc: 'Real-time WebSockets, FastAPI backends, and live hazard data feeds.',
  },
  {
    num: '02',
    title: 'Graphics',
    desc: '60 FPS Three.js & R3F scenes, custom GLSL shaders, and orbital math.',
  },
  {
    num: '03',
    title: 'Reliability',
    desc: 'TypeScript strict mode, zero-jank scroll physics, and clean state design.',
  },
];

export function About() {
  return (
    <section
      id="about"
      className="min-h-screen min-h-svh flex flex-col justify-center px-6 lg:pl-40 lg:pr-24 py-10 lg:py-14 relative"
    >
      <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-10 lg:gap-16 items-center">
        {/* Left: Technical Profile HUD Card */}
        <Reveal>
          <AboutHudCard />
        </Reveal>

        {/* Right: Biography & Engineering Pillars */}
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

          {/* 3 Engineering Pillars Mini-Grid */}
          <Reveal delay={0.2}>
            <div className="grid sm:grid-cols-3 gap-3.5 mb-8 max-w-2xl">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className="p-3.5 rounded-xl border border-line bg-panel/40 backdrop-blur-xs hover:border-accent/50 transition-colors"
                >
                  <span className="mono-label text-[10px] text-accent block mb-1">
                    {pillar.num} // {pillar.title.toUpperCase()}
                  </span>
                  <p className="text-text-muted text-xs leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Action Row */}
          <Reveal delay={0.25}>
            <div className="flex items-center gap-4">
              <Magnetic
                href={profile.resumeUrl}
                download
                className="bg-accent text-ink font-medium px-5 py-2.5 rounded-full text-xs hover:bg-accent-dim transition-colors inline-flex items-center gap-2"
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

              <a
                href="#contact"
                className="text-text-muted hover:text-accent font-mono text-xs transition-colors"
              >
                Get in touch &rarr;
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
