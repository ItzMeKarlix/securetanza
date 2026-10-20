"use client";

import { Clock3, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IdleLogoutWarningProps {
  remainingSeconds: number | null;
  loggingOut: boolean;
  onStaySignedIn: () => void;
  onLogout: () => void;
}

export function IdleLogoutWarning({ remainingSeconds, loggingOut, onStaySignedIn, onLogout }: IdleLogoutWarningProps) {
  if (remainingSeconds === null && !loggingOut) return null;

  const countdown = remainingSeconds === null ? "" : `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  return (
    <section
      data-idle-logout-warning
      aria-labelledby="idle-logout-title"
      aria-describedby="idle-logout-description"
      aria-busy={loggingOut}
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-md rounded-xl border border-amber-300 bg-white p-4 text-slate-900 shadow-lg sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[26rem] dark:border-amber-500/40 dark:bg-slate-900 dark:text-slate-100"
    >
      <div className="flex items-start gap-3">
        <Clock3 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-amber-400" />
        <div className="min-w-0 flex-1">
          <h2 id="idle-logout-title" className="text-sm font-semibold" role="status">
            {loggingOut ? "Logging out…" : "You will be logged out soon"}
          </h2>
          <p id="idle-logout-description" className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {loggingOut ? "Ending your session and returning to the login screen." : "Your session is about to end due to inactivity. Continue working to stay signed in."}
          </p>
          {!loggingOut && (
            <p className="mt-3 text-sm font-medium">
              Logging out in <span role="timer" aria-label="Time until automatic logout" aria-live="off" className="font-semibold tabular-nums text-amber-800 dark:text-amber-300">{countdown}</span>
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" size="lg" onClick={onStaySignedIn} disabled={loggingOut}>Stay signed in</Button>
            <Button type="button" size="lg" variant="outline" onClick={onLogout} disabled={loggingOut}>
              {loggingOut && <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />}
              Log out now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
