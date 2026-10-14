"use client";

import { useEffect, useState } from "react";
import { readMapResponses, type MapStatsResponse } from "./map-query";

/** Results belong to their query key, including the debounce and first render. */
export function useMapStatistics(endpoint: "stats" | "barangay-counts", queries: URLSearchParams[], enabled = true, debounceMs = 0) {
  const key = JSON.stringify(queries.map((query) => query.toString()));
  const [settled, setSettled] = useState<{ key: string; results: MapStatsResponse[] | null } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const params = (JSON.parse(key) as string[]).map((value) => new URLSearchParams(value));
        const results = await readMapResponses(endpoint, params, controller.signal);
        if (!controller.signal.aborted) setSettled({ key, results });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error loading map statistics:", error);
          setSettled({ key, results: null });
        }
      }
    }, debounceMs);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [endpoint, key, enabled, debounceMs]);
  const current = enabled && settled?.key === key;
  return { results: current ? settled.results : null, loading: enabled && !current, hasLoaded: Boolean(current) };
}
