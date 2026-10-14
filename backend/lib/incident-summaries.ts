import type { PrismaClient } from "./generated/prisma";

export interface IncidentSummary {
  id: string;
  offenseCount: number;
  hasMultipleOffenses: boolean;
  allOffensesCleared: boolean;
  allOffensesResolved: boolean;
  lastOffenseUpdatedAt: Date;
}

/** Aggregate full sibling status in PostgreSQL instead of transferring every sibling. */
export async function loadIncidentSummaries(
  ids: string[],
  client: PrismaClient,
) {
  const unique = [...new Set(ids)];
  if (!unique.length) return new Map<string, IncidentSummary>();
  const placeholders = unique.map((_, index) => `$${index + 1}`).join(",");
  const summaries = await client.$queryRawUnsafe<IncidentSummary[]>(
    `
    SELECT i.id, i.offense_count AS "offenseCount",
      i.has_multiple_offenses AS "hasMultipleOffenses",
      BOOL_AND(LOWER(BTRIM(COALESCE(c.case_status, ''))) = 'cleared') AS "allOffensesCleared",
      BOOL_AND(LOWER(BTRIM(COALESCE(c.case_status, ''))) IN ('cleared', 'solved', 'archived', 'closed')) AS "allOffensesResolved",
      MAX(c.updated_at) AS "lastOffenseUpdatedAt"
    FROM incidents i JOIN crime_incidents c ON c.incident_id = i.id
    WHERE i.id IN (${placeholders})
    GROUP BY i.id, i.offense_count, i.has_multiple_offenses`,
    ...unique,
  );
  return new Map(summaries.map((row) => [row.id, row]));
}
