> **Superseded (2026-10-21):** the system no longer groups offenses into incidents. See `docs/offense-only-model.md`. The steps below (including `scripts/recover-crime-workbook.ts`, now removed) no longer apply.

# SecureTanza incident workbook analysis

Analyzed: 2026-10-12. Source: `data/incidentrep_20160100448_2026-01-01-2026-09-29.xlsx`, Sheet1, A1:CN425 (92 columns; one header row). The committed-date range actually present is 2026-01-01 through 2026-09-27. All rows identify Tanza PS and have iscime=YES.

## Purpose and agreed counting policy

Classify each recorded offense using its offense description and recorded stage of felony, preserve all offenses belonging to the same blotter, and display both unique incidents and recorded offenses. The user selected both totals on 2026-10-12. These are counts of source records, not independently verified legal charges or a substitute for a prescribed official reporting methodology.

## Verified totals

| Measure | Count |
| --- | --- |
| Recorded offense rows | 424 |
| Distinct normalized blotter numbers | 363 |
| Single-offense blotters | 316 |
| Multiple-offense blotters | 47 |
| Rows belonging to multiple-offense blotters | 108 |
| Additional offenses beyond one per blotter | 61 |
| Normalized source incident-type labels | 38 |
| Normalized source offense labels | 45 |
| Offense + stage combinations | 47 |
| Exact duplicate rows (normalized across all columns) | 0 |
| Blank blotter numbers | 0 |
| Blank section values | 421 |

Normalization trims text, collapses whitespace, and ignores case. It does not combine different statutory descriptions or synonyms. All 424 blotter + offense + stage combinations are distinct in this workbook. Every repeated blotter contains different offense descriptions. Across each repeated blotter, date/time committed, barangay, source incidentType, victimCount and suspectCount agree. Other shared fields require validation before choosing authoritative incident-level values.

| Stage (as recorded) | Offense rows |
| --- | --- |
| CONSUMMATED | 414 |
| FRUSTRATED | 9 |
| ATTEMPTED | 1 |

| Offenses per blotter | Blotters | Offense rows |
| --- | --- | --- |
| 1 | 316 | 316 |
| 2 | 34 | 68 |
| 3 | 12 | 36 |
| 4 | 1 | 4 |
| Total | 363 | 424 |

## Concrete example: 042120000-202601-0002

Sheet1 rows 4–6 share the source label `(Incident) Alarms and Scandals` and the same blotter number, but represent three offenses:

| Excel row | Recorded offense | Stage | Suggested analytical label |
| --- | --- | --- | --- |
| 4 | Alarms and Scandals – RPC Art. 155 | CONSUMMATED | Alarms and Scandals |
| 5 | Light Threats – RPC Art. 283 | CONSUMMATED | Light Threats |
| 6 | Comprehensive Law on Firearms and Ammunition – RA 10591 | CONSUMMATED | RA 10591 violation; finer subtype needs review |

This contributes one incident, three recorded offenses, and one multiple-offense incident. Keep the original incident label as source context; do not copy it into the analytical classification of each offense.

## Why offense and stage must drive the analytical view

The workbook has no source incidentType named Murder or Homicide. Nevertheless, it contains nine rows with offense `MURDER - RPC ART. 248` and five with `HOMICIDE - RPC ART. 249`:

| Offense | Consummated | Frustrated | Attempted | Total |
| --- | --- | --- | --- | --- |
| Murder – RPC Art. 248 | 4 | 4 | 1 | 9 |
| Homicide – RPC Art. 249 | 0 | 5 | 0 | 5 |

The nine murder rows use shooting, stabbing, hacking, assault, or found-cadaver labels. The five homicide rows use stabbing. Separately, eight consummated rows say reckless imprudence resulting to homicide; retain that distinct recorded offense rather than merging it with Homicide – RPC Art. 249.

Recommended analytical representation: a reviewed offense family plus a separate stage dimension, optionally displayed together as “Frustrated Murder.” Store the source offense and source incidentType unchanged alongside normalized fields. Stage comes from stageoffelony; do not infer it from injuries, case clearance, or incidentType.

