import { useEffect, lazy, Suspense } from 'react';
import { useRoute } from './hooks/useRoute';
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
import { CommandPalette } from './components/CommandPalette';
import { CyberTerminal } from './components/CyberTerminal';
import { Toast } from './components/Toast';
import { applyTheme, getSavedTheme } from './utils/theme';

const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage }))
);

function App() {
  const { prefersReducedMotion } = useDeviceCapability();
  const { isProjectsArchive, navigate } = useRoute();
  useTouchSwipe(!isProjectsArchive);

  // Initialize saved theme on mount
  useEffect(() => {
    applyTheme(getSavedTheme(), { notify: false });
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', prefersReducedMotion);
  }, [prefersReducedMotion]);

  // Toggle smooth scrolling & remove scroll snap on /projects archive
  useEffect(() => {
    document.documentElement.classList.toggle('no-snap', isProjectsArchive);
    document.body.classList.toggle('no-snap', isProjectsArchive);
    return () => {
      document.documentElement.classList.remove('no-snap');
      document.body.classList.remove('no-snap');
    };
  }, [isProjectsArchive]);

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

      {/* Global Navigation Header is always available */}
      <Nav />

      {isProjectsArchive ? (
        <Suspense fallback={<div className="min-h-screen bg-ink flex items-center justify-center font-mono text-xs text-accent">LOADING DIRECTORY...</div>}>
          <ProjectsPage onNavigateHome={() => navigate('/', { scrollId: 'projects' })} />
        </Suspense>
      ) : (
        <>
          <MeridianSpine />
          <SlideRail />
          <main>
            <Hero />
            <Manifesto />
            <Skills />
            <Projects onNavigateProjects={() => navigate('/projects')} />
            <About />
            <Journey />
            <Contact />
          </main>
        </>
      )}

      <CommandPalette />
      <CyberTerminal />
      <Toast />
    </>
  );
}

export default App;
