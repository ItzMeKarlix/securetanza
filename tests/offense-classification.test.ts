import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifyOffense,
  normalizeFelonyStage,
  uniqueIncidentRecords,
} from "../lib/offense-classification";

test("a stabbing is classified by its recorded homicide offense and stage", () => {
  assert.equal(
    classifyOffense(
      "HOMICIDE - RPC ART. 249",
      "FRUSTRATED",
      "(Incident) Stabbing",
    ).crimeType,
    "Frustrated Homicide",
  );
});
test("reckless imprudence resulting to homicide stays a distinct category", () => {
  assert.equal(
    classifyOffense(
      "RECKLESS IMPRUDENCE RESULTING TO HOMICIDE - RPC ART 365",
      "CONSUMMATED",
    ).crimeType,
    "Reckless Imprudence Resulting To Homicide",
  );
});
test("missing and unrecognized stages do not become consummated", () => {
  assert.equal(normalizeFelonyStage(""), "UNKNOWN");
  assert.equal(normalizeFelonyStage("Cleared"), "UNKNOWN");
  assert.equal(
    classifyOffense("MURDER - RPC ART. 248", null).crimeType,
    "Unknown Stage · Murder",
  );
});
test("broad drug statute is not guessed to be sale or possession from its incident label", () => {
  assert.equal(
    classifyOffense(
      "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - RA 9165",
      "CONSUMMATED",
      "(Operation) Buy Bust",
    ).crimeType,
    "Dangerous Drugs Law (RA 9165)",
  );
});
test("multiple offense records collapse to one parent for incident metrics", () => {
  const rows = [
    { id: "a", incidentId: "one" },
    { id: "b", incidentId: "one" },
    { id: "c", incidentId: "two" },
  ];
  assert.equal(uniqueIncidentRecords(rows).length, 2);
});
