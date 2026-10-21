// What the app knows about its connection, shared by the auth layer (which
// learns the server is unreachable), the data layer (which falls back to saved
// copies) and the offline banner (which says so).
import { useSyncExternalStore } from "react";

export interface OfflineStatus {
  /** navigator.onLine — false when this device has no network at all. */
  browserOnline: boolean;
  /** False while the session check can't reach the server (e.g. the station's internet is down). */
  serverReachable: boolean;
  /** Oldest saved copy currently on screen, or null when everything shown is live. */
  staleSince: number | null;
  /** This page lost its connection at some point (so "Back online" is true). */
  wentOffline: boolean;
}

const ONLINE: OfflineStatus = { browserOnline: true, serverReachable: true, staleSince: null, wentOffline: false };

let status: OfflineStatus = ONLINE;
/** URL → when the copy being shown for it was saved. */
const staleKeys = new Map<string, number>();
const listeners = new Set<() => void>();
let watchingBrowser = false;

function update(next: Partial<OfflineStatus>) {
  const merged = { ...status, ...next };
  if (!merged.browserOnline || !merged.serverReachable) merged.wentOffline = true;
  if (
    merged.browserOnline === status.browserOnline &&
    merged.serverReachable === status.serverReachable &&
    merged.staleSince === status.staleSince &&
    merged.wentOffline === status.wentOffline
  ) return;
  status = merged;
  listeners.forEach((listener) => listener());
}

function updateStaleSince() {
  update({ staleSince: staleKeys.size ? Math.min(...staleKeys.values()) : null });
}

function watchBrowser() {
  if (watchingBrowser || typeof window === "undefined") return;
  watchingBrowser = true;
  const sync = () => update({ browserOnline: navigator.onLine });
  window.addEventListener("online", sync);
  window.addEventListener("offline", sync);
  sync();
}

export function isOffline(s: OfflineStatus = status): boolean {
  return !s.browserOnline || !s.serverReachable;
}

export function reportServerReachable(reachable: boolean) {
  update({ serverReachable: reachable });
}

/** A request for `key` was answered from the copy saved at `savedAt`. */
export function reportStaleData(key: string, savedAt: number) {
  staleKeys.set(key, savedAt);
  updateStaleSince();
}

/** A request for `key` was answered live, so any old copy of it is off screen. */
export function reportFreshData(key: string) {
  if (staleKeys.delete(key)) updateStaleSince();
}

export function getOfflineStatus(): OfflineStatus {
  return status;
}

function subscribe(listener: () => void) {
  watchBrowser();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useOfflineStatus(): OfflineStatus & { offline: boolean } {
  const current = useSyncExternalStore(subscribe, getOfflineStatus, () => ONLINE);
  return { ...current, offline: isOffline(current) };
}
