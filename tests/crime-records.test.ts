import { test } from "node:test";
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import { generateCrimeFingerprint } from "../backend/lib/crime-deduplication";
import { normaliseHeader } from "../components/upload/upload-meta";
import { loadOffenseWorkbook } from "./fixtures/offense-workbook";
import {
  fetchCrimes,
  toOffenseSummary,
  type OffenseRecord,
} from "../lib/api";

const record = {
  blotterNo: "042120000-202601-0002",
  stn: "Tanza PS",
  barangay: "PUNTA I",
  dateCommitted: "2026-01-01",
  timeCommitted: "17:20:00",
  dateReported: "2026-01-01",
  timeReported: "18:00:00",
  offense: "ALARMS AND SCANDALS - RPC ART. 155",
  stageOfFelony: "CONSUMMATED",
  section: "",
};

test("different offenses under one blotter are retained", () => {
  assert.notEqual(
    generateCrimeFingerprint(record),
    generateCrimeFingerprint({
      ...record,
      offense: "LIGHT THREATS - RPC ART. 283",
    }),
  );
});
test("felony stage and section distinguish source offense records", () => {
  assert.notEqual(
    generateCrimeFingerprint(record),
    generateCrimeFingerprint({ ...record, stageOfFelony: "ATTEMPTED" }),
  );
  assert.notEqual(
    generateCrimeFingerprint(record),
    generateCrimeFingerprint({ ...record, section: "Section 1" }),
  );
});
test("blotter identity is scoped to station", () => {
  assert.notEqual(
    generateCrimeFingerprint(record),
    generateCrimeFingerprint({ ...record, stn: "Another PS" }),
  );
});
test("normalized re-imports have the same offense identity", () => {
  assert.equal(
    generateCrimeFingerprint(record),
    generateCrimeFingerprint({
      ...record,
      blotterNo: " 042120000-202601-0002 ",
      offense: " alarms  and scandals - rpc art. 155 ",
      stageOfFelony: "consummated",
    }),
  );
});
test("consummated felony stage does not mark a case as cleared", () => {
  const crime = {
    ...record,
    id: "test",
    crimeType: "Alarms And Scandals",
    createdAt: "",
    updatedAt: "",
    isCrime: true,
  } as OffenseRecord;
  assert.equal(toOffenseSummary(crime).status, "Pending");
});
test("analytics reads all pages and hour filtering uses timeCommitted", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async (request) => {
    const url = new URL(String(request), "http://localhost");
    const offset = Number(url.searchParams.get("offset"));
    const page =
      offset === 0
        ? Array.from({ length: 2000 }, (_, i) => ({ ...record, id: String(i) }))
        : [{ ...record, id: "2000" }];
    return Response.json({ success: true, data: page });
  };
  try {
    const records = await fetchCrimes({ startHour: 17, endHour: 17 });
    assert.equal(records.length, 2001);
    assert.equal(records.at(-1)?.id, "2000");
  } finally {
    globalThis.fetch = original;
  }
});
test("the analyzed workbook retains all 424 offense signatures", () => {
  const book = loadOffenseWorkbook();
  const source = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    book.Sheets[book.SheetNames[0]],
    { defval: "" },
  );
  const records = source.map((row) => {
    const r = Object.fromEntries(
      Object.entries(row).map(([k, v]) => [normaliseHeader(k), v]),
    );
    return {
      blotterNo: String(r.blotter_no),
      stn: String(r.station),
      barangay: String(r.barangay),
      dateCommitted: String(r.date_committed),
      timeCommitted: String(r.time_committed),
      dateReported: String(r.date_reported),
      timeReported: String(r.time_reported),
      offense: String(r.offense),
      stageOfFelony: String(r.stage_of_felony),
      section: String(r.section),
    };
  });
  assert.equal(records.length, 424);
  assert.equal(new Set(records.map(generateCrimeFingerprint)).size, 424);
});
