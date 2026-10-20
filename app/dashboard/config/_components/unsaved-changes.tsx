"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { btnPrimary } from "./settings-ui";

/* ─────────────────────────────────────────────────────────────
   Unsaved-changes guard: press twice to leave.

   While a settings page has unsaved edits, the first attempt to leave
   (a settings nav link, Back, Process Monitor) is held and the
   "Unsaved changes" bar turns red to explain why. A second attempt
   inside the window goes through and the edits are discarded. If the
   window passes with no second attempt, the bar calms down and the
   next attempt is held again. Closing or reloading the tab falls back
   to the browser's own leave-page prompt.
   ───────────────────────────────────────────────────────────── */

/** How long a held leave stays armed before the bar resets. */
const ARMED_MS = 4000;

type GuardContextValue = {
	/** Pages report whether they currently hold unsaved edits. */
	setDirty: (dirty: boolean) => void;
	/** True while a leave attempt was just held and the bar should demand attention. */
	attention: boolean;
	/** Run `proceed` now, or hold it once if there are unsaved edits. */
	requestLeave: (proceed: () => void) => void;
};

const GuardContext = createContext<GuardContextValue | null>(null);

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
	const [dirty, setDirtyState] = useState(false);
	const [attention, setAttention] = useState(false);
	const dirtyRef = useRef(false);
	const armedRef = useRef(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const disarm = useCallback(() => {
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = null;
		armedRef.current = false;
		setAttention(false);
	}, []);

	const setDirty = useCallback(
		(next: boolean) => {
			dirtyRef.current = next;
			setDirtyState(next);
			if (!next) disarm();
		},
		[disarm]
	);

	const requestLeave = useCallback(
		(proceed: () => void) => {
			if (!dirtyRef.current || armedRef.current) {
				disarm();
				proceed();
				return;
			}
			armedRef.current = true;
			setAttention(true);
			if (timerRef.current) clearTimeout(timerRef.current);
			timerRef.current = setTimeout(disarm, ARMED_MS);
		},
		[disarm]
	);

	// Tab close / reload can't be held in-app; ask the browser to confirm instead.
	useEffect(() => {
		if (!dirty) return;
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			e.preventDefault();
			e.returnValue = "";
		};
		window.addEventListener("beforeunload", onBeforeUnload);
		return () => window.removeEventListener("beforeunload", onBeforeUnload);
	}, [dirty]);

	useEffect(() => () => {
		if (timerRef.current) clearTimeout(timerRef.current);
	}, []);

	return (
		<GuardContext.Provider value={{ setDirty, attention, requestLeave }}>
			{children}
		</GuardContext.Provider>
	);
}

export function useUnsavedChangesGuard() {
	const ctx = useContext(GuardContext);
	if (!ctx) throw new Error("useUnsavedChangesGuard must be used inside UnsavedChangesProvider");
	return ctx;
}

/**
 * The floating "Unsaved changes" bar. Rendering it with `show` is what marks
 * the page dirty, so each page only has to say when it has edits.
 */
export function UnsavedChangesBar({
	show,
	saving,
	onSave,
}: {
	show: boolean;
	saving: boolean;
	onSave: () => void;
}) {
	const { setDirty, attention } = useUnsavedChangesGuard();

	useEffect(() => {
		setDirty(show);
	}, [show, setDirty]);

	// A page unmounting (after a confirmed leave) is no longer dirty.
	useEffect(() => () => setDirty(false), [setDirty]);

	if (!show) return null;

	return (
		<div className="fixed right-6 bottom-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
			<div
				// Re-keying restarts the nudge animation on every held attempt.
				key={attention ? "attention" : "calm"}
				className={cn(
					"flex items-center gap-6 rounded-full border py-2 pr-2 pl-6 shadow-xl transition-colors duration-200",
					attention
						? "unsaved-nudge border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-950"
						: "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
				)}
			>
				<span
					role="status"
					aria-live="assertive"
					className={cn(
						"text-[0.875rem] font-medium whitespace-nowrap",
						attention ? "text-red-700 dark:text-red-300" : "text-slate-700 dark:text-slate-200"
					)}
				>
					{attention ? "Unsaved changes — click again to discard" : "Unsaved changes"}
				</span>
				<button
					type="button"
					onClick={onSave}
					disabled={saving}
					className={cn(btnPrimary, "h-9 rounded-full px-6 text-[0.8438rem] font-semibold shadow-sm")}
				>
					{saving ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</div>
	);
}
