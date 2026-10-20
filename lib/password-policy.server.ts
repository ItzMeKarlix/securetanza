import { createHash } from "crypto";
import {
	BREACHED_PASSWORD_MESSAGE,
	COMMON_PASSWORD_MESSAGE,
	MIN_STRENGTH_SCORE,
	estimatePassword,
	firstRuleError,
	passwordUserInputs,
} from "@/lib/password-policy";

const HIBP_RANGE_URL = "https://api.pwnedpasswords.com/range/";
const HIBP_TIMEOUT_MS = 2500;

/**
 * Have I Been Pwned, k-anonymity: only the first 5 hex chars of the SHA-1
 * leave this server. Returns true/false, or null when the API can't be
 * reached — callers then rely on the offline checks rather than blocking.
 */
async function isBreached(password: string): Promise<boolean | null> {
	const hash = createHash("sha1").update(password).digest("hex").toUpperCase();
	const prefix = hash.slice(0, 5);
	const suffix = hash.slice(5);
	try {
		const res = await fetch(HIBP_RANGE_URL + prefix, {
			headers: { "Add-Padding": "true", "User-Agent": "SecureTanza-password-check" },
			signal: AbortSignal.timeout(HIBP_TIMEOUT_MS),
			cache: "no-store",
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const body = await res.text();
		return body.split("\n").some((line) => {
			const [lineSuffix, count] = line.trim().split(":");
			return lineSuffix === suffix && Number(count) > 0;
		});
	} catch (error) {
		console.warn("[password-policy] Breach check skipped:", error instanceof Error ? error.message : error);
		return null;
	}
}

// Build zxcvbn's dictionaries when the server loads this module, not on the first
// person to set a password (~1 s on a cold start).
void estimatePassword('warm-up', []).catch(() => {});

/**
 * The authoritative new-password check. Returns an error message for the
 * user, or null when the password is acceptable.
 */
export async function validateNewPassword(
	password: string,
	user: { fullName?: string | null; accountNumber?: string | null }
): Promise<string | null> {
	const ruleError = firstRuleError(password);
	if (ruleError) return ruleError;

	// The strength estimate and the breach lookup don't depend on each other, so
	// the slower network call overlaps the CPU work instead of following it.
	const [estimate, breached] = await Promise.all([
		estimatePassword(password, passwordUserInputs(user)),
		isBreached(password),
	]);

	if (estimate.score < MIN_STRENGTH_SCORE) {
		return estimate.warning ? `${COMMON_PASSWORD_MESSAGE} ${estimate.warning}` : COMMON_PASSWORD_MESSAGE;
	}
	if (breached) return BREACHED_PASSWORD_MESSAGE;

	return null;
}
