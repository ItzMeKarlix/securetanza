# Crime fetch optimization — 2026-10-13

## Findings

The configured Supabase database's 2026 filtered scan used the existing date index and executed in approximately 0.6 ms. The development app's cold statistics request took 28.470 seconds; its first full 427-row list took 44.221 seconds and returned 815,600 bytes. Warm responses took 13–25 ms. Nested relationship retrieval and transferring complete records, plus repeated frontend consumers waiting for the entire dataset, were the relevant costs. Adding more indexes was not supported by this query plan.

## Changes

- PostgreSQL computes incident/offense totals, case metrics, geographic/monthly breakdowns and the hourly timeline. Filter predicates use a fixed identifier/operator vocabulary and bound values. Full sibling status is retained even under a narrow offense/stage filter.
- `view=analysis` provides the fields required by charts and drill-down links. A dictionary of repeated labels/dates and packed rows reduces the database transfer; the server reconstructs ordinary API objects. Full register/detail/export requests continue to receive their existing fields. Pagination remains complete.
- Concurrent identical frontend reads share one request. Settled data and rejected promises are discarded, so there is no additional browser TTL hiding imports or edits. Server cache invalidation retains the existing crime namespace; analytical cache keys have a new revision.
- Analytics renders totals and summary charts as soon as statistics arrive. Detailed patterns and records keep independent loading states. Drill-down dialogs show loading rather than an empty selection while records are pending. Superseded hook requests cannot replace a newer filter's state.
- The shared workbook parser keeps malformed text invalid rather than silently converting a numeric investigator value into text. Authentication and import error isolation remain verified.

## Observed results

These are observations from the running development app and actual configured Supabase database, not a latency guarantee. Network, cache warmth and development compilation affect timing.

| Request | Before | After |
| --- | --- | --- |
| 2026 statistics, first uncached request | 28.470 s | 0.481–1.834 s |
| 2026 analytical records, initial complete dataset | 44.221 s / 815,600 bytes (full register shape) | 18.710 s / 375,034 bytes (chart shape) |
| Warm statistics/chart reads | 13–25 ms | 4–19 ms in the final sampled run |

The detailed dataset still takes longer on a cold remote connection. Progressive loading makes statistics and summary charts usable without waiting for it. The actual live totals remain **366 incidents, 427 offenses and 47 multiple-offense incidents**. Source-workbook-only fixture totals remain 363/424/47.

## Verification

- 18 unit tests pass, including concurrent request sharing, failed-read retry, full source signature coverage and compact parent status handling.
- Dedicated PostgreSQL regression passes. SQL statistics/timeline exactly match the original row-based calculations; compact records match full records for dates, source labels, offenses, stages, locations and parent status/flags. Filter scopes, parameter injection, concurrent imports, edits and deletions are covered.
- Authenticated HTTP regression passes on the isolated test app, including malformed-row rejection, exact Excel row provenance and write permissions.
- Desktop 1440×1000 and mobile 390×844 browser checks held the analytical-record request: 363/424 totals rendered before release, only one chart-record request was sent, detailed loading states completed, and no page errors or document overflow occurred. These browser checks use the local fixture database, not a live user account.
- Type checking, targeted lint and production build pass. The existing middleware deprecation warning remains.

Reproduce read-only HTTP timing with:

```sh
bun scripts/benchmark-crime-fetch.ts http://127.0.0.1:3000
```

Each endpoint is requested twice. The second request generally uses the warm server cache; subsequent geographic requests may reuse statistics. Allow cache expiration or use a new valid filter scope to evaluate cold behavior. No live database rows or schema were modified by this optimization.
