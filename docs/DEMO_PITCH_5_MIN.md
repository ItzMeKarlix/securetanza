# SecureTanza: five-minute command briefing and demo

Audience: senior police officers and station command.  
Purpose: demonstrate how existing blotter records can support deployment planning, case review, and command reporting; request a supervised operational pilot.  
Prepared: 12 October 2026.

## Presenter preparation

Use one story throughout: **Where should we focus patrol attention, at what times, and what changed since the previous period?**

- Sign in before presenting with an account that can access Map, Compare, Cases, Analytics, and Reports.
- Choose one barangay and one offense category with enough approved demonstration records to show useful patterns. Use equal-length comparison periods with reasonably complete data.
- Preload the map, comparison, analytics, cases, and reports in browser tabs. Preserve the same barangay and offense scope where supported; check each screen's period separately.
- Prepare one PDF from that scope and keep it open. Show the report configuration live, then switch to the prepared PDF.
- Use sanitized demonstration records. Keep a screenshot of each screen and the PDF available in case the network or a page fails.
- Rehearse once with a timer. The script leaves time for short clicks and transitions; do not add a live login, Excel upload, or lengthy report generation.

The timings below total five minutes. Read only the quoted text aloud. Screen instructions and the appendix are presenter notes.

## 0:00–0:35 — Open with the command problem

**Screen:** full municipal map, already signed in.

> Good morning, Sir and Ma'am. Before assigning patrols, we need clear answers to three questions: where are recorded incidents concentrated, when do they occur, and what has changed?
>
> Our blotter records contain that information, but reviewing separate spreadsheets takes time.
>
> SecureTanza brings those records into one operational view for Tanza. Let me show how a commander can move from a municipal overview to a focused briefing.

## 0:35–1:20 — Identify where to focus

**Action:** on **Map** (`/`), choose the demonstration period and offense category. Click the selected barangay to open its summary. Point to the legend and incident count.

> This map shows the distribution of recorded incidents across Tanza's barangays. We can filter by period and offense, then select a barangay for closer review.
>
> For this demonstration, we are looking at one offense category. The shading helps us identify areas with higher recorded incident counts within this selection.
>
> Command can use this view to identify locations for patrol review, community coordination, or further investigation. These are recorded incidents; interpretation still requires local knowledge and awareness of reporting gaps.

## 1:20–2:00 — See what changed

**Action:** open **Compare** (`/compare`), with two equal-length periods already selected and the same offense category on both sides. Point to **Change from A to B** and one barangay row.

> Next, we compare two periods side by side. The change panel shows which barangays recorded increases or decreases, alongside the totals.
>
> This gives the commander a concrete starting point for review: where should we investigate an increase, and where should we examine a decline?
>
> We can bring these findings into the next briefing and discuss them alongside patrol activity, reporting practices, and information from officers on the ground.

## 2:00–2:50 — Connect patterns to operational decisions

**Action:** open **Analytics** (`/dashboard/analytics`). Show the hourly distribution and crime breakdown for the selected scope. Briefly switch to **Cases** (`/dashboard/cases`) and open one sanitized record.

> The analytics view adds the time dimension. It shows when incidents were recorded as occurring and which offense types appear most often.
>
> Combined with the map, this can inform a discussion about patrol timing and locations, subject to available personnel and field intelligence.
>
> We can then review the underlying case records, including blotter references, incident details, assigned investigators, and case status. The commander can check the records behind a pattern before deciding on action.

## 2:50–3:40 — Produce a briefing and preserve accountability

**Action:** open **Reports** (`/dashboard/reports`), point to section selection, then show the prepared PDF.

> SecureTanza also prepares a PDF briefing with selected statistics, charts, and barangay comparisons. This provides a common reference for command conferences and peace-and-order discussions.
>
> For personnel maintaining the records, the system supports Excel imports with validation and duplicate checks, access permissions, and audit records.
>
> Configured rules can flag patterns when a new dataset is imported. Scheduled exports also help preserve working copies. Together, these features support a repeatable process: update the records, review the patterns, and brief command using the same information.

## 3:40–5:00 — Close with long-term cost and the request

**Screen:** show the cost table below. Keep it visible through the closing request.

