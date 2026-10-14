"use client";

import { useState, useEffect } from "react";
import { fetchCrimes, type CrimeIncident } from "@/lib/api";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "./useTimeRangeData";
import { buildMapQueries, readMapCrimes } from "./map-query";

export function useFilteredCrimes() {
  const scope = useMapContext();
  const ranges = useTimeRangeData();
  const key = JSON.stringify(buildMapQueries(scope, ranges, "barangay-counts", scope.selectedBarangay).map(query => query.toString()));
  const [settled, setSettled] = useState<{ key: string; crimes: CrimeIncident[] } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      try {
        const queries = (JSON.parse(key) as string[]).map(value => new URLSearchParams(value));
        const crimes = await readMapCrimes(queries, controller.signal, fetchCrimes);
        if (!controller.signal.aborted) setSettled({ key, crimes });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error loading filtered map crimes:", error);
          setSettled({ key, crimes: [] });
        }
      }
    })();
    return () => controller.abort();
  }, [key]);
  const current = settled?.key === key;
  return { crimes: current ? settled.crimes : [], loading: !current };
}
