import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyOffense, normalizeFelonyStage } from "../lib/offense-classification";

test("a stabbing is classified by its recorded homicide offense and stage", () => {
  assert.equal(
    classifyOffense(
      "HOMICIDE - RPC ART. 249",
      "FRUSTRATED",
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
test("broad drug statute is not narrowed to sale or possession", () => {
  assert.equal(
    classifyOffense(
      "COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - RA 9165",
      "CONSUMMATED",
    ).crimeType,
    "Dangerous Drugs Law (RA 9165)",
  );
});
test("an offense with no recorded offense text is Unclassified, not guessed", () => {
  const result = classifyOffense("", "CONSUMMATED");
  assert.equal(result.crimeType, "Unclassified");
  assert.equal(result.code, "unclassified");
  assert.equal(result.classificationNeedsReview, true);
});
