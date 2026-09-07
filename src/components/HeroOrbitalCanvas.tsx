import { useEffect, useRef } from 'react';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

export function HeroOrbitalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { prefersReducedMotion, hasFinePointer } = useDeviceCapability();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 420);
    let height = (canvas.height = 420);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.25;
    let targetRotY = 0.3;
    let rotX = 0.25;
    let rotY = 0.3;

    // Handle mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      if (!hasFinePointer) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = x / (rect.width / 2);
      mouseY = y / (rect.height / 2);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 3D Sphere Wireframe parameters
    const RADIUS = 110;
    const LATITUDES = 6;
    const LONGITUDES = 8;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Smooth mouse interpolation
      if (!prefersReducedMotion) {
        targetRotY = mouseX * 0.4 + angle * 0.4;
        targetRotX = -mouseY * 0.3 + 0.2;
        rotX += (targetRotX - rotX) * 0.05;
        rotY += (targetRotY - rotY) * 0.05;
        angle += 0.004;
      }

      // Project 3D point (x, y, z) to 2D
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const cosY = Math.cos(rotY);
        const sinY = Math.sin(rotY);
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotate around X axis
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Perspective scale
        const fov = 350;
        const scale = fov / (fov + z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          z: z2,
        };
      };

      // 1. Draw Outer Technical HUD Compass Ring
      ctx.beginPath();
      ctx.arc(cx, cy, 175, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 155, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 142, 63, 0.15)';
      ctx.setLineDash([4, 12]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Draw Sphere Longitude Rings
      for (let i = 0; i < LONGITUDES; i++) {
        const phi = (i * Math.PI) / LONGITUDES;
        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 40; j++) {
          const theta = (j * 2 * Math.PI) / 40;
          const x = RADIUS * Math.sin(theta) * Math.cos(phi);
          const y = RADIUS * Math.cos(theta);
          const z = RADIUS * Math.sin(theta) * Math.sin(phi);
          const { px, py } = project(x, y, z);

          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = 'rgba(217, 142, 63, 0.18)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Draw Sphere Latitude Rings
      for (let i = 1; i < LATITUDES; i++) {
        const latAngle = ((i / LATITUDES) - 0.5) * Math.PI;
        const r = RADIUS * Math.cos(latAngle);
        const y = RADIUS * Math.sin(latAngle);

        ctx.beginPath();
        let first = true;
        for (let j = 0; j <= 40; j++) {
          const theta = (j * 2 * Math.PI) / 40;
          const x = r * Math.cos(theta);
          const z = r * Math.sin(theta);
          const { px, py } = project(x, y, z);

          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 4. Draw Giant Tilted Orbital Ellipse Ring (Satellite Path)
      ctx.beginPath();
      const ORBIT_R = 160;
      let orbitFirst = true;
      for (let j = 0; j <= 60; j++) {
        const theta = (j * 2 * Math.PI) / 60;
        const x = ORBIT_R * Math.cos(theta);
        const y = ORBIT_R * Math.sin(theta) * 0.35;
        const z = ORBIT_R * Math.sin(theta) * 0.9;
        const { px, py } = project(x, y, z);
        if (orbitFirst) {
          ctx.moveTo(px, py);
          orbitFirst = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.strokeStyle = 'rgba(217, 142, 63, 0.45)';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      // 5. Draw Orbiting Satellite Beacon Point
      const satAngle = angle * 2.5;
      const satX = ORBIT_R * Math.cos(satAngle);
      const satY = ORBIT_R * Math.sin(satAngle) * 0.35;
      const satZ = ORBIT_R * Math.sin(satAngle) * 0.9;
      const { px: spx, py: spy } = project(satX, satY, satZ);

      // Satellite glow halo
      ctx.beginPath();
      ctx.arc(spx, spy, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(217, 142, 63, 0.2)';
      ctx.fill();

      // Satellite core
      ctx.beginPath();
      ctx.arc(spx, spy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--color-accent)';
      ctx.fill();

      // Continue loop if motion enabled
      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [prefersReducedMotion, hasFinePointer]);

  return (
    <div className="relative w-full max-w-[380px] lg:max-w-[420px] aspect-square flex items-center justify-center select-none pointer-events-none">
      {/* Background radial glow behind gyroscope */}
      <div className="absolute inset-8 rounded-full bg-accent/[0.04] blur-2xl pointer-events-none" />

      {/* HTML Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ filter: 'drop-shadow(0 0 25px rgba(217, 142, 63, 0.15))' }}
      />

      {/* Floating HUD telemetry tags */}
      <div className="absolute top-4 left-6 flex items-center gap-1.5 font-mono text-[9px] text-accent/70 tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        ORBITAL_AXIS // 23.4°
      </div>

      <div className="absolute bottom-4 right-6 font-mono text-[9px] text-text-dim tracking-widest">
        RAD_SIM // 60 FPS
      </div>
    </div>
  );
}
