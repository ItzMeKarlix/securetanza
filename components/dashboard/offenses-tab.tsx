"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback, useId } from "react";
import { useSearchParams } from "next/navigation";
import { Search, MapPin, Calendar, ChevronLeft, ChevronRight, ChevronDown, Maximize2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/context/ThemeContext";
import { useMapContext } from "@/context/MapContext";
import { useTimeRangeData } from "@/hooks/useTimeRangeData";
import { fetchCrimes, OffenseRecord } from "@/lib/api";
import { toCrimeTypeParam } from "@/lib/crime-groups";
import { caseBlotterLabel, caseStatusLabel, createCaseRequestGuard, filterOffenses, groupByBlotter, stageCounts } from "@/lib/offense-register";
import { readJson } from "@/lib/read-json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
interface OffensesTabProps {
  barangayName?: string;
}

/** How wide a window (in degrees) the case-location thumbnail shows around its pin. */
const CASE_MAP_LON_SPAN = 0.016;
const CASE_MAP_LAT_SPAN = 0.01;

/**
 * Builds the OSM embed URL for a case's location thumbnail, centred on the coordinate
 * with a `marker` — OSM draws that pin itself (via its own Leaflet instance), so unlike a
 * CSS overlay, it stays correctly placed if the map is panned or zoomed.
 */
function caseLocationEmbedUrl(lat: number, lon: number) {
  const minLon = lon - CASE_MAP_LON_SPAN / 2;
  const maxLon = lon + CASE_MAP_LON_SPAN / 2;
  const minLat = lat - CASE_MAP_LAT_SPAN / 2;
  const maxLat = lat + CASE_MAP_LAT_SPAN / 2;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLon},${minLat},${maxLon},${maxLat}&layer=mapnik&marker=${lat},${lon}`;
}

/** Interactive (pan/zoom) case-location thumbnail, marker included by OSM's own embed. */
function CaseLocationFrame({ lat, lon }: { lat: number; lon: number }) {
  return (
    <div className="absolute inset-0">
      <iframe
        title="Case location"
        className="h-full w-full"
        frameBorder="0"
        loading="lazy"
        src={caseLocationEmbedUrl(lat, lon)}
      />
    </div>
  );
}

/** Keeps the case view's two-column shape in place while another offense loads. */
function CaseDetailsSkeleton({ dark }: { dark: boolean }) {
  const block = dark ? "bg-white/[0.08]" : "bg-slate-200/80";
  return (
    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-4" role="status" aria-busy="true" aria-label="Loading case details">
      <div className="min-h-full motion-safe:animate-pulse">
        <div className={`space-y-3 border-b pb-5 ${dark ? "border-white/[0.06]" : "border-slate-100"}`}>
          <div className={`h-2.5 w-24 rounded ${block}`} />
          <div className={`h-7 w-2/3 max-w-md rounded ${block}`} />
          <div className={`h-4 w-1/2 max-w-sm rounded ${block}`} />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className={`h-4 w-full rounded ${block}`} />
            <div className={`h-4 w-4/5 rounded ${block}`} />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-5 lg:grid-cols-[1.3fr_1fr] sm:gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className={`h-2.5 w-24 rounded ${block}`} />
              <div className={`h-3.5 w-full rounded ${block}`} />
              <div className={`h-3.5 w-11/12 rounded ${block}`} />
              <div className={`h-3.5 w-3/4 rounded ${block}`} />
            </div>
            <div className={`space-y-3 border-t pt-4 ${dark ? "border-white/[0.06]" : "border-slate-100"}`}>
              <div className={`h-3 w-28 rounded ${block}`} />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, index) => <div key={index} className={`h-10 rounded ${block}`} />)}
              </div>
            </div>
            <div className={`space-y-3 border-t pt-4 ${dark ? "border-white/[0.06]" : "border-slate-100"}`}>
              <div className={`h-3 w-36 rounded ${block}`} />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }, (_, index) => <div key={index} className={`h-10 rounded ${block}`} />)}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className={`h-48 rounded-lg ${block}`} />
            <div className={`space-y-3 rounded-lg border p-4 ${dark ? "border-white/[0.06]" : "border-slate-100"}`}>
              <div className={`h-3 w-28 rounded ${block}`} />
              {Array.from({ length: 6 }, (_, index) => <div key={index} className={`h-3.5 w-full rounded ${block}`} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A labelled filter dropdown on Radix Select, so the open list is a rounded,
 * themed popover instead of the browser's square native menu.
 */
function FilterSelect({
  label,
  value,
  onChange,
  options,
  dark,
  labelClass,
  inline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  dark: boolean;
  labelClass: string;
  /** Drops the label above the control and prefixes it to the value instead, so
   *  the select can share a row with other controls. */
  inline?: boolean;
}) {
  return (
    <div>
      {!inline && <span className={`${labelClass} mb-2 block`}>{label}</span>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          aria-label={label}
          className={`w-full rounded-lg px-3 text-sm focus-visible:border-sky-500/50 focus-visible:ring-sky-500/30 data-[size=default]:h-10 ${
            dark
              ? "border-white/10 bg-[#0f172a] text-white hover:bg-[#0f172a] dark:bg-[#0f172a] dark:hover:bg-[#0f172a]"
              : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          }`}
        >
          <SelectValue>{inline ? `${label}: ${value}` : undefined}</SelectValue>
        </SelectTrigger>
        <SelectContent
          className={`rounded-xl border p-1 shadow-lg ${
            dark ? "border-white/10 bg-[#1e293b] text-slate-100" : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          {options.map((option) => (
            <SelectItem
              key={option}
              value={option}
              // The chosen option is tinted sky with bold text (the check mark follows the
              // text colour); hover/keyboard focus is a neutral fill, a touch stronger on
              // the chosen one so it still reads as focused.
              // outline-none! because app/globals.css draws a sky outline on every
              // :focus-visible, which would ring the highlighted row on top of its fill.
              className={`rounded-lg py-2 text-sm data-[state=checked]:font-semibold focus-visible:outline-none! ${
                dark
                  ? "focus:bg-white/10 focus:text-white data-[state=checked]:bg-sky-400/15 data-[state=checked]:text-sky-300 data-[state=checked]:focus:bg-sky-400/25 data-[state=checked]:focus:text-sky-200"
                  : "focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-sky-50 data-[state=checked]:text-sky-700 data-[state=checked]:focus:bg-sky-100 data-[state=checked]:focus:text-sky-800"
              }`}
            >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default function OffensesTab({ barangayName }: OffensesTabProps) {
  const { theme } = useTheme();
  const { timeRange, selectedCrimeType, setSelectedCrimeType, selectedFelonyStage, setSelectedFelonyStage } = useMapContext();
  const dateRanges = useTimeRangeData();
  const [cases, setCases] = useState<OffenseRecord[]>([]);
  const [selectedCase, setSelectedCase] = useState<OffenseRecord | null>(null);
  const listRequests = useRef(createCaseRequestGuard());
  const detailRequests = useRef(createCaseRequestGuard());
  const selectionVersion = useRef(0);
  const [caseDetails, setCaseDetails] = useState<{ id: string; record: OffenseRecord | null; error: string | null }>({ id: "", record: null, error: null });
  const [detailRetry, setDetailRetry] = useState(0);
  const chooseCase = useCallback((crime: OffenseRecord | null) => {
    selectionVersion.current++;
    setSelectedCase(crime);
  }, []);
  const selectedCaseId = selectedCase?.id;
  const hydratedCase = caseDetails.id === selectedCaseId ? caseDetails.record : null;
  const detailError = caseDetails.id === selectedCaseId ? caseDetails.error : null;

  // The other offenses recorded on the selected offense's blotter. They are
  // listed beside the record — each stays its own record, nothing is merged.
  const [sameBlotter, setSameBlotter] = useState<{ key: string; rows: OffenseRecord[] }>({ key: "", rows: [] });
  const blotterNo = hydratedCase?.blotterNo?.trim() || "";
  const blotterStation = hydratedCase?.stn?.trim() || "";
  const blotterKey = blotterNo ? `${blotterStation}|${blotterNo}` : "";
  useEffect(() => {
    if (!blotterKey) return;
    let active = true;
    void fetchCrimes({ blotterNo, stn: blotterStation || undefined, view: "analysis", limit: 50 }).then((rows) => {
      if (!active) return;
      const sorted = [...rows].sort((a, b) => (a.offenseCategory || a.crimeType).localeCompare(b.offenseCategory || b.crimeType));
      setSameBlotter({ key: blotterKey, rows: sorted });
    });
    return () => { active = false; };
  }, [blotterKey, blotterNo, blotterStation]);
  const blotterOffenses = blotterKey && sameBlotter.key === blotterKey ? sameBlotter.rows : [];

  useEffect(() => {
    const guard = detailRequests.current;
    const request = guard.start();
    if (!selectedCaseId) return () => guard.cancel();
    setCaseDetails({ id: selectedCaseId, record: null, error: null });
    async function loadDetails() {
      try {
        const result = await readJson<{ success: boolean; data: OffenseRecord }>(`/api/crimes/${encodeURIComponent(selectedCaseId!)}`);
        if (!result.success || !result.data || result.data.id !== selectedCaseId) throw new Error("Full case record unavailable");
        request.commit(() => setCaseDetails({ id: selectedCaseId!, record: result.data, error: null }));
      } catch {
        request.commit(() => setCaseDetails({ id: selectedCaseId!, record: null, error: "Unable to load the full case record." }));
      }
    }
    void loadDetails();
    return () => guard.cancel();
  }, [selectedCaseId, detailRetry]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Crime type is picked in the page header and shared through the map context
  const crimeTypeFilter = selectedCrimeType ?? "(All)";
  const [dateRangeFilter, setDateRangeFilter] = useState("(All)");
  const [statusFilter, setStatusFilter] = useState("(All)");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // 20 blotters per page
  const targetCaseId = useSearchParams().get("case");
  const handledCaseRef = useRef<string | null>(null);

  const isGeneralDashboard = !barangayName || barangayName === "General Dashboard";

  // Fetch cases from backend
  useEffect(() => {
    const guard = listRequests.current;
    const request = guard.start();
    // Don't fetch until time range has selections
    if (dateRanges.length === 0) {
      console.log('⏳ Cases: Waiting for time range selections...')
      return () => guard.cancel();
    }

    async function loadCases() {
      setLoading(true);
      try {
        console.log('📋 Loading Cases Data:', {
          barangayName,
          timeRange,
          dateRanges: dateRanges.map(r => ({ start: r.start.toISOString(), end: r.end.toISOString() })),
          timestamp: new Date().toISOString()
        })

        // Fetch data for all date ranges in parallel
        const fetchPromises = dateRanges.map(async ({ start, end }) => {
          const params: NonNullable<Parameters<typeof fetchCrimes>[0]> = {
            view: "analysis",
            startDateCommitted: start.toISOString(),
            endDateCommitted: end.toISOString()
          };

          // Only add additional date range filter if not "All"
          if (dateRangeFilter !== "(All)") {
            // Calculate additional date range filter
            const endDate = new Date();
            const startDate = new Date();

            if (dateRangeFilter === "(Last 7 Days)") {
              startDate.setDate(startDate.getDate() - 7);
            } else if (dateRangeFilter === "(Last 30 Days)") {
              startDate.setDate(startDate.getDate() - 30);
            } else if (dateRangeFilter === "(Last 90 Days)") {
              startDate.setDate(startDate.getDate() - 90);
            }

            // Use the more restrictive date range
            if (startDate > start) {
              params.startDateCommitted = startDate.toISOString();
            }
            if (endDate < end) {
              params.endDateCommitted = endDate.toISOString();
            }
          }

          // Add barangay filter for specific dashboard
          if (!isGeneralDashboard) {
            params.barangay = barangayName;
          }

          // Add crime type filter
          if (crimeTypeFilter !== "(All)") {
            params.offenseCategory = toCrimeTypeParam(crimeTypeFilter);
          }

          if (selectedFelonyStage) params.stageOfFelony = selectedFelonyStage;

          // Add status filter
          if (statusFilter !== "(All)") {
            params.caseStatus = statusFilter;
          }

          return fetchCrimes(params);
        });

        const results = await Promise.all(fetchPromises);

        // Combine all results and remove duplicates by id
        const allCases = results.flat();
        const uniqueCases = Array.from(
          new Map(allCases.map(crime => [crime.id, crime])).values()
        );

        // Sort by date committed (most recent first)
        uniqueCases.sort((a, b) =>
          new Date(b.dateCommitted).getTime() - new Date(a.dateCommitted).getTime()
        );

        request.commit(() => {
          setCases(uniqueCases);
          chooseCase(uniqueCases[0] || null);
        });
      } catch (error) {
        request.commit(() => console.error("Error loading cases:", error));
      } finally {
        request.commit(() => setLoading(false));
      }
    }

    void loadCases();
    return () => guard.cancel();
  }, [barangayName, isGeneralDashboard, crimeTypeFilter, dateRangeFilter, statusFilter, selectedFelonyStage, timeRange, dateRanges, chooseCase]);

  // Every offense is its own record and is counted on its own. For reading,
  // offenses recorded on the same blotter share one collapsible table row.
  const filteredOffenses = useMemo(() => filterOffenses(cases, searchQuery), [cases, searchQuery]);
  const stages = useMemo(() => stageCounts(filteredOffenses), [filteredOffenses]);
  const blotterRows = useMemo(() => groupByBlotter(filteredOffenses), [filteredOffenses]);
  const totalPages = Math.ceil(blotterRows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRows = blotterRows.slice(startIndex, endIndex);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const listId = useId();
  const toggleRow = (key: string) =>
    setExpandedRows((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const openCaseDetails = useCallback((offense: OffenseRecord | null) => {
    if (!offense) return;
    chooseCase(offense);
    setIsModalOpen(true);
  }, [chooseCase]);

  useEffect(() => {
    setCurrentPage(1);
  }, [crimeTypeFilter, dateRangeFilter, statusFilter, selectedFelonyStage, searchQuery, cases]);

  // A link to /dashboard/cases?case=<offense id> opens that offense on its page.
  useEffect(() => {
    if (!targetCaseId || loading || handledCaseRef.current === targetCaseId) return;
    const index = blotterRows.findIndex(row => row.offenses.some(offense => offense.id === targetCaseId));
    let active = true;
    const selectionAtStart = selectionVersion.current;
    async function openLinkedCase() {
      let offense: OffenseRecord | undefined = index >= 0 ? blotterRows[index].offenses.find(o => o.id === targetCaseId) : undefined;
      if (!offense) {
        const result = await readJson<{ success: boolean; data: OffenseRecord }>(`/api/crimes/${encodeURIComponent(targetCaseId!)}`).catch(() => null);
        if (!active || !result?.success || !result.data) return;
        offense = result.data;
      }
      if (!active || !offense || selectionVersion.current !== selectionAtStart) return;
      handledCaseRef.current = targetCaseId;
      if (index >= 0) {
        setCurrentPage(Math.floor(index / itemsPerPage) + 1);
        if (blotterRows[index].offenses.length > 1) setExpandedRows(previous => new Set(previous).add(blotterRows[index].key));
      }
      openCaseDetails(offense);
    }
    void openLinkedCase();
    return () => { active = false; };
  }, [targetCaseId, loading, blotterRows, itemsPerPage, openCaseDetails]);

  // Get unique values for filters
  const statuses = ["(All)", "Cleared", "Under Investigation", "Filed in Court", "Archived", "Pending"];

  // Get status label based on caseStatus
  const getStatusLabel = caseStatusLabel;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time to 12-hour with AM/PM
  const formatTime = (timeString: string) => {
    if (!timeString) return '';

    // If timeString is in HH:MM or HH:MM:SS format
    const parts = timeString.split(':');
    if (parts.length >= 2) {
      const hour = parseInt(parts[0]);
      const minute = parts[1];

      if (hour === 0) return `12:${minute} AM`;
      if (hour < 12) return `${hour}:${minute} AM`;
      if (hour === 12) return `12:${minute} PM`;
      return `${hour - 12}:${minute} PM`;
    }

    return timeString;
  };

  const getCaseId = caseBlotterLabel;
  const dark = theme === "dark";
  const mutedText = dark ? "text-slate-400" : "text-slate-500";
  const surface = `rounded-xl border ${dark ? "border-white/[0.06] bg-[#1e293b]" : "border-slate-200 bg-white"}`;
  const hairline = dark ? "border-white/[0.06]" : "border-slate-100";
  const labelClass = `text-[0.68rem] font-bold uppercase tracking-[0.11em] ${mutedText}`;
  // A section heading ("Classification") reads too much like the field labels beneath it
  // ("Offense classification") when both share the same size, weight and muted color —
  // this one takes the sky accent used for section headers elsewhere so the two tiers
  // are told apart at a glance instead of by reading order alone.
  const sectionLabelClass = "text-[0.72rem] font-bold uppercase tracking-[0.11em] text-sky-600 dark:text-sky-400";
  const columns = "1.7fr 0.95fr 1.3fr 0.9fr 1.15fr";

  // Text-only color for a status label — no pill, for places (like the full-detail
  // header) where a badge reads as a small compact-card widget rather than part of
  // the record itself.
  const statusTextTone = (caseStatus?: string) => {
    const label = getStatusLabel(caseStatus);
    return label === "Cleared"
      ? "text-emerald-600 dark:text-emerald-400"
      : label === "Under Investigation"
        ? "text-blue-600 dark:text-blue-400"
        : label === "Filed in Court"
          ? "text-purple-600 dark:text-purple-400"
          : label === "Archived"
            ? mutedText
            : "text-amber-600 dark:text-amber-500";
  };

  /** Stage of felony as quiet text — the status pill beside it stays the row's one chip. */
  const stageChip = (stage?: string) => {
    const value = (stage || "UNKNOWN").toUpperCase();
    const tone =
      value === "FRUSTRATED"
        ? "text-amber-700 dark:text-amber-400"
        : value === "ATTEMPTED"
          ? "text-sky-700 dark:text-sky-400"
          : value === "CONSUMMATED"
            ? dark ? "text-slate-300" : "text-slate-700"
            : mutedText;
    return <span className={`text-xs font-semibold ${tone}`}>{value === "UNKNOWN" ? "Unknown stage" : value[0] + value.slice(1).toLowerCase()}</span>;
  };

  const statusChip = (caseStatus?: string) => {
    const label = caseStatus === "Multiple statuses" ? caseStatus : getStatusLabel(caseStatus);
    const tone =
      label === "Cleared"
        ? "bg-emerald-500/10 text-emerald-500"
        : label === "Under Investigation"
          ? "bg-blue-500/10 text-blue-500"
          : label === "Filed in Court"
            ? "bg-purple-500/10 text-purple-500"
            : label === "Archived"
              ? "bg-slate-500/10 text-slate-500"
              : "bg-yellow-500/10 text-yellow-600";
    return (
      <span className={`inline-flex w-max items-center rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
        {label}
      </span>
    );
  };

  /** "Offenses on this blotter" — shown only when the blotter lists more than one. */
  const sameBlotterList = (current: OffenseRecord, heading: string, divided = true) =>
    blotterOffenses.length > 1 && (
      <div className={divided ? `border-t pt-4 ${hairline}` : ""}>
        <h4 className={`${heading} mb-2`}>Offenses on this blotter ({blotterOffenses.length})</h4>
        <ul className="space-y-1">
          {blotterOffenses.map((offense) => {
            const isCurrent = offense.id === current.id;
            return (
              <li key={offense.id}>
                <button
                  type="button"
                  onClick={() => chooseCase(offense)}
                  disabled={isCurrent}
                  aria-current={isCurrent ? "true" : undefined}
                  title={isCurrent ? "This offense" : "Open this offense's record"}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-[0.82rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-default ${
                    isCurrent ? (dark ? "bg-sky-400/10" : "bg-sky-50") : dark ? "hover:bg-white/5" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="min-w-0">
                    <span className={`block truncate font-medium ${dark ? "text-slate-100" : "text-slate-800"}`}>
                      {offense.offenseCategory || offense.crimeType}
                    </span>
                    <span className="flex items-center gap-2">
                      {stageChip(offense.stageOfFelony)}
                      {isCurrent && <span className={`text-xs ${mutedText}`}>· Viewing</span>}
                    </span>
                  </span>
                  {statusChip(offense.caseStatus)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );

  const filtersActive =
    searchQuery !== "" ||
    crimeTypeFilter !== "(All)" ||
    dateRangeFilter !== "(All)" ||
    statusFilter !== "(All)" ||
    Boolean(selectedFelonyStage);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCrimeType(null);
    setSelectedFelonyStage(null);
    setDateRangeFilter("(All)");
    setStatusFilter("(All)");
  };

  if (loading) {
    const bone = dark ? "bg-white/10" : "bg-slate-200";
    return (
      <div
        className="w-full max-w-[1400px] mx-auto space-y-6 motion-safe:animate-pulse"
        role="status"
        aria-busy="true"
        aria-label="Loading cases"
      >
        <header className={`flex flex-wrap items-end justify-between gap-4 border-b pb-[22px] ${dark ? "border-white/5" : "border-slate-200"}`}>
          <div className="max-w-lg">
            <h2 className={`text-3xl font-bold tracking-tight mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>Crime Cases</h2>
            <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
              {isGeneralDashboard ? "Every recorded offense across Tanza, Cavite, with its stage of felony" : `Recorded offenses in Brgy. ${barangayName}, with their stage of felony`}
            </p>
          </div>
          <dl className="text-right">
            <dt className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Matching Blotters
            </dt>
            <dd className="mt-1.5 flex justify-end">
              <div className={`h-6 w-14 rounded ${bone}`} />
            </dd>
            <dd className="mt-2 flex justify-end"><div className={`h-3 w-36 rounded ${bone}`} /></dd>
          </dl>
        </header>

        <section>
          <div className={`${surface} space-y-4`} style={{ padding: 18 }}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className={`h-10 min-w-0 flex-1 rounded-lg ${bone}`} />
              <div className="grid grid-cols-2 gap-3 md:flex md:shrink-0">
                <div className={`h-10 w-full rounded-lg md:w-[210px] ${bone}`} />
                <div className={`h-10 w-full rounded-lg md:w-[210px] ${bone}`} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-[18px]">
            <div className={`${surface} overflow-hidden`}>
              <div className={`grid gap-4 border-b ${hairline}`} style={{ gridTemplateColumns: columns, padding: "12px 22px" }}>
                {["Blotter No.", "Location", "Date", "Status"].map((h) => (
                  <span key={h} className={labelClass}>{h}</span>
                ))}
              </div>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className={`grid items-center gap-4 border-b ${hairline}`} style={{ gridTemplateColumns: columns, padding: "14px 22px" }}>
                  <div key="blotter" className="space-y-1.5">
                    <div className={`h-3.5 w-3/4 rounded ${bone}`} />
                    {i % 3 === 0 && <div className={`h-2.5 w-1/2 rounded ${bone}`} />}
                  </div>
                  {[1, 2].map((j) => (
                    <div key={j} className={`h-3.5 rounded ${bone}`} style={{ width: `${55 + ((i * j * 11) % 40)}%` }} />
                  ))}
                  <div className={`h-6 w-24 rounded-full ${bone}`} />
                </div>
              ))}
            </div>

            <div className={`${surface} space-y-5`} style={{ padding: 22 }}>
              <div className="space-y-2">
                <div className={`h-3 w-1/4 rounded ${bone}`} />
                <div className={`h-6 w-3/4 rounded ${bone}`} />
                <div className={`h-3 w-2/3 rounded ${bone}`} />
                <div className={`h-4 w-1/2 rounded ${bone}`} />
              </div>
              <div className={`grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 ${hairline}`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <div className={`mb-2 h-2.5 w-3/4 rounded ${bone}`} />
                    <div className={`h-3.5 rounded ${bone}`} style={{ width: `${60 + (i % 3) * 8}%` }} />
                  </div>
                ))}
              </div>
              <div className={`space-y-3 border-t pt-4 ${hairline}`}>
                <div className={`h-3 w-24 rounded ${bone}`} />
                <div className={`h-3.5 w-full rounded ${bone}`} />
                <div className={`h-3.5 w-5/6 rounded ${bone}`} />
                <div className={`h-3.5 w-2/3 rounded ${bone}`} />
              </div>
              <div className={`h-40 rounded-lg ${bone}`} />
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header
        className={`flex flex-wrap items-end justify-between gap-4 border-b pb-[22px] ${dark ? "border-white/5" : "border-slate-200"}`}
      >
        <div className="max-w-lg">
          <h2 className={`text-3xl font-bold tracking-tight mb-1.5 ${dark ? "text-white" : "text-slate-900"}`}>
            Crime Cases
          </h2>
          <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
            {isGeneralDashboard ? "Every recorded offense across Tanza, Cavite, with its stage of felony" : `Recorded offenses in Brgy. ${barangayName}, with their stage of felony`}
          </p>
        </div>
        <dl className="text-right">
          <dt className={`text-[12px] font-semibold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {filtersActive ? "Matching Offenses" : "Recorded Offenses"}
          </dt>
          <dd className={`mt-1.5 text-lg font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
            {filteredOffenses.length.toLocaleString()}
          </dd>
          <dd className={`mt-1 text-xs tabular-nums ${mutedText}`}>
            {stages.map(({ stage, count }) => `${count.toLocaleString()} ${stage.toLowerCase()}`).join(" · ") || "No offenses"}
          </dd>
        </dl>
      </header>

      {/* Search & filters */}
      <section data-tour="cases-controls">
        <div className={`${surface} space-y-4`} style={{ padding: 18 }}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${mutedText}`} />
            <input
              type="text"
              placeholder="Search blotter number, location, offense"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/40 ${
                dark
                  ? "border-white/10 bg-[#0f172a] text-white placeholder-slate-500"
                  : "border-slate-200 bg-white text-slate-900 placeholder-slate-400"
              }`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 md:flex md:shrink-0 md:[&>div]:w-[210px]">
            <FilterSelect
              inline
              label="Recent"
              value={dateRangeFilter}
              onChange={setDateRangeFilter}
              options={["(All)", "(Last 7 Days)", "(Last 30 Days)", "(Last 90 Days)"]}
              dark={dark}
              labelClass={labelClass}
            />
            <FilterSelect inline label="Status" value={statusFilter} onChange={setStatusFilter} options={statuses} dark={dark} labelClass={labelClass} />
          </div>
          </div>

          {filtersActive && (
            <div className={`flex items-center justify-between border-t pt-3 text-xs ${hairline}`}>
              <span className={mutedText}>
                {filteredOffenses.length.toLocaleString()} matching offenses on {blotterRows.length.toLocaleString()} blotters
              </span>
              <button
                onClick={clearFilters}
                className="font-semibold text-sky-600 transition-colors hover:text-sky-500 dark:text-sky-400"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* List & details */}
      <section>
        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-[18px]">
          {/* Cases List */}
          <div data-tour="cases-list" className={`${surface} overflow-hidden self-start`}>
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div
                  className={`grid gap-4 border-b ${hairline}`}
                  style={{ gridTemplateColumns: columns, padding: "12px 22px" }}
                >
                  {["Offense", "Stage of felony", "Location", "Date", "Status"].map((h) => (
                    <span key={h} className={labelClass}>{h}</span>
                  ))}
                </div>

                <div className="max-h-[640px] overflow-y-auto">
                  {filteredOffenses.length === 0 ? (
                    <div className={`flex h-56 flex-col items-center justify-center gap-1 text-sm ${mutedText}`}>
                      <p>No offenses found</p>
                      {filtersActive && (
                        <button onClick={clearFilters} className="font-semibold text-sky-600 hover:text-sky-500 dark:text-sky-400">
                          Clear filters
                        </button>
                      )}
                    </div>
                  ) : (
                    currentRows.map((row) => {
                      const crime = row.primary;
                      const grouped = row.offenses.length > 1;
                      const expanded = grouped && expandedRows.has(row.key);
                      const selected = row.offenses.some(offense => offense.id === selectedCase?.id);
                      const childrenId = `${listId}-blotter-${encodeURIComponent(row.key)}`;
                      const location = crime.street ? `${crime.street}, ${crime.barangay}` : crime.barangay;
                      const names = row.offenses.map(o => o.offenseCategory || o.crimeType).join(", ");
                      return (
                        <React.Fragment key={row.key}>
                          <div
                            onClick={() => chooseCase(crime)}
                            onDoubleClick={() => openCaseDetails(crime)}
                            title={grouped ? "Expand to see each offense; double-click to open the full record" : "Double-click this row to open the full offense record"}
                            className={`grid cursor-pointer items-center gap-4 border-b text-[0.82rem] transition-colors ${hairline} ${
                              selected
                                ? dark ? "bg-sky-400/[0.08] shadow-[inset_3px_0_0_#38bdf8]" : "bg-sky-50 shadow-[inset_3px_0_0_#0369a1]"
                                : dark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
                            }`}
                            style={{ gridTemplateColumns: columns, padding: "13px 22px" }}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              {grouped && (
                                <button
                                  type="button"
                                  aria-label={`${expanded ? "Collapse" : "Expand"} the ${row.offenses.length} offenses on blotter ${getCaseId(crime)}`}
                                  aria-expanded={expanded}
                                  aria-controls={childrenId}
                                  onClick={event => { event.stopPropagation(); toggleRow(row.key); }}
                                  onDoubleClick={event => event.stopPropagation()}
                                  className={`-ml-1.5 flex h-7 w-7 shrink-0 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${mutedText}`}
                                >
                                  <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "" : "-rotate-90"}`} />
                                </button>
                              )}
                              <button
                                type="button"
                                onKeyDown={event => {
                                  if (event.key === "Enter" && selected) { event.preventDefault(); openCaseDetails(selectedCase); }
                                }}
                                aria-pressed={selected}
                                title={grouped ? names : "Select offense; double-click to open the full record"}
                                className={`min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${dark ? "text-slate-100" : "text-slate-900"}`}
                              >
                                {grouped ? (
                                  <>
                                    {/* The blotter is what this row is, so it leads and is never cut off. */}
                                    <span className="block break-all font-semibold leading-snug tabular-nums">{getCaseId(crime)}</span>
                                    <span className={`block truncate text-[0.7rem] ${mutedText}`}>{row.offenses.length} offenses on this blotter</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="block truncate font-semibold leading-snug" title={crime.offenseCategory || crime.crimeType}>
                                      {crime.offenseCategory || crime.crimeType}
                                    </span>
                                    <span className={`block truncate text-[0.7rem] tabular-nums ${mutedText}`} title={`Blotter ${getCaseId(crime)}`}>
                                      Blotter {getCaseId(crime)}
                                    </span>
                                  </>
                                )}
                              </button>
                            </div>
                            {row.stage ? stageChip(row.stage) : <span className={`text-xs font-semibold ${mutedText}`}>Mixed stages</span>}
                            <span className={`truncate ${dark ? "text-slate-400" : "text-slate-600"}`} title={location}>
                              {location}
                            </span>
                            <span className={`tabular-nums ${mutedText}`}>{formatDate(crime.dateCommitted)}</span>
                            {statusChip(grouped ? row.status : crime.caseStatus)}
                          </div>
                          {grouped && (
                            <div id={childrenId} hidden={!expanded} className={`border-b ${hairline} ${dark ? "bg-[#0f172a]/40" : "bg-slate-50/70"}`}>
                              {expanded && row.offenses.map(offense => {
                                const current = offense.id === selectedCase?.id;
                                return (
                                  <button
                                    type="button"
                                    key={offense.id}
                                    onClick={() => chooseCase(offense)}
                                    onDoubleClick={() => openCaseDetails(offense)}
                                    onKeyDown={event => {
                                      if (event.key === "Enter" && current) { event.preventDefault(); openCaseDetails(offense); }
                                    }}
                                    aria-pressed={current}
                                    title="Select this offense; double-click to open its full record"
                                    className={`grid w-full items-center gap-4 text-left text-[0.82rem] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 ${
                                      current ? "bg-sky-500/10" : dark ? "hover:bg-white/5" : "hover:bg-slate-100"
                                    }`}
                                    style={{ gridTemplateColumns: columns, padding: "10px 22px 10px 52px" }}
                                  >
                                    <span className={`min-w-0 line-clamp-2 font-medium leading-snug ${dark ? "text-slate-200" : "text-slate-800"}`} title={offense.offenseCategory || offense.crimeType}>
                                      {offense.offenseCategory || offense.crimeType}
                                    </span>
                                    {stageChip(offense.stageOfFelony)}
                                    <span />
                                    <span />
                                    {statusChip(offense.caseStatus)}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Pagination */}
            {blotterRows.length > 0 && (
              <div className={`flex flex-wrap items-center justify-between gap-3 border-t ${hairline}`} style={{ padding: "12px 22px" }}>
                <div className={`text-xs ${mutedText}`}>
                  Showing {startIndex + 1}–{Math.min(endIndex, blotterRows.length)} of {blotterRows.length.toLocaleString()} blotters · {filteredOffenses.length.toLocaleString()} offenses
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      dark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                        className={`h-8 min-w-8 rounded-lg px-2 text-xs font-semibold tabular-nums transition-colors ${
                          currentPage === pageNum
                            ? "bg-sky-500/15 text-sky-600 dark:text-sky-400"
                            : dark
                              ? "text-slate-300 hover:bg-white/10"
                              : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      dark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Case Details Panel — a compact card: map cover, headline facts, then
              short previews of the long text. Stays in view while you scroll the list. */}
          <div
            data-tour="cases-details-panel"
            className={`${surface} self-start overflow-hidden xl:sticky xl:top-0`}
          >
            {selectedCase && !hydratedCase ? (
              <div className={`space-y-3 p-5 text-sm ${mutedText}`} role="status" aria-busy={!detailError}>
                <p>{detailError || "Loading full case record…"}</p>
                {detailError && <button type="button" onClick={() => setDetailRetry(previous => previous + 1)} className="font-semibold text-sky-600 dark:text-sky-400">Retry loading details</button>}
              </div>
            ) : hydratedCase ? (
              (() => {
                const c = hydratedCase;
                const hasMap = Boolean(c.latitude && c.longitude);
                const facts = [
                  { label: "Blotter No.", value: c.blotterNo },
                  { label: "Type of place", value: c.typeOfPlace },
                  { label: "Offense classification", value: c.offenseType },
                  { label: "Legal section", value: c.section },
                  { label: "Stage of felony", value: c.stageOfFelony },
                  { label: "Suspects", value: c.suspectCount },
                  { label: "Victims", value: c.victimCount },
                  { label: "Investigator", value: c.investigator },
                  { label: "Lead investigator", value: c.headInves },
                  { label: "Group affiliation", value: c.grpAffiliation },
                ].filter((f) => f.value !== undefined && f.value !== null && f.value !== "");
                const previews = [
                  { label: "Description", text: c.offense },
                  { label: "Modus operandi", text: c.modus },
                  { label: "Suspect motive", text: c.suspectMotive },
                ].filter((p) => p.text);
                const body = dark ? "text-slate-300" : "text-slate-700";

                // Pinned to the top of the card so it's always in reach.
                const expand = (
                  <button
                    onClick={() => openCaseDetails(c)}
                    title="Open the full case record (or double-click a row)"
                    aria-label="Open full case details"
                    // Black on white in both themes, so it stands out from the card without color.
                    className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                    Full details
                  </button>
                );

                return (
                  <>
                    <div className="space-y-4" style={{ padding: 20 }}>
                      {/* Identity */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <p className={`${labelClass} tabular-nums`}>{getCaseId(c)}</p>
                          {expand}
                        </div>
                        <h3
                          className={`font-heading mt-1 text-lg font-bold leading-snug ${dark ? "text-white" : "text-slate-900"}`}
                        >
                          {c.crimeType}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          {statusChip(c.caseStatus)}
                          <span className={`flex items-center gap-1.5 text-xs ${mutedText}`}>
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDate(c.dateCommitted)} · {formatTime(c.timeCommitted)}
                          </span>
                          {c.dateReported && (
                            <span className={`text-xs ${mutedText}`}>
                              Reported {formatDate(c.dateReported)}{c.timeReported ? ` · ${formatTime(c.timeReported)}` : ""}
                            </span>
                          )}
                        </div>
                        <p className={`mt-2 flex items-start gap-1.5 text-[0.82rem] ${body}`}>
                          <MapPin className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${mutedText}`} />
                          <span>
                            {c.street ? `${c.street}, ` : ""}Brgy. {c.barangay}
                          </span>
                        </p>
                      </div>

                      {/* Headline facts — only the ones this case actually has */}
                      {facts.length > 0 && (
                        <dl className={`grid grid-cols-2 gap-x-4 gap-y-3 border-t pt-4 ${hairline}`}>
                          {facts.map((f) => (
                            <div key={f.label} className="min-w-0">
                              <dt className={labelClass}>{f.label}</dt>
                              <dd className={`mt-0.5 truncate text-[0.82rem] font-medium ${dark ? "text-slate-100" : "text-slate-800"}`} title={String(f.value)}>
                                {f.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      )}

                      {sameBlotterList(c, labelClass)}

                      {/* Long text, previewed — the rest is in the full view (opened via
                          the "Full details" button pinned at the top of this panel). */}
                      {previews.length > 0 && (
                        <div className={`space-y-3 border-t pt-4 ${hairline}`}>
                          {previews.map((p) => (
                            <div key={p.label}>
                              <h4 className={`${labelClass} mb-1`}>{p.label}</h4>
                              <p className={`line-clamp-3 text-[0.82rem] leading-relaxed ${body}`}>{p.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Location map — last, so nothing competes with the header above */}
                    {hasMap && (
                      <div className={`relative h-36 border-t ${hairline}`}>
                        {/* Interactive (pan/zoom) so it doubles as a quick look; the link still opens the real map for the full view. */}
                        <CaseLocationFrame lat={c.latitude!} lon={c.longitude!} />
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${c.latitude}&mlon=${c.longitude}#map=17/${c.latitude}/${c.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="absolute bottom-2 right-3 rounded bg-white/90 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-700 shadow-sm hover:bg-white dark:bg-slate-900/85 dark:text-slate-200"
                        >
                          Open map ↗
                        </a>
                      </div>
                    )}
                  </>
                );
              })()
            ) : (
              <div className={`flex h-56 items-center justify-center text-sm ${mutedText}`}>
                Select a case to view details
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full Details Modal — reads like a case record, not a table export: only the
          fields this case actually has, human phrasing instead of database columns,
          and the same identity/map treatment as the details panel it expands from. */}
      {selectedCase && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent
            className={`flex h-[min(82dvh,760px)] max-h-[calc(100dvh-2rem)] flex-col gap-0 overflow-hidden p-4 sm:max-w-4xl sm:p-6 lg:max-w-5xl ${
              dark ? "bg-[#1e293b] border-white/[0.06]" : "bg-white border-slate-200"
            }`}
          >
            {!hydratedCase ? (
              detailError ? (
                <div className={`flex min-h-0 flex-1 flex-col items-center justify-center gap-3 text-center text-sm ${mutedText}`} role="alert">
                  <p>Case details unavailable</p>
                  <p>{detailError}</p>
                  <button type="button" onClick={() => setDetailRetry(previous => previous + 1)} className="font-semibold text-sky-600 dark:text-sky-400">Retry loading details</button>
                </div>
              ) : <CaseDetailsSkeleton dark={dark} />
            ) : (() => {
              const c = hydratedCase;
              const hasMap = Boolean(c.latitude && c.longitude);
              const body = dark ? "text-slate-300" : "text-slate-700";
              const valueClass = `mt-0.5 text-[0.82rem] font-medium ${dark ? "text-slate-100" : "text-slate-800"}`;

              // Text-only, no pill — a full-detail header reads as part of the record,
              // not as a strip of compact-card badges.
              const flagTone: Record<"rose" | "amber" | "purple", string> = {
                rose: "text-rose-600 dark:text-rose-400",
                amber: "text-amber-600 dark:text-amber-400",
                purple: "text-purple-600 dark:text-purple-400",
              };
              const flags = (
                [
                  c.heinous && { label: "Heinous crime", tone: "rose" },
                  c.sensational && { label: "Sensational", tone: "amber" },
                  c.threatGrp && { label: "Threat group involved", tone: "purple" },
                ] as const
              ).filter((f): f is { label: string; tone: "rose" | "amber" | "purple" } => Boolean(f));

              // Long-form fields, read as prose — only the ones this case has.
              const narrative = [
                { label: "Description", text: c.offense },
                { label: "Modus operandi", text: c.modus },
                {
                  label: "Suspect motive",
                  text: [c.suspectMotive, c.suspectSubMotive].filter(Boolean).join(" — ") || undefined,
                },
              ].filter((p) => p.text);

              const classification = [
                { label: "Offense classification", value: c.offenseType },
                { label: "Legal section", value: c.section },
                { label: "Stage of felony", value: c.stageOfFelony },
              ].filter((f) => f.value);

              const people = [
                { label: "Investigator", value: c.investigator },
                { label: "Lead investigator", value: c.headInves },
                { label: "No. of suspects", value: c.suspectCount },
                { label: "No. of victims", value: c.victimCount },
                { label: "Group affiliation", value: c.grpAffiliation },
              ].filter((f) => f.value !== undefined && f.value !== null && f.value !== "");

              // Bureaucratic record-keeping fields — real, but not what a reader comes
              // for. Grouped last, in a quieter card, instead of mixed into the story.
              const filing = [
                { label: "Blotter number", value: c.blotterNo },
                { label: "Type of place", value: c.typeOfPlace },
                { label: "Police community precinct", value: c.pcp },
                { label: "Station", value: c.stn },
                { label: "Provincial police office", value: c.ppo },
                { label: "Police regional office", value: c.pro },
                { label: "Province", value: c.province },
                { label: "Region", value: c.region },
                { label: "Logged into system", value: c.dateEncoded ? formatDate(c.dateEncoded) : undefined },
              ].filter((f) => f.value);

              return (
                <>
                  <DialogHeader className={`pb-6 border-b ${hairline}`}>
                    {/* Case ID is a reference caption, not part of what the two columns
                        below should align to — kept on its own line so the row underneath
                        starts at the type and status, not at this label. */}
                    <p className={`${labelClass} tabular-nums`}>{getCaseId(c)}</p>

                    {/* Identity on the left, the when/where on the right — side by side
                        instead of one long stack, so the header uses the card's width
                        instead of just its height. */}
                    {/* pr-8 keeps this clear of the dialog's own close button, which sits
                        inset from the card's outer edge rather than this padded content
                        area — without it, the right-aligned column (and, stacked on
                        mobile, the title itself) runs straight under the X. */}
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6 pr-8">
                      <div className="min-w-0">
                        <DialogTitle
                          className={`font-heading text-2xl font-bold leading-snug ${dark ? "text-white" : "text-slate-900"}`}
                        >
                          {c.crimeType}
                        </DialogTitle>
                        {/* Status and flags as plain, colored text — a pill reads like a
                            compact-card widget; this is a full record, not a table row. */}
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold">
                          <span className={statusTextTone(c.caseStatus)}>{getStatusLabel(c.caseStatus)}</span>
                          {flags.map((f) => (
                            <React.Fragment key={f.label}>
                              <span className={`font-normal ${mutedText}`}>·</span>
                              <span className={flagTone[f.tone]}>{f.label}</span>
                            </React.Fragment>
                          ))}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 text-[0.85rem] sm:items-end sm:text-right shrink-0">
                        <span className={`flex items-center gap-2 ${mutedText}`}>
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          Committed {formatDate(c.dateCommitted)} · {formatTime(c.timeCommitted)}
                          {c.dateReported && ` — reported ${formatDate(c.dateReported)} · ${formatTime(c.timeReported)}`}
                        </span>
                        <span className={`flex items-start gap-2 ${body}`}>
                          <MapPin className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${mutedText}`} />
                          <span>
                            {c.street ? `${c.street}, ` : ""}Brgy. {c.barangay}
                            {c.municipal ? `, ${c.municipal}` : ""}
                          </span>
                        </span>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 pt-4 sm:gap-8 sm:pt-6">
                    {/* What happened, and who's involved */}
                    <div className="space-y-5">
                      {narrative.length > 0 && (
                        <div className="space-y-4">
                          {narrative.map((p) => (
                            <div key={p.label}>
                              <h4 className={`${labelClass} mb-1.5`}>{p.label}</h4>
                              <p className={`text-[0.88rem] leading-relaxed ${body}`}>{p.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {classification.length > 0 && (
                        <div className={`border-t pt-4 ${hairline}`}>
                          <h4 className={`${sectionLabelClass} mb-3`}>Classification</h4>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {classification.map((f) => (
                              <div key={f.label} className="min-w-0">
                                <dt className={labelClass}>{f.label}</dt>
                                <dd className={valueClass}>{f.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}

                      {people.length > 0 && (
                        <div className={`border-t pt-4 ${hairline}`}>
                          <h4 className={`${sectionLabelClass} mb-3`}>People & investigation</h4>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                            {people.map((f) => (
                              <div key={f.label} className="min-w-0">
                                <dt className={labelClass}>{f.label}</dt>
                                <dd className={valueClass}>{f.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>

                    {/* Where, and the paperwork trail */}
                    <div className="space-y-4">
                      {sameBlotterList(c, sectionLabelClass, false)}
                      {hasMap && (
                        <div className={`relative h-48 rounded-lg border overflow-hidden ${hairline}`}>
                          <CaseLocationFrame lat={c.latitude!} lon={c.longitude!} />
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${c.latitude}&mlon=${c.longitude}#map=17/${c.latitude}/${c.longitude}`}
                            target="_blank"
                            rel="noreferrer"
                            className="absolute bottom-2 right-3 rounded bg-white/90 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-700 shadow-sm hover:bg-white dark:bg-slate-900/85 dark:text-slate-200"
                          >
                            Open map ↗
                          </a>
                        </div>
                      )}

                      {filing.length > 0 && (
                        <div
                          className={`rounded-lg border p-4 ${
                            dark ? "border-white/[0.06] bg-white/[0.02]" : "border-slate-100 bg-slate-50"
                          }`}
                        >
                          <h4 className={`${sectionLabelClass} mb-3`}>Filing record</h4>
                          <dl className="space-y-2.5 text-[0.78rem]">
                            {filing.map((f) => (
                              <div key={f.label} className="flex items-baseline justify-between gap-3">
                                <dt className={mutedText}>{f.label}</dt>
                                <dd className={`text-right font-medium ${dark ? "text-slate-200" : "text-slate-700"}`}>
                                  {f.value}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
