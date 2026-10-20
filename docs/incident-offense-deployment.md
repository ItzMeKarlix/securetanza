# Deploying incident and offense counting

The schema now adds `incidents` and `offense_definitions`. Existing `crime_incidents` rows are the explicit association between those tables, retaining their IDs and original `incident_type`, `offense`, and `stage_of_felony` values. `crime_type` and `felony_stage` hold the analytical classification. Each parent has `offense_count` and a boolean `has_multiple_offenses` (exported as 1/0).

## Apply and recover source offenses

Use the deployment's existing backup procedure before a schema migration. From the deployed checkout, with the intended database environment configured:

```sh
bun install
bun run db:generate
bun run db:migrate:deploy
bun run build
```

Restart the application and scheduled worker using the existing service supervisor. The migration preserves every existing record and backfills associations and analytical labels. It does not delete legacy duplicates or invent offenses that were skipped by older imports. Empty parents left after deleting their final offense do not contribute to statistics.

Then upload the authoritative workbook again through the existing upload dialog. With the previous one-row-per-blotter import of the analyzed 2026 workbook, the corrected importer restores 61 missing offenses. Its expected source totals are 363 unique incidents, 424 recorded offenses, and 47 incidents with different offenses. Do not expect those numbers to equal an all-years dashboard total or a database that includes other datasets.

If this deployment was initialized with `prisma db push` and lacks migration history, follow its existing migration-baselining procedure before using `migrate deploy`; do not reset the database to resolve history errors.

The Prisma CLI now reads `.env.local` before `.env`, matching the running Next.js app, while preserving environment variables explicitly supplied by the deployment.

For maintenance recovery, the upload and command below use the same workbook-row parser and transactional deduplication. Inspection is the default; `--apply` inserts missing signatures without overwriting or deleting existing records:

```sh
bun scripts/recover-crime-workbook.ts data/incidentrep_20160100448_2026-01-01-2026-09-29.xlsx
bun scripts/recover-crime-workbook.ts data/incidentrep_20160100448_2026-01-01-2026-09-29.xlsx --apply
```

## Configured database activation

On 2026-10-13 (Asia/Manila), the running app returned HTTP 500 because the configured Supabase database lacked `crime_incidents.incident_id`. The targeted additive migration was applied with `prisma db execute --file backend/prisma/migrations/20261012000000_incident_offense_relationships/migration.sql` and registered using `prisma migrate resolve --applied 20261012000000_incident_offense_relationships`. Both the statistics and crime-list endpoints then returned HTTP 200.

The migration history has older missing authentication/lockout/backup entries, including duplicate authentication migrations. These require a separate reconciliation against the existing schema before a future blanket `migrate deploy`; they were not replayed or falsely marked applied during this repair. The incident/offense migration is recorded as applied.

Before recovery, the actual database contained 1,656 offense rows across all years and 365 blotters in 2026. Of the workbook's 424 offense signatures, 362 were present and 62 were absent. Source-only totals remain 363 incidents and 424 offenses; database totals also include records outside the workbook.

Recovery inserted all 62 missing signatures, verified coverage of all 424 source offenses, and retained all 1,656 existing record IDs. The database now holds 1,718 offense records across all years. The running 2026 statistics endpoint returns **366 incidents, 427 offenses, and 47 multiple-offense incidents** with HTTP 200. The difference from the workbook totals is three additional existing incidents/offenses, which were preserved.

Live verification also confirmed HTTP 200 for the 2026 crime list (427 rows), barangay counts and hourly timeline. Blotter `042120000-202601-0002` returns its three separate analytical offense labels, original source description, CONSUMMATED stage, `offenseCount=3` and `hasMultipleOffenses=true`. The shared-parser regression suite has 15 passing tests; database/HTTP fixture tests remain opt-in. Type checking, targeted lint and production build pass after this repair.

## Data and API contracts

- One valid blotter groups records within its station (or municipality fallback). Missing blotter records use a composite identity; different offenses without a shared blotter are not automatically linked.
- Re-import identity includes the parent key, recorded offense, normalized stage and section. Exact re-imports and concurrent imports are constrained in the database. The source export has no stable offense-record ID: stage/section amendments must edit the existing record through its ID; importing them as new signatures does not silently replace previous records.
- `incidentType` in API responses is the analytical offense/stage label for compatibility with existing chart consumers. `sourceIncidentType` is the unchanged source description; `sourceStageOfFelony` is the raw source stage. The register and backups show both.
- `totalIncidents` and the legacy `totalCrimes` alias count matching parents once. `totalOffenses` counts matching offense rows. Crime-type charts and matrices count offenses; location, monthly activity, hourly and case metrics count incidents. One incident can appear in more than one offense category.
- A narrow offense or stage filter does not change the parent's full `offenseCount` or `hasMultipleOffenses` value. The main statistics exclude records explicitly marked `isCrime=false`.
- `stageOfFelony` query parameters accept `CONSUMMATED`, `FRUSTRATED`, `ATTEMPTED`, or `UNKNOWN`. A missing or unrecognized source stage is never inferred to be consummated.
- Offense classification follows the recorded statutory description. Broad statutes stay broad when sections are absent; labels do not infer possession/sale or other legal subtypes from incident mechanisms. The mapping is in `lib/offense-classification.ts`.
- `PUT /api/crimes/[id]` accepts `offense`, `stageOfFelony`, `section`, `blotterNo`, and `stn`. Classification is derived, so direct `crimeType` overrides are rejected. Correct a source incident label explicitly with `sourceIncidentType`. Writes require administrative permissions.
- Counts of repeated victims/suspects must not be summed across offense rows. Existing source fields remain on each offense record to preserve conflicting historical values rather than silently choosing a new shared value.

## Verification

```sh
bun run test
TEST_DATABASE_URL=postgresql://USER@127.0.0.1:PORT/securetanza_offense_test bun run test:crime:db
TEST_DATABASE_URL=postgresql://USER@127.0.0.1:PORT/securetanza_offense_test TEST_BASE_URL=http://127.0.0.1:APP_PORT bun run test:crime:http
```

Database tests require a dedicated local database named `securetanza_offense_test…`; they rebuild its crime tables. HTTP tests require an app already running against that same isolated database, with authentication and audit tables provisioned. They create only a local fixture administrator and temporary `http-fixture-…` records. Never point these commands at a deployment database. Normal `test` skips database/HTTP integration checks unless their explicit environment variables are provided.
