// The last good answer for each crime/barangay read, kept on this device so the
// map and dashboards still show something when the server can't be reached.
// Saved copies are only ever used after a request fails, and every use is
// reported so the UI can say how old the figures are.
import { idbClear, idbGet, idbPruneResponses, idbPut } from "./idb";
import { reportFreshData, reportStaleData } from "./status";

/** Read endpoints worth keeping. Account, audit, backup and admin data never are. */
const CACHEABLE_PATHS = ["/api/crimes", "/api/barangays"];

/** Older copies are dropped rather than shown. Matches the 7-day session length. */
export const OFFLINE_DATA_MAX_AGE_MS = 7 * 24 * 60 * 60_000;
const MAX_ENTRIES = 400;
const PRUNE_EVERY_MS = 60_000;

interface SavedResponse {
  key: string;
  savedAt: number;
  body: unknown;
}

let lastPrune = 0;

export function isCacheableRequest(key: string): boolean {
  const path = key.split("?")[0];
  return CACHEABLE_PATHS.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export function isUsableCopy(savedAt: number, now: number): boolean {
  return now - savedAt <= OFFLINE_DATA_MAX_AGE_MS;
}

export async function saveResponse(key: string, body: unknown, now = Date.now()): Promise<void> {
  if (!isCacheableRequest(key)) return;
  reportFreshData(key);
  // A failed answer isn't worth keeping in place of the last good one.
  if (body && typeof body === "object" && (body as { success?: unknown }).success === false) return;
  await idbPut("responses", { key, savedAt: now, body } satisfies SavedResponse);
  if (now - lastPrune > PRUNE_EVERY_MS) {
    lastPrune = now;
    await idbPruneResponses(now - OFFLINE_DATA_MAX_AGE_MS, MAX_ENTRIES);
  }
}

/** The saved copy for `key`, or null when there is none worth showing. */
export async function readSavedResponse<T>(key: string, now = Date.now()): Promise<T | null> {
  if (!isCacheableRequest(key)) return null;
  const saved = await idbGet<SavedResponse>("responses", key);
  if (!saved || !isUsableCopy(saved.savedAt, now)) return null;
  reportStaleData(key, saved.savedAt);
  return saved.body as T;
}

export async function clearSavedResponses(): Promise<void> {
  await idbClear("responses");
}
