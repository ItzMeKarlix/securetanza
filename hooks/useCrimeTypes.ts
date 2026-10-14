"use client";

import { buildMapQueries, mergeMapStats } from "./map-query";
import { useMapStatistics } from "./useMapStatistics";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { getCrimeGroup } from "@/lib/crime-groups";
import { colorfulCrimeColor, type DataColorTheme, type DataColorPalette } from "@/lib/data-colors";

export interface CrimeTypeStats {
  type: string;
  count: number;
}

export interface CrimeTypesData {
  stats: CrimeTypeStats[];
  total: number;
  loading: boolean;
}

// Define colors for different crime types
export const CRIME_TYPE_COLORS: Record<string, string> = {
  "Theft": "#EF4444", // red-500
  "Robbery": "#DC2626", // red-600
  "Physical Injury": "#F97316", // orange-500
  "Alarm and Scandal": "#F59E0B", // amber-500
  "Carnapping": "#EAB308", // yellow-500
  "Drugs": "#8B5CF6", // violet-500
  "Buy Bust": "#8B5CF6", // violet-500 (drug operation)
  "Homicide": "#EC4899", // pink-500
  "Rape": "#BE185D", // pink-700
  "Murder": "#991B1B", // red-900
  "Shooting": "#991B1B", // red-900
  "Illegal Gambling": "#F59E0B", // amber-500
  "Other": "#6B7280", // gray-500
};

// Helper function to extract crime type from incident type
// Handles formats like "(Incident) Theft" or "(Operation) Buy Bust"
export function extractCrimeType(incidentType: string): string {
  // Remove "(Incident)" or "(Operation)" prefix
  const cleaned = incidentType.replace(/^\((?:Incident|Operation)\)\s*/i, '').trim();
  return cleaned;
}

// Helper function to get color for a crime type
export function getCrimeTypeColor(type: string, palette: DataColorPalette = "original", theme: DataColorTheme = "light"): string {
  if (palette === "colorful") return colorfulCrimeColor(type, theme);
  const group = getCrimeGroup(type);
  if (group) return group.color;

  // Extract the actual crime type (remove prefix)
  const crimeType = extractCrimeType(type);
  
  // Try exact match first
  if (CRIME_TYPE_COLORS[crimeType]) {
    return CRIME_TYPE_COLORS[crimeType];
  }
  
  // Try partial match (for cases like "Physical Injury" matching "Injury")
  for (const [key, color] of Object.entries(CRIME_TYPE_COLORS)) {
    if (crimeType.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(crimeType.toLowerCase())) {
      return color;
    }
  }
  
  return CRIME_TYPE_COLORS["Other"];
}

export function useCrimeTypes(): CrimeTypesData {
  const scope = useMapContext();
  const dateRanges = useTimeRangeData();
  // Keep alternative categories available when a category is selected.
  const queries = buildMapQueries({ ...scope, selectedCrimeType: null }, dateRanges, "stats", scope.selectedBarangay);
  const { results, loading } = useMapStatistics("stats", queries);
  const stats = results ? mergeMapStats(results) : null;
  return { stats: stats?.crimesByType ?? [], total: stats?.totalOffenses ?? 0, loading };
}
