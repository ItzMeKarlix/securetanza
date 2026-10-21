import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../backend/lib/generated/prisma";
import {
  insertCrimeRecords,
  updateCrimeRecord,
  deleteCrimeRecord,
  offenseImportKey,
  type CrimeInput,
} from "../backend/lib/crime-records";
import * as XLSX from "xlsx";
import { normaliseHeader } from "../components/upload/upload-meta";
import { loadOffenseWorkbook } from "./fixtures/offense-workbook";

const url = process.env.TEST_DATABASE_URL;

const databaseTest = url ? test : test.skip;
databaseTest(
  "legacy register migrates to standalone offenses; imports, edits and stats count offenses",
  async () => {
    const parsed = new URL(url!);
    assert.ok(
      ["127.0.0.1", "localhost"].includes(parsed.hostname) &&
        parsed.pathname.startsWith("/securetanza_offense_test"),
      "Use a dedicated local securetanza_offense_test database",
    );
    const pool = new Pool({ connectionString: url });
    const client = new PrismaClient({ adapter: new PrismaPg(pool) });
    try {
      await pool.query(
        "DROP TABLE IF EXISTS offenses, crime_incidents, incidents, offense_definitions CASCADE",
      );
      await pool.query(readFileSync("tests/fixtures/legacy-crime-incidents.sql", "utf8"));
      const workbook = loadOffenseWorkbook();
      const records: CrimeInput[] = XLSX.utils
        .sheet_to_json<Record<string, unknown>>(workbook.Sheets.Sheet1, { defval: "" })
        .map((row, i) => {
          const r = Object.fromEntries(Object.entries(row).map(([k, v]) => [normaliseHeader(k), v]));
          return {
            blotterNo: String(r.blotter_no),
            stn: String(r.station),
            barangay: String(r.barangay),
            offense: String(r.offense),
            stageOfFelony: String(r.stage_of_felony),
            section: String(r.section),
            dateCommitted: new Date(String(r.date_committed)),
            timeCommitted: String(r.time_committed),
            dateReported: new Date(String(r.date_reported)),
            timeReported: String(r.time_reported),
            caseStatus: String(r.case_status),
            sourceFile: "source.xlsx",
            sourceSheet: "Sheet1",
            sourceRow: i + 2,
          };
        });
      // The oldest importer kept only the first offense per blotter, and still
      // stored the workbook's Incident Type.
      const legacy = [...new Map([...records].reverse().map((r) => [r.blotterNo, r])).values()];
      for (let i = 0; i < legacy.length; i++) {
        const r = legacy[i];
        await pool.query(
          "INSERT INTO crime_incidents(id,blotter_no,station,barangay,date_committed,time_committed,date_reported,time_reported,incident_type,offense,stage_of_felony,section,case_status,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CURRENT_TIMESTAMP)",
          [`legacy-${i}`, r.blotterNo, r.stn, r.barangay, r.dateCommitted, r.timeCommitted, r.dateReported, r.timeReported, "(Incident) Recorded", r.offense, r.stageOfFelony, r.section, r.caseStatus],
        );
      }
      for (const migration of ["20261012000000_incident_offense_relationships", "20261021200000_offense_only"]) {
        await pool.query(readFileSync(`backend/prisma/migrations/${migration}/migration.sql`, "utf8"));
      }

      // The incident grouping and Incident Type are gone; every offense survived.
      const leftovers = await pool.query(
        "SELECT to_regclass('incidents') AS incidents, to_regclass('crime_incidents') AS old_table, (SELECT count(*) FROM information_schema.columns WHERE table_name='offenses' AND column_name LIKE 'incident%')::int AS incident_columns",
      );
      assert.deepEqual(leftovers.rows[0], { incidents: null, old_table: null, incident_columns: 0 });
      assert.equal(await client.offense.count(), 363);
      const migrated = await client.offense.findMany();
      assert.ok(
        migrated.every((r) => r.importKey === offenseImportKey(r)),
        "SQL migration and runtime fingerprints must agree",
      );

      // Re-importing the workbook adds only the offenses the old importer dropped.
      assert.equal((await insertCrimeRecords(records, client)).length, 61);
      assert.equal(await client.offense.count(), 424);
      const concurrent = await Promise.all([insertCrimeRecords(records, client), insertCrimeRecords(records, client)]);
      assert.deepEqual(concurrent.map((r) => r.length), [0, 0]);

      process.env.DATABASE_URL = url;
      const { CrimeService } = await import("../backend/services/crime.service");
      const stats = await CrimeService.getStats({ year: "2026" });
      assert.equal(stats.totalOffenses, 424);
      assert.equal(stats.monthlyStats.reduce((n, r) => n + r.count, 0), 424);
      assert.equal(stats.crimesByType.reduce((n, r) => n + r.count, 0), 424);
      assert.deepEqual(
        Object.fromEntries(stats.crimesByStage.map((s) => [s.stage, s.count])),
        { ATTEMPTED: 1, CONSUMMATED: 414, FRUSTRATED: 9 },
      );
      const sahud = await CrimeService.getStats({ year: "2026", barangay: "SAHUD ULAN" });
      assert.equal(sahud.totalOffenses, 32);
      const barangays = await CrimeService.getBarangayCounts({ year: "2026" });
      assert.equal(barangays.barangayCounts["SAHUD ULAN"], 32, "map shading counts offenses");
      assert.equal(barangays.totalOffenses, 424);

      // Offense and stage of felony filter every output the same way.
      assert.equal((await CrimeService.getStats({ year: "2026", offenseCategory: "Murder" })).totalOffenses, 9);
      for (const [stage, total] of [["CONSUMMATED", 4], ["FRUSTRATED", 4], ["ATTEMPTED", 1]] as const) {
        const scope = { year: "2026", offenseCategory: "Murder", stageOfFelony: stage };
        assert.equal((await CrimeService.getStats(scope)).totalOffenses, total);
        assert.equal((await CrimeService.getCrimes({ ...scope, view: "analysis" })).length, total);
        assert.equal((await CrimeService.getHourlyTimeline(scope)).totalOffenses, total);
      }
      assert.equal((await CrimeService.getStats({ year: "2026", crimeType: "Frustrated Murder" })).totalOffenses, 4);
      assert.equal((await CrimeService.getStats({ year: "2026", stageOfFelony: "FRUSTRATED" })).totalOffenses, 9);
      // One blotter listing three offenses counts three, never one.
      const sameBlotter = await CrimeService.getStats({
        year: "2026",
        startDate: "2026-01-01T00:00:00Z",
        endDate: "2026-01-01T23:59:59Z",
        hour: "17",
      });
      assert.equal(sameBlotter.totalOffenses, 3);
      assert.equal(sameBlotter.monthlyStats[0].count, 3);
      const timeline = await CrimeService.getHourlyTimeline({ year: "2026" });
      assert.equal(timeline.buckets.reduce((n, b) => n + b.count, 0), 424);

      // The SQL path and the in-memory definition agree exactly.
      const { loadCrimeStats, loadCrimeTimeline } = await import("../backend/lib/crime-query-aggregates");
      const { aggregateCrimeStats, offenseTimeline } = await import("../backend/lib/crime-analytics");
      const referenceRows = await client.offense.findMany({
        where: { isCrime: true },
        orderBy: [{ dateCommitted: "asc" }, { id: "asc" }],
        include: { offenseDefinition: { select: { label: true } } },
      });
      const clock = new Date("2026-10-13T12:00:00Z");
      assert.deepEqual(await loadCrimeStats({ isCrime: true }, client, clock), aggregateCrimeStats(referenceRows, clock));
      assert.deepEqual(await loadCrimeTimeline({ isCrime: true }, client), offenseTimeline(referenceRows));
      assert.equal(
        (await loadCrimeStats({ crimeType: { equals: "Light Threats'; DROP TABLE offenses; --", mode: "insensitive" } }, client)).totalOffenses,
        0,
      );

      // The compact chart payload carries the same values as full records.
      const compact = await CrimeService.getCrimes({ year: "2026", view: "analysis", limit: 2000 });
      const complete = await CrimeService.getCrimes({ year: "2026", limit: 2000 });
      assert.equal(compact.length, 424);
      const chartFields = (row: (typeof compact)[number]) => ({
        id: row.id,
        blotter: row.blotterNo,
        date: row.dateCommitted.toISOString(),
        time: row.timeCommitted,
        crimeType: row.crimeType,
        category: row.offenseCategory,
        offense: row.offense,
        stage: row.stageOfFelony,
        sourceStage: row.sourceStageOfFelony,
        barangay: row.barangay,
        modus: row.modus,
        place: row.typeOfPlace,
      });
      assert.deepEqual(compact.map(chartFields), complete.map(chartFields));
      assert.equal("suspectMotive" in compact[0], false, "unused register fields are excluded from chart payloads");
      assert.equal("incidentId" in complete[0], false);

      // Editing an offense re-derives its stage-qualified type and key.
      const example = await client.offense.findFirstOrThrow({ where: { blotterNo: "042120000-202601-0002" } });
      await updateCrimeRecord(example.id, { stageOfFelony: "ATTEMPTED" }, client);
      const changed = await client.offense.findUniqueOrThrow({ where: { id: example.id } });
      assert.ok(changed.crimeType.startsWith("Attempted "));
      assert.equal(changed.felonyStage, "ATTEMPTED");
      assert.equal(changed.importKey, offenseImportKey(changed));
      await deleteCrimeRecord(example.id, client);
      assert.equal(await client.offense.count(), 423);

      // Two offenses on one new blotter, imported twice at once, are stored once each.
      const fresh = [
        { ...records[0], blotterNo: "concurrent-new", offense: "MURDER - RPC ART. 248", stageOfFelony: "CONSUMMATED" },
        { ...records[0], blotterNo: "concurrent-new", offense: "LIGHT THREATS - RPC ART. 283", stageOfFelony: "CONSUMMATED" },
      ];
      const firstImports = await Promise.all([insertCrimeRecords(fresh, client), insertCrimeRecords(fresh, client)]);
      assert.equal(firstImports.reduce((n, r) => n + r.length, 0), 2);
      const target = await client.offense.findFirstOrThrow({ where: { blotterNo: "concurrent-new", offense: "MURDER - RPC ART. 248" } });
      await updateCrimeRecord(target.id, { offense: "THEFT - RPC ART. 308", stageOfFelony: "FRUSTRATED" }, client);
      const edited = await client.offense.findUniqueOrThrow({ where: { id: target.id } });
      assert.equal(edited.crimeType, "Frustrated Theft");

      // An old duplicate kept without a key still blocks re-importing that offense.
      await client.offense.create({ data: { ...edited, id: "legacy-no-import-key", importKey: null } });
      await deleteCrimeRecord(edited.id, client);
      assert.equal((await insertCrimeRecords([edited], client)).length, 0);

      const { disconnectPrisma } = await import("../backend/lib/prisma");
      await disconnectPrisma();
    } finally {
      await client.$disconnect();
      await pool.end();
    }
  },
);
