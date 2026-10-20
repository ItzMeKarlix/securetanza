"use client";

import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useAccessibility, TEXT_SCALE } from "@/context/AccessibilityContext";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
	PageHeader,
	Section,
	Row,
	Rows,
	PAGE_FORM,
	SplitLayout,
} from "../_components/settings-ui";
import { cn } from "@/lib/utils";
import { UnsavedChangesBar } from "../_components/unsaved-changes";
import { landingOptions, themes } from "../_components/preview-thumbnails";
import { hasMapAccess, hasCasesAccess, hasAnalyticsAccess } from "@/lib/auth-routes";

/** Quick picks along the scale; the slider covers every step in between. */
const TEXT_SCALE_PRESETS = [
	{ value: 100, label: "Default" },
	{ value: 115, label: "Large" },
	{ value: 130, label: "Larger" },
	{ value: 150, label: "Largest" },
];

export default function PreferencesPage() {
	const { theme, setTheme } = useTheme();
	const { user, refreshSession } = useAuth();
	const { reduceMotion, setReduceMotion, highContrast, setHighContrast, dataColorPalette, setDataColorPalette, textScale, setTextScale } =
		useAccessibility();
	const [savedSync, setSavedSync] = useState(false);
	const [draftSync, setDraftSync] = useState(false);

	const [savedTheme, setSavedTheme] = useState(theme);
	const [draftTheme, setDraftTheme] = useState(theme);

	const [landingState, setLandingState] = useState<"idle" | "saving" | "saved" | "error">("idle");
	
	const availableLandingOptions = React.useMemo(() => {
		if (!user) return landingOptions;
		return landingOptions.filter((opt) => {
			if (opt.id === "map" || opt.id === "overview") {
				return hasMapAccess(user.permissions);
			}
			if (opt.id === "cases") {
				return hasCasesAccess(user.permissions);
			}
			if (opt.id === "analytics") {
				return hasAnalyticsAccess(user.permissions);
			}
			return true;
		});
	}, [user]);

	const [savedLanding, setSavedLanding] = useState<string>(() => {
		const raw = user?.defaultLandingPage || (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);
		if (raw === "dashboard") return "overview";
		return raw || "overview";
	});
	const [draftLanding, setDraftLanding] = useState<string>(savedLanding);

	React.useEffect(() => {
		setSavedTheme(theme);
		setDraftTheme(theme);
	}, [theme]);

	React.useEffect(() => {
		if (user) {
			const raw = user.defaultLandingPage || (typeof window !== "undefined" ? localStorage.getItem("landingPage") : null);
			const norm = raw === "dashboard" ? "overview" : raw;

			const canUseNorm =
				(norm === "map" && hasMapAccess(user.permissions)) ||
				(norm === "overview" && hasMapAccess(user.permissions)) ||
				(norm === "cases" && hasCasesAccess(user.permissions)) ||
				(norm === "analytics" && hasAnalyticsAccess(user.permissions));

			const fallback = hasMapAccess(user.permissions)
				? "overview"
				: hasCasesAccess(user.permissions)
				? "cases"
				: hasAnalyticsAccess(user.permissions)
				? "analytics"
				: "overview";

			const chosen = canUseNorm && norm ? norm : fallback;
			setSavedLanding(chosen);
			setDraftLanding(chosen);
		}
	}, [user]);

	React.useEffect(() => {
		const applyTheme = (t: string) => {
			if (t === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};

		const isCurrentlyDark = document.documentElement.classList.contains("dark");
		const wantsDark = draftTheme === "dark";

		if (isCurrentlyDark === wantsDark) return;

		if (!document.startViewTransition) {
			applyTheme(draftTheme);
		} else {
			document.startViewTransition(() => applyTheme(draftTheme));
		}
	}, [draftTheme]);

	const savedThemeRef = React.useRef(savedTheme);
	React.useEffect(() => {
		savedThemeRef.current = savedTheme;
	}, [savedTheme]);

	React.useEffect(() => {
		return () => {
			if (savedThemeRef.current === "dark") {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		};
	}, []);


	const handleThemeSelect = (id: string) => {
		if (id === "system") {
			setDraftSync(true);
			if (typeof window !== "undefined") {
				const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
				setDraftTheme(prefersDark ? "dark" : "light");
			}
		} else {
			setDraftSync(false);
			setDraftTheme(id as "light" | "dark");
		}
	};

	const handleLandingSelect = (id: string) => {
		setDraftLanding(id);
	};

	const hasUnsavedChanges = draftSync !== savedSync || draftTheme !== savedTheme || draftLanding !== savedLanding;

	const handleSave = async () => {
		setLandingState("saving");

		// Apply Theme
		if (draftTheme !== savedTheme || draftSync !== savedSync) {
			setTheme(draftTheme);
			setSavedTheme(draftTheme);
			setSavedSync(draftSync);
		}

		// Apply Landing Page
		if (draftLanding !== savedLanding) {
			if (typeof window !== "undefined") localStorage.setItem("landingPage", draftLanding);
			try {
				const res = await fetch("/api/users/settings/landing-page", {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ landingPage: draftLanding }),
				});
				if (!res.ok) throw new Error("Request rejected");
				await refreshSession();
			} catch (error) {
				console.error("Failed to update landing page", error);
			}
		}

		setSavedLanding(draftLanding);
		setLandingState("saved");
		setTimeout(() => setLandingState((s) => (s === "saved" ? "idle" : s)), 2500);
	};

	return (
		<div className={PAGE_FORM}>
			<div className="mb-12">
				<PageHeader title="Account Preferences" />
			</div>

			<SplitLayout>

			<div data-tour="preferences-theme">
				<Section
					title="Interface Theme"
					description="Select a theme or sync with your system for automatic switching."
				>
					<div
						role="radiogroup"
						aria-label="Interface theme"
						className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
					>
						{themes.map(({ id, label, sublabel, Preview }) => (
							<PickerTile
								key={id}
								selected={id === "system" ? draftSync : (!draftSync && draftTheme === id)}
								label={label}
								caption={sublabel}
								onSelect={() => handleThemeSelect(id)}
							>
								<Preview />
							</PickerTile>
						))}
					</div>
				</Section>
			</div>

			<div data-tour="preferences-data-colors">
				<Section
					title="Data colors"
					description="Choose the colors used for crime coding, maps, and analytics graphs. Applied immediately."
				>
					<Rows>
						<Row label="Map and graph palette" description="Original keeps the current colors. Colorful adds distinct crime colors, teal charts, and purple heatmaps." htmlFor="data-color-palette">
							<Select value={dataColorPalette} onValueChange={(value) => setDataColorPalette(value === "colorful" ? "colorful" : "original")}>
								<SelectTrigger id="data-color-palette" aria-label="Map and graph palette" className="w-[13.75rem] max-w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="original">Original</SelectItem>
									<SelectItem value="colorful">Colorful</SelectItem>
								</SelectContent>
							</Select>
						</Row>
					</Rows>
				</Section>
			</div>

			<div data-tour="preferences-accessibility">
				<Section
					title="Accessibility"
					description="Applied immediately, app-wide — no need to save. Reduced motion and higher contrast also follow your system settings automatically until you choose one here."
				>
					<div data-tour="a11y-motion-contrast">
						<Rows>
							<Row
								label="Reduce Motion"
								description="Turn off animations and transitions across the app."
								htmlFor="a11y-reduce-motion"
							>
								<Switch
									id="a11y-reduce-motion"
									checked={reduceMotion}
									onCheckedChange={setReduceMotion}
								/>
							</Row>
							<Row
								label="High Contrast"
								description="Stronger focus outlines and edge definition throughout the interface."
								htmlFor="a11y-high-contrast"
							>
								<Switch
									id="a11y-high-contrast"
									checked={highContrast}
									onCheckedChange={setHighContrast}
								/>
							</Row>
						</Rows>
					</div>

					<div data-tour="a11y-text-size" className="mt-5">
						<TextScaleControl value={textScale} onChange={setTextScale} />
					</div>
				</Section>
			</div>

			<div data-tour="preferences-landing">
				<Section
					title="Default Landing Page"
					description="Choose which view opens automatically when you log in."
				>
					<div
						role="radiogroup"
						aria-label="Default landing page"
						className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2 lg:grid-cols-4 dark:border-white/[0.07]"
					>
						{availableLandingOptions.map(({ id, label, description, Preview }) => (
							<PickerTile
								key={id}
								selected={draftLanding === id}
								label={label}
								caption={description}
								onSelect={() => handleLandingSelect(id)}
							>
								<Preview />
							</PickerTile>
						))}
					</div>
				</Section>
			</div>

			</SplitLayout>

			<UnsavedChangesBar
				show={hasUnsavedChanges}
				saving={landingState === "saving"}
				onSave={handleSave}
			/>
		</div>
	);
}

