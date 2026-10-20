# SecureTanza Technical Evaluation Form

**Basis:** Adapted ISO/IEC 25010 quality evaluation

**Requested criteria:** Functionality, Reliability, Usability, Efficiency, Maintainability, and User-Friendliness

**System:** SecureTanza Crime Mapping and Analytics System, Tanza, Cavite

**Source review date:** October 15, 2026

**Repository baseline:** `74133a3` **plus the current uncommitted working-tree changes** reviewed on that date

> This is a blank evaluation instrument grounded in the current source code. A feature's inclusion means its implementation was located; it does not mean its deployed behavior has passed evaluation. Complete the ratings after performing the indicated tasks. Recheck this inventory when the build changes.

## 1. Standards alignment and scope

The six headings requested for this form are retained. They are an **adaptation**, rather than the complete set of ISO/IEC 25010 characteristics. The 2011 edition defines eight product-quality characteristics and has been withdrawn; the 2023 edition defines nine. See the official [ISO/IEC 25010:2011 record](https://www.iso.org/standard/35733.html) and [ISO/IEC 25010:2023 record](https://www.iso.org/standard/78176.html).

The terminology below uses the 2011 product-quality model as its historical reference because it explicitly uses *Usability*. In the 2023 product model, the corresponding area is *Interaction capability*. This form is an original, project-specific instrument; it is not an ISO-issued questionnaire or a certification of conformity.

| Requested heading | Reference quality area | Meaning in this form |
| --- | --- | --- |
| Functionality | Functional suitability: completeness, correctness, appropriateness | Whether the implemented functions produce correct, useful results for police workflows. |
| Reliability | Reliability: maturity, availability, fault tolerance, recoverability | Whether data and operations remain dependable during normal use, failures, retries, and recovery. |
| Usability | Usability: recognizability, learnability, operability, error protection, accessibility | Observable task completion, navigation, accessibility, and prevention of mistakes. |
| Efficiency | Performance efficiency: time behavior, resource utilization, capacity | Measured response times, database/browser resource use, and behavior at representative volumes. |
| Maintainability | Maintainability: modularity, reusability, analysability, modifiability, testability | Whether a technical maintainer can understand, diagnose, change, deploy, and verify the system. |
| User-Friendliness | Local user-experience subsection of usability/interaction capability | Users' perception of clarity, comfort, confidence, and helpfulness after actual use. This is not a separate ISO characteristic. |

Security-related built features are included under Functionality and Reliability because the requested form has six headings. Compatibility and deployment concerns appear in supporting tasks. These placements do **not** replace separate Security, Compatibility, Portability/Flexibility, or other assessments required by a complete edition-specific ISO evaluation.

To limit overlap, score **Usability** from observed task performance and **User-Friendliness** from the participant's experience. An overall six-section score intentionally gives both areas weight; report their separate results and do not describe that overall score as an ISO conformance score.

## 2. Evaluation identification

| Field | Entry |
| --- | --- |
| Evaluation/reference number | ______________________________ |
| Evaluator name or participant code | ______________________________ |
| Position / organization | ______________________________ |
| Evaluator type | [ ] Police user [ ] Commander/analyst [ ] Administrator [ ] Software/QA specialist [ ] Other: ______ |
| Experience with SecureTanza | [ ] First use [ ] Occasional [ ] Regular; duration: ______ |
| Evaluation date and time | ______________________________ |
| Application URL / environment | ______________________________ |
| Evaluated commit and local changes / build identifier | ______________________________ |
| Test account's exact permission names | ______________________________ |
| Browser and version / operating system | ______________________________ |
| Device / screen resolution / browser zoom | ______________________________ |
| Connection type and approximate speed | ______________________________ |
| Dataset identifier / selected periods / time zone | ______________________________ |
| Unique parent incidents / recorded offense rows / represented barangays | ______ / ______ / ______ |
| Test server and worker process identifiers | ______________________________ |
| Start / finish time and assistance given | ______________________________ |

### Evaluation instructions

1. Use a sanitized test dataset and designated test accounts. Run account lockout, record mutations, deletion, retention, failure injection, and database tests in a disposable evaluation environment.
2. Complete the workflow tasks in Section 4, then rate the relevant statements in Section 5. Technical staff complete API, infrastructure, and Maintainability items; ordinary users may mark those items `NA` with an explanation.
3. Enter **one rating per row** and an evidence reference or comment. Split sub-results in the evidence log when an item covers several closely related controls. Rate partial completion honestly.
4. Use `NT` when a relevant feature was not tested or was blocked. Use `NA` only when the item is outside the evaluator's assigned scope, and explain why. A feature that is present but fails is rated **1–4 as appropriate**, not `NA`.
5. Distinguish a correct zero-result dataset from a failed request. Keep parent-incident totals separate from offense-row totals throughout the exercise.
6. Record actual measurements and defects. Source inspection and automated tests support evaluation but do not substitute for user observation, deployed authorization checks, or operational recovery tests.

### Rating scale

| Rating | Interpretation | Observable basis |
| --- | --- | --- |
| 5 | Excellent / fully meets the criterion | All assigned checks succeed correctly and independently, with no material issue observed. |
| 4 | Good / largely meets the criterion | Checks succeed with minor issues that do not materially obstruct the task. |
| 3 | Fair / partially meets the criterion | Some checks succeed, but issues or assistance materially affect completion. |
| 2 | Poor / minimally meets the criterion | Major issues obstruct most of the task or require substantial workarounds. |
| 1 | Very poor / does not meet the criterion | The intended task fails, produces materially incorrect results, or cannot be completed. |
| NT | Not tested | Relevant, but no adequate observation was obtained; record the blocker. |
| NA | Not applicable to this evaluation assignment | Excluded with a documented reason. |

For the subjective User-Friendliness statements, use 5 = strongly agree, 4 = agree, 3 = neutral/mixed, 2 = disagree, and 1 = strongly disagree, based on the tasks just performed. These scale labels and all scoring rules are local choices, not ISO-prescribed thresholds.

## 3. Source-backed feature coverage register

The source references below cover the mounted application pages, API handlers, services, models, background worker, and shared client behavior. Supporting source files are grouped so evaluators can trace each family of rated items without repeating long paths in every row.

| Source ID | Implemented features and evaluation coverage | Primary implementation evidence |
| --- | --- | --- |
| S01 | Account-number/password login; session checking and logout; temporary-password change; failed-login lockout and administrator unlock. F01–F04. | [Login](../app/api/auth/login/route.ts), [authentication helpers](../lib/auth.ts), [password-change modal](../components/modals/ForceChangePasswordModal.tsx), [unlock route](../app/api/users/[id]/unlock/route.ts). |
| S02 | Permission-aware navigation, page access, landing-route fallback, session revalidation, idle warning, stay-signed-in and logout behavior. F05–F06. | [Route permissions](../lib/auth-routes.ts), [middleware](../middleware.ts), [AuthContext](../context/AuthContext.tsx), [idle timer](../lib/idle-session.ts), [warning dialog](../components/layout/idle-logout-warning.tsx). |
| S03 | Profile identity display, password update, configurable idle minutes; account provisioning/edit/revocation, permission assignment, temporary credential display/copy. F07–F08. | [Profile](../app/dashboard/config/page.tsx), [password update](../app/api/auth/update-password/route.ts), [idle preference](../app/api/users/settings/auto-logout/route.ts), [access page](../app/dashboard/config/access/page.tsx), [user routes](../app/api/users/route.ts), [user mutation](../app/api/users/[id]/route.ts). |
| S04 | Light/dark/system appearance; Original/Colorful data palettes; reduced motion, high contrast, text size; saved landing preference. F09–F10. | [Preferences](../app/dashboard/config/preferences/page.tsx), [accessibility provider](../context/AccessibilityContext.tsx), [theme provider](../context/ThemeContext.tsx), [data colors](../lib/data-colors.ts), [landing preference API](../app/api/users/settings/landing-page/route.ts), [global styles](../app/globals.css). |
| S05 | GIS page at `/` and alternate `/map`; OpenStreetMap tiles, Tanza boundary mask, barangay polygons, hover/click highlighting, zoom/reset and focus mode. F11–F12. | [Home](../app/page.tsx), [alternate map](../app/map/page.tsx), [map root](../components/map/tanza-map-root.tsx), [polygon layer](../components/map/tanza-geojson-layer.tsx), [map controls](../components/layout/right-sidebar-controls.tsx), [GeoJSON](../public/tanza_cavite.geojson). |
| S06 | Searchable barangay/offense selection, independent felony stage, multi-period picker, year/month/quarter selection, day/custom-range controls where exposed, persistent period and filter-aware links. F13–F14. | [Unified filters](../components/layout/unified-filter-bar.tsx), [period picker](../components/layout/period-picker.tsx), [MapContext](../context/MapContext.tsx), [felony stage](../components/dashboard/felony-stage-selector.tsx), [time-range URL parameters](../hooks/useTimeRangeParams.ts). |
| S07 | Threat bands, numeric scale, offense legend and per-offense barangay breakdown; hover and barangay drawer metrics; incident/offense totals and dashboard link. F15–F16. | [Threat scale](../components/map/threat-scale.tsx), [crime legend](../components/map/crime-legend.tsx), [breakdown](../components/map/crime-type-breakdown.tsx), [drawer](../components/map/barangay-drawer.tsx), [shared map queries](../hooks/map-query.ts), [threshold calculations](../lib/geo-threat.ts). |
| S08 | Current clock, day/hour timeline, populated-hour scrubber, playback and date/hour filtering; latest-upload indicator. F17–F18. | [Clock](../components/layout/real-time-clock.tsx), [timeline](../components/layout/time-filter.tsx), [latest upload](../components/layout/last-upload-indicator.tsx), [hourly API](../backend/api/crimes/hourly-timeline/route.ts), [latest API](../backend/api/crimes/latest/route.ts). |
| S09 | Two independently filtered comparison maps; linked pan/zoom/fit; harmonized threat scale; A/B totals/deltas; rises/falls/all ledger, linked hover/focus, threat highlighting and sidebar visibility preference. F19–F21. | [Compare page](../app/compare/page.tsx), [pane](../components/compare/compare-pane.tsx), [map synchronization](../components/compare/map-link.ts), [ledger](../components/compare/change-ledger.tsx), [comparison calculations](../components/compare/compare-data.ts). |
| S10 | Municipal/barangay dashboard overview, incident and offense measures, leading offense/hotspot, monthly trend, distribution, recent blotter activity and case links. F22–F23. | [Overview page](../app/dashboard/overview/page.tsx), [overview component](../components/dashboard/overview-tab.tsx), [dashboard hook](../hooks/useDashboardData.ts). |
| S11 | Analytics KPIs, quarter comparisons, peak hours, resolution/safety indicators; monthly/hourly charts, offense/stage composition, modus, place, barangay comparison and monthly crime matrix. F24–F26. | [Analytics component](../components/dashboard/analytics-tab.tsx), [analytics hook](../hooks/useAnalyticsData.ts), [matrix](../components/dashboard/crime-matrix-chart.tsx), [aggregate calculations](../backend/lib/crime-analytics.ts). |
| S12 | Interactive chart slices, matching incident list and mini-map, tooltips, and deep links to Cases. F27. | [Slice filters](../lib/analytics-slice.ts), [detail modal](../components/dashboard/analytics/incident-detail-modal.tsx), [slice map](../components/dashboard/analytics/slice-mini-map.tsx). |
| S13 | Searchable/filterable/paginated blotter groups; sibling offense expansion and retries; selected-record panel, full dossier, offense switcher, location map, source fields and sensitive case flags. F28–F31. | [Cases](../components/dashboard/incidents-tab.tsx), [case grouping](../lib/case-grouping.ts), [case page](../app/dashboard/cases/page.tsx), [detail API](../backend/api/crimes/[id]/route.ts). |
| S14 | Nine configurable PDF sections and supported narrative/chart/table options; selection controls, data scope, document generation, PDF download and report archiving. F32–F34. | [Report builder](../components/dashboard/reports-tab.tsx), [PDF generator](../lib/pdf-generator.ts), [report theme](../lib/report-theme.ts). |
| S15 | Actual PDF-page preview, inline title/subtitle/narrative edits; font/size/line spacing, zoom/fit width, document outline and reset; regeneration/pagination and scope-sensitive edits. F35–F36. | [Preview editor](../components/dashboard/report-preview-editor.tsx), [PDF pages](../components/dashboard/pdf-report-pages.tsx), [edit model](../lib/report-editor.ts), [PDF preview renderer](../lib/pdf-preview.ts). |
| S16 | PNG chart/map selection, Tanza-wide/hotspot/per-barangay images and single-file/ZIP downloads. F37. | [Image exporter](../lib/image-export.ts), [report image controls](../components/dashboard/reports-tab.tsx), [barangay multi-select](../components/dashboard/barangay-multi-select.tsx). |
| S17 | Admin Excel/CSV intake through file selection/drop; first-sheet facts, column/empty-cell preview, aliases and header checks; three-second pre-import undo, file/size checks, parsing/normalization, optional fields and import receipt. F38–F40. | [Upload dialog](../components/layout/upload-modal.tsx), [column contract and 50 MB limit](../components/upload/upload-meta.ts), [upload route](../backend/api/crimes/upload/route.ts), [row parser](../backend/lib/crime-workbook.ts), [numeric validation](../backend/lib/import-validation.ts). |
| S18 | Station-scoped incident identity, offense definitions/associations, normalized offense/stage, preserved source labels/provenance, in-file/database duplicate checks, chunked transactional imports and count refresh. F41–F43. | [Schema](../backend/prisma/schema.prisma), [classification](../lib/offense-classification.ts), [deduplication](../backend/lib/crime-deduplication.ts), [record persistence](../backend/lib/crime-records.ts), [incident summaries](../backend/lib/incident-summaries.ts). |
| S19 | Upload/import registers, last-import context, validation/error details; audit filters/search/date windows/pagination/detail views and actor/session/device metadata. F44–F45. | [Upload register](../app/dashboard/upload-logs/page.tsx), [import register](../app/dashboard/import-logs/page.tsx), [audit page](../app/dashboard/config/audit-logs/page.tsx), [audit API](../app/api/audit-logs/route.ts), [import API](../app/api/import-logs/route.ts), [request context](../lib/request-context.ts). |
| S20 | Database-retained XLSX/PDF archive; manual snapshot, listing/metadata/download/delete; workbook Summary, Incidents, By Barangay, By Crime Type and Monthly Matrix sheets. F46–F48. | [Backups page](../app/dashboard/config/backups/page.tsx), [backup service](../backend/services/backup.service.ts), [archive API](../app/api/backups/route.ts), [download/delete API](../app/api/backups/[id]/route.ts). |
| S21 | Per-user export schedule, enable/disable, daily/weekly/monthly timing; minute worker, database archives, non-overlap guard, 14-day scheduled retention, legacy-file cleanup and shutdown. F49–F50. | [Schedule page](../app/dashboard/config/exports/page.tsx), [schedule API](../app/api/exports/schedule/route.ts), [configuration service](../backend/services/config.service.ts), [worker](../backend/cron/worker.ts). |
| S22 | Admin Process Monitor, refresh controls/history, database/pool and table metrics, process/memory, schedules/archive/import/export metrics, auth/cache telemetry and diagnostic actions. F51–F54. | [Monitor](../app/dashboard/performance/page.tsx), [monitor API](../app/api/system/performance/route.ts), [database view](../app/dashboard/performance/components/DatabaseServiceView.tsx), [memory view](../app/dashboard/performance/components/ProcessMemoryServiceView.tsx), [cron view](../app/dashboard/performance/components/CronTasksServiceView.tsx), [cache view](../app/dashboard/performance/components/AuthCacheServiceView.tsx). |
| S23 | Public documentation hub, topic/subtopic search and navigation, troubleshooting and replay; first-visit, role/permission-aware multi-route tours and completion state. F55–F56. | [Docs page](../app/docs/page.tsx), [topic registry](../components/docs/docs-config.ts), [docs navigation](../components/docs/docs-sidebar.tsx), [tour provider](../context/TourContext.tsx), [tour steps](../lib/tour/steps.ts). |
| S24 | Crime read/create/update/delete APIs, barangay lookup/create, aggregate/timeline/latest/year endpoints, permission lookup and alternate Hono read/cache endpoints. F57–F60. | [Crime collection](../backend/api/crimes/route.ts), [record routes](../backend/api/crimes/[id]/route.ts), [barangay routes](../backend/api/barangays/route.ts), [crime service](../backend/services/crime.service.ts), [permissions API](../app/api/permissions/route.ts), [Hono router](../backend/hono/app.ts), [Hono adapter](../app/api/hono/[...route]/route.ts). |
| S25 | Performance/reliability mechanisms: bounded PostgreSQL pool, indexes, compact analysis queries, complete paged reads, shared concurrent GETs, cache TTL/LRU/single-flight/fallback and invalidation. R/E/M sections. | [Pool/client](../backend/lib/prisma.ts), [query aggregates](../backend/lib/crime-query-aggregates.ts), [client API](../lib/api.ts), [shared reads](../lib/read-json.ts), [cache service](../backend/cache/cache.service.ts), [memory provider](../backend/cache/memory-cache.provider.ts), [cache keys/TTLs](../backend/cache/cache-keys.ts). |
| S26 | Automated regression tests, migrations/generated Prisma client, package scripts, configuration and supervised app/worker deployment. R/M sections. | [Tests](../tests), [migrations](../backend/prisma/migrations), [package scripts](../package.json), [Prisma config](../prisma.config.ts), [deployment guide](../deploy/README.md), [service unit](../deploy/securetanza.service), [incident/offense deployment notes](incident-offense-deployment.md). |

### Boundaries discovered during inspection

These are scope notes and test targets, not completed defect ratings.

| Boundary | How to evaluate it |
| --- | --- |
| Notifications were removed in the current working tree. | Do not score notification bells, alert rules, or notification delivery as built features. Older prose mentioning automated surge alerts does not establish an active implementation. |
| Crime create/update/delete are backend capabilities; Cases is a browsing/detail interface. | Exercise mutations through the API in a test environment. Do not imply a mounted manual case-entry/edit/delete UI exists. |
| The archive stores finished exports in the same PostgreSQL database. | Test retrieval/persistence of those files. There is no dedicated application restore endpoint, full database disaster-recovery facility, or verified round-trip importer for exported workbooks. The snapshot starts with Summary; the importer reads only the first sheet. |
| The main map mounts barangay polygons and OSM tiles; the police-station marker is explicitly removed. | Score mounted behavior. Do not infer individual incident-pin layers, station markers, clustering, or a density raster from unused components, names, or historical documentation. |
| No manifest/service-worker implementation was located in this review. | Do not score installable PWA, native desktop packaging, or offline database operation as existing features. Network/database-dependent functions need their services. |
| Read exposure and permission checks vary by route. | Middleware exempts `/api/crimes*` and `/api/barangays*`; mutation handlers must be checked independently. `/map` does not mirror the root page's map-permission check. The user-management routes specifically require `admin_operational_officer`. Test exact permissions and direct URLs; hiding navigation is insufficient evidence. |
| Some auxiliary administrative actions have broader handler access than the UI suggests. | Inspect and test `POST /api/barangays`, `/api/hono/cache/flush`, and `/api/exports/schedule` for unauthorized or insufficiently privileged calls. Record the result rather than assuming uniform administrator enforcement. |
| Idle expiration is implemented by the browser timer and logout request. | Test background tabs, refresh/navigation, new-tab behavior and logout failure; do not assume a server-side idle deadline or global token revocation from this implementation alone. |
| Cron uses the worker host's local clock. The monitor returns a literal `cronWorker: 'ACTIVE'`. | Record the worker time zone and observe an actual scheduled artifact/log. The dashboard label alone does not prove worker liveness, missed-job catch-up, or coordination across multiple workers. |
| Retention actions have different scope. | The worker removes scheduled archives older than 14 days and legacy XLSX files. The monitor's manual `prune_exports` action only prunes legacy files; manual backups/reports are not automatically aged out by the worker. |
| Map risk and analytics indicators are calculated summaries. | Threat bands use counts and dynamic thresholds; they are not crime predictions. Verify numerator, denominator, status definitions, selected scope and rounding from current code. The analytics quarter-change value is capped at ±90%; do not present it as an uncapped percentage. |
| Several data helpers catch read failures and return empty/default values. | Inject failures and verify each surface distinguishes unavailable data from a real zero. A displayed zero or “healthy” label is not proof of a successful request. |
| API-only routes and source presence do not prove production readiness. | The Hono router is present, but it and the main build need separate runtime verification. No live deployment or full build was exercised for this documentation task. |

### Imported record-field coverage

Use these groups when checking F31 and F40; the shared [expected column list](../components/upload/upload-meta.ts) and [row parser](../backend/lib/crime-workbook.ts) provide the exact import contract. Import support does not imply every scalar field is displayed in every dossier or exported in every workbook.

| Field family | Fields to reconcile with the test source |
| --- | --- |
| Identity and provenance | Blotter number, encoded date; source file, sheet, row; parent incident ID, offense definition, import identity, offense count and multi-offense flag. |
| Organization and location | PRO, PPO, station, PCP, region, province, municipality, barangay, street, type of place, latitude and longitude. |
| Timeline and classification | Reported/committed dates and times, source incident type, is-crime flag, reporting mode, source/normalized felony stage, offense text/type, legal section and derived analytical crime type/category. |
| Circumstances and flags | Modus, suspect motive/sub-motive, heinous, sensational, threat-group flag/affiliation/incident type and MRS. |
| People and assignment | Suspect/victim counts, suspect-arrested state, suspect/victim government-official flags/positions/classes, case status, investigator and lead investigator. |

## 4. Practical evaluation tasks

Prepare a small, manually reconciled fixture with a single-offense incident; a multi-offense blotter with mixed statuses/stages; the same blotter number at another station; records without blotter numbers; non-crime rows; zero-result filters; unknown classification/stage; blank versus zero counts; and records on date/hour boundaries. Include enough rows to span pagination, and a larger fixture exceeding 2,000 offense rows for completeness/performance checks. Record the expected parent and offense totals before testing.

| Task | Procedure and expected evidence | Covered items | Done / evidence ID |
| --- | --- | --- | --- |
| T01 — Authentication and permissions | Sign in/out; force a temporary-password change; use three wrong passwords on a test account, unlock it, and check old/new credentials. Repeat relevant routes as administrator, operational officer, map-only, cases-only, analytics-only, zero-permission and unauthenticated users. | F01–F08, F57–F60, R08–R09, U01 | ______ |
| T02 — Session and preferences | Change idle duration, wait for the final-minute warning, continue or let it expire. Repeat after backgrounding the tab and navigating. Test theme/system sync, palettes, text size, motion/contrast, saved landing page and reload. | F06–F10, R09–R10, U08–U10, UF07 | ______ |
| T03 — Map and time playback | Inspect all barangay boundaries, filters, multiple periods/days, offense/stage, threat bands, drawer and legend. Scrub/play populated hours, including midnight; reset/focus/exit; compare totals with the fixture and latest-upload history. | F11–F18, R03, U02–U04, E01–E02 | ______ |
| T04 — Compare | Set different A/B scopes, move both maps, inspect shared scale and rises/falls/all ledger, highlight a threat level, focus a barangay and hide/reopen the sidebar. Include zero baseline and identical scopes. | F19–F21, R03, U03, E03 | ______ |
| T05 — Overview and analytics | Reconcile overview, quarter/status KPIs, all chart families, matrix, tooltip and chart-to-record drill-down. Follow a record into Cases and compare the slice's count and scope. Repeat for a barangay, offense and stage. | F22–F27, R02–R04, U05, E04 | ______ |
| T06 — Case review | Search and page grouped blotters; expand siblings under narrow filters; inspect incomplete/retry states, full details and previous/next offense. Check dates, statuses, source descriptions, counts, flags, and recorded/missing coordinates. | F28–F31, R02–R04, U06, UF03 | ______ |
| T07 — Reports and images | Select/deselect each of nine sections and each supported sub-option; preview/edit/format/zoom/navigate; download and reopen the PDF; archive it. Export each image family and selected barangay maps, individually and as ZIP. Compare with the source scope. | F32–F37, R05–R06, U07, E05, UF06 | ______ |
| T08 — Import and audit | Upload XLSX, XLS and CSV fixtures; vary header aliases, missing/unknown columns, size/type, empty/malformed rows and optional values. Re-import and concurrently import duplicates/multi-offense records. Reconcile results, source rows, registers and audit metadata. | F38–F45, R01–R04, R08, U04, E06–E07 | ______ |
| T09 — Archive and schedule | Create/download/delete a manual snapshot and archived report; inspect all workbook sheets. Save/disable daily, weekly and monthly schedules; observe a real due export. In disposable storage, exercise retention and restart/failure behavior. | F46–F50, R05–R07, E08 | ______ |
| T10 — Diagnostics and maintenance | Review all four monitor tabs; change refresh rate/off; ping the database; flush relevant cache namespaces; exercise legacy cleanup. Verify telemetry against process/pool/worker evidence, use Hono endpoints, run appropriate tests and review deployment/migration guidance. | F51–F54, F58–F60, R06–R12, E07–E10, M01–M12 | ______ |
| T11 — Learnability and comfort | A first-time participant follows an assigned tour, searches documentation, finds troubleshooting, completes a briefing workflow and repeats it with less assistance. Observe keyboard use and smaller/larger viewports. | F55–F56, U01–U12, UF01–UF10 | ______ |

## 5. Rating questionnaire

Enter `1`, `2`, `3`, `4`, `5`, `NT`, or `NA` in Rating. Put screenshots, sanitized responses, downloaded artifact names, measured values or defect IDs in Evidence / remarks. References S01–S26 resolve to Section 3.

### A. Functionality — functional suitability

#### Account, access and personalization

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| F01 | Email/password sign-in (account-number fallback only for accounts without an email) followed by mandatory two-step verification, session recognition and manual sign-out work correctly. | Valid/invalid login by email; first-sign-in authenticator enrollment and backup codes; TOTP, backup-code and emailed-code challenges; replayed and wrong codes rejected, 5 wrong codes lock; trusted browser skips the code until expiry or password change; reload; protected page after logout. S01. | ____ | ____ |
| F02 | A user with a temporary password must complete the password-change flow before normal application use. | Compare first sign-in, successful change and rejected inputs (rule failures, reuse of the temporary password, common/guessable and known-breached passwords). S01–S02. | ____ | ____ |
| F03 | Repeated wrong passwords produce an accurate remaining-attempt message and lock the account after three consecutive failures. | Test failure/reset/locked-account paths. S01. | ____ | ____ |
| F04 | An authorized administrator can unlock a test account; the owner receives an emailed reset link and sets a new password. Invites, resends and self-service reset links are single-use and expire. | Old password fails after unlock; reset link works once; expired/reused link rejected; forgot-password gives the same response for unknown emails; audit events exist. S01, S03. | ____ | ____ |
| F05 | Granted permissions determine available modules and prevent access to restricted functions through direct requests. | Check navigation, `/`, `/map`, dashboard/config pages and underlying APIs separately. S02–S03, S24. | ____ | ____ |
| F06 | Idle preferences, countdown warning, Stay signed in and automatic logout behave according to the chosen inactivity duration. | Include background/resumed tabs and session polling. S02–S03. | ____ | ____ |
| F07 | Profile identity and password settings display accurate account data and validate password updates. | Check current password, new-password rules/confirmation (common/guessable and known-breached passwords rejected), invalid timer and saved timer. S03. | ____ | ____ |
| F08 | User administration correctly creates, lists, edits and revokes personnel access and assigns permission sets. | Include credential copy/display, pagination, self-action protections and session refresh after revocation. S03. | ____ | ____ |
| F09 | Appearance and accessibility settings apply correctly across the application. | Light/dark/system, Original/Colorful, reduced motion, high contrast, text scale 90–150% and reload. S04. | ____ | ____ |
| F10 | The saved default landing page is respected when permitted and safely falls back when access changes. | Save/relogin; remove the preferred module's permission. S02, S04. | ____ | ____ |

#### GIS, temporal filtering and comparison

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| F11 | The map correctly renders Tanza barangay boundaries, basemap, outside-area mask and barangay selection/highlighting. | Reconcile GeoJSON coverage; inspect hover/click behavior and tile attribution. S05. | ____ | ____ |
| F12 | Zoom, reset-to-Tanza and focus-mode controls perform their stated actions. | Zoom limits, focus entry/exit and Escape; temporal controls reset appropriately. S05. | ____ | ____ |
| F13 | Barangay, analytical offense and independent felony-stage filters consistently select the intended records. | Combine/clear selections; compare map, legend, drawer and linked dashboard scope. S06–S07. | ____ | ____ |
| F14 | Period controls correctly apply available years, months, quarters, multiple selections and exposed day/custom-range options. | Boundary dates, overlapping selections, latest-year reset, persistence and URL transfer. S06. | ____ | ____ |
| F15 | Threat coloring and numeric bands agree with the underlying counts and shared threshold calculation. | Zero, equal counts, small samples and High/Critical ranges; highlight bands. S07. | ____ | ____ |
| F16 | Map legends, offense/barangay breakdowns and barangay details reconcile incident totals separately from offense totals. | Check shares, ranked breakdowns and More Info navigation under each filter. S07. | ____ | ____ |
| F17 | The date/hour timeline, scrubber and playback show the correct populated hours and matching map scope. | Midnight, sparse dates, play/pause, hour/day changes and closing the timeline. S08. | ____ | ____ |
| F18 | The current clock and last-upload indicator provide accurate time and upload context. | Compare time zone, latest data timestamp and upload-history navigation. S08, S19. | ____ | ____ |
| F19 | Comparison panes maintain independent period/offense/stage selections while sharing geographic navigation. | Change A only, then B; pan/zoom/fit both. S09. | ____ | ____ |
| F20 | Both comparison panes use the same threat thresholds for an accurate visual comparison. | Large A/B volume differences and reload/error states. S09. | ____ | ____ |
| F21 | The comparison ledger correctly reports totals, absolute/percentage change, rankings and linked highlights. | Rises/Falls/All; zero baseline; identical scopes; threat selection; hover/focus; saved sidebar visibility. S09. | ____ | ____ |

#### Overview, analytics and case records

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| F22 | Overview metrics accurately reflect the chosen municipal or barangay data scope. | Parent incidents, offense volume, leading offense and critical area where shown. S10. | ____ | ____ |
| F23 | Overview trends, offense composition and recent blotter activity agree with their source records. | Monthly values, shares, status display and View Cases/deep links. S10. | ____ | ____ |
| F24 | Analytics KPI values and labels correctly explain quarter change, peak hours, resolution and safety indicators. | Recompute from current status rules, incident denominators, quarter dates and ±90% cap. S11, S18. | ____ | ____ |
| F25 | Monthly trends, hourly distribution and offense/stage composition accurately visualize the filtered dataset. | Check all 24 hours, zeros, selected periods and offense totals versus incident totals. S11. | ____ | ____ |
| F26 | Modus, place, barangay rankings and the monthly crime-type matrix accurately summarize their source data. | Inspect missing values, ordering, cell totals and municipal/barangay variants. S11. | ____ | ____ |
| F27 | Interactive analytics drill-downs show the correct matching records, mini-map and Cases destination. | Click applicable month/hour/type/modus/place/barangay/matrix slices; reconcile scope and tooltips. S12. | ____ | ____ |
| F28 | Cases search, date/recent/status/offense/stage filters, clearing and pagination identify the intended blotters. | Check search results and parent/recorded-offense counts across pages. S13. | ____ | ____ |
| F29 | Multi-offense blotters remain one parent group with distinct, accessible sibling offenses. | Mixed statuses; same blotter at different stations; missing blotter; filtered and outside-filter siblings. S13, S18. | ____ | ____ |
| F30 | Case selection, full dossier, previous/next offense and deep links open the exact intended record. | Include delayed details, sibling retry, pagination and rapid selection changes. S13. | ____ | ____ |
| F31 | Case details faithfully present available organization, timeline, legal, investigative, person-count, flag and location data. | Reconcile Section 3 field groups; source versus analytical labels, unknown/blank values and missing coordinates. S13, S18. | ____ | ____ |

#### Reports, preview editing and image exports

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| F32 | Report section controls include exactly the selected sections and supported content types. | Executive Summary, Overview, Trends, Time Patterns, Classification, Comparison, Geographic Highlights, Heatmap, Recommendations; individual/all selection and sub-options. S14. | ____ | ____ |
| F33 | Report narratives, charts, tables, map scope and metadata reflect the selected dataset. | Municipal/barangay, period, offense/stage, incident/offense totals, hotspots and recommendations. S14. | ____ | ____ |
| F34 | Generated PDF download and authorized report archiving produce readable, correctly named documents. | Reopen download; retrieve archive; verify page numbers, contents and current edits. S14, S20. | ____ | ____ |
| F35 | The PDF preview supports inline title, subtitle and narrative editing without changing factual data values. | Edit/blank/long paragraphs, scope changes, update preview and compare downloaded output. S15. | ____ | ____ |
| F36 | Font family, font size, line spacing, zoom, outline and reset controls correctly update or navigate the generated document. | Helvetica/Times/Courier, bounded inputs, reflow/page breaks, zoom/fit width, outline destinations and reset to defaults. S15. | ____ | ____ |
| F37 | Image export generates the selected charts and maps as individual PNGs or a ZIP bundle. | Trend, hourly, crime type, barangay comparison, matrix, town-wide/hotspot maps and selected barangay maps. S16. | ____ | ____ |

#### Data ingestion, identity, logs and archives

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| F38 | Authorized users can stage supported XLSX/XLS/CSV files, review column checks and undo during pre-import confirmation. | File selection/drop, first-sheet facts, blank-cell preview, aliases/renamed/missing/unknown columns, replace/clear and three-second undo before writes. S17. | ____ | ____ |
| F39 | File type/50 MB checks and invalid-row feedback prevent unsupported input from being silently accepted. | Browser and server checks; absent file, oversize, bad date/count and row-specific errors. S17. | ____ | ____ |
| F40 | Import parsing preserves the supported record fields and accurately normalizes headers, dates, times and optional values. | Section 3 field checklist; zero versus blank; source row; booleans; barangay mapping; time defaults. S17–S18. | ____ | ____ |
| F41 | Incident identity preserves multiple offenses under one station-scoped blotter without merging unrelated incidents. | Same number at another station and missing-blotter fallback. S18. | ____ | ____ |
| F42 | Classification uses recorded offense and felony stage while preserving original source descriptions. | Consummated/frustrated/attempted/unknown; ambiguous offenses; source labels/provenance. S18. | ____ | ____ |
| F43 | Duplicate handling and batch results distinguish inserted, skipped, duplicate and invalid rows accurately. | In-file/re-import/concurrent duplicates; distinct offense/stage/section; partial batches and refreshed parent counts. S17–S18. | ____ | ____ |
| F44 | Upload and import registers accurately show file, actor, time, size, imported count, outcome and validation details. | Compare successful/partial/failed/duplicate outcomes and refresh/history links. S19. | ____ | ____ |
| F45 | Audit filters, search, pagination and expanded details retrieve the relevant recorded events. | Auth/Import/Read/Export/Settings; date windows, severity/outcome, IP/session/device/resource metadata. S19. | ____ | ____ |
| F46 | Authorized users can create and retrieve a manual crime-data workbook with the expected sheets. | Summary, Incidents, By Barangay, By Crime Type, Monthly Matrix; reconcile each count's unit. S20. | ____ | ____ |
| F47 | The retained archive lists correct metadata and downloads the exact stored XLSX or PDF file. | Kind, scope, period, creator/time/size/count; supported API kind filter; bytes persist across app restart. S20. | ____ | ____ |
| F48 | Authorized archive deletion removes only the selected file and records its deletion. | Refresh/list, unavailable download afterward, remaining files and audit event. S20. | ____ | ____ |

#### Scheduling, diagnostics, documentation and APIs

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| F49 | Export schedules save and reload enabled state, frequency and applicable timing fields for the correct user. | Daily, weekday/weekly, day-of-month/monthly and disabled controls. S21. | ____ | ____ |
| F50 | The running worker creates due scheduled XLSX archives and applies the documented retention rules. | Observe real due jobs, local-clock timing, failure logs, non-overlap and 14-day scheduled/legacy cleanup. S21. | ____ | ____ |
| F51 | The Process Monitor provides usable refresh/off controls and database/pool/table-volume diagnostics. | Manual refresh, 5/10/30-second polling, ping, history and independent query/pool comparison. S22. | ____ | ____ |
| F52 | Process and memory diagnostics accurately display the current application process. | Uptime, PID/runtime/platform, heap/RSS/external/buffer values and history. S22. | ____ | ____ |
| F53 | Cron/archive diagnostics correctly summarize schedules, storage and recorded import/export activity. | Check archive plus legacy-file totals; verify worker separately from its literal ACTIVE label. S22. | ____ | ____ |
| F54 | Cache diagnostics and maintenance actions report and affect the intended cache/storage scope. | Hits/misses/keys/events/namespaces, full/scoped flush, re-query, ping and legacy export prune. S22, S25. | ____ | ____ |
| F55 | The documentation hub supports topic/subtopic navigation, search, troubleshooting and tour replay. | Search titles/tags, expand/collapse, clear search and follow instructions against current UI. S23. | ____ | ____ |
| F56 | First-use and replayed tours follow the user's permitted workflow and resume/navigate correctly. | First visit, completion state, replay, restricted roles and cross-page transitions. S23. | ____ | ____ |
| F57 | Crime APIs correctly read, create, update and delete the fields supported by each handler. | GET/POST collection and GET/PUT/DELETE record; validation, duplicate rejection, derived classification, parent counts and cache refresh. S24. | ____ | ____ |
| F58 | Aggregate, hourly, latest and available-year APIs return correct scoped data with bounded/paged record reads. | Verify query filters, compact analysis view, midnight, complete paging and not-found responses. S24–S25. | ____ | ____ |
| F59 | Barangay lookup/create and permission lookup APIs produce valid reference data and appropriate authorization outcomes. | Search, input validation, exact role checks and reference-cache invalidation. S24. | ____ | ____ |
| F60 | Alternate Hono read, permission and cache endpoints behave consistently with their documented route contracts. | Response envelopes, X-Response-Time, supported queries, telemetry/flush and direct-request authorization. S24. | ____ | ____ |

### B. Reliability

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| R01 | Invalid input or a failed import chunk does not leave broken incident/offense relationships. | Check chunk transactions, row fallback, counts and partial-import reporting; do not assume whole-file atomicity. S17–S18. | ____ | ____ |
| R02 | Re-imports and supported concurrent mutations preserve identities, sibling records and correct parent counts. | Repeat fixture import; overlap imports; update/reparent/delete; inspect final records. S18. | ____ | ____ |
| R03 | Rapid scope changes do not allow older responses to overwrite current map, comparison or case selections. | Delay earlier requests; change filters/select records; test cancellation and shared subscribers. S06–S09, S13, S25. | ____ | ____ |
| R04 | Network/database failures are distinguishable from valid empty results, and retry restores correct data. | Inject failed stats/detail requests; check maps/charts/cases and retry. S10–S13, S25. | ____ | ____ |
| R05 | PDF/image generation and archive failures preserve user control and do not falsely report successful storage or download. | Failed rendering, archive rejection, long report, retry and reopened artifacts. S14–S16, S20. | ____ | ____ |
| R06 | Restarting the application preserves stored data/archives and allows normal operation to recover. | App restart, cold cache, fresh login and retrieved archived bytes. S20, S25–S26. | ____ | ____ |
| R07 | Scheduled exports tolerate observed failures and restarts without silent loss, corruption or unintended deletion. | Worker stop/restart, missed due time, job failure, duplicate-worker scenario and retention boundaries. S21. | ____ | ____ |
| R08 | Restricted functions remain protected when called directly, including alternate and auxiliary routes. | Exact role matrix; unauthenticated/low-privilege reads/writes/cache flush; record bypasses. S01–S03, S19–S24. | ____ | ____ |
| R09 | Permission removal, account deletion and session expiration are detected consistently. | Session API, heartbeat/focus refresh, cache invalidation, direct requests and logout. S01–S03, S25. | ____ | ____ |
| R10 | Idle warnings and expiration remain consistent when a tab is suspended or settings change. | Wall-clock deadline, stay-signed-in, polling, new tab and failed logout request. S02–S03. | ____ | ____ |
| R11 | A cache failure or expired entry can recover without serving materially incorrect results. | Provider/loader failure, TTL expiry, invalidation and cold/warm behavior. S25. | ____ | ____ |
| R12 | Monitoring and audit evidence accurately indicate the condition and limits of the subsystem being assessed. | Cross-check hard-coded labels, event completeness, timestamps, measured versus illustrative metrics and actual worker logs. S19, S21–S22. | ____ | ____ |

### C. Usability — observed task performance

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| U01 | A participant can identify the permitted starting page and move between the required modules. | T01/T11; record wrong turns and assistance. S02, S23. | ____ | ____ |
| U02 | Filter state, period, offense, felony stage and geographic scope are recognizable before interpreting results. | T03/T05; have the participant state the active scope. S06. | ____ | ____ |
| U03 | Map/compare controls, threat bands and change labels can be understood without confusing counts or periods. | T03/T04; include zero baseline and incidence/offense units. S05–S09. | ____ | ____ |
| U04 | Validation and empty/error states explain what happened and the action needed to continue. | T03/T08; malformed headers/rows and failed requests. S07, S17, S19. | ____ | ____ |
| U05 | Analytics values, chart labels/tooltips and drill-down interactions enable accurate interpretation. | T05; identify a peak and verify its underlying records. S10–S12. | ____ | ____ |
| U06 | Case grouping, searching, paging and offense switching support record review without losing context. | T06; select a filtered sibling and return to its parent. S13. | ____ | ____ |
| U07 | Report selection, PDF editing and image export controls make their effects and output clear. | T07; choose one subsection, edit a narrative and retrieve the intended file. S14–S16. | ____ | ____ |
| U08 | Keyboard navigation and focus behavior allow required non-pointer tasks to be completed. | Tab/Shift+Tab/Enter/Escape; dropdowns, dialogs, report editor, Cases and tour. Record inaccessible map-only actions. S02–S23. | ____ | ____ |
| U09 | High contrast, text size and reduced motion remain effective without hiding content or controls. | T02/T11; both themes, enlarged text, focus outlines and animation preferences. S04. | ____ | ____ |
| U10 | Essential tasks remain usable at the chosen screen sizes and browser zoom levels. | Desktop, smaller laptop/tablet; map overlays, tables, compare panes, docs and PDF controls. S05–S23. | ____ | ____ |
| U11 | Progress, saving state and destructive-action wording help prevent unintended or duplicate actions. | Upload/export/save/delete/revoke flows; document absent confirmations or misleading success states. S03, S14–S22. | ____ | ____ |
| U12 | Documentation and role-aware tours let a first-time participant complete and repeat an assigned workflow with reduced assistance. | T11; record first and repeat completion time/help. S23. | ____ | ____ |

### D. Efficiency — performance efficiency

Set local measurement targets in Section 6 **before** timing. A fast response that omits records or produces incorrect totals does not satisfy this criterion.

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| E01 | Initial map display and interaction become usable within the agreed time target. | Cold/warm navigation, tiles/GeoJSON ready and first usable controls. S05, S25. | ____ | ____ |
| E02 | Filter, drawer, timeline and playback changes update within the agreed target without excessive repeated requests. | Sparse/dense dates, rapid changes, shared concurrent GETs and midnight scope. S06–S08, S25. | ____ | ____ |
| E03 | Both comparison panes and the ledger remain responsive under representative data volumes. | Independent filtering plus synchronized pan/zoom and resize. S09. | ____ | ____ |
| E04 | Overview/analytics and Cases load complete records efficiently, including scopes above one API page. | First statistics versus detail-ready time; >2,000 offense rows; parent-status summaries; paging. S10–S13, S25. | ____ | ____ |
| E05 | PDF preview/regeneration, document download and PNG/ZIP exports meet agreed time and browser-memory targets. | Long text, all sections, large matrix and many barangay maps. S14–S16. | ____ | ____ |
| E06 | Import parsing, duplicate checks and persistence meet the agreed throughput target without blocking routine use. | Record size/rows, total time, rows/sec, 250-row chunk behavior and partial outcomes. S17–S18. | ____ | ____ |
| E07 | Database query/pool use remains within agreed capacity under representative concurrent use. | Latency, pool max/active/idle/waiting and worker's separate process/pool. S22, S25. | ____ | ____ |
| E08 | Snapshot and scheduled-export generation use acceptable time/storage at the expected dataset size. | Archive byte growth, metadata-only listing and retention effects. S20–S21. | ____ | ____ |
| E09 | Cache/read sharing reduces redundant work while keeping post-mutation results correct. | Cold/warm timings, loader counts, single-flight events, TTL/LRU and mutation invalidation. S25. | ____ | ____ |
| E10 | Telemetry polling and session/idle tracking have acceptable network, CPU and memory overhead. | Refresh Off/5/10/30 seconds, long session, background tab and high-frequency input. S02, S22, S25. | ____ | ____ |

### E. Maintainability — technical evaluator

| ID | Evaluation statement | Check / source | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| M01 | Page components, hooks, API handlers, services and persistence code have understandable responsibilities. | Trace one filter/read and one import/mutation from UI to database. S17–S18, S24–S25. | ____ | ____ |
| M02 | Shared classification, identity, query scope, thresholds and data colors can be changed consistently. | Locate common helpers and inspect remaining duplicate implementations. S06–S07, S18, S25. | ____ | ____ |
| M03 | Schema changes, migrations and generated Prisma types provide a reproducible data-model evolution path. | Review parent/offense migration and notification removal; exercise only on disposable data. S18, S26. | ____ | ____ |
| M04 | Regression tests meaningfully verify the core data model and failure-prone behavior. | Classification, import, grouping, counts, query sharing, palette, idle timer and PDF editor tests. S26. | ____ | ____ |
| M05 | Database and HTTP integration tests are clearly isolated and skipped prerequisites are visible. | Inspect guards, target URLs, fixtures and destructive setup before enabling. S26. | ____ | ____ |
| M06 | Audit and diagnostic information lets a maintainer locate the cause of an observed failure. | Correlate event, user/session, source row, request and worker/process evidence. S19, S21–S22. | ____ | ____ |
| M07 | Runtime configuration and secrets can be identified and supplied without editing application source. | Database/JWT, worker environment/time zone, defaults, package/runtime prerequisites and safe diagnostics. S01, S21, S26. | ____ | ____ |
| M08 | Changes to report content/layout can be verified without breaking other exports or the live data scope. | Shared report data, inline edit IDs, font bounds, long-page tests and preview/output comparison. S14–S16, S26. | ____ | ____ |
| M09 | Cache namespaces, TTLs and invalidation paths are understandable and testable after a data or permission change. | Trace create/update/delete/import and user/schedule mutations to cache behavior. S03, S18, S21, S25. | ____ | ____ |
| M10 | Deployment instructions reproduce app/worker startup, supervision, shutdown and operational checks. | Clean test environment; package scripts/service configuration; actual worker output, not label alone. S21, S26. | ____ | ____ |
| M11 | User/developer documentation matches current mounted features and clearly identifies incomplete or removed behavior. | Check notifications, snapshot/restore wording, risk formulas, map layers and report editor against source. S23, S26. | ____ | ____ |
| M12 | The project provides a reproducible dependency, type-check, lint, test and build workflow for the evaluated revision. | Identify package-manager/lockfile choice; run relevant checks and record failures/skips separately. S26. | ____ | ____ |

### F. User-Friendliness — participant experience

Use this section after hands-on use. Participants answer in their own words and from their assigned role; technical internals need not be understood.

| ID | Evaluation statement | Experience to consider | Rating | Evidence / remarks |
| --- | --- | --- | --- | --- |
| UF01 | I can understand the purpose of each module and find the task I need. | Map, Compare, Overview, Analytics, Cases, Reports and Settings. | ____ | ____ |
| UF02 | The wording, dates, status labels and units are clear and consistent. | Blotter versus offense, scope, stage, counts and time labels. | ____ | ____ |
| UF03 | I can review a blotter with several offenses without becoming confused. | Parent group, matching siblings, status and full details. | ____ | ____ |
| UF04 | The maps, legends and charts are comfortable to read and help me explain the selected data. | Numeric scales, color labels, tooltips and period comparison. | ____ | ____ |
| UF05 | The system gives understandable feedback while loading, saving, importing or encountering an error. | Progress, completion, partial import, retry and recovery wording. | ____ | ____ |
| UF06 | I can prepare a briefing report and obtain the intended PDF or images with confidence. | Sections, preview edits, download names, archive retrieval and ZIP. | ____ | ____ |
| UF07 | Appearance, text-size and accessibility options let me work comfortably. | Light/dark/system, palettes, motion, contrast and saved preferences. | ____ | ____ |
| UF08 | Password, permission and idle-session messages clearly tell me what action to take. | First password, lockout, restricted pages, warning and sign-out. | ____ | ____ |
| UF09 | The guide and replayable walkthrough help me recover when I am unsure. | Topic search, relevant steps and troubleshooting guidance. | ____ | ____ |
| UF10 | I can complete my regular assigned workflow with an acceptable amount of effort. | Find an area, compare periods, review cases and prepare the needed output. | ____ | ____ |

## 6. Objective measurement sheet

Targets are evaluation-team decisions for the actual deployment and dataset; ISO 25010 does not prescribe the following latency or load values. Establish targets before measuring. Use the same environment for comparisons; collect at least five runs for a median and a larger sample if reporting p95. Record cold/warm cache state and errors.

| Measurement | Agreed target / workload | Observed result | Runs / evidence | Meets target? |
| --- | --- | --- | --- | --- |
| Map: navigation to usable boundaries and controls | ______ seconds; ______ viewport | ______ | ______ | ______ |
| Filter/time-step update to correct map/legend/drawer | ______ milliseconds | ______ | ______ | ______ |
| Compare: both panes plus ledger ready | ______ seconds | ______ | ______ | ______ |
| Overview/analytics: statistics ready / drill-down ready | ______ / ______ seconds | ______ | ______ | ______ |
| Cases list / full dossier / sibling loading | ______ / ______ / ______ seconds | ______ | ______ | ______ |
| All-section PDF preview / regeneration / download | ______ pages; ______ / ______ / ______ seconds | ______ | ______ | ______ |
| PNG/ZIP export with selected barangay maps | ______ images; ______ seconds; ______ MB | ______ | ______ | ______ |
| XLSX/XLS/CSV import, with duplicates and invalid rows | ______ MB; ______ rows; ______ rows/sec | ______ | ______ | ______ |
| Manual/scheduled snapshot generation | ______ records; ______ seconds; ______ bytes | ______ | ______ | ______ |
| API response time and completeness, cold/warm | ______ requests; median ______ ms; p95 ______ ms | ______ | ______ | ______ |
| Concurrent sessions and database pool behavior | ______ users; waiting ______; errors ______ | ______ | ______ | ______ |
| Browser/server memory during repeated operations | ______ minutes; heap/RSS growth limit ______ MB | ______ | ______ | ______ |
| Idle warning / expiration deviation | ______ minute timeout; warning ______; tolerance ______ seconds | ______ | ______ | ______ |
| Worker due-job execution and scheduled retention | Time zone ______; allowed delay ______; cutoff ______ | ______ | ______ | ______ |
| First-time versus repeat workflow completion | ______ task; time/help/error targets ______ | ______ | ______ | ______ |

## 7. Evidence, defects and evaluator comments

Duplicate rows as needed. Use synthetic IDs and sanitized screenshots/responses when recording police data.

| Evidence / defect ID | Item IDs | Task / account permissions / scope | Expected result | Actual result and artifact reference | Severity / owner / follow-up |
| --- | --- | --- | --- | --- | --- |
| ______ | ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ | ______ |

**Most useful implemented feature:**

________________________________________________________________________

**Most difficult or confusing task:**

________________________________________________________________________

**Missing capability or improvement requested (separate from existing-feature scores):**

________________________________________________________________________

**Required corrective actions / retest conditions:**

________________________________________________________________________

## 8. Scoring and decision

For each section:

- **Score sum:** sum of numeric ratings only.
- **Rated items:** number of items with a numeric rating, excluding `NT` and `NA`.
- **Section mean:** score sum ÷ rated items. Report `Not evaluated` if there are no numeric ratings.
- **Coverage:** rated items ÷ (total section items − justified `NA` items) × 100. `NT` reduces coverage. Report `Not applicable` if the denominator is zero.

| Criterion | Total items | Numeric score sum | Rated items | NT | Justified NA | Mean / 5 | Coverage |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Functionality | 60 | ____ | ____ | ____ | ____ | ____ | ____% |
| Reliability | 12 | ____ | ____ | ____ | ____ | ____ | ____% |
| Usability | 12 | ____ | ____ | ____ | ____ | ____ | ____% |
| Efficiency | 10 | ____ | ____ | ____ | ____ | ____ | ____% |
| Maintainability | 12 | ____ | ____ | ____ | ____ | ____ | ____% |
| User-Friendliness | 10 | ____ | ____ | ____ | ____ | ____ | ____% |
| **Total coverage** | **116** | — | ____ | ____ | ____ | — | ____% |

**Optional overall descriptive score:** (Functionality mean + Reliability mean + Usability mean + Efficiency mean + Maintainability mean + User-Friendliness mean) ÷ 6. This gives equal weight to the six requested sections despite their different item counts. Calculate only when all six section means are available; always publish section coverage and unresolved issues beside it. For multiple evaluators, calculate section results within comparable role/task groups before combining them; technical-only assignments should not become artificial low scores for ordinary users.

Do not infer acceptance from an average alone. Record whether required checks were completed and whether unresolved authorization failures, data loss, material count errors, unusable exports, or unverified critical workflows affect deployment. Acceptance thresholds and any mandatory items must be agreed by the evaluation team before testing.

**Agreed acceptance thresholds / mandatory item IDs:**

________________________________________________________________________

**Overall descriptive score, if eligible:** ______ / 5

**Applicable-item coverage:** ______%

**Open critical/major findings:** ______

**Decision:** [ ] Accept [ ] Accept with corrective actions [ ] Retest required [ ] Not accepted [ ] Insufficient evidence

**Reason and scope of decision:**

________________________________________________________________________

**Evaluator signature / date:** ______________________________

**Technical reviewer signature / date:** ______________________________

**Approving authority / date, if required:** ______________________________

## Appendix A. API coverage checklist

These are implementation surfaces to exercise, not a claim that all methods have identical permissions or semantics. Next.js crime/barangay wrappers delegate to the backend route files cited above.

| API family | Implemented methods / paths | Evaluation references |
| --- | --- | --- |
| Authentication | `POST /api/auth/login`, `GET /api/auth/session`, `POST /api/auth/logout`, `POST /api/auth/change-password`, `POST /api/auth/update-password` | F01–F07, R08–R10 |
| Users and permissions | `GET/POST /api/users`; `PUT/DELETE /api/users/[id]`; `POST /api/users/[id]/unlock`; `GET /api/permissions` | F04–F05, F08, F59, R08–R09 |
| User preferences | `GET/PATCH /api/users/settings/landing-page`; `GET/PATCH /api/users/settings/auto-logout` | F06–F07, F10 |
| Crime records | `GET/POST /api/crimes`; `GET/PUT/DELETE /api/crimes/[id]`; `POST /api/crimes/upload` | F38–F43, F57, R01–R04, R08 |
| Crime summaries | `GET /api/crimes/stats`, `/api/crimes/barangay-counts`, `/api/crimes/hourly-timeline`, `/api/crimes/latest`, `/api/crimes/years` | F13–F27, F58 |
| Geography | `GET/POST /api/barangays` | F11, F59, R08 |
| History | `GET/POST /api/audit-logs`; `GET /api/import-logs` | F44–F45, R08, R12 |
| Archives | `GET/POST /api/backups`; `GET/DELETE /api/backups/[id]` | F34, F46–F48, R05–R06 |
| Scheduled exports | `GET/POST /api/exports/schedule` | F49–F50, R07–R08 |
| Diagnostics | `GET/POST /api/system/performance`; POST actions `ping`, `clear_cache` with scope, `prune_exports` | F51–F54, R08, R12 |
| Hono alternate API | Under `/api/hono`: GET `/crimes`, `/crimes/stats`, `/crimes/barangay-counts`, `/crimes/hourly-timeline`, `/crimes/years`, `/crimes/latest`, `/barangays`, `/permissions`, `/cache/telemetry`; POST `/cache/flush` | F60, R08, E09 |

## Appendix B. Preparation evidence and remaining verification

This appendix documents preparation of the form; it does not pre-fill the evaluator's responses.

| Evidence type | Result from preparation on October 15, 2026 |
| --- | --- |
| Source inspection | Reviewed current pages/navigation, map/compare components, dashboard/case/report flows, settings/authentication, upload/parser/identity/aggregation logic, API routes, schema/migrations, cache/pool code, cron worker, documentation/tour and deployment/test surfaces. Current uncommitted additions/removals were included. |
| Offline regression run | `env -u TEST_DATABASE_URL -u TEST_BASE_URL bun test tests` → **60 passed, 2 skipped, 0 failed**, across 13 test files. |
| Database integration | **Not executed.** The skipped database test rebuilds core tables in a dedicated local `securetanza_offense_test*` database. Inspect its guards/setup before enabling `TEST_DATABASE_URL`. |
| HTTP integration | **Not executed.** Requires a local test server and isolated test database. The presence of parser/unit tests does not establish successful live authenticated upload. |
| User/browser evaluation | **Not executed for this documentation task.** Complete Sections 4–7 with representative participants and accounts. |
| Full application lint/type-check/build | **Not executed for this documentation task.** Record separately under M12 for the evaluated build. |
| Worker, retention, restart and deployment acceptance | **Not executed.** Requires observing the actual worker and disposable operational tests. |
| ISO source check | Official 2011 and 2023 edition records consulted for the edition/scope note in Section 1; questionnaire wording and scoring are project-specific. |

Relevant regression sources: [classification](../tests/offense-classification.test.ts), [records](../tests/crime-records.test.ts), [filtering](../tests/offense-filter.test.ts), [analytics](../tests/crime-analytics.test.ts), [case grouping](../tests/case-grouping.test.ts), [map counts](../tests/map-count-sync.test.ts), [fetch performance](../tests/crime-fetch-performance.test.ts), [colors](../tests/data-colors.test.ts), [import validation](../tests/import-validation.test.ts), [idle session](../tests/idle-session.test.ts), [report editor](../tests/report-editor.test.ts), [database](../tests/crime-database.test.ts), [HTTP](../tests/crime-http.test.ts).
