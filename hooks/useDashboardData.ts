import { useState, useEffect } from "react";
import {
  fetchCrimes,
  fetchCrimeStats,
  toOffenseSummary,
} from "@/lib/api";
import type { OffenseSummary } from "@/constants/dummy";
import { useMapContext } from "@/context/MapContext";
import { toCrimeTypeParam } from "@/lib/crime-groups";
import { useTimeRangeData } from "./useTimeRangeData";

interface DashboardData {
  stats: {
    totalOffenses: number;
    activeCases: number;
    resolvedToday: number;
    safetyIndex: string;
    activePatrols: number;
  };
  activity: number[];
  crimesByType: Array<{ type: string; count: number }>;
  /** Offenses per stage of felony (CONSUMMATED, FRUSTRATED, ATTEMPTED, UNKNOWN). */
  crimesByStage: Record<string, number>;
  /** Most recent offenses, newest first. */
  offenses: OffenseSummary[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData(barangayName?: string) {
  const { timeRange, selectedCrimeType, selectedFelonyStage } = useMapContext();
  const dateRanges = useTimeRangeData();
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalOffenses: 0,
      activeCases: 0,
      resolvedToday: 0,
      safetyIndex: "0%",
      activePatrols: 0,
    },
    activity: Array(12).fill(0),
    crimesByType: [],
    crimesByStage: {},
    offenses: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Don't fetch until time range has selections
    if (dateRanges.length === 0) {
      console.log("⏳ Dashboard: Waiting for time range selections...");
      return;
    }

    let active = true;

    async function loadData() {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

        console.log("📊 Loading Dashboard Data:", {
          barangayName,
          timeRange,
          dateRanges: dateRanges.map((r) => ({
            start: r.start.toISOString(),
            end: r.end.toISOString(),
          })),
          timestamp: new Date().toISOString(),
        });

        // Fetch data for all date ranges in parallel
        const fetchPromises = dateRanges.map(async ({ start, end }) => {
          const offenseCategory = selectedCrimeType
            ? toCrimeTypeParam(selectedCrimeType)
            : undefined;
          const statsParams =
            barangayName && barangayName !== "General Dashboard"
              ? {
                  barangay: barangayName,
                  startDate: start.toISOString(),
                  endDate: end.toISOString(),
                  offenseCategory,
                  stageOfFelony: selectedFelonyStage ?? undefined,
                }
              : {
                  startDate: start.toISOString(),
                  endDate: end.toISOString(),
                  offenseCategory,
                  stageOfFelony: selectedFelonyStage ?? undefined,
                };

          const [stats, crimes] = await Promise.all([
            fetchCrimeStats(statsParams),
            fetchCrimes({
              barangay: statsParams?.barangay,
              startDateCommitted: start.toISOString(),
              endDateCommitted: end.toISOString(),
              offenseCategory,
              stageOfFelony: selectedFelonyStage ?? undefined,
              limit: 50,
            }),
          ]);

          return { stats, crimes };
        });

        const results = await Promise.all(fetchPromises);
        if (!active) return;

        // Aggregate all results
        let allCrimes: any[] = [];
        const aggregatedStats = {
          totalOffenses: 0,
          activeCases: 0,
          resolvedToday: 0,
          crimesByType: new Map<string, number>(),
          crimesByStage: {} as Record<string, number>,
          activity: Array(12).fill(0),
        };

        results.forEach(({ stats, crimes }) => {
          if (stats) {
            aggregatedStats.totalOffenses += stats.totalOffenses;
            aggregatedStats.activeCases += stats.activeCases;
            aggregatedStats.resolvedToday += stats.resolvedToday;

            // Aggregate crimes by type
            stats.crimesByType.forEach((item: any) => {
              const current = aggregatedStats.crimesByType.get(item.type) || 0;
              aggregatedStats.crimesByType.set(item.type, current + item.count);
            });

            stats.crimesByStage.forEach(({ stage, count }) => {
              aggregatedStats.crimesByStage[stage] = (aggregatedStats.crimesByStage[stage] ?? 0) + count;
            });

            // Aggregate monthly activity
            stats.activity.forEach((count: number, index: number) => {
              aggregatedStats.activity[index] += count;
            });
          }

          allCrimes = allCrimes.concat(crimes);
        });

        // Calculate safety index from aggregated data
        const safetyIndex =
          aggregatedStats.totalOffenses > 0
            ? `${Math.round(((aggregatedStats.totalOffenses - aggregatedStats.activeCases) / aggregatedStats.totalOffenses) * 100)}%`
            : "100%";

        // The 50 most recent offenses
        const offenses = allCrimes
          .sort(
            (a, b) =>
              new Date(b.dateCommitted).getTime() -
              new Date(a.dateCommitted).getTime(),
          )
          .slice(0, 50)
          .map(toOffenseSummary);

        // Calculate active patrols (mock calculation based on active cases)
        const activePatrols = Math.max(
          1,
          Math.floor(aggregatedStats.activeCases / 10),
        );

        setData({
          stats: {
            totalOffenses: aggregatedStats.totalOffenses,
            activeCases: aggregatedStats.activeCases,
            resolvedToday: aggregatedStats.resolvedToday,
            safetyIndex,
            activePatrols,
          },
          activity: aggregatedStats.activity,
          crimesByType: Array.from(aggregatedStats.crimesByType.entries()).map(
            ([type, count]) => ({ type, count }),
          ),
          crimesByStage: aggregatedStats.crimesByStage,
          offenses,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (!active) return;
        console.error("Error loading dashboard data:", error);

        setData((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Failed to load data",
        }));
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [
    barangayName,
    timeRange,
    dateRanges,
    selectedCrimeType,
    selectedFelonyStage,
  ]);

  return data;
}
