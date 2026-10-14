import { test } from "node:test";
import assert from "node:assert/strict";

import { buildCrimeWhere } from "../backend/lib/crime-query-filters";
import { fetchCrimes } from "../lib/api";

test("offense category and felony stage are independent predicates", async () => {
  const where = buildCrimeWhere(
    {
      offenseCategory: "Murder",
      stageOfFelony: "ATTEMPTED",
      incidentId: "parent",
    },
    true,
  );
  assert.deepEqual(where.AND, [
    { isCrime: true },
    { incidentId: "parent" },
    { offenseDefinition: { label: { equals: "Murder", mode: "insensitive" } } },
    { felonyStage: "ATTEMPTED" },
  ]);
});
test("offense and stage selections reach the record API including parent identity", async () => {
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
      incidentId: "parent",
    });
    assert.equal(query?.get("offenseCategory"), "Murder");
    assert.equal(query?.get("stageOfFelony"), "FRUSTRATED");
    assert.equal(query?.get("incidentId"), "parent");
  } finally {
    globalThis.fetch = original;
  }
});
