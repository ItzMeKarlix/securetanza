"use client";

import React from "react";
import { useDataColors } from "@/hooks/useDataColors";
import { useMapContext } from "@/context/MapContext";
import { useThreatLevels } from "@/hooks/useThreatLevels";

/** Pick readable text for colorful swatches, while retaining original badge styling. */
function badgeTextColor(hex: string) {
  const channels = [1, 3, 5].map(offset => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  const luminance = linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  const darkContrast = (luminance + 0.05) / (0.008815 + 0.05);
  const whiteContrast = 1.05 / (luminance + 0.05);
  return darkContrast >= whiteContrast ? "#0f172a" : "#ffffff";
}

export default function MapLegend() {
  const { palette, threatColors } = useDataColors();
	const { hoveredThreatLevel, setHoveredThreatLevel } = useMapContext();
	const { thresholds, loading } = useThreatLevels();

	// Generate dynamic range labels based on thresholds
	const LEGEND_ITEMS = [
		{
			label: "CRITICAL",
			key: "critical",
			color: threatColors.critical,
			range: `${thresholds.high + 1}+`,
		},
		{
			label: "HIGH",
			key: "high",
			color: threatColors.high,
			range: `${thresholds.moderate + 1}-${thresholds.high}`,
		},
		{
			label: "MODERATE",
			key: "moderate",
			color: threatColors.moderate,
			range: `${thresholds.low + 1}-${thresholds.moderate}`,
		},
		{
			label: "LOW",
			key: "low",
			color: threatColors.low,
			range: `1-${thresholds.low}`,
		},
		{
			label: "SECURE",
			key: "secure",
			color: threatColors.secure,
			range: "0",
		},
	];

	const handleToggle = (level: string) => {
		if (hoveredThreatLevel === level) {
			setHoveredThreatLevel(null);
		} else {
			setHoveredThreatLevel(level);
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col gap-1.5 pointer-events-auto">
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="h-9 w-[100px] rounded-lg bg-slate-200/60 dark:bg-white/[0.04] animate-pulse" />
				))}
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1.5 pointer-events-auto">
			{LEGEND_ITEMS.map((item) => {
				const isActive = hoveredThreatLevel === item.key;
				const isDimmed = hoveredThreatLevel && !isActive;

				return (
					<button
						key={item.label}
						onClick={() => handleToggle(item.key)}
						className={`flex items-center gap-2.5 h-9 pl-2 pr-3 rounded-lg border transition-all duration-300 cursor-pointer group ${
							isActive
								? "bg-slate-100 dark:bg-white/[0.08] border-slate-300 dark:border-white/[0.1] scale-105 shadow-sm dark:shadow-none"
								: isDimmed
									? "bg-white/60 dark:bg-[#0F172A]/60 border-slate-100 dark:border-white/[0.03] opacity-50 dark:opacity-40 scale-95"
									: "bg-white/80 dark:bg-[#0F172A]/60 border-slate-200 dark:border-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.08] shadow-sm dark:shadow-none"
						}`}>
						{/* Range Badge */}
						<div
							className={`min-w-[32px] h-[22px] px-1.5 rounded-md flex items-center justify-center text-[12px] font-bold tabular-nums transition-all ${
								isActive ? "text-white shadow-lg" : "text-white dark:text-white/90"
							}`}
							style={{
								backgroundColor: item.color,
								color: palette === "colorful" ? badgeTextColor(item.color) : undefined,
								boxShadow: isActive ? `0 0 12px ${item.color}80` : "none",
							}}>
							{item.range}
						</div>
						{/* Label */}
						<span
							className={`text-[10.5px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-colors ${
								isActive
									? "text-slate-900 dark:text-white"
									: "text-slate-600 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300"
							}`}
							style={{ fontFamily: "var(--font-inter)" }}>
							{item.label}
						</span>
					</button>
				);
			})}
		</div>
	);
}
