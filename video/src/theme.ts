// HAMi brand tokens — from website BRAND.md (dark mode)
export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const SAFE = 110; // safe margin

export const colors = {
  bg: "#0b0f14",
  surface: "#171e27",
  surface3: "#263241",
  border: "#2a3442",
  text: "#f5f7fa",
  muted: "#9eb6ce",
  faint: "#5a748f",
  primary: "#10d05d",
  primaryLight: "#35e37b",
  primaryDark: "#0ebd54",
  secondary: "#39c6f4",
  tertiary: "#7c8cff",
  warning: "#f5b942",
  danger: "#ff5c7a",
} as const;

export const fonts = {
  // Latin-first display stack; CJK glyphs fall through to Noto Sans SC
  display: "'Space Grotesk','Noto Sans SC',sans-serif",
  body: "'Noto Sans SC','Space Grotesk',sans-serif",
  mono: "'IBM Plex Mono','Noto Sans SC',monospace",
} as const;

export const springConfigs = {
  smooth: { damping: 200 },
  snappy: { damping: 24, stiffness: 220 },
  bouncy: { damping: 13, stiffness: 130 },
  heavy: { damping: 16, stiffness: 90, mass: 1.4 },
} as const;
