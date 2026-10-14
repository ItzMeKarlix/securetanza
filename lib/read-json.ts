// Share concurrent GETs, without retaining settled data across edits or imports.
const inFlight = new Map<string, Promise<unknown>>();

export function readJson<T>(url: string): Promise<T> {
  const parsed = new URL(url, "http://local");
  parsed.searchParams.sort();
  const key = parsed.pathname + parsed.search;
  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;
  const request = (async () => {
    const response = await fetch(key, { cache: "no-store" });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    return response.json() as Promise<T>;
  })();
  inFlight.set(key, request);
  void request
    .finally(() => {
      if (inFlight.get(key) === request) inFlight.delete(key);
    })
    .catch(() => {});
  return request;
}
