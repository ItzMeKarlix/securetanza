/**
 * Offense deduplication: a deterministic fingerprint per offense record, so an
 * Excel upload that repeats rows already in the register doesn't add them again.
 */

import type { PrismaClient } from './generated/prisma';
import { normalizeFelonyStage } from '@/lib/offense-classification';

export interface CrimeRecordForFingerprint {
  blotterNo?: string | null;
  stn?: string | null;
  municipal?: string | null;
  barangay: string;
  dateCommitted: Date | string;
  timeCommitted: string;
  offense?: string | null;
  stageOfFelony?: string | null;
  section?: string | null;
  dateReported: Date | string;
  timeReported: string;
}

/**
 * Normalizes text strings by trimming, lowercasing, and collapsing whitespace.
 */
export function normalizeCrimeText(val: string | null | undefined): string {
  if (!val) return '';
  return val
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Normalizes a date into a standard YYYY-MM-DD string representation.
 */
export function normalizeCrimeDate(val: Date | string | null | undefined): string {
  if (!val) return '';
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return '';
    return val.toISOString().split('T')[0];
  }
  const str = String(val).trim();
  if (str.includes('T')) {
    return str.split('T')[0];
  }
  // Try parsing date if in different format
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }
  return str.toLowerCase();
}

/**
 * Normalizes a time into standard HH:MM:SS format.
 */
export function normalizeCrimeTime(val: string | null | undefined): string {
  if (!val) return '00:00:00';
  const clean = val.toString().trim();
  const parts = clean.split(':');
  if (parts.length >= 2) {
    const hh = parts[0].padStart(2, '0');
    const mm = parts[1].padStart(2, '0');
    const ss = parts[2] ? parts[2].padStart(2, '0') : '00';
    return `${hh}:${mm}:${ss}`;
  }
  return clean.toLowerCase();
}

/**
 * Where an offense was recorded: its station-scoped blotter number, or — when
 * there is no blotter — the place and times it was committed and reported.
 */
export function offenseSourceKey(record: CrimeRecordForFingerprint): string {
  const blotter = normalizeCrimeText(record.blotterNo);
  if (blotter && blotter !== '-' && blotter !== 'n/a' && blotter !== 'none' && blotter !== 'null') {
    const station = normalizeCrimeText(record.stn) || normalizeCrimeText(record.municipal) || 'unknown-station';
    return `blotter:${station}|${blotter}`;
  }
  return `comp:${normalizeCrimeText(record.stn)}|${normalizeCrimeText(record.barangay)}|${normalizeCrimeDate(record.dateCommitted)}|${normalizeCrimeTime(record.timeCommitted)}|${normalizeCrimeText(record.offense)}|${normalizeCrimeDate(record.dateReported)}|${normalizeCrimeTime(record.timeReported)}`;
}

/** One offense: where it was recorded, which offense, at what stage, under which section. */
export function generateCrimeFingerprint(record: CrimeRecordForFingerprint): string {
  return JSON.stringify([offenseSourceKey(record), normalizeCrimeText(record.offense) || 'unclassified', normalizeFelonyStage(record.stageOfFelony), normalizeCrimeText(record.section)]);
}

/**
 * Batch-queries PostgreSQL to retrieve all existing fingerprints for incoming records.
 * Uses indexed blotter numbers and date committed ranges to execute in a single fast round-trip.
 */
export async function findExistingCrimeFingerprints(
  records: CrimeRecordForFingerprint[],
  prisma: PrismaClient
): Promise<Set<string>> {
  const existingFingerprints = new Set<string>();
  if (!records || records.length === 0) {
    return existingFingerprints;
  }

  const blotterNos: string[] = [];
  let minDateCommitted: Date | null = null;
  let maxDateCommitted: Date | null = null;

  for (const rec of records) {
    const blotter = normalizeCrimeText(rec.blotterNo);
    if (blotter && blotter !== '-' && blotter !== 'n/a' && blotter !== 'none' && blotter !== 'null') {
      blotterNos.push(rec.blotterNo!.trim());
    }

    const d = rec.dateCommitted instanceof Date ? rec.dateCommitted : new Date(rec.dateCommitted);
    if (!isNaN(d.getTime())) {
      if (!minDateCommitted || d < minDateCommitted) minDateCommitted = d;
      if (!maxDateCommitted || d > maxDateCommitted) maxDateCommitted = d;
    }
  }

  const orConditions: any[] = [];

  if (blotterNos.length > 0) {
    orConditions.push({
      blotterNo: {
        in: blotterNos,
        mode: 'insensitive' as const,
      },
    });
  }

  if (minDateCommitted && maxDateCommitted) {
    // Expand boundaries by 1 day to account for timezone shifts
    const startBoundary = new Date(minDateCommitted);
    startBoundary.setDate(startBoundary.getDate() - 1);
    const endBoundary = new Date(maxDateCommitted);
    endBoundary.setDate(endBoundary.getDate() + 2);

    orConditions.push({
      dateCommitted: {
        gte: startBoundary,
        lte: endBoundary,
      },
    });
  }

  if (orConditions.length === 0) {
    return existingFingerprints;
  }

  const existingInDb = await prisma.offense.findMany({
    where: {
      OR: orConditions,
    },
    select: {
      blotterNo: true,
      stn: true,
      municipal: true,
      barangay: true,
      dateCommitted: true,
      timeCommitted: true,
      offense: true,
      stageOfFelony: true,
      section: true,
      dateReported: true,
      timeReported: true,
    },
  });

  for (const existing of existingInDb) {
    const fp = generateCrimeFingerprint(existing);
    existingFingerprints.add(fp);
  }

  return existingFingerprints;
}
