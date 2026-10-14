"use client";

import React from "react";
import { useDataColors } from "@/hooks/useDataColors";
import { useMapContext } from "@/context/MapContext";
import { useThreatLevels } from "@/hooks/useThreatLevels";
import { OVERLAY_SURFACE } from "@/lib/map-overlay";

/**
 * A one-line key for the barangay shading: Secure → Critical with five colour
 * steps between. Kept tiny on purpose — the exact incident range for each step
 * is in its tooltip (from the same live thresholds that colour the map), and
 * clicking a step spotlights just those barangays.
 */
export default function ThreatScale() {
  const { threatColors } = useDataColors();
  const {
    mapRef,
    hoveredThreatLevel,
    setHoveredThreatLevel,
    previewThreatLevel,
    setPreviewThreatLevel,
  } = useMapContext();
  const { thresholds, loading } = useThreatLevels();
  const scaleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!hoveredThreatLevel) return;
    const clearOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPreviewThreatLevel(null);
        setHoveredThreatLevel(null);
      }
    };
    const clearOutsideMap = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (scaleRef.current?.contains(target)) return;
      if (mapRef.current?.getContainer().contains(target)) return;
      setPreviewThreatLevel(null);
      setHoveredThreatLevel(null);
    };
    document.addEventListener("keydown", clearOnEscape);
    document.addEventListener("pointerdown", clearOutsideMap);
    return () => {
      document.removeEventListener("keydown", clearOnEscape);
      document.removeEventListener("pointerdown", clearOutsideMap);
    };
  }, [hoveredThreatLevel, mapRef, setHoveredThreatLevel, setPreviewThreatLevel]);

  const steps = [
    { key: "secure", label: "Secure", range: "0" },
    { key: "low", label: "Low", range: `1–${thresholds.low}` },
    { key: "moderate", label: "Moderate", range: `${thresholds.low + 1}–${thresholds.moderate}` },
    { key: "high", label: "High", range: `${thresholds.moderate + 1}–${thresholds.high}` },
    { key: "critical", label: "Critical", range: `${thresholds.high + 1}+` },
  ] as const;

  const endLabel = "text-[0.62rem] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400";

  return (
    <div
      ref={scaleRef}
      data-tour="map-threat-scale"
      role="group"
      aria-label="Threat level scale"
      className={`pointer-events-auto flex h-8 items-center gap-2.5 px-3 ${OVERLAY_SURFACE}`}
    >
      <span className={endLabel}>Secure</span>

      <div className="flex items-center gap-0.5">
        {steps.map((step) => {
          const selected = hoveredThreatLevel === step.key;
          const active = (previewThreatLevel ?? hoveredThreatLevel) === step.key;
          const dimmed = (previewThreatLevel ?? hoveredThreatLevel) !== null && !active;
          return (
            <button
              key={step.key}
              onMouseEnter={() => setPreviewThreatLevel(step.key)}
              onMouseLeave={() => setPreviewThreatLevel(null)}
              onFocus={() => setPreviewThreatLevel(step.key)}
              onBlur={() => setPreviewThreatLevel(null)}
              onClick={() => setHoveredThreatLevel(selected ? null : step.key)}
              aria-pressed={selected}
              aria-label={step.label}
              title={`${step.label} — ${step.range} incidents. Hover to preview; click to keep highlighted.`}
              disabled={loading}
              className={`group flex h-6 w-6 cursor-pointer items-center justify-center outline-none focus-visible:outline-none! ${
                dimmed ? "opacity-35" : "opacity-100"
              } transition-opacity duration-200 disabled:cursor-default`}
            >
              <span
                className={`block w-full rounded-full transition-all duration-200 ${
                  active ? "h-2.5" : "h-1.5 group-hover:h-2.5"
                } ${loading ? "animate-pulse bg-slate-300 dark:bg-white/20" : ""}`}
                style={loading ? undefined : { backgroundColor: threatColors[step.key] }}
              />
            </button>
          );
        })}
      </div>

      <span className={endLabel}>Critical</span>
    </div>
  );
}
