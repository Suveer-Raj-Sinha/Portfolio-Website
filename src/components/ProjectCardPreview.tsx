import { useRef } from 'react';
import gsap from 'gsap';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

interface ProjectCardPreviewProps {
  image: string;
  name: string;
  badge?: {
    text: string;
    color: 'emerald' | 'amber' | 'cyan';
  };
  onSelect?: () => void;
}

export function ProjectCardPreview({ image, name, badge, onSelect }: ProjectCardPreviewProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const sheenRef = useRef<HTMLDivElement | null>(null);
  const { prefersReducedMotion } = useDeviceCapability();

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt: max 8 degrees
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1.025,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (sheenRef.current) {
      const px = (x / rect.width) * 100;
      const py = (y / rect.height) * 100;
      gsap.to(sheenRef.current, {
        opacity: 0.9,
        background: `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.16) 0%, transparent 60%)`,
        duration: 0.2,
      });
    }
  };

  const onMouseLeave = () => {
    if (prefersReducedMotion || !cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    });

    if (sheenRef.current) {
      gsap.to(sheenRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onSelect();
    }
  };

  const badgeDotColor =
    badge?.color === 'emerald'
      ? 'bg-emerald-400'
      : badge?.color === 'amber'
      ? 'bg-amber-400'
      : 'bg-cyan-400';

  return (
    <div
      ref={cardRef}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative w-full lg:w-1/2 aspect-video border border-line rounded-xl bg-panel overflow-hidden project-preview shadow-2xl transition-all duration-300 hover:shadow-[0_25px_60px_rgba(0,0,0,0.6)] group will-change-transform ${
        onSelect ? 'cursor-pointer hover:border-accent/80' : ''
      }`}
      style={{ transformStyle: 'preserve-3d' }}
      aria-label={onSelect ? `Open architecture case study for ${name}` : undefined}
    >
      {/* Floating Status Badge */}
      {badge && (
        <div className="absolute top-3.5 left-3.5 z-20 px-2.5 py-1 rounded-full bg-ink/85 backdrop-blur-md border border-line/80 text-[10px] font-mono tracking-wider flex items-center gap-2 shadow-lg select-none">
          <span className={`w-1.5 h-1.5 rounded-full ${badgeDotColor} animate-pulse shadow-[0_0_6px_currentColor]`} />
          <span className="text-text font-medium">{badge.text}</span>
        </div>
      )}

      {/* Project Screenshot */}
      <img
        src={image}
        alt={`${name} screenshot`}
        className="w-full h-full object-cover select-none transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
      />

      {/* Hover Case Study Cue Pill */}
      {onSelect && (
        <div className="absolute bottom-3.5 right-3.5 z-20 px-3 py-1.5 rounded-full bg-ink/90 backdrop-blur-md border border-line/80 text-[10px] font-mono tracking-wider flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 text-accent select-none shadow-xl">
          <span>ARCHITECTURE SPECS</span>
          <span aria-hidden="true">&rarr;</span>
        </div>
      )}

      {/* Dynamic Specular Light Sheen */}
      <div
        ref={sheenRef}
        className="absolute inset-0 pointer-events-none opacity-0 z-10 transition-opacity"
      />

      {/* Subtle glass reflection edge */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.07] to-transparent pointer-events-none" />
    </div>
  );
}
