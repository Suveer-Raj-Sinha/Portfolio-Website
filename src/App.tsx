import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { MeridianSpine } from './components/MeridianSpine';
import { SlideRail } from './components/SlideRail';
import { Cursor } from './components/Cursor';
import { Hero } from './sections/Hero';
import { Manifesto } from './sections/Manifesto';
import { Skills } from './sections/Skills';
import { Projects } from './sections/Projects';
import { About } from './sections/About';
import { Journey } from './sections/Journey';
import { Contact } from './sections/Contact';
import { useDeviceCapability } from './hooks/useDeviceCapability';
import { useTouchSwipe } from './hooks/useTouchSwipe';

function App() {
  const { prefersReducedMotion } = useDeviceCapability();
  useTouchSwipe();

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', prefersReducedMotion);
  }, [prefersReducedMotion]);

  return (
    <>
      <div className="ambient-glow" aria-hidden="true" />
      <div className="ambient-pattern" aria-hidden="true" />
      <div className="ambient-grain" aria-hidden="true" />
      <Cursor />
      <a
        href="#hero"
        className="fixed left-4 top-4 z-60 -translate-y-24 focus:translate-y-0 transition-transform bg-accent text-ink font-medium px-4 py-2 rounded-full"
      >
        Skip to content
      </a>
      <Nav />
      <MeridianSpine />
      <SlideRail />
      <main>
        <Hero />
        <Manifesto />
        <Skills />
        <Projects />
        <About />
        <Journey />
        <Contact />
      </main>
    </>
  );
}

export default App;
