import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { profile } from '../data/profile';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { Magnetic } from '../components/Magnetic';
import { SplitText } from '../components/SplitText';
import { HeroOrbitalCanvas, type CanvasControlsState } from '../components/HeroOrbitalCanvas';
import { HeroCanvasControls } from '../components/HeroCanvasControls';
import { useState } from 'react';

const HEADLINE_LINES = [
  { text: "HELLO. I'M", delay: 0.2  },
  { text: 'SUVEER RAJ', delay: 0.34 },
  { text: 'SINHA.',     delay: 0.48 },
];

export function Hero() {
  const { prefersReducedMotion, ready } = useDeviceCapability();
  const subRef = useRef<HTMLDivElement | null>(null);
  const [controls, setControls] = useState<CanvasControlsState>({
    geometry: 'sphere',
    speed: 1,
    density: 'standard',
  });

  /* Sub-content fade — still a single tween, not using SplitText */
  useEffect(() => {
    if (!ready || prefersReducedMotion || !subRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        subRef.current,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.8, ease: 'power3.out' },
      );
    });
    return () => ctx.revert();
  }, [ready, prefersReducedMotion]);

  return (
    <section
      id="hero"
      className="min-h-screen min-h-svh flex flex-col justify-center px-6 lg:pl-40 lg:pr-24 pt-24 pb-16 relative"
    >
      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center max-w-7xl">
        {/* Left: Kinetic Typography & Actions */}
        <div>
          <h1
            aria-label="Hello. I'm Suveer Raj Sinha."
            className="font-semibold leading-[0.95] tracking-tight text-[clamp(2.75rem,8vw,7rem)]"
          >
            {HEADLINE_LINES.map(({ text, delay }) => (
              <SplitText
                key={text}
                as="span"
                className="block"
                trigger="load"
                delay={delay}
                stagger={0.08}
                duration={0.9}
                clip
              >
                {text}
              </SplitText>
            ))}
          </h1>

          <div ref={subRef} className="mt-8 max-w-xl">
            <p className="text-accent text-base sm:text-lg font-medium mb-2.5">{profile.role}</p>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed">{profile.tagline}</p>

            <div className="flex flex-wrap gap-3.5 mt-7">
              <Magnetic
                href="#projects"
                className="bg-accent text-ink font-medium px-6 py-3 rounded-full text-xs sm:text-sm hover:bg-accent-dim transition-colors inline-block"
              >
                View my work
              </Magnetic>
              <Magnetic
                href="#contact"
                className="border border-line-strong px-6 py-3 rounded-full text-xs sm:text-sm hover:border-accent hover:text-accent transition-colors inline-block"
              >
                Get in touch
              </Magnetic>
            </div>
          </div>
        </div>

        {/* Right: Interactive 3D Orbital Wireframe Canvas & HUD Controls */}
        <div className="hidden lg:flex flex-col items-center justify-center relative gap-4">
          <HeroOrbitalCanvas controls={controls} />
          <HeroCanvasControls controls={controls} onChange={setControls} />
        </div>
      </div>
    </section>
  );
}
