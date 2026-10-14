import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchCrimes } from "../lib/api";
import { presentCrimeRecord } from "../backend/lib/crime-records";
import { aggregateCrimeStats } from "../backend/lib/crime-analytics";
import { readJson } from "../lib/read-json";

test("failed shared reads can be retried without retaining rejected promises", async () => {
  const original = globalThis.fetch;
  let attempts = 0;
  globalThis.fetch = async () =>
    ++attempts === 1
      ? new Response("", { status: 503 })
      : Response.json({ value: "fresh" });
  try {
    await assert.rejects(readJson("/api/crimes?year=2097"), /503/);
    assert.deepEqual(await readJson("/api/crimes?year=2097"), {
      value: "fresh",
    });
  } finally {
    globalThis.fetch = original;
  }
});

test("simultaneous chart consumers share one offense-list request", async () => {
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => {
    requests++;
    await new Promise((resolve) => setTimeout(resolve, 5));
    return Response.json({
      success: true,
      data: [{ id: "performance-fixture", timeCommitted: "17:00:00" }],
    });
  };
  try {
    const results = await Promise.all(
      Array.from({ length: 3 }, () => fetchCrimes({ year: 2098 })),
    );
    assert.equal(requests, 1);
    assert.deepEqual(
      results.map((rows) => rows[0].id),
      Array(3).fill("performance-fixture"),
    );
    await fetchCrimes({ year: 2098 });
    assert.equal(
      requests,
      2,
      "completed data is fetched again so edits cannot stay hidden in a client cache",
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("compact parent summaries preserve case status outside a narrow offense filter", () => {
  const row = {
    id: "a",
    incidentId: "one",
    incidentType: "Stabbing",
    crimeType: "Frustrated Homicide",
    felonyStage: "FRUSTRATED",
    barangay: "PUNTA I",
    dateCommitted: new Date("2026-01-01"),
    timeCommitted: "17:20:00",
    caseStatus: "Cleared",
    updatedAt: new Date("2026-01-02"),
    incident: {
      offenseCount: 3,
      hasMultipleOffenses: true,
      allOffensesCleared: false,
      allOffensesResolved: false,
      lastOffenseUpdatedAt: new Date("2026-01-02"),
    },
  };
  const record = presentCrimeRecord(row);
  assert.equal(record.incidentCleared, false);
  assert.equal(record.incidentResolved, false);
  const stats = aggregateCrimeStats([row], new Date("2026-01-02"));
  assert.equal(stats.totalIncidents, 1);
  assert.equal(stats.totalOffenses, 1);
  assert.equal(stats.multipleOffenseIncidents, 1);
  assert.equal(
    stats.activeCases,
    1,
    "a pending sibling must keep the whole incident active",
  );
});
