"use client";

import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { buildMapQueries, mergeBarangayCounts } from "./map-query";
import { useMapStatistics } from "./useMapStatistics";

export interface BarangayCrimeTypeCounts { [barangay: string]: number }

export function useCrimeTypeByBarangay() {
  const scope = useMapContext();
  const dateRanges = useTimeRangeData();
  const queries = buildMapQueries(scope, dateRanges, "barangay-counts");
  const { results, loading, hasLoaded } = useMapStatistics("barangay-counts", queries, Boolean(scope.selectedCrimeType));
  return {
    /** Offenses of the selected crime type, per barangay. */
    crimeTypeCounts: results ? mergeBarangayCounts(results) : {},
    loading,
    hasLoaded,
  };
}
