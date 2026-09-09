import { useEffect, useRef, useState } from 'react';
import { useDeviceCapability } from '../hooks/useDeviceCapability';
import { playHoverSound } from '../utils/audio';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

export function KineticSandbox() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { prefersReducedMotion } = useDeviceCapability();
  const [particleCount, setParticleCount] = useState<number>(36);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -100,
    y: -100,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 240);
    let height = (canvas.height = 80);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = 80;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const count = prefersReducedMotion ? 18 : 36;
    setParticleCount(count);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (prefersReducedMotion ? 0.3 : 0.8),
        vy: (Math.random() - 0.5) * (prefersReducedMotion ? 0.3 : 0.8),
        radius: Math.random() * 1.5 + 1,
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      // Draw faint connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 42) {
            const lineAlpha = (1 - dist / 42) * 0.25;
            ctx.strokeStyle = `rgba(245, 158, 11, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off boundaries
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // Mouse interaction (gentle magnetic pull/push)
          if (mouse.active) {
            const mdx = mouse.x - p.x;
            const mdy = mouse.y - p.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

            if (mdist < 55 && mdist > 2) {
              const force = (55 - mdist) / 55;
              // Swirl orbit effect around cursor
              p.vx -= (mdx / mdist) * force * 0.45;
              p.vy -= (mdy / mdist) * force * 0.45;
              p.vx += (-mdy / mdist) * force * 0.25;
              p.vy += (mdx / mdist) * force * 0.25;
            }
          }

          // Velocity dampening
          p.vx *= 0.98;
          p.vy *= 0.98;

          // Minimum drift
          if (Math.abs(p.vx) < 0.1) p.vx = (Math.random() - 0.5) * 0.5;
          if (Math.abs(p.vy) < 0.1) p.vy = (Math.random() - 0.5) * 0.5;
        }

        // Render particle
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha})`;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // If mouse is active, draw a subtle reticle dot
      if (mouse.active) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [prefersReducedMotion]);

  const updateMouse = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
      active: true,
    };
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-line-strong/60 bg-ink/70">
      <canvas
        ref={canvasRef}
        onMouseEnter={() => {
          playHoverSound();
          mouseRef.current.active = true;
        }}
        onMouseMove={(e) => updateMouse(e.clientX, e.clientY)}
        onMouseLeave={() => {
          mouseRef.current.active = false;
        }}
        onTouchStart={(e) => {
          if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={() => {
          mouseRef.current.active = false;
        }}
        className="w-full h-20 block cursor-crosshair touch-none"
      />
      <div className="absolute top-1.5 right-2 flex items-center gap-1 pointer-events-none text-[8px] font-mono text-text-dim bg-ink/60 px-1.5 py-0.5 rounded border border-line/40">
        <span className="w-1 h-1 rounded-full bg-accent animate-ping" />
        <span>{particleCount} PARTICLES</span>
      </div>
      <div className="absolute bottom-1.5 left-2 pointer-events-none text-[8px] font-mono text-text-dim/80">
        [ HOVER / DRAG TO DISTORT ]
      </div>
    </div>
  );
}