Offense + stage cannot reconstruct the original incidentType deterministically: 16 of the 47 pairs have multiple source labels. Broad law descriptions also do not reliably identify a specific statutory offense. For example, RA 9165 has 117 offense rows under four source labels; RA 10591 has 14 under six labels. Most section values are absent. Preserve broad law-level categories where the data does not establish a subtype, and use a reviewed mapping rather than a keyword-only guess.

## Current application behavior and its consequences

- `backend/lib/crime-deduplication.ts:74` returns only `blotter:<number>` whenever a blotter exists. Distinct offenses and stages are ignored.
- `backend/api/crimes/upload/route.ts` uses that fingerprint for both in-file and database checks. A read-only replay of the actual helper against these headers accepted 363 rows and rejected 61. This describes the deduplication step on this workbook; it is not evidence that the live database currently contains exactly those records.
- `backend/services/crime.service.ts:581` also rejects a new record whenever its blotter number already exists.
- `scripts/prune-duplicate-crimes.ts` uses the same fingerprint and therefore regards different offenses under one blotter as deletable duplicates. Its definition must change before any pruning is performed.
- `backend/services/crime.service.ts:215` counts CrimeIncident rows and groups by incidentType. Its monthly SQL uses COUNT(*). Restoring offense rows without changing the counting definitions would inflate incident totals.
- Crime-type filters, barangay/hourly statistics, dashboard calculations, exports, backups and notification thresholds need the same incident/offense distinction.
- `lib/api.ts:214` uses felony stage as a fallback for case status, mapping consummated to cleared. These are separate source dimensions; retain caseStatus independently.

## Recommended relational design

Use an explicit association between a blotter incident and a reusable offense definition:

`Incident 1 → many IncidentOffense many → 1 OffenseDefinition`

Incident to OffenseDefinition is many-to-many through IncidentOffense. Incident to its actual offense records is one-to-many.

| Entity | Responsibility | Key fields |
| --- | --- | --- |
| Incident | One parent record per identified blotter incident | id, sourceSystem/station, normalized blotterNo, incident date/time/location, original incident label |
| OffenseDefinition | Reusable, reviewed offense vocabulary | id, stable code, canonical label, analytical family, legal reference |
| IncidentOffense | One source offense occurrence linked to the parent incident | id, incidentId, offenseDefinitionId, recorded stage, source offense, section, source incidentType, source provenance |

The incident key should be scoped to the source system and station when blotter numbers are not guaranteed globally unique. Missing blotter numbers must not all collapse into one incident; use a separate identity/review path.

Store felony stage on IncidentOffense, because different offenses under the same blotter can have different stages. Keep original strings for traceability; allow an explicit missing/unknown state for historical imports rather than inventing consummated values.

The requested “new row” is a new column/field if it holds 0 or 1:

- `hasMultipleOffenses = distinct offense-definition count > 1`.
- For the example, it is true (1), and the parent has offenseCount=3.
- All offense rows in a flattened export may show the parent’s flag. A single-offense parent is false (0).
- This flag does not link records or identify a group. Use incidentId for that. If numeric group IDs are preferred, one blotter can be group 1, another group 2, etc.; every group cannot use 1.
- Prefer deriving the flag from associations. If persisted, maintain it transactionally on create, edit and delete. Do not sum a repeated flag on child rows to count parent incidents.

A smaller transitional option is to keep the flat CrimeIncident table and add a parent incidentId while fixing import identities and every aggregate. It reduces migration work initially but retains repeated shared data and makes incident/offense semantics harder to enforce. Adding only a 0/1 flag does not solve either identity or counting.

## Counting and filtering rules

