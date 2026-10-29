import { useState, useEffect } from 'react';
import { Reveal } from '../components/Reveal';
import { Magnetic } from '../components/Magnetic';
import { ProjectCardPreview } from '../components/ProjectCardPreview';
import { ProjectDrawer } from '../components/ProjectDrawer';
import { projects, featuredProjects, type Project } from '../data/projects';
import { playSelectSound } from '../utils/audio';
import { showToast } from '../hooks/useToast';

interface ProjectsProps {
  onNavigateProjects?: () => void;
}

export function Projects({ onNavigateProjects }: ProjectsProps) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const handleGoToArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateProjects) {
      onNavigateProjects();
    } else {
      window.history.pushState(null, '', '/projects');
      window.dispatchEvent(new CustomEvent('app:route-change'));
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  };

  // Listen for open-project-drawer events & Direct URL Hash Deep-Linking
  useEffect(() => {
    const handleOpenProject = (e: Event) => {
      const custom = e as CustomEvent<{ identifier: string | number }>;
      const target = custom.detail?.identifier;
      if (!target) return;

      const targetStr = String(target).toLowerCase().trim();
      const targetClean = targetStr.replace(/[\s-_]+/g, '');

      const found = projects.find((p) => {
        const nameLower = p.name.toLowerCase();
        const nameClean = nameLower.replace(/[\s-_]+/g, '');
        const slug = nameLower.replace(/\s+/g, '-');
        return (
          p.id === targetStr ||
          nameLower === targetStr ||
          nameClean === targetClean ||
          slug === targetStr ||
          p.index === targetStr ||
          nameLower.includes(targetStr) ||
          targetStr.includes(nameClean) ||
          targetClean.includes(nameClean)
        );
      });

      if (found) {
        setActiveProject(found);
      }
    };

    // Check direct deep-linking URL hash (e.g. /#solaris or /#terra-live)
    const checkHash = () => {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase().trim();
      if (!hash) return;

      const found = projects.find((p) => {
        const slug = p.name.toLowerCase().replace(/\s+/g, '-');
        const compact = p.name.toLowerCase().replace(/\s+/g, '');
        return (
          hash === p.id ||
          hash === slug ||
          hash === compact ||
          hash === `project-${p.index.toLowerCase()}` ||
          hash === `project-${projects.indexOf(p)}`
        );
      });

      if (found) {
        setActiveProject(found);
        const idx = featuredProjects.indexOf(found);
        if (idx !== -1) {
          setTimeout(() => {
            document.getElementById(`project-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 150);
        }
        showToast(`Deep-linked: ${found.name} specs`, 'accent');
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    window.addEventListener('open-project-drawer', handleOpenProject);
    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('open-project-drawer', handleOpenProject);
    };
  }, []);

  // Sync address bar URL hash with active case study drawer
  useEffect(() => {
    if (activeProject) {
      const slug = activeProject.name.toLowerCase().replace(/\s+/g, '-');
      history.replaceState(null, '', `#${slug}`);
    } else {
      const currentHash = window.location.hash.replace(/^#/, '');
      const isProjectHash = projects.some(
        (p) => p.name.toLowerCase().replace(/\s+/g, '-') === currentHash || p.id === currentHash,
      );
      if (isProjectHash) {
        history.replaceState(null, '', '#projects');
      }
    }
  }, [activeProject]);

  return (
    <section id="projects" className="relative">
      {featuredProjects.map((project, i) => (
        <article
          key={project.name}
          id={`project-${i}`}
          className="snap-slide min-h-screen min-h-svh flex flex-col justify-center px-6 lg:pl-40 lg:pr-24 py-10 lg:py-14 relative"
        >
          {i === 0 && (
            <Reveal>
              <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="mono-label text-accent mb-1">PORTFOLIO // FEATURED WORK</p>
                  <h2 className="font-semibold tracking-tight text-[clamp(1.75rem,3.5vw,2.5rem)]">
                    Selected work
                  </h2>
                </div>
                <Magnetic
                  as="a"
                  href="/projects"
                  onClick={handleGoToArchive}
                  className="self-start sm:self-auto bg-panel-raised border border-accent/40 hover:border-accent text-accent px-4 py-2 rounded-full text-xs font-mono transition-all duration-300 inline-flex items-center gap-2 group shadow-sm hover:shadow-[0_0_15px_rgba(229,160,75,0.2)]"
                >
                  <span>Explore All Projects ({projects.length})</span>
                  <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </Magnetic>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div
              className={`flex flex-col ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } gap-6 lg:gap-14 items-center`}
            >
              <ProjectCardPreview
                image={project.image}
                name={project.name}
                badge={project.statusBadge}
                onSelect={() => {
                  playSelectSound();
                  setActiveProject(project);
                }}
              />

              <div className="w-full lg:w-1/2">
                <div className="flex items-center justify-between mb-2">
                  <p className="mono-label text-accent text-xs">SPEC // {project.index}</p>
                  <span className="mono-label text-xs text-text-dim">
                    0{i + 1} / 0{featuredProjects.length}
                  </span>
                </div>
                <h3 className="font-semibold text-xl lg:text-3xl mb-1">{project.name}</h3>
                <p className="text-text-muted text-xs mb-3">{project.category}</p>
                <p className="text-text-muted text-sm leading-relaxed mb-5 max-w-lg">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(project.technologies || project.tech).map((t) => (
                    <span
                      key={t}
                      className="mono-label text-xs border border-line rounded-full px-2.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Magnetic
                    as="button"
                    type="button"
                    onClick={() => {
                      playSelectSound();
                      setActiveProject(project);
                    }}
                    className="bg-accent/15 border border-accent/60 hover:bg-accent text-accent hover:text-ink font-medium px-4 py-2 rounded-full text-xs transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Architecture Specs</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Magnetic>

                  {project.liveUrl && (
                    <Magnetic
                      href={project.liveUrl}
                      className="bg-panel border border-line hover:border-accent text-text px-4 py-2 rounded-full text-xs hover:text-accent transition-colors inline-block"
                    >
                      Live demo ↗
                    </Magnetic>
                  )}

                  <Magnetic
                    href={project.codeUrl}
                    className="border border-line-strong px-4 py-2 rounded-full text-xs text-text-muted hover:border-accent hover:text-accent transition-colors inline-block"
                  >
                    View code
                  </Magnetic>

                  <Magnetic
                    as="a"
                    href="/projects"
                    onClick={handleGoToArchive}
                    className="border border-line hover:border-accent/60 text-text-muted hover:text-accent px-3.5 py-2 rounded-full text-xs transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>All Projects ({projects.length})</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Magnetic>
                </div>

                {i === featuredProjects.length - 1 && (
                  <div className="mt-6 sm:mt-8 pt-4 sm:pt-5 border-t border-line/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-panel/30 p-3 sm:p-3.5 rounded-xl border border-line/70">
                    <div>
                      <p className="text-[11px] font-mono text-accent font-semibold tracking-wider">
                        FULL REPOSITORY DIRECTORY
                      </p>
                      <p className="text-xs text-text-muted">
                        Explore all {projects.length} projects with search, stack filters & case studies.
                      </p>
                    </div>
                    <Magnetic
                      as="a"
                      href="/projects"
                      onClick={handleGoToArchive}
                      className="shrink-0 bg-accent text-ink font-semibold px-4 py-1.5 rounded-full text-xs hover:bg-accent-hover transition-all"
                    >
                      Browse Archive &rarr;
                    </Magnetic>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </article>
      ))}

      {/* Slide-Over Deep-Dive Case Study Drawer */}
      <ProjectDrawer
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </section>
  );
}
