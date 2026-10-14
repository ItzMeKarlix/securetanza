"use client";

import { buildMapQueries, mergeMapStats } from "./map-query";
import { useMapStatistics } from "./useMapStatistics";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { getCrimeGroup } from "@/lib/crime-groups";
import { categoryColorForTheme, colorfulCrimeColor, type DataColorTheme, type DataColorPalette } from "@/lib/data-colors";

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
  "Theft": "#DC2626",
  "Robbery": "#7C3AED",
  "Physical Injury": "#EA580C",
  "Alarm and Scandal": "#0891B2",
  "Carnapping": "#CA8A04",
  "Drugs": "#9333EA",
  "Buy Bust": "#C026D3",
  "Homicide": "#DB2777",
  "Rape": "#4F46E5",
  "Murder": "#B91C1C",
  "Shooting": "#2563EB",
  "Illegal Gambling": "#0F766E",
  "Other": "#64748B",
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
  
  // Keep new or locally defined categories visually distinct instead of
  // collapsing every unrecognized label to the same gray swatch.
  return categoryColorForTheme(crimeType || type, theme);
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
