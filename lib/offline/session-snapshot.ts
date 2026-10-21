// Who was signed in at the last successful session check. While the server is
// unreachable this lets an officer who was *already* signed in keep working
// from saved data. It is never a credential: the session itself stays in the
// httpOnly cookie, signing in still needs the server, and the snapshot is
// wiped on sign-out and whenever the server says the session is over.
import { idbDelete, idbGet, idbPut } from "./idb";
import { clearSavedResponses } from "./response-cache";

/**
 * How long after the last check the snapshot still counts. This bounds how long
 * a revoked account or permission can go unnoticed on a device that's offline.
 */
export const OFFLINE_SESSION_GRACE_MS = 12 * 60 * 60_000;
/** A check stamped this far in the future means the clock moved; don't trust it. */
const CLOCK_SKEW_MS = 5 * 60_000;
const SNAPSHOT_KEY = "current";
/** Must match PAGE_CACHE in public/sw.js. */
const PAGE_CACHE_PREFIX = "securetanza-pages";

export interface SessionSnapshot<U> {
  user: U;
  verifiedAt: number;
}

interface SnapshotUser {
  id: number;
  permissions: string[];
}

export function isSnapshotUsable(snapshot: SessionSnapshot<SnapshotUser> | null, now: number): boolean {
  if (!snapshot || typeof snapshot.verifiedAt !== "number") return false;
  if (!snapshot.user || !Array.isArray(snapshot.user.permissions) || snapshot.user.permissions.length === 0) return false;
  const age = now - snapshot.verifiedAt;
  return age >= -CLOCK_SKEW_MS && age <= OFFLINE_SESSION_GRACE_MS;
}

/** The server just confirmed `user`. */
export async function rememberVerifiedUser<U extends SnapshotUser>(user: U, now = Date.now()): Promise<void> {
  const previous = await idbGet<SessionSnapshot<U>>("session", SNAPSHOT_KEY);
  // Another account's copies must never show up for this one.
  if (previous && previous.user?.id !== user.id) await clearOfflineData();
  await idbPut("session", { user, verifiedAt: now } satisfies SessionSnapshot<U>, SNAPSHOT_KEY);
}

/** The signed-in user to carry on with while offline, if the last check is recent enough. */
export async function loadOfflineSession<U extends SnapshotUser>(now = Date.now()): Promise<SessionSnapshot<U> | null> {
  const snapshot = await idbGet<SessionSnapshot<U>>("session", SNAPSHOT_KEY);
  return snapshot && isSnapshotUsable(snapshot, now) ? snapshot : null;
}

/** Everything this device kept for offline use: the snapshot, saved data and saved pages. */
export async function clearOfflineData(): Promise<void> {
  await Promise.all([
    idbDelete("session", SNAPSHOT_KEY),
    clearSavedResponses(),
    (async () => {
      if (typeof caches === "undefined") return;
      const names = await caches.keys();
      await Promise.all(names.filter((name) => name.startsWith(PAGE_CACHE_PREFIX)).map((name) => caches.delete(name)));
    })().catch(() => {}),
  ]);
}
