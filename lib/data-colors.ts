import type { RGB, ThreatLevel } from "./geo-threat";
import { mix, rampColorForTheme } from "./report-theme";

export type DataColorTheme = "light" | "dark";
export type DataColorPalette = "original" | "colorful";
export type DataChartKind = "temporal" | "hourly" | "heatmap";

export const DEFAULT_THREAT_COLORS: Record<ThreatLevel, string> = {
  secure: "#0ea5e9", low: "#10b981", moderate: "#eab308", high: "#f97316", critical: "#ef4444",
};
const COLORFUL_THREAT_COLORS: Record<DataColorTheme, Record<ThreatLevel, string>> = {
  light: { secure: "#3b82f6", low: "#0d9488", moderate: "#f59e0b", high: "#f97316", critical: "#e11d48" },
  dark: { secure: "#60a5fa", low: "#2dd4bf", moderate: "#fbbf24", high: "#fb923c", critical: "#fb7185" },
};
export function getDataThreatColors(palette: DataColorPalette = "original", theme: DataColorTheme = "light") {
  return palette === "colorful" ? COLORFUL_THREAT_COLORS[theme] : DEFAULT_THREAT_COLORS;
}

const CATEGORY_COLORS: Record<DataColorTheme, readonly string[]> = {
  light: ["#2563eb", "#0f766e", "#7c3aed", "#db2777", "#b45309", "#c2410c", "#0e7490", "#4d7c0f"],
  dark: ["#60a5fa", "#2dd4bf", "#a78bfa", "#f472b6", "#fbbf24", "#fb923c", "#22d3ee", "#a3e635"],
};
export function categoryColorForTheme(label: string, theme: DataColorTheme) {
  let hash = 0;
  for (const character of label.trim().toLowerCase()) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return CATEGORY_COLORS[theme][hash % CATEGORY_COLORS[theme].length];
}
/** Crime families keep one color regardless of stage, order, and filters. */
export function colorfulCrimeColor(type: string, theme: DataColorTheme) {
  const family = type.replace(/^\((?:Incident|Operation)\)\s*/i, "")
    .replace(/^(?:attempted|frustrated|consummated)\s+/i, "").trim();
  return categoryColorForTheme(family, theme);
}

const COLORFUL_RAMPS: Record<DataColorTheme, Record<DataChartKind, { low: RGB; high: RGB }>> = {
  light: {
    temporal: { low: [13, 148, 136], high: [17, 94, 89] },
    hourly: { low: [234, 88, 12], high: [154, 52, 18] },
    heatmap: { low: [139, 92, 246], high: [91, 33, 182] },
  },
  dark: {
    temporal: { low: [45, 212, 191], high: [153, 246, 228] },
    hourly: { low: [251, 146, 60], high: [254, 215, 170] },
    heatmap: { low: [167, 139, 250], high: [221, 214, 254] },
  },
};
export function getDataRampColor(intensity: number, theme: DataColorTheme, palette: DataColorPalette = "original", kind: DataChartKind = "temporal"): RGB {
  if (palette === "original") return rampColorForTheme(intensity, theme);
  const ramp = COLORFUL_RAMPS[theme][kind];
  return mix(ramp.low, ramp.high, Math.pow(Math.max(0, Math.min(1, intensity)), 0.75));
}
export function getMatrixTextColor(intensity: number, theme: DataColorTheme, palette: DataColorPalette): string {
  if (palette === "original") return intensity >= 0.6 ? "#ffffff" : theme === "dark" ? "#f1f5f9" : "#0f172a";
  const rgb = getDataRampColor(intensity, theme, palette, "heatmap");
  const linear = rgb.map(v => { const s = v / 255; return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
  const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  return 1.05 / (luminance + 0.05) >= 4.5 ? "#ffffff" : "#000000";
}
