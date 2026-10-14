import { uniqueIncidentRecords } from "@/lib/offense-classification";

export interface AnalyticalRecord {
  id: string;
  incidentId: string;
  crimeType: string;
  offenseCategory?: string;
  offenseDefinition?: { label: string };
  felonyStage: string;
  barangay: string;
  dateCommitted: Date;
  timeCommitted: string;
  caseStatus: string | null;
  updatedAt: Date;
  incident?: {
    hasMultipleOffenses: boolean;
    offenses?: { caseStatus: string | null; updatedAt: Date }[];
    allOffensesResolved?: boolean;
    lastOffenseUpdatedAt?: Date;
  };
}

const resolved = (status: string | null) =>
  ["cleared", "solved", "archived", "closed"].includes(
    (status ?? "").trim().toLowerCase(),
  );
const sortedCounts = (counts: Map<string, number>) =>
  [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

export function aggregateCrimeStats(
  rows: AnalyticalRecord[],
  now = new Date(),
) {
  const incidents = uniqueIncidentRecords(rows);
  const byType = new Map<string, number>(),
    byCategory = new Map<string, number>(),
    byOffenseBarangay = new Map<string, number>(),
    byStage = new Map<string, number>(),
    byBarangay = new Map<string, number>();
  const monthly = Array<number>(12).fill(0),
    monthlyOffenses = Array<number>(12).fill(0);
  for (const row of rows) {
    const prefix =
      row.felonyStage === "FRUSTRATED"
        ? "Frustrated "
        : row.felonyStage === "ATTEMPTED"
          ? "Attempted "
          : row.felonyStage === "UNKNOWN"
            ? "Unknown Stage · "
            : "";
    const category =
      row.offenseCategory ??
      row.offenseDefinition?.label ??
      (prefix && row.crimeType.startsWith(prefix)
        ? row.crimeType.slice(prefix.length)
        : row.crimeType);
    byCategory.set(category, (byCategory.get(category) ?? 0) + 1);
    byOffenseBarangay.set(
      row.barangay,
      (byOffenseBarangay.get(row.barangay) ?? 0) + 1,
    );
    byType.set(row.crimeType, (byType.get(row.crimeType) ?? 0) + 1);
    byStage.set(row.felonyStage, (byStage.get(row.felonyStage) ?? 0) + 1);
    monthlyOffenses[row.dateCommitted.getUTCMonth()]++;
  }
  let clearedCases = 0,
    resolvedToday = 0,
    recentCrimes = 0,
    multipleOffenseIncidents = 0;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const recent = new Date(now);
  recent.setDate(recent.getDate() - 7);
  for (const row of incidents) {
    byBarangay.set(row.barangay, (byBarangay.get(row.barangay) ?? 0) + 1);
    monthly[row.dateCommitted.getUTCMonth()]++;
    if (row.dateCommitted >= recent && row.dateCommitted <= now) recentCrimes++;
    if (row.incident?.hasMultipleOffenses) multipleOffenseIncidents++;
    const siblings =
      row.incident?.offenses ??
      rows.filter((r) => r.incidentId === row.incidentId);
    const allResolved =
      row.incident?.allOffensesResolved ??
      (siblings.length > 0 && siblings.every((r) => resolved(r.caseStatus)));
    if (allResolved) {
      clearedCases++;
      const lastUpdate =
        row.incident?.lastOffenseUpdatedAt?.getTime() ??
        Math.max(...siblings.map((r) => r.updatedAt.getTime()));
      if (lastUpdate >= today.getTime() && lastUpdate < tomorrow.getTime())
        resolvedToday++;
    }
  }
  return {
    totalCrimes: incidents.length, // Legacy alias: geographic/case metrics count incidents.
    totalIncidents: incidents.length,
    totalOffenses: rows.length,
    multipleOffenseIncidents,
    activeCases: incidents.length - clearedCases,
    resolvedToday,
    recentCrimes,
    safetyIndex: incidents.length
      ? `${Math.round((clearedCases / incidents.length) * 100)}%`
      : "100%",
    crimesByType: sortedCounts(byType).map(([type, count]) => ({
      type,
      count,
    })),
    offensesByCategory: sortedCounts(byCategory).map(([category, count]) => ({
      category,
      count,
    })),
    offensesByBarangay: sortedCounts(byOffenseBarangay).map(
      ([barangay, count]) => ({ barangay, count }),
    ),
    crimesByStage: sortedCounts(byStage).map(([stage, count]) => ({
      stage,
      count,
    })),
    crimesByBarangay: sortedCounts(byBarangay).map(([barangay, count]) => ({
      barangay,
      count,
    })),
    monthlyStats: monthly.map((count, i) => ({ month: i + 1, count })),
    monthlyOffenseStats: monthlyOffenses.map((count, i) => ({
      month: i + 1,
      count,
    })),
    activity: monthly,
  };
}

export function incidentTimeline(rows: AnalyticalRecord[]) {
  const byBucket = new Map<
    string,
    { date: string; hour: number | null; count: number }
  >();
  const incidents = uniqueIncidentRecords(rows);
  for (const row of incidents) {
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
    buckets: [...byBucket.values()].sort(
      (a, b) => b.date.localeCompare(a.date) || (a.hour ?? 24) - (b.hour ?? 24),
    ),
    totalCrimes: incidents.length,
    totalIncidents: incidents.length,
    totalOffenses: rows.length,
  };
}
