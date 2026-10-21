import { readSavedResponse, saveResponse } from "./offline/response-cache";

// Share concurrent GETs, without retaining settled data across edits or imports.
// The offline copy is a separate, last-resort answer: it's only read when the
// server can't be reached, never in place of a live response.
const inFlight = new Map<string, Promise<unknown>>();

/**
 * Gateway answers meaning the server itself isn't there right now. A 500 is not
 * one of them: it is a bug in a request the server did receive, and has to
 * surface as an error instead of being papered over with old figures.
 */
const UNREACHABLE = new Set([502, 503, 504]);

export function readJson<T>(url: string): Promise<T> {
  const parsed = new URL(url, "http://local");
  parsed.searchParams.sort();
  const key = parsed.pathname + parsed.search;
  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;
  const request = (async () => {
    let response: Response;
    try {
      response = await fetch(key, { cache: "no-store" });
    } catch (error) {
      // No connection (or DNS / TLS failure): the saved copy, if there is one.
      const saved = await readSavedResponse<T>(key);
      if (saved !== null) return saved;
      throw error;
    }
    if (!response.ok) {
      const saved = UNREACHABLE.has(response.status) ? await readSavedResponse<T>(key) : null;
      if (saved !== null) return saved;
      throw new Error(`Request failed (${response.status})`);
    }
    const body = (await response.json()) as T;
    void saveResponse(key, body).catch(() => {});
    return body;
  })();
  inFlight.set(key, request);
  void request
    .finally(() => {
      if (inFlight.get(key) === request) inFlight.delete(key);
    })
    .catch(() => {});
  return request;
}
