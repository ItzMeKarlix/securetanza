import type { Prisma } from "./generated/prisma";
import { mapGeoJsonToDb } from "./barangay-mapper";
import {
  buildIncidentTypeWhere,
  buildOffenseCategoryWhere,
} from "@/lib/crime-groups";
import { normalizeFelonyStage } from "@/lib/offense-classification";
import { escapeLike, isoDateParam, queryText } from "@/lib/input-sanitize";

const TEXT_FILTERS = [
  "barangay", "incidentId", "offenseCategory", "region", "province", "municipal",
  "incidentType", "modeReporting", "stageOfFelony", "caseStatus", "offenseType", "modus", "typeOfPlace",
] as const;
const DATE_FILTERS = ["startDateReported", "endDateReported", "startDateCommitted", "endDateCommitted"] as const;

/**
 * Filters arrive straight from query strings. Text is cleaned and bounded (and
 * dropped if it carries markup); a date that doesn't parse is ignored rather
 * than reaching the database as an Invalid Date.
 */
function cleanFilters(filters: CrimeFilters): CrimeFilters {
  const clean: CrimeFilters = { ...filters };
  for (const field of TEXT_FILTERS) {
    const value = filters[field];
    clean[field] = typeof value === "string" ? queryText(value) : null;
  }
  for (const field of DATE_FILTERS) clean[field] = isoDateParam(filters[field]);
  return clean;
}
export interface CrimeFilters {
  barangay?: string | null;
  incidentId?: string | null;
  offenseCategory?: string | null;
  region?: string | null;
  province?: string | null;
  municipal?: string | null;
  incidentType?: string | null;
  startDateReported?: string | null;
  endDateReported?: string | null;
  startDateCommitted?: string | null;
  endDateCommitted?: string | null;
  modeReporting?: string | null;
  stageOfFelony?: string | null;
  caseStatus?: string | null;
  offenseType?: string | null;
  modus?: string | null;
  typeOfPlace?: string | null;
  hour?: string | number | null;
  year?: string | number | null;
  view?: "analysis";
  limit?: number | null;
  offset?: number | null;
}
/** Compose AND predicates so type, date, stage and hour scopes cannot overwrite one another. */
export function buildCrimeWhere(
  rawFilters: CrimeFilters,
  crimesOnly = false,
): Prisma.CrimeIncidentWhereInput {
  const filters = cleanFilters(rawFilters);
  const and: Prisma.CrimeIncidentWhereInput[] = crimesOnly
    ? [{ isCrime: true }]
    : [];
  if (filters.incidentId) and.push({ incidentId: filters.incidentId });
  if (filters.offenseCategory)
    and.push(buildOffenseCategoryWhere(filters.offenseCategory));
  if (filters.barangay)
    and.push({
      barangay: {
        equals: mapGeoJsonToDb(filters.barangay),
        mode: "insensitive",
      },
    });
  for (const field of [
    "region",
    "province",
    "municipal",
    "modeReporting",
    "caseStatus",
    "offenseType",
    "modus",
    "typeOfPlace",
  ] as const) {
    const value = filters[field];
    // Escaped so % and _ match literally instead of acting as wildcards.
    if (value) and.push({ [field]: { contains: escapeLike(value), mode: "insensitive" } });
  }
  if (filters.incidentType)
    and.push(buildIncidentTypeWhere(filters.incidentType));
  if (filters.stageOfFelony)
    and.push({ felonyStage: normalizeFelonyStage(filters.stageOfFelony) });
  for (const [field, start, end] of [
    ["dateReported", filters.startDateReported, filters.endDateReported],
    ["dateCommitted", filters.startDateCommitted, filters.endDateCommitted],
  ] as const) {
    if (start || end)
      and.push({
        [field]: {
          ...(start ? { gte: new Date(start) } : {}),
          ...(end ? { lte: new Date(end) } : {}),
        },
      });
  }
  if (filters.year) {
    const year = Number(filters.year);
    if (Number.isInteger(year) && year >= 1900 && year <= 9999)
      and.push({
        dateCommitted: {
          gte: new Date(`${year}-01-01T00:00:00Z`),
          lt: new Date(`${year + 1}-01-01T00:00:00Z`),
        },
      });
  }
  if (
    filters.hour !== null &&
    filters.hour !== undefined &&
    filters.hour !== ""
  ) {
    const hour = Number(filters.hour);
    if (Number.isInteger(hour) && hour >= 0 && hour <= 23)
      and.push({
        OR: [
          {
            timeCommitted: { startsWith: `${String(hour).padStart(2, "0")}:` },
          },
          { timeCommitted: { startsWith: `${hour}:` } },
        ],
      });
  }
  return { AND: and };
}
