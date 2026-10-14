import type { Prisma, PrismaClient } from "./generated/prisma";
import type { aggregateCrimeStats, incidentTimeline } from "./crime-analytics";

const columns: Record<string, string> = {
  incidentId: "incident_id",
  isCrime: "is_crime",
  barangay: "barangay",
  crimeType: "crime_type",
  felonyStage: "felony_stage",
  dateCommitted: "date_committed",
  dateReported: "date_reported",
  timeCommitted: "time_committed",
  region: "region",
  province: "province",
  municipal: "municipality",
  modeReporting: "mode_reporting",
  caseStatus: "case_status",
  offenseType: "offense_type",
  modus: "modus",
  typeOfPlace: "type_of_place",
};

/** Whitelist SQL identifiers and operators; every filter value is a bound parameter. */
export function crimeWhereSql(where: Prisma.CrimeIncidentWhereInput) {
  const parameters: unknown[] = [];
  const bind = (value: unknown) => {
    parameters.push(value);
    return `$${parameters.length}`;
  };
  function compile(
    node: Prisma.CrimeIncidentWhereInput,
    alias = "c",
    names = columns,
  ): string {
    const parts: string[] = [];
    for (const [field, condition] of Object.entries(node)) {
      if (condition === undefined) continue;
      if (field === "AND" || field === "OR") {
        const nodes = Array.isArray(condition) ? condition : [condition];
        parts.push(
          nodes.length
            ? `(${nodes.map((n) => compile(n as Prisma.CrimeIncidentWhereInput, alias, names)).join(field === "AND" ? " AND " : " OR ")})`
            : field === "AND"
              ? "TRUE"
              : "FALSE",
        );
        continue;
      }
      if (field === "offenseDefinition") {
        parts.push(
          `EXISTS (SELECT 1 FROM offense_definitions d WHERE d.id=c.offense_definition_id AND ${compile(condition as Prisma.CrimeIncidentWhereInput, "d", { label: "label" })})`,
        );
        continue;
      }
      const name = names[field];
      if (!name) throw new Error(`Unsupported analytical filter: ${field}`);
      const column = `${alias}.${name}`;
      if (
        typeof condition !== "object" ||
        condition === null ||
        condition instanceof Date
      ) {
        parts.push(`${column} = ${bind(condition)}`);
        continue;
      }
      const values = condition as Record<string, unknown>;
      for (const [operator, value] of Object.entries(values)) {
        if (operator === "mode") continue;
        if (operator === "equals")
          parts.push(
            values.mode === "insensitive"
              ? `LOWER(${column}) = LOWER(${bind(value)})`
              : `${column} = ${bind(value)}`,
          );
        else if (operator === "contains" || operator === "startsWith")
          parts.push(
            `${column} ${values.mode === "insensitive" ? "ILIKE" : "LIKE"} ${bind(operator === "contains" ? `%${value}%` : `${value}%`)}`,
          );
        else if (operator === "gte" || operator === "lte" || operator === "lt")
          parts.push(
            `${column} ${{ gte: ">=", lte: "<=", lt: "<" }[operator]} ${bind(value)}`,
          );
        else throw new Error(`Unsupported analytical operator: ${operator}`);
      }
    }
    return parts.length ? `(${parts.join(" AND ")})` : "TRUE";
  }
  return { text: compile(where), parameters, bind };
}
const representatives =
  "SELECT DISTINCT ON (incident_id) * FROM matched ORDER BY incident_id,date_committed,id";
function matching(where: Prisma.CrimeIncidentWhereInput) {
  const query = crimeWhereSql(where);
  return {
    ...query,
    text: `SELECT c.id,c.incident_id,c.crime_type,c.felony_stage,c.barangay,c.date_committed,c.time_committed,d.label AS offense_category FROM crime_incidents c JOIN offense_definitions d ON d.id=c.offense_definition_id WHERE ${query.text}`,
  };
}

