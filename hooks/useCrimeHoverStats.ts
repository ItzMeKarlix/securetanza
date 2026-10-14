"use client";

import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { buildMapQueries, mergeMapStats } from "./map-query";
import { useMapStatistics } from "./useMapStatistics";

export function useCrimeHoverStats(barangayName: string | null) {
  const scope = useMapContext();
  const dateRanges = useTimeRangeData();
  const queries = buildMapQueries(scope, dateRanges, "stats", barangayName);
  const { results, loading } = useMapStatistics("stats", queries, Boolean(barangayName), 150);
  return { stats: results ? mergeMapStats(results) : null, loading };
}
