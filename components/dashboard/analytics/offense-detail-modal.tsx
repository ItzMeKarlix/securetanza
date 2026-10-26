"use client";

import React, { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

/** Pill colours for a case status, matched loosely like toOffenseCase does. */
function statusTone(status: string | undefined, dark: boolean): string {
  const s = (status ?? "").toLowerCase();
  if (s.includes("cleared") || s.includes("solved"))
    return dark
      ? "bg-emerald-500/15 text-emerald-300"
      : "bg-emerald-50 text-emerald-700";
  if (s.includes("investigat"))
    return dark
      ? "bg-amber-500/15 text-amber-300"
      : "bg-amber-50 text-amber-700";
  if (s.includes("filed") || s.includes("court"))
    return dark ? "bg-sky-500/15 text-sky-300" : "bg-sky-50 text-sky-700";
  return dark
    ? "bg-white/[0.06] text-slate-300"
    : "bg-slate-100 text-slate-600";
}

const PAGE_SIZE = 10;

/** "11–20 of 43" plus first/previous/next/last, under the offense list. */
function Pager({
  page,
  totalPages,
  total,
  onPage,
  dark,
  rowBorder,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPage: (page: number) => void;
  dark: boolean;
  rowBorder: string;
}) {
  const first = (page - 1) * PAGE_SIZE + 1;
  const last = Math.min(page * PAGE_SIZE, total);
  const buttons = [
    { label: "First page", Icon: ChevronsLeft, to: 1, disabled: page === 1 },
    {
      label: "Previous page",
      Icon: ChevronLeft,
      to: page - 1,
      disabled: page === 1,
    },
    {
      label: "Next page",
      Icon: ChevronRight,
      to: page + 1,
      disabled: page >= totalPages,
    },
    {
      label: "Last page",
      Icon: ChevronsRight,
      to: totalPages,
      disabled: page >= totalPages,
    },
  ];
  return (
    <div
      className={`flex shrink-0 items-center justify-between gap-3 border-t px-3 py-1.5 text-[0.75rem] tabular-nums ${rowBorder} ${
        dark ? "text-slate-400" : "text-slate-500"
      }`}
    >
      <span>
        {first}–{last} of {total}
      </span>
      <div className="flex items-center gap-2">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-0.5">
          {buttons.map(({ label, Icon, to, disabled }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              onClick={() => onPage(to)}
              aria-label={label}
              title={label}
            >
              <Icon />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
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
  // Window-filling view for a bigger map; always starts compact for a new slice.
  // Remembers which slice was expanded, so a newly opened slice is compact without an effect.
  const [fullFor, setFullFor] = useState<AnalyticsSlice | null>(null);
  const full = slice !== null && fullFor === slice;
  // Same trick for the page: a page set for an earlier slice reads as page 1.
  const [pager, setPager] = useState<{
    slice: AnalyticsSlice | null;
    page: number;
  }>({ slice: null, page: 1 });

  // Each offense counts on its own, whatever chart the slice came from.
  const offenses = useMemo(
    () => (slice ? filterOffensesBySlice(allCrimes, slice) : []),
    [slice, allCrimes],
  );

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

  const share =
    totalOffenses > 0 ? Math.round((offenses.length / totalOffenses) * 100) : 0;

  const chipClass = `rounded-md px-2.5 py-1.5 ${
    dark ? "bg-white/[0.04] text-slate-300" : "bg-slate-50 text-slate-600"
  }`;
  const chipValueClass = `font-bold ${dark ? "text-white" : "text-slate-900"}`;
  const headClass = `text-[0.68rem] font-bold uppercase tracking-[0.11em] ${
    dark ? "text-slate-400" : "text-slate-500"
  }`;
  const rowBorder = dark ? "border-white/[0.06]" : "border-slate-100";

  const totalPages = Math.max(1, Math.ceil(offenses.length / PAGE_SIZE));
  const page = Math.min(pager.slice === slice ? pager.page : 1, totalPages);
  const pageOffenses = offenses.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagerEl =
    totalPages > 1 ? (
      <Pager
        page={page}
        totalPages={totalPages}
        total={offenses.length}
        onPage={(next) => setPager({ slice, page: next })}
        dark={dark}
        rowBorder={rowBorder}
      />
    ) : null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        // sm:max-w-* is required, not plain max-w-*: DialogContent's own
        // default is `sm:max-w-sm`, and a base-variant class never overrides a
        // breakpoint-variant one — the dialog would silently stay tiny.
        className={`overflow-y-auto ${
          full
            ? "max-w-none sm:max-w-none w-screen h-dvh max-h-none rounded-none gap-5 sm:p-6 grid-rows-[auto_auto_minmax(0,1fr)]"
            : "sm:max-w-5xl max-h-[85vh]"
        } ${
          dark
            ? "bg-[#1e293b] border-white/[0.06]"
            : "bg-white border-slate-200"
        }`}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-2 right-10"
          onClick={() => setFullFor(full ? null : slice)}
          aria-pressed={full}
          title={full ? "Exit full screen" : "Full screen"}
        >
          {full ? <Minimize2 /> : <Maximize2 />}
          <span className="sr-only">
            {full ? "Exit full screen" : "Full screen"}
          </span>
        </Button>
        <DialogHeader className="pr-16">
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

            {/* Full screen puts map and list side by side; compact stacks them as direct children. */}
            <div
              className={
                full
                  ? "grid min-h-0 gap-4 grid-rows-[minmax(280px,1fr)_minmax(0,1fr)] lg:grid-rows-1 lg:grid-cols-[3fr_2fr]"
                  : "contents"
              }
            >
              <SliceMiniMap offenses={offenses} theme={theme} fill={full} />

              {/* Offense list: a six-column table when compact; in full screen it sits in a
                narrower column beside the map, so each case is a two-line row instead. */}
              {full ? (
                <div
                  className={`flex min-h-0 flex-col overflow-hidden rounded-lg border ${rowBorder}`}
                >
                  <div
                    className={`flex items-center justify-between px-4 py-2.5 ${headClass} ${
                      dark ? "bg-white/[0.03]" : "bg-slate-50"
                    }`}
                  >
                    <span>Offenses</span>
                    <span className="tabular-nums">{offenses.length}</span>
                  </div>
                  <div className="min-h-0 flex-1 overflow-y-auto">
                    {pageOffenses.map((c, i) => (
                      <Link
                        key={c.id ?? i}
                        href={casesHref(c.id)}
                        title="Open in Cases"
                        className={`flex items-start gap-3 border-t px-4 py-3 transition-colors ${rowBorder} ${
                          dark ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate text-[0.85rem] font-semibold ${dark ? "text-slate-100" : "text-slate-800"}`}
                            title={c.crimeType}
                          >
                            {cleanLabel(c.crimeType ?? "—")}
                          </p>
                          <p
                            className={`mt-0.5 truncate text-[0.75rem] tabular-nums ${dark ? "text-slate-400" : "text-slate-500"}`}
                          >
                            {c.barangay ?? "—"} · {formatDate(c.dateCommitted)}{" "}
                            · {formatTime(c.timeCommitted)}
                          </p>
                          <p
                            className={`mt-1 truncate font-mono text-[0.68rem] ${dark ? "text-slate-500" : "text-slate-400"}`}
                            title={c.blotterNo}
                          >
                            {c.blotterNo ?? "—"}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.68rem] font-semibold ${statusTone(c.caseStatus, dark)}`}
                        >
                          {c.caseStatus ?? "—"}
                        </span>
                      </Link>
                    ))}
                  </div>
                  {pagerEl}
                </div>
              ) : (
                <div
                  className={`rounded-lg border ${rowBorder} overflow-hidden`}
                >
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
                  <div>
                    {pageOffenses.map((c, i) => (
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
                          gridTemplateColumns:
                            "1.4fr 1fr 0.8fr 1.2fr 1.4fr 1fr",
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
                  {pagerEl}
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
