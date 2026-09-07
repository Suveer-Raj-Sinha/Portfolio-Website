# Suveer Raj Sinha - Portfolio

> A cinematic, single-page portfolio for a full-stack developer and creative engineer.

This portfolio showcases work in real-time web applications, geospatial dashboards, interactive 3D experiences, and browser-based tools. It is designed with a dark technical visual language, responsive layouts, accessible interactions, and motion that respects user preferences.

## Live site

- **Portfolio:** [Add your deployed URL here]
- **LinkedIn:** [Suveer Raj Sinha](https://www.linkedin.com/in/suveer-raj-sinha/)
- **GitHub:** [Suveer-Raj-Sinha](https://github.com/Suveer-Raj-Sinha)

## Built with

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- GSAP
- HTML Canvas

## Features

- Responsive single-page navigation across Hero, Manifesto, Skills, Projects, About, Journey, and Contact sections
- Project case-study drawer with architecture details, features, metrics, and technology breakdowns
- Interactive orbital wireframe rendered with Canvas
- GSAP-powered reveals, magnetic interactions, and desktop custom cursor
- Reduced-motion support and touch-device fallbacks
- Keyboard-accessible navigation, dialogs, buttons, and expandable skill groups
- External links open in a new tab
- Production-ready Vite build

## Getting started

### Requirements

- Node.js 20 or newer
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open the local URL shown by Vite.

### Production build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Project structure

```text
src/
├── animations/   Scroll and reveal animation hooks
├── components/   Reusable UI, navigation, cursor, and project drawer components
├── data/         Profile, project, and journey content
├── hooks/        Device capability and touch interaction hooks
└── sections/     Main portfolio sections
public/
├── images/       Project preview images
├── favicon.svg
└── resume.pdf
```

## Customization

Update the following files to personalize the portfolio:

- `src/data/profile.ts` - name, role, bio, email, social links, and resume path
- `src/data/projects.ts` - project descriptions, links, images, case studies, and technologies
- `src/data/journey.ts` - education and experience timeline
- `public/images/` - project preview images
- `public/resume.pdf` - downloadable resume
- `index.html` - page title, description, and social preview metadata

## Deployment

The project can be deployed to any static hosting provider that supports Vite builds, including Vercel, Netlify, and GitHub Pages.

Use `dist/` as the production output directory after running:

```bash
npm run build
```

## License

This project is a personal portfolio. Contact the author before reusing its content, branding, or project case studies.
