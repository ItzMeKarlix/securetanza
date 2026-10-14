import type { CrimeIncident } from "./api";

export interface CaseGroup {
  key: string;
  representative: CrimeIncident;
  offenses: CrimeIncident[];
  matchingOffenses: CrimeIncident[];
  offenseCount: number;
  hasMultipleOffenses: boolean;
  complete: boolean;
  status: string;
}

export function caseBlotterLabel(row: CrimeIncident): string {
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

function groupKey(row: CrimeIncident): string {
  if (row.incidentId) return `incident:${row.incidentId}`;
  const blotter = row.blotterNo?.trim();
  if (!blotter) return `offense:${row.id}`;
  return `legacy:${JSON.stringify([row.stn || "", row.municipal || "", blotter].map(value => value.trim().toLowerCase()))}`;
}

function summarize(key: string, offenses: CrimeIncident[], matchingOffenses = offenses): CaseGroup {
  const representative = offenses[0];
  const offenseCount = Math.max(offenses.length, ...offenses.map(row => row.offenseCount || (row.hasMultipleOffenses ? 2 : 1)));
  const complete = offenses.length >= offenseCount;
  const labels = new Set(offenses.map(row => caseStatusLabel(row.caseStatus)));
  let status = labels.size === 1 ? [...labels][0] : "Multiple statuses";
  if (!complete) {
    if (representative.incidentCleared === true) status = "Cleared";
    else if (representative.incidentResolved === true) status = "Resolved";
    else if (labels.size > 1 || (status === "Cleared" && representative.incidentCleared === false)) status = "Multiple statuses";
    else status = "Status unavailable";
  }
  return { key, representative, offenses, matchingOffenses, offenseCount, hasMultipleOffenses: offenseCount > 1, complete, status };
}

/** Parent identity is independent of analytical offense and stage filters. */
export function groupCaseIncidents(rows: CrimeIncident[]): CaseGroup[] {
  const records = new Map<string, CrimeIncident>();
  rows.forEach(row => records.set(row.id, row));
  const parents = new Map<string, CrimeIncident[]>();
  for (const row of records.values()) {
    const key = groupKey(row);
    const siblings = parents.get(key) || [];
    siblings.push(row);
    parents.set(key, siblings);
  }
  return [...parents.entries()].map(([key, offenses]) => {
    offenses.sort((a, b) => new Date(b.dateCommitted).getTime() - new Date(a.dateCommitted).getTime());
    return summarize(key, offenses);
  }).sort((a, b) => new Date(b.representative.dateCommitted).getTime() - new Date(a.representative.dateCommitted).getTime());
}

/** Search counts matching records; sibling expansion does not add to those counts. */
export function filterCaseGroups(groups: CaseGroup[], search: string): CaseGroup[] {
  const query = search.trim().toLowerCase();
  if (!query) return groups;
  return groups.flatMap(group => {
    const row = group.representative;
    const parentMatch = [row.blotterNo, row.barangay, row.street, row.municipal, row.stn].some(value => value?.toLowerCase().includes(query));
    const matchingOffenses = parentMatch ? group.matchingOffenses : group.matchingOffenses.filter(offense => [offense.crimeType, offense.incidentType, offense.offense, offense.sourceIncidentType].some(value => value?.toLowerCase().includes(query)));
    return matchingOffenses.length ? [{ ...group, matchingOffenses }] : [];
  });
}

export function mergeCaseOffenses(group: CaseGroup, siblings: CrimeIncident[]): CaseGroup {
  const rows = new Map(group.offenses.map(row => [row.id, row]));
  for (const sibling of siblings) {
    if (groupKey(sibling) === group.key && !rows.has(sibling.id)) rows.set(sibling.id, sibling);
  }
  return summarize(group.key, [...rows.values()], group.matchingOffenses);
}

export function findCaseDeepLink(groups: CaseGroup[], offenseId: string, pageSize: number): { groupKey: string; offense: CrimeIncident; page: number } | null {
  for (let index = 0; index < groups.length; index++) {
    const offense = groups[index].offenses.find(row => row.id === offenseId);
    if (offense) return { groupKey: groups[index].key, offense, page: Math.floor(index / pageSize) + 1 };
  }
  return null;
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
