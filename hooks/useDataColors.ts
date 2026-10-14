"use client";

import { useCallback, useMemo } from "react";
import { useAccessibility } from "@/context/AccessibilityContext";
import { useTheme } from "@/context/ThemeContext";
import { categoryColorForTheme, getDataThreatColors, getDataRampColor, getMatrixTextColor, type DataChartKind } from "@/lib/data-colors";
import { ACCENT, ACCENT_DEEP, rgbToCss } from "@/lib/report-theme";
import { getCrimeTypeColor } from "./useCrimeTypes";

export function useDataColors() {
  const { dataColorPalette: palette } = useAccessibility();
  const { theme } = useTheme();
  const colorful = palette === "colorful";
  const threatColors = useMemo(() => getDataThreatColors(palette, theme), [palette, theme]);
  const crimeColor = useCallback((type: string) => getCrimeTypeColor(type, palette, theme), [palette, theme]);
  const categoryColor = useCallback((label: string) => categoryColorForTheme(label, theme), [theme]);
  const ramp = useCallback((intensity: number, kind: DataChartKind = "temporal") => rgbToCss(getDataRampColor(intensity, theme, palette, kind)), [palette, theme]);
  const matrixTextColor = useCallback((intensity: number) => getMatrixTextColor(intensity, theme, palette), [palette, theme]);
  const chartColor = colorful ? ramp(1) : rgbToCss(theme === "dark" ? ACCENT : ACCENT_DEEP);
  const dataTextColor = theme === "dark" ? "#f8fafc" : "#0f172a";
  return { palette, colorful, theme, threatColors, crimeColor, categoryColor, ramp, chartColor, dataTextColor, matrixTextColor };
}
