/** Client-safe email helpers shared by the forms and the API. */

/** Lowercase + trim: the only form an address is stored or looked up in. */
export function normalizeEmail(value: string): string {
	return value.trim().toLowerCase();
}

/** Deliberately simple: one @, something on each side, a dot in the domain, no spaces. */
export function isValidEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
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
