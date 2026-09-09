# Suveer Raj Sinha — Engineering Portfolio & Interactive Cyber HUD

> High-performance, cinematic single-page portfolio for a Full-Stack Engineer and Creative Technologist specializing in real-time web applications, interactive 3D graphics, and resilient frontend architectures.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02.svg?logo=greensock)](https://greensock.com/gsap/)
[![Bundle Size](https://img.shields.io/badge/Bundle-~144%20kB%20gzipped-success)](#performance--engineering-budget)

---

## 🌐 Live Transmission & Socials

- **Portfolio:** [suveer.dev](https://github.com/Suveer-Raj-Sinha/Portfolio-Website)
- **LinkedIn:** [linkedin.com/in/suveer-raj-sinha](https://www.linkedin.com/in/suveer-raj-sinha/)
- **GitHub:** [github.com/Suveer-Raj-Sinha](https://github.com/Suveer-Raj-Sinha)
- **Direct Dispatch:** [suveer.sinha06@gmail.com](mailto:suveer.sinha06@gmail.com)

---

## ⚡ Core Highlights & Architectural Features

### 1. 3D Orbital Canvas & HUD Control Deck
- **Interactive Geometries:** Real-time 2D/3D wireframe rendering powered by HTML5 Canvas with dynamic depth-shading.
  - `Sphere`: Planetary core with dual counter-rotating satellite orbital rings.
  - `Torus`: Helical magnetic flux torus with spiraling energy nodes.
  - `Gimbal`: Triple-axis astronomical astrolabe encasing a tumbling octahedron diamond.
- **Docked HUD Controls:** Live real-time control deck to toggle geometries, adjust rotation velocity, and modulate wireframe opacity on the fly.

### 2. Interactive Cyber Terminal (`~/suveer $`)
A keyboard-first Unix terminal environment built into the portfolio with custom CRT styling and retro utilities:
- **Quick Launch:** Triggerable via the navigation bar `[ >_ Terminal ]`, command palette, or section bridges.
- **Traffic Light Controls:**
  - `Red`: Close terminal window (`ESC`).
  - `Amber`: Flush screen buffer (`clear`).
  - `Green`: Instant launch for Snake Arcade (`snake`).
- **Core Commands:**
  - `help` — Categorized dictionary of all available commands.
  - `neofetch` — ASCII system telemetry, developer workstation specs, and live hiring clearance.
  - `projects` & `project <name>` — Interactive project browser and direct case study drawer launcher.
  - `skills` — Categorized technical stack breakdown.
  - `about` / `cat bio.txt` — Developer background, philosophy, and focus.
  - `journey` — Career, internships, and university education track.
  - `contact` — Social links and email dispatch.
  - `sudo hire` — Priority recruiter access with one-click direct email transmission.
  - `audio` — Toggle procedural Web Audio FX.
  - `clear` / `exit` — Screen flush and session exit.
- **Curated Easter Eggs & Mini-Games:**
  - **`snake` (Playable ASCII Snake Arcade):**
    - Runs directly in the terminal buffer at 115ms tick intervals.
    - Controllable with Arrow keys, `WASD`, or touch/click on-screen D-pad on mobile.
    - Captures food `★` (+10 pts) and bonus coffee `☕` (+25 pts) with high-score tracking in `sessionStorage`.
    - **Capture-phase event isolation:** Uses `{ capture: true }` to guarantee arrow navigation never scrolls or shifts the underlying page.
  - **`synth` / `soundboard` (8-Bit Web Audio Synthesizer):**
    - Complete musical keyboard playable via numeric keys `1` through `8` (C4 to C5).
    - 4 selectable waveforms: `square` (8-bit chip), `triangle` (warm), `sawtooth` (synthwave), `sine` (smooth).
    - Instant procedural sound pads: `[L]` Laser, `[G]` Glitch, `[P]` Powerup, `[K]` Fanfare.
  - **`theme <name>` (Live CRT Theme Switcher):**
    - Dynamically updates the terminal glow, card background, prompt, and borders across 5 color schemes:
      - `theme matrix` (Phosphor emerald CRT glow)
      - `theme amber` (Warm vintage CRT bronze glow)
      - `theme cyber` (Neon electric cyan glow)
      - `theme synthwave` (Magenta / violet neon glow)
      - `theme default` (Charcoal ink with warm amber accents)
  - **`coffee` / `tea` (Automated Brew Machine):**
    - Animated steaming ASCII mug restoring `+100 Engineering Mana` with audio chime feedback.

### 3. Procedural Web Audio Engine (0 KB Bandwidth)
- **100% In-Browser Sound Synthesis:** Zero external MP3/WAV files and zero asset downloads.
- Synthesizes tactile sound cues on demand using the browser's native `AudioContext`:
  - Micro-frequency hover ticks for buttons, links, and skill nodes.
  - Futuristic frequency sweeps for drawer opening and modal reveals.
  - Positive double-tone confirmation chimes for clipboard copy actions.
  - Pneumatic whoosh transitions between fullscreen slides.
  - 8-bit retro bleeps, laser sweeps, glitch bursts, and victory fanfares for terminal mini-games.
- Persists user audio preference in `localStorage` with an animated equalizer toggle in the navbar.

### 4. Global Command Palette (`Ctrl + K` / `⌘K`)
- Omnipresent fuzzy search modal accessible from anywhere on the page.
- Keyboard ergonomics with full Arrow navigation (`↑`/`↓`), `Enter` execution, and `Escape` dismissal.
- Quick navigation across sections, direct project drawer opening, audio toggles, and terminal execution.

### 5. About Section HUD Instrument & "Now" Suite
- **3-Mode Interactive HUD Card:**
  1. `01 // RADAR`: Rotating celestial astrolabe with coordinate crosshairs and monogram crest (`SRS DEV // 2025`).
  2. `02 // SPECS`: Workstation readout (Win 11 + WSL2 Ubuntu, Zsh + Starship + Neovim, React 19 + Three.js, Node 22 + Python 3.12, 60 FPS locked).
  3. `03 // TELEMETRY`: Live session uptime timer, dynamic regional ping (simulated 14ms), viewport resolution monitor, and 6-bar mini audio equalizer.
- **"Now" Focus Deck:**
  - `01 // CURRENT OBSESSION`: Inline interactive `KineticSandbox` (36 particle magnetic physics simulation responding to cursor/touch).
  - `02 // READING & FOCUS`: Studying *Designing Data-Intensive Applications*, personal soundtracks with official YouTube links ("Amor" — Derik Fein & "Glimpse of Us" — Joji).
  - `03 // ACTIVE RADAR`: Live availability indicator, location (`India UTC+5:30 • Remote`), and one-click recruiter email dispatch.

### 6. Interactive Engineering Pillars & Case Study Suite
- Architectural pillars highlighting verified engineering metrics:
  - `<50ms WebSocket Latency` (FastAPI / WebSockets / Live Hazards) ➔ Linked to *Terra Live*.
  - `60 FPS Locked / GPU Shaders` (Three.js / GLSL / Orbital Math) ➔ Linked to *Solaris*.
  - `100% Strict TS / Zero-Jank` (TypeScript / Tailwind v4 / A11y) ➔ Linked to *WebLens*.
- **Deep-Linking & Spec Sharing:**
  - Direct URL hash deep linking (`/#terra-live`, `/#solaris`, `/#weblens`) automatically opens the project drawer with history sync.
  - "Share Specs" button copies direct links with HUD toast and audio confirmation.

### 7. Journey & Career Timeline Switcher
- **3-Mode Segmented Filter:**
  - `● ALL`: Complete chronological overview of experience and academic milestones.
  - `01 // EXPERIENCE`: Focused view of industry engineering internships and contributions.
  - `02 // EDUCATION`: Focused view of formal computer science degrees (MCA, BCA) and coursework.
- **Interactive Metric Pills:** Clicking `02 Internships`, `MCA`, `BCA Grad`, or `Available` instantly filters the timeline or copies recruiter contact details.

---

## 🛠️ Tech Stack & Toolchain

| Layer | Technologies |
| :--- | :--- |
| **Framework & Core** | [React 19](https://react.dev/), [TypeScript 5.9](https://www.typescriptlang.org/) (Strict Mode) |
| **Build & Bundling** | [Vite 8](https://vitejs.dev/) with Rollup chunk optimization |
| **Styling & Design** | [Tailwind CSS v4](https://tailwindcss.com/) with custom design tokens & PostCSS |
| **Motion & Animation**| [GSAP 3.14](https://greensock.com/gsap/) (ScrollTrigger, Flip), CSS Hardware Acceleration |
| **Graphics & 3D** | HTML5 Canvas 2D/3D wireframe math, procedural shaders, WebGL |
| **Audio Engine** | Native Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`, `BiquadFilterNode`) |
| **Linter & Quality** | [Oxlint](https://oxc.rs/) (Next-gen Rust-based linter) |

---

## 📊 Performance & Engineering Budget

| Metric | Target | Actual | Status |
| :--- | :--- | :--- | :--- |
| **Production JS (gzipped)** | `< 150 kB` | **`144.19 kB`** | 🟢 Optimal |
| **Production CSS (gzipped)** | `< 20 kB` | **`11.84 kB`** | 🟢 Optimal |
| **External Audio Overhead** | `0 kB` | **`0.00 kB`** (100% synthesized) | 🟢 Optimal |
| **Frame Budget** | `60 FPS / 16.6ms` | **Locked 60 FPS** | 🟢 Zero-Jank |
| **Lint Status** | `0 errors` | **0 errors across all 39 files** | 🟢 Clean |

---

## 📁 Project Structure

```text
portfolio/
├── public/
│   ├── favicon.svg              # SVG monogram favicon
│   ├── resume.pdf               # Downloadable developer resume
│   └── images/                  # Project screenshots & visual assets
├── src/
│   ├── animations/              # GSAP ScrollTrigger & reveal hooks
│   │   ├── useMagnetic.ts       # Magnetic cursor pull effect
│   │   └── useScrollReveal.ts   # Viewport entrance animations
│   ├── components/              # Modular UI & interactive instruments
│   │   ├── terminal/            # In-terminal mini-games & components
│   │   │   ├── SnakeGame.tsx    # Playable ASCII Snake arcade
│   │   │   └── TerminalSynth.tsx# 8-bit Web Audio musical synthesizer
│   │   ├── AboutHudCard.tsx     # 3-mode HUD deck (Radar, Specs, Telemetry)
│   │   ├── CommandPalette.tsx   # Ctrl+K omnipresent search palette
│   │   ├── CyberTerminal.tsx    # Interactive terminal shell (~/suveer $)
│   │   ├── Cursor.tsx           # Custom smooth trailing cursor
│   │   ├── HeroCanvasControls.tsx# 3D geometry & rotation dock
│   │   ├── HeroOrbitalCanvas.tsx# Canvas 2D/3D wireframe engine
│   │   ├── KineticSandbox.tsx   # Inline magnetic particle simulation
│   │   ├── Nav.tsx              # Sticky header, sound toggle & mobile drawer
│   │   ├── ProjectDrawer.tsx    # Architectural case study slide drawer
│   │   ├── SkillGraph.tsx       # Interactive skill nodes linked to projects
│   │   ├── SlideRail.tsx        # Vertical snap rail with modal freeze guard
│   │   └── Toast.tsx            # HUD notification toast alert
│   ├── data/                    # Structured portfolio content
│   │   ├── profile.ts           # Developer bio, skills, socials, telemetry
│   │   └── projects.ts          # Case studies, architecture specs, metrics
│   ├── sections/                # Fullscreen page slides
│   │   ├── Hero.tsx             # Orbital canvas, title, and action bridge
│   │   ├── About.tsx            # HUD card, Kinetic sandbox, and focus deck
│   │   ├── Projects.tsx         # Featured engineering case study grid
│   │   ├── Journey.tsx          # Career, internship & academic timeline
│   │   └── Contact.tsx          # Dispatch transmission & social links
│   ├── utils/                   # Procedural engines & event bridges
│   │   ├── audio.ts             # Web Audio API sound synthesizer
│   │   ├── events.ts            # CustomEvent dispatchers for modals
│   │   └── useToast.ts          # Global notification hook
│   ├── App.tsx                  # Root application wrapper & slide snap layout
│   ├── index.css                # Tailwind CSS v4 design tokens & theme vars
│   └── main.tsx                 # React DOM mount point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Installation
```bash
# Clone the repository
git clone https://github.com/Suveer-Raj-Sinha/Portfolio-Website.git

# Navigate to project root
cd Portfolio-Website

# Install dependencies
npm install
```

### Local Development
```bash
# Start local Vite development server
npm run dev
```
Open `http://localhost:5173` in your browser.

### Linting
```bash
# Run ultra-fast oxlint across all source files
npm run lint
```

### Production Build & Preview
```bash
# Compile TypeScript and generate optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ⌨️ Global Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>Ctrl</kbd> + <kbd>K</kbd> / <kbd>⌘</kbd> + <kbd>K</kbd> | Toggle Command Palette |
| <kbd>ESC</kbd> | Close active modal, drawer, or Cyber Terminal |
| <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>PageUp</kbd> / <kbd>PageDown</kbd> | Navigate full-screen slides (auto-disabled when modals/games are open) |
| <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or <kbd>Arrows</kbd> | Steer snake in Terminal Snake arcade |
| <kbd>1</kbd> – <kbd>8</kbd> | Play musical notes C4–C5 in Terminal Synthesizer |
| <kbd>L</kbd> / <kbd>G</kbd> / <kbd>P</kbd> / <kbd>K</kbd> | Trigger Laser, Glitch, Powerup, or Fanfare SFX in Synth |

---

## 📄 License & Attribution

Designed and developed by **Suveer Raj Sinha**.
Released under the personal portfolio license. Feel free to explore the code architecture for inspiration. Please provide attribution if adapting the procedural Web Audio synthesizer or Canvas orbital engine for your own projects.
