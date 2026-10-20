const WARNING_MS = 60_000;
const DEFAULT_TIMEOUT_MS = 15 * 60_000;

/** Keep page exclusions aligned with middleware's public routes. */
export function isIdleProtectedPath(pathname: string): boolean {
  return pathname !== "/login" && pathname !== "/docs";
}

export function idleTimeoutMs(minutes: number | undefined): number {
  return typeof minutes === "number" && Number.isFinite(minutes) && minutes > 0
    ? minutes * 60_000
    : DEFAULT_TIMEOUT_MS;
}

interface IdleTimerOptions {
  now: () => number;
  schedule: (callback: () => void, delay: number) => unknown;
  cancel: (handle: unknown) => void;
  onWarning: (remainingSeconds: number | null) => void;
  onExpire: () => void;
}

/** Uses wall-clock deadlines so background timer throttling cannot extend a session. */
export class IdleSessionTimer {
  private timeoutMs: number | null = null;
  private lastActivity: number | null = null;
  private scheduled: unknown = null;
  private warning: number | null = null;
  private expired = false;

  constructor(private readonly options: IdleTimerOptions) {}

  configure(timeoutMs: number | null) {
    if (this.expired) return;
    this.timeoutMs = timeoutMs !== null && Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : null;
    if (this.timeoutMs === null) this.lastActivity = null;
    else if (this.lastActivity === null) this.lastActivity = this.options.now();
    this.check();
  }

  activity() {
    if (this.expired || this.timeoutMs === null || this.lastActivity === null) return;
    // Input arriving after a suspended tab's deadline must not revive the session.
    if (this.options.now() >= this.lastActivity + this.timeoutMs) {
      this.check();
      return;
    }
    this.lastActivity = this.options.now();
    // Outside the warning, keep the existing wake-up; it will observe the newer
    // deadline. High-frequency mouse events only record a timestamp.
    if (this.warning !== null || this.scheduled === null) this.check();
  }

  check = () => {
    this.cancelScheduled();
    if (this.expired || this.timeoutMs === null || this.lastActivity === null) {
      this.showWarning(null);
      return;
    }
    const remainingMs = this.lastActivity + this.timeoutMs - this.options.now();
    if (remainingMs <= 0) {
      this.expired = true;
      this.showWarning(null);
      this.options.onExpire();
      return;
    }
    const warningMs = Math.min(WARNING_MS, this.timeoutMs);
    const seconds = Math.ceil(remainingMs / 1000);
    this.showWarning(remainingMs <= warningMs ? seconds : null);
    // No one-second work until the warning is visible.
    const delay = remainingMs > warningMs
      ? remainingMs - warningMs
      : remainingMs - (seconds - 1) * 1000;
    this.scheduled = this.options.schedule(this.check, delay);
  };

  dispose() {
    this.cancelScheduled();
    this.timeoutMs = null;
    this.lastActivity = null;
    this.showWarning(null);
  }

  private cancelScheduled() {
    if (this.scheduled !== null) this.options.cancel(this.scheduled);
    this.scheduled = null;
  }

  private showWarning(seconds: number | null) {
    if (seconds === this.warning) return;
    this.warning = seconds;
    this.options.onWarning(seconds);
  }
}

/** A logout remains terminal even after its request resolves. */
export function onceAsync<Args extends unknown[]>(action: (...args: Args) => Promise<void>): (...args: Args) => Promise<void> {
  let pending: Promise<void> | undefined;
  return (...args) => {
    pending ??= action(...args);
    return pending;
  };
}
