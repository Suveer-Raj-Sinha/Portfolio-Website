import { Magnetic } from './Magnetic';

export function Footer() {
  const scrollToTop = () => {
    const hero = document.getElementById('hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full max-w-6xl mx-auto pt-6 pb-2 border-t border-line/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-dim">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-center sm:text-left">
        <p>© {new Date().getFullYear()} Suveer Raj Sinha</p>
        <span className="hidden sm:inline text-line-strong">•</span>
        <p className="mono-label text-[11px]">Built with React, GSAP & Tailwind</p>
      </div>

      <Magnetic
        as="button"
        type="button"
        onClick={scrollToTop}
        className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border border-line/80 bg-panel/60 hover:bg-panel hover:border-accent text-text-muted hover:text-accent transition-all duration-300 group cursor-pointer"
        aria-label="Back to top"
      >
        <span className="mono-label text-[11px] font-medium tracking-wider">BACK TO TOP</span>
        <span className="w-5 h-5 rounded flex items-center justify-center bg-ink/70 border border-line/60 group-hover:border-accent/50 text-text-muted group-hover:text-accent transition-all duration-300 group-hover:-translate-y-0.5">
          <svg
            aria-hidden="true"
            className="w-3 h-3 transition-transform duration-300 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </span>
      </Magnetic>
    </footer>
  );
}
