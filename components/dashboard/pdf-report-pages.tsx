"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { Loader2 } from "lucide-react";
import type { PDFPageSize } from "@/lib/pdf-preview";
import type { ReportEditOptions, ReportEditRegion } from "@/lib/report-editor";

export interface ActivePDFText {
  id: string;
  page: number;
}
interface Props {
  pdf: PDFDocumentProxy;
  pageSizes: PDFPageSize[];
  regions: ReportEditRegion[];
  edits: ReportEditOptions;
  active: ActivePDFText | null;
  onActivate: (active: ActivePDFText | null) => void;
  onChange: (region: ReportEditRegion, value: string) => void;
  pageRefs: RefObject<Map<number, HTMLElement>>;
  scrollRef: RefObject<HTMLDivElement | null>;
  onError: (message: string) => void;
  zoom: string;
}
const fonts = {
  helvetica: "Helvetica, Arial, sans-serif",
  times: '"Times New Roman", Times, serif',
  courier: '"Courier New", Courier, monospace',
};
interface Selection {
  start: number;
  end: number;
  focused: boolean;
}

function InlinePDFText({
  region,
  width,
  value,
  selectionRef,
  onChange,
  onEnd,
}: {
  region: ReportEditRegion;
  width: number;
  value: string;
  selectionRef: RefObject<Selection>;
  onChange: (value: string) => void;
  onEnd: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    if (!selectionRef.current.focused) return;
    const input = ref.current;
    if (!input) return;
    input.focus({ preventScroll: true });
    input.setSelectionRange(
      Math.min(selectionRef.current.start, value.length),
      Math.min(selectionRef.current.end, value.length),
    );
  }, [region.id, region.page, selectionRef, value.length]);
  return (
    <textarea
      ref={ref}
      aria-label={region.label}
      value={value}
      spellCheck
      data-pdf-inline-editor
      onFocus={() => {
        selectionRef.current = { ...selectionRef.current, focused: true };
      }}
      onBlur={(event) => {
        if (event.relatedTarget)
          selectionRef.current = { ...selectionRef.current, focused: false };
      }}
      onSelect={(event) => {
        selectionRef.current = {
          ...selectionRef.current,
          start: event.currentTarget.selectionStart,
          end: event.currentTarget.selectionEnd,
        };
      }}
      onChange={(event) => {
        selectionRef.current = {
          ...selectionRef.current,
          start: event.target.selectionStart,
          end: event.target.selectionEnd,
        };
        onChange(event.target.value);
      }}
      onKeyDown={(event) => {
        if (
          event.key === "Escape" ||
          (event.key === "Enter" && (event.ctrlKey || event.metaKey))
        ) {
          event.preventDefault();
          event.stopPropagation();
          selectionRef.current = { ...selectionRef.current, focused: false };
          onEnd();
        }
      }}
      style={{
        width: "100%",
        height: "100%",
        padding: 0,
        fontFamily: fonts[region.fontFamily],
        fontSize: `${(region.fontSize * width) / ((210 * 72) / 25.4)}px`,
        fontWeight: region.fontWeight,
        lineHeight: `${(region.lineHeight * width) / 210}px`,
        color: "#334155",
      }}
      className="block resize-none overflow-auto rounded-none border-0 bg-white outline-2 outline-offset-1 outline-sky-600 selection:bg-sky-100 selection:text-sky-950"
    />
  );
}