> For sustainability, the recurring database cost is manageable. Supabase Pro starts at twenty-five US dollars per month. With Small database compute, the estimated total is thirty dollars monthly, before taxes and additional usage.
>
> For operational records, I recommend budgeting for point-in-time recovery, which lets us restore the database to a chosen time after an error. With seven-day recovery, our Small-to-Medium compute scenarios are approximately one hundred thirty to one hundred seventy-five dollars monthly.
>
> I suggest a Supabase allocation of one hundred fifty to two hundred dollars per month, or nine to twelve thousand pesos using a planning rate of sixty pesos per dollar. That is one hundred eight to one hundred forty-four thousand pesos annually. Application hosting, internet, and maintenance are separate.
>
> We propose a supervised pilot with designated personnel to verify record accuracy, briefing usefulness, and actual usage before wider adoption.
>
> SecureTanza gives command a clearer basis for deciding where to focus, when to deploy, and what to review at the next briefing. Thank you.

## Closing screen: suggested and expected Supabase cost

One production project; approximate monthly charges; within included usage; before taxes and payment fees. Peso conversion uses **₱60 = US$1 as a budgeting assumption**, not a quoted exchange rate.

| Configuration | Expected USD/month | Planning PHP/month | Expected USD/year |
| --- | ---: | ---: | ---: |
| Pilot: Pro + Small, daily database backups | ~$30 | ~₱1,800 | ~$360 |
| Operational baseline: Pro + Small + 7-day point-in-time recovery | ~$130 | ~₱7,800 | ~$1,560 |
| Growth scenario: Pro + Medium + 7-day point-in-time recovery | ~$175 | ~₱10,500 | ~$2,100 |
| **Suggested operational allocation, including headroom** | **$150–$200** | **₱9,000–₱12,000** | **$1,800–$2,400** |

