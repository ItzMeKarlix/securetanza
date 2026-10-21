# Offline mode

The app and its database (Supabase Cloud) both need the internet. When an
officer's laptop loses its network, or the station loses internet, the browser
can't reach the server at all. Offline mode keeps a signed-in officer working
from what this device already saw, and says so on screen.

## What works offline

| Works | Doesn't |
|---|---|
| Pages already opened on this device (map, dashboards, analytics…) | Pages never opened here: the device shows `public/offline.html` |
| Crime/barangay figures already viewed with the same filters, labelled "Showing data saved 8:24 AM" | Filter combinations never viewed here (that panel shows its usual load error) |
| Map tiles already viewed | Signing in. It always needs the server. |
| Idle logout | Uploads, record edits, user/permission changes, backups, MFA, password changes |

When the connection comes back, the banner switches to "Back online — Refresh",
because figures already on screen stay as they were until refreshed.

## How it fits together

- **`public/sw.js`** (service worker, production builds only) keeps the app
  shell: hashed build files, `public/` files, pages opened here, and tiles
  viewed here. It never caches `/api/*`.
- **`lib/read-json.ts` + `lib/offline/response-cache.ts`** keep the last good
  answer for `/api/crimes*` and `/api/barangays` in IndexedDB. A saved copy is
  only used when the request fails (no connection or a 5xx), and each use is
  reported to the banner. Account, audit and admin endpoints are never saved.
- **`lib/offline/session-snapshot.ts`** keeps who was signed in at the last
  successful session check. If the server can't be reached, `AuthContext`
  continues with that user, but only within the grace window.
  The session itself stays in the httpOnly cookie.
- **`components/layout/offline-banner.tsx`** shows the connection state and how
  old the saved figures are.

## Security rules

- Only someone who was already signed in can continue offline. No password or
  token is stored for offline use.
- **Grace window: `OFFLINE_SESSION_GRACE_MS` (12 h).** After this long without
  reaching the server, the session ends with "couldn't reach the server for 12
  hours". This is the longest a revoked account or permission can go
  unnoticed on an offline device.
- **Saved data max age: `OFFLINE_DATA_MAX_AGE_MS` (7 days).**
- Sign-out (manual, idle, tab rule, grace expiry) or the server saying the
  session is over wipes the snapshot, saved data and saved pages. A different
  account signing in on the same browser wipes the previous account's copies.
  Cached build files and map tiles are kept; they hold no case data.
- The existing tab rule still applies: opening the app in a new tab ends the
  session, even offline.

## Testing it

The worker only registers in production builds (`next build && next start`);
under `next dev` it unregisters itself. In Chrome DevTools: open a few pages
online, then Application → Service workers → Offline (or Network → Offline)
and reload.

To ship a change to the worker's caching rules, bump `VERSION` in
`public/sw.js`. Old caches are deleted when the new worker activates.
