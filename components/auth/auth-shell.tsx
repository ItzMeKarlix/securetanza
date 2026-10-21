"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { POLICE_STATION_COORD } from "@/constants/map-constants";
import { TANZA_BARANGAYS, TANZA_STATION, TANZA_UNITS_PER_KM, TANZA_VIEWBOX } from "./tanza-outline-paths";

// Shared look for the sign-in surfaces (login, two-step, forgot / set password),
// light and dark. Fields sit straight on the form column — no card.
export const AUTH_LABEL = "block text-sm font-medium text-slate-700 dark:text-slate-300";
export const AUTH_INPUT =
	"block w-full h-12 rounded-lg border border-slate-300 bg-white px-3.5 text-[0.9375rem] text-slate-900 placeholder:text-slate-500 shadow-sm shadow-slate-900/[0.04] transition-[border-color,box-shadow] focus:border-sky-600 focus:outline-none focus:ring-4 focus:ring-sky-500/15 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-400 dark:shadow-none dark:focus:border-sky-400 dark:focus:ring-sky-400/15";
export const AUTH_ICON = "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 dark:text-slate-400";
export const AUTH_PRIMARY =
	"inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-sky-700 px-4 text-[0.9375rem] font-semibold text-white shadow-sm shadow-sky-900/20 transition-colors hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#0EA5E9] dark:text-[#0B1120] dark:shadow-none dark:hover:bg-sky-400 dark:focus-visible:outline-sky-400";
export const AUTH_SECONDARY =
	"inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-700 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white";
export const AUTH_LINK =
	"cursor-pointer font-medium text-sky-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-sky-400";
export const AUTH_QUIET_LINK =
	"inline-flex cursor-pointer items-center justify-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-slate-400 dark:hover:text-white";
export const AUTH_MUTED = "text-slate-600 dark:text-slate-400";
export const AUTH_FINE = "text-xs leading-relaxed text-slate-600 dark:text-slate-400";
export const AUTH_ERROR =
	"flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300";
export const AUTH_SUCCESS =
	"flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-800 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300";
export const AUTH_INFO =
	"flex items-start gap-3 rounded-lg border border-sky-200 bg-sky-50 p-3.5 text-sm text-sky-950 dark:border-sky-400/25 dark:bg-sky-400/10 dark:text-sky-100";
export const AUTH_TITLE = "font-heading text-[1.75rem] font-bold leading-tight tracking-[-0.02em] text-balance text-slate-950 dark:text-white";
export const AUTH_SUBTITLE = "mt-2 text-[0.9375rem] leading-relaxed text-pretty text-slate-600 dark:text-slate-400";
export const AUTH_BADGE = "mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-400";
export const AUTH_CHECKBOX = "mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-sky-700 dark:accent-[#0EA5E9]";

const STATION_COORDS = `${POLICE_STATION_COORD[0].toFixed(4)}° N, ${POLICE_STATION_COORD[1].toFixed(4)}° E`;
const [, , VIEW_WIDTH, VIEW_HEIGHT] = TANZA_VIEWBOX.split(" ").map(Number);
/** North-to-south order for the opening trace: delay follows each path's first point. */
const TRACE_DELAY = TANZA_BARANGAYS.map(({ d }) => {
	const y = Number(d.slice(1).split("L")[0].split(" ")[1]);
	return Math.round((y / VIEW_HEIGHT) * 900);
});

function Logo({ size }: { size: number }) {
	return (
		<>
			<Image src="/SC LOGO 2.png" alt="" width={size} height={size} className="object-contain dark:hidden" priority />
			<Image src="/SC LOGO W 1.png" alt="" width={size} height={size} className="hidden object-contain dark:block" priority />
		</>
	);
}

function Identity({ compact }: { compact?: boolean }) {
	return (
		<div className="flex items-center gap-3">
			<Logo size={compact ? 36 : 44} />
			<div className="min-w-0">
				<p className={`font-heading font-bold tracking-[-0.01em] text-slate-950 dark:text-white ${compact ? "text-base" : "text-lg"}`}>
					SecureTanza
				</p>
				<p className={`text-slate-600 dark:text-slate-400 ${compact ? "text-xs" : "text-sm"}`}>Crime Mapping &amp; Analytics System</p>
			</div>
		</div>
	);
}

/**
 * The municipality itself, drawn from the real barangay boundaries, with the
 * station pinned. Pointing at a barangay names it. Geography only — no crime
 * data is shown before sign-in.
 */