- Total incidents: count matching parent incidents once.
- Total recorded offenses: count matching IncidentOffense records.
- Multiple-offense incidents: count parent incidents with more than one distinct offense, once each.
- Offense charts: group offense records by reviewed offense family and stage. Their sum can reconcile to the selected offense total if every row belongs to exactly one included category and unknowns are retained.
- An offense/stage filter matches parents with at least one matching child. Count those parents once and count only matching children in the filtered offense total. If all offenses of matching incidents are displayed, label that separate figure explicitly.
- Incident counts across offense categories are not additive: one parent can appear in several categories.
- Parent victim/suspect counts repeated across offense rows must not be summed repeatedly. Where counts differ, preserve source values and review ownership rather than assume a total.
- Keep month, barangay and time scope consistent across all totals and breakdowns. Do not use case-status clearance as felony stage, or felony stage as case-status clearance.

## Import identity and recovery

Distinguish an incident identity from an offense-record identity. A scoped blotter finds the parent; it cannot decide that a child is a duplicate. Within this workbook, blotter + normalized offense + stage uniquely identifies all 424 rows, but that is an observed property, not a universal guarantee. Future data can contain the same offense and stage more than once under a blotter, different sections, multiple victims, or revised stages.

Preserve a source record identifier when available, plus file/sheet/row provenance and a normalized row hash. This export has no dedicated offense-record identifier, so an import policy must explicitly decide how to handle repeated identical offense rows versus amendments. Source row position alone cannot provide stable identity across revised exports. Use database constraints and transactions to make repeated/concurrent imports safe after that policy is defined. Keep exact file/row provenance separate from business identity.

Changing stage should not automatically add a new offense occurrence when the source record is an amendment. Broad law-level descriptions without sections must not be split into imagined statutory counts.

Previously discarded offenses cannot be recovered by adding a database column. After fixing identity and counting, re-import authoritative source workbooks with a reconciliation preview. Restore missing associations without duplicating existing records. Existing shared case/status fields may differ between retained and newer exports and need an explicit amendment policy.

Verification targets for this source: 363 parents, 424 offense records, 47 multiple-offense parents; stage totals 414/9/1; example parent has three children; a second identical import adds zero records; independent offense and incident breakdowns reconcile within their own scope; adding/removing an offense updates its parent flag; concurrent imports cannot double-insert. These are expected outcomes for a future implementation, not tests of changed production code.

## Complete normalized offense/stage inventory

These labels reproduce normalized source text; they are not an approved canonical taxonomy.

