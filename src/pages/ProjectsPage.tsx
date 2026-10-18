import { useState, useEffect, useMemo, useRef } from 'react';
import {
  projects,
  PROJECT_CATEGORIES,
  type Project,
  type ProjectCategory,
} from '../data/projects';
import {
  filterProjects,
  parseFiltersFromParams,
  serializeFiltersToParams,
  INITIAL_FILTERS,
  type ProjectFilterState,
} from '../utils/projectFilters';
import { TechIcon } from '../components/TechIcons';
import { ProjectDrawer } from '../components/ProjectDrawer';
import { FilterDrawer } from '../components/FilterDrawer';
import { Magnetic } from '../components/Magnetic';
import { playSelectSound, playHoverSound } from '../utils/audio';

interface ProjectsPageProps {
  onNavigateHome: () => void;
}

// Maps project technology strings to TechIcon IDs
function getTechIconId(name: string): string {
  const lower = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (lower.includes('reactthreefiber') || lower === 'r3f') return 'r3f';
  if (lower.includes('three')) return 'threejs';
  if (lower.includes('react')) return 'react';
  if (lower.includes('typescript')) return 'typescript';
  if (lower.includes('javascript')) return 'javascript';
  if (lower.includes('python')) return 'python';
  if (lower.includes('fastapi')) return 'fastapi';
  if (lower.includes('canvas')) return 'canvas';
  if (lower.includes('node')) return 'nodejs';
  if (lower.includes('sqlite') || lower.includes('sql')) return 'sql';
  if (lower.includes('html')) return 'html';
  if (lower.includes('css')) return 'css';
  return 'react';
}

