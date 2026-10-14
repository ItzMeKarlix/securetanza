import { useState, useEffect } from "react";
import { fetchCrimes, fetchCrimeStats, type CrimeIncident } from "@/lib/api";
import { useMapContext } from "@/context/MapContext";
import { toIncidentTypeParam } from "@/lib/crime-groups";
import { calculateDynamicThresholds } from "@/lib/geo-threat";
import { useTimeRangeData } from "./useTimeRangeData";
import { uniqueIncidentRecords } from "@/lib/offense-classification";

interface CrimeByType {
  type: string;
  count: number;
}

interface CrimeByMonth {
  month: number;
  count: number;
}

interface CrimeByBarangay {
  barangay: string;
  count: number;
}

interface TimePatterns {
  hourlyDistribution: number[];
  peakHour: number;
}

interface Trends {
  monthlyChange: number;
  resolutionRate: number;
  safetyIndex: number;
  trendLevel: "secure" | "low" | "moderate" | "high" | "critical";
  trendDirection: "improved" | "worsened" | "stable";
  currentThreatLevel: "secure" | "low" | "moderate" | "high" | "critical";
  previousThreatLevel: "secure" | "low" | "moderate" | "high" | "critical";
  currentQuarterCrimes: number;
  previousQuarterCrimes: number;
  currentQuarterLabel: string;
  previousQuarterLabel: string;
}

interface AnalyticsData {
  totalIncidents: number;
  totalOffenses: number;
  crimesByType: CrimeByType[];
  crimesByMonth: CrimeByMonth[];
  crimesByBarangay: CrimeByBarangay[];
  timePatterns: TimePatterns;
  trends: Trends;
  /** The raw incidents behind the aggregates above. They're fetched anyway to
   *  compute hourlyDistribution and the quarter counts, so exposing them lets
   *  the Analytics page drill from a bar into the specific incidents without a
   *  second round trip. Note these are subject to fetchCrimes' row limit, so
   *  this array can be shorter than a server-computed total. */
  allCrimes: CrimeIncident[];
  loading: boolean;
  detailsLoading: boolean;
  error: string | null;
}

