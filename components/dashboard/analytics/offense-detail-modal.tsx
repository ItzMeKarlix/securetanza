"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OffenseRecord } from "@/lib/api";
import {
  type AnalyticsSlice,
  cleanLabel,
  filterOffensesBySlice,
  sliceKindLabel,
  sliceLabel,
} from "@/lib/analytics-slice";
import SliceMiniMap from "./slice-mini-map";
import { toInputDate } from "@/lib/date-input";
import { useMapContext } from "@/context/MapContext";

interface Props {
  /** null closes the dialog. */
  slice: AnalyticsSlice | null;
  allCrimes: OffenseRecord[];
  totalOffenses: number;
  theme: string;
  onClose: () => void;
  loading?: boolean;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  // Read the date straight off the ISO string. These are stored at UTC
  // midnight, so going through `new Date()` and printing a local date would
  // shift the day backwards for negative-offset timezones.
  const [y, m, d] = String(iso).slice(0, 10).split("-");
  if (!y || !m || !d) return "—";
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][parseInt(m, 10) - 1];
  return `${month ?? m} ${parseInt(d, 10)}, ${y}`;
}

function formatTime(time?: string): string {
  if (!time) return "—";
  const [hStr, min] = String(time).split(":");
  const h = parseInt(hStr, 10);
  if (Number.isNaN(h)) return "—";
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:${min ?? "00"} ${suffix}`;
}

/** Most frequent value of a field across the sliced offenses. */
function topValue(
  crimes: OffenseRecord[],
  pick: (c: OffenseRecord) => string | undefined,
) {
  const counts = new Map<string, number>();
  crimes.forEach((c) => {
    const v = pick(c);
    if (!v) return;
    counts.set(v, (counts.get(v) ?? 0) + 1);
  });
  let best: { value: string; count: number } | null = null;
  counts.forEach((count, value) => {
    if (!best || count > best.count) best = { value, count };
  });
  return best as { value: string; count: number } | null;
}

export default function OffenseDetailModal({
  slice,
  allCrimes,
  totalOffenses,
  theme,
  onClose,
  loading = false,
}: Props) {
  const dark = theme === "dark";
  const { customDateRange } = useMapContext();

  // Each offense counts on its own, whatever chart the slice came from.
  const offenses = useMemo(() => (slice ? filterOffensesBySlice(allCrimes, slice) : []), [slice, allCrimes]);

  const summary = useMemo(() => {
    if (!slice) return null;
    const cleared = offenses.filter((c) =>
      (c.caseStatus ?? "").toLowerCase().includes("cleared"),
    ).length;
    return {
      topBarangay: topValue(offenses, (c) => c.barangay),
      topPlace: topValue(offenses, (c) => c.typeOfPlace),
      topType: topValue(offenses, (c) => c.crimeType),
      cleared,
    };
  }, [offenses, slice]);

  if (!slice) return null;

  // The Cases page has its own period state, so an exact date window set here
  // travels with the link — otherwise the case could fall outside what Cases loads.
  const casesHref = (id: string) => {
    const params = new URLSearchParams({ case: id });
    if (customDateRange) {
      params.set("from", toInputDate(customDateRange.start));
      params.set("to", toInputDate(customDateRange.end));
    }
    return `/dashboard/cases?${params}`;
  };

  const share = totalOffenses > 0 ? Math.round((offenses.length / totalOffenses) * 100) : 0;

  const chipClass = `rounded-md px-2.5 py-1.5 ${
    dark ? "bg-white/[0.04] text-slate-300" : "bg-slate-50 text-slate-600"
  }`;
  const chipValueClass = `font-bold ${dark ? "text-white" : "text-slate-900"}`;
  const headClass = `text-[0.68rem] font-bold uppercase tracking-[0.11em] ${
    dark ? "text-slate-400" : "text-slate-500"
  }`;
  const rowBorder = dark ? "border-white/[0.06]" : "border-slate-100";

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        // sm:max-w-* is required, not plain max-w-*: DialogContent's own
        // default is `sm:max-w-sm`, and a base-variant class never overrides a
        // breakpoint-variant one — the dialog would silently stay tiny.
        className={`sm:max-w-5xl max-h-[85vh] overflow-y-auto ${
          dark
            ? "bg-[#1e293b] border-white/[0.06]"
            : "bg-white border-slate-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle
            className={`font-heading text-lg font-bold ${dark ? "text-white" : "text-slate-900"}`}
          >
            {sliceLabel(slice)}
          </DialogTitle>
          <DialogDescription
            className={dark ? "text-slate-400" : "text-slate-500"}
          >
            {loading ? (
              "Loading case records…"
            ) : (
              <>
                {sliceKindLabel(slice)} · {offenses.length} offense
                {offenses.length === 1 ? "" : "s"}
                {share > 0 && ` · ${share}% of all offenses`}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div
            role="status"
            aria-busy="true"
            className="py-10 text-center text-sm text-slate-500"
          >
            Loading case records…
          </div>
        ) : offenses.length === 0 ? (
          <div
            className={`py-10 text-center text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}
          >
            No individual records matched this selection.
          </div>
        ) : (
          <>
            {/* Summary chips */}
            <div className="flex flex-wrap gap-2 text-[0.78rem]">
              {summary?.topBarangay && (
                <div className={chipClass}>
                  Most affected barangay{" "}
                  <span className={chipValueClass}>
                    {summary.topBarangay.value} ({summary.topBarangay.count})
                  </span>
                </div>
              )}
              {summary?.topPlace && (
                <div className={chipClass}>
                  Most common location{" "}
                  <span className={chipValueClass}>
                    {summary.topPlace.value} ({summary.topPlace.count})
                  </span>
                </div>
              )}
              {slice.kind !== "crimeType" &&
                slice.kind !== "matrixCell" &&
                summary?.topType && (
                  <div className={chipClass}>
                    Most common type{" "}
                    <span className={chipValueClass}>
                      {cleanLabel(summary.topType.value)} (
                      {summary.topType.count})
                    </span>
                  </div>
                )}
              <div className={chipClass}>
                Cleared{" "}
                <span className={chipValueClass}>{summary?.cleared ?? 0}</span>{" "}
                of {offenses.length}
              </div>
            </div>

            <SliceMiniMap offenses={offenses} theme={theme} />

            {/* Offense list */}
            <div className={`rounded-lg border ${rowBorder} overflow-hidden`}>
              <div
                className={`grid gap-3 px-3 py-2 ${headClass} ${
                  dark ? "bg-white/[0.03]" : "bg-slate-50"
                }`}
                style={{
                  gridTemplateColumns: "1.4fr 1fr 0.8fr 1.2fr 1.4fr 1fr",
                }}
              >
                <span>Blotter No.</span>
                <span>Date</span>
                <span>Time</span>
                <span>Barangay</span>
                <span>Type</span>
                <span>Status</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {offenses.map((c, i) => (
                  <Link
                    key={c.id ?? i}
                    // Opens this case in the Cases view (?case= is read by OffensesTab).
                    href={casesHref(c.id)}
                    title="Open in Cases"
                    className={`grid gap-3 px-3 py-2 text-[0.78rem] border-t ${rowBorder} cursor-pointer transition-colors ${
                      dark
                        ? "text-slate-300 hover:bg-white/[0.05]"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    style={{
                      gridTemplateColumns: "1.4fr 1fr 0.8fr 1.2fr 1.4fr 1fr",
                    }}
                  >
                    <span
                      className={`truncate font-medium ${dark ? "text-slate-100" : "text-slate-800"}`}
                      title={c.blotterNo}
                    >
                      {c.blotterNo ?? "—"}
                    </span>
                    <span className="tabular-nums">
                      {formatDate(c.dateCommitted)}
                    </span>
                    <span className="tabular-nums">
                      {formatTime(c.timeCommitted)}
                    </span>
                    <span className="truncate" title={c.barangay}>
                      {c.barangay ?? "—"}
                    </span>
                    <span className="truncate" title={c.crimeType}>
                      {cleanLabel(c.crimeType ?? "—")}
                    </span>
                    <span className="truncate" title={c.caseStatus}>
                      {c.caseStatus ?? "—"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
