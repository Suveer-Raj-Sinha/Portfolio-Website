import { useEffect, useRef } from 'react';
import { useDeviceCapability } from '../hooks/useDeviceCapability';

export type GeometryMode = 'sphere' | 'torus' | 'rings';
export type SpeedMode = 0.5 | 1 | 2;
export type DensityMode = 'compact' | 'standard' | 'dense';

export interface CanvasControlsState {
  geometry: GeometryMode;
  speed: SpeedMode;
  density: DensityMode;
}

interface Props {
  controls?: CanvasControlsState;
}

export function HeroOrbitalCanvas({
  controls = { geometry: 'sphere', speed: 1, density: 'standard' },
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { prefersReducedMotion, hasFinePointer } = useDeviceCapability();
  const controlsRef = useRef(controls);

  useEffect(() => {
    controlsRef.current = controls;
  }, [controls]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = 440);
    const height = (canvas.height = 440);

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

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const currentControls = controlsRef.current;

      // Smooth mouse interpolation & speed multiplier
      if (!prefersReducedMotion) {
        targetRotY = mouseX * 0.45 + angle * 0.4;
        targetRotX = -mouseY * 0.35 + 0.25;
        rotX += (targetRotX - rotX) * 0.05;
        rotY += (targetRotY - rotY) * 0.05;
        angle += 0.005 * currentControls.speed;
      }

      // 3D Matrix Projection with Depth & Scale
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

        // Perspective scale (camera placed at fov distance)
        const fov = 380;
        const scale = fov / (fov + z2);

        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          z: z2,
        };
      };

      // Helper for depth-attenuated stroke styling
      // Front elements (closer to camera, smaller z2) glow in bright amber
      // Back elements (further from camera, larger z2) fade into subtle technical lines
      const getDepthStyle = (avgZ: number, baseAlpha = 0.5) => {
        const normalized = Math.max(0, Math.min(1, (160 - avgZ) / 320));
        if (normalized > 0.45) {
          const alpha = (0.2 + normalized * 0.7) * baseAlpha;
          return `rgba(217, 142, 63, ${alpha.toFixed(3)})`;
        }
        const alpha = (0.05 + normalized * 0.25) * baseAlpha;
        return `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      };

      // ──────────────────────────────────────────────────────────────────────────
      // 1. OUTER SCI-FI HUD RADAR COMPASS & TICK GRADUATIONS
      // ──────────────────────────────────────────────────────────────────────────
      ctx.save();
      // Outer subtle boundary
      ctx.beginPath();
      ctx.arc(cx, cy, 185, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Intermediate dashed ring
      ctx.beginPath();
      ctx.arc(cx, cy, 168, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 142, 63, 0.12)';
      ctx.setLineDash([4, 10]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Radar corner brackets
      const bracketR = 195;
      const angles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
      angles.forEach((a) => {
        const bx = cx + Math.cos(a) * bracketR;
        const by = cy + Math.sin(a) * bracketR;
        ctx.beginPath();
        ctx.arc(bx, by, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 142, 63, 0.4)';
        ctx.fill();
      });
      ctx.restore();

      const densityMult =
        currentControls.density === 'compact' ? 0.65 : currentControls.density === 'dense' ? 1.6 : 1.0;

      // ──────────────────────────────────────────────────────────────────────────
      // 2. GEOMETRY 1: CELESTIAL ORBITAL SPHERE
      // ──────────────────────────────────────────────────────────────────────────
      if (currentControls.geometry === 'sphere') {
        const RADIUS = 115;
        const LATITUDES = Math.round(6 * densityMult);
        const LONGITUDES = Math.round(8 * densityMult);

        // Longitude Meridians
        for (let i = 0; i < LONGITUDES; i++) {
          const phi = (i * Math.PI) / LONGITUDES;
          const points = [];
          for (let j = 0; j <= 40; j++) {
            const theta = (j * 2 * Math.PI) / 40;
            const x = RADIUS * Math.sin(theta) * Math.cos(phi);
            const y = RADIUS * Math.cos(theta);
            const z = RADIUS * Math.sin(theta) * Math.sin(phi);
            points.push(project(x, y, z));
          }

          // Draw in segments with depth attenuation
          for (let j = 0; j < points.length - 1; j++) {
            const p1 = points[j];
            const p2 = points[j + 1];
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = getDepthStyle((p1.z + p2.z) / 2, 0.75);
            ctx.lineWidth = p1.z < 0 ? 1.2 : 0.8;
            ctx.stroke();
          }
        }

        // Latitude Parallels
        for (let i = 1; i < LATITUDES; i++) {
          const latAngle = (i / LATITUDES - 0.5) * Math.PI;
          const r = RADIUS * Math.cos(latAngle);
          const y = RADIUS * Math.sin(latAngle);

          const points = [];
          for (let j = 0; j <= 40; j++) {
            const theta = (j * 2 * Math.PI) / 40;
            const x = r * Math.cos(theta);
            const z = r * Math.sin(theta);
            points.push(project(x, y, z));
          }

          for (let j = 0; j < points.length - 1; j++) {
            const p1 = points[j];
            const p2 = points[j + 1];
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = getDepthStyle((p1.z + p2.z) / 2, 0.65);
            ctx.lineWidth = p1.z < 0 ? 1.1 : 0.7;
            ctx.stroke();
          }
        }

        // Equatorial Accent Ring with Radiating Ticks
        ctx.beginPath();
        for (let j = 0; j <= 60; j++) {
          const theta = (j * 2 * Math.PI) / 60;
          const p = project(RADIUS * Math.cos(theta), 0, RADIUS * Math.sin(theta));
          if (j === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(217, 142, 63, 0.45)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Polar Axis Vector
        const northPole = project(0, -RADIUS * 1.25, 0);
        const southPole = project(0, RADIUS * 1.25, 0);
        ctx.beginPath();
        ctx.moveTo(northPole.px, northPole.py);
        ctx.lineTo(southPole.px, southPole.py);
        ctx.strokeStyle = 'rgba(217, 142, 63, 0.25)';
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbital Satellite Alpha (Prograde Orbit)
        const orbitR1 = 158;
        const satAngle1 = angle * 2.2;
        const s1x = orbitR1 * Math.cos(satAngle1);
        const s1y = orbitR1 * Math.sin(satAngle1) * 0.35;
        const s1z = orbitR1 * Math.sin(satAngle1) * 0.9;
        const sat1 = project(s1x, s1y, s1z);

        // Orbital Ring 1
        ctx.beginPath();
        for (let j = 0; j <= 48; j++) {
          const th = (j * 2 * Math.PI) / 48;
          const p = project(orbitR1 * Math.cos(th), orbitR1 * Math.sin(th) * 0.35, orbitR1 * Math.sin(th) * 0.9);
          if (j === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(217, 142, 63, 0.3)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Satellite 1 Beacon
        ctx.beginPath();
        ctx.arc(sat1.px, sat1.py, 6 * sat1.scale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 142, 63, 0.25)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(sat1.px, sat1.py, 2.5 * sat1.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#d98e3f';
        ctx.fill();

        // Orbital Satellite Beta (Retrograde Inclined Orbit in Standard/Dense)
        if (currentControls.density !== 'compact') {
          const orbitR2 = 142;
          const satAngle2 = -angle * 2.8 + Math.PI * 0.7;
          const s2x = orbitR2 * Math.cos(satAngle2) * 0.4;
          const s2y = orbitR2 * Math.sin(satAngle2);
          const s2z = orbitR2 * Math.cos(satAngle2) * 0.85;
          const sat2 = project(s2x, s2y, s2z);

          ctx.beginPath();
          for (let j = 0; j <= 40; j++) {
            const th = (j * 2 * Math.PI) / 40;
            const p = project(orbitR2 * Math.cos(th) * 0.4, orbitR2 * Math.sin(th), orbitR2 * Math.cos(th) * 0.85);
            if (j === 0) ctx.moveTo(p.px, p.py);
            else ctx.lineTo(p.px, p.py);
          }
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 0.9;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(sat2.px, sat2.py, 4 * sat2.scale, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(sat2.px, sat2.py, 2 * sat2.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      }

      // ──────────────────────────────────────────────────────────────────────────
      // 3. GEOMETRY 2: HYPERSPACE MAGNETIC FLUX TORUS (REDONE)
      // ──────────────────────────────────────────────────────────────────────────
      else if (currentControls.geometry === 'torus') {
        const R = 98; // Major radius (ring center to tube center)
        const r = 40; // Minor radius (tube thickness)

        const uSteps = Math.round(18 * densityMult); // Around the donut
        const vSteps = Math.round(10 * densityMult); // Around the tube

        // A. Draw Minor Rib Cross-Sections (vertical slices along perimeter)
        for (let i = 0; i < uSteps; i++) {
          const u = (i * 2 * Math.PI) / uSteps;
          const cosU = Math.cos(u);
          const sinU = Math.sin(u);

          const points = [];
          for (let j = 0; j <= 28; j++) {
            const v = (j * 2 * Math.PI) / 28;
            const x = (R + r * Math.cos(v)) * cosU;
            const y = (R + r * Math.cos(v)) * sinU;
            const z = r * Math.sin(v);
            points.push(project(x, y, z));
          }

          for (let j = 0; j < points.length - 1; j++) {
            const p1 = points[j];
            const p2 = points[j + 1];
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = getDepthStyle((p1.z + p2.z) / 2, 0.7);
            ctx.lineWidth = p1.z < 0 ? 1.2 : 0.75;
            ctx.stroke();
          }
        }

        // B. Draw Major Concentric Torus Rings (rings looping around the whole donut)
        for (let j = 0; j < vSteps; j++) {
          const v = (j * 2 * Math.PI) / vSteps;
          const tubeR = R + r * Math.cos(v);
          const tubeZ = r * Math.sin(v);

          const points = [];
          for (let i = 0; i <= 36; i++) {
            const u = (i * 2 * Math.PI) / 36;
            const x = tubeR * Math.cos(u);
            const y = tubeR * Math.sin(u);
            points.push(project(x, y, tubeZ));
          }

          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const p2 = points[i + 1];
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.strokeStyle = getDepthStyle((p1.z + p2.z) / 2, 0.85);
            ctx.lineWidth = p1.z < 0 ? 1.3 : 0.8;
            ctx.stroke();
          }
        }

        // C. Helical Energy Streamer Particles flowing inside/through the torus tube!
        const particleCount = currentControls.density === 'compact' ? 2 : currentControls.density === 'dense' ? 5 : 3;
        for (let p = 0; p < particleCount; p++) {
          const phaseOffset = (p * 2 * Math.PI) / particleCount;
          const u_t = angle * 2.0 + phaseOffset;
          const v_t = angle * 5.5 + phaseOffset * 2;

          const px = (R + r * Math.cos(v_t)) * Math.cos(u_t);
          const py = (R + r * Math.cos(v_t)) * Math.sin(u_t);
          const pz = r * Math.sin(v_t);
          const pProj = project(px, py, pz);

          // Glowing energy bead with trail
          ctx.beginPath();
          ctx.arc(pProj.px, pProj.py, 7 * pProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(217, 142, 63, 0.3)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pProj.px, pProj.py, 3 * pProj.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // Particle trajectory trail
          ctx.beginPath();
          for (let t = 1; t <= 6; t++) {
            const u_prev = u_t - t * 0.08;
            const v_prev = v_t - t * 0.22;
            const p_prev = project(
              (R + r * Math.cos(v_prev)) * Math.cos(u_prev),
              (R + r * Math.cos(v_prev)) * Math.sin(u_prev),
              r * Math.sin(v_prev),
            );
            if (t === 1) ctx.moveTo(p_prev.px, p_prev.py);
            else ctx.lineTo(p_prev.px, p_prev.py);
          }
          ctx.strokeStyle = 'rgba(217, 142, 63, 0.4)';
          ctx.lineWidth = 2 * pProj.scale;
          ctx.stroke();
        }

        // D. Central Vortex Singularity Node
        const centerCore = project(0, 0, 0);
        ctx.beginPath();
        ctx.arc(centerCore.px, centerCore.py, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 142, 63, 0.4)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerCore.px, centerCore.py, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#d98e3f';
        ctx.fill();
      }

      // ──────────────────────────────────────────────────────────────────────────
      // 4. GEOMETRY 3: QUANTUM GYROSCOPIC ASTROLABE (REDONE)
      // ──────────────────────────────────────────────────────────────────────────
      else if (currentControls.geometry === 'rings') {
        // Multi-axis nested gimbal configuration
        // Gimbal 1: Outer Celestial Horizon Astrolabe (R = 152) with Degree Ticks
        const r1 = 152;
        ctx.beginPath();
        for (let j = 0; j <= 60; j++) {
          const th = (j * 2 * Math.PI) / 60;
          const p = project(r1 * Math.cos(th), r1 * Math.sin(th), 0);
          if (j === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(217, 142, 63, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Vernier tick notches along outer ring
        const tickCount = currentControls.density === 'compact' ? 12 : currentControls.density === 'dense' ? 36 : 24;
        for (let i = 0; i < tickCount; i++) {
          const th = (i * 2 * Math.PI) / tickCount + angle * 0.15;
          const pInner = project(r1 * Math.cos(th), r1 * Math.sin(th), 0);
          const pOuter = project((r1 + 7) * Math.cos(th), (r1 + 7) * Math.sin(th), 0);
          ctx.beginPath();
          ctx.moveTo(pInner.px, pInner.py);
          ctx.lineTo(pOuter.px, pOuter.py);
          ctx.strokeStyle = i % 4 === 0 ? 'rgba(217, 142, 63, 0.7)' : 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = i % 4 === 0 ? 1.5 : 1;
          ctx.stroke();
        }

        // Gimbal 2: Pitch Gimbal (R = 126) rotating on tilted Y axis
        const r2 = 126;
        const tilt2 = angle * 1.2;
        ctx.beginPath();
        for (let j = 0; j <= 48; j++) {
          const th = (j * 2 * Math.PI) / 48;
          const x = r2 * Math.cos(th);
          const y = r2 * Math.sin(th) * Math.cos(tilt2);
          const z = r2 * Math.sin(th) * Math.sin(tilt2);
          const p = project(x, y, z);
          if (j === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(217, 142, 63, 0.5)';
        ctx.lineWidth = 1.3;
        ctx.stroke();

        // Carrier Node 1 on Gimbal 2
        const cn1 = project(r2 * Math.cos(angle * 2.5), r2 * Math.sin(angle * 2.5) * Math.cos(tilt2), r2 * Math.sin(angle * 2.5) * Math.sin(tilt2));
        ctx.beginPath();
        ctx.arc(cn1.px, cn1.py, 5 * cn1.scale, 0, Math.PI * 2);
        ctx.fillStyle = '#d98e3f';
        ctx.fill();

        // Gimbal 3: Counter-Rotating Roll Gimbal (R = 100) on X-Z axis
        const r3 = 100;
        const tilt3 = -angle * 1.5 + Math.PI * 0.25;
        ctx.beginPath();
        for (let j = 0; j <= 48; j++) {
          const th = (j * 2 * Math.PI) / 48;
          const x = r3 * Math.cos(th) * Math.cos(tilt3);
          const y = r3 * Math.sin(th);
          const z = r3 * Math.cos(th) * Math.sin(tilt3);
          const p = project(x, y, z);
          if (j === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Gimbal 4: Fast Precession Diagonal Ring (R = 76)
        const r4 = 76;
        const tilt4 = angle * 2.4;
        ctx.beginPath();
        for (let j = 0; j <= 36; j++) {
          const th = (j * 2 * Math.PI) / 36;
          const x = r4 * Math.cos(th) * Math.cos(Math.PI / 4) - r4 * Math.sin(th) * Math.sin(tilt4) * Math.sin(Math.PI / 4);
          const y = r4 * Math.sin(th) * Math.cos(tilt4);
          const z = r4 * Math.cos(th) * Math.sin(Math.PI / 4) + r4 * Math.sin(th) * Math.sin(tilt4) * Math.cos(Math.PI / 4);
          const p = project(x, y, z);
          if (j === 0) ctx.moveTo(p.px, p.py);
          else ctx.lineTo(p.px, p.py);
        }
        ctx.strokeStyle = 'rgba(217, 142, 63, 0.6)';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Gimbal 5: High-Density Innermost Core Ring (in Dense mode)
        if (currentControls.density === 'dense') {
          const r5 = 52;
          const tilt5 = -angle * 3.2;
          ctx.beginPath();
          for (let j = 0; j <= 30; j++) {
            const th = (j * 2 * Math.PI) / 30;
            const p = project(r5 * Math.cos(th), r5 * Math.sin(th) * Math.sin(tilt5), r5 * Math.sin(th) * Math.cos(tilt5));
            if (j === 0) ctx.moveTo(p.px, p.py);
            else ctx.lineTo(p.px, p.py);
          }
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        // Center: 3D Wireframe Floating Octahedron (Quantum Singularity Core)
        const octSize = 30;
        const octRot = angle * 1.8;
        const cosO = Math.cos(octRot);
        const sinO = Math.sin(octRot);

        // 6 Vertices of Octahedron rotated in 3D
        const rawVerts = [
          [octSize, 0, 0],
          [-octSize, 0, 0],
          [0, octSize, 0],
          [0, -octSize, 0],
          [0, 0, octSize],
          [0, 0, -octSize],
        ];

        const octPoints = rawVerts.map(([vx, vy, vz]) => {
          // Rotate locally around Y then X
          const rx = vx * cosO - vz * sinO;
          const rz = vz * cosO + vx * sinO;
          return project(rx, vy, rz);
        });

        // 12 Edges connecting vertices
        const edges = [
          [0, 2], [0, 3], [0, 4], [0, 5],
          [1, 2], [1, 3], [1, 4], [1, 5],
          [2, 4], [4, 3], [3, 5], [5, 2],
        ];

        edges.forEach(([v1, v2]) => {
          const p1 = octPoints[v1];
          const p2 = octPoints[v2];
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = getDepthStyle((p1.z + p2.z) / 2, 0.95);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

        // Central glowing quantum core bead
        const coreP = project(0, 0, 0);
        ctx.beginPath();
        ctx.arc(coreP.px, coreP.py, 6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(217, 142, 63, 0.4)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(coreP.px, coreP.py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // ──────────────────────────────────────────────────────────────────────────
      // 5. HUD TELEMETRY OVERLAY READOUTS
      // ──────────────────────────────────────────────────────────────────────────
      ctx.save();
      // Center Reticle Crosshairs (very subtle)
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy);
      ctx.lineTo(cx + 10, cy);
      ctx.moveTo(cx, cy - 10);
      ctx.lineTo(cx, cy + 10);
      ctx.strokeStyle = 'rgba(217, 142, 63, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Continue render loop if motion enabled
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
      {/* Ambient background glow */}
      <div className="absolute inset-4 rounded-full bg-accent/[0.05] blur-3xl pointer-events-none" />

      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ filter: 'drop-shadow(0 0 30px rgba(217, 142, 63, 0.2))' }}
      />

      {/* Floating HUD telemetry tags */}
      <div className="absolute top-3 left-4 flex items-center gap-1.5 font-mono text-[9px] text-accent/80 tracking-widest bg-ink/70 border border-line/60 rounded px-2 py-0.5 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
        GEOM // {controls.geometry.toUpperCase()}
      </div>

      <div className="absolute bottom-3 right-4 font-mono text-[9px] text-text-dim tracking-widest bg-ink/70 border border-line/60 rounded px-2 py-0.5 backdrop-blur-sm">
        {controls.density.toUpperCase()} • {controls.speed}x • 60 FPS
      </div>
    </div>
  );
}
