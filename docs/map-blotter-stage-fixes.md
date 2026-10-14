# Map counts, grouped blotters, and felony stages

The 2026 workbook and the running application's API agree that Sahud Ulan has **25 unique incidents and 32 recorded offenses**. The former popup showed only the incident count with a generic crime label. The hover tooltip, hover panel, and barangay drawer now label both totals explicitly.

## Filter contract

- `offenseCategory` filters the base offense definition, such as Murder. `stageOfFelony` independently filters CONSUMMATED, FRUSTRATED, ATTEMPTED, or UNKNOWN.
- Selecting Murder + Attempted therefore includes Attempted Murder. The legacy `incidentType` query continues to filter the exact analytical label.
- Map shading counts unique incidents; offense distributions count recorded offenses. Hover statistics, marker reads, distributions, and shading share category, stage, period, day, and committed-hour scope.
- Overlapping map period selections are merged. Superseded requests cannot publish results into a newer scope, and an empty scoped response stays empty.
- Clearing the map's combined offense filter or all filters clears its stage selection too.

## Cases

The main list groups records by parent incident and displays Blotter No., Location, Date, and Status. Pagination counts parent blotters. Legacy records fall back to station-scoped blotter identity; missing blotter numbers display `Not recorded`.

Multiple-offense blotters expand into individual offense rows with classification, felony stage, and status. Under a narrow offense filter, expanding reads the complete parent offense list using `incidentId`; the matching-offense total still represents only the current filter. Mixed or incomplete parent statuses are labeled explicitly.

Selecting an offense hydrates its full record before displaying full details. Existing offense-ID deep links still select the exact offense and open its parent blotter. Request guards prevent earlier list or detail reads from replacing later selections.

## Verification on 2026-10-13

- `bun run test`: 38 passed; the two opt-in integration tests skip in this command.
- Isolated PostgreSQL integration: passed source totals 363 incidents / 424 offenses / 47 multiple-offense incidents, Sahud Ulan 25 / 32, independent category/stage scopes, complete siblings, and SQL/reference parity.
- Isolated authenticated HTTP integration: passed upload validation, provenance, and write/cache behavior.
- TypeScript and production build passed. The build retains the existing Next.js middleware deprecation warning.
- Scoped ESLint passed with existing `no-explicit-any` and `set-state-in-effect` violations excluded; this is not a claim of repository-wide lint cleanliness.
- Read-only checks against the running app confirmed Sahud Ulan 25 / 32 and Murder stage totals: consummated 4, frustrated 4, attempted 1.
- Browser checks use the isolated fixture application, not the production police account. Desktop and mobile case grouping, full-detail hydration, dashboard stage filtering, Sahud Ulan hover counts, map-stage selection, and stage reset passed with no page errors.
- The mobile legend now sits below the filter bar, and the open filter menu stacks above the legend. Desktop, hourly, and focus placement remain unchanged.

The design detector's gray-on-color finding for the filter reset button was reviewed as a false positive: neutral slate text has a neutral background; the red hover background and red hover text apply together. A file-scoped exception was recorded through the detector administration script in `.impeccable/config.json`.

No live data mutation or schema migration was required for these UI and query fixes.