export function useAnalyticsData(barangayName?: string): AnalyticsData {
  const { timeRange, selectedCrimeType, selectedFelonyStage } = useMapContext();
  const dateRanges = useTimeRangeData();
  const [data, setData] = useState<AnalyticsData>({
    totalIncidents: 0,
    totalOffenses: 0,
    crimesByType: [],
    crimesByMonth: [],
    crimesByBarangay: [],
    timePatterns: {
      hourlyDistribution: Array(24).fill(0),
      peakHour: 0,
    },
    trends: {
      monthlyChange: 0,
      resolutionRate: 0,
      safetyIndex: 0,
      trendLevel: "secure",
      trendDirection: "stable",
      currentThreatLevel: "secure",
      previousThreatLevel: "secure",
      currentQuarterCrimes: 0,
      previousQuarterCrimes: 0,
      currentQuarterLabel: "",
      previousQuarterLabel: "",
    },
    allCrimes: [],
    loading: true,
    detailsLoading: true,
    error: null,
  });

  useEffect(() => {
    // Don't fetch until time range has selections
    if (dateRanges.length === 0) {
      return;
    }

    let active = true;

    async function loadAnalyticsData() {
      try {
        setData((prev) => ({
          ...prev,
          loading: true,
          detailsLoading: true,
          allCrimes: [],
          error: null,
        }));

        // Fetch data for all date ranges in parallel
        const requests = dateRanges.map(({ start, end }) => {
          const offenseCategory = selectedCrimeType
            ? toIncidentTypeParam(selectedCrimeType)
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

          return {
            stats: fetchCrimeStats(statsParams),
            crimes: fetchCrimes({
              view: "analysis",
              barangay: statsParams?.barangay,
              startDateCommitted: start.toISOString(),
              endDateCommitted: end.toISOString(),
              offenseCategory,
              stageOfFelony: selectedFelonyStage ?? undefined,
            }),
          };
        });

        const results = await Promise.all(
          requests.map(async (request) => ({
            stats: await request.stats,
            crimes: [] as CrimeIncident[],
          })),
        );
        if (results.some((result) => !result.stats))
          throw new Error("Unable to load crime statistics. Please refresh.");
        if (!active) return;

        // Aggregate all results
        let allCrimes: any[] = [];
        const aggregatedStats = {
          totalIncidents: 0,
          totalOffenses: 0,
          crimesByType: new Map<string, number>(),
          crimesByMonth: Array(12).fill(0),
          crimesByBarangay: new Map<string, number>(),
        };

        results.forEach(({ stats, crimes }) => {
          if (stats) {
            aggregatedStats.totalIncidents += stats.totalIncidents;
            aggregatedStats.totalOffenses += stats.totalOffenses;
            // Aggregate crimes by type
            stats.crimesByType.forEach((item: any) => {
              const current = aggregatedStats.crimesByType.get(item.type) || 0;
              aggregatedStats.crimesByType.set(item.type, current + item.count);
            });

            // Aggregate monthly activity
            stats.activity.forEach((count: number, index: number) => {
              aggregatedStats.crimesByMonth[index] += count;
            });

            // Aggregate crimes by barangay
            stats.crimesByBarangay.forEach((item: any) => {
              const current =
                aggregatedStats.crimesByBarangay.get(item.barangay) || 0;
              aggregatedStats.crimesByBarangay.set(
                item.barangay,
                current + item.count,
              );
            });
          }

          allCrimes = allCrimes.concat(crimes);
        });

        // Convert aggregated maps to arrays
        const stats = {
          crimesByType: Array.from(aggregatedStats.crimesByType.entries()).map(
            ([type, count]) => ({ type, count }),
          ),
          activity: aggregatedStats.crimesByMonth,
          crimesByBarangay: Array.from(
            aggregatedStats.crimesByBarangay.entries(),
          ).map(([barangay, count]) => ({ barangay, count })),
        };

        // Statistics are ready before the larger drill-down dataset.
        setData((prev) => ({
          ...prev,
          totalIncidents: aggregatedStats.totalIncidents,
          totalOffenses: aggregatedStats.totalOffenses,
          crimesByType: stats.crimesByType,
          crimesByMonth: stats.activity.map((count, index) => ({
            month: index + 1,
            count,
          })),
          crimesByBarangay: stats.crimesByBarangay,
          loading: false,
          detailsLoading: true,
        }));
        allCrimes = (
          await Promise.all(requests.map((request) => request.crimes))
        ).flat();
        if (!active) return;
        if (!allCrimes.length && aggregatedStats.totalOffenses > 0)
          throw new Error("Unable to load case records. Please refresh.");

        const offenseRecords = Array.from(
          new Map(allCrimes.map((r: CrimeIncident) => [r.id, r])).values(),
        ) as CrimeIncident[];
        const crimes = uniqueIncidentRecords(
          offenseRecords.filter((r) => r.isCrime),
        );

        if (!stats) {
          throw new Error("Failed to fetch statistics");
        }

        // Process hourly distribution from timeCommitted field (not dateCommitted)
        const hourlyDistribution = Array(24).fill(0);
        crimes.forEach((crime) => {
          // Extract hour from timeCommitted string (format: "HH:MM:SS" or "HH:MM")
          if (crime.timeCommitted) {
            const timeParts = crime.timeCommitted.split(":");
            const hour = parseInt(timeParts[0], 10);
            if (!isNaN(hour) && hour >= 0 && hour < 24) {
              hourlyDistribution[hour]++;
            }
          }
        });

        const peakHour = hourlyDistribution.indexOf(
          Math.max(...hourlyDistribution),
        );

        // Threat level thresholds, scaled to the data being viewed. Fixed cut-offs
        // (2/5/10/15) rated any quarter above 15 incidents "critical" no matter how
        // busy the area normally is, so they're taken from the quartiles of the
        // quarterly counts in the selection instead — same approach the map uses for
        // barangays (see calculateDynamicThresholds in lib/geo-threat.ts).
        const quarterCounts = new Map<number, number>();
        crimes.forEach((crime) => {
          const d = new Date(crime.dateCommitted);
          const key = d.getFullYear() * 10 + Math.floor(d.getMonth() / 3);
          quarterCounts.set(key, (quarterCounts.get(key) ?? 0) + 1);
        });
        const THREAT_THRESHOLDS = calculateDynamicThresholds(
          Array.from(quarterCounts.values()),
        );

        // Helper function to get threat level from crime count
        const getThreatLevel = (
          count: number,
        ): "secure" | "low" | "moderate" | "high" | "critical" => {
          if (count === 0) return "secure";
          if (count <= THREAT_THRESHOLDS.low) return "low";
          if (count <= THREAT_THRESHOLDS.moderate) return "moderate";
          if (count <= THREAT_THRESHOLDS.high) return "high";
          return "critical";
        };

        // Helper function to get quarter info
        const getQuarterInfo = (date: Date) => {
          const year = date.getFullYear();
          const month = date.getMonth(); // 0-11
          const quarter = Math.floor(month / 3) + 1; // 1-4

          // Calculate quarter start and end dates
          const quarterStartMonth = (quarter - 1) * 3;
          const quarterStart = new Date(year, quarterStartMonth, 1);
          const quarterEnd = new Date(
            year,
            quarterStartMonth + 3,
            0,
            23,
            59,
            59,
            999,
          );

          const quarterLabel = `Q${quarter} ${year}`;

          return { quarter, year, quarterStart, quarterEnd, quarterLabel };
        };

        // Calculate quarterly trend: Current quarter vs Previous quarter
        const now = new Date();
        const currentQuarter = getQuarterInfo(now);

        // Get previous quarter
        const previousQuarterDate = new Date(now);
        previousQuarterDate.setMonth(previousQuarterDate.getMonth() - 3);
        const previousQuarter = getQuarterInfo(previousQuarterDate);

        // Filter crimes by quarters
        const currentQuarterCrimes = crimes.filter((crime) => {
          const crimeDate = new Date(crime.dateCommitted);
          return (
            crimeDate >= currentQuarter.quarterStart &&
            crimeDate <= currentQuarter.quarterEnd
          );
        }).length;

        const previousQuarterCrimes = crimes.filter((crime) => {
          const crimeDate = new Date(crime.dateCommitted);
          return (
            crimeDate >= previousQuarter.quarterStart &&
            crimeDate <= previousQuarter.quarterEnd
          );
        }).length;

        // Calculate percentage change with capping to avoid extreme values
        let quarterlyTrend = 0;
        if (previousQuarterCrimes > 0) {
          quarterlyTrend = Math.round(
            ((currentQuarterCrimes - previousQuarterCrimes) /
              previousQuarterCrimes) *
              100,
          );
          // Cap the percentage at -90% and +90% to avoid -100% or +100%
          quarterlyTrend = Math.max(-90, Math.min(90, quarterlyTrend));
        } else if (currentQuarterCrimes > 0) {
          // When going from 0 to some crimes, cap at +90%
          quarterlyTrend = 90;
        }

        // Calculate threat levels for current and previous quarters
        const currentThreatLevel = getThreatLevel(currentQuarterCrimes);
        const previousThreatLevel = getThreatLevel(previousQuarterCrimes);

        // Determine trend direction based on crime count changes
        let trendDirection: "improved" | "worsened" | "stable" = "stable";
        if (currentQuarterCrimes < previousQuarterCrimes) {
          trendDirection = "improved"; // Crime decreased
        } else if (currentQuarterCrimes > previousQuarterCrimes) {
          trendDirection = "worsened"; // Crime increased
        }

        // Calculate resolution rate based on caseStatus (Cleared only)
        const clearedCrimes = crimes.filter((crime) => {
          if (crime.incidentCleared !== undefined) return crime.incidentCleared;
          if (!crime.caseStatus) return false;
          const statusLower = crime.caseStatus.toLowerCase();
          return statusLower.includes("cleared");
        }).length;

        const resolutionRate =
          crimes.length > 0
            ? Math.round((clearedCrimes / crimes.length) * 100)
            : 0;

        // Calculate safety index (Cleared + Solved)
        const clearedAndSolvedCrimes = crimes.filter((crime) => {
          if (crime.incidentResolved !== undefined)
            return crime.incidentResolved;
          if (!crime.caseStatus) return false;
          const statusLower = crime.caseStatus.toLowerCase();
          return (
            statusLower.includes("cleared") || statusLower.includes("solved")
          );
        }).length;

        const safetyIndex =
          crimes.length > 0
            ? Math.round((clearedAndSolvedCrimes / crimes.length) * 100)
            : 0;

        // Process monthly data using stats.activity to match the Overview tab
        const monthlyData = stats.activity.map((count, i) => ({
          month: i + 1,
          count,
        }));

        setData({
          totalIncidents: aggregatedStats.totalIncidents,
          totalOffenses: aggregatedStats.totalOffenses,
          crimesByType: stats.crimesByType,
          crimesByMonth: monthlyData,
          crimesByBarangay: stats.crimesByBarangay,
          timePatterns: {
            hourlyDistribution,
            peakHour,
          },
          trends: {
            monthlyChange: quarterlyTrend,
            resolutionRate,
            safetyIndex,
            trendLevel: currentThreatLevel,
            trendDirection,
            currentThreatLevel,
            previousThreatLevel,
            currentQuarterCrimes,
            previousQuarterCrimes,
            currentQuarterLabel: currentQuarter.quarterLabel,
            previousQuarterLabel: previousQuarter.quarterLabel,
          },
          allCrimes: offenseRecords.filter((r) => r.isCrime),
          loading: false,
          detailsLoading: false,
          error: null,
        });
      } catch (error) {
        if (!active) return;
        console.error("Error loading analytics data:", error);

        setData((prev) => ({
          ...prev,
          loading: false,
          detailsLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load analytics data",
        }));
      }
    }

    loadAnalyticsData();
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