| Source offense | Stage | Rows |
| --- | --- | --- |
| ABANDONMENT OF PERSON IN DANGER AND ABANDONMENT OF ONE'S OWN VICTIM - RPC ART. 275 | CONSUMMATED | 1 |
| ACT PROMOTING STRONGER PROTECTION AGAINST RAPE, SEXUAL EXPLOITATION, ABUSE, AMENDING ACT NO. 3815, RA NO. 8353, RA NO. 7610 - RA 11648 | CONSUMMATED | 3 |
| ACTS OF LASCIVIOUSNESS - RPC ART. 336 | CONSUMMATED | 22 |
| ADULTERY - RPC ART. 333 | CONSUMMATED | 1 |
| ALARMS AND SCANDALS - RPC ART. 155 | CONSUMMATED | 17 |
| ANTI-CABLE TELEVISION AND CABLE INTERNET TAPPING ACT OF 2013 - RA 10515 | CONSUMMATED | 1 |
| ANTI-ELECTRICITY AND ELECTRIC TRANSMISSION LINES/MATERIALS PILFERAGE ACT OF 1994 - RA 7832 | CONSUMMATED | 5 |
| ANTI-FENCING LAW OF 1979 - PD 1612 | CONSUMMATED | 6 |
| ANTI-GAMBLING LAW - PD 1602 | CONSUMMATED | 2 |
| ANTI-RAPE LAW OF 1997 - RA 8353 | CONSUMMATED | 12 |
| ANTI-VIOLENCE AGAINST WOMEN AND THEIR CHILDREN ACT OF 2004 - RA 9262 | CONSUMMATED | 23 |
| COMPREHENSIVE DANGEROUS DRUGS ACT OF 2002 - RA 9165 | CONSUMMATED | 117 |
| COMPREHENSIVE LAW ON FIREARMS AND AMMUNITION - RA 10591 (COVERS RA 9516, RA 8294, PD 1866) | CONSUMMATED | 14 |
| CONCUBINAGE - RPC ART. 334 | CONSUMMATED | 2 |
| CONSENTED ABDUCTION - RPC ART. 343 | CONSUMMATED | 1 |
| DIRECT ASSAULTS - RPC ART. 148 | CONSUMMATED | 5 |
| GRAVE COERCIONS - RPC ART. 286 AMENDED BY 3815 AND RA 7890 | CONSUMMATED | 1 |
| GRAVE THREATS - RPC ART. 282 | CONSUMMATED | 5 |
| HOMICIDE - RPC ART. 249 | FRUSTRATED | 5 |
| ILLEGAL POSSESSION OF BLADED, POINTED OR BLUNT WEAPONS - BP 6 | CONSUMMATED | 2 |
| ILLEGAL POSSESSION, MANUFACTURE, ACQUISITION, OF FIREARMS, AMMUNITION OR EXPLOSIVES - PD 1866 AS AMENDED BY RA 8294 AND RA 9516 | CONSUMMATED | 1 |
| LAND TRANSPORTATION AND TRAFFIC CODE (COMPULSARY REGISTRATION OF MOTOR VEHICLES) - RA 4136 AS AMENDED BY BP BLG 74 | CONSUMMATED | 2 |
| LESS SERIOUS PHYSICAL INJURIES - RPC ART. 265 | CONSUMMATED | 1 |
| LIGHT THREATS - RPC ART. 283 | CONSUMMATED | 4 |
| MALICIOUS MISCHIEF - RPC ART. 327 | CONSUMMATED | 9 |
| MURDER - RPC ART. 248 | ATTEMPTED | 1 |
| MURDER - RPC ART. 248 | CONSUMMATED | 4 |
| MURDER - RPC ART. 248 | FRUSTRATED | 4 |
| NEW ANTI-CARNAPPING ACT OF 2016 - MC - RA 10883 (REPEALED RA 6539) | CONSUMMATED | 7 |
| NEW ANTI-CARNAPPING ACT OF 2016 - MV - RA 10883 (REPEALED RA 6539) | CONSUMMATED | 1 |
| OTHER FORMS OF TRESPASS - RPC ART. 281 | CONSUMMATED | 5 |
| PENALIZING OBSTRUCTION OF APPREHENSION AND PROSECUTION OF CRIMINAL OFFENDERS. - PD 1829 | CONSUMMATED | 1 |
| QUALIFIED THEFT - RPC ART. 310 AS AMENDED BY BP BLG 71 | CONSUMMATED | 4 |
| QUALIFIED TRESPASS TO DWELLING - RPC ART. 280 | CONSUMMATED | 8 |
| RECKLESS IMPRUDENCE RESULTING TO DAMAGE TO PROPERTY - RPC ART 365 | CONSUMMATED | 17 |
| RECKLESS IMPRUDENCE RESULTING TO HOMICIDE - RPC ART 365 | CONSUMMATED | 8 |
| RECKLESS IMPRUDENCE RESULTING TO PHYSICAL INJURY - RPC ART 365 | CONSUMMATED | 20 |
| RESISTANCE AND DISOBEDIENCE TO A PERSON IN AUTHORITY OR THE AGENTS OF SUCH PERSON - RPC ART. 151 | CONSUMMATED | 12 |
| ROBBERY - RPC ART. 293 | CONSUMMATED | 10 |
| SAFE SPACES ACT (GENDER BASED SEXUAL HARASSMENT) - RA 11313 | CONSUMMATED | 5 |
| SLIGHT ILLEGAL DETENTION - RPC ART. 268 | CONSUMMATED | 1 |
| SLIGHT PHYSICAL INJURIES AND MALTREATMENT - RPC ART. 266 | CONSUMMATED | 2 |
| SPECIAL PROTECTION OF CHILDREN AGAINST CHILD ABUSE, EXPLOITATION AND DISCRIMINATION ACT. (ANTI- CHILD ABUSE LAW) - RA 7610 | CONSUMMATED | 21 |
| SWINDLING (ESTAFA) - RPC ART. 315 AS AMENDED BY PD 1689 | CONSUMMATED | 5 |
| THE FORESTRY REFORM CODE OF THE PHILIPPINES (ILLEGAL LOGGING) - PD 705 | CONSUMMATED | 1 |
| THEFT - RPC ART. 308 | CONSUMMATED | 21 |
| UNJUST VEXATIONS - RPC ART. 287 | CONSUMMATED | 4 |

