import * as XLSX from 'xlsx';
import { prisma } from '@/backend/lib/prisma';

export type BackupKind = 'crime_data' | 'report' | 'scheduled_export';

/** Row shape of the archive list — deliberately without `content`. */
export interface BackupSummary {
  id: string;
  kind: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  label: string | null;
  barangay: string | null;
  periodLabel: string | null;
  rowCount: number | null;
  createdBy: string;
  createdAt: Date;
  deletedAt: Date | null;
  deletedBy: string | null;
}

const SUMMARY_FIELDS = {
  id: true,
  kind: true,
  deletedAt: true,
  deletedBy: true,
  fileName: true,
  mimeType: true,
  sizeBytes: true,
  label: true,
  barangay: true,
  periodLabel: true,
  rowCount: true,
  createdBy: true,
  createdAt: true,
} as const;

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function isoDate(value: Date | null | undefined): string {
  return value ? value.toISOString().split('T')[0] : '';
}

export interface CrimeDataFilters {
  barangay?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  /** How the period is described in the workbook, when the caller knows better (station dates). */
  periodLabel?: string | null;
}

export interface CrimeDataSnapshot {
  buffer: Buffer;
  /** Offenses in the workbook. */
  rowCount: number;
  periodLabel: string;
}

export class BackupService {
  /**
   * Build the workbook that backs up the register: every cleaned offense row, plus
   * the aggregates the dashboards are built from, so a restored file answers the same
   * questions the app does without needing the app.
   */
  static async buildCrimeDataWorkbook(filters: CrimeDataFilters = {}): Promise<CrimeDataSnapshot> {
    const where: {
      barangay?: { equals: string; mode: 'insensitive' };
      dateCommitted?: { gte?: Date; lte?: Date };
    } = {};

    if (filters.barangay) {
      where.barangay = { equals: filters.barangay, mode: 'insensitive' };
    }

    const from = filters.startDate ? new Date(filters.startDate) : null;
    const to = filters.endDate ? new Date(filters.endDate) : null;
    if ((from && !isNaN(from.getTime())) || (to && !isNaN(to.getTime()))) {
      where.dateCommitted = {};
      if (from && !isNaN(from.getTime())) where.dateCommitted.gte = from;
      if (to && !isNaN(to.getTime())) where.dateCommitted.lte = to;
    }

    const offenses = await prisma.offense.findMany({
      where,
      orderBy: { dateCommitted: 'desc' },
      include: { offenseDefinition: { select: { label: true } } },
    });

    // ── Sheet 1: the register itself, one row per offense ──
    const offenseRows = offenses.map((offense) => ({
      'Blotter No': offense.blotterNo ?? '',
      Offense: offense.offense ?? '',
      'Offense Category': offense.offenseDefinition.label,
      'Stage of Felony': offense.felonyStage,
      'Crime Type (with stage)': offense.crimeType,
      'Stage of Felony (as recorded)': offense.stageOfFelony ?? '',
      'Offense Type': offense.offenseType ?? '',
      Section: offense.section ?? '',
      'Date Committed': isoDate(offense.dateCommitted),
      'Time Committed': offense.timeCommitted,
      'Date Reported': isoDate(offense.dateReported),
      'Time Reported': offense.timeReported,
      'Date Encoded': isoDate(offense.dateEncoded),
      'Regional Office': offense.pro ?? '',
      'Provincial Office': offense.ppo ?? '',
      Station: offense.stn ?? '',
      Precinct: offense.pcp ?? '',
      Region: offense.region ?? '',
      Province: offense.province ?? '',
      Municipality: offense.municipal ?? '',
      Barangay: offense.barangay,
      Street: offense.street ?? '',
      'Type of Place': offense.typeOfPlace ?? '',
      'Is Crime': offense.isCrime ? 'Yes' : 'No',
      'Mode of Reporting': offense.modeReporting ?? '',
      Modus: offense.modus ?? '',
      'Suspect Motive': offense.suspectMotive ?? '',
      'Suspect Sub-Motive': offense.suspectSubMotive ?? '',
      Heinous: offense.heinous ? 'Yes' : 'No',
      Sensational: offense.sensational ? 'Yes' : 'No',
      'Threat Group': offense.threatGrp ? 'Yes' : 'No',
      'Group Affiliation': offense.grpAffiliation ?? '',
      MRS: offense.mrs ?? '',
      'Suspect Count': offense.suspectCount ?? '',
      'Suspect Arrested': offense.suspectArrested === null ? '' : offense.suspectArrested ? 'Yes' : 'No',
      'Victim Count': offense.victimCount ?? '',
      'Case Status': offense.caseStatus ?? '',
      Investigator: offense.investigator ?? '',
      'Head Investigator': offense.headInves ?? '',
      Latitude: offense.latitude ?? '',
      Longitude: offense.longitude ?? '',
    }));

    // ── Sheets 2-5: the aggregates the dashboards read, all counting offenses ──
    const byBarangay = new Map<string, number>();
    const byType = new Map<string, number>();
    const byStage = new Map<string, number>();
    const byMonth = new Map<string, number[]>();

    for (const offense of offenses) {
      byBarangay.set(offense.barangay, (byBarangay.get(offense.barangay) ?? 0) + 1);
      byType.set(offense.crimeType, (byType.get(offense.crimeType) ?? 0) + 1);
      byStage.set(offense.felonyStage, (byStage.get(offense.felonyStage) ?? 0) + 1);
      const months = byMonth.get(offense.crimeType) ?? new Array(12).fill(0);
      months[offense.dateCommitted.getUTCMonth()] += 1;
      byMonth.set(offense.crimeType, months);
    }

    const total = offenses.length;
    const share = (count: number) => (total > 0 ? Number(((count / total) * 100).toFixed(2)) : 0);
    const sortDesc = (a: [string, number], b: [string, number]) => b[1] - a[1];

    const barangayRows = [...byBarangay.entries()].sort(sortDesc).map(([barangay, count]) => ({
      Barangay: barangay,
      Offenses: count,
      'Share %': share(count),
    }));

    const typeRows = [...byType.entries()].sort(sortDesc).map(([type, count]) => ({
      'Crime Type': type,
      Offenses: count,
      'Share %': share(count),
    }));

    const stageRows = [...byStage.entries()].sort(sortDesc).map(([stage, count]) => ({
      'Stage of Felony': stage,
      Offenses: count,
      'Share %': share(count),
    }));

    const matrixRows = [...byMonth.entries()]
      .sort((a, b) => b[1].reduce((x, y) => x + y, 0) - a[1].reduce((x, y) => x + y, 0))
      .map(([type, months]) => {
        const row: Record<string, string | number> = { 'Crime Type': type };
        MONTH_NAMES.forEach((name, index) => {
          row[name] = months[index];
        });
        row.Total = months.reduce((sum, value) => sum + value, 0);
        return row;
      });

    // ── Summary: what this snapshot is ──
    const earliest = offenses.length ? offenses[offenses.length - 1].dateCommitted : null;
    const latest = offenses.length ? offenses[0].dateCommitted : null;
    const periodLabel = filters.periodLabel ||
      (from || to
        ? `${from ? isoDate(from) : 'start'} to ${to ? isoDate(to) : 'today'}`
        : 'All records');

    const summaryRows = [
      { Field: 'Generated at', Value: new Date().toISOString() },
      { Field: 'Scope', Value: filters.barangay || 'All barangays' },
      { Field: 'Requested period', Value: periodLabel },
      { Field: 'Offenses captured', Value: total },
      ...stageRows.map((row) => ({ Field: `${row['Stage of Felony']} offenses`, Value: row.Offenses })),
      { Field: 'Earliest offense', Value: isoDate(earliest) },
      { Field: 'Latest offense', Value: isoDate(latest) },
      { Field: 'Barangays represented', Value: byBarangay.size },
      { Field: 'Crime types represented', Value: byType.size },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(summaryRows), 'Summary');
    XLSX.utils.book_append_sheet(
      workbook,
      XLSX.utils.json_to_sheet(offenseRows.length ? offenseRows : [{ Note: 'No offenses matched this scope' }]),
      'Offenses'
    );
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(stageRows), 'By Stage of Felony');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(barangayRows), 'By Barangay');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(typeRows), 'By Crime Type');
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(matrixRows), 'Monthly Matrix');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

    return { buffer, rowCount: total, periodLabel };
  }

  /** Live backups, or (`deleted`) the ones in Recently deleted. */
  static async list(kind?: string | null, deleted = false): Promise<BackupSummary[]> {
    return prisma.backup.findMany({
      where: { ...(kind ? { kind } : {}), deletedAt: deleted ? { not: null } : null },
      orderBy: { createdAt: 'desc' },
      select: SUMMARY_FIELDS,
    });
  }

  static async create(input: {
    kind: BackupKind;
    fileName: string;
    mimeType: string;
    content: Uint8Array;
    label?: string | null;
    barangay?: string | null;
    periodLabel?: string | null;
    rowCount?: number | null;
    createdBy: string;
  }): Promise<BackupSummary> {
    return prisma.backup.create({
      data: {
        kind: input.kind,
        fileName: input.fileName,
        mimeType: input.mimeType,
        sizeBytes: input.content.length,
        // Prisma's Bytes wants a plain Uint8Array, which a Buffer is not assignable to.
        content: new Uint8Array(input.content),
        label: input.label ?? null,
        barangay: input.barangay ?? null,
        periodLabel: input.periodLabel ?? null,
        rowCount: input.rowCount ?? null,
        createdBy: input.createdBy,
      },
      select: SUMMARY_FIELDS,
    });
  }

  /** Includes `content` — only for the download route. Deleted backups can't be downloaded. */
  static async getWithContent(id: string) {
    return prisma.backup.findFirst({ where: { id, deletedAt: null } });
  }

  /** Soft delete: moves it to Recently deleted; the worker purges it after 30 days. */
  static async remove(id: string, deletedBy: string): Promise<BackupSummary | null> {
    const existing = await prisma.backup.findFirst({ where: { id, deletedAt: null }, select: SUMMARY_FIELDS });
    if (!existing) return null;
    await prisma.backup.update({ where: { id }, data: { deletedAt: new Date(), deletedBy } });
    return existing;
  }

  static async restore(id: string): Promise<BackupSummary | null> {
    const restored = await prisma.backup.updateMany({ where: { id, deletedAt: { not: null } }, data: { deletedAt: null, deletedBy: null } });
    if (restored.count === 0) return null;
    return prisma.backup.findUnique({ where: { id }, select: SUMMARY_FIELDS });
  }
}
