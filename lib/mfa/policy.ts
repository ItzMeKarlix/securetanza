/**
 * Pure 2FA policy helpers (no database access), shared by the server modules
 * and unit-testable on their own.
 */
import { randomInt } from "crypto";

export const BACKUP_CODE_COUNT = 10;
// No 0/O/1/I/L: codes get read off paper.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function newBackupCode() {
	let s = "";
	for (let i = 0; i < 8; i++) s += ALPHABET[randomInt(ALPHABET.length)];
	return `${s.slice(0, 4)}-${s.slice(4)}`;
}

export function normalizeBackupCode(input: string) {
	const clean = input.toUpperCase().replace(/[^0-9A-Z]/g, "");
	return clean.length === 8 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : null;
}

const days = (value: string | undefined, fallback: number) => {
	const n = Number(value);
	return Number.isFinite(n) && n > 0 && n <= 365 ? n : fallback;
};

/** Administrators get a shorter window: their accounts can do more damage. */
export function trustDays(isAdmin: boolean) {
	return isAdmin ? days(process.env.MFA_TRUST_DAYS_ADMIN, 30) : days(process.env.MFA_TRUST_DAYS_STAFF, 60);
}

/** "Chrome on Windows" — enough for someone to recognise their own browser in a list. */
export function deviceLabel(userAgent: string | null) {
	const ua = userAgent ?? "";
	const browser = /Edg\//.test(ua)
		? "Edge"
		: /OPR\//.test(ua)
		? "Opera"
		: /Firefox\//.test(ua)
		? "Firefox"
		: /Chrome\//.test(ua)
		? "Chrome"
		: /Safari\//.test(ua)
		? "Safari"
		: "Browser";
	const os = /Windows/.test(ua)
		? "Windows"
		: /Android/.test(ua)
		? "Android"
		: /iPhone|iPad|iPod/.test(ua)
		? "iOS"
		: /Mac OS X/.test(ua)
		? "macOS"
		: /Linux/.test(ua)
		? "Linux"
		: "unknown device";
	return `${browser} on ${os}`;
}
