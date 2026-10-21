import { readSavedResponse, saveResponse } from "./offline/response-cache";

// Share concurrent GETs, without retaining settled data across edits or imports.
// The offline copy is a separate, last-resort answer: it's only read when the
// server can't be reached or fails, never in place of a live response.
const inFlight = new Map<string, Promise<unknown>>();

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
      // A 5xx (the database or a proxy in between is down) is also worth
      // bridging; a 4xx is a real answer about this request and is passed on.
      const saved = response.status >= 500 ? await readSavedResponse<T>(key) : null;
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