function PDFReportPage({
  number,
  size,
  pdf,
  regions,
  edits,
  activeRegion,
  selectionRef,
  onActivate,
  onChange,
  pageRefs,
  scrollRef,
  onError,
}: {
  number: number;
  size: PDFPageSize;
  activeRegion: ReportEditRegion | undefined;
  selectionRef: RefObject<Selection>;
} & Omit<Props, "pageSizes" | "active">) {
  const holder = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const renderTask = useRef<RenderTask | null>(null);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paintedPDF, setPaintedPDF] = useState<PDFDocumentProxy | null>(null);
  useEffect(() => {
    const element = holder.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.round(entry.contentRect.width)),
    );
    observer.observe(element);
    const intersection = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { root: scrollRef.current, rootMargin: "500px 0px" },
    );
    intersection.observe(element);
    return () => {
      observer.disconnect();
      intersection.disconnect();
    };
  }, [scrollRef]);

  useEffect(() => {
    let cancelled = false;
    const previous = renderTask.current;
    previous?.cancel();
    const draw = async () => {
      await previous?.promise.catch(() => undefined);
      const element = canvas.current;
      if (!element || cancelled) return;
      if (!visible || !width) {
        element.width = 0;
        element.height = 0;
        setPaintedPDF(null);
        return;
      }
      try {
        const page = await pdf.getPage(number);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: width / size.width });
        const density = Math.min(window.devicePixelRatio || 1, 2);
        element.width = Math.ceil(viewport.width * density);
        element.height = Math.ceil(viewport.height * density);
        const task = page.render({
          canvas: element,
          viewport,
          transform: density === 1 ? undefined : [density, 0, 0, density, 0, 0],
        });
        renderTask.current = task;
        await task.promise;
        if (!cancelled) setPaintedPDF(pdf);
      } catch (cause) {
        if (
          !cancelled &&
          !(
            cause instanceof Error &&
            cause.name === "RenderingCancelledException"
          )
        )
          onError("Could not render a report page. Please retry the preview.");
      }
    };
    void draw();
    return () => {
      cancelled = true;
      renderTask.current?.cancel();
    };
  }, [pdf, number, width, visible, size.width, onError]);

  return (
    <section
      aria-label={`Report page ${number}`}
      className="mx-auto mb-7 w-full"
    >
      <div
        ref={(element) => {
          holder.current = element;
          if (element) pageRefs.current.set(number, element);
          else pageRefs.current.delete(number);
        }}
        tabIndex={-1}
        data-pdf-page={number}
        data-pdf-painted={paintedPDF === pdf}
        style={{ aspectRatio: `${size.width} / ${size.height}` }}
        className="relative w-full bg-white text-slate-900 shadow-[0_3px_20px_-8px_rgba(15,23,42,0.18)] outline-none"
      >
        <canvas
          ref={canvas}
          role="img"
          aria-label={`PDF page ${number}, including its charts, tables and text`}
          className="absolute inset-0 size-full"
        />
        {visible && paintedPDF !== pdf && (
          <div className="pointer-events-none absolute right-3 top-3 rounded bg-white p-2 text-slate-500">
            <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
          </div>
        )}
        {regions.map((region) => {
          const selected = activeRegion === region;
          const value =
            region.target === "title"
              ? edits.title
              : region.target === "subtitle"
                ? edits.subtitle
            : (edits.paragraphOverrides[region.id] ?? region.originalValue);
          return (
            <div
              key={region.id}
              style={{
                left: `${(region.x / 210) * 100}%`,
                top: `${(region.y / 297) * 100}%`,
                width: `${(region.width / 210) * 100}%`,
                height: `${(region.height / 297) * 100}%`,
              }}
              className={`absolute ${selected ? "z-10" : ""}`}
            >
              {selected ? (
                <InlinePDFText
                  region={region}
                  width={width}
                  value={value}
                  selectionRef={selectionRef}
                  onChange={(text) => onChange(region, text)}
                  onEnd={() => onActivate(null)}
                />
              ) : (
                <button
                  type="button"
                  aria-label={`Edit ${region.label}`}
                  aria-describedby={`description-${number}-${region.id}`}
                  title={`Edit ${region.label}`}
                  className="block size-full cursor-text border-0 bg-transparent p-0 outline-none hover:bg-sky-500/5 hover:outline-1 hover:outline-sky-600 focus-visible:outline-2 focus-visible:outline-sky-600"
                  onClick={() => {
                    selectionRef.current = {
                      start: value.length,
                      end: value.length,
                      focused: true,
                    };
                    onActivate({ id: region.id, page: region.page });
                  }}
                />
              )}
              <span
                id={`description-${number}-${region.id}`}
                className="sr-only"
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[11px] text-slate-500 dark:text-slate-400">
        Page {number} of {pdf.numPages}
      </p>
    </section>
  );
}

export default function PDFReportPages(props: Props) {
  const selectionRef = useRef<Selection>({ start: 0, end: 0, focused: false });
  const activeRegion = props.active
    ? (props.regions.find(
        (region) =>
          region.id === props.active!.id && region.page === props.active!.page,
      ) ?? props.regions.find((region) => region.id === props.active!.id))
    : undefined;
  return (
    <div
      aria-label="Editable report document"
      className="mx-auto"
      style={{
        width:
          props.zoom === "fit"
            ? "100%"
            : `${(794 * Number(props.zoom)) / 100}px`,
        maxWidth: props.zoom === "fit" ? "920px" : undefined,
      }}
      onPointerDown={(event) => {
        if (event.target instanceof HTMLCanvasElement) props.onActivate(null);
      }}
    >
      {props.pageSizes.map((size, index) => (
        <PDFReportPage
          key={index + 1}
          {...props}
          number={index + 1}
          size={size}
          activeRegion={activeRegion}
          selectionRef={selectionRef}
          regions={props.regions.filter((region) => region.page === index + 1)}
        />
      ))}
    </div>
  );
}
