export type ThemeId = 'amber' | 'cyber' | 'matrix' | 'synthwave' | 'titanium' | 'cobalt';

export interface ThemeConfig {
  id: ThemeId;
  label: string;
  shortLabel: string;
  description: string;
  accentHex: string;
  accentRgb: [number, number, number];
  inkHex: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'amber',
    label: 'Amber Core',
    shortLabel: 'Amber',
    description: 'Solar gold telemetry & aerospace instruments',
    accentHex: '#d98e3f',
    accentRgb: [217, 142, 63],
    inkHex: '#0a0d11',
  },
  {
    id: 'cyber',
    label: 'Cyber Cyan',
    shortLabel: 'Cyan',
    description: 'Electric neon cyan & deep abyssal navy',
    accentHex: '#00f0ff',
    accentRgb: [0, 240, 255],
    inkHex: '#040a12',
  },
  {
    id: 'matrix',
    label: 'Matrix Green',
    shortLabel: 'Matrix',
    description: 'Classic phosphor CRT terminal emerald',
    accentHex: '#10b981',
    accentRgb: [16, 185, 129],
    inkHex: '#050a06',
  },
  {
    id: 'synthwave',
    label: 'Synthwave',
    shortLabel: 'Synth',
    description: 'Retro outrun magenta & midnight violet',
    accentHex: '#e879f9',
    accentRgb: [232, 121, 249],
    inkHex: '#0d0614',
  },
  {
    id: 'titanium',
    label: 'Titanium Mono',
    shortLabel: 'Titanium',
    description: 'Clean industrial silver & deep graphite',
    accentHex: '#e2e8f0',
    accentRgb: [226, 232, 240],
    inkHex: '#09090b',
  },
  {
    id: 'cobalt',
    label: 'Deep Orbit',
    shortLabel: 'Cobalt',
    description: 'Cosmic satellite blue & deep space void',
    accentHex: '#38bdf8',
    accentRgb: [56, 189, 248],
    inkHex: '#060814',
  },
];

const STORAGE_KEY = 'portfolio_theme';

export function getSavedTheme(): ThemeId {
  if (typeof window === 'undefined') return 'amber';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved && THEMES.some((t) => t.id === saved)) {
      return saved;
    }
  } catch {
    // Ignore storage errors
  }
  return 'amber';
}

export function getThemeConfig(id: ThemeId): ThemeConfig {
  return THEMES.find((t) => t.id === id) || THEMES[0];
}

export function applyTheme(id: ThemeId, options: { notify?: boolean } = {}): void {
  if (typeof document === 'undefined') return;
  const targetTheme = getThemeConfig(id);
  document.documentElement.setAttribute('data-theme', targetTheme.id);

  try {
    localStorage.setItem(STORAGE_KEY, targetTheme.id);
  } catch {
    // Ignore storage errors
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', targetTheme.inkHex);
  }

  if (options.notify !== false) {
    window.dispatchEvent(
      new CustomEvent('app-theme-changed', {
        detail: {
          themeId: targetTheme.id,
          theme: targetTheme,
        },
      })
    );
  }
}
