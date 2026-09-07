import { Reveal } from '../components/Reveal';
import { SkillGraph } from '../components/SkillGraph';

export function Skills() {
  return (
    <section
      id="skills"
      className="min-h-screen min-h-svh flex flex-col justify-center px-6 lg:pl-40 lg:pr-24 py-6 lg:py-10 relative overflow-hidden"
    >
      <div className="w-full max-w-5xl">
        <Reveal>
          <h2 className="font-semibold tracking-tight text-[clamp(1.5rem,3.2vw,2.5rem)] mb-1.5">
            Technology I work with
          </h2>
          <p className="text-text-muted text-xs sm:text-sm max-w-lg mb-5">
            Grouped by where it sits in a system — frontend, backend & data, and creative tooling.
          </p>
        </Reveal>

        {/* Interactive node graph */}
        <Reveal delay={0.15}>
          <SkillGraph />
        </Reveal>
      </div>
    </section>
  );
}
