import { test } from "node:test";
import assert from "node:assert/strict";
import { getCrimeTypeColor, CRIME_TYPE_COLORS } from "../hooks/useCrimeTypes";
import { rampColorForTheme, RAMP_LO, RAMP_HI, DARK_RAMP_LO, DARK_RAMP_HI } from "../lib/report-theme";
import * as colors from "../lib/data-colors";
import { THREAT_RGB } from "../lib/geo-threat";

function contrast(a: readonly number[], b: readonly number[]) {
  const luminance = (rgb: readonly number[]) => rgb.map(v => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
const hexRgb = (hex: string) => [1, 3, 5].map(i => Number.parseInt(hex.slice(i, i + 2), 16));

test("Original remains the default and preserves existing crime and report colors", () => {
  assert.equal(colors.getDataThreatColors(), colors.DEFAULT_THREAT_COLORS);
  assert.equal(colors.getDataThreatColors("original", "dark"), colors.DEFAULT_THREAT_COLORS);
  for (const [type, color] of Object.entries(CRIME_TYPE_COLORS)) {
    assert.equal(getCrimeTypeColor(type), color);
    assert.equal(getCrimeTypeColor(type, "original", "dark"), color);
  }
  for (const [level, color] of Object.entries(colors.DEFAULT_THREAT_COLORS)) assert.deepEqual(hexRgb(color), THREAT_RGB[level as keyof typeof THREAT_RGB]);
  assert.deepEqual(rampColorForTheme(0, "light"), RAMP_LO);
  assert.deepEqual(rampColorForTheme(1, "light"), RAMP_HI);
  assert.deepEqual(rampColorForTheme(0, "dark"), DARK_RAMP_LO);
  assert.deepEqual(rampColorForTheme(1, "dark"), DARK_RAMP_HI);
});

test("Colorful map bands use blue teal amber orange and rose rather than the removed palette", () => {
  assert.deepEqual(colors.getDataThreatColors("colorful", "light"), {
    secure: "#3b82f6", low: "#0d9488", moderate: "#f59e0b", high: "#f97316", critical: "#e11d48",
  });
  assert.notDeepEqual(colors.getDataThreatColors("colorful", "light"), colors.getDataThreatColors("colorful", "dark"));
});

test("Colorful crimes have stable family colors across stage and theme", () => {
  for (const theme of ["light", "dark"] as const) {
    const surface = theme === "light" ? [241,245,249] : [30,41,59];
    const values = ["Murder", "Theft", "Drugs", "Rape", "Unlisted Offense"].map(type => getCrimeTypeColor(type, "colorful", theme));
    assert.ok(new Set(values).size >= 3);
    for (const color of values) assert.ok(contrast(hexRgb(color), surface) >= 3);
    assert.equal(getCrimeTypeColor("Murder", "colorful", theme), getCrimeTypeColor("Attempted Murder", "colorful", theme));
    assert.equal(getCrimeTypeColor("Murder", "colorful", theme), getCrimeTypeColor("Frustrated Murder", "colorful", theme));
  }
});

test("Colorful analytics distinguish teal temporal charts from purple heatmaps with legible text", () => {
  assert.equal(typeof colors.getDataRampColor, "function", "new chart palettes should be available");
  assert.equal(typeof colors.getMatrixTextColor, "function");
  for (const theme of ["light", "dark"] as const) {
    for (const t of [0, 0.1, 0.3, 0.5, 0.75, 1]) {
      const temporal = colors.getDataRampColor(t, theme, "colorful", "temporal");
      const matrix = colors.getDataRampColor(t, theme, "colorful", "heatmap");
      assert.notDeepEqual(temporal, matrix);
      assert.ok(contrast(matrix, hexRgb(colors.getMatrixTextColor(t, theme, "colorful"))) >= 4.5);
      assert.deepEqual(colors.getDataRampColor(t, theme, "original"), rampColorForTheme(t, theme));
    }
  }
});

test("Colorful monthly hourly and matrix charts each use a separate palette", () => {
  for (const theme of ["light", "dark"] as const) {
    for (const intensity of [0, 0.3, 0.7, 1]) {
      const monthly = colors.getDataRampColor(intensity, theme, "colorful", "temporal");
      const matrix = colors.getDataRampColor(intensity, theme, "colorful", "heatmap");
      let hourly: readonly number[] | undefined;
      assert.doesNotThrow(() => {
        hourly = colors.getDataRampColor(intensity, theme, "colorful", "hourly");
      }, "Hour of Day needs its own palette");
      assert.notDeepEqual(hourly, monthly);
      assert.notDeepEqual(hourly, matrix);
      assert.notDeepEqual(monthly, matrix);
      for (const kind of ["temporal", "hourly", "heatmap"] as const) {
        assert.deepEqual(colors.getDataRampColor(intensity, theme, "original", kind), rampColorForTheme(intensity, theme));
      }
    }
  }
});
