/**
 * Absolute links for emails. Always built from APP_BASE_URL, never from the
 * request's Host header — otherwise a forged Host could make a reset email
 * point at an attacker's site.
 */
export function appUrl(path: string): string {
	const base = process.env.APP_BASE_URL || (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");
	if (!base) throw new Error("APP_BASE_URL must be set in production to build email links.");
	return new URL(path, base.endsWith("/") ? base : `${base}/`).toString();
}
