"use client";

import React from "react";
import dynamic from "next/dynamic";
import type { OffenseRecord } from "@/lib/api";

// Leaflet touches `window` at import time, so the actual map can only ever be
// loaded in the browser — same treatment app/page.tsx gives the main map.
const SliceMiniMapInner = dynamic(() => import("./slice-mini-map-inner"), {
  ssr: false,
  loading: () => (
    <div
      className="rounded-lg animate-pulse bg-slate-200/60 dark:bg-white/[0.04]"
      style={{ height: 220 }}
    />
  ),
});

export default function SliceMiniMap({
  offenses,
  theme,
}: {
  offenses: OffenseRecord[];
  theme: string;
}) {
  const withCoords = offenses.filter(
    (c) => typeof c.latitude === "number" && typeof c.longitude === "number"
  ).length;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-white/[0.06]">
        <SliceMiniMapInner offenses={offenses} theme={theme} />
      </div>
      <p className={`text-[0.68rem] ${theme === "dark" ? "text-slate-500" : "text-slate-400"}`}>
        {withCoords > 0
          ? `Shaded by offense count per barangay · ${withCoords} of ${offenses.length} pinned to exact coordinates`
          : "Shaded by offense count per barangay · no exact coordinates recorded for these offenses"}
      </p>
    </div>
  );
}
