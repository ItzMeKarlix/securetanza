import { test } from "node:test";
import assert from "node:assert/strict";

const common = {
  barangay: "PUNTA I",
  dateCommitted: new Date("2026-01-01"),
  timeCommitted: "17:20:00",
  updatedAt: new Date("2026-01-02"),
  caseStatus: "Pending",
  felonyStage: "CONSUMMATED",
};

test("every offense counts on its own, even when two share a blotter", async () => {
  const { aggregateCrimeStats } = await import("../backend/lib/crime-analytics");
  // a and b were recorded on the same blotter; nothing merges them.
  const rows = [
    { ...common, id: "a", crimeType: "Alarms And Scandals" },
    { ...common, id: "b", crimeType: "Light Threats" },
    { ...common, id: "c", crimeType: "Frustrated Homicide", felonyStage: "FRUSTRATED", offenseCategory: "Homicide" },
  ];
  const result = aggregateCrimeStats(rows, new Date("2026-01-02"));
  assert.equal(result.totalOffenses, 3);
  assert.equal(result.crimesByType.reduce((n, r) => n + r.count, 0), 3);
  assert.equal(result.monthlyStats.reduce((n, r) => n + r.count, 0), 3);
  assert.deepEqual(result.offensesByBarangay, [{ barangay: "PUNTA I", count: 3 }]);
  assert.deepEqual(
    Object.fromEntries(result.crimesByStage.map((s) => [s.stage, s.count])),
    { CONSUMMATED: 2, FRUSTRATED: 1 },
  );
  // The stage prefix is not part of the offense category.
  assert.ok(result.offensesByCategory.some((c) => c.category === "Homicide" && c.count === 1));
  assert.equal("totalIncidents" in result, false);
});

test("case status is read per offense", async () => {
  const { aggregateCrimeStats } = await import("../backend/lib/crime-analytics");
  const rows = [
    { ...common, id: "a", crimeType: "Theft", caseStatus: "Cleared", updatedAt: new Date("2026-01-01T12:00:00") },
    { ...common, id: "b", crimeType: "Theft", caseStatus: "Pending" },
    { ...common, id: "c", crimeType: "Theft", caseStatus: "Solved", updatedAt: new Date("2026-01-02T03:00:00") },
  ];
  const result = aggregateCrimeStats(rows, new Date("2026-01-02T12:00:00"));
  assert.equal(result.activeCases, 1);
  assert.equal(result.safetyIndex, "67%");
  assert.equal(result.resolvedToday, 1);
});
