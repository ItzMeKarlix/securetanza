import { toCrimeTypeParam } from "@/lib/crime-groups";
import { readJson } from "@/lib/read-json";
import type { DateRange } from "./useTimeRangeData";

export interface MapQueryScope {
  selectedYear?: number | null;
  selectedCrimeType?: string | null;
  selectedFelonyStage?: string | null;
  isTimeFilterActive?: boolean;
  timeFilterDate?: Date | null;
  timeFilterHour?: number | null;
}

/** Every map count uses the same scope; only the endpoint's date names differ. */
export function buildMapQueries(scope: MapQueryScope, ranges: DateRange[], endpoint: "stats" | "barangay-counts", barangay?: string | null) {
  let dates = ranges;
  const dayScope = scope.isTimeFilterActive && scope.timeFilterDate;
  if (dayScope) {
    const start = new Date(dayScope);
    const end = new Date(dayScope);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    dates = [{ start, end }];
  }
  // Overlapping year/quarter/month selections must not count the same rows twice.
  const merged: DateRange[] = [];
  [...dates].sort((a, b) => +a.start - +b.start).forEach((range) => {
    const last = merged.at(-1);
    if (last && +range.start <= +last.end + 1) {
      if (range.end > last.end) last.end = range.end;
    } else merged.push({ ...range });
  });
  return (merged.length ? merged : [null]).map((range) => {
    const params = new URLSearchParams();
    if (barangay) params.set("barangay", barangay);
    if (scope.selectedCrimeType) params.set("offenseCategory", toCrimeTypeParam(scope.selectedCrimeType));
    if (scope.selectedFelonyStage) params.set("stageOfFelony", scope.selectedFelonyStage);
    if (range) {
      params.set(endpoint === "stats" ? "startDate" : "startDateCommitted", range.start.toISOString());
      params.set(endpoint === "stats" ? "endDate" : "endDateCommitted", range.end.toISOString());
    } else if (scope.selectedYear !== null && scope.selectedYear !== undefined) {
      params.set("year", String(scope.selectedYear));
    }
    if (dayScope && scope.timeFilterHour !== null && scope.timeFilterHour !== undefined) params.set("hour", String(scope.timeFilterHour));
    return params;
  });
}

/** Every count is a count of offenses. */
export interface MapStatsResponse {
  totalOffenses?: number;
  safetyIndex?: string;
  crimesByType?: Array<{ type: string; count: number }>;
  offensesByCategory?: Array<{ category: string; count: number }>;
  /** Offenses per barangay. */
  barangayCounts?: Record<string, number>;
  activeCases?: number;
  resolvedToday?: number;
  activity?: number[];
}

export function mergeMapStats(results: MapStatsResponse[]) {
  let totalOffenses = 0;
  let activeCases = 0;
  const types = new Map<string, number>();
  for (const result of results) {
    activeCases += result.activeCases ?? 0;
    const distribution = result.offensesByCategory?.map(({ category, count }) => ({ type: category, count })) ?? result.crimesByType ?? [];
    totalOffenses += result.totalOffenses ?? distribution.reduce((sum, c) => sum + c.count, 0);
    for (const { type, count } of distribution) types.set(type, (types.get(type) ?? 0) + count);
  }
  return {
    totalOffenses,
    safetyIndex: results.length === 1 && results[0].safetyIndex ? results[0].safetyIndex : `${totalOffenses ? Math.round(((totalOffenses - activeCases) / totalOffenses) * 100) : 100}%`,
    crimesByType: [...types].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count),
  };
}

export async function readMapResponses(endpoint: "stats" | "barangay-counts", queries: URLSearchParams[], signal: AbortSignal, request?: typeof fetch): Promise<MapStatsResponse[]> {
  signal.throwIfAborted();
  const responses = await Promise.all(queries.map(async (params) => {
    const url = `/api/crimes/${endpoint}?${params}`;
    // Concurrent panels share the existing GET deduplication. Each subscriber
    // cancels publishing its own result, without cancelling another panel's GET.
    let result: { success: boolean; data?: MapStatsResponse };
    if (request) {
      const response = await request(url, { signal, cache: "no-store" });
      if (!response.ok) throw new Error(`Map statistics request failed (${response.status})`);
      result = await response.json();
    } else result = await readJson(url);
    if (!result.success || !result.data) throw new Error("Map statistics response unavailable");
    return result.data as MapStatsResponse;
  }));
  // Some transports/mocks do not reject an aborted fetch. Never publish its result.
  signal.throwIfAborted();
  return responses;
}

export function mergeBarangayCounts(results: MapStatsResponse[]) {
  const counts: Record<string, number> = {};
  for (const result of results) {
    for (const [name, count] of Object.entries(result.barangayCounts ?? {})) counts[name] = (counts[name] ?? 0) + count;
  }
  return counts;
}

/** Dates stay whole; the committed hour is a separate backend field. */
export function mapCrimeParams(query: URLSearchParams, limit?: number) {
  return {
    barangay: query.get("barangay") ?? undefined,
    offenseCategory: query.get("offenseCategory") ?? undefined,
    stageOfFelony: query.get("stageOfFelony") ?? undefined,
    startDateCommitted: query.get("startDateCommitted") ?? undefined,
    endDateCommitted: query.get("endDateCommitted") ?? undefined,
    year: query.has("year") ? Number(query.get("year")) : undefined,
    hour: query.has("hour") ? Number(query.get("hour")) : undefined,
    view: "analysis" as const,
    // Omitted limits let fetchCrimes page through the complete matching scope.
    limit,
  };
}

export async function readMapCrimes<T extends { id: string }>(queries: URLSearchParams[], signal: AbortSignal, request: (params: ReturnType<typeof mapCrimeParams>) => Promise<T[]>, limit?: number): Promise<T[]> {
  const batches = await Promise.all(queries.map(query => request(mapCrimeParams(query, limit))));
  signal.throwIfAborted();
  return [...new Map(batches.flat().map(row => [row.id, row])).values()];
}
