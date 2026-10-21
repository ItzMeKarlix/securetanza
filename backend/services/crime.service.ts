/** Cached offense queries. Every count is a count of offenses. */
import { prisma } from "@/backend/lib/prisma";
import { cacheService, CacheKeys, TTL } from "@/backend/cache";
import type { CrimeStats, offenseTimeline } from "@/backend/lib/crime-analytics";
import {
  insertCrimeRecords,
  updateCrimeRecord,
  deleteCrimeRecord,
  presentCrimeRecord,
  type CrimeInput,
} from "@/backend/lib/crime-records";
import {
  loadCrimeStats,
  loadCrimeTimeline,
  loadCrimeAnalysis,
} from "@/backend/lib/crime-query-aggregates";

export type CrimeStatsResult = CrimeStats;
export interface BarangayCountsResult {
  /** Offenses per barangay. */
  barangayCounts: Record<string, number>;
  totalOffenses: number;
  barangayCount: number;
}
export interface HourlyTimelineBucket {
  date: string;
  hour: number | null;
  count: number;
}
export type HourlyTimelineResult = ReturnType<typeof offenseTimeline>;
import {
  buildCrimeWhere,
  type CrimeFilters,
} from "@/backend/lib/crime-query-filters";
export { buildCrimeWhere } from "@/backend/lib/crime-query-filters";
export type { CrimeFilters } from "@/backend/lib/crime-query-filters";
type StatsFilters = Pick<
  CrimeFilters,
  | "barangay"
  | "crimeType"
  | "offenseCategory"
  | "year"
  | "hour"
  | "stageOfFelony"
> & { startDate?: string | null; endDate?: string | null };

const withCategory = { offenseDefinition: { select: { label: true } } } as const;

export class CrimeService {
  static async getStats(filters: StatsFilters): Promise<CrimeStatsResult> {
    return cacheService.getOrSet(
      CacheKeys.crimes.stats(filters),
      TTL.CRIME_STATS,
      async () =>
        loadCrimeStats(
          buildCrimeWhere(
            {
              ...filters,
              startDateCommitted: filters.startDate,
              endDateCommitted: filters.endDate,
            },
            true,
          ),
          prisma,
        ),
    );
  }

  static async getBarangayCounts(
    filters: Pick<
      CrimeFilters,
      | "barangay"
      | "crimeType"
      | "offenseCategory"
      | "year"
      | "hour"
      | "startDateCommitted"
      | "endDateCommitted"
      | "stageOfFelony"
    >,
  ): Promise<BarangayCountsResult> {
    return cacheService.getOrSet(
      CacheKeys.crimes.barangayCounts(filters),
      TTL.BARANGAY_COUNTS,
      async () => {
        const { startDateCommitted, endDateCommitted, ...scope } = filters;
        const stats = await this.getStats({
          ...scope,
          startDate: startDateCommitted,
          endDate: endDateCommitted,
        });
        return {
          barangayCounts: Object.fromEntries(
            stats.offensesByBarangay.map((r) => [r.barangay, r.count]),
          ),
          totalOffenses: stats.totalOffenses,
          barangayCount: stats.offensesByBarangay.length,
        };
      },
    );
  }

  static async getHourlyTimeline(
    filters: Pick<
      CrimeFilters,
      "year" | "crimeType" | "offenseCategory" | "barangay" | "stageOfFelony"
    >,
  ): Promise<HourlyTimelineResult> {
    return cacheService.getOrSet(
      CacheKeys.crimes.hourlyTimeline(filters),
      TTL.CRIME_HOURLY_TIMELINE,
      async () => loadCrimeTimeline(buildCrimeWhere(filters, true), prisma),
    );
  }

  static async getCrimes(filters: CrimeFilters) {
    return cacheService.getOrSet(
      CacheKeys.crimes.list(filters as Record<string, unknown>),
      TTL.CRIME_LIST,
      async () => {
        const requested = Number(filters.limit ?? 500),
          offset = Number(filters.offset ?? 0);
        const limit = Number.isFinite(requested)
          ? Math.min(Math.max(1, Math.floor(requested)), 2000)
          : 500;
        const skip = Number.isFinite(offset)
          ? Math.max(0, Math.floor(offset))
          : 0;
        if (filters.view === "analysis")
          return loadCrimeAnalysis(
            buildCrimeWhere(filters),
            prisma,
            limit,
            skip,
          );
        const rows = await prisma.offense.findMany({
          where: buildCrimeWhere(filters),
          orderBy: [{ dateCommitted: "desc" }, { id: "asc" }],
          take: limit,
          skip,
          include: withCategory,
        });
        return rows.map(presentCrimeRecord);
      },
    );
  }

  static async getDistinctYears(): Promise<number[]> {
    return cacheService.getOrSet(
      CacheKeys.crimes.years(),
      TTL.DISTINCT_YEARS,
      async () => {
        const rows = await prisma.$queryRaw<
          Array<{ year: number }>
        >`SELECT DISTINCT EXTRACT(YEAR FROM date_committed)::integer AS year FROM offenses ORDER BY year DESC`;
        return rows.map((r) => r.year);
      },
    );
  }

  static async getLatest(barangay?: string | null) {
    return cacheService.getOrSet(
      CacheKeys.crimes.latest(barangay),
      TTL.CRIME_LATEST,
      async () => {
        const filters = {
          barangay: barangay === "General Dashboard" ? null : barangay,
        };
        const where = buildCrimeWhere(filters);
        const [latest, stats, lastUpload] = await Promise.all([
          prisma.offense.findFirst({
            where,
            orderBy: [{ dateCommitted: "desc" }, { createdAt: "desc" }],
            include: withCategory,
          }),
          this.getStats(filters),
          prisma.auditLog.findFirst({
            where: {
              action: "Import",
              outcome: { in: ["success", "partial"] },
            },
            orderBy: { createdAt: "desc" },
          }),
        ]);
        return {
          latestOffense: latest ? presentCrimeRecord(latest) : null,
          totalOffenses: stats.totalOffenses,
          lastUpload: lastUpload
            ? {
                fileName: lastUpload.fileName,
                recordsImported: lastUpload.recordsImported,
                createdAt: lastUpload.createdAt,
              }
            : null,
          serverTime: new Date().toISOString(),
        };
      },
    );
  }

  static async getById(id: string) {
    return cacheService.getOrSet(
      CacheKeys.crimes.detail(id),
      TTL.CRIME_DETAIL,
      async () => {
        const row = await prisma.offense.findUnique({
          where: { id },
          include: withCategory,
        });
        return row ? presentCrimeRecord(row) : null;
      },
    );
  }

  static async createOffense(data: CrimeInput) {
    const [created] = await insertCrimeRecords([data], prisma);
    if (!created)
      throw new Error(
        "This offense record already exists in the crime register.",
      );
    await cacheService.deleteByPattern(CacheKeys.crimes.pattern());
    const result = await this.getById(created.id);
    if (!result) throw new Error("Created offense record could not be loaded.");
    return result;
  }

  static async updateOffense(id: string, data: Partial<CrimeInput>) {
    await updateCrimeRecord(id, data, prisma);
    await cacheService.deleteByPattern(CacheKeys.crimes.pattern());
    return this.getById(id);
  }

  static async deleteOffense(id: string) {
    const row = await deleteCrimeRecord(id, prisma);
    await cacheService.deleteByPattern(CacheKeys.crimes.pattern());
    return row;
  }
}
