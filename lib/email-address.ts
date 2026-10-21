/** Client-safe email helpers shared by the forms and the API. */

/** Lowercase + trim: the only form an address is stored or looked up in. */
export function normalizeEmail(value: string): string {
	return value.trim().toLowerCase();
}

/**
 * Practical address check: letters, digits and . _ % + - before the @; a
 * dotted domain of letters, digits and hyphens with a letter-only ending. No
 * spaces, quotes, angle brackets or other characters an attacker could use to
 * smuggle markup into the places an address is shown.
 */
const EMAIL_PATTERN = /^[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

export function isValidEmail(value: string): boolean {
	return value.length <= 254 && value.split("@")[0].length <= 64 && EMAIL_PATTERN.test(value);
}

/**
 * Optional allow-list from ALLOWED_EMAIL_DOMAINS ("pnp.gov.ph,cvsu.edu.ph").
 * Empty or unset allows any domain. Subdomains of a listed domain are allowed.
 * Server-only in practice (reads process.env).
 */
export function isAllowedEmailDomain(email: string): boolean {
	const list = (process.env.ALLOWED_EMAIL_DOMAINS || "")
		.split(",")
		.map((d) => d.trim().toLowerCase())
		.filter(Boolean);
	if (list.length === 0) return true;
	const domain = email.split("@")[1] ?? "";
	return list.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`));
}
