import { test } from "node:test";
import assert from "node:assert/strict";

import { buildCrimeWhere } from "../backend/lib/crime-query-filters";
import { fetchCrimes } from "../lib/api";

test("offense category and felony stage are independent predicates", async () => {
  const where = buildCrimeWhere(
    {
      offenseCategory: "Murder",
      stageOfFelony: "ATTEMPTED",
    },
    true,
  );
  assert.deepEqual(where.AND, [
    { isCrime: true },
    { offenseDefinition: { label: { equals: "Murder", mode: "insensitive" } } },
    { felonyStage: "ATTEMPTED" },
  ]);
});
test("offense, crime type and stage selections reach the record API", async () => {
  const original = globalThis.fetch;
  let query: URLSearchParams | undefined;
  globalThis.fetch = async (input) => {
    query = new URL(String(input), "http://local").searchParams;
    return Response.json({ success: true, data: [] });
  };
  try {
    await fetchCrimes({
      offenseCategory: "Murder",
      stageOfFelony: "FRUSTRATED",
      crimeType: "Frustrated Murder",
    });
    assert.equal(query?.get("offenseCategory"), "Murder");
    assert.equal(query?.get("stageOfFelony"), "FRUSTRATED");
    assert.equal(query?.get("crimeType"), "Frustrated Murder");
    assert.equal(query?.has("incidentId"), false);
    assert.equal(query?.has("incidentType"), false);
  } finally {
    globalThis.fetch = original;
  }
});

test("the offenses on one blotter are found by exact blotter number and station", () => {
  const where = buildCrimeWhere({ blotterNo: " 042120000-202601-0002 ", stn: "Tanza PS" });
  assert.deepEqual(where.AND, [
    { blotterNo: { equals: "042120000-202601-0002", mode: "insensitive" } },
    { stn: { equals: "Tanza PS", mode: "insensitive" } },
  ]);
});
