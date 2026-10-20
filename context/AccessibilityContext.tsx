"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type DataColorPalette = "original" | "colorful";

/** Text scale as a percentage of the browser's base font size (16px = 100). */
export const TEXT_SCALE = { min: 90, max: 150, step: 5, default: 100 } as const;

/**
 * Parse a stored text scale. Accepts the current numeric form and the old
 * three-tier values ("large" / "larger") so existing choices carry over.
 * Always returns an in-range value on the step grid.
 */
export function normalizeTextScale(raw: unknown): number {
	if (raw === "large") return 110;
	if (raw === "larger") return 125;
	const n = typeof raw === "number" ? raw : Number(raw);
	if (!Number.isFinite(n)) return TEXT_SCALE.default;
	const snapped = Math.round(n / TEXT_SCALE.step) * TEXT_SCALE.step;
	return Math.min(TEXT_SCALE.max, Math.max(TEXT_SCALE.min, snapped));
}

interface AccessibilityContextType {
	reduceMotion: boolean;
	setReduceMotion: (value: boolean) => void;
	highContrast: boolean;
	setHighContrast: (value: boolean) => void;
	dataColorPalette: DataColorPalette;
	setDataColorPalette: (value: DataColorPalette) => void;
	/** Percentage, TEXT_SCALE.min..TEXT_SCALE.max. */
	textScale: number;
	setTextScale: (value: number) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/** Also read directly by the pre-hydration bootstrap script in app/layout.tsx —
 *  keep both in sync if these ever change. */
export const A11Y_STORAGE_KEYS = {
	reduceMotion: "a11y-reduce-motion",
	highContrast: "a11y-high-contrast",
	dataColorPalette: "data-color-palette",
	textSize: "a11y-text-size",
} as const;

/**
 * System-wide accessibility settings, applied the same way the theme picker
 * applies dark mode: one attribute on <html> per setting, read by plain CSS
 * in globals.css so every component reacts automatically — no prop drilling,
 * no per-component opt-in required.
 *
 * Motion and interface contrast follow the OS until explicitly chosen.
 * Data palette selection is independent and starts with the original colors.
 * All choices are remembered in this browser.
 */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
	const [reduceMotion, setReduceMotion] = useState(false);
	const [highContrast, setHighContrast] = useState(false);
	const [dataColorPalette, setDataColorPalette] = useState<DataColorPalette>("original");
	const [textScale, setTextScaleState] = useState<number>(TEXT_SCALE.default);
	const setTextScale = (value: number) => setTextScaleState(normalizeTextScale(value));
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);

		const storedMotion = localStorage.getItem(A11Y_STORAGE_KEYS.reduceMotion);
		if (storedMotion !== null) {
			setReduceMotion(storedMotion === "true");
		} else if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
			setReduceMotion(true);
		}

		const storedContrast = localStorage.getItem(A11Y_STORAGE_KEYS.highContrast);
		if (storedContrast !== null) {
			setHighContrast(storedContrast === "true");
		} else if (window.matchMedia?.("(prefers-contrast: more)").matches) {
			setHighContrast(true);
		}

		setDataColorPalette(localStorage.getItem(A11Y_STORAGE_KEYS.dataColorPalette) === "colorful" ? "colorful" : "original");
		setTextScaleState(normalizeTextScale(localStorage.getItem(A11Y_STORAGE_KEYS.textSize) ?? TEXT_SCALE.default));
	}, []);

	// Applied independently (not as one combined effect) so toggling any single
	// setting never touches the others' attributes.
	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute("data-reduce-motion", String(reduceMotion));
		localStorage.setItem(A11Y_STORAGE_KEYS.reduceMotion, String(reduceMotion));
	}, [reduceMotion, mounted]);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute("data-high-contrast", String(highContrast));
		localStorage.setItem(A11Y_STORAGE_KEYS.highContrast, String(highContrast));
	}, [highContrast, mounted]);

	useEffect(() => {
		if (!mounted) return;
		document.documentElement.setAttribute("data-color-palette", dataColorPalette);
		localStorage.setItem(A11Y_STORAGE_KEYS.dataColorPalette, dataColorPalette);
	}, [dataColorPalette, mounted]);

	useEffect(() => {
		if (!mounted) return;
		// Scaling the root font size reaches everything sized in rem.
		document.documentElement.style.fontSize =
			textScale === TEXT_SCALE.default ? "" : `${textScale}%`;
		localStorage.setItem(A11Y_STORAGE_KEYS.textSize, String(textScale));
	}, [textScale, mounted]);

	const value: AccessibilityContextType = {
		reduceMotion,
		setReduceMotion,
		highContrast,
		setHighContrast,
		dataColorPalette,
		setDataColorPalette,
		textScale,
		setTextScale,
	};

	return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
	const context = useContext(AccessibilityContext);
	if (context === undefined) {
		throw new Error("useAccessibility must be used within an AccessibilityProvider");
	}
	return context;
}
