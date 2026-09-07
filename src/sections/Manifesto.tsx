import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Reveal } from '../components/Reveal';
import { SplitText } from '../components/SplitText';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

const DOMAINS = ['Web', 'AI', 'Geospatial systems', '3D & WebGL', 'Data pipelines'];

/**
 * Three keywords that sum up the developer's focus areas.
 * GSAP cycles through them when the section is in view.
 */
const CYCLE_WORDS = ['REAL-TIME', 'GEOSPATIAL', '3D + WebGL'];

export function Manifesto() {
  const cycleRef = useRef<HTMLSpanElement | null>(null);
  const { prefersReducedMotion, ready } = useDeviceCapability();

  useEffect(() => {
    if (!ready || !cycleRef.current) return;

    const el = cycleRef.current;

    if (prefersReducedMotion) {
      /* Reduced-motion: just reveal the first word statically */
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    /* Animated path: cycle through words with fade-up / fade-down transitions */
    let idx = 0;
    el.textContent = CYCLE_WORDS[0];
    gsap.set(el, { autoAlpha: 0, y: 14 });

    const ctx = gsap.context(() => {
      const step = () => {
        gsap.timeline()
          /* Fade in */
          .to(el, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' })
          /* Dwell, then fade out */
          .to(el, {
            autoAlpha: 0,
            y: -10,
            duration: 0.35,
            ease: 'power2.in',
            delay: 1.8,
            onComplete() {
              idx = (idx + 1) % CYCLE_WORDS.length;
              el.textContent = CYCLE_WORDS[idx];
              gsap.set(el, { y: 14 });
              step(); // recurse
            },
          });
      };
      step();
    });

    return () => ctx.revert();
  }, [ready, prefersReducedMotion]);

  return (
    <section
      id="manifesto"
      className="min-h-screen min-h-svh flex flex-col justify-center px-6 lg:pl-40 lg:pr-24 py-12 relative"
    >
      {/* Main manifesto sentence — word-by-word reveal on scroll enter */}
      <SplitText
        as="h2"
        className="font-semibold leading-[1.05] tracking-tight text-[clamp(2rem,6vw,4.5rem)] max-w-4xl"
        trigger="scroll"
        stagger={0.04}
        duration={0.75}
      >
        I build real-time systems that turn raw data into something you can see, explore, and trust.
      </SplitText>

      {/* Cycling keyword — hidden from AT, accessible label below */}
      <div
        aria-hidden="true"
        className="mt-14 h-[1.35em] overflow-hidden text-[clamp(1.75rem,5vw,3.5rem)]"
      >
        <span
          ref={cycleRef}
          className="block font-semibold text-accent"
          style={{ opacity: 0 }} /* GSAP or effect will reveal this */
        >
          {CYCLE_WORDS[0]}
        </span>
      </div>
      {/* Screen-reader equivalent */}
      <p className="sr-only">Focus areas: {CYCLE_WORDS.join(', ')}</p>

      {/* Domain tags */}
      <Reveal delay={0.1} className="flex flex-wrap gap-3 mt-10">
        {DOMAINS.map((domain) => (
          <span
            key={domain}
            className="mono-label border border-line-strong rounded-full px-4 py-2 text-text-muted"
          >
            {domain}
          </span>
        ))}
      </Reveal>
    </section>
  );
}
