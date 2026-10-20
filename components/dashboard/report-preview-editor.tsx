"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignJustify,
  Check,
  Download,
  FileText,
  List,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  PDFReportGenerator,
  type ReportConfig,
  type ReportData,
} from "@/lib/pdf-generator";
import {
  DEFAULT_REPORT_EDITS,
  type ReportEditOptions,
  type ReportEditRegion,
  type ReportOutlineEntry,
} from "@/lib/report-editor";
import { loadReportPDF, type LoadedReportPDF } from "@/lib/pdf-preview";
import PDFReportPages, { type ActivePDFText } from "./pdf-report-pages";

interface Props {
  data: ReportData;
  config: ReportConfig;
  edits: ReportEditOptions;
  onChange: (edits: ReportEditOptions) => void;
  onClose: () => void;
  onDownload: (blob: Blob) => Promise<void>;
}
interface RenderedReport extends LoadedReportPDF {
  blob: Blob;
  edits: ReportEditOptions;
  config: ReportConfig;
  data: ReportData;
  regions: ReportEditRegion[];
  outline: ReportOutlineEntry[];
}
const controlClass =
  "h-9 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";
const outlineActiveClass =
  "bg-sky-100 font-semibold text-sky-900 dark:bg-sky-400/10 dark:text-sky-200";
const outlineRestClass =
  "text-slate-600 hover:bg-slate-200/70 dark:text-slate-400 dark:hover:bg-slate-800";

