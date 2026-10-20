/**
 * Password policy shared by the browser (live checklist) and the server
 * (authoritative check). Client-safe: no node-only imports here — the
 * breach lookup lives in password-policy.server.ts.
 *
 * Composition rules alone still accept "Password123!" or "Tanza@2026", so
 * every new password must also pass zxcvbn, an offline estimator that knows
 * common passwords, l33t swaps, keyboard runs, dates and the user's own name.
 */

import type { ZxcvbnFactory } from "@zxcvbn-ts/core";

export const PASSWORD_RULES = [
	{ label: "At least 8 characters", regex: /.{8,}/, message: "Password must be at least 8 characters" },
	{
		label: "Uppercase & lowercase letters",
		regex: /(?=.*[a-z])(?=.*[A-Z])/,
		message: "Password must contain uppercase and lowercase letters",
	},
	{ label: "At least one number", regex: /[0-9]/, message: "Password must contain at least one number" },
	{
		label: "At least one special character",
		regex: /[^A-Za-z0-9]/,
		message: "Password must contain at least one special character",
	},
] as const;

/** zxcvbn score (0–4) a new password must reach. 3 = "safely unguessable". */
export const MIN_STRENGTH_SCORE = 3;

/** Words an attacker would try first against this particular system. */
const SECURETANZA_WORDS = [
	"securetanza",
	"secure",
	"tanza",
	"cavite",
	"pnp",
	"police",
	"philippines",
	"pilipinas",
	"admin",
	"administrator",
	"officer",
	"station",
	"barangay",
	"crime",
	"cvsu",
	"welcome",
	"password",
	"changeme",
	"letmein",
];

export const COMMON_PASSWORD_LABEL = "Not a common or easily guessed password";
export const COMMON_PASSWORD_MESSAGE = "This password is too common or easy to guess.";
export const BREACHED_PASSWORD_MESSAGE =
	"This password has appeared in a known data breach. Choose a different one.";

/** Per-rule pass/fail for the checklist. */
export function checkRules(password: string) {
	return PASSWORD_RULES.map((rule) => ({ label: rule.label, passed: rule.regex.test(password) }));
}

/** First failing composition rule's message, or null. */
export function firstRuleError(password: string): string | null {
	return PASSWORD_RULES.find((rule) => !rule.regex.test(password))?.message ?? null;
}

/** Name parts and account number, so "Juan2026!" is weak for Juan. */
export function passwordUserInputs(user?: { fullName?: string | null; accountNumber?: string | null } | null) {
	if (!user) return [];
	const nameParts = (user.fullName ?? "").split(/\s+/).filter((part) => part.length >= 3);
	const account = user.accountNumber ? [user.accountNumber, user.accountNumber.replace(/^ACC-/i, "")] : [];
	return [...nameParts, ...account];
}

let factory: Promise<ZxcvbnFactory> | null = null;

/** Builds zxcvbn once, on first use, so its dictionaries stay out of the main bundle. */
function getZxcvbn() {
	factory ??= Promise.all([
		import("@zxcvbn-ts/core"),
		import("@zxcvbn-ts/language-common"),
		import("@zxcvbn-ts/language-en"),
	]).then(
		([core, common, en]) =>
			new core.ZxcvbnFactory({
				dictionary: {
					...common.dictionary,
					...en.dictionary,
					securetanza: SECURETANZA_WORDS,
				},
				graphs: common.adjacencyGraphs,
				translations: en.translations,
				useLevenshteinDistance: true,
			})
	);
	return factory;
}

export interface PasswordEstimate {
	score: number;
	/** zxcvbn's explanation, e.g. "This is similar to a commonly used password." */
	warning: string | null;
	suggestions: string[];
}

export async function estimatePassword(password: string, userInputs: string[] = []): Promise<PasswordEstimate> {
	const zxcvbn = await getZxcvbn();
	const result = await zxcvbn.checkAsync(password, userInputs);
	return {
		score: result.score,
		warning: result.feedback.warning || null,
		suggestions: result.feedback.suggestions,
	};
}
