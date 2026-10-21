// API utility functions for fetching data from backend
import { readJson } from "./read-json";

/**
 * One recorded offense. Offenses are independent: two offenses on the same
 * blotter are two records, never merged.
 */
export interface OffenseRecord {
  id: string;
  /** Base offense family, e.g. "Murder". */
  offenseCategory?: string;
  offenseDefinitionId?: string;
  /** Stage-qualified analytical type, e.g. "Frustrated Murder". */
  crimeType: string;
  /** The stage exactly as the workbook recorded it; stageOfFelony is the normalised one. */
  sourceStageOfFelony?: string | null;
  blotterNo?: string;
  dateEncoded?: string;
  pro?: string;
  ppo?: string;
  stn?: string;
  pcp?: string;
  region?: string;
  province?: string;
  municipal?: string;
  barangay: string;
  street?: string;
  typeOfPlace?: string;
  dateReported: string;
  timeReported: string;
  dateCommitted: string;
  timeCommitted: string;
  isCrime: boolean;
  modeReporting?: string;
  /** CONSUMMATED, FRUSTRATED, ATTEMPTED or UNKNOWN. */
  stageOfFelony?: string;
  offense?: string;
  offenseType?: string;
  section?: string;
  modus?: string;
  suspectMotive?: string;
  suspectSubMotive?: string;
  heinous?: boolean;
  sensational?: boolean;
  threatGrp?: boolean;
  grpAffiliation?: string;
  mrs?: string;
  suspectIsEGO?: boolean;
  suspectEGOPosition?: string;
  suspectEGOClass?: string;
  suspectCount?: number;
  suspectArrested?: boolean;
  victimIsEGO?: boolean;
  victimEGOPosition?: string;
  victimEGOClass?: string;
  victimCount?: number;
  caseStatus?: string;
  investigator?: string;
  headInves?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

/** Every count is a count of offenses (backend/lib/crime-analytics.ts). */
export interface CrimeStats {
  totalOffenses: number;
  offensesByCategory: Array<{ category: string; count: number }>;
  offensesByBarangay: Array<{ barangay: string; count: number }>;
  crimesByStage: Array<{ stage: string; count: number }>;
  activeCases: number;
  resolvedToday: number;
  recentCrimes: number;
  safetyIndex: string;
  crimesByType: Array<{ type: string; count: number }>;
  monthlyStats: Array<{ month: number; count: number }>;
  activity: number[];
}

export interface Barangay {
  id: string;
  name: string;
  coordinates?: any;
  population?: number;
  area?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

// Fetch offense records
export async function fetchCrimes(params?: {
  barangay?: string;
  /** Exact blotter number: every offense recorded on that blotter. */
  blotterNo?: string;
  stn?: string;
  limit?: number;
  view?: "analysis";
  caseStatus?: string;
  hour?: number;
  crimeType?: string;
  offenseCategory?: string;
  stageOfFelony?: string;
  startDateCommitted?: string;
  endDateCommitted?: string;
  startHour?: number;
  endHour?: number;
  year?: number;
}): Promise<OffenseRecord[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.view) searchParams.set("view", params.view);
    if (params?.caseStatus) searchParams.set("caseStatus", params.caseStatus);
    if (params?.hour !== undefined)
      searchParams.set("hour", String(params.hour));
    if (params?.barangay) searchParams.set("barangay", params.barangay);
    if (params?.blotterNo) searchParams.set("blotterNo", params.blotterNo);
    if (params?.stn) searchParams.set("stn", params.stn);
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.offenseCategory)
      searchParams.set("offenseCategory", params.offenseCategory);
    if (params?.crimeType)
      searchParams.set("crimeType", params.crimeType);
    if (params?.stageOfFelony)
      searchParams.set("stageOfFelony", params.stageOfFelony);
    if (params?.startDateCommitted)
      searchParams.set("startDateCommitted", params.startDateCommitted);
    if (params?.endDateCommitted)
      searchParams.set("endDateCommitted", params.endDateCommitted);
    if (params?.year) searchParams.set("year", params.year.toString());

    // Analytical consumers need the complete scope; explicit limits remain bounded.
    const pageSize = Math.min(Math.max(params?.limit || 2000, 1), 2000);
    searchParams.set("limit", String(pageSize));
    let crimes: OffenseRecord[] = [];
    let offset = 0;
    while (true) {
      searchParams.set("offset", String(offset));
      const result = await readJson<ApiResponse<OffenseRecord[]>>(
        `/api/crimes?${searchParams}`,
      );
      if (!result.success)
        throw new Error(result.error || "Failed to fetch crimes");
      const page = result.data || [];
      crimes.push(...page);
      if (params?.limit || page.length < pageSize) break;
      offset += page.length;
    }
    if (params?.startHour !== undefined || params?.endHour !== undefined) {
      crimes = crimes.filter((crime) => {
        const hour = Number(crime.timeCommitted.split(":")[0]);
        if (params.startHour !== undefined && hour < params.startHour)
          return false;
        if (params.endHour !== undefined && hour > params.endHour) return false;
        return true;
      });
    }