function TanzaPanel() {
	const [hovered, setHovered] = useState<string | null>(null);
	// Screen pixels per viewBox unit. Labels, the scale bar and the station are
	// drawn at fixed pixel sizes, so they stay legible however small the map gets.
	const svgRef = useRef<SVGSVGElement>(null);
	const [pxPerUnit, setPxPerUnit] = useState(0.45);
	useEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			if (width && height) setPxPerUnit(Math.min(width / VIEW_WIDTH, height / VIEW_HEIGHT));
		});
		observer.observe(svg);
		return () => observer.disconnect();
	}, []);
	const px = (n: number) => n / pxPerUnit;
	const km = TANZA_UNITS_PER_KM;

	return (
		<aside className="relative hidden h-screen min-h-0 flex-col border-r border-slate-200 bg-slate-100 px-10 py-10 lg:flex xl:px-14 xl:py-12 dark:border-white/[0.06] dark:bg-[#0B1120]">
			<Identity />

			<div className="relative min-h-0 flex-1 py-6">
				<svg
					ref={svgRef}
					viewBox={TANZA_VIEWBOX}
					preserveAspectRatio="xMidYMid meet"
					className="h-full w-full overflow-visible"
					aria-hidden="true"
					onPointerLeave={() => setHovered(null)}
				>
					<g strokeWidth={2.4} strokeLinejoin="round">
						{TANZA_BARANGAYS.map(({ name, d }) => (
							<path
								key={name}
								d={d}
								onPointerEnter={() => setHovered(name)}
								className={`transition-[fill,stroke] duration-200 ${
									hovered === name
										? "fill-sky-500/25 stroke-sky-700 dark:fill-sky-400/20 dark:stroke-sky-300"
										: "fill-white stroke-slate-300 dark:fill-sky-400/[0.04] dark:stroke-slate-700"
								}`}
							/>
						))}
					</g>
					<g className="auth-trace pointer-events-none fill-none stroke-sky-600/55 dark:stroke-sky-400/45" strokeWidth={3} strokeLinejoin="round">
						{TANZA_BARANGAYS.map(({ name, d }, i) => (
							<path key={name} d={d} pathLength={1} style={{ animationDelay: `${TRACE_DELAY[i]}ms` }} />
						))}
					</g>
					{/* Survey-sheet marks, in the open water and land the outline leaves free. */}
					<g className="pointer-events-none fill-slate-600 dark:fill-slate-400">
						<text x={60} y={190} fontSize={px(13)} fontStyle="italic" letterSpacing={px(0.3)}>
							Manila Bay
						</text>
						<g transform={`translate(40 1080) scale(${px(1)})`}>
							<path d="M8 0L15 18L8 14L1 18Z" />
							<text x={8} y={34} fontSize={12} fontWeight={600} textAnchor="middle">
								N
							</text>
						</g>
						<g transform="translate(40 1250)">
							<rect width={km} height={px(5)} />
							<rect x={km} width={km} height={px(5)} strokeWidth={px(1)} className="fill-transparent stroke-slate-600 dark:stroke-slate-400" />
							<text y={px(21)} fontSize={px(12)}>
								0
							</text>
							<text x={km} y={px(21)} fontSize={px(12)} textAnchor="middle">
								1
							</text>
							<text x={2 * km} y={px(21)} fontSize={px(12)} textAnchor="middle">
								2 km
							</text>
						</g>
					</g>
					<g transform={`translate(${TANZA_STATION.x} ${TANZA_STATION.y})`} className="pointer-events-none">
						<circle r={px(12)} strokeWidth={px(1.5)} className="auth-station-ring fill-sky-600/15 stroke-sky-700/60 dark:fill-sky-400/20 dark:stroke-sky-400/60" />
						<circle r={px(5)} strokeWidth={px(2)} className="fill-sky-700 stroke-white dark:fill-[#0EA5E9] dark:stroke-[#0B1120]" />
						<text
							x={px(17)}
							y={px(4)}
							fontSize={px(12)}
							fontWeight={600}
							strokeWidth={px(4)}
							paintOrder="stroke"
							strokeLinejoin="round"
							className="fill-slate-950 stroke-white dark:fill-white dark:stroke-[#0B1120]"
						>
							Police station
						</text>
					</g>
				</svg>
			</div>

			<div className="space-y-5">
				<p className="text-sm text-slate-600 dark:text-slate-400" aria-hidden="true">
					{hovered ? (
						<>
							<span className="font-semibold text-slate-950 dark:text-white">{hovered}</span>
							<span> · Barangay of Tanza, Cavite</span>
						</>
					) : (
						<>Tanza, Cavite · {TANZA_BARANGAYS.length} barangays</>
					)}
				</p>
				<div className="border-t border-slate-300 pt-5 dark:border-white/10">
					<p className="flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-white">
						<span aria-hidden="true" className="size-2.5 rounded-full bg-sky-700 ring-2 ring-white dark:bg-[#0EA5E9] dark:ring-[#0B1120]" />
						Tanza Municipal Police Station
					</p>
					<p className="mt-1 pl-[1.125rem] text-xs tabular-nums text-slate-600 dark:text-slate-400">{STATION_COORDS}</p>
					<p className="mt-4 text-xs text-slate-600 dark:text-slate-400">Authorized personnel only · © 2026</p>
				</div>
			</div>
		</aside>
	);
}

/** Two columns from `lg` up: the municipality on the left, the form on the right. */
export function AuthShell({
	title,
	subtitle,
	children,
}: {
	title?: string;
	subtitle?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		// The body never scrolls in this app, so the form column scrolls itself.
		<div className="auth-surface h-screen overflow-y-auto bg-white text-slate-900 caret-sky-600 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(30rem,38rem)] lg:overflow-hidden dark:bg-[#0F172A] dark:text-slate-100 dark:caret-sky-400">
			<TanzaPanel />
			<div className="flex min-h-full flex-col px-4 py-6 sm:px-8 lg:h-screen lg:overflow-y-auto lg:px-14 lg:py-10">
				<div className="lg:hidden">
					<Identity compact />
				</div>
				<main className="mx-auto my-auto w-full max-w-[25rem] py-10">
					{title && (
						<div className="mb-8">
							<h1 className={AUTH_TITLE}>{title}</h1>
							{subtitle && <p className={AUTH_SUBTITLE}>{subtitle}</p>}
						</div>
					)}
					{children}
				</main>
				<p className="text-center text-xs text-slate-600 lg:hidden dark:text-slate-400">
					Tanza Municipal Police Station · Authorized personnel only
				</p>
			</div>
		</div>
	);
}