## Multiple-offense blotter inventory

| Blotter number | Distinct offenses | Excel rows |
| --- | --- | --- |
| 042120000-202601-0002 | 3 | 4, 5, 6 |
| 042120000-202601-0035 | 2 | 16, 17 |
| 042120000-202601-0039 | 2 | 18, 19 |
| 042120000-202601-0049 | 2 | 26, 27 |
| 042120000-202601-0055 | 3 | 33, 34, 35 |
| 042120000-202601-0078 | 2 | 43, 44 |
| 042120000-202601-0097 | 2 | 52, 53 |
| 042120000-202601-0121 | 4 | 61, 62, 63, 64 |
| 042120000-202601-0130 | 2 | 65, 66 |
| 042120000-202601-0152 | 2 | 71, 72 |
| 042120000-202602-0165 | 2 | 74, 75 |
| 042120000-202602-0209 | 2 | 83, 84 |
| 042120000-202602-0217 | 2 | 88, 89 |
| 042120000-202602-0261 | 2 | 101, 102 |
| 042120000-202603-0335 | 2 | 119, 120 |
| 042120000-202603-0369 | 2 | 125, 126 |
| 042120000-202603-0388 | 2 | 132, 133 |
| 042120000-202603-0470 | 3 | 150, 151, 152 |
| 042120000-202603-0501 | 3 | 159, 160, 161 |
| 042120000-202604-0553 | 3 | 176, 177, 178 |
| 042120000-202604-0577 | 2 | 185, 186 |
| 042120000-202604-0628 | 2 | 194, 195 |
| 042120000-202604-0649 | 2 | 201, 202 |
| 042120000-202604-0688 | 2 | 213, 214 |
| 042120000-202604-0690 | 2 | 215, 216 |
| 042120000-202605-0715 | 2 | 221, 222 |
| 042120000-202605-840 | 2 | 249, 250 |
| 042120000-202606-0894 | 2 | 260, 261 |
| 042120000-202606-0908 | 2 | 264, 265 |
| 042120000-202606-0938 | 2 | 270, 271 |
| 042120000-202606-0966 | 3 | 274, 275, 276 |
| 042120000-202606-1039 | 3 | 289, 290, 291 |
| 042120000-202607-1094 | 2 | 307, 308 |
| 042120000-202607-1188 | 3 | 324, 325, 326 |
| 042120000-202607-1194 | 2 | 327, 328 |
| 042120000-202607-1256 | 2 | 342, 343 |
| 042120000-202608-1272 | 2 | 345, 346 |
| 042120000-202608-1333 | 3 | 359, 360, 361 |
| 042120000-202608-1346 | 3 | 363, 364, 365 |
| 042120000-202608-1380 | 2 | 375, 376 |
| 042120000-202608-1399 | 3 | 378, 379, 380 |
| 042120000-202608-1410 | 3 | 381, 382, 383 |
| 042120000-202609-1501 | 2 | 400, 401 |
| 042120000-202609-1569 | 2 | 413, 414 |
| 042120000-202609-1581 | 2 | 415, 416 |
| 042120000-202609-1598 | 2 | 420, 421 |
| 042120000-202609-1618 | 2 | 424, 425 |

## Verification performed

Read-only analysis used the existing SheetJS dependency. A separate Python standard-library ZIP/XML parser independently confirmed 424 rows, 363 blotters, 45 offense labels, 424 distinct blotter/offense/stage combinations, all three stage totals and the distribution of blotter group sizes. The actual header-normalization and fingerprint helpers were replayed without database access and returned 363 accepted / 61 rejected fingerprints. No database, source workbook, schema or application behavior was changed.
