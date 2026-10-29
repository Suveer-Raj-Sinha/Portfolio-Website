import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Reveal } from '../components/Reveal';
import { SplitText } from '../components/SplitText';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

const DOMAINS = [
  'Full-Stack Development',
  'AI & Machine Learning',
  'Cloud Engineering',
  '3D & WebGL',
  'Interactive Experiences',
];

const CYCLE_WORDS = [
  'FULL-STACK',
  'AI-POWERED',
  'IMMERSIVE',
];

export function Manifesto() {
  const cycleRef = useRef<HTMLSpanElement | null>(null);
  const { prefersReducedMotion, ready } = useDeviceCapability();

  useEffect(() => {
    if (!ready || !cycleRef.current) return;

    const el = cycleRef.current;

    if (prefersReducedMotion) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    let idx = 0;
    el.textContent = CYCLE_WORDS[0];
    gsap.set(el, { autoAlpha: 0, y: 14 });

    const ctx = gsap.context(() => {
      const step = () => {
        gsap.timeline()
          .to(el, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
          })
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
              step();
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
      <SplitText
        as="h2"
        className="font-semibold leading-[1.05] tracking-tight text-[clamp(2rem,6vw,4.5rem)] max-w-4xl"
        trigger="scroll"
        stagger={0.04}
        duration={0.75}
      >
        I build intelligent, interactive experiences that bring together code, data, and the real world.
      </SplitText>

      <div
        aria-hidden="true"
        className="mt-14 h-[1.35em] overflow-hidden text-[clamp(1.75rem,5vw,3.5rem)]"
      >
        <span
          ref={cycleRef}
          className="block font-semibold text-accent"
          style={{ opacity: 0 }}
        >
          {CYCLE_WORDS[0]}
        </span>
      </div>

      <p className="sr-only">
        Focus areas: {CYCLE_WORDS.join(', ')}
      </p>

      <Reveal delay={0.1} className="flex flex-wrap gap-3 mt-10">
        {DOMAINS.map((domain) => (
          <span
            key={domain}
            className="mono-label border border-line-strong rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-text-muted text-xs sm:text-[0.8125rem]"
          >
            {domain}
          </span>
        ))}
      </Reveal>
    </section>
  );
}
