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
import { loadIncidentWorkbook } from "./fixtures/incident-workbook";

const url = process.env.TEST_DATABASE_URL;

const databaseTest = url ? test : test.skip;
databaseTest(
  "migration, recovery, concurrent re-imports and offense lifecycle",
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
        "DROP TABLE IF EXISTS crime_incidents, incidents, offense_definitions CASCADE",
      );
      await pool.query(
        readFileSync("tests/fixtures/legacy-crime-incidents.sql", "utf8"),
      );
      const workbook = loadIncidentWorkbook();
      const records: CrimeInput[] = XLSX.utils
        .sheet_to_json<Record<string, unknown>>(workbook.Sheets.Sheet1, {
          defval: "",
        })
        .map((row, i) => {
          const r = Object.fromEntries(
            Object.entries(row).map(([k, v]) => [normaliseHeader(k), v]),
          );
          return {
            blotterNo: String(r.blotter_no),
            stn: String(r.station),
            barangay: String(r.barangay),
            incidentType: String(r.incident_type),
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
      // Reproduce the previous importer: preserve the first offense for each blotter.
      const legacy = [
        ...new Map(
          [...records].reverse().map((r) => [r.blotterNo, r]),
        ).values(),
      ];
      for (let i = 0; i < legacy.length; i++) {
        const r = legacy[i];
        await pool.query(
          "INSERT INTO crime_incidents(id,blotter_no,station,barangay,date_committed,time_committed,date_reported,time_reported,incident_type,offense,stage_of_felony,section,case_status,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,CURRENT_TIMESTAMP)",
          [
            `legacy-${i}`,
            r.blotterNo,
            r.stn,
            r.barangay,
            r.dateCommitted,
            r.timeCommitted,
            r.dateReported,
            r.timeReported,
            r.incidentType,
            r.offense,
            r.stageOfFelony,
            r.section,
            r.caseStatus,
          ],
        );
      }
      await pool.query(
        readFileSync(
          "backend/prisma/migrations/20261012000000_incident_offense_relationships/migration.sql",
          "utf8",
        ),
      );
      assert.equal(await client.incident.count(), 363);
      assert.equal(await client.crimeIncident.count(), 363);
      const before = await client.crimeIncident.findMany();
      assert.ok(
        before.every((r) => r.importKey === offenseImportKey(r)),
        "SQL migration and runtime fingerprints must agree",
      );
      const recovered = await insertCrimeRecords(records, client);
      assert.equal(recovered.length, 61);
      assert.equal(await client.crimeIncident.count(), 424);
      assert.equal(await client.incident.count(), 363);
      assert.equal(
        await client.incident.count({ where: { hasMultipleOffenses: true } }),
        47,
      );
      const concurrent = await Promise.all([
        insertCrimeRecords(records, client),
        insertCrimeRecords(records, client),
      ]);
      assert.deepEqual(
        concurrent.map((r) => r.length),
        [0, 0],
      );
      process.env.DATABASE_URL = url;
      const { CrimeService } =
        await import("../backend/services/crime.service");
      const stats = await CrimeService.getStats({ year: "2026" });
      assert.equal(stats.totalIncidents, 363);
      assert.equal(stats.totalOffenses, 424);
      assert.equal(stats.multipleOffenseIncidents, 47);
      const sahud = await CrimeService.getStats({
        year: "2026",
        barangay: "SAHUD ULAN",
      });
      assert.equal(sahud.totalIncidents, 25);
      assert.equal(sahud.totalOffenses, 32);
      const barangays = await CrimeService.getBarangayCounts({ year: "2026" });
      assert.equal(barangays.barangayCounts["SAHUD ULAN"], 25);
      assert.equal(barangays.barangayOffenseCounts["SAHUD ULAN"], 32);
      assert.equal(
        (
          await CrimeService.getStats({
            year: "2026",
            offenseCategory: "Murder",
          })
        ).totalOffenses,
        9,
      );
      for (const [stage, total] of [
        ["CONSUMMATED", 4],
        ["FRUSTRATED", 4],
        ["ATTEMPTED", 1],
      ] as const) {
        const scope = {
          year: "2026",
          offenseCategory: "Murder",
          stageOfFelony: stage,
        };
        assert.equal((await CrimeService.getStats(scope)).totalOffenses, total);
        assert.equal(
          (await CrimeService.getCrimes({ ...scope, view: "analysis" })).length,
          total,
        );
        assert.equal(
          (await CrimeService.getHourlyTimeline(scope)).totalOffenses,
          total,
        );
      }
      const { loadCrimeStats, loadCrimeTimeline } =
        await import("../backend/lib/crime-query-aggregates");
      const { aggregateCrimeStats, incidentTimeline } =
        await import("../backend/lib/crime-analytics");
      const referenceRows = await client.crimeIncident.findMany({
        where: { isCrime: true },
        orderBy: [{ dateCommitted: "asc" }, { id: "asc" }],
        include: { incident: { include: { offenses: true } } },
      });
      const clock = new Date("2026-10-13T12:00:00Z");
      assert.deepEqual(
        await loadCrimeStats({ isCrime: true }, client, clock),
        aggregateCrimeStats(referenceRows, clock),
      );
      assert.deepEqual(
        await loadCrimeTimeline({ isCrime: true }, client),
        incidentTimeline(referenceRows),
      );
      assert.equal(
        (
          await loadCrimeStats(
            {
              crimeType: {
                equals: "Light Threats'; DROP TABLE incidents; --",
                mode: "insensitive",
              },
            },
            client,
          )
        ).totalOffenses,
        0,
      );
      assert.equal(
        stats.monthlyStats.reduce((n, r) => n + r.count, 0),
        363,
      );
      assert.equal(
        stats.crimesByType.reduce((n, r) => n + r.count, 0),
        424,
      );
      const filtered = await CrimeService.getStats({
        year: "2026",
        incidentType: "Frustrated Murder",
      });
      assert.equal(filtered.totalIncidents, 4);
      assert.equal(filtered.totalOffenses, 4);
      assert.equal(
        filtered.monthlyStats.reduce((n, r) => n + r.count, 0),
        4,
      );
      const scoped = await CrimeService.getStats({
        year: "2026",
        startDate: "2026-01-01T00:00:00Z",
        endDate: "2026-01-01T23:59:59Z",
        hour: "17",
      });
      assert.equal(scoped.totalIncidents, 1);
      assert.equal(scoped.totalOffenses, 3);
      assert.equal(scoped.monthlyStats[0].count, 1);
      const frustrated = await CrimeService.getStats({
        year: "2026",
        stageOfFelony: "FRUSTRATED",
      });
      assert.equal(frustrated.totalOffenses, 9);
      const timeline = await CrimeService.getHourlyTimeline({ year: "2026" });
      assert.equal(
        timeline.buckets.reduce((n, b) => n + b.count, 0),
        363,
      );
      const narrow = await CrimeService.getCrimes({
        year: "2026",
        incidentType: "Light Threats",
        startDateCommitted: "2026-01-01T00:00:00Z",
        endDateCommitted: "2026-01-01T23:59:59Z",
      });
      assert.equal(narrow.length, 1);
      assert.equal(narrow[0].offenseCount, 3);
      assert.equal(narrow[0].hasMultipleOffenses, true);
      const compact = await CrimeService.getCrimes({
        year: "2026",
        view: "analysis",
        limit: 2000,
      });
      assert.equal(compact.length, 424);
      const complete = await CrimeService.getCrimes({
        year: "2026",
        limit: 2000,
      });
      const chartFields = (row: (typeof compact)[number]) => ({
        id: row.id,
        incidentId: row.incidentId,
        blotter: row.blotterNo,
        date: row.dateCommitted.toISOString(),
        time: row.timeCommitted,
        label: row.incidentType,
        source: row.sourceIncidentType,
        offense: row.offense,
        stage: row.stageOfFelony,
        sourceStage: row.sourceStageOfFelony,
        barangay: row.barangay,
        modus: row.modus,
        place: row.typeOfPlace,
        count: row.offenseCount,
        multiple: row.hasMultipleOffenses,
        cleared: row.incidentCleared,
        resolved: row.incidentResolved,
      });
      assert.deepEqual(
        compact.map(chartFields),
        complete.map(chartFields),
        "dictionary transfer preserves every chart and drill-down value",
      );
      assert.ok(
        compact.every(
          (row) =>
            row.incidentId &&
            row.sourceIncidentType &&
            typeof row.incidentResolved === "boolean",
        ),
      );
      assert.equal(
        "suspectMotive" in compact[0],
        false,
        "unused register fields are excluded from chart payloads",
      );
      const example = await client.incident.findFirstOrThrow({
        where: { blotterNo: "042120000-202601-0002" },
        include: { offenses: true },
      });
      assert.equal(example.offenseCount, 3);
      assert.equal(example.hasMultipleOffenses, true);
      assert.equal(
        (
          await CrimeService.getCrimes({
            incidentId: example.id,
            view: "analysis",
          })
        ).length,
        3,
      );
      assert.deepEqual(
        example.offenses.map((r) => r.crimeType).sort(),
        [
          "Alarms And Scandals",
          "Firearms and Ammunition Law (RA 10591)",
          "Light Threats",
        ].sort(),
      );
      const stages = await client.crimeIncident.groupBy({
        by: ["felonyStage"],
        _count: { _all: true },
      });
      assert.deepEqual(
        Object.fromEntries(stages.map((s) => [s.felonyStage, s._count._all])),
        { ATTEMPTED: 1, CONSUMMATED: 414, FRUSTRATED: 9 },
      );
      await updateCrimeRecord(
        example.offenses[0].id,
        { stageOfFelony: "ATTEMPTED" },
        client,
      );
      const changed = await client.crimeIncident.findUniqueOrThrow({
        where: { id: example.offenses[0].id },
      });
      assert.ok(changed.crimeType.startsWith("Attempted "));
      assert.equal(changed.incidentType, "(Incident) Alarms and scandals");
      for (const r of example.offenses.slice(1))
        await deleteCrimeRecord(r.id, client);
      const parent = await client.incident.findUniqueOrThrow({
        where: { id: example.id },
      });
      assert.equal(parent.offenseCount, 1);
      assert.equal(parent.hasMultipleOffenses, false);
      const fresh = [
        {
          ...records[0],
          blotterNo: "concurrent-new",
          offense: "MURDER - RPC ART. 248",
          stageOfFelony: "CONSUMMATED",
        },
        {
          ...records[0],
          blotterNo: "concurrent-new",
          offense: "LIGHT THREATS - RPC ART. 283",
          stageOfFelony: "CONSUMMATED",
        },
      ];
      const firstImports = await Promise.all([
        insertCrimeRecords(fresh, client),
        insertCrimeRecords(fresh, client),
      ]);
      assert.equal(
        firstImports.reduce((n, r) => n + r.length, 0),
        2,
      );
      const target = await client.crimeIncident.findFirstOrThrow({
        where: {
          blotterNo: "concurrent-new",
          offense: "MURDER - RPC ART. 248",
        },
      });
      await Promise.all([
        updateCrimeRecord(
          target.id,
          { blotterNo: "concurrent-target" },
          client,
        ),
        updateCrimeRecord(
          target.id,
          { offense: "THEFT - RPC ART. 308" },
          client,
        ),
        updateCrimeRecord(target.id, { stageOfFelony: "FRUSTRATED" }, client),
      ]);
      const edited = await client.crimeIncident.findUniqueOrThrow({
        where: { id: target.id },
      });
      assert.equal(edited.crimeType, "Frustrated Theft");
      assert.equal(edited.blotterNo, "concurrent-target");
      const badCounts = await pool.query(
        "SELECT i.id FROM incidents i LEFT JOIN crime_incidents c ON c.incident_id=i.id GROUP BY i.id HAVING i.offense_count<>COUNT(c.id) OR i.has_multiple_offenses<>(COUNT(DISTINCT c.offense_definition_id)>1)",
      );
      assert.equal(
        badCounts.rows.length,
        0,
        "concurrent edits must refresh every affected parent",
      );
      // A preserved legacy duplicate may have no import key; it must still block re-import.
      await client.crimeIncident.create({
        data: { ...edited, id: "legacy-no-import-key", importKey: null },
      });
      await deleteCrimeRecord(edited.id, client);
      assert.equal((await insertCrimeRecords([edited], client)).length, 0);
      const mixed = await client.crimeIncident.findFirstOrThrow({
        where: { blotterNo: "concurrent-new" },
      });
      await updateCrimeRecord(mixed.id, { caseStatus: "Pending" }, client);
      const mixedResolved = await CrimeService.getCrimes({
        incidentType: "Light Threats",
      });
      assert.equal(
        mixedResolved.find((r) => r.id === mixed.id)?.incidentResolved,
        false,
      );
      const { disconnectPrisma } = await import("../backend/lib/prisma");
      await disconnectPrisma();
    } finally {
      await client.$disconnect();
      await pool.end();
    }
  },
);
