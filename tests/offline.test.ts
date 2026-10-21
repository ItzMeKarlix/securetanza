import { test } from "node:test";
import assert from "node:assert/strict";
import { OFFLINE_SESSION_GRACE_MS, isSnapshotUsable } from "../lib/offline/session-snapshot";
import { OFFLINE_DATA_MAX_AGE_MS, isCacheableRequest, isUsableCopy, readSavedResponse, saveResponse } from "../lib/offline/response-cache";
import { getOfflineStatus, isOffline, reportFreshData, reportServerReachable, reportStaleData } from "../lib/offline/status";
import { readJson } from "../lib/read-json";

const user = { id: 7, permissions: ["operational_officer"] };

test("a signed-in snapshot carries an offline session only within the grace window", () => {
  const now = 1_000_000_000_000;
  assert.equal(isSnapshotUsable({ user, verifiedAt: now - 60_000 }, now), true);
  assert.equal(isSnapshotUsable({ user, verifiedAt: now - OFFLINE_SESSION_GRACE_MS }, now), true);
  assert.equal(isSnapshotUsable({ user, verifiedAt: now - OFFLINE_SESSION_GRACE_MS - 1 }, now), false);
  assert.equal(isSnapshotUsable(null, now), false);
});

test("a snapshot is refused when the clock jumped back or permissions are gone", () => {
  const now = 1_000_000_000_000;
  assert.equal(isSnapshotUsable({ user, verifiedAt: now + 60 * 60_000 }, now), false, "checked an hour in the future");
  assert.equal(isSnapshotUsable({ user: { id: 7, permissions: [] }, verifiedAt: now }, now), false);
  assert.equal(isSnapshotUsable({ user: undefined as never, verifiedAt: now }, now), false);
});

test("only crime and barangay reads are kept for offline use", () => {
  for (const key of ["/api/crimes?year=2026", "/api/crimes/stats?year=2026", "/api/crimes/barangay-counts", "/api/crimes/years", "/api/barangays"]) {
    assert.equal(isCacheableRequest(key), true, key);
  }
  for (const key of ["/api/auth/session", "/api/users", "/api/audit-logs", "/api/backups", "/api/crimesX", "/api/import-logs"]) {
    assert.equal(isCacheableRequest(key), false, key);
  }
});

test("saved copies older than the data limit are not shown", () => {
  const now = 1_000_000_000_000;
  assert.equal(isUsableCopy(now - OFFLINE_DATA_MAX_AGE_MS, now), true);
  assert.equal(isUsableCopy(now - OFFLINE_DATA_MAX_AGE_MS - 1, now), false);
});

test("the offline status tracks the oldest saved copy on screen until each is refreshed", () => {
  reportStaleData("/api/crimes?year=2025", 200);
  reportStaleData("/api/crimes?year=2026", 100);
  assert.equal(getOfflineStatus().staleSince, 100);
  reportFreshData("/api/crimes?year=2026");
  assert.equal(getOfflineStatus().staleSince, 200);
  reportFreshData("/api/crimes?year=2025");
  assert.equal(getOfflineStatus().staleSince, null);

  reportServerReachable(false);
  assert.equal(isOffline(), true);
  reportServerReachable(true);
  assert.equal(isOffline(), false);
});

test("without IndexedDB, saving is a no-op and nothing is read back", async () => {
  await saveResponse("/api/crimes?year=2026", { success: true, data: [] });
  assert.equal(await readSavedResponse("/api/crimes?year=2026"), null);
});

test("readJson still reports a dropped connection when there's no saved copy", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => { throw new TypeError("Failed to fetch"); }) as unknown as typeof fetch;
  try {
    await assert.rejects(readJson("/api/crimes/years?offline-test=1"), { name: "TypeError" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("readJson passes a 4xx through instead of bridging it with a saved copy", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response("{}", { status: 403 })) as unknown as typeof fetch;
  try {
    await assert.rejects(readJson("/api/crimes/years?offline-test=2"), /Request failed \(403\)/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("the banner only says 'Back online' after the connection was actually lost", async () => {
  const status = await import("../lib/offline/status");
  // Earlier tests in this file already took the server offline once.
  assert.equal(status.getOfflineStatus().wentOffline, true);
});

test("an application error (500) is reported, never answered with old figures", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => Response.json({ success: false }, { status: 500 })) as unknown as typeof fetch;
  try {
    await assert.rejects(readJson("/api/crimes?offline-test=500"), /Request failed \(500\)/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
