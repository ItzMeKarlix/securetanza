# Data color palettes

Preferences → Data colors → **Map and graph palette** offers **Original** and **Colorful**. Original remains the default, including when a browser still has the obsolete high-contrast data preference saved. The separate high-contrast data toggle and its implementation have been removed. General interface High Contrast, reduced motion, and text size remain available under Accessibility.

Colorful uses a blue–teal–amber–orange–rose threat scale, stable category colors for crimes, teal Monthly Trend charts, orange Hour of Day charts, and purple heatmaps. Crime, barangay, modus, and place distribution bars use categorical colors. A crime family keeps the same category color across attempted, frustrated, and consummated labels. Map and compare polygons, their legends, the hourly timeline, graph bars, and detail mini-maps follow the selected palette.

The choice applies immediately and is saved in the browser under `data-color-palette`. Returning to Original restores the existing colors and normal hover/opacity behavior. PDF and separately rendered report images retain their existing paper palette. Counts, thresholds, filters, and queries are unchanged.

`hooks/useDataColors.ts` exposes the selected palette. `lib/data-colors.ts` defines the palettes and selects readable foreground text for colorful heatmap cells. `lib/report-theme.ts` again has its original two-argument themed ramp API.

Verification: 43 unit tests passed, with 2 opt-in database/HTTP tests skipped; production build and TypeScript passed. Scoped lint passed for the preference and palette helpers and changed map/compare files. The existing Overview skeleton and mini-map lint findings remain outside this change. Authored diff whitespace checks pass; pre-existing generated Prisma whitespace is excluded.

Browser checks passed desktop light, mobile light, and desktop dark: Original defaults correctly even with the obsolete preference present, the old toggle is absent, Colorful persists after reload, charts use categorical colors, Monthly Trend and Hour of Day use separate palettes, zero-value temporal bars are neutral, map/compare colors follow the palette, and selecting Original restores the former colors exactly. No page errors occurred.

The earlier detector exceptions for clear-button hover styling remain documented in `.impeccable/config.json`; this palette change added no further exceptions.
