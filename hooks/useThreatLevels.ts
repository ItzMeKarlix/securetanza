import React from 'react'
import { useMapContext } from '@/context/MapContext'
import { useTimeRangeData } from '@/hooks/useTimeRangeData'
import { buildMapQueries, mergeBarangayCounts } from './map-query'
import { useMapStatistics } from './useMapStatistics'
import { calculateDynamicThresholds } from '@/lib/geo-threat'
import { DEFAULT_THREAT_COLORS } from '@/lib/data-colors'

export interface ThreatLevelStats {
  secure: number
  low: number
  moderate: number
  high: number
  critical: number
}

export interface ThreatThresholds {
  low: number
  moderate: number
  high: number
  critical: number
}

// Quartile-based thresholds live in lib/geo-threat.ts so the PDF / image exports use the
// exact same rule as the live map.
export { calculateDynamicThresholds }

export function useThreatLevels() {
  const scope = useMapContext();
  const dateRanges = useTimeRangeData();
  const queries = buildMapQueries(scope, dateRanges, "barangay-counts");
  const { results, loading } = useMapStatistics("barangay-counts", queries);
  const barangayCrimeCounts = React.useMemo(() => results ? mergeBarangayCounts(results) : {}, [results]);
  const thresholds = React.useMemo(() => calculateDynamicThresholds(Object.values(barangayCrimeCounts)), [barangayCrimeCounts]);
  const stats = React.useMemo(() => {
    const tally: ThreatLevelStats = { secure: 0, low: 0, moderate: 0, high: 0, critical: 0 };
    const counts = Object.values(barangayCrimeCounts).filter(count => count > 0);
    counts.forEach(count => { tally[getThreatLevelFromCount(count, thresholds)]++; });
    tally.secure = Math.max(0, 24 - counts.length);
    return tally;
  }, [barangayCrimeCounts, thresholds]);
  return {
    stats, thresholds, barangayCrimeCounts,
    // An empty active day/hour stays empty; it never falls back to period counts.
    filteredBarangayCrimeCounts: scope.isTimeFilterActive ? barangayCrimeCounts : {},
    loading,
  };
}

export function getThreatLevelFromCount(count: number, thresholds: ThreatThresholds): keyof ThreatLevelStats {
  if (count === 0) return 'secure'
  if (count <= thresholds.low) return 'low'
  if (count <= thresholds.moderate) return 'moderate'
  if (count <= thresholds.high) return 'high'
  return 'critical'
}

export const THREAT_COLORS = DEFAULT_THREAT_COLORS;
