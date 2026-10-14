import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMapQueries, mapCrimeParams, mergeBarangayCounts, mergeMapStats, readMapCrimes, readMapResponses } from "../hooks/map-query";

test("hover and shading share category, stage, barangay and midnight hour scopes", () => {
  const [stats] = buildMapQueries({
    selectedYear: 2026, selectedCrimeType: "Murder", selectedFelonyStage: "FRUSTRATED",
    isTimeFilterActive: true, timeFilterDate: new Date(2026, 8, 26), timeFilterHour: 0,
  }, [{ start: new Date(2026, 0, 1), end: new Date(2026, 11, 31) }], "stats", "SAHUD ULAN");
  const [shading] = buildMapQueries({
    selectedYear: 2026, selectedCrimeType: "Murder", selectedFelonyStage: "FRUSTRATED",
    isTimeFilterActive: true, timeFilterDate: new Date(2026, 8, 26), timeFilterHour: 0,
  }, [], "barangay-counts", "SAHUD ULAN");
  assert.equal(stats.get("offenseCategory"), "Murder");
  assert.equal(stats.get("incidentType"), null);
  assert.equal(stats.get("stageOfFelony"), "FRUSTRATED");
  assert.equal(stats.get("hour"), "0");
  assert.equal(stats.get("year"), null, "day scope takes precedence over year");
  assert.equal(stats.get("barangay"), "SAHUD ULAN");
  assert.equal(stats.get("startDate"), shading.get("startDateCommitted"));
  assert.equal(stats.get("endDate"), shading.get("endDateCommitted"));
});

test("period queries merge overlapping selections before adding counts", () => {
  const queries = buildMapQueries({ selectedYear: 2026 }, [
    { start: new Date(2026, 0, 1), end: new Date(2026, 11, 31, 23, 59, 59, 999) },
    { start: new Date(2026, 0, 1), end: new Date(2026, 2, 31) },
  ], "stats");
  assert.equal(queries.length, 1);
});

test("Sahud Ulan keeps 25 incident totals separate from 32 offense rows", () => {
  const result = mergeMapStats([{ totalCrimes: 25, totalIncidents: 25, totalOffenses: 32,
    crimesByType: [{ type: "Frustrated Murder", count: 1 }, { type: "Other", count: 31 }],
    offensesByCategory: [{ category: "Murder", count: 1 }, { category: "Other", count: 31 }] }]);
  assert.equal(result.totalIncidents, 25);
  assert.equal(result.totalOffenses, 32);
  assert.equal(result.crimesByType[1].type, "Murder");
  assert.equal(result.crimesByType.reduce((n, c) => n + c.count, 0), 32);
  const zero = mergeMapStats([{ totalIncidents: 0, totalOffenses: 0, crimesByType: [] }]);
  assert.equal(zero.totalIncidents, 0);
  assert.equal(zero.totalOffenses, 0);
});

test("cancelled hover request cannot complete after a new scope starts", async () => {
  const controller = new AbortController();
  let finish!: (value: Response) => void;
  const pending = readMapResponses("stats", [new URLSearchParams("year=2026")], controller.signal,
    () => new Promise<Response>((resolve) => { finish = resolve; }));
  controller.abort();
  finish(new Response(JSON.stringify({ success: true, data: { totalIncidents: 25, totalOffenses: 32 } })));
  await assert.rejects(pending, { name: "AbortError" });
});

test("barangay offense breakdown and incident shading preserve independent totals", () => {
  const response = [{ barangayCounts: { "SAHUD ULAN": 25 }, barangayOffenseCounts: { "SAHUD ULAN": 32 } }];
  assert.equal(mergeBarangayCounts(response)["SAHUD ULAN"], 25);
  assert.equal(mergeBarangayCounts(response, true)["SAHUD ULAN"], 32);
  assert.deepEqual(mergeBarangayCounts([{ barangayCounts: {}, barangayOffenseCounts: {} }]), {});
});

test("cancelling one hover subscriber keeps another shared GET valid", async () => {
  const originalFetch = globalThis.fetch;
  let finish!: (value: Response) => void;
  let requests = 0;
  globalThis.fetch = (() => {
    requests++;
    return new Promise<Response>((resolve) => { finish = resolve; });
  }) as typeof fetch;
  try {
    const cancelled = new AbortController();
    const active = new AbortController();
    const queries = [new URLSearchParams("year=2026&barangay=shared-request-test")];
    const first = readMapResponses("stats", queries, cancelled.signal);
    const second = readMapResponses("stats", queries, active.signal);
    cancelled.abort();
    finish(new Response(JSON.stringify({ success: true, data: { totalIncidents: 25, totalOffenses: 32 } })));
    await assert.rejects(first, { name: "AbortError" });
    assert.equal((await second)[0].totalOffenses, 32);
    assert.equal(requests, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("map crime markers request the entire scope with an independent hour field", async () => {
  const queries = buildMapQueries({ selectedYear: 2026, selectedCrimeType: "Murder", selectedFelonyStage: "FRUSTRATED",
    isTimeFilterActive: true, timeFilterDate: new Date(2026, 8, 26), timeFilterHour: 12 }, [], "barangay-counts");
  const params = mapCrimeParams(queries[0]);
  assert.equal(params.hour, 12);
  assert.equal(new Date(params.startDateCommitted!).getHours(), 0);
  assert.equal(new Date(params.endDateCommitted!).getHours(), 23);
  assert.equal(params.offenseCategory, "Murder");
  assert.equal(params.stageOfFelony, "FRUSTRATED");
  assert.equal(params.view, "analysis");
  assert.equal(params.limit, undefined);
  const rows = Array.from({ length: 2105 }, (_, id) => ({ id: String(id) }));
  const result = await readMapCrimes(queries, new AbortController().signal, async (requested) => {
    assert.equal(requested.limit, undefined);
    return rows;
  });
  assert.equal(result.length, 2105);
  assert.equal(mapCrimeParams(queries[0], 5).limit, 5, "recent list can stay bounded independently of statistics");
});

test("multi-period safety uses incident case status rather than offense volume", () => {
  const result = mergeMapStats([
    { totalIncidents: 5, totalOffenses: 12, activeCases: 2 },
    { totalIncidents: 3, totalOffenses: 7, activeCases: 1 },
  ]);
  assert.equal(result.safetyIndex, "63%");
  assert.equal(mergeMapStats([{ totalIncidents: 0, activeCases: 0 }]).safetyIndex, "100%");
  assert.equal(mergeMapStats([{ totalIncidents: 25, totalOffenses: 32, safetyIndex: "100%" }]).safetyIndex, "100%");
});
