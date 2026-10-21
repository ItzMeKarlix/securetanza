import { test } from "node:test";
import assert from "node:assert/strict";
import type { OffenseRecord } from "../lib/api";
import { caseBlotterLabel, caseStatusLabel, createCaseRequestGuard, filterOffenses, stageCounts } from "../lib/offense-register";

function offense(id: string, changes: Partial<OffenseRecord> = {}): OffenseRecord {
  return {
    id, blotterNo: "2026-001", stn: "Tanza MPS",
    municipal: "Tanza", barangay: "Punta I", street: "Main Street",
    dateReported: "2026-01-01", timeReported: "10:00", dateCommitted: "2026-01-01",
    timeCommitted: "09:00", crimeType: "Murder", offenseCategory: "Murder",
    offense: "MURDER - RPC ART. 248", stageOfFelony: "CONSUMMATED", isCrime: true,
    caseStatus: "Pending", createdAt: "2026-01-01", updatedAt: "2026-01-01", ...changes,
  };
}

test("three offenses on one blotter stay three separate rows", () => {
  const rows = filterOffenses([
    offense("a"),
    offense("b", { crimeType: "Frustrated Murder", stageOfFelony: "FRUSTRATED" }),
    offense("c", { crimeType: "Attempted Murder", stageOfFelony: "ATTEMPTED" }),
  ], "");
  assert.deepEqual(rows.map((row) => row.id), ["a", "b", "c"]);
  assert.deepEqual(stageCounts(rows), [
    { stage: "CONSUMMATED", count: 1 },
    { stage: "FRUSTRATED", count: 1 },
    { stage: "ATTEMPTED", count: 1 },
  ]);
});

test("the same record loaded twice (two periods) is listed once", () => {
  assert.equal(filterOffenses([offense("a"), offense("a")], "").length, 1);
});

test("search matches the offense, its category, stage, blotter and location — each offense on its own", () => {
  const rows = [
    offense("a", { offense: "THEFT - RPC ART. 308", offenseCategory: "Theft", crimeType: "Theft" }),
    offense("b", { stageOfFelony: "FRUSTRATED", crimeType: "Frustrated Murder" }),
    offense("c", { blotterNo: "2026-099", barangay: "Amaya I", street: "" }),
  ];
  assert.deepEqual(filterOffenses(rows, "theft").map((r) => r.id), ["a"]);
  assert.deepEqual(filterOffenses(rows, "frustrated").map((r) => r.id), ["b"]);
  assert.deepEqual(filterOffenses(rows, "2026-099").map((r) => r.id), ["c"]);
  assert.deepEqual(filterOffenses(rows, "amaya").map((r) => r.id), ["c"]);
  assert.deepEqual(filterOffenses(rows, "a"), filterOffenses(rows, "a"), "search never throws on short input");
  assert.deepEqual(filterOffenses(rows, "b").map((r) => r.id).includes("b"), false, "database ids are not searchable");
});

test("stage counts follow the legal order and include unknown stages", () => {
  assert.deepEqual(stageCounts([offense("a", { stageOfFelony: undefined }), offense("b", { stageOfFelony: "ATTEMPTED" })]), [
    { stage: "ATTEMPTED", count: 1 },
    { stage: "UNKNOWN", count: 1 },
  ]);
});

test("labels for a missing blotter and case statuses", () => {
  assert.equal(caseBlotterLabel(offense("a", { blotterNo: "  " })), "Not recorded");
  assert.equal(caseStatusLabel("solved"), "Cleared");
  assert.equal(caseStatusLabel("Filed in Court"), "Filed in Court");
  assert.equal(caseStatusLabel(undefined), "Pending");
});

test("superseded list or detail responses cannot replace the newer selection", async () => {
  const guard = createCaseRequestGuard();
  const updates: string[] = [];
  let finishOld!: (value: string) => void;
  const oldResult = new Promise<string>(resolve => { finishOld = resolve; });
  const oldRequest = guard.start();
  const oldCompletion = oldResult.then(value => oldRequest.commit(() => updates.push(value)));
  const currentRequest = guard.start();
  currentRequest.commit(() => updates.push("current"));
  finishOld("stale");
  await oldCompletion;
  assert.deepEqual(updates, ["current"]);
});

test("effect cleanup cancels updates from unmounted requests", async () => {
  const guard = createCaseRequestGuard();
  const updates: string[] = [];
  const request = guard.start();
  guard.cancel();
  await Promise.resolve("record").then(value => request.commit(() => updates.push(value)));
  assert.deepEqual(updates, []);
});

test("offenses on one blotter share a row; each stays its own record", async () => {
  const { groupByBlotter } = await import("../lib/offense-register");
  const rows = groupByBlotter([
    offense("a", { offenseCategory: "Theft", caseStatus: "Cleared" }),
    offense("b", { stageOfFelony: "FRUSTRATED", caseStatus: "Pending" }),
    offense("c", { blotterNo: "2026-002" }),
    offense("d", { blotterNo: "2026-001", stn: "Other MPS" }),
    offense("e", { blotterNo: "" }),
    offense("f", { blotterNo: "-" }),
  ]);
  const byIds = rows.map((row) => row.offenses.map((o) => o.id).sort().join(","));
  assert.deepEqual(byIds.sort(), ["a,b", "c", "d", "e", "f"]);
  const shared = rows.find((row) => row.offenses.length === 2)!;
  assert.equal(shared.status, "Multiple statuses");
  assert.equal(shared.stage, null, "different stages are not collapsed into one");
  assert.equal(rows.find((row) => row.primary.id === "c")!.stage, "CONSUMMATED");
});
