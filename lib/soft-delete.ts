/** Deleted accounts and backups stay restorable this long, then the worker removes them for good. */
export const SOFT_DELETE_RETENTION_DAYS = 30;
const DAY_MS = 24 * 60 * 60_000;

/** Days left before a deleted item becomes eligible for purging (0 once it is; the nightly cleanup removes it). */
export function daysUntilPurge(deletedAt: Date | string, now = Date.now()): number {
	const purgeAt = new Date(deletedAt).getTime() + SOFT_DELETE_RETENTION_DAYS * DAY_MS;
	return Math.max(0, Math.ceil((purgeAt - now) / DAY_MS));
}

export function purgeCutoff(now = Date.now()): Date {
	return new Date(now - SOFT_DELETE_RETENTION_DAYS * DAY_MS);
}
