export interface ProjectReference {
  name: string;
  tag: string;
}

export type TechCategoryId =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'creative'
  | 'additional'
  | 'systems';

export type ExperienceStatus =
  | 'learning'
  | 'used-in-projects'
  | 'explored'
  | 'primary-ide'
  | 'daily-env'
  | 'cloud-host'
  | 'dsa';

export interface TechnologyItem {
  id: string;
  name: string;
  category: TechCategoryId;
  iconId: string;
  description: string;
  status?: ExperienceStatus;
  statusLabel?: string;
  relatedProjects?: ProjectReference[];
  x: number;
  y: number;
}

export interface TechBranchConfig {
  id: TechCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  x: number;
  y: number;
  technologies: TechnologyItem[];
}

export const VB_W = 1200;
export const VB_H = 680;

export const CENTER_NODE = {
  x: 600,
  y: 340,
  label: 'CORE STACK',
  sublabel: 'System Engine',
};

// ==========================================
// 6 CONNECTED BRANCHES IN ONE HARMONIOUS TREE
// Symmetrical Hexagonal Hubs around (600, 340)
// Zero nodes intersecting backbone lines
// Filled top-middle, balanced VS Code & Firebase
// ==========================================

export const TECH_BRANCHES: TechBranchConfig[] = [
  // 1. FRONTEND DEVELOPMENT (Top-Left Hub at 360, 160)
  {
    id: 'frontend',
    label: 'Frontend Development',
    shortLabel: 'Frontend',
    description: 'Component architecture, reactive state, and accessible client interfaces.',
    x: 360,
    y: 160,
    technologies: [
      {
        id: 'fe-react',
        name: 'React',
        category: 'frontend',
        iconId: 'react',
        description: 'Component-driven UI library utilized for high-performance single-page applications, custom state graphs, and interactive 3D web apps.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Tesseract 3D', tag: 'R3F Canvas' },
          { name: 'Terra Live', tag: 'Dashboard' },
          { name: 'Solaris', tag: 'UI & State' },
        ],
        x: 120,
        y: 80,
      },
      {
        id: 'fe-typescript',
        name: 'TypeScript',
        category: 'frontend',
        iconId: 'typescript',
        description: 'Strictly typed superset of JavaScript providing robust type contracts, compile-time validation, and scalable codebases.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Tesseract 3D', tag: 'GPGPU Engine' },
          { name: 'Terra Live', tag: 'Full-Stack' },
          { name: 'Solaris', tag: '3D Simulation' },
          { name: 'WebLens', tag: 'AI Vision' },
        ],
        x: 260,
        y: 60,
      },
      {
        id: 'fe-javascript',
        name: 'JavaScript',
        category: 'frontend',
        iconId: 'javascript',
        description: 'Modern ECMAScript (ES6+) for DOM manipulation, asynchronous event streams, Web APIs, and browser extension service workers.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [{ name: 'WebLens', tag: 'Chrome MV3' }],
        x: 400,
        y: 50,
      },
      {
        id: 'fe-html',
        name: 'HTML5',
        category: 'frontend',
        iconId: 'html',
        description: 'Semantic markup structuring web applications, accessible document trees, and embedding high-performance graphics contexts.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 140,
        y: 175,
      },
      {
        id: 'fe-css',
        name: 'CSS3',
        category: 'frontend',
        iconId: 'css',
        description: 'Modern CSS systems, responsive layouts, CSS variables, keyframe animations, and Tailwind utility architectures.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [{ name: 'Terra Live', tag: 'HUD Layout' }],
        x: 230,
        y: 235,
      },
    ],
  },

  // 2. BACKEND DEVELOPMENT (Mid-Left Hub at 200, 340)
  {
    id: 'backend',
    label: 'Backend Development',
    shortLabel: 'Backend',
    description: 'High-throughput async APIs, service orchestration, and server runtimes.',
    x: 200,
    y: 340,
    technologies: [
      {
        id: 'be-python',
        name: 'Python',
        category: 'backend',
        iconId: 'python',
        description: 'High-level language powering asynchronous REST services, hazard telemetry aggregation, and AI multimodal pipelines.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Terra Live', tag: 'Hazard Feed' },
          { name: 'WebLens', tag: 'Gemini Backend' },
        ],
        x: 65,
        y: 270,
      },
      {
        id: 'be-fastapi',
        name: 'FastAPI',
        category: 'backend',
        iconId: 'fastapi',
        description: 'Asynchronous Python web framework delivering high-performance REST APIs, automatic OpenAPI documentation, and typed validation.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Terra Live', tag: 'FastAPI Stream' },
          { name: 'WebLens', tag: 'Vision API' },
        ],
        x: 65,
        y: 340,
      },
      {
        id: 'be-nodejs',
        name: 'Node.js',
        category: 'backend',
        iconId: 'nodejs',
        description: 'V8-powered asynchronous event-driven JavaScript runtime for scalable backend services, toolchains, and build scripts.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 75,
        y: 415,
      },
      {
        id: 'be-express',
        name: 'Express.js',
        category: 'backend',
        iconId: 'express',
        description: 'Minimalist web application framework for Node.js used for routing, middleware pipelines, and RESTful service development.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 190,
        y: 430,
      },
    ],
  },

  // 3. DATABASES & AUTHENTICATION (Bottom-Left Hub at 360, 520)
  {
    id: 'database',
    label: 'Databases & Auth',
    shortLabel: 'Data & Auth',
    description: 'Relational & document stores, caching, and secure tokenized authentication.',
    x: 360,
    y: 520,
    technologies: [
      {
        id: 'db-firebase-storage',
        name: 'Firebase Storage',
        category: 'database',
        iconId: 'firebase-storage',
        description: 'Cloud object storage infrastructure used for secure file uploads, media assets, and synchronized client content.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 250,
        y: 480,
      },
      {
        id: 'db-mongodb',
        name: 'MongoDB',
        category: 'database',
        iconId: 'mongodb',
        description: 'Document-oriented NoSQL database used with MERN architectures for schema-flexible data collections and Atlas cloud storage.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 100,
        y: 510,
      },
      {
        id: 'db-postgresql',
        name: 'PostgreSQL',
        category: 'database',
        iconId: 'postgresql',
        description: 'Advanced open-source object-relational database system with strong ACID compliance, complex querying, and relational schemas.',
        status: 'explored',
        statusLabel: 'Explored & Used',
        x: 130,
        y: 600,
      },
      {
        id: 'db-sql',
        name: 'SQL',
        category: 'database',
        iconId: 'sql',
        description: 'Structured Query Language for relational modeling, transactional schemas, joins, and spatial caching (including SQLite in Terra Live).',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [{ name: 'Terra Live', tag: 'Spatial SQLite' }],
        x: 250,
        y: 620,
      },
      {
        id: 'db-nosql',
        name: 'NoSQL',
        category: 'database',
        iconId: 'nosql',
        description: 'Non-relational data architectures optimized for flexible JSON documents, key-value lookup performance, and cloud persistence.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 370,
        y: 620,
      },
      {
        id: 'db-firebase-auth',
        name: 'Firebase Auth',
        category: 'database',
        iconId: 'firebase-auth',
        description: 'Implemented for secure multi-provider user authentication, session persistence, and token-based client access in mobile & web apps.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 490,
        y: 600,
      },
    ],
  },

  // 4. CREATIVE & INTERACTIVE DEV (Top-Right Hub at 840, 160)
  // Interactive 2D moved to a little right at (1050, 80)
  {
    id: 'creative',
    label: 'Creative & 3D Dev',
    shortLabel: 'Creative 3D',
    description: 'Hardware-accelerated WebGL, GLSL shaders, 2D game loops, and 3D simulation.',
    x: 840,
    y: 160,
    technologies: [
      {
        id: 'cr-canvas',
        name: 'HTML5 Canvas',
        category: 'creative',
        iconId: 'canvas',
        description: 'Immediate-mode 2D rendering API used for procedural visualizers, dynamic pixel buffers, particle arrays, and HUD elements.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [{ name: 'Tesseract 3D', tag: 'Web Audio / Canvas' }],
        x: 560,
        y: 50,
      },
      {
        id: 'cr-threejs',
        name: 'Three.js',
        category: 'creative',
        iconId: 'threejs',
        description: 'Hardware-accelerated WebGL library for rendering 3D geometries, procedural PBR materials, GPGPU simulation passes, and lighting.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Tesseract 3D', tag: 'GPGPU Particle FBO' },
          { name: 'Solaris', tag: 'InstancedMesh WebGL' },
        ],
        x: 700,
        y: 50,
      },
      {
        id: 'cr-r3f',
        name: 'React Three Fiber',
        category: 'creative',
        iconId: 'r3f',
        description: 'Declarative React reconciler for Three.js, coordinating dynamic 3D scene graphs, custom shader materials, and cinematic camera rigs.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Tesseract 3D', tag: 'R3F Canvas' },
          { name: 'Solaris', tag: 'Scene Graph' },
        ],
        x: 840,
        y: 60,
      },
      {
        id: 'cr-game-2d',
        name: 'Interactive 2D',
        category: 'creative',
        iconId: 'game-2d',
        description: 'Building 2D collision physics, deterministic game loops, keyboard event dispatchers, and retro arcade experiences.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 1050,
        y: 80,
      },
      {
        id: 'cr-experiences-3d',
        name: '3D Experiences',
        category: 'creative',
        iconId: 'experiences-3d',
        description: 'Engineering spatial simulations, astronomical scale rendering, particle physics, custom GLSL shaders, and audio-reactive 3D environments.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Tesseract 3D', tag: 'Physics Lab' },
          { name: 'Solaris', tag: 'Planetarium' },
        ],
        x: 1120,
        y: 160,
      },
    ],
  },

  // 5. ADDITIONAL LANGUAGES & TOOLS (Languages Hub shifted to the left at 930, 340, AI Dev Tools removed)
  {
    id: 'additional',
    label: 'Languages & Tools',
    shortLabel: 'Languages & Tools',
    description: 'Algorithmic systems, mobile SDKs, exploration languages, and modern IDEs.',
    x: 930,
    y: 340,
    technologies: [
      {
        id: 'ad-rust',
        name: 'Rust',
        category: 'additional',
        iconId: 'rust',
        description: 'Currently learning Rust while developing an application involving TypeScript, Rust, and Python.',
        status: 'learning',
        statusLabel: 'Currently learning',
        x: 810,
        y: 250,
      },
      {
        id: 'ad-vscode',
        name: 'VS Code',
        category: 'additional',
        iconId: 'vscode',
        description: 'Primary extensible development environment configured with language server protocols, custom keybindings, and remote WSL workspaces.',
        status: 'primary-ide',
        statusLabel: 'Primary IDE',
        x: 930,
        y: 250,
      },
      {
        id: 'ad-java',
        name: 'Java',
        category: 'additional',
        iconId: 'java',
        description: 'Object-oriented programming language utilized for core computer science concepts, object modeling, and native Android application foundations.',
        status: 'explored',
        statusLabel: 'Academic & Projects',
        x: 1050,
        y: 250,
      },
      {
        id: 'ad-cpp',
        name: 'C++ (DSA)',
        category: 'additional',
        iconId: 'cpp',
        description: 'High-performance systems language used primarily for algorithmic problem solving, competitive programming, and Data Structures & Algorithms.',
        status: 'dsa',
        statusLabel: 'Primarily for DSA',
        x: 1140,
        y: 320,
      },
      {
        id: 'ad-dart',
        name: 'Dart',
        category: 'additional',
        iconId: 'dart',
        description: 'Client-optimized object-oriented language paired with Flutter for cross-platform mobile application development.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 1140,
        y: 400,
      },
      {
        id: 'ad-kotlin',
        name: 'Kotlin',
        category: 'additional',
        iconId: 'kotlin',
        description: 'Modern concise JVM language applied in native Android development, Jetpack Compose UI, and asynchronous coroutines.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 1030,
        y: 440,
      },
      {
        id: 'ad-r',
        name: 'R',
        category: 'additional',
        iconId: 'r',
        description: 'Statistical computing and graphics environment utilized for exploratory data sets, mathematical formulas, and analytical visualizations.',
        status: 'explored',
        statusLabel: 'Data & Statistics',
        x: 910,
        y: 440,
      },
    ],
  },

  // 6. SYSTEMS, TOOLS & DEPLOYMENT (Bottom-Right Hub at 840, 520)
  {
    id: 'systems',
    label: 'Systems & Deployment',
    shortLabel: 'Systems & Cloud',
    description: 'Unix environments, automation scripting, version control, and cloud hosting.',
    x: 840,
    y: 520,
    technologies: [
      {
        id: 'sy-linux',
        name: 'Linux',
        category: 'systems',
        iconId: 'linux',
        description: 'Unix-based environments (Ubuntu / WSL2), process management, file permissions, daemon administration, and developer CLI workflows.',
        status: 'daily-env',
        statusLabel: 'Daily Environment',
        x: 950,
        y: 480,
      },
      {
        id: 'sy-render',
        name: 'Render',
        category: 'systems',
        iconId: 'render',
        description: 'Cloud application platform used for hosting containerized backend web services and FastAPI endpoints with automated deploys.',
        status: 'cloud-host',
        statusLabel: 'Cloud Host',
        x: 1100,
        y: 510,
      },
      {
        id: 'sy-vercel',
        name: 'Vercel',
        category: 'systems',
        iconId: 'vercel',
        description: 'Edge-optimized deployment platform hosting frontend web applications, serverless functions, and production builds.',
        status: 'cloud-host',
        statusLabel: 'Production Host',
        relatedProjects: [
          { name: 'Tesseract 3D', tag: 'Live' },
          { name: 'Solaris', tag: 'Live' },
          { name: 'Terra Live', tag: 'Live' },
        ],
        x: 1070,
        y: 600,
      },
      {
        id: 'sy-github',
        name: 'GitHub',
        category: 'systems',
        iconId: 'github',
        description: 'Cloud repository hosting, GitHub Actions CI/CD automation pipelines, open-source project management, and versioned releases.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Terra Live', tag: 'VCS & CI' },
          { name: 'WebLens', tag: 'Repo' },
        ],
        x: 950,
        y: 620,
      },
      {
        id: 'sy-git',
        name: 'Git',
        category: 'systems',
        iconId: 'git',
        description: 'Distributed version control system for atomic commits, branching strategies, collaborative code reviews, and rebasing.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        relatedProjects: [
          { name: 'Tesseract 3D', tag: 'Repo' },
          { name: 'Solaris', tag: 'Repo' },
        ],
        x: 830,
        y: 620,
      },
      {
        id: 'sy-bash',
        name: 'Bash Scripting',
        category: 'systems',
        iconId: 'bash',
        description: 'Shell automation scripts for environment setup, build pipelines, system health diagnostics, and deployment orchestration.',
        status: 'used-in-projects',
        statusLabel: 'Used in projects',
        x: 710,
        y: 600,
      },
    ],
  },
];

export const ALL_TECHNOLOGIES: TechnologyItem[] = TECH_BRANCHES.flatMap(
  (branch) => branch.technologies,
);

export const TECH_BY_ID: Record<string, TechnologyItem> = ALL_TECHNOLOGIES.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<string, TechnologyItem>,
);