type Stats = ReturnType<typeof aggregateCrimeStats>;
export async function loadCrimeStats(
  where: Prisma.CrimeIncidentWhereInput,
  client: PrismaClient,
  now = new Date(),
): Promise<Stats> {
  const recent = new Date(now);
  recent.setDate(recent.getDate() - 7);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const query = matching(where);
  const [result] = await client.$queryRawUnsafe<
    Array<{ data: Omit<Stats, "safetyIndex" | "activity"> }>
  >(
    `
    WITH matched AS (${query.text}), representatives AS (${representatives}),
    parents AS (
      SELECT i.id,i.has_multiple_offenses,
        BOOL_AND(LOWER(BTRIM(COALESCE(c.case_status,''))) IN ('cleared','solved','archived','closed')) AS resolved,
        MAX(c.updated_at) AS updated
      FROM incidents i JOIN crime_incidents c ON c.incident_id=i.id
      WHERE i.id IN (SELECT incident_id FROM representatives) GROUP BY i.id
    ), incident_months AS (
      SELECT months.month,COUNT(r.id)::integer AS count FROM generate_series(1,12) months(month)
      LEFT JOIN representatives r ON EXTRACT(MONTH FROM r.date_committed)=months.month GROUP BY months.month
    ), offense_months AS (
      SELECT months.month,COUNT(r.id)::integer AS count FROM generate_series(1,12) months(month)
      LEFT JOIN matched r ON EXTRACT(MONTH FROM r.date_committed)=months.month GROUP BY months.month
    )
    SELECT json_build_object(
      'totalCrimes',(SELECT COUNT(*)::integer FROM representatives),
      'totalIncidents',(SELECT COUNT(*)::integer FROM representatives),
      'totalOffenses',(SELECT COUNT(*)::integer FROM matched),
      'multipleOffenseIncidents',(SELECT COUNT(*)::integer FROM parents WHERE has_multiple_offenses),
      'activeCases',(SELECT COUNT(*)::integer FROM parents WHERE NOT resolved),
      'resolvedToday',(SELECT COUNT(*)::integer FROM parents WHERE resolved AND updated >= ${query.bind(today)} AND updated < ${query.bind(tomorrow)}),
      'recentCrimes',(SELECT COUNT(*)::integer FROM representatives WHERE date_committed >= ${query.bind(recent)} AND date_committed <= ${query.bind(now)}),
      'crimesByType',COALESCE((SELECT json_agg(t) FROM (SELECT crime_type AS type,COUNT(*)::integer AS count FROM matched GROUP BY crime_type) t),'[]'::json),
      'offensesByCategory',COALESCE((SELECT json_agg(t) FROM (SELECT offense_category AS category,COUNT(*)::integer AS count FROM matched GROUP BY offense_category) t),'[]'::json),
      'offensesByBarangay',COALESCE((SELECT json_agg(t) FROM (SELECT barangay,COUNT(*)::integer AS count FROM matched GROUP BY barangay) t),'[]'::json),
      'crimesByStage',COALESCE((SELECT json_agg(t) FROM (SELECT felony_stage AS stage,COUNT(*)::integer AS count FROM matched GROUP BY felony_stage) t),'[]'::json),
      'crimesByBarangay',COALESCE((SELECT json_agg(t) FROM (SELECT barangay,COUNT(*)::integer AS count FROM representatives GROUP BY barangay) t),'[]'::json),
      'monthlyStats',(SELECT json_agg(t ORDER BY month) FROM incident_months t),
      'monthlyOffenseStats',(SELECT json_agg(t ORDER BY month) FROM offense_months t)
    ) AS data`,
    ...query.parameters,
  );
  const stats = result.data;
  stats.offensesByCategory.sort(
    (a, b) => b.count - a.count || a.category.localeCompare(b.category),
  );
  stats.offensesByBarangay.sort(
    (a, b) => b.count - a.count || a.barangay.localeCompare(b.barangay),
  );
  stats.crimesByType.sort(
    (a, b) => b.count - a.count || a.type.localeCompare(b.type),
  );
  stats.crimesByStage.sort(
    (a, b) => b.count - a.count || a.stage.localeCompare(b.stage),
  );
  stats.crimesByBarangay.sort(
    (a, b) => b.count - a.count || a.barangay.localeCompare(b.barangay),
  );
  return {
    ...stats,
    activity: stats.monthlyStats.map((row) => row.count),
    safetyIndex: stats.totalIncidents
      ? `${Math.round(((stats.totalIncidents - stats.activeCases) / stats.totalIncidents) * 100)}%`
      : "100%",
  };
}

export async function loadCrimeTimeline(
  where: Prisma.CrimeIncidentWhereInput,
  client: PrismaClient,
): Promise<ReturnType<typeof incidentTimeline>> {
  const query = matching(where);
  const [result] = await client.$queryRawUnsafe<
    Array<{
      data: {
        buckets: Array<{ date: string; hour: number | null; count: number }>;
        totalIncidents: number;
        totalOffenses: number;
      };
    }>
  >(
    `
    WITH matched AS (${query.text}), representatives AS (${representatives}),
    timed AS (SELECT date_committed,
      CASE WHEN BTRIM(time_committed) ~ '^([0-9]{1,2}):' THEN
        CASE WHEN SPLIT_PART(BTRIM(time_committed),':',1)::integer BETWEEN 0 AND 23
        THEN SPLIT_PART(BTRIM(time_committed),':',1)::integer ELSE NULL END ELSE NULL END AS hour FROM representatives),
    buckets AS (SELECT date_committed AS date,hour,COUNT(*)::integer AS count FROM timed GROUP BY date_committed,hour)
    SELECT json_build_object('buckets',COALESCE((SELECT json_agg(t ORDER BY date DESC,hour ASC NULLS LAST) FROM buckets t),'[]'::json),
      'totalIncidents',(SELECT COUNT(*)::integer FROM representatives),'totalOffenses',(SELECT COUNT(*)::integer FROM matched)) AS data`,
    ...query.parameters,
  );
  return {
    ...result.data,
    totalCrimes: result.data.totalIncidents,
    buckets: result.data.buckets.map((row) => ({
      ...row,
      date: new Date(row.date + "Z").toISOString(),
    })),
  };
}

