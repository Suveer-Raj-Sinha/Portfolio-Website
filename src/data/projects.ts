import type { ProjectCaseStudy, CaseStudyMetric, CaseStudyChallenge } from './caseStudies';

export type { ProjectCaseStudy, CaseStudyMetric, CaseStudyChallenge };

export type ProjectStatus =
  | 'live'
  | 'in-development'
  | 'experiment'
  | 'archived';

export interface Project {
  id: string;
  index: string;
  name: string;
  title?: string;
  category: string;
  categories: string[];
  description: string;
  tech: string[];
  technologies?: string[];
  image: string; // path relative to /public
  liveUrl?: string;
  demoUrl?: string;
  codeUrl: string;
  repoUrl?: string;
  status: ProjectStatus;
  featured: boolean;
  featuredOrder?: number;
  keywords?: string[];
  statusBadge?: {
    text: string;
    color: 'emerald' | 'amber' | 'cyan';
  };
  caseStudy?: ProjectCaseStudy;
}

export const projects: Project[] = [
  {
    id: 'solaris',
    index: '01',
    name: 'Solaris',
    title: 'Solaris',
    category: '3D Interactive Solar System Explorer',
    categories: ['3D & Creative Computing', 'Games & Interactive', 'Systems & Experiments'],
    description:
      'A production-quality, cinematic 3D digital planetarium. Explore the cosmos from a spaceship cockpit, navigate via warp speed travel, and decrypt geological planetary anomalies. Combines high-performance WebGL graphics, physical orbital simulation, and dynamic audio feedback to turn learning about space into an adventure.',
    tech: ['React', 'Three.js', 'React Three Fiber', 'GLSL', 'Zustand'],
    technologies: ['React', 'Three.js', 'React Three Fiber', 'GLSL', 'Zustand'],
    image: '/images/solaris.png',
    liveUrl: 'https://solaris-launchpad.vercel.app/',
    demoUrl: 'https://solaris-launchpad.vercel.app/',
    codeUrl: 'https://github.com/Suveer-Raj-Sinha/solaris',
    repoUrl: 'https://github.com/Suveer-Raj-Sinha/solaris',
    status: 'live',
    featured: true,
    featuredOrder: 1,
    keywords: ['3d', 'astronomy', 'space', 'solar system', 'planetarium', 'webgl', 'glsl', 'physics', 'kepler', 'simulation', 'threejs', 'react'],
    statusBadge: {
      text: '3D WEBGL ENGINE',
      color: 'amber',
    },
  },
  {
    id: 'terra-live',
    index: '02',
    name: 'Terra Live',
    title: 'Terra Live',
    category: 'Real-Time Disaster Monitoring Platform',
    categories: ['Web & Full-stack', 'Systems & Experiments'],
    description:
      'A high-performance, full-stack real-time disaster monitoring platform. Aggregates global hazard feeds — earthquakes, wildfires, volcanic activity, and tropical cyclones — into a unified, interactive map dashboard featuring a tectonic plate boundary overlay.',
    tech: ['React', 'TypeScript', 'FastAPI', 'SQLite', 'React Leaflet'],
    technologies: ['React', 'TypeScript', 'FastAPI', 'SQLite', 'React Leaflet'],
    image: '/images/terra-live.png',
    liveUrl: 'https://terra-live.vercel.app',
    demoUrl: 'https://terra-live.vercel.app',
    codeUrl: 'https://github.com/Suveer-Raj-Sinha/Terra-Live',
    repoUrl: 'https://github.com/Suveer-Raj-Sinha/Terra-Live',
    status: 'live',
    featured: true,
    featuredOrder: 3,
    keywords: ['gis', 'mapping', 'disaster', 'real-time', 'earthquakes', 'wildfires', 'volcanoes', 'fastapi', 'leaflet', 'python', 'sqlite', 'react'],
    statusBadge: {
      text: 'LIVE DASHBOARD',
      color: 'emerald',
    },
  },
  {
    id: 'arcadelab',
    index: '03',
    name: 'ArcadeLab',
    title: 'ArcadeLab',
    category: 'Interactive Gaming Platform',
    categories: ['Games & Interactive', 'Web & Full-stack'],
    description:
      'A premium, ever-evolving digital arcade built with React, TypeScript, Vite, CSS, and HTML5 Canvas. Featuring 20 playable retro-inspired games across puzzles, shooters, platformers, and arcade classics, ArcadeLab combines a custom game loop, procedural audio, unified high scores, CRT effects, and a polished neon-cyberpunk interface. Designed as a continuously expanding platform, with new games and features added over time.',
    tech: ['React', 'TypeScript', 'Vite', 'CSS', 'HTML5 Canvas', 'Web Audio API'],
    technologies: ['React', 'TypeScript', 'Vite', 'CSS', 'HTML5 Canvas', 'Web Audio API'],
    image: '/images/arcadelab.png',
    liveUrl: 'https://arcadelab.vercel.app',
    demoUrl: 'https://arcadelab.vercel.app',
    codeUrl: 'https://github.com/Suveer-Raj-Sinha/ArcadeLab',
    repoUrl: 'https://github.com/Suveer-Raj-Sinha/ArcadeLab',
    status: 'live',
    featured: true,
    featuredOrder: 2,
    keywords: ['games', 'arcade', 'retro', 'canvas', 'typescript', 'game loop', 'audio', 'crt', 'high scores', 'vite', 'react'],
    statusBadge: {
      text: 'EVER-EVOLVING ARCADE',
      color: 'emerald',
    },
  },
  {
    id: 'weblens',
    index: '04',
    name: 'WebLens',
    title: 'WebLens',
    category: 'AI-Powered Visual Search Extension',
    categories: ['AI / Machine Learning', 'Web & Full-stack', 'Systems & Experiments'],
    description:
      'A Chrome extension that captures any part of a webpage and searches it visually using Gemini AI, Google Lens, and Custom Search. Supports full-page capture, visible area, and freehand region selection — with results saved to a searchable history.',
    tech: ['React', 'FastAPI', 'Python', 'Chrome Extension APIs', 'Gemini Vision'],
    technologies: ['React', 'FastAPI', 'Python', 'Chrome Extension APIs', 'Gemini Vision'],
    image: '/images/weblens.png',
    codeUrl: 'https://github.com/Suveer-Raj-Sinha/visual-search-extension',
    repoUrl: 'https://github.com/Suveer-Raj-Sinha/visual-search-extension',
    status: 'live',
    featured: false,
    keywords: ['ai', 'gemini', 'vision', 'chrome extension', 'multimodal', 'screen capture', 'lens', 'search', 'fastapi', 'python', 'react'],
    statusBadge: {
      text: 'CHROME EXTENSION',
      color: 'cyan',
    },
  },
  {
    id: 'tesseract-3d',
    index: '05',
    name: 'Tesseract 3D',
    title: 'Tesseract 3D',
    category: 'GPGPU Particle Physics Laboratory & WebGL2 Engine',
    categories: ['3D & Creative Computing', 'Systems & Experiments'],
    description:
      'A high-performance real-time 3D particle physics simulation and interactive cosmological playground. Simulates up to 16,384 physical bodies with Newtonian gravity, 3D divergence-free curl noise fluid turbulence, Gravitational Singularity Core (Black Hole / White Hole), and optical post-processing running at locked 60 FPS via WebGL2 GPGPU computing.',
    tech: ['React', 'Three.js', 'WebGL2', 'GLSL', 'GPGPU', 'Web Audio API'],
    technologies: ['React', 'Three.js', 'WebGL2', 'GLSL', 'GPGPU', 'Web Audio API'],
    image: '/images/tesseract-3d.png',
    liveUrl: 'https://tesseract-3d.vercel.app',
    demoUrl: 'https://tesseract-3d.vercel.app',
    codeUrl: 'https://github.com/Suveer-Raj-Sinha/Tesseract3d',
    repoUrl: 'https://github.com/Suveer-Raj-Sinha/Tesseract3d',
    status: 'live',
    featured: false,
    keywords: ['gpgpu', 'particles', 'physics', 'webgl2', 'glsl', 'threejs', 'singularity', 'black hole', 'curl noise', 'simulation', 'react'],
    statusBadge: {
      text: 'GPGPU PHYSICS LAB',
      color: 'cyan',
    },
  },
];

// ── Curated Featured Selection for Homepage Showcase ────────────────────────
export const featuredProjects = projects
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

// Strict development validation: exactly 3 featured projects required
if (import.meta.env.DEV && featuredProjects.length !== 3) {
  console.warn(
    `[projects.ts] Configuration Notice: Exactly 3 featured projects expected for homepage showcase, but found ${featuredProjects.length}.`
  );
}

// ── Categories & Filtering Metadata ──────────────────────────────────────────
export const PROJECT_CATEGORIES = [
  'All',
  'Web & Full-stack',
  'AI / Machine Learning',
  'Games & Interactive',
  '3D & Creative Computing',
  'Systems & Experiments',
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const PROJECT_STATUSES: { value: ProjectStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'live', label: 'Live' },
  { value: 'in-development', label: 'In Development' },
  { value: 'experiment', label: 'Experiment' },
  { value: 'archived', label: 'Archived' },
];

// Extract all unique technologies sorted alphabetically
export const ALL_PROJECT_TECHNOLOGIES = Array.from(
  new Set(projects.flatMap((p) => p.technologies ?? p.tech))
).sort((a, b) => a.localeCompare(b));
