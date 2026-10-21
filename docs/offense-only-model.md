# Offense-only register

Every record is one **offense** with its **stage of felony** (CONSUMMATED,
FRUSTRATED, ATTEMPTED, or UNKNOWN when the workbook left it blank). Offenses are
never grouped: a blotter that lists three offenses is three independent records,
and every count in the system — totals, map shading, threat levels, charts, the
Cases list, reports, exports and scheduled reports — counts offenses.

This replaces the incident/offense model of 2026-10-12
(`docs/superpowers/plans/2026-10-12-incident-offenses.md`,
`docs/incident-offense-deployment.md`), which grouped offenses into incidents.

## What changed

- **Database** (`backend/prisma/migrations/20261021200000_offense_only`): the
  `incidents` table, each record's `incident_id`, and the workbook's Incident
  Type columns (`incident_type`, `incident_type_threat_grp`) are removed, and
  `crime_incidents` is renamed `offenses` (Prisma model `Offense`). No offense
  was deleted.
- **Import keys** were recomputed without Incident Type. A key is the station-
  scoped blotter number (or, without one, station, barangay, committed and
  reported date/time and offense) plus the offense, stage and section — see
  `generateCrimeFingerprint` in `backend/lib/crime-deduplication.ts`. The SQL in
  the migration produces the same keys, so re-uploading a workbook adds nothing
  that is already there.
- **Uploads** require `offense` and `stage_of_felony` columns; `incident_type`
  is no longer read.
- **API**: records carry `crimeType` (stage-qualified, e.g. "Frustrated
  Murder"), `offenseCategory` ("Murder") and `stageOfFelony`; the crime-type
  filter parameter is `crimeType`. Statistics report `totalOffenses` and
  `crimesByStage`; there are no incident totals.

## Applying the migration elsewhere

The migration history in the shared database is behind the real schema (it has
been kept in sync with `db push`), so `prisma migrate deploy` would try to
re-run old migrations. Apply this one on its own:

```bash
psql "$DIRECT_URL" -v ON_ERROR_STOP=1 -f backend/prisma/migrations/20261021200000_offense_only/migration.sql
```

It runs in one transaction and stops at the first error.

## Testing against a real database

`tests/crime-database.test.ts` builds the old register from a fixture, applies
the 2026-10-12 and offense-only migrations, and checks imports, filters and
statistics. It needs a local database named `securetanza_offense_test`:

```bash
createdb securetanza_offense_test
TEST_DATABASE_URL=postgresql://localhost/securetanza_offense_test bun test tests/crime-database.test.ts
```