// Dictionary encoding reduces repeated labels, dates and source descriptions on
// the database connection. The API still returns ordinary, complete chart rows.
const dictionaryFields = [
  "blotterNo",
  "barangay",
  "dateCommitted",
  "timeCommitted",
  "dateReported",
  "timeReported",
  "createdAt",
  "updatedAt",
  "incidentType",
  "sourceIncidentType",
  "stageOfFelony",
  "sourceStageOfFelony",
  "offense",
  "caseStatus",
  "modus",
  "typeOfPlace",
] as const;
const directFields = [
  "id",
  "incidentId",
  "latitude",
  "longitude",
  "isCrime",
  "offenseCount",
  "hasMultipleOffenses",
  "incidentCleared",
  "incidentResolved",
] as const;

/** Chart rows exclude register-only fields, without truncating offense records. */
export async function loadCrimeAnalysis(
  where: Prisma.CrimeIncidentWhereInput,
  client: PrismaClient,
  limit: number,
  offset: number,
): Promise<
  Array<
    Omit<
      import("../../lib/api").CrimeIncident,
      "dateCommitted" | "dateReported" | "createdAt" | "updatedAt"
    > & {
      dateCommitted: Date;
      dateReported: Date;
      createdAt: Date;
      updatedAt: Date;
    }
  >
> {
  const query = crimeWhereSql(where);
  // These identifiers are constants above, never user-supplied SQL.
  const dictionaryValues = dictionaryFields
    .map((field) => `(t."${field}"::text)`)
    .join(",");
  const packedValues = [
    ...directFields.map((field) => `t."${field}"`),
    ...dictionaryFields.map(
      (field) =>
        `(SELECT code FROM dictionary d WHERE d.value=t."${field}"::text)`,
    ),
  ].join(",");
  const [result] = await client.$queryRawUnsafe<
    Array<{ data: { dictionary: string[]; rows: unknown[][] } }>
  >(
    `
    WITH page AS (SELECT c.* FROM crime_incidents c WHERE ${query.text}
      ORDER BY c.date_committed DESC,c.id ASC LIMIT ${query.bind(limit)} OFFSET ${query.bind(offset)}),
    parents AS (
      SELECT i.id,i.offense_count,i.has_multiple_offenses,
        BOOL_AND(LOWER(BTRIM(COALESCE(c.case_status,'')))='cleared') AS cleared,
        BOOL_AND(LOWER(BTRIM(COALESCE(c.case_status,''))) IN ('cleared','solved','archived','closed')) AS resolved
      FROM incidents i JOIN crime_incidents c ON c.incident_id=i.id
      WHERE i.id IN (SELECT incident_id FROM page) GROUP BY i.id
    ), data AS (
      SELECT c.id,c.incident_id AS "incidentId",c.blotter_no AS "blotterNo",c.barangay,
        c.date_committed AS "dateCommitted",c.time_committed AS "timeCommitted",
        c.date_reported AS "dateReported",c.time_reported AS "timeReported",
        c.created_at AS "createdAt",c.updated_at AS "updatedAt",c.is_crime AS "isCrime",
        c.crime_type AS "incidentType",c.incident_type AS "sourceIncidentType",
        c.felony_stage AS "stageOfFelony",c.stage_of_felony AS "sourceStageOfFelony",c.offense,
        c.case_status AS "caseStatus",c.modus,c.type_of_place AS "typeOfPlace",c.lat AS latitude,c.lng AS longitude,
        p.offense_count AS "offenseCount",p.has_multiple_offenses AS "hasMultipleOffenses",
        p.cleared AS "incidentCleared",p.resolved AS "incidentResolved"
      FROM page c JOIN parents p ON p.id=c.incident_id
    ), texts AS (
      SELECT DISTINCT value FROM data t CROSS JOIN LATERAL (VALUES ${dictionaryValues}) labels(value) WHERE value IS NOT NULL
    ), dictionary AS (SELECT value,ROW_NUMBER() OVER (ORDER BY value)-1 AS code FROM texts)
    SELECT json_build_object(
      'dictionary',COALESCE((SELECT json_agg(value ORDER BY code) FROM dictionary),'[]'::json),
      'rows',COALESCE((SELECT json_agg(json_build_array(${packedValues}) ORDER BY t."dateCommitted" DESC,t.id ASC) FROM data t),'[]'::json)
    ) AS data`,
    ...query.parameters,
  );
  return result.data.rows.map((values) => {
    const record: Record<string, unknown> = {};
    directFields.forEach((field, index) => {
      record[field] = values[index];
    });
    dictionaryFields.forEach((field, index) => {
      const code = values[index + directFields.length];
      record[field] =
        code === null ? null : result.data.dictionary[Number(code)];
    });
    const row = record as unknown as import("../../lib/api").CrimeIncident;
    return {
      ...row,
      crimeType: row.incidentType,
      dateCommitted: new Date(row.dateCommitted + "Z"),
      dateReported: new Date(row.dateReported + "Z"),
      createdAt: new Date(row.createdAt + "Z"),
      updatedAt: new Date(row.updatedAt + "Z"),
    };
  });
}
