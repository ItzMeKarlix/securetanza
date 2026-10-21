import type { OffenseRecord } from "./api";

export function caseBlotterLabel(row: OffenseRecord): string {
  return row.blotterNo?.trim() || "Not recorded";
}

export function caseStatusLabel(status?: string): string {
  const text = status?.trim().toLowerCase() || "";
  if (text.includes("cleared") || text === "solved") return "Cleared";
  if (text.includes("investigation") || text.includes("investigating")) return "Under Investigation";
  if (text.includes("filed") || text.includes("court")) return "Filed in Court";
  if (text.includes("archived") || text.includes("closed")) return "Archived";
  return "Pending";
}

/** Search across the offense and where it was recorded. Each offense matches on its own. */
export function filterOffenses(rows: OffenseRecord[], search: string): OffenseRecord[] {
  const unique = [...new Map(rows.map((row) => [row.id, row])).values()];
  const query = search.trim().toLowerCase();
  if (!query) return unique;
  return unique.filter((row) =>
    [row.offenseCategory, row.crimeType, row.offense, row.stageOfFelony, row.blotterNo, row.barangay, row.street, row.municipal, row.stn]
      .some((value) => value?.toLowerCase().includes(query)),
  );
}

const STAGE_ORDER = ["CONSUMMATED", "FRUSTRATED", "ATTEMPTED", "UNKNOWN"];

/** Offenses per stage of felony, in the legal order, omitting stages with none. */
export function stageCounts(rows: OffenseRecord[]): Array<{ stage: string; count: number }> {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const stage = (row.stageOfFelony || "UNKNOWN").toUpperCase();
    counts.set(stage, (counts.get(stage) ?? 0) + 1);
  }
  return STAGE_ORDER.filter((stage) => counts.has(stage)).map((stage) => ({ stage, count: counts.get(stage)! }));
}

/** A later selection or effect cleanup invalidates every earlier completion. */
export function createCaseRequestGuard() {
  let version = 0;
  return {
    start() {
      const requestVersion = ++version;
      return {
        commit(update: () => void) {
          if (requestVersion === version) update();
        },
      };
    },
    cancel() { version++; },
  };
}

/** One row of the Cases table: a blotter and the offenses recorded on it. */
export interface BlotterRow {
  key: string;
  /** Newest offense first; the row shows its date and location. */
  offenses: OffenseRecord[];
  primary: OffenseRecord;
  /** The one status shared by every offense, or "Multiple statuses". */
  status: string;
  /** The one stage shared by every offense, or null when they differ. */
  stage: string | null;
}

const NO_BLOTTER = new Set(["", "-", "n/a", "none", "null"]);

/**
 * Display grouping for the Cases table: offenses recorded on the same blotter
 * (same station and blotter number) share one collapsible row. Each offense is
 * still its own record and is counted on its own; an offense without a blotter
 * number is never grouped with anything.
 */
export function groupByBlotter(rows: OffenseRecord[]): BlotterRow[] {
  const groups = new Map<string, OffenseRecord[]>();
  for (const row of rows) {
    const blotter = row.blotterNo?.trim().toLowerCase() ?? "";
    const key = NO_BLOTTER.has(blotter) ? `offense:${row.id}` : `blotter:${(row.stn ?? "").trim().toLowerCase()}|${blotter}`;
    const list = groups.get(key);
    if (list) list.push(row);
    else groups.set(key, [row]);
  }
  const time = (row: OffenseRecord) => new Date(row.dateCommitted).getTime();
  return [...groups.entries()]
    .map(([key, offenses]) => {
      offenses.sort((a, b) => time(b) - time(a) || (a.offenseCategory || a.crimeType).localeCompare(b.offenseCategory || b.crimeType));
      const statuses = new Set(offenses.map((o) => caseStatusLabel(o.caseStatus)));
      const stages = new Set(offenses.map((o) => (o.stageOfFelony || "UNKNOWN").toUpperCase()));
      return {
        key,
        offenses,
        primary: offenses[0],
        status: statuses.size === 1 ? [...statuses][0] : "Multiple statuses",
        stage: stages.size === 1 ? [...stages][0] : null,
      };
    })
    .sort((a, b) => time(b.primary) - time(a.primary));
}
