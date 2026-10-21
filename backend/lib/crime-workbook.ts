import { mapGeoJsonToDb } from "./barangay-mapper";
import { parseNumericField } from "./import-validation";
import { normaliseHeader } from "@/components/upload/upload-meta";
import type { CrimeInput } from "./crime-records";
import { cleanImportedText } from "@/lib/input-sanitize";

/** Shared by HTTP uploads and non-destructive workbook recovery. */
export function parseCrimeWorkbookRow(
  row: Record<string, unknown>,
  source: { file: string; sheet: string; row: number },
): CrimeInput {
  // Read every header as the register column it names (dateReported → date_reported,
  // stn → station). If two headers name the same column, the first one in the sheet wins.
  const normalizedRow: Record<string, unknown> = {};
  Object.keys(row).forEach((key) => {
    const column = normaliseHeader(key);
    if (!(column in normalizedRow)) normalizedRow[column] = row[key];
  });

  // Validate required fields
  if (
    !normalizedRow.barangay ||
    !normalizedRow.date_reported ||
    !normalizedRow.date_committed ||
    !normalizedRow.incident_type
  ) {
    throw new Error(
      "Missing required fields (barangay, date_reported, date_committed, or incident_type)",
    );
  }

  // Map barangay name if needed
  const barangayName = mapGeoJsonToDb(cleanImportedText(normalizedRow.barangay));

  // Parse dates
  const dateReported = parseExcelDate(normalizedRow.date_reported);
  const dateCommitted = parseExcelDate(normalizedRow.date_committed);
  const dateEncoded = normalizedRow.date_encoded
    ? parseExcelDate(normalizedRow.date_encoded)
    : null;

  if (!dateReported || !dateCommitted) {
    throw new Error("Invalid date format");
  }

  // Parse time fields (ensure HH:MM:SS format)
  const timeReported = normalizeTime(normalizedRow.time_reported);
  const timeCommitted = normalizeTime(normalizedRow.time_committed);

  // Parse boolean fields
  const isCrime = parseBoolean(normalizedRow.is_crime);
  const heinous = parseBoolean(normalizedRow.heinous);
  const sensational = parseBoolean(normalizedRow.sensational);
  const threatGrp = parseBoolean(normalizedRow.threat_grp);
  const suspectIsEGO = parseBoolean(normalizedRow.suspect_is_ego);
  const victimIsEGO = parseBoolean(normalizedRow.victim_is_ego);
  // Nullable in the register: a blank cell means not recorded, not "No".
  const suspectArrested = isBlank(normalizedRow.suspect_arrested)
    ? null
    : parseBoolean(normalizedRow.suspect_arrested);

  // Parse numeric fields
  const suspectCount = parseNumericField(
    normalizedRow.suspect_count,
    "suspect_count",
    true,
  );
  const victimCount = parseNumericField(
    normalizedRow.victim_count,
    "victim_count",
    true,
  );
  const latitude = parseNumericField(normalizedRow.lat, "latitude");
  const longitude = parseNumericField(normalizedRow.lng, "longitude");

  if (!cleanImportedText(normalizedRow.incident_type) || !barangayName) {
    throw new Error("Missing required fields (barangay or incident_type)");
  }

  const candidateData = {
    sourceFile: source.file,
    sourceSheet: source.sheet,
    sourceRow: source.row,
    blotterNo: normalizedRow.blotter_no
      ? cleanImportedText(normalizedRow.blotter_no) || null
      : null,
    dateEncoded,
    pro: nullableText(normalizedRow.police_regional_office),
    ppo: nullableText(normalizedRow.police_provincial_office),
    stn: nullableText(normalizedRow.station),
    pcp: nullableText(normalizedRow.police_community_precinct),
    region: nullableText(normalizedRow.region),
    province: nullableText(normalizedRow.province),
    municipal: nullableText(normalizedRow.municipality),
    barangay: barangayName,
    street: nullableText(normalizedRow.street),
    typeOfPlace: nullableText(normalizedRow.type_of_place),
    dateReported,
    timeReported,
    dateCommitted,
    timeCommitted,
    incidentType: cleanImportedText(normalizedRow.incident_type),
    isCrime,
    modeReporting: nullableText(normalizedRow.mode_reporting),
    stageOfFelony: nullableText(normalizedRow.stage_of_felony),
    offense: nullableText(normalizedRow.offense),
    offenseType: nullableText(normalizedRow.offense_type),
    section: nullableText(normalizedRow.section),
    modus: nullableText(normalizedRow.modus),
    suspectMotive: nullableText(normalizedRow.suspect_motive),
    suspectSubMotive: nullableText(normalizedRow.suspect_sub_motive),
    heinous,
    sensational,
    threatGrp,
    grpAffiliation: nullableText(normalizedRow.grp_affiliation),
    incidentTypeThreatGrp: nullableText(normalizedRow.incident_type_threat_grp),
    mrs: nullableText(normalizedRow.mrs),
    suspectIsEGO,
    suspectEGOPosition: nullableText(normalizedRow.suspect_ego_position),
    suspectEGOClass: nullableText(normalizedRow.suspect_ego_class),
    suspectCount,
    suspectArrested,
    victimIsEGO,
    victimEGOPosition: nullableText(normalizedRow.victim_ego_position),
    victimEGOClass: nullableText(normalizedRow.victim_ego_class),
    victimCount,
    caseStatus: nullableText(normalizedRow.case_status),
    investigator: nullableText(normalizedRow.investigator),
    headInves: nullableText(normalizedRow.head_investigator),
    latitude,
    longitude,
  };

  return candidateData;
}

// Helper function to parse Excel date
function parseExcelDate(value: unknown): Date | null {
  if (!value) return null;

  // If it's already a Date object
  if (value instanceof Date) {
    return value;
  }

  // If it's an Excel serial number
  if (typeof value === "number") {
    // Excel dates are days since 1900-01-01 (with a bug for 1900 being a leap year)
    const excelEpoch = new Date(1899, 11, 30);
    const date = new Date(excelEpoch.getTime() + value * 86400000);
    return date;
  }

  // If it's a string, try to parse it
  if (typeof value === "string") {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

// Helper function to normalize time to HH:MM:SS format
function normalizeTime(value: unknown): string {
  if (!value) return "00:00:00";

  // If it's already a string in correct format
  if (typeof value === "string") {
    // Check if it matches HH:MM or HH:MM:SS
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
      const parts = value.split(":");
      const hours = parts[0].padStart(2, "0");
      const minutes = parts[1].padStart(2, "0");
      const seconds = parts[2] ? parts[2].padStart(2, "0") : "00";
      return `${hours}:${minutes}:${seconds}`;
    }
  }

  // If it's an Excel time (fraction of a day)
  if (typeof value === "number" && value >= 0 && value < 1) {
    const totalSeconds = Math.round(value * 86400);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }

  return "00:00:00";
}

// Helper function to detect an empty cell
function isBlank(value: unknown): boolean {
  return value === undefined || value === null || String(value).trim() === "";
}

// Helper function to parse boolean values
function parseBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim();
    return (
      lower === "yes" || lower === "true" || lower === "1" || lower === "y"
    );
  }
  if (typeof value === "number") return value === 1;
  return false;
}

function nullableText(value: unknown): string | null {
  if (isBlank(value)) return null;
  if (typeof value !== "string")
    throw new Error("Text columns must contain text");
  // Workbooks are official, so markup or invisible characters are dropped
  // rather than failing the row.
  return cleanImportedText(value) || null;
}
