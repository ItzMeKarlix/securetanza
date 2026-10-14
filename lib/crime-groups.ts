// Preset crime groupings offered alongside individual incident types in the
// crime type filter. A group is stored in `selectedCrimeType` under its label and
// expanded into a "|"-separated list of keywords when sent to the API; the backend
// matches each keyword as a case-insensitive "contains" and ORs them together.

export interface CrimeGroup {
  label: string;
  description: string;
  color: string;
  keywords: string[];
}

export const CRIME_GROUPS: CrimeGroup[] = [
  {
    label: "8 Focus Crimes",
    description:
      "Murder, Homicide, Physical Injury, Rape, Robbery, Theft, Carnapping (MV & MC)",
    color: "#DC2626",
    keywords: [
      "Murder",
      "Homicide",
      "Physical Injur",
      "Rape",
      "Robbery",
      "Theft",
      "Carnapping",
      "Carjacking",
    ],
  },
  {
    label: "Special Laws",
    description:
      "Drugs, Illegal Gambling, Firearms, VAWC/Domestic Violence, Child Abuse (RA 7610), Gun Ban, Anti-Fencing and other special law violations",
    color: "#8B5CF6",
    keywords: [
      "Drug",
      "Buy Bust",
      "Gambling",
      "Firearm",
      "Illegal Possession",
      "VAWC",
      "Violence Against",
      "Domestic Violence",
      "Child Abuse",
      "RA 7610",
      "Gun Ban",
      "Firecracker",
      "Pot Session",
      "Anti-",
      "Special Law",
      "(RA ",
      "(PD ",
      "(BP ",
    ],
  },
];

export const KEYWORD_SEPARATOR = "|";

export function getCrimeGroup(
  label: string | null | undefined,
): CrimeGroup | undefined {
  return label ? CRIME_GROUPS.find((g) => g.label === label) : undefined;
}

/** Value to send as the `incidentType` query param for a selected crime type or group. */
export function toIncidentTypeParam(selected: string): string {
  const group = getCrimeGroup(selected);
  return group ? group.keywords.join(KEYWORD_SEPARATOR) : selected;
}

/** Prisma `where` fragment for an `incidentType` param, supporting "|"-separated keywords. */
export function buildIncidentTypeWhere(value: string) {
  const terms = value
    .split(KEYWORD_SEPARATOR)
    .map((t) => t.trim())
    .filter(Boolean);
  if (terms.length <= 1) {
    return {
      crimeType: { equals: terms[0] ?? value, mode: "insensitive" as const },
    };
  }
  return {
    OR: terms.map((t) => ({
      crimeType: { contains: t, mode: "insensitive" as const },
    })),
  };
}

/** Base recorded offense family is independent of its felony stage. */
export function buildOffenseCategoryWhere(value: string) {
  const terms = value
    .split(KEYWORD_SEPARATOR)
    .map((term) => term.trim())
    .filter(Boolean);
  return terms.length <= 1
    ? {
        offenseDefinition: {
          label: { equals: terms[0] ?? value, mode: "insensitive" as const },
        },
      }
    : {
        OR: terms.map((term) => ({
          offenseDefinition: {
            label: { contains: term, mode: "insensitive" as const },
          },
        })),
      };
}
