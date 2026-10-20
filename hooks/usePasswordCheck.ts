"use client";

import { useEffect, useMemo, useState } from "react";
import { MIN_STRENGTH_SCORE, checkRules } from "@/lib/password-policy";
import { estimatePasswordOffThread, warmPasswordChecker } from "@/lib/password-strength-client";

export type CommonCheckStatus = "idle" | "checking" | "ok" | "weak";

const DEBOUNCE_MS = 250;

/**
 * Live password feedback for the change-password screens: the composition
 * checklist plus zxcvbn's "is this common / guessable" verdict. The server
 * re-runs the same checks (and a breach lookup) on submit, so this is
 * guidance, not the gate.
 */
export function usePasswordCheck(password: string, userInputs: string[]) {
	const rules = useMemo(() => checkRules(password), [password]);
	const rulesPassed = rules.every((rule) => rule.passed);
	const inputsKey = userInputs.join("\u0000");

	const [result, setResult] = useState<{
		password: string;
		score: number;
		warning: string | null;
	} | null>(null);

	// Load the dictionaries in the worker while the person is still reading the form.
	useEffect(() => {
		warmPasswordChecker();
	}, []);

	useEffect(() => {
		if (!password) return;
		let cancelled = false;
		const timer = setTimeout(() => {
			estimatePasswordOffThread(password, inputsKey ? inputsKey.split("\u0000") : [])
				.then((estimate) => {
					if (!cancelled) setResult({ password, score: estimate.score, warning: estimate.warning });
				})
				.catch(() => {
					// Estimator failed to load: leave it to the server check.
					if (!cancelled) setResult({ password, score: MIN_STRENGTH_SCORE, warning: null });
				});
		}, DEBOUNCE_MS);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [password, inputsKey]);

	// A result only counts for the exact password it was computed for.
	const current = result && result.password === password ? result : null;
	const common: CommonCheckStatus = !password
		? "idle"
		: !current
		? "checking"
		: current.score >= MIN_STRENGTH_SCORE
		? "ok"
		: "weak";

	return {
		rules,
		common,
		/** zxcvbn's explanation when the password is weak. */
		warning: common === "weak" ? current?.warning ?? null : null,
		/** 0–4; composition failures cap it so the meter never shows green early. */
		score: current ? (rulesPassed ? current.score : Math.min(current.score, 2)) : 0,
		allPassed: rulesPassed && common === "ok",
	};
}
