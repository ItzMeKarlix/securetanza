import { test } from "node:test";
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import { loadOffenseWorkbook } from "./fixtures/offense-workbook";
import { parseCrimeWorkbookRow } from "../backend/lib/crime-workbook";
import { offenseImportKey } from "../backend/lib/crime-records";
import { offenseSourceKey } from "../backend/lib/crime-deduplication";

test("HTTP uploads and workbook recovery preserve all source offenses and provenance", () => {
  const workbook = loadOffenseWorkbook();
  const sheet = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
    workbook.Sheets[sheet],
  );
  const records = rows.map((row, index) =>
    parseCrimeWorkbookRow(row, {
      file: "source.xlsx",
      sheet,
      row: typeof row.__rowNum__ === "number" ? row.__rowNum__ + 1 : index + 2,
    }),
  );
  assert.equal(records.length, 424);
  assert.equal(new Set(records.map(offenseImportKey)).size, 424);
  // 424 offenses on 363 blotters; each offense is still its own record.
  assert.equal(new Set(records.map(offenseSourceKey)).size, 363);
  assert.ok(records.every((row) => !("incidentType" in row)), "Incident Type is no longer imported");
  assert.equal(
    records.filter((row) => row.stageOfFelony === "FRUSTRATED").length,
    9,
  );
  assert.equal(records[2].sourceRow, 4);
  assert.equal(records[2].timeCommitted, "17:20:00");
  assert.throws(
    () =>
      parseCrimeWorkbookRow(
        { ...rows[0], investigator: 77 },
        { file: "source.xlsx", sheet, row: 2 },
      ),
    /must contain text/,
  );
  assert.throws(
    () => parseCrimeWorkbookRow({}, { file: "empty.xlsx", sheet, row: 2 }),
    /Missing required/,
  );
});

test("numeric upload fields preserve zero and reject malformed counts", async () => {
  const { parseNumericField } =
    await import("../backend/lib/import-validation");
  assert.equal(parseNumericField(0, "suspect_count", true), 0);
  assert.equal(parseNumericField("0", "victim_count", true), 0);
  assert.equal(parseNumericField("", "victim_count", true), null);
  assert.equal(parseNumericField("14.40197", "latitude"), 14.40197);
  assert.throws(() => parseNumericField("unknown", "suspect_count", true));
  assert.throws(() => parseNumericField("1.5", "suspect_count", true));
  assert.throws(() => parseNumericField("-1", "victim_count", true));
});
