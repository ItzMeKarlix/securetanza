"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ListFilter } from "lucide-react";
import { useMapContext } from "@/context/MapContext";
import { FELONY_STAGES, type FelonyStage } from "@/lib/offense-classification";

const labels: Record<FelonyStage, string> = {
  CONSUMMATED: "Consummated",
  FRUSTRATED: "Frustrated",
  ATTEMPTED: "Attempted",
  UNKNOWN: "Unknown / not recorded",
};

export default function FelonyStageSelector({ onPick }: { onPick?: () => void }) {
  const { selectedFelonyStage, setSelectedFelonyStage } = useMapContext();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = Boolean(selectedFelonyStage);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const choose = (stage: FelonyStage | null) => {
    setSelectedFelonyStage(stage);
    setIsOpen(false);
    onPick?.();
  };

  const rowClass = (selected: boolean) =>
    `flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-[13px] font-medium transition-colors ${
      selected
        ? "bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300"
        : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.04]"
    }`;

  return (
    <div ref={ref} className="relative">
      <div
        className={`group flex h-11 min-w-[180px] items-center gap-3 rounded-xl border bg-white pl-4 pr-3 transition-all duration-300 hover:border-blue-400 hover:shadow-sm dark:bg-white/[0.04] dark:hover:border-[#0EA5E9]/30 dark:hover:bg-white/[0.06] ${
          isActive
            ? "border-[#0EA5E9]/40 dark:border-[#0EA5E9]/30"
            : "border-slate-200 dark:border-white/[0.08]"
        }`}
      >
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
        >
          <ListFilter className="h-4 w-4 shrink-0 text-[#0EA5E9]" />
          <span
            className={`truncate whitespace-nowrap text-[14px] font-medium ${
              isActive ? "text-sky-700 dark:text-sky-300" : "text-slate-700 dark:text-white/80"
            }`}
            style={{ fontFamily: "var(--font-inter)" }}
          >
            {selectedFelonyStage ? labels[selectedFelonyStage] : "All felony stages"}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-all duration-300 group-hover:text-[#0EA5E9] ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div
        role="listbox"
        aria-label="Filter by felony stage"
        className={`absolute left-0 top-[calc(100%+8px)] z-50 w-[240px] max-w-[calc(100vw-24px)] origin-top-left overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-[0_20px_60px_rgba(0,0,0,0.1)] backdrop-blur-2xl transition-all duration-200 dark:border-white/[0.06] dark:bg-[#0F172A]/95 dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <div className="max-h-[300px] overflow-y-auto p-1">
          <button
            type="button"
            role="option"
            aria-selected={!isActive}
            onClick={() => choose(null)}
            className={rowClass(!isActive)}
          >
            <span>All felony stages</span>
            {!isActive && <Check className="h-3.5 w-3.5" />}
          </button>
          {FELONY_STAGES.map((stage) => (
            <button
              key={stage}
              type="button"
              role="option"
              aria-selected={selectedFelonyStage === stage}
              onClick={() => choose(stage)}
              className={rowClass(selectedFelonyStage === stage)}
            >
              <span>{labels[stage]}</span>
              {selectedFelonyStage === stage && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
