/** Analytical labels describe the recorded offense, never the incident mechanism. */
export const FELONY_STAGES = [
  "CONSUMMATED",
  "FRUSTRATED",
  "ATTEMPTED",
  "UNKNOWN",
] as const;
export type FelonyStage = (typeof FELONY_STAGES)[number];

export function normalizeOffenseText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function normalizeFelonyStage(value: unknown): FelonyStage {
  const stage = normalizeOffenseText(value).toUpperCase();
  return FELONY_STAGES.includes(stage as FelonyStage)
    ? (stage as FelonyStage)
    : "UNKNOWN";
}

// Broad statutes stay broad: section/subtype is not inferred from Buy Bust or Shooting.
export const OFFENSE_LABELS: Record<string, string> = {
  "comprehensive dangerous drugs act of 2002 - ra 9165":
    "Dangerous Drugs Law (RA 9165)",
  "anti-violence against women and their children act of 2004 - ra 9262":
    "Violence Against Women and Children (RA 9262)",
  "special protection of children against child abuse, exploitation and discrimination act. (anti- child abuse law) - ra 7610":
    "Child Protection Law (RA 7610)",
  "comprehensive law on firearms and ammunition - ra 10591 (covers ra 9516, ra 8294, pd 1866)":
    "Firearms and Ammunition Law (RA 10591)",
  "anti-rape law of 1997 - ra 8353": "Rape (RA 8353)",
  "act promoting stronger protection against rape, sexual exploitation, abuse, amending act no. 3815, ra no. 8353, ra no. 7610 - ra 11648":
    "Sexual Offenses Law (RA 11648)",
  "new anti-carnapping act of 2016 - mc - ra 10883 (repealed ra 6539)":
    "Carnapping — Motorcycle (RA 10883)",
  "new anti-carnapping act of 2016 - mv - ra 10883 (repealed ra 6539)":
    "Carnapping — Motor Vehicle (RA 10883)",
  "safe spaces act (gender based sexual harassment) - ra 11313":
    "Safe Spaces Law (RA 11313)",
  "anti-fencing law of 1979 - pd 1612": "Anti-Fencing Law (PD 1612)",
  "anti-electricity and electric transmission lines/materials pilferage act of 1994 - ra 7832":
    "Electricity Pilferage Law (RA 7832)",
  "land transportation and traffic code (compulsary registration of motor vehicles) - ra 4136 as amended by bp blg 74":
    "Motor Vehicle Registration Law (RA 4136)",
  "penalizing obstruction of apprehension and prosecution of criminal offenders. - pd 1829":
    "Obstruction of Apprehension and Prosecution (PD 1829)",
  "the forestry reform code of the philippines (illegal logging) - pd 705":
    "Forestry Law (PD 705)",
  "illegal possession, manufacture, acquisition, of firearms, ammunition or explosives - pd 1866 as amended by ra 8294 and ra 9516":
    "Firearms, Ammunition and Explosives Law (PD 1866)",
  "illegal possession of bladed, pointed or blunt weapons - bp 6":
    "Illegal Possession of Bladed, Pointed or Blunt Weapons (BP 6)",
  "anti-gambling law - pd 1602": "Illegal Gambling (PD 1602)",
  "anti-cable television and cable internet tapping act of 2013 - ra 10515":
    "Cable Television and Internet Tapping Law (RA 10515)",
};

export function classifyOffense(
  offense: unknown,
  stage: unknown,
  sourceIncidentType: unknown = "",
) {
  const code = normalizeOffenseText(offense);
  const felonyStage = normalizeFelonyStage(stage);
  const source = String(sourceIncidentType ?? "")
    .replace(/^\((?:Incident|Operation)\)\s*/i, "")
    .trim();
  const title = code
    .split(/\s+-\s+/)[0]
    .replace(/\b\w/g, (c) => c.toUpperCase());
  const category =
    OFFENSE_LABELS[code] ??
    (code ? title : `Unclassified${source ? ` · ${source}` : ""}`);
  const prefix =
    felonyStage === "ATTEMPTED"
      ? "Attempted "
      : felonyStage === "FRUSTRATED"
        ? "Frustrated "
        : felonyStage === "UNKNOWN"
          ? "Unknown Stage · "
          : "";
  return {
    code: code || `unclassified:${normalizeOffenseText(source)}`,
    category,
    felonyStage,
    crimeType: `${prefix}${category}`,
    classificationNeedsReview:
      !code || felonyStage === "UNKNOWN" || /\b(ra|pd|bp)\b/.test(code),
  };
}

/** Collapse records by parent identity, never by their classification. */
export function uniqueIncidentRecords<
  T extends { id: string; incidentId?: string | null },
>(records: T[]): T[] {
  const parents = new Map<string, T>();
  for (const row of records) {
    const key = row.incidentId || row.id;
    if (!parents.has(key)) parents.set(key, row);
  }
  return [...parents.values()];
}
