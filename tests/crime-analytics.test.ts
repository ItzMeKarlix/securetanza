import { test } from "node:test";
import assert from "node:assert/strict";

test("offense breakdowns and incident metrics reconcile separately", async () => {
  const { aggregateCrimeStats } =
    await import("../backend/lib/crime-analytics");
  const common = {
    barangay: "PUNTA I",
    dateCommitted: new Date("2026-01-01"),
    timeCommitted: "17:20:00",
    updatedAt: new Date("2026-01-02"),
    caseStatus: "Pending",
    felonyStage: "CONSUMMATED",
  };
  const rows = [
    {
      ...common,
      id: "a",
      incidentId: "one",
      crimeType: "Alarms And Scandals",
      incident: { hasMultipleOffenses: true },
    },
    {
      ...common,
      id: "b",
      incidentId: "one",
      crimeType: "Light Threats",
      incident: { hasMultipleOffenses: true },
    },
    {
      ...common,
      id: "c",
      incidentId: "two",
      crimeType: "Light Threats",
      incident: { hasMultipleOffenses: false },
    },
  ];
  const result = aggregateCrimeStats(rows, new Date("2026-01-02"));
  assert.equal(result.totalIncidents, 2);
  assert.equal(result.totalOffenses, 3);
  assert.equal(result.multipleOffenseIncidents, 1);
  assert.equal(
    result.crimesByType.reduce((n, r) => n + r.count, 0),
    3,
  );
  assert.equal(
    result.monthlyStats.reduce((n, r) => n + r.count, 0),
    2,
  );
  assert.equal(result.crimesByBarangay[0].count, 2);
  assert.equal(result.crimesByStage[0].count, 3);
  const filtered = aggregateCrimeStats(
    rows.slice(0, 1),
    new Date("2026-01-02"),
  );
  assert.equal(filtered.totalIncidents, 1);
  assert.equal(filtered.totalOffenses, 1);
  assert.equal(
    filtered.multipleOffenseIncidents,
    1,
    "parent multiplicity is independent of the offense filter",
  );
});
