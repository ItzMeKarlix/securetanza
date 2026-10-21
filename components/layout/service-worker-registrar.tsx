"use client";

import { useEffect } from "react";

/**
 * Installs public/sw.js, which keeps the app shell, opened pages and viewed map
 * tiles for offline use. Production only: under `next dev` a caching worker
 * would fight hot reload, so any left over from a production build is removed.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => registrations.forEach((registration) => registration.unregister()))
        .catch(() => {});
      return;
    }
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch((error) => {
      console.error("Offline support unavailable:", error);
    });
  }, []);
  return null;
}