export function ProjectsPage({ onNavigateHome }: ProjectsPageProps) {
  // Initialize filter state from URL query parameters
  const [filters, setFilters] = useState<ProjectFilterState>(() =>
    parseFiltersFromParams(window.location.search)
  );

  const [selectedDrawerProject, setSelectedDrawerProject] = useState<Project | null>(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronize filter state changes with URL query string
  useEffect(() => {
    const queryStr = serializeFiltersToParams(filters);
    const newUrl = `${window.location.pathname}${queryStr}`;
    window.history.replaceState(null, '', newUrl);
  }, [filters]);



  // Keyboard shortcut to focus search input with '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current && !isFilterDrawerOpen) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFilterDrawerOpen]);

  // Compute category project counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: projects.length };
    PROJECT_CATEGORIES.forEach((cat) => {
      if (cat === 'All') return;
      counts[cat] = projects.filter(
        (p) => (p.categories && p.categories.includes(cat)) || p.category === cat
      ).length;
    });
    return counts;
  }, []);

  // Filtered projects based on active criteria
  const filteredProjects = useMemo(() => {
    return filterProjects(projects, filters);
  }, [filters]);

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0) +
    filters.technologies.length;

  const hasActiveFilters = Boolean(filters.query.trim()) || activeFilterCount > 0;

  // Filter actions
  const handleQueryChange = (val: string) => {
    setFilters((prev) => ({ ...prev, query: val }));
  };

  const handleCategorySelect = (cat: ProjectCategory) => {
    playSelectSound();
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const handleStatusSelect = (st: string) => {
    playSelectSound();
    setFilters((prev) => ({ ...prev, status: st }));
  };

  const handleTechToggle = (tech: string) => {
    playSelectSound();
    setFilters((prev) => {
      const exists = prev.technologies.includes(tech);
      return {
        ...prev,
        technologies: exists
          ? prev.technologies.filter((t) => t !== tech)
          : [...prev.technologies, tech],
      };
    });
  };

  const handleClearFilters = () => {
    playSelectSound();
    setFilters(INITIAL_FILTERS);
    if (searchInputRef.current) searchInputRef.current.value = '';
  };

  const openFilterDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  return (
    <div className="min-h-screen text-text relative pt-16 lg:pt-20 selection:bg-accent selection:text-ink">
      {/* ── Page Content ─────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-1 pb-12">
        {/* Navigation & Title Header (Ultra-Compact) */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5 pb-2.5 border-b border-line/60">
          <div className="flex flex-wrap items-center gap-2.5">
            <Magnetic
              as="button"
              type="button"
              onClick={() => {
                playSelectSound();
                onNavigateHome();
              }}
              onMouseEnter={playHoverSound}
              className="bg-panel-raised border border-line hover:border-accent text-text hover:text-accent px-3 py-1 rounded-full text-xs font-mono transition-all inline-flex items-center gap-1.5 group cursor-pointer shadow-sm"
            >
              <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">&larr;</span>
              <span>Back to Showcase</span>
            </Magnetic>
            <span className="text-line-strong">•</span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight inline-flex items-center gap-2">
              <span>All Projects</span>
              <span className="mono-label text-[10px] text-accent bg-accent/10 border border-accent/30 rounded-full px-2 py-0.5 font-normal">
                {projects.length} Builds
              </span>
            </h1>
          </div>

          <button
            type="button"
            onClick={openFilterDrawer}
            onMouseEnter={playHoverSound}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer border shadow-sm ${
              activeFilterCount > 0
                ? 'bg-accent/15 border-accent text-accent font-semibold shadow-[0_0_15px_rgba(229,160,75,0.25)]'
                : 'bg-panel border-line hover:border-accent text-text-muted hover:text-text'
            }`}
          >
            <svg className="w-3.5 h-3.5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filter Drawer</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-accent text-ink text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Compact Top Controls Bar ────────────────────────────────────── */}
        <div className="bg-panel-raised border border-line rounded-xl p-3 mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-md">
          {/* Quick Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 text-text-muted pointer-events-none text-xs font-mono">
              &gt;_
            </span>
            <input
              id="project-search"
              ref={searchInputRef}
              type="text"
              value={filters.query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search by title, stack (e.g. Three.js, Python), or keywords..."
              className="w-full bg-ink/70 border border-line hover:border-line-strong focus:border-accent text-text placeholder:text-text-dim rounded-lg pl-9 pr-16 py-2 text-xs font-mono transition-colors focus:outline-none"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {filters.query && (
                <button
                  type="button"
                  onClick={() => handleQueryChange('')}
                  className="text-text-dim hover:text-accent text-[11px] font-mono px-1 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
              <kbd className="hidden sm:inline-block border border-line text-[9px] font-mono text-text-dim px-1.5 py-0.2 rounded bg-panel">
                /
              </kbd>
            </div>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {PROJECT_CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-[11px] rounded-lg px-2.5 py-1.5 font-mono whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-accent text-ink font-semibold border-accent shadow-sm'
                      : 'bg-panel border-line text-text-muted hover:border-line-strong hover:text-text'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[9px] px-1 rounded ${
                      isSelected ? 'bg-ink/20 text-ink' : 'bg-line text-text-dim'
                    }`}
                  >
                    {categoryCounts[cat] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Active Filters Chips Bar & Counter ────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <p className="mono-label text-xs text-text-muted">
            SHOWING <span className="text-accent font-semibold">{filteredProjects.length}</span> OF{' '}
            {projects.length} PROJECTS
          </p>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {filters.query.trim() && (
                <span className="mono-label text-[11px] bg-panel border border-line rounded-full px-2.5 py-0.5 text-text flex items-center gap-1">
                  Query: &ldquo;{filters.query}&rdquo;
                  <button
                    type="button"
                    onClick={() => handleQueryChange('')}
                    className="text-text-muted hover:text-accent ml-1 cursor-pointer"
                    aria-label="Remove search query"
                  >
                    &times;
                  </button>
                </span>
              )}

              {filters.category !== 'All' && (
                <span className="mono-label text-[11px] bg-panel border border-accent/40 rounded-full px-2.5 py-0.5 text-accent flex items-center gap-1">
                  Category: {filters.category}
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('All')}
                    className="text-accent hover:text-accent-hover ml-1 cursor-pointer"
                    aria-label="Reset category"
                  >
                    &times;
                  </button>
                </span>
              )}

              {filters.status !== 'all' && (
                <span className="mono-label text-[11px] bg-panel border border-line rounded-full px-2.5 py-0.5 text-text flex items-center gap-1">
                  Status: {filters.status}
                  <button
                    type="button"
                    onClick={() => handleStatusSelect('all')}
                    className="text-text-muted hover:text-accent ml-1 cursor-pointer"
                    aria-label="Reset status"
                  >
                    &times;
                  </button>
                </span>
              )}

              {filters.technologies.map((t) => (
                <span
                  key={t}
                  className="mono-label text-[11px] bg-panel border border-accent/30 rounded-full px-2.5 py-0.5 text-text-muted flex items-center gap-1"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleTechToggle(t)}
                    className="text-text-muted hover:text-accent ml-1 cursor-pointer"
                    aria-label={`Remove tech ${t}`}
                  >
                    &times;
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-mono text-accent hover:text-accent-hover hover:underline ml-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ── Projects Grid ───────────────────────────────────────────────── */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id || project.name}
                className="bg-panel-raised border border-line hover:border-accent/60 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_0_25px_rgba(229,160,75,0.12)] relative"
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-video w-full overflow-hidden bg-ink border-b border-line">
                  <img
                    src={project.image}
                    alt={`${project.name} interface preview`}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />

                  {/* Corner CAD reticles */}
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-accent/70 pointer-events-none">
                    ┌
                  </div>
                  <div className="absolute top-2 right-2 text-[10px] font-mono text-accent/70 pointer-events-none">
                    ┐
                  </div>

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    {project.statusBadge && (
                      <span className="mono-label text-[10px] font-semibold tracking-wider bg-ink/80 backdrop-blur-md border border-line rounded px-2 py-0.5 text-text flex items-center gap-1.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            project.statusBadge.color === 'emerald'
                              ? 'bg-emerald-400'
                              : project.statusBadge.color === 'amber'
                              ? 'bg-amber-400'
                              : 'bg-cyan-400'
                          }`}
                        />
                        {project.statusBadge.text}
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="mono-label text-[10px] bg-ink/80 backdrop-blur-md border border-line rounded px-2 py-0.5 text-accent font-mono">
                      SPEC // {project.index}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Primary category */}
                    <p className="mono-label text-xs text-accent mb-1">{project.category}</p>
                    <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-accent transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-text-muted text-xs leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1 mb-5">
                      {(project.technologies || project.tech).map((t) => (
                        <span
                          key={t}
                          className="mono-label text-[11px] border border-line rounded-full px-2.5 py-0.5 text-text-muted flex items-center gap-1 bg-panel/40"
                        >
                          <TechIcon id={getTechIconId(t)} size={11} className="shrink-0" />
                          <span>{t}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-line/60 flex flex-wrap items-center gap-2">
                    <Magnetic
                      as="button"
                      type="button"
                      onClick={() => {
                        playSelectSound();
                        setSelectedDrawerProject(project);
                      }}
                      className="bg-accent/15 border border-accent/60 hover:bg-accent text-accent hover:text-ink font-mono font-medium px-3.5 py-1.5 rounded-full text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Architecture Specs</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Magnetic>

                    {project.liveUrl && (
                      <Magnetic
                        href={project.liveUrl}
                        className="bg-panel border border-line hover:border-accent text-text px-3 py-1.5 rounded-full text-xs hover:text-accent font-mono transition-colors inline-block"
                      >
                        Live demo ↗
                      </Magnetic>
                    )}

                    <Magnetic
                      href={project.codeUrl}
                      className="border border-line-strong px-3 py-1.5 rounded-full text-xs text-text-muted hover:border-accent hover:text-accent font-mono transition-colors inline-block"
                    >
                      View code
                    </Magnetic>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-panel-raised border border-line rounded-2xl p-12 text-center max-w-xl mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/30 mx-auto mb-4 flex items-center justify-center text-accent text-xl font-mono">
              [ 0 ]
            </div>
            <h2 className="text-xl font-semibold mb-2">No Matching Projects Found</h2>
            <p className="text-text-muted text-xs leading-relaxed mb-6">
              No project matches the current combination of search and filter settings.
              Try resetting your filters or modifying search keywords.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="bg-accent text-ink font-semibold px-5 py-2.5 rounded-full text-xs font-mono hover:bg-accent-hover transition-all cursor-pointer shadow-md"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Bottom Navigation Return */}
        <div className="mt-16 pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="mono-label text-xs text-text-dim">
            PROJECT CATALOG // VERSION 2.0 // CLIENT-SIDE ROUTED
          </p>
          <Magnetic
            as="button"
            type="button"
            onClick={() => {
              playSelectSound();
              onNavigateHome();
            }}
            className="bg-panel border border-accent/40 hover:border-accent text-accent px-5 py-2 rounded-full text-xs font-mono transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <span>&larr; Return to Homepage Showcase</span>
          </Magnetic>
        </div>
      </main>

      {/* ── Slide-Out Filter Drawer with GSAP Smooth Slide Animation ── */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        categoryCounts={categoryCounts}
        filteredCount={filteredProjects.length}
        hasActiveFilters={hasActiveFilters}
        onCategorySelect={handleCategorySelect}
        onTechToggle={handleTechToggle}
        onClearTech={() => setFilters((prev) => ({ ...prev, technologies: [] }))}
        onStatusSelect={handleStatusSelect}
        onClearFilters={handleClearFilters}
      />

      {/* Shared Case Study Specification Drawer */}
      <ProjectDrawer
        project={selectedDrawerProject}
        onClose={() => setSelectedDrawerProject(null)}
      />
    </div>
  );
}
