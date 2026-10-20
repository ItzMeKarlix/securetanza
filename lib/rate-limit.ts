import { cacheService } from "@/backend/cache";

/**
 * Fixed-window counter in the app cache. Per instance only — good enough to
 * blunt scripted abuse of public auth endpoints; per-account limits that must
 * hold across instances are enforced in the database instead.
 *
 * Returns true when the call is allowed.
 */
export async function allowRequest(key: string, limit: number, windowSeconds: number): Promise<boolean> {
	const cacheKey = `app:ratelimit:${key}`;
	const now = Date.now();
	const entry = await cacheService.get<{ count: number; resetAt: number }>(cacheKey);

	if (!entry || entry.resetAt <= now) {
		await cacheService.set(cacheKey, { count: 1, resetAt: now + windowSeconds * 1000 }, windowSeconds);
		return true;
	}
	if (entry.count >= limit) return false;

	const remaining = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
	await cacheService.set(cacheKey, { count: entry.count + 1, resetAt: entry.resetAt }, remaining);
	return true;
}
