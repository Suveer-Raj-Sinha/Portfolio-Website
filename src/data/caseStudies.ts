export interface CaseStudyMetric {
  label: string;
  value: string;
  detail: string;
}

export interface CaseStudyChallenge {
  problem: string;
  solution: string;
  impact: string;
}

export interface ProjectCaseStudy {
  headline: string;
  architectureOverview: string;
  dataPipeline: string[];
  features: {
    name: string;
    description: string;
  }[];
  metrics: CaseStudyMetric[];
  challenges: CaseStudyChallenge[];
  techBreakdown: {
    category: string;
    items: string[];
  }[];
}

export const projectCaseStudies: Record<string, ProjectCaseStudy> = {
  solaris: {
    headline: 'Hardware-Accelerated 3D Digital Planetarium & Celestial Physics',
    architectureOverview:
      'Solaris is a WebGL solar system simulator built on Three.js and React Three Fiber. Planetary bodies orbit according to Keplerian velocity equations with proportional celestial scales. The visual presentation utilizes custom GLSL shaders for Rayleigh atmospheric scattering, solar corona prominence flares, and dynamic normal-mapped planetary terrain. Camera movements transition smoothly between third-person orbital trajectories, cockpit viewports, and high-speed warp jumps using Zustand state coordination.',
    dataPipeline: [
      'Zustand deterministic clock drives Keplerian orbit calculations and time acceleration',
      'Three.js / React Three Fiber scene graph renders planets, moons, rings, and asteroid instances',
      'Custom GLSL materials add atmospheric scattering, sun-facing corona, and ring self-shadowing',
      'GSAP camera timelines and Web Audio synthesis coordinate warp travel and cockpit feedback',
    ],
    features: [
      {
        name: 'Dynamic physics simulation',
        description:
          'Accelerates or pauses planetary orbits from 0x to 50x while keeping orbital state deterministic.',
      },
      {
        name: 'Warp travel effects',
        description:
          'Combines camera timelines, bloom, chromatic aberration, vignette, vibration, and audio for hyperspace transitions.',
      },
      {
        name: 'Atmospheric and ring shaders',
        description:
          'Uses custom GLSL scattering on Earth, Venus, and Neptune plus soft planet shadows across Saturn and Uranus rings.',
      },
      {
        name: 'Moon telemetry',
        description:
          'Renders 15 interactive moons, including retrograde orbits, with camera targeting and scientific fact sheets.',
      },
      {
        name: 'Geiger scanner',
        description:
          'Uses camera-vector proximity calculations and accelerating FM pings to reveal planetary anomalies.',
      },
    ],
    metrics: [
      { label: 'Time Warp', value: '0x–50x', detail: 'Adjustable orbital simulation speed' },
      { label: 'Moons', value: '15', detail: 'Interactive solar-system orbiters' },
      { label: 'Asteroids', value: '1,500', detail: 'Instanced organic rock meshes' },
      { label: 'Audio', value: 'Web Audio', detail: 'Synthesized hum, warp, and scanner tones' },
    ],
    challenges: [
      {
        problem:
          'Astronomical scale differences caused extreme z-fighting and depth buffer precision loss between planets and distant stars.',
        solution:
          'Implemented logarithmic depth buffering (logarithmicDepthBuffer: true) combined with normalized logarithmic scaling models for planetary radiuses and orbital distances.',
        impact:
          'Eliminated visual z-fighting artifacts across scales ranging from 100 meters to 100 astronomical units.',
      },
      {
        problem:
          'Rendering tens of thousands of individual asteroid belt fragments overwhelmed the GPU draw-call pipeline.',
        solution:
          'Utilized Three.js InstancedMesh with a single draw call, positioning, rotating, and coloring thousands of asteroids via instanced matrix transformation buffers.',
        impact:
          'Reduced GPU draw calls from 12,000+ to 1, maintaining consistent 60 FPS performance.',
      },
    ],
    techBreakdown: [
      {
        category: '3D Graphics & Engine',
        items: ['Three.js', 'React Three Fiber', 'GLSL Vertex/Fragment Shaders', '@react-three/drei'],
      },
      {
        category: 'State & Logic',
        items: ['React 18', 'TypeScript', 'Zustand', 'Keplerian Physics Algorithms'],
      },
      {
        category: 'Styling & Sound',
        items: ['Tailwind CSS', 'HUD Cockpit Overlay', 'HTML5 Web Audio API'],
      },
    ],
  },

  'terra-live': {
    headline: 'Global Geohazard Telemetry & Plate Boundary Intelligence',
    architectureOverview:
      'Terra Live ingests asynchronous telemetry from USGS earthquakes and volcanoes, NASA FIRMS fire hotspots, and GDACS storm feeds. A FastAPI lifespan loop synchronizes and normalizes the feeds into indexed SQLite tables, while the React Leaflet frontend renders adaptive heatmaps, vector markers, analytics, and tectonic plate boundaries.',
    dataPipeline: [
      'Cron lifespan loop synchronizes USGS, NASA FIRMS, USGS Volcanoes, and GDACS every 5 minutes',
      'Async HTTPX ingestion normalizes heterogeneous feed payloads into a unified model',
      'Indexed local SQLite cache protects upstream feeds and serves low-latency API queries',
      'React Leaflet frontend renders adaptive heatmaps, SVG markers, and plate boundaries',
    ],
    features: [
      {
        name: 'Real-time hazard feeds',
        description:
          'Tracks earthquakes, wildfire hotspots, volcano advisories, and active tropical cyclones from authoritative global feeds.',
      },
      {
        name: 'Adaptive map states',
        description:
          'Uses global heatmaps at low zoom and detailed vector hazard markers with tooltips at high zoom.',
      },
      {
        name: 'Analytics dashboard',
        description:
          'Provides quick metrics, severity distributions, and earthquake magnitude cluster visualization.',
      },
      {
        name: 'Tectonic context',
        description:
          'A toggleable PB2002 tectonic plate boundary overlay helps relate seismic and volcanic activity to plate structure.',
      },
    ],
    metrics: [
      { label: 'Sync Cycle', value: '5 min', detail: 'Automated background synchronization' },
      { label: 'Data Sources', value: '4 Feeds', detail: 'USGS, NASA FIRMS, GDACS, NOAA/JTWC' },
      { label: 'Render Mode', value: 'Canvas', detail: 'Leaflet Canvas path rendering' },
      { label: 'Cache Layer', value: 'SQLite', detail: 'Indexed local response store' },
    ],
    challenges: [
      {
        problem:
          'Heterogeneous GeoJSON schemas across international hazard agencies caused schema drift and frontend mapping crashes.',
        solution:
          'Engineered a strict Pydantic parsing layer in FastAPI that validates, sanitizes, and normalizes disparate coordinates, timestamps, and magnitude scales into a unified GeoHazard schema.',
        impact:
          '100% resilient data parsing with zero client-side crashes from missing upstream fields.',
      },
      {
        problem:
          'Rendering thousands of concurrent seismic markers and wildfire polygons severely degraded client DOM performance during zoom and pan operations.',
        solution:
          'Implemented spatial grid bucketing and Supercluster algorithms with dynamic Level-of-Detail (LOD) marker pruning based on current zoom scale.',
        impact:
          'Canvas path rendering keeps map interaction responsive while hundreds of live hazards are drawn simultaneously.',
      },
    ],
    techBreakdown: [
      {
        category: 'Frontend & Mapping',
        items: ['React 18', 'TypeScript', 'React Leaflet', 'Leaflet MarkerCluster', 'Tailwind CSS'],
      },
      {
        category: 'Backend & Data',
        items: ['Python 3.11', 'FastAPI', 'Uvicorn', 'SQLite', 'Pydantic v2', 'HTTPX Async'],
      },
      {
        category: 'Geospatial & Feeds',
        items: ['USGS Earthquake API', 'USGS Volcanoes API', 'NASA FIRMS', 'GDACS / NOAA / JTWC', 'PB2002 Plates'],
      },
    ],
  },

  arcadelab: {
    headline:
      'A Modular Retro Arcade with Custom Game Loops, Procedural Audio, and Persistent High Scores',
    architectureOverview:
      'ArcadeLab is a React and TypeScript gaming platform powered by HTML5 Canvas and Vite. A custom useGameLoop hook separates game rendering from the React state cycle. Procedural audio is generated through the Web Audio API, while local storage preserves high scores, win streaks, and games-played statistics. The interface combines a neon-cyberpunk visual identity with optional CRT effects and interactive UI transitions. The platform is intentionally designed to evolve as new games and features are added.',
    dataPipeline: [
      'React and TypeScript provide the application interface and game integration',
      'A custom useGameLoop hook separates rendering from the React state cycle',
      'HTML5 Canvas renders the individual games',
      'Web Audio API generates procedural sound without external audio files',
      'Local storage preserves high scores, win streaks, and games-played statistics',
      'Shared interface components provide CRT effects, transitions, and arcade navigation',
    ],
    features: [
      {
        name: '20 Playable Games',
        description:
          'A growing collection of retro-inspired games spanning puzzles, shooters, platformers, and arcade classics.',
      },
      {
        name: 'Custom Game Loop',
        description:
          'A reusable useGameLoop hook separates game rendering from React state updates, designed for smooth gameplay.',
      },
      {
        name: 'Procedural Audio',
        description:
          'Dynamically generates game audio through the Web Audio API without relying on external sound files.',
      },
      {
        name: 'CRT Display Mode',
        description:
          'Toggleable retro scanlines, vignette, and screen-curvature effects recreate a classic arcade display.',
      },
      {
        name: 'Persistent Statistics',
        description:
          'Local storage saves high scores, win streaks, and games-played statistics between visits.',
      },
      {
        name: 'Premium UI Interactions',
        description:
          'Magnetic buttons, custom trailing cursors, page transitions, and smooth scroll locking create a cohesive arcade experience.',
      },
      {
        name: 'Continuous Expansion',
        description:
          'The arcade is an ongoing project designed to accommodate additional games and features over time.',
      },
    ],
    metrics: [
      {
        label: 'Playable Games',
        value: '20',
        detail: 'Retro-inspired games across multiple genres',
      },
      {
        label: 'Rendering',
        value: 'Canvas',
        detail: 'HTML5 Canvas with a custom game-loop hook',
      },
      {
        label: 'Audio',
        value: 'Procedural',
        detail: 'Sound generated through the Web Audio API',
      },
      {
        label: 'Persistence',
        value: 'Local Storage',
        detail: 'High scores, win streaks, and play statistics',
      },
    ],
    challenges: [
      {
        problem:
          'Running continuous game rendering through the React state cycle can introduce unnecessary rendering overhead.',
        solution:
          'Built a custom useGameLoop hook that separates game rendering from the React state cycle.',
        impact:
          'Provides a dedicated rendering loop designed to support smooth, responsive gameplay.',
      },
      {
        problem:
          'Maintaining a consistent arcade experience across a growing collection of games requires shared interface conventions and persistent player records.',
        solution:
          'Combined a unified arcade interface with local persistence for high scores, win streaks, and games-played statistics.',
        impact:
          'Provides a consistent experience across the game collection while retaining player statistics between visits.',
      },
    ],
    techBreakdown: [
      {
        category: 'Frontend & Application',
        items: ['React', 'TypeScript', 'Vite', 'CSS'],
      },
      {
        category: 'Game Rendering',
        items: ['HTML5 Canvas', 'Custom useGameLoop Hook'],
      },
      {
        category: 'Audio & Persistence',
        items: ['Web Audio API', 'Browser Local Storage'],
      },
      {
        category: 'Interaction & Visual Effects',
        items: [
          'CRT Scanlines',
          'Vignette Effects',
          'Screen Curvature',
          'Magnetic Buttons',
          'Custom Cursor Effects',
          'Page Transitions',
        ],
      },
    ],
  },

  weblens: {
    headline: 'Multimodal AI Visual Search & Screen Intelligence Extension',
    architectureOverview:
      'WebLens combines Chrome Extension Manifest V3 content scripts and service workers with a Python/FastAPI multimodal gateway. Captured viewport, region, or full-page images are prepared by the extension and sent to FastAPI, which coordinates Gemini 2.5 Flash analysis, Google Custom Search, and Google Lens retrieval.',
    dataPipeline: [
      'Chrome content scripts capture the visible area, a selected region, or a full page',
      'Manifest V3 service worker and canvas utilities prepare the image payload',
      'FastAPI dispatches Gemini Vision, Google Custom Search, and Google Lens work',
      'Results and thumbnails persist in chrome.storage.local search history',
    ],
    features: [
      {
        name: 'Three capture modes',
        description:
          'Captures the visible viewport, a freehand region, or an entire scrollable page.',
      },
      {
        name: 'Multimodal analysis',
        description:
          'Gemini Vision explains the captured image and generates related search queries.',
      },
      {
        name: 'Unified web search',
        description:
          'Combines Google Lens reverse-image search with Google Custom Search web results.',
      },
      {
        name: 'Persistent history',
        description:
          'Saves captures with thumbnails so region selections remain available after the popup closes.',
      },
    ],
    metrics: [
      { label: 'Manifest', value: 'V3', detail: 'Service worker architecture' },
      { label: 'Capture Modes', value: '3 Modes', detail: 'Full page, viewport, freehand crop' },
      { label: 'Storage', value: 'Local', detail: 'Persistent chrome.storage history' },
      { label: 'Backend', value: 'FastAPI', detail: 'Async unified search endpoint' },
    ],
    challenges: [
      {
        problem:
          'Manifest V3 deprecates persistent background scripts, terminating service workers during long-running API requests or image processing.',
        solution:
          'Architected an ephemeral offscreen document pipeline to handle heavy canvas operations and chunked base64 transmission, paired with asynchronous retry queues.',
        impact:
          'Achieved 100% Manifest V3 compliance with zero memory leaks or unexpected worker terminations.',
      },
      {
        problem:
          'Full-page scrolling screenshots suffered from sticky header duplication, distorted parallax elements, and canvas memory overflows.',
        solution:
          'Developed an automated scroll-stitch algorithm that hides fixed/sticky DOM elements during capture passes and composites slices onto an offscreen canvas with dimension clamping.',
        impact:
          'Seamless pixel-accurate full-page captures even on complex single-page apps.',
      },
    ],
    techBreakdown: [
      {
        category: 'Extension Core',
        items: ['Chrome Extension APIs (MV3)', 'Content Scripts', 'Offscreen Documents', 'HTML5 Canvas'],
      },
      {
        category: 'Frontend UI',
        items: ['React', 'Tailwind CSS', 'Lucide Icons', 'Vite Bundler'],
      },
      {
        category: 'Backend & AI',
        items: ['Python 3.11', 'FastAPI', 'Google Gemini 2.5 Flash', 'Google Custom Search API', 'Pillow (PIL)'],
      },
    ],
  },

  'tesseract-3d': {
    headline: 'Hardware-Accelerated GPGPU Particle Dynamics & Relativistic Singularity Physics',
    architectureOverview:
      'Tesseract 3D bypasses standard CPU-bound array iteration by mapping physical states directly into 32-bit floating-point textures (RGBA32F). Using a dual-pass Ping-Pong Framebuffer Object (FBO) pipeline, Semi-Implicit Euler integration runs entirely within GPU fragment shaders (velocityShader and positionShader). Instanced vertex shaders sample coordinates directly from VRAM, achieving 16,384 simulated bodies in a single draw call with zero CPU-to-GPU PCIe bus bottlenecks.',
    dataPipeline: [
      'Ping-Pong FBO pipeline integrates positions and velocities across dual RGBA32F render targets',
      'Custom GLSL fragment shaders compute 3D divergence-free curl noise, mass inertia, and singularity forces',
      'Instanced mesh vertex shader samples dynamic coordinates directly from texture buffers without CPU readbacks',
      'Post-processing pipeline composites chromatic dispersion, emissive bloom glow, and peripheral vignetting',
      'Procedural Web Audio engine synthesizes force field drones, UI feedback, and kinetic impulse detonation shockwaves',
    ],
    features: [
      {
        name: '100% GPGPU Physics',
        description:
          'Particle states (position, velocity, mass, energy) are computed entirely on the GPU inside 32-bit floating-point FBO textures.',
      },
      {
        name: 'Gravitational Singularity Core',
        description:
          'A central 3D celestial body functioning as an inward Black Hole (+M), outward Anti-Gravity White Hole (-M), or orbital Lissajous attractor.',
      },
      {
        name: 'Divergence-Free 3D Curl Noise',
        description:
          'Computes the mathematical curl of 3D Simplex vector potential fields, generating strictly volume-preserving incompressible fluid streamlines.',
      },
      {
        name: 'Cinematic Camera Director',
        description:
          '5 automated and manual perspectives (Free Orbit, 360° Turntable, Swarm Fly-Through, Top-Down Planar, Side Elevation) with variable FOV.',
      },
      {
        name: 'Thermodynamic Spectroscopy',
        description:
          'Chromatographic color ramps visualizing particle kinetic energy, velocity gradients, and gravitational stress in real time.',
      },
    ],
    metrics: [
      { label: 'Simulated Bodies', value: '16,384', detail: 'Real-time floating-point particles' },
      { label: 'GPU Draw Calls', value: '1 Call', detail: 'Instanced vertex texture sampling' },
      { label: 'Frame Rate', value: '60 FPS', detail: 'Hardware-accelerated GPGPU pipeline' },
      { label: 'Audio Engine', value: 'Web Audio', detail: 'Procedurally synthesized drones & shockwaves' },
    ],
    challenges: [
      {
        problem:
          'Simulating thousands of dynamic bodies in standard JavaScript arrays caused severe frame drops, garbage collection pauses, and main-thread lockups.',
        solution:
          'Engineered a WebGL2 Ping-Pong FBO architecture where position and velocity integration executes concurrently in GPU fragment shaders, eliminating CPU-to-GPU data transmission during the simulation loop.',
        impact:
          'Scaled particle capacity from a few hundred bodies on CPU to 16,384 bodies running at a locked 60 FPS.',
      },
      {
        problem:
          'Standard Perlin/Simplex noise fields caused particles to clump into artificial density spikes and leave unnatural voids.',
        solution:
          'Implemented divergence-free 3D curl noise by calculating the spatial curl of a vector potential field via 6 central finite-difference evaluations in GLSL, guaranteeing zero divergence (∇ · u = 0).',
        impact:
          'Produces organic, turbulent fluid vortex rings and smoke-like streamlines that preserve volume without artificial clustering.',
      },
    ],
    techBreakdown: [
      {
        category: 'WebGL2 & GPGPU Engine',
        items: ['WebGL2', 'Three.js', 'React Three Fiber', 'GLSL Fragment Shaders', 'Ping-Pong FBOs', 'RGBA32F Floating Point Textures'],
      },
      {
        category: 'Physics & Simulation',
        items: ['Semi-Implicit Euler Integration', '3D Divergence-Free Curl Noise', 'Newtonian Gravity', 'Variable Mass Dynamics', 'Lissajous Attractors'],
      },
      {
        category: 'Post-Processing & Sound',
        items: ['Optical Chromatic Dispersion', 'UnrealBloom Emissive Glow', 'HTML5 Web Audio API', 'Tailwind CSS', 'Vite'],
      },
    ],
  },
};

/**
 * Asynchronously loads a project's detailed case study on-demand.
 * This ensures the heavy architecture specifications are only loaded
 * when the visitor specifically opens the deep-dive drawer.
 */
export async function loadCaseStudy(projectId: string): Promise<ProjectCaseStudy | null> {
  const normalizedId = projectId.toLowerCase().trim();
  return projectCaseStudies[normalizedId] || null;
}
