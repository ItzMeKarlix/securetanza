"use client";

import { estimatePassword, type PasswordEstimate } from "./password-policy";

/**
 * Browser-side front for the password-strength worker: one shared worker,
 * requests matched by id. Falls back to the main thread only if workers are
 * unavailable, so the check never silently stops.
 */

type Pending = { resolve: (e: PasswordEstimate) => void; reject: (e: Error) => void };

let worker: Worker | null = null;
let workerFailed = false;
let nextId = 0;
const pending = new Map<number, Pending>();

function getWorker(): Worker | null {
	if (workerFailed || typeof Worker === "undefined") return null;
	if (worker) return worker;
	try {
		worker = new Worker(new URL("./password-strength.worker.ts", import.meta.url), { type: "module" });
		worker.onmessage = (event) => {
			const { id, ok, estimate, error } = event.data;
			const request = pending.get(id);
			if (!request) return;
			pending.delete(id);
			if (ok) request.resolve(estimate);
			else request.reject(new Error(error));
		};
		worker.onerror = () => {
			// Worker couldn't start or crashed: fail the waiting checks and use the main thread from now on.
			workerFailed = true;
			worker?.terminate();
			worker = null;
			for (const request of pending.values()) request.reject(new Error("Password checker unavailable"));
			pending.clear();
		};
		return worker;
	} catch {
		workerFailed = true;
		return null;
	}
}

export function estimatePasswordOffThread(password: string, userInputs: string[]): Promise<PasswordEstimate> {
	const w = getWorker();
	if (!w) return estimatePassword(password, userInputs);
	const id = ++nextId;
	return new Promise<PasswordEstimate>((resolve, reject) => {
		pending.set(id, { resolve, reject });
		w.postMessage({ id, password, userInputs });
	}).catch(() => estimatePassword(password, userInputs));
}

/** Start loading the dictionaries before the first keystroke. */
export function warmPasswordChecker() {
	void estimatePasswordOffThread("warm-up", []).catch(() => {});
}