/** One exact PDF surface: the generator supplies both the file and its text positions. */
export default function ReportPreviewEditor({
  data,
  config,
  edits,
  onChange,
  onClose,
  onDownload,
}: Props) {
  const [rendered, setRendered] = useState<RenderedReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [fontSizeInput, setFontSizeInput] = useState(String(edits.fontSize));
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("cover");
  const [active, setActive] = useState<ActivePDFText | null>(null);
  const [requestedEdit, setRequestedEdit] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [zoom, setZoom] = useState("100");
  const pageRefs = useRef(new Map<number, HTMLElement>());
  const scrollRef = useRef<HTMLDivElement>(null);
  const fontSizeValid =
    fontSizeInput.trim() !== "" &&
    Number.isFinite(Number(fontSizeInput)) &&
    Number(fontSizeInput) >= 8 &&
    Number(fontSizeInput) <= 14;
  const ready =
    rendered?.edits === edits &&
    rendered?.config === config &&
    rendered?.data === data;
  const activeId = active?.id;
  const scope =
    data.barangayName === "All Barangays" ||
    data.barangayName === "General Dashboard"
      ? "All barangays · Tanza, Cavite"
      : `Barangay ${data.barangayName}, Tanza, Cavite`;

  useEffect(() => setFontSizeInput(String(edits.fontSize)), [edits.fontSize]);
  useEffect(() => {
    if (window.innerWidth < 768) setZoom("150");
  }, []);
  useEffect(() => {
    let cancelled = false;
    setError(null);
    const timer = setTimeout(async () => {
      try {
        const generator = new PDFReportGenerator(edits);
        const blob = await generator.generateReport(config, data);
        if (cancelled) return;
        const loaded = await loadReportPDF(blob);
        if (cancelled) {
          await loaded.pdf.loadingTask.destroy();
          return;
        }
        setRendered({
          ...loaded,
          blob,
          edits,
          config,
          data,
          regions: generator.getEditableRegions(),
          outline: generator.getDocumentOutline(),
        });
      } catch (cause) {
        if (!cancelled)
          setError(
            cause instanceof Error
              ? cause.message
              : "Could not update the report preview.",
          );
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [config, data, edits, retry]);
  useEffect(() => {
    const pdf = rendered?.pdf;
    return () => {
      if (pdf) void pdf.loadingTask.destroy().catch(() => undefined);
    };
  }, [rendered?.pdf]);
  useEffect(() => {
    if (!requestedEdit || !rendered) return;
    const region = rendered.regions.find((item) => item.id === requestedEdit);
    if (!region) return;
    setActive({ id: region.id, page: region.page });
    pageRefs.current
      .get(region.page)
      ?.scrollIntoView({ block: "start", behavior: "instant" });
    setRequestedEdit(null);
  }, [requestedEdit, rendered]);
  useEffect(() => {
    if (!activeId) return;
    const frame = requestAnimationFrame(() =>
      scrollRef.current
        ?.querySelector<HTMLTextAreaElement>("[data-pdf-inline-editor]")
        ?.focus({ preventScroll: true }),
    );
    return () => cancelAnimationFrame(frame);
  }, [activeId]);

  const update = <K extends keyof ReportEditOptions>(
    key: K,
    value: ReportEditOptions[K],
  ) => onChange({ ...edits, [key]: value });
  const changeText = (region: ReportEditRegion, value: string) => {
    if (region.target === "title" || region.target === "subtitle")
      update(region.target, value);
    else
      update("paragraphOverrides", {
        ...edits.paragraphOverrides,
        [region.id]: value,
      });
  };
  const navigate = (id: string, page: number) => {
    setActive(null);
    setActiveSection(id);
    pageRefs.current
      .get(page)
      ?.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    pageRefs.current.get(page)?.focus({ preventScroll: true });
    if (!window.matchMedia("(min-width: 768px)").matches) setOutlineOpen(false);
  };
  const restoreSelected = () => {
    if (!active) return;
    const region = rendered?.regions.find((item) => item.id === active.id);
    if (region?.target === "title") update("title", DEFAULT_REPORT_EDITS.title);
    else if (region?.target === "subtitle") {
      update("subtitle", "");
      setActive(null);
    } else {
      const overrides = { ...edits.paragraphOverrides };
      delete overrides[active.id];
      update("paragraphOverrides", overrides);
    }
  };
  const download = async () => {
    if (!rendered || !ready || !fontSizeValid || error) return;
    setDownloading(true);
    try {
      await onDownload(rendered.blob);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not download the report.",
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        data-report-editor
        showCloseButton={false}
        onEscapeKeyDown={(event) => {
          if (active) { event.preventDefault(); setActive(null); }
        }}
        style={{
          inset: 0,
          translate: "none",
          transform: "none",
          width: "100vw",
          maxWidth: "none",
          height: "100dvh",
        }}
        className="flex flex-col gap-0 overflow-hidden rounded-none border-0 bg-slate-100 p-0 ring-0 duration-0 data-open:animate-none data-closed:animate-none dark:bg-slate-950"
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2 sm:px-5 dark:border-white/10 dark:bg-slate-900">
          <div className="flex min-w-0 items-center gap-3">
            <FileText
              aria-hidden="true"
              className="hidden size-6 shrink-0 text-sky-700 sm:block dark:text-sky-300"
            />
            <div className="min-w-0">
              <DialogTitle
                className="font-semibold"
                style={{ fontSize: "14px" }}
              >
                Report editor
              </DialogTitle>
              <DialogDescription className="mt-0.5 max-w-80 truncate text-xs">
                {scope}
              </DialogDescription>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              aria-label="Download PDF"
              onClick={download}
              disabled={!ready || !fontSizeValid || !!error || downloading}
              className="h-10 gap-2 bg-sky-700 px-3 text-white hover:bg-sky-800 dark:bg-sky-400 dark:text-sky-950 dark:hover:bg-sky-300"
            >
              {downloading ? (
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
              ) : (
                <Download className="size-4" />
              )}
              <span className="sm:hidden">Download</span>
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-10"
              aria-label="Close preview"
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>
          </div>
        </header>

        <div
          role="group"
          aria-label="Document formatting"
          className="flex shrink-0 items-center gap-3 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2 sm:px-5 dark:border-white/10 dark:bg-slate-900"
        >
          <Button
            variant="ghost"
            size="icon"
            className="size-9 shrink-0"
            aria-label={
              outlineOpen ? "Hide document outline" : "Show document outline"
            }
            aria-expanded={outlineOpen}
            aria-controls="report-outline"
            title="Document outline"
            onClick={() => setOutlineOpen(!outlineOpen)}
          >
            {outlineOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </Button>
          <div className="h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
          <label className="shrink-0">
            <span className="sr-only">Font family</span>
            <select
              aria-label="Font family"
              style={{ padding: "0 8px" }}
              className={`${controlClass} w-32`}
              value={edits.fontFamily}
              onChange={(event) =>
                update(
                  "fontFamily",
                  event.target.value as ReportEditOptions["fontFamily"],
                )
              }
            >
              <option value="helvetica">Helvetica</option>
              <option value="times">Times</option>
              <option value="courier">Courier</option>
            </select>
          </label>
          <div className="flex shrink-0 items-center gap-1.5">
            <Input
              aria-label="Font size (pt)"
              title="Body font size · 8–14 pt"
              aria-invalid={!fontSizeValid}
              type="number"
              min={8}
              max={14}
              step={0.5}
              value={fontSizeInput}
              className="h-9 w-[4.5rem] rounded-md px-2 text-center text-base"
              onChange={(event) => {
                setFontSizeInput(event.target.value);
                const value = event.target.valueAsNumber;
                if (
                  Number.isFinite(value) &&
                  value >= 8 &&
                  value <= 14 &&
                  !event.target.value.endsWith(".")
                )
                  update("fontSize", value);
              }}
              onBlur={() => {
                const value = Math.min(
                  14,
                  Math.max(8, Number(fontSizeInput) || edits.fontSize),
                );
                setFontSizeInput(String(value));
                if (value !== edits.fontSize) update("fontSize", value);
              }}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              pt
            </span>
          </div>
          <div className="h-5 w-px shrink-0 bg-slate-200 dark:bg-slate-700" />
          <label className="flex shrink-0 items-center gap-2">
            <AlignJustify
              aria-hidden="true"
              className="size-4 text-slate-500 dark:text-slate-400"
            />
            <span className="sr-only">Line spacing</span>
            <select
              aria-label="Line spacing"
              title="Line spacing"
              style={{ padding: "0 8px" }}
              className={`${controlClass} w-20`}
              value={edits.lineSpacing}
              onChange={(event) =>
                update("lineSpacing", Number(event.target.value))
              }
            >
              {[0.9, 1, 1.15, 1.3, 1.6].map((value) => (
                <option key={value} value={value}>
                  {value}×
                </option>
              ))}
            </select>
          </label>
          <span className="hidden text-xs text-slate-500 xl:inline dark:text-slate-400">
            Applies to the whole report
          </span>
          <label className="shrink-0">
            <span className="sr-only">Document zoom</span>
            <select
              aria-label="Document zoom"
              className={`${controlClass} w-24`}
              style={{ padding: "0 8px" }}
              value={zoom}
              onChange={(event) => setZoom(event.target.value)}
            >
              <option value="fit">Fit width</option>
              <option value="100">100%</option>
              <option value="125">125%</option>
              <option value="150">150%</option>
              <option value="200">200%</option>
            </select>
          </label>
          {!edits.subtitle.trim() && (
            <Button
              variant="ghost"
              size="sm"
              className="h-9 shrink-0"
              onClick={() => {
                update("subtitle", "Report subtitle");
                setRequestedEdit("subtitle");
              }}
            >
              Add subtitle
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-9 shrink-0 gap-2 text-slate-600 dark:text-slate-300"
            onClick={() =>
              onChange({ ...DEFAULT_REPORT_EDITS, paragraphOverrides: {} })
            }
          >
            <RotateCcw className="size-3.5" />
            Reset all
          </Button>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs dark:border-white/10 dark:bg-slate-900/60">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <span>
              {active
                ? "Editing report text · Esc to finish"
                : "Click text on the report to edit"}
            </span>
            {active && (
              <button
                type="button"
                onClick={restoreSelected}
                className="rounded px-1 py-1 text-sky-800 underline underline-offset-2 dark:text-sky-200"
              >
                Restore original text
              </button>
            )}
          </div>
          <div
            role="status"
            aria-live="polite"
            className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400"
          >
            {error ? (
              <span role="alert" className="text-red-700 dark:text-red-300">
                {error}{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setRetry((value) => value + 1)}
                >
                  Retry
                </button>
              </span>
            ) : !fontSizeValid ? (
              <span className="text-red-700 dark:text-red-300">
                Enter a font size from 8 to 14 pt.
              </span>
            ) : ready ? (
              <>
                <Check className="size-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>Preview is up to date</span>
              </>
            ) : (
              <>
                <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" />
                <span>Updating PDF preview…</span>
              </>
            )}
          </div>
        </div>
        <div className="relative flex min-h-0 flex-1">
          {outlineOpen && (
            <nav
              id="report-outline"
              aria-label="Document outline"
              className="absolute inset-y-0 left-0 z-10 flex w-60 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-slate-50 px-3 py-5 md:static md:w-52 dark:border-white/10 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between px-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <List className="size-3.5" />
                  Outline
                </span>
                <button
                  type="button"
                  aria-label="Close document outline"
                  className="rounded p-1 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-sky-600 dark:hover:bg-slate-800"
                  onClick={() => setOutlineOpen(false)}
                >
                  <X className="size-3.5" />
                </button>
              </div>
              {(rendered?.outline ?? []).map((group) => (
                <button
                  key={group.id}
                  type="button"
                  aria-current={
                    activeSection === group.id ? "location" : undefined
                  }
                  onClick={() => navigate(group.id, group.page)}
                  className={`mb-1 rounded-md px-3 py-2.5 text-left text-xs leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-sky-600 ${activeSection === group.id ? outlineActiveClass : outlineRestClass}`}
                >
                  {group.title}
                </button>
              ))}
              <p className="mt-auto px-3 pt-6 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Jump to a section of the report.
              </p>
            </nav>
          )}

          <div
            ref={scrollRef}
            aria-label="Report pages"
            className="min-h-0 min-w-0 flex-1 overflow-auto bg-slate-100 px-3 py-5 sm:px-8 sm:py-8 dark:bg-slate-950"
          >
            {rendered ? (
              <PDFReportPages
                pdf={rendered.pdf}
                pageSizes={rendered.pageSizes}
                regions={rendered.regions}
                edits={edits}
                active={active}
                onActivate={setActive}
                onChange={changeText}
                pageRefs={pageRefs}
                scrollRef={scrollRef}
                onError={setError}
                zoom={zoom}
              />
            ) : (
              <div className="mx-auto flex min-h-96 max-w-[920px] items-center justify-center gap-2 bg-white text-sm text-slate-600">
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
                Preparing report pages…
              </div>
            )}
          </div>
        </div>
        <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-2 text-[11px] text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
          <span>
            {rendered ? `${rendered.pdf.numPages} pages` : "Preparing document"}
            <span className="ml-4 hidden sm:inline">
              Edits stay with this report while Reports is open.
            </span>
          </span>
          <span>A4 · Portrait</span>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
