import { test } from "node:test";
import assert from "node:assert/strict";
import type { CrimeIncident } from "../lib/api";
import { groupCaseIncidents, filterCaseGroups, findCaseDeepLink, mergeCaseOffenses, caseBlotterLabel, createCaseRequestGuard } from "../lib/case-grouping";

function offense(id: string, changes: Partial<CrimeIncident> = {}): CrimeIncident {
  return {
    id, incidentId: "incident-one", blotterNo: "2026-001", stn: "Tanza MPS",
    municipal: "Tanza", barangay: "Punta I", street: "Main Street",
    dateReported: "2026-01-01", timeReported: "10:00", dateCommitted: "2026-01-01",
    timeCommitted: "09:00", incidentType: "(Incident) Shooting", crimeType: "Murder",
    stageOfFelony: "CONSUMMATED", isCrime: true, caseStatus: "Pending",
    createdAt: "2026-01-01", updatedAt: "2026-01-01", ...changes,
  };
}

test("three offenses share one blotter row and keep individual details", () => {
  const groups = groupCaseIncidents([offense("a"), offense("b", { crimeType: "Frustrated Murder", stageOfFelony: "FRUSTRATED" }), offense("c", { crimeType: "Attempted Murder", stageOfFelony: "ATTEMPTED" })]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].offenseCount, 3);
  assert.equal(groups[0].hasMultipleOffenses, true);
  assert.deepEqual(groups[0].offenses.map(row => row.id), ["a", "b", "c"]);
  assert.equal(caseBlotterLabel(groups[0].representative), "2026-001");
});

test("legacy blotter grouping is scoped to station and municipality", () => {
  const groups = groupCaseIncidents([
    offense("a", { incidentId: undefined }), offense("b", { incidentId: undefined }),
    offense("c", { incidentId: undefined, stn: "Other MPS" }),
    offense("d", { incidentId: undefined, municipal: "Other Town" }),
  ]);
  assert.deepEqual(groups.map(group => group.offenses.length), [2, 1, 1]);
});

test("missing blotter numbers never collapse unrelated legacy records or reveal database ids", () => {
  const groups = groupCaseIncidents([offense("secret-a", { incidentId: undefined, blotterNo: "" }), offense("secret-b", { incidentId: undefined, blotterNo: undefined })]);
  assert.equal(groups.length, 2);
  assert.equal(caseBlotterLabel(groups[0].representative), "Not recorded");
});

test("narrow offense filters retain full parent count without claiming complete siblings or cleared status", () => {
  const group = groupCaseIncidents([offense("a", { offenseCount: 3, hasMultipleOffenses: true, caseStatus: "Cleared", incidentCleared: false, incidentResolved: false })])[0];
  assert.equal(group.offenseCount, 3);
  assert.equal(group.complete, false);
  assert.equal(group.matchingOffenses.length, 1);
  assert.equal(group.status, "Multiple statuses");
  const full = mergeCaseOffenses(group, [offense("b"), offense("c")]);
  assert.equal(full.complete, true);
  assert.equal(full.offenses.length, 3);
  assert.equal(full.matchingOffenses.length, 1);
});

test("group status reflects mixed siblings and full parent cleared flags", () => {
  assert.equal(groupCaseIncidents([offense("a", { caseStatus: "Cleared" }), offense("b")])[0].status, "Multiple statuses");
  assert.equal(groupCaseIncidents([offense("a", { offenseCount: 3, incidentCleared: true, caseStatus: "Cleared" })])[0].status, "Cleared");
});

test("search matches blotter and location or individual analytical offenses without searching database ids", () => {
  const groups = groupCaseIncidents([offense("secret-a"), offense("b", { crimeType: "Illegal Possession of Firearms" })]);
  assert.equal(filterCaseGroups(groups, "2026-001")[0].matchingOffenses.length, 2);
  assert.equal(filterCaseGroups(groups, "main street").length, 1);
  assert.deepEqual(filterCaseGroups(groups, "firearms")[0].matchingOffenses.map(row => row.id), ["b"]);
  assert.equal(filterCaseGroups(groups, "secret-a").length, 0);
});

test("offense deep links find the parent page and exact child after parent sorting", () => {
  const groups = groupCaseIncidents([offense("a"), offense("b"), offense("newer", { incidentId: "incident-new", blotterNo: "2026-002", dateCommitted: "2026-02-01" })]);
  const link = findCaseDeepLink(groups, "b", 1);
  assert.equal(link?.page, 2);
  assert.equal(link?.offense.id, "b");
  assert.equal(link?.groupKey, groups[1].key);
  assert.equal(findCaseDeepLink(groups, "missing", 20), null);
});

test("sibling expansion ignores other parents and preserves refreshed matching offense details", () => {
  const group = groupCaseIncidents([offense("a", { caseStatus: "Cleared", offenseCount: 2 })])[0];
  const merged = mergeCaseOffenses(group, [offense("a", { caseStatus: "Pending" }), offense("b"), offense("other", { incidentId: "other-parent" })]);
  assert.deepEqual(merged.offenses.map(row => row.id), ["a", "b"]);
  assert.equal(merged.offenses[0].caseStatus, "Cleared");
  assert.equal(merged.status, "Multiple statuses");
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