The first three rows are calculated scenarios, not measured bills or performance guarantees. The last row is a proposed budget. Pro subscription and included allowances follow [Supabase pricing](https://supabase.com/pricing); compute follows [compute billing](https://supabase.com/docs/guides/platform/manage-your-usage/compute); recovery follows [database backup pricing and requirements](https://supabase.com/docs/guides/platform/backups).

## Cost appendix — for questions after the five-minute pitch

### How the monthly estimate is calculated

Supabase bills the Pro organization subscription plus each project's compute, less one monthly organization-level compute credit. The credit is not repeated for every project. Compute is hourly, so monthly figures vary with billing-period length. [Source: compute billing](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

| Item | Pilot | Operational baseline | Growth scenario |
| --- | ---: | ---: | ---: |
| Pro organization subscription | $25 | $25 | $25 |
| Compute: Small / Small / Medium | ~$15 | ~$15 | ~$60 |
| Organization compute credit | −$10 | −$10 | −$10 |
| 7-day point-in-time recovery | — | ~$100 | ~$100 |
| **Estimated monthly total** | **~$30** | **~$130** | **~$175** |

Pro includes daily database backups with seven-day retention. Point-in-time recovery costs about $100 monthly for a seven-day recovery window and requires at least Small compute. Daily backups can leave up to a day's data to recover through other means; point-in-time recovery provides finer recovery granularity. Choose the recovery option against the station's acceptable data-loss window and verify it with a restore drill. [Source: database backups](https://supabase.com/docs/guides/platform/backups).

The absolute one-project Pro floor is about $25 with Micro compute. Small is the proposed pilot starting point, subject to workload checks. A separate always-running Micro staging project adds about $10 monthly; it receives no second organization credit. [Sources: pricing](https://supabase.com/pricing), [compute billing](https://supabase.com/docs/guides/platform/manage-your-usage/compute).

### Three-year planning scenario

This assumes Small in year one and Medium in years two and three, with seven-day point-in-time recovery throughout. The upgrade is illustrative, not an automatic requirement based on age or record count.

| Year | Expected USD/year | Planning PHP/year |
| --- | ---: | ---: |
| Year 1: operational baseline | $1,560 | ₱93,600 |
| Year 2: growth scenario | $2,100 | ₱126,000 |
| Year 3: growth scenario | $2,100 | ₱126,000 |
| **Three-year expected subtotal** | **$5,760** | **₱345,600** |
| **Three-year allocation at $150–$200/month** | **$5,400–$7,200** | **₱324,000–₱432,000** |

For this growth scenario, use the **$200/month ceiling** when planning across all three years; the $150/month allocation alone would fall short of the expected three-year subtotal. These totals exclude taxes, price changes, usage overages, and other services. No live Supabase usage or invoice was inspected.

### What can increase the bill

- **Database disk:** Pro includes 8 GB per project; additional general-purpose provisioned disk is $0.125 per GB-month. For example, 20 GB provisioned adds about $1.50 monthly. [Source: disk billing](https://supabase.com/docs/guides/platform/manage-your-usage/disk-size).
- **Data transfer:** uncached egress includes 250 GB monthly, then $0.09/GB. An extra 50 GB adds $4.50. Separate file storage includes 100 GB, then $0.0213/GB-month. [Source: pricing](https://supabase.com/pricing).
- **More compute or projects:** increase compute only when import duration, query latency, memory, or connection pressure justify it. Recalculate before adding staging projects or replicas. [Source: compute billing](https://supabase.com/docs/guides/platform/manage-your-usage/compute).
- **Optional recovery and governance:** longer recovery windows and additional organizational requirements can change the plan choice. Team starts at $599/month; it is not required simply to retain more incident records. Pro does not include a contractual uptime SLA. [Sources: backups](https://supabase.com/docs/guides/platform/backups), [pricing](https://supabase.com/pricing).

### Project-specific cost and recovery notes

The current app uses PostgreSQL through Prisma and its own account/permission system. Supabase Auth user allowances do not measure the app's current account usage.

Export files are stored as database bytes in `Backup.content`, so they consume database disk. The separate Supabase Storage allowance does not cover these files. The cron worker prunes **scheduled exports** after 14 days; manually retained exports are left intact. This retention does not delete the original incident records. Keep the worker running and review archive growth.

An Excel export is a working data snapshot. It is not a complete database disaster-recovery backup, and an export retained inside the same database is not an independent off-site copy. Any independent backup storage and administration must be budgeted separately.

Review disk, transfer, query performance, and the upcoming invoice monthly. Supabase's spend cap covers some usage categories but excludes compute and point-in-time recovery; it is not a fixed total-bill ceiling. [Source: cost controls](https://supabase.com/docs/guides/platform/cost-control).

The repository's deployment guide runs the web app and export worker on a Debian VM. Supabase charges here cover the database service. Application hosting or VM upkeep, internet, domain registration, maintenance, training, and independent backup storage are outside this estimate.

### Suggested answers to command questions

**“Does this predict crime or prove our patrols caused a reduction?”**  
It summarizes recorded incidents and compares periods. Patrol decisions and causal conclusions require officer judgment and additional evidence.

**“How current is the information?”**  
It reflects records uploaded into the system; freshness depends on the station's update process.

**“Can we use it without internet?”**  
The documented app can run on the station LAN, but a Supabase cloud database needs internet connectivity. Map tiles also use external services. Offline operation is not established by this review.

**“How will we judge the pilot?”**  
Compare the imported records with the approved source, time a recurring briefing task, collect commander feedback, and record actual operating costs. Set targets with the station before starting.

## Evidence and rehearsal limits

The demo sequence was checked against source files and routes, not a live authenticated session. Before presenting, confirm the chosen records, charts, and PDF on the running app. Do not quote incident totals or claim measured time savings without checking them.

| Pitch point | Source in this repository |
| --- | --- |
| Operational audience and purpose | `PRODUCT.md` |
| Map and page navigation | `components/layout/map-header.tsx`, `components/map/threat-scale.tsx` |
| Period comparison and changes | `components/compare/change-ledger.tsx` |
| Time patterns and underlying cases | `components/dashboard/analytics-tab.tsx`, `components/dashboard/incidents-tab.tsx` |
| Report selection and PDF export | `components/dashboard/reports-tab.tsx` |
| Excel validation and duplicate handling | `backend/api/crimes/upload/route.ts` |
| Database archive and export retention | `backend/prisma/schema.prisma`, `backend/services/backup.service.ts`, `backend/cron/worker.ts` |
| Application hosting scope | `deploy/README.md` |

Official pricing was checked on 12 October 2026. Recheck before procurement or a later presentation.