    return crimes;
  } catch (error) {
    console.error("Error fetching crimes:", error);
    return [];
  }
}

// Fetch crime statistics
export async function fetchCrimeStats(params?: {
  barangay?: string;
  startDate?: string;
  endDate?: string;
  year?: number;
  crimeType?: string;
  offenseCategory?: string;
  stageOfFelony?: string;
}): Promise<CrimeStats | null> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.barangay) searchParams.set("barangay", params.barangay);
    if (params?.startDate) searchParams.set("startDate", params.startDate);
    if (params?.endDate) searchParams.set("endDate", params.endDate);
    if (params?.year) searchParams.set("year", params.year.toString());
    if (params?.offenseCategory)
      searchParams.set("offenseCategory", params.offenseCategory);
    if (params?.crimeType)
      searchParams.set("crimeType", params.crimeType);
    if (params?.stageOfFelony)
      searchParams.set("stageOfFelony", params.stageOfFelony);

    const result = await readJson<ApiResponse<CrimeStats>>(
      `/api/crimes/stats?${searchParams}`,
    );

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch crime statistics");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching crime statistics:", error);
    return null;
  }
}

// Fetch barangays
export async function fetchBarangays(search?: string): Promise<Barangay[]> {
  try {
    const searchParams = new URLSearchParams();
    if (search) searchParams.set("search", search);

    const response = await fetch(`/api/barangays?${searchParams}`);
    if (!response.ok) {
      return [];
    }
    const result: ApiResponse<Barangay[]> = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch barangays");
    }

    return result.data || [];
  } catch (error) {
    console.error("Error fetching barangays:", error);
    return [];
  }
}

/** The compact shape the dashboard lists show for one offense. */
export function toOffenseSummary(crime: OffenseRecord): {
  id: string;
  type: string;
  stage?: string;
  date: string;
  status:
    | "Cleared"
    | "Under Investigation"
    | "Filed in Court"
    | "Archived"
    | "Pending";
  severity: "High" | "Medium" | "Low";
  location: string;
  timeReported?: string;
  dateCommitted?: string;
  timeCommitted?: string;
} {
  // Determine status based on caseStatus field (primary) or stageOfFelony (fallback)
  let status:
    | "Cleared"
    | "Under Investigation"
    | "Filed in Court"
    | "Archived"
    | "Pending" = "Pending";

  if (crime.caseStatus) {
    const caseStatusLower = crime.caseStatus.toLowerCase();
    if (
      caseStatusLower.includes("cleared") ||
      caseStatusLower.includes("solved")
    ) {
      status = "Cleared";
    } else if (
      caseStatusLower.includes("investigation") ||
      caseStatusLower.includes("investigating")
    ) {
      status = "Under Investigation";
    } else if (
      caseStatusLower.includes("filed") ||
      caseStatusLower.includes("court")
    ) {
      status = "Filed in Court";
    } else if (
      caseStatusLower.includes("archived") ||
      caseStatusLower.includes("closed")
    ) {
      status = "Archived";
    }
  }

  // Severity from the heinous flag, then the offense's crime type
  let severity: "High" | "Medium" | "Low" = "Medium";

  // Check heinous flag first
  if (crime.heinous) {
    severity = "High";
  } else {
    const highSeverityTypes = [
      "murder",
      "homicide",
      "rape",
      "robbery",
      "kidnapping",
      "arson",
    ];
    const lowSeverityTypes = [
      "theft",
      "vandalism",
      "trespass",
      "public disorder",
      "alarm",
    ];

    const crimeTypeLower = crime.crimeType.toLowerCase();
    if (highSeverityTypes.some((type) => crimeTypeLower.includes(type))) {
      severity = "High";
    } else if (
      lowSeverityTypes.some((type) => crimeTypeLower.includes(type))
    ) {
      severity = "Low";
    }
  }

  // Format date
  const dateCommitted = new Date(crime.dateCommitted);
  const now = new Date();
  const diffHours = Math.floor(
    (now.getTime() - dateCommitted.getTime()) / (1000 * 60 * 60),
  );

  let dateString = "";
  if (diffHours < 1) {
    dateString = "Just now";
  } else if (diffHours < 24) {
    dateString = `${diffHours}h ago`;
  } else if (diffHours < 48) {
    dateString = "Yesterday";
  } else {
    dateString = dateCommitted.toLocaleDateString();
  }

  return {
    id: crime.id,
    type: crime.crimeType,
    stage: crime.stageOfFelony,
    date: dateString,
    status,
    severity,
    location: crime.barangay,
    timeReported: crime.timeReported,
    dateCommitted: crime.dateCommitted,
    timeCommitted: crime.timeCommitted,
  };
}
