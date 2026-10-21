// SecureTanza service worker: keeps the app opening when this device loses its
// connection. It keeps the app shell only — built JS/CSS, static files, pages
// already opened here, and map tiles already viewed. Data (/api/*) is never
// cached here: the page keeps those copies in IndexedDB (lib/offline) so it can
// show how old they are, and wipes them on sign-out.

const VERSION = "v1";
const STATIC_CACHE = `securetanza-static-${VERSION}`;
// The "securetanza-pages" prefix is what lib/offline/session-snapshot.ts clears on sign-out.
const PAGE_CACHE = `securetanza-pages-${VERSION}`;
const TILE_CACHE = `securetanza-tiles-${VERSION}`;
const OFFLINE_PAGE = "/offline.html";
const PRECACHE = [OFFLINE_PAGE, "/tanza_cavite.geojson"];

// Oldest entries go first once a cache passes its limit.
const LIMITS = { [STATIC_CACHE]: 600, [PAGE_CACHE]: 60, [TILE_CACHE]: 3000 };
const TRIM_EVERY_MS = 30_000;
const lastTrim = new Map();

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const current = new Set([STATIC_CACHE, PAGE_CACHE, TILE_CACHE]);
    for (const name of await caches.keys()) {
      if (name.startsWith("securetanza-") && !current.has(name)) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // a/b/c.tile.openstreetmap.org serve the same tile, so they share one entry.
  if (url.hostname === "tile.openstreetmap.org" || url.hostname.endsWith(".tile.openstreetmap.org")) {
    event.respondWith(tile(request, `https://tile.openstreetmap.org${url.pathname}`));
    return;
  }
  if (url.origin !== self.location.origin) return;
  // Data is the page's job (see above).
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    event.respondWith(page(request, url));
    return;
  }
  // React Server Component payloads. When one fails, Next falls back to a full
  // navigation to the same URL, which page() then serves from the cache.
  if (request.headers.has("RSC") || url.searchParams.has("_rsc")) return;
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (url.pathname.startsWith("/_next/")) return;
  // Files in public/ (GeoJSON, logos, pdf.js worker and fonts, icons).
  if (/\.[a-z0-9]+$/i.test(url.pathname)) event.respondWith(staleWhileRevalidate(event, request));
});

/** Pages: always the network when it answers; the last copy (or the offline page) when not. */
async function page(request, url) {
  const key = url.origin + url.pathname;
  try {
    const response = await fetch(request);
    // Only real pages: never a redirect to /login, an error, or a cross-origin answer.
    if (response.status === 200 && response.type === "basic" && !response.redirected && isHtml(response)) {
      const cache = await caches.open(PAGE_CACHE);
      await cache.put(key, response.clone());
      trim(PAGE_CACHE);
    } else if (response.status >= 500) {
      // The server (or a proxy in front of it) is down: the last copy beats an error page.
      return (await caches.match(key, { cacheName: PAGE_CACHE })) || response;
    }
    return response;
  } catch {
    return (await caches.match(key, { cacheName: PAGE_CACHE })) || (await caches.match(OFFLINE_PAGE)) || Response.error();
  }
}

/** Hashed build output never changes, so a saved copy is always right. */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.status === 200 && response.type === "basic") {
    const cache = await caches.open(STATIC_CACHE);
    await cache.put(request, response.clone());
    trim(STATIC_CACHE);
  }
  return response;
}

async function staleWhileRevalidate(event, request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request).then(async (response) => {
    if (response.status === 200 && response.type === "basic") {
      await cache.put(request, response.clone());
      trim(STATIC_CACHE);
    }
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
}

/**
 * Tiles: fetched exactly as Leaflet would, with a copy kept of each one viewed
 * so the basemap still draws offline. Nothing is downloaded ahead of time —
 * OpenStreetMap's tile policy forbids bulk prefetching.
 */
async function tile(request, key) {
  const cache = await caches.open(TILE_CACHE);
  try {
    const response = await fetch(request);
    // Needs crossOrigin on the TileLayer: opaque responses can't be checked and
    // count as megabytes each against the storage quota.
    if (response.status === 200 && response.type === "cors") {
      await cache.put(key, response.clone());
      trim(TILE_CACHE);
    }
    return response;
  } catch {
    return (await cache.match(key)) || Response.error();
  }
}

function isHtml(response) {
  return (response.headers.get("Content-Type") || "").includes("text/html");
}

async function trim(name) {
  const now = Date.now();
  if (now - (lastTrim.get(name) || 0) < TRIM_EVERY_MS) return;
  lastTrim.set(name, now);
  try {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    const excess = keys.length - LIMITS[name];
    for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
  } catch {}
}
