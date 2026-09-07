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

export interface Project {
  index: string;
  name: string;
  category: string;
  description: string;
  tech: string[];
  image: string; // path relative to /public
  liveUrl?: string;
  codeUrl: string;
  statusBadge?: {
    text: string;
    color: 'emerald' | 'amber' | 'cyan';
  };
  caseStudy: ProjectCaseStudy;
}

export const projects: Project[] = [
  {
    index: '01',
    name: 'Terra Live',
    category: 'Real-Time Disaster Monitoring Platform',
    description:
      'A high-performance, full-stack real-time disaster monitoring platform. Aggregates global hazard feeds — earthquakes, wildfires, volcanic activity, and tropical cyclones — into a unified, interactive map dashboard featuring a tectonic plate boundary overlay.',
    tech: ['React', 'TypeScript', 'FastAPI', 'SQLite', 'React Leaflet'],
    image: '/images/terra-live.png',
    liveUrl: 'https://terra-live.vercel.app',
    codeUrl: 'https://github.com/Suveer-Raj-Sinha/Terra-Live',
    statusBadge: {
      text: 'LIVE DASHBOARD',
      color: 'emerald',
    },
    caseStudy: {
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
  },
  {
    index: '02',
    name: 'Solaris',
    category: '3D Interactive Solar System Explorer',
    description:
      'A production-quality, cinematic 3D digital planetarium. Explore the cosmos from a spaceship cockpit, navigate via warp speed travel, and decrypt geological planetary anomalies. Combines high-performance WebGL graphics, physical orbital simulation, and dynamic audio feedback to turn learning about space into an adventure.',
    tech: ['React', 'Three.js', 'React Three Fiber', 'GLSL', 'Zustand'],
    image: '/images/solaris.png',
    liveUrl: 'https://solaris-launchpad.vercel.app/',
    codeUrl: 'https://github.com/Suveer-Raj-Sinha/solaris',
    statusBadge: {
      text: '3D WEBGL ENGINE',
      color: 'amber',
    },
    caseStudy: {
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
  },
  {
    index: '03',
    name: 'WebLens',
    category: 'AI-Powered Visual Search Extension',
    description:
      'A Chrome extension that captures any part of a webpage and searches it visually using Gemini AI, Google Lens, and Custom Search. Supports full-page capture, visible area, and freehand region selection — with results saved to a searchable history.',
    tech: ['React', 'FastAPI', 'Python', 'Chrome Extension APIs', 'Gemini Vision'],
    image: '/images/weblens.png',
    codeUrl: 'https://github.com/Suveer-Raj-Sinha/visual-search-extension',
    statusBadge: {
      text: 'CHROME EXTENSION',
      color: 'cyan',
    },
    caseStudy: {
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
  },
];
