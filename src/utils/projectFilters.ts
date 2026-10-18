import type { Project } from '../data/projects';

export interface ProjectFilterState {
  query: string;
  category: string;
  technologies: string[];
  status: string;
}

export const INITIAL_FILTERS: ProjectFilterState = {
  query: '',
  category: 'All',
  technologies: [],
  status: 'all',
};

/**
 * Filters the project catalog based on search text, category, tech stack, and status.
 *
 * Rules:
 * - Query searches across title, description, categories, technologies, and keywords.
 * - Category and technology filters intersect (must satisfy both).
 * - Multiple selected technologies match any (OR) selected technology.
 * - Status filter narrows results.
 */
export function filterProjects(
  projectList: Project[],
  filters: ProjectFilterState
): Project[] {
  const q = filters.query.trim().toLowerCase();

  return projectList.filter((project) => {
    // 1. Full-text search
    if (q) {
      const matchName = project.name.toLowerCase().includes(q);
      const matchDesc = project.description.toLowerCase().includes(q);
      const matchCategory = (project.categories || []).some((c) =>
        c.toLowerCase().includes(q)
      ) || project.category.toLowerCase().includes(q);
      const matchTech = (project.technologies || project.tech).some((t) =>
        t.toLowerCase().includes(q)
      );
      const matchKeywords = (project.keywords || []).some((k) =>
        k.toLowerCase().includes(q)
      );

      if (!matchName && !matchDesc && !matchCategory && !matchTech && !matchKeywords) {
        return false;
      }
    }

    // 2. Category filter
    if (filters.category && filters.category !== 'All') {
      const inCategory =
        (project.categories && project.categories.includes(filters.category)) ||
        project.category === filters.category;
      if (!inCategory) return false;
    }

    // 3. Status filter
    if (filters.status && filters.status !== 'all') {
      if (project.status !== filters.status) return false;
    }

    // 4. Technology filter (Match any selected technology)
    if (filters.technologies && filters.technologies.length > 0) {
      const projectTechList = (project.technologies || project.tech).map((t) =>
        t.toLowerCase()
      );
      const hasAnySelected = filters.technologies.some((selectedTech) =>
        projectTechList.includes(selectedTech.toLowerCase())
      );
      if (!hasAnySelected) return false;
    }

    return true;
  });
}

/**
 * Parses URL query parameters into ProjectFilterState.
 */
export function parseFiltersFromParams(search: string): ProjectFilterState {
  const params = new URLSearchParams(search);
  const query = params.get('q') || params.get('search') || '';
  const category = params.get('category') || 'All';
  const status = params.get('status') || 'all';
  const techParam = params.get('tech');
  const technologies = techParam
    ? techParam
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return {
    query,
    category,
    status,
    technologies,
  };
}

/**
 * Serializes ProjectFilterState into URL query string parameters.
 */
export function serializeFiltersToParams(filters: ProjectFilterState): string {
  const params = new URLSearchParams();

  if (filters.query.trim()) {
    params.set('q', filters.query.trim());
  }
  if (filters.category && filters.category !== 'All') {
    params.set('category', filters.category);
  }
  if (filters.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }
  if (filters.technologies.length > 0) {
    params.set('tech', filters.technologies.join(','));
  }

  const str = params.toString();
  return str ? `?${str}` : '';
}
