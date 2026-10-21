/**
 * Offense statistics, computed in memory. The database path
 * (crime-query-aggregates.ts) returns exactly this shape; this version is the
 * readable definition of every measure, and what the tests pin down.
 *
 * Every count is a count of offenses. Offenses are never grouped: a blotter
 * listing two offenses contributes two.
 */
export interface AnalyticalRecord {
  id: string;
  crimeType: string;
  offenseCategory?: string;
  offenseDefinition?: { label: string };
  felonyStage: string;
  barangay: string;
  dateCommitted: Date;
  timeCommitted: string;
  caseStatus: string | null;
  updatedAt: Date;
}

export const RESOLVED_STATUSES = ["cleared", "solved", "archived", "closed"];
const resolved = (status: string | null) =>
  RESOLVED_STATUSES.includes((status ?? "").trim().toLowerCase());
const sortedCounts = (counts: Map<string, number>) =>
  [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

function stagePrefix(stage: string) {
  return stage === "FRUSTRATED" ? "Frustrated " : stage === "ATTEMPTED" ? "Attempted " : stage === "UNKNOWN" ? "Unknown Stage · " : "";
}

export function aggregateCrimeStats(rows: AnalyticalRecord[], now = new Date()) {
  const byType = new Map<string, number>(),
    byCategory = new Map<string, number>(),
    byBarangay = new Map<string, number>(),
    byStage = new Map<string, number>();
  const monthly = Array<number>(12).fill(0);
  let resolvedCases = 0,
    resolvedToday = 0,
    recentCrimes = 0;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const recent = new Date(now);
  recent.setDate(recent.getDate() - 7);

  for (const row of rows) {
    const prefix = stagePrefix(row.felonyStage);
    const category =
      row.offenseCategory ??
      row.offenseDefinition?.label ??
      (prefix && row.crimeType.startsWith(prefix) ? row.crimeType.slice(prefix.length) : row.crimeType);
    byCategory.set(category, (byCategory.get(category) ?? 0) + 1);
    byBarangay.set(row.barangay, (byBarangay.get(row.barangay) ?? 0) + 1);
    byType.set(row.crimeType, (byType.get(row.crimeType) ?? 0) + 1);
    byStage.set(row.felonyStage, (byStage.get(row.felonyStage) ?? 0) + 1);
    monthly[row.dateCommitted.getUTCMonth()]++;
    if (row.dateCommitted >= recent && row.dateCommitted <= now) recentCrimes++;
    if (resolved(row.caseStatus)) {
      resolvedCases++;
      if (row.updatedAt >= today && row.updatedAt < tomorrow) resolvedToday++;
    }
  }

  return {
    totalOffenses: rows.length,
    /** Offenses whose case is not cleared, solved, archived or closed. */
    activeCases: rows.length - resolvedCases,
    resolvedToday,
    recentCrimes,
    safetyIndex: rows.length ? `${Math.round((resolvedCases / rows.length) * 100)}%` : "100%",
    crimesByType: sortedCounts(byType).map(([type, count]) => ({ type, count })),
    offensesByCategory: sortedCounts(byCategory).map(([category, count]) => ({ category, count })),
    offensesByBarangay: sortedCounts(byBarangay).map(([barangay, count]) => ({ barangay, count })),
    crimesByStage: sortedCounts(byStage).map(([stage, count]) => ({ stage, count })),
    monthlyStats: monthly.map((count, i) => ({ month: i + 1, count })),
    activity: monthly,
  };
}

export type CrimeStats = ReturnType<typeof aggregateCrimeStats>;

/** Offenses per committed date and hour (null when the time wasn't recorded). */
export function offenseTimeline(rows: AnalyticalRecord[]) {
  const byBucket = new Map<string, { date: string; hour: number | null; count: number }>();
  for (const row of rows) {
    const match = /^(\d{1,2}):/.exec(row.timeCommitted.trim());
    const parsed = match ? Number(match[1]) : -1;
    const hour = parsed >= 0 && parsed <= 23 ? parsed : null;
    const date = row.dateCommitted.toISOString();
    const key = `${date}|${hour}`;
    const bucket = byBucket.get(key) ?? { date, hour, count: 0 };
    bucket.count++;
    byBucket.set(key, bucket);
  }
  return {
    buckets: [...byBucket.values()].sort((a, b) => b.date.localeCompare(a.date) || (a.hour ?? 24) - (b.hour ?? 24)),
    totalOffenses: rows.length,
  };
}
