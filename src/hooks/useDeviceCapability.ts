import { useEffect, useState } from 'react';

export interface DeviceCapability {
  /** User has OS-level reduced motion on, or capability check hasn't resolved yet (fail safe) */
  prefersReducedMotion: boolean;
  /** True fine pointer (mouse/trackpad) — false on touch, including touch laptops */
  hasFinePointer: boolean;
  /** Heuristic: low core count / low memory / no WebGL — gate heavy visuals behind this */
  isLowEndDevice: boolean;
  /** Whether the capability check has finished (avoids a flash of the wrong variant) */
  ready: boolean;
}

function detectLowEnd(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  const saveData = nav.connection?.saveData ?? false;
  const slowConnection = ['slow-2g', '2g', '3g'].includes(nav.connection?.effectiveType ?? '');

  let hasWebGL = false;
  try {
    const canvas = document.createElement('canvas');
    hasWebGL = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    hasWebGL = false;
  }

  return cores <= 4 || memory <= 4 || saveData || slowConnection || !hasWebGL;
}

export function useDeviceCapability(): DeviceCapability {
  const [state, setState] = useState<DeviceCapability>({
    prefersReducedMotion: true, // fail safe until we know otherwise
    hasFinePointer: false,
    isLowEndDevice: true,
    ready: false,
  });

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');

    const update = () => {
      setState({
        prefersReducedMotion: motionQuery.matches,
        hasFinePointer: pointerQuery.matches,
        isLowEndDevice: detectLowEnd(),
        ready: true,
      });
    };

    update();
    motionQuery.addEventListener('change', update);
    pointerQuery.addEventListener('change', update);

    return () => {
      motionQuery.removeEventListener('change', update);
      pointerQuery.removeEventListener('change', update);
    };
  }, []);

  return state;
}
