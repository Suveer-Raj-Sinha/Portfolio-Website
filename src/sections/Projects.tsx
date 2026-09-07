import { useState } from 'react';
import { Reveal } from '../components/Reveal';
import { Magnetic } from '../components/Magnetic';
import { ProjectCardPreview } from '../components/ProjectCardPreview';
import { ProjectDrawer } from '../components/ProjectDrawer';
import { projects, type Project } from '../data/projects';

export function Projects() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="relative">
      {projects.map((project, i) => (
        <article
          key={project.name}
          id={`project-${i}`}
          className="snap-slide min-h-screen min-h-svh flex flex-col justify-center px-6 lg:pl-40 lg:pr-24 py-10 lg:py-14 relative"
        >
          {i === 0 && (
            <Reveal>
              <div className="mb-6 lg:mb-8">
                <p className="mono-label text-accent mb-1">PORTFOLIO</p>
                <h2 className="font-semibold tracking-tight text-[clamp(1.75rem,3.5vw,2.5rem)]">
                  Selected work
                </h2>
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
                onSelect={() => setActiveProject(project)}
              />

              <div className="w-full lg:w-1/2">
                <div className="flex items-center justify-between mb-2">
                  <p className="mono-label text-accent text-xs">{project.index}</p>
                  <span className="mono-label text-xs text-text-dim">
                    0{i + 1} / 0{projects.length}
                  </span>
                </div>
                <h3 className="font-semibold text-xl lg:text-3xl mb-1">{project.name}</h3>
                <p className="text-text-muted text-xs mb-3">{project.category}</p>
                <p className="text-text-muted text-sm leading-relaxed mb-5 max-w-lg">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tech.map((t) => (
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
                    onClick={() => setActiveProject(project)}
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
                </div>
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
