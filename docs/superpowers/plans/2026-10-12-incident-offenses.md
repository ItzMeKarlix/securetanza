> **Superseded (2026-10-21):** the system no longer groups offenses into incidents. See `docs/offense-only-model.md`. The steps below (including `scripts/recover-crime-workbook.ts`, now removed) no longer apply.

# Incident and offense counting implementation plan

**Goal:** Preserve multiple offenses under a blotter and display unique incidents and recorded offenses independently.

**Spec:** `docs/data-analysis/2026-incident-offense-analysis.md`; user authorized implementation and selected both totals.

**Architecture:** Add Incident and OffenseDefinition parents; retain CrimeIncident as the explicit association/record model to preserve existing record IDs, source fields and routes. Store classification separately from source incidentType, and stage on each offense record. Derive multiple-offense flags from full parent associations, not the current filter.

**Execution:** Implement inline in the shared checkout, preserving existing uncommitted changes. Initial verification used an isolated temporary PostgreSQL database. The subsequent user request to fix fetching authorizes activating the additive migration and recovering source offenses in the configured database. No product dependency additions are required.

## Constraints and counting contracts

- Source incidentType and offense strings remain unchanged. Classification is derived from offense and recorded stage; missing/unknown stages remain explicit.
- Blotter identities are station-scoped. Records without blotters use a composite identity and are not grouped under a blank value.
- Import keys distinguish offense/stage/section within an incident. Identical re-imports do not create records; concurrent imports use database constraints.
- Legacy duplicates remain retained by migration; keys are assigned only where unambiguous. A separate duplicate cleanup stays an explicit operation.
- Main totals and geographic/time/case metrics count incidents. Offense breakdowns and crime matrices count offense records and use explicit labels.
- Preserve complete parent association counts when returning a filtered offense record.

## Tasks

- [x] 1. Add regression tests for offense/stage classification, source preservation, station-scoped fingerprints, exact re-import identity, missing stages, and 363/424/47 workbook reconciliation. Run and confirm expected failures.
- [x] 2. Add shared classification/counting utilities, schema relationships, migration with non-destructive backfill and unique import keys, and transactional offense persistence. Generate Prisma client. Verify migration and writer on temporary PostgreSQL including concurrent duplicate imports and edit/delete flag changes.
- [x] 3. Route upload/manual-create/edit/delete through persistence. Preserve source provenance; update the pruning tool's identity definition and legacy seed path. Verify re-import restores 61 missing associations without duplicating the original 363 records.
- [x] 4. Update cached statistics, lists, filter matching and timelines. Keep stats totalCrimes as a legacy incident-count alias, add totalIncidents/totalOffenses/multipleOffenseIncidents and stage breakdowns. Verify date/hour/type/stage filters affect all aggregate outputs consistently.
- [x] 5. Show both totals and multiple-offense indicators in existing dashboard/register layouts. Update frontend analytics, charts, reports, exports, backups and notifications to use explicit count units. Separate felony stage from case status.
- [x] 6. Run regression/database tests, type checking, targeted lint, production build and a fresh review. Document deployment, re-import and limitations. Record completed checks below.

## Review focus

Unknown legacy offenses/stages; identical offenses under different stations; a multi-offense incident under a narrow offense filter; legacy same-blotter records with conflicting shared fields; concurrent imports and amendments changing stage.

## Execution ledger

Initial: implementation authorized. Preserve existing package.json/bun.lock edits and untracked source workbook/pitch. The reviewed analysis is the design artifact. The source lacks stable offense-record IDs, so changing a stage in a revised workbook is a distinct signature; amendments must edit an existing record rather than silently replacing it during import.

Verification: 14 unit tests pass; PostgreSQL integration checks pass for migration/recovery, concurrent first imports/re-imports, serializable edits, delete/count refresh, nullable legacy duplicate guards and combined date/hour/stage/type scopes. The HTTP regression passes for authentication, malformed numeric/text row isolation, source row numbers after blank rows, source-label preservation, full parent flags and derived-label override rejection. TypeScript and targeted lint pass; production build passes (existing middleware deprecation warning). Desktop 1440×1000 and mobile 390×844 checks show 363 incidents / 424 offenses / 47 multiple-offense incidents, both analytics totals and register indicators, no page errors and no document overflow. Visual review corrected remaining offense-chart captions and mobile filter wrapping, then confirmation passed.

Review: a fresh reviewer identified and confirmed fixes for source-label editing, sibling case-status consistency, import error isolation, source row numbers and concurrent mutation snapshots. Numeric validation also preserves recorded zero counts. Authenticated writes are enforced on edit/delete. Generated Prisma declarations retain generator whitespace; the authored-file diff check passes. The initial implementation did not activate the configured deployment database; the subsequent fetching repair applied the migration and recovered source offenses without modifying the source workbook, as documented in `docs/incident-offense-deployment.md`.

2026-10-13 fetching repair: reproduced HTTP 500 caused by the missing incident_id column in the configured Supabase schema. Fixed root Prisma configuration to load .env.local, applied the targeted migration, and registered its history without replaying unrelated duplicate authentication migrations. Statistics and list requests now return HTTP 200. Shared the upload row parser with a non-destructive recovery command; regression tests verify all 424 signatures, 363 source parents and provenance. Live source reconciliation identified 62 missing signatures against 1,656 pre-existing rows; final recovery/API results are recorded in the deployment document.

Recovery result: inserted 62 absent source signatures, verified 424/424 workbook offense coverage and preservation of all 1,656 existing record IDs. Configured database now contains 1,718 offenses across all years; the running 2026 statistics endpoint returns 366 incidents / 427 offenses / 47 multiple-offense incidents with HTTP 200. Three additional existing incidents/offenses beyond the workbook remain included. The shared-parser regression adds one passing test (15 unit tests now pass); type checking and targeted lint pass.
