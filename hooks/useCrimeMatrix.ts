import { useState, useEffect } from "react";
import { fetchCrimes } from "@/lib/api";
import { useMapContext } from "@/context/MapContext";
import { toCrimeTypeParam } from "@/lib/crime-groups";
import { useTimeRangeData } from "./useTimeRangeData";

interface CrimeMatrixData {
  crimeType: string;
  monthlyData: number[]; // 12 months
}

export function useCrimeMatrix(barangayName?: string) {
  const { timeRange, selectedCrimeType, selectedFelonyStage } = useMapContext();
  const dateRanges = useTimeRangeData();
  const [matrixData, setMatrixData] = useState<CrimeMatrixData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Don't fetch until time range has selections
    if (dateRanges.length === 0) {
      return;
    }

    let active = true;

    async function loadMatrixData() {
      try {
        setLoading(true);

        // Fetch data for all date ranges in parallel
        const fetchPromises = dateRanges.map(async ({ start, end }) => {
          const offenseCategory = selectedCrimeType
            ? toCrimeTypeParam(selectedCrimeType)
            : undefined;
          const params =
            barangayName && barangayName !== "General Dashboard"
              ? {
                  barangay: barangayName,
                  startDateCommitted: start.toISOString(),
                  endDateCommitted: end.toISOString(),
                  offenseCategory,
                  stageOfFelony: selectedFelonyStage ?? undefined,
                }
              : {
                  startDateCommitted: start.toISOString(),
                  endDateCommitted: end.toISOString(),
                  offenseCategory,
                  stageOfFelony: selectedFelonyStage ?? undefined,
                };

          return fetchCrimes({ ...params, view: "analysis" });
        });

        const results = await Promise.all(fetchPromises);
        if (!active) return;

        // Aggregate all crimes
        const allCrimes = Array.from(
          new Map(
            results
              .flat()
              .filter((r) => r.isCrime)
              .map((r) => [r.id, r]),
          ).values(),
        );

        // Group crimes by type and month
        const crimeTypeMap = new Map<string, number[]>();

        allCrimes.forEach((crime) => {
          const crimeDate = new Date(crime.dateCommitted);
          const month = crimeDate.getMonth(); // 0-11
          const type = crime.crimeType;

          if (!crimeTypeMap.has(type)) {
            crimeTypeMap.set(type, Array(12).fill(0));
          }

          const monthlyData = crimeTypeMap.get(type)!;
          monthlyData[month]++;
        });

        // Convert map to array and sort by total count (descending)
        const matrixArray: CrimeMatrixData[] = Array.from(
          crimeTypeMap.entries(),
        )
          .map(([crimeType, monthlyData]) => ({
            crimeType,
            monthlyData,
          }))
          .sort((a, b) => {
            const totalA = a.monthlyData.reduce((sum, val) => sum + val, 0);
            const totalB = b.monthlyData.reduce((sum, val) => sum + val, 0);
            return totalB - totalA;
          })
          .slice(0, 10); // Top 10 crime types

        setMatrixData(matrixArray);
      } catch (error) {
        if (!active) return;
        console.error("Error loading crime matrix data:", error);
        setMatrixData([]);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMatrixData();
    return () => {
      active = false;
    };
  }, [
    barangayName,
    timeRange,
    dateRanges,
    selectedCrimeType,
    selectedFelonyStage,
  ]);

  return { matrixData, loading };
}