/**
 * One tile treatment for both pickers: a 1px border that turns accent
 * when selected, plus a dot. No second border weight, no shouted badge.
 */
function PickerTile({
	selected,
	label,
	caption,
	onSelect,
	children,
}: {
	selected: boolean;
	label: string;
	caption: string;
	onSelect: () => void;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			role="radio"
			aria-checked={selected}
			onClick={onSelect}
			className={`group rounded-[10px] border p-2.5 text-left transition-colors ${
				selected
					? "border-[#0EA5E9] bg-[#0EA5E9]/[0.045] dark:bg-[#0EA5E9]/[0.07]"
					: "border-slate-200 hover:border-slate-300 dark:border-white/[0.09] dark:hover:border-white/20"
			}`}
		>
			{children}
			<div className="mt-2.5 flex items-center gap-1.5">
				<span
					aria-hidden="true"
					className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
						selected ? "bg-[#0EA5E9]" : "bg-slate-300 dark:bg-white/20"
					}`}
				/>
				<span
					className={`truncate text-[0.8125rem] font-medium ${
						selected
							? "text-[#0369A1] dark:text-[#7DD3FC]"
							: "text-slate-700 dark:text-slate-200"
					}`}
				>
					{label}
				</span>
			</div>
			<p className="mt-0.5 pl-3 text-[0.7812rem] text-slate-500 dark:text-slate-400">{caption}</p>
		</button>
	);
}

/**
 * Granular text scale: a stepped slider with -/+ for precise nudges and a few
 * presets. Every value is clamped by the context, so nothing here can push
 * the interface past the range the layouts are built to hold.
 */
function TextScaleControl({ value, onChange }: { value: number; onChange: (value: number) => void }) {
	const { min, max, step } = TEXT_SCALE;
	const stepBtn =
		"inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 dark:border-white/[0.12] dark:text-slate-300 dark:hover:border-white/25 dark:hover:text-white";

	return (
		<div className="max-w-[30rem]">
			<div className="flex items-baseline justify-between gap-3">
				<label
					htmlFor="a11y-text-scale"
					className="text-[0.8125rem] font-medium text-slate-700 dark:text-slate-300"
				>
					Text Size
				</label>
				<span className="text-[0.8125rem] font-medium tabular-nums text-slate-900 dark:text-white">
					{value}%
				</span>
			</div>

			<div className="mt-2 flex items-center gap-2">
				<button
					type="button"
					onClick={() => onChange(value - step)}
					disabled={value <= min}
					aria-label="Decrease text size"
					className={stepBtn}
				>
					<span aria-hidden="true" className="text-[0.75rem] font-semibold">A</span>
				</button>
				<input
					id="a11y-text-scale"
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					aria-valuetext={`${value} percent`}
					className="h-9 min-w-0 flex-1 cursor-pointer accent-[#0EA5E9]"
				/>
				<button
					type="button"
					onClick={() => onChange(value + step)}
					disabled={value >= max}
					aria-label="Increase text size"
					className={stepBtn}
				>
					<span aria-hidden="true" className="text-[1.0625rem] font-semibold">A</span>
				</button>
			</div>

			<div role="group" aria-label="Text size presets" className="mt-2.5 flex flex-wrap gap-1.5">
				{TEXT_SCALE_PRESETS.map((preset) => {
					const active = value === preset.value;
					return (
						<button
							key={preset.value}
							type="button"
							aria-pressed={active}
							onClick={() => onChange(preset.value)}
							className={cn(
								"h-8 rounded-md border px-2.5 text-[0.78125rem] font-medium transition-colors",
								active
									? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
									: "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-white/[0.12] dark:text-slate-300 dark:hover:border-white/25"
							)}
						>
							{preset.label}
							<span className={cn("ml-1 tabular-nums", active ? "opacity-70" : "text-slate-400 dark:text-slate-500")}>
								{preset.value}%
							</span>
						</button>
					);
				})}
			</div>

			<p className="mt-2 text-[0.78125rem] leading-relaxed text-slate-500 dark:text-slate-400">
				Scales text and controls together across the app, from {min}% to {max}%.
			</p>
		</div>
	);
}
