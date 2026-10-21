"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOfflineStatus } from "@/lib/offline/status";

function savedAtLabel(savedAt: number) {
  const saved = new Date(savedAt);
  const sameDay = saved.toDateString() === new Date().toDateString();
  return saved.toLocaleString(undefined, sameDay
    ? { hour: "numeric", minute: "2-digit" }
    : { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/**
 * Says when the app is running without the server, and how old the figures on
 * screen are — saved copies must never pass for live data.
 */
export function OfflineBanner() {
  const { user } = useAuth();
  const { offline, browserOnline, staleSince } = useOfflineStatus();

  if (!offline && staleSince === null) return null;

  const saved = staleSince === null ? null : savedAtLabel(staleSince);
  let title: string;
  let detail: string;
  if (!offline) {
    title = "Back online";
    detail = `Some figures on screen are from ${saved}. Refresh to load current data.`;
  } else {
    title = browserOnline ? "Can't reach the server" : "No internet connection";
    detail = !user
      ? "Signing in needs a connection. Retrying automatically."
      : `${saved ? `Showing data saved ${saved}.` : "Showing data saved on this device where available."} Uploads and changes are paused.`;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-4 bottom-20 z-[1100] mx-auto flex max-w-xl items-start gap-3 rounded-xl border border-amber-300 bg-white/95 px-4 py-3 text-slate-900 shadow-lg shadow-slate-900/10 backdrop-blur-xl dark:border-amber-500/40 dark:bg-slate-900/95 dark:text-slate-100 dark:shadow-black/40"
    >
      {offline
        ? <WifiOff aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-amber-700 dark:text-amber-400" />
        : <RefreshCw aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-sky-700 dark:text-sky-400" />}
      <p className="min-w-0 flex-1 text-sm leading-snug">
        <span className="font-semibold">{title}.</span>{" "}
        <span className="text-slate-600 dark:text-slate-300">{detail}</span>
      </p>
      {!offline && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="shrink-0 rounded-lg px-2.5 py-1 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-600 dark:text-sky-400 dark:hover:bg-white/10"
        >
          Refresh
        </button>
      )}
    </div>
  );
}
