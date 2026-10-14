import { basename } from "node:path";
import XLSX from "xlsx";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../backend/lib/generated/prisma";
import { parseCrimeWorkbookRow } from "../backend/lib/crime-workbook";
import {
  insertCrimeRecords,
  offenseImportKey,
} from "../backend/lib/crime-records";
import { generateIncidentKey } from "../backend/lib/crime-deduplication";

// Defaults to inspection. --apply only inserts absent offense signatures; it
// never overwrites existing records or removes records outside this workbook.
const file = process.argv.slice(2).find((arg) => !arg.startsWith("--"));
if (!file)
  throw new Error(
    "Usage: bun scripts/recover-crime-workbook.ts FILE [--apply]",
  );
const workbook = XLSX.readFile(file);
const sheet = workbook.SheetNames[0];
const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
  workbook.Sheets[sheet],
);
const records = rows.map((row, index) =>
  parseCrimeWorkbookRow(row, {
    file: basename(file),
    sheet,
    row: typeof row.__rowNum__ === "number" ? row.__rowNum__ + 1 : index + 2,
  }),
);
const keys = new Set(records.map(offenseImportKey));
if (keys.size !== records.length)
  throw new Error(
    "Workbook contains duplicate offense signatures; review before recovery",
  );

const pool = new Pool({
  connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
  max: 2,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000,
  query_timeout: 120000,
});
const client = new PrismaClient({ adapter: new PrismaPg(pool) });
const signatureFields = {
  id: true,
  blotterNo: true,
  stn: true,
  municipal: true,
  barangay: true,
  dateCommitted: true,
  timeCommitted: true,
  dateReported: true,
  timeReported: true,
  incidentType: true,
  offense: true,
  stageOfFelony: true,
  section: true,
} as const;
async function readSignatures() {
  const rows = await client.crimeIncident.findMany({
    select: { id: true, importKey: true },
  });
  const legacy = rows.filter((row) => !row.importKey);
  const fallback = legacy.length
    ? await client.crimeIncident.findMany({
        where: { id: { in: legacy.map((row) => row.id) } },
        select: signatureFields,
      })
    : [];
  const fallbackKeys = new Map(
    fallback.map((row) => [row.id, offenseImportKey(row)]),
  );
  return rows.map((row) => ({
    id: row.id,
    key: row.importKey || fallbackKeys.get(row.id)!,
  }));
}
try {
  console.log(
    JSON.stringify({
      phase: "reading-existing-signatures",
      sourceRows: records.length,
    }),
  );
  const existing = await readSignatures();
  const existingKeys = new Set(existing.map((row) => row.key));
  const missing = records.filter(
    (record) => !existingKeys.has(offenseImportKey(record)),
  );
  console.log(
    JSON.stringify({
      mode: process.argv.includes("--apply") ? "apply" : "inspect",
      sourceIncidents: new Set(records.map(generateIncidentKey)).size,
      sourceOffenses: records.length,
      existingOffenses: existing.length,
      matchedSourceOffenses: records.length - missing.length,
      missingSourceOffenses: missing.length,
    }),
  );
  if (process.argv.includes("--apply")) {
    let inserted = 0;
    for (let offset = 0; offset < missing.length; offset += 250) {
      inserted += (
        await insertCrimeRecords(missing.slice(offset, offset + 250), client)
      ).length;
    }
    const after = await readSignatures();
    const afterKeys = new Set(after.map((row) => row.key));
    const missingAfter = records.filter(
      (record) => !afterKeys.has(offenseImportKey(record)),
    ).length;
    const preservedIds = new Set(after.map((record) => record.id));
    if (
      missingAfter ||
      existing.some((record) => !preservedIds.has(record.id))
    ) {
      throw new Error(
        "Recovery verification failed: source signatures or pre-existing IDs are missing",
      );
    }
    console.log(
      JSON.stringify({
        inserted,
        sourceCoverage: records.length - missingAfter,
        preservedExistingRecords: existing.length,
        totalOffenses: after.length,
      }),
    );
  }
} finally {
  await client.$disconnect();
  await pool.end();
}
