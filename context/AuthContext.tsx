"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { IdleSessionTimer, idleTimeoutMs, isIdleProtectedPath, isPublicPage, onceAsync } from "@/lib/idle-session";
import { IdleLogoutWarning } from "@/components/layout/idle-logout-warning";
import { toast } from "sonner";
import { reportServerReachable } from "@/lib/offline/status";
import {
  OFFLINE_SESSION_GRACE_MS,
  clearOfflineData,
  loadOfflineSession,
  rememberVerifiedUser,
} from "@/lib/offline/session-snapshot";

const SESSION_CHECK_TIMEOUT_MS = 10_000;
const RETRY_MIN_MS = 2_000;
const RETRY_MAX_MS = 30_000;
const CONNECTION_TOAST_ID = "session-connection";
/** Sign-out shouldn't hang on a stuck IndexedDB; the copies are wiped next sign-in. */
const CLEAR_OFFLINE_TIMEOUT_MS = 2_000;

function clearOfflineDataQuickly() {
  return Promise.race([
    clearOfflineData().catch(() => {}),
    new Promise<void>((resolve) => window.setTimeout(resolve, CLEAR_OFFLINE_TIMEOUT_MS)),
  ]);
}

interface User {
  id: number;
  accountNumber: string;
  email?: string | null;
  fullName: string;
  permissions: string[];
  mustChangePassword?: boolean;
  defaultLandingPage?: string;
  autoLogoutTimer?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loggingOut: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<unknown>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);
  const [idleRemainingSeconds, setIdleRemainingSeconds] = useState<number | null>(null);
  const loggingOutRef = useRef(false);
  const idleTimerRef = useRef<IdleSessionTimer | null>(null);
  const protectedView = isIdleProtectedPath(pathname);
  const authenticatedUserId = user?.id;
  const timeoutMs = idleTimeoutMs(user?.autoLogoutTimer);

  // All logout triggers share one terminal request. In-flight session checks cannot
  // restore the user after logout begins.
  const logoutForReason = useMemo(() => onceAsync(async (reason?: "idle" | "tab" | "offline") => {
    loggingOutRef.current = true;
    setLoggingOut(true);
    idleTimerRef.current?.dispose();
    // Saved data and pages go with the session, even if the server can't hear
    // about the sign-out right now.
    await clearOfflineDataQuickly();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      window.location.replace(reason ? `/login?reason=${reason}` : "/login");
    }
  }), []);

  const logout = useCallback(() => logoutForReason(), [logoutForReason]);
  const staySignedIn = useCallback(() => {
    if (!loggingOutRef.current) idleTimerRef.current?.activity();
  }, []);

  // Track if user was ever loaded in this browser session
  const userRef = useRef<User | null>(null);
  userRef.current = user;
  /** When the server last confirmed this session (ms), or null if it never has here. */
  const verifiedAtRef = useRef<number | null>(null);

  // Connection trouble is not a sign-out. While the server can't confirm the
  // session (offline, 5xx, timeout) we keep the current user, tell them we're
  // reconnecting, and retry with backoff. Only an explicit "authenticated:
  // false" from the server ends the session on this side.
  const retryTimerRef = useRef<number | null>(null);
  const retryDelayRef = useRef(RETRY_MIN_MS);
  const connectionLostRef = useRef(false);
  const checkSessionRef = useRef<() => Promise<User | null>>(async () => null);

  const markConnectionLost = useCallback(() => {
    if (!connectionLostRef.current) {
      // The offline banner says so from here on.
      connectionLostRef.current = true;
      reportServerReachable(false);
    }
    if (retryTimerRef.current !== null) return;
    const delay = retryDelayRef.current;
    retryDelayRef.current = Math.min(delay * 2, RETRY_MAX_MS);
    retryTimerRef.current = window.setTimeout(() => {
      retryTimerRef.current = null;
      void checkSessionRef.current();
    }, delay);
  }, []);

  const markConnectionOk = useCallback(() => {
    retryDelayRef.current = RETRY_MIN_MS;
    if (retryTimerRef.current !== null) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (connectionLostRef.current) {
      connectionLostRef.current = false;
      reportServerReachable(true);
      toast.success("Reconnected", { id: CONNECTION_TOAST_ID, description: undefined, duration: 2500 });
    }
  }, []);

  // The server can't be asked. Someone already signed in here keeps going from
  // the last confirmed snapshot, but only for OFFLINE_SESSION_GRACE_MS after
  // the server last confirmed them. Signing in afresh always needs the server.
  const continueOffline = useCallback(async (): Promise<User | null> => {
    markConnectionLost();
    if (loggingOutRef.current) return null;
    if (!userRef.current) {
      const saved = await loadOfflineSession<User>().catch(() => null);
      if (saved && !loggingOutRef.current && !userRef.current) {
        verifiedAtRef.current = saved.verifiedAt;
        userRef.current = saved.user;
        setUser(saved.user);
        setLoading(false);
      }
    } else if (verifiedAtRef.current !== null && Date.now() - verifiedAtRef.current > OFFLINE_SESSION_GRACE_MS) {
      void logoutForReason("offline");
      return null;
    }
    return userRef.current;
  }, [markConnectionLost, logoutForReason]);

  const checkSession = useCallback(async (): Promise<User | null> => {
    if (loggingOutRef.current) return null;

    let response: Response;
    let data: { authenticated?: boolean | null; reason?: string; user?: User } = {};
    try {
      response = await fetch("/api/auth/session", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
        signal: AbortSignal.timeout(SESSION_CHECK_TIMEOUT_MS),
      });
      data = await response.json().catch(() => ({}));
    } catch {
      // Offline, DNS failure, timeout… the session itself is unknown, not invalid.
      return continueOffline();
    }

    if (loggingOutRef.current) return null;

    // Server couldn't decide (503 from a database blip, 502 from a proxy, …).
    if (!response.ok || data.authenticated == null) {
      return continueOffline();
    }

    markConnectionOk();
    setLoading(false);

    if (data.authenticated && data.user && Array.isArray(data.user.permissions) && data.user.permissions.length > 0) {
      verifiedAtRef.current = Date.now();
      setUser(data.user);
      void rememberVerifiedUser(data.user).catch(() => {});
      return data.user;
    }

    // Definitively signed out (expired, revoked, password changed elsewhere, or never signed in).
    const hadPriorSession = userRef.current !== null;
    verifiedAtRef.current = null;
    setUser(null);
    await clearOfflineDataQuickly();
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!isPublicPage(currentPath) && (hadPriorSession || isIdleProtectedPath(currentPath))) {
        // Only call it an expiry when there actually was a session.
        const expired = hadPriorSession || data.reason === "invalid";
        window.location.replace(expired ? "/login?reason=expired" : "/login");
      }
    }
    return null;
  }, [continueOffline, markConnectionOk]);

  useEffect(() => {
    checkSessionRef.current = checkSession;
  }, [checkSession]);

  // Back online: check straight away instead of waiting for the next retry.
  useEffect(() => {
    const onOnline = () => {
      if (connectionLostRef.current) {
        if (retryTimerRef.current !== null) {
          window.clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
        void checkSessionRef.current();
      }
    };
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener("online", onOnline);
      if (retryTimerRef.current !== null) window.clearTimeout(retryTimerRef.current);
    };
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Check session on window focus and visibility change only when authenticated and not on login page
  useEffect(() => {
    if (isPublicPage(pathname)) return;

    const handleFocus = () => {
      if (userRef.current !== null) {
        checkSession();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userRef.current !== null) {
        checkSession();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSession, pathname]);

  // Heartbeat check ONLY when user is logged in and not on login page
  useEffect(() => {
    if (authenticatedUserId === undefined || isPublicPage(pathname)) {
      return;
    }

    // Heartbeat check every 30 seconds to detect revoked permissions
    const interval = setInterval(() => {
      checkSession();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [authenticatedUserId, pathname, checkSession]);

  // Track input independently of session refreshes and route changes within the
  // protected app. Only warning state updates once a second.
  useEffect(() => {
    if (authenticatedUserId === undefined || !protectedView || loggingOutRef.current) return;
    const timer = new IdleSessionTimer({
      now: Date.now,
      schedule: (callback, delay) => window.setTimeout(callback, delay),
      cancel: (handle) => window.clearTimeout(handle as number),
      onWarning: setIdleRemainingSeconds,
      onExpire: () => { void logoutForReason("idle"); },
    });
    idleTimerRef.current = timer;
    // A separate effect applies the preference without resetting last activity.
    const updateActivity = (event: Event) => {
      // Keep the warning's actions available while pointing at or navigating them.
      // The Stay signed in action records activity explicitly.
      if (event.target instanceof Element && event.target.closest("[data-idle-logout-warning]")) return;
      if (!loggingOutRef.current) timer.activity();
    };
    const checkVisibility = () => {
      if (document.visibilityState === "visible") timer.check();
    };
    // Capture phase: `scroll` doesn't bubble, and this app scrolls inside inner
    // panels, so a bubbling listener never saw someone reading with the wheel.
    // `wheel` covers a mouse that isn't moving; `pointerdown` covers pen/touch.
    const events = ["mousemove", "keydown", "scroll", "wheel", "click", "pointerdown", "touchstart"];
    const listenerOptions = { passive: true, capture: true } as const;
    events.forEach((event) => window.addEventListener(event, updateActivity, listenerOptions));
    window.addEventListener("focus", timer.check);
    document.addEventListener("visibilitychange", checkVisibility);

    return () => {
      timer.dispose();
      idleTimerRef.current = null;
      events.forEach((event) => window.removeEventListener(event, updateActivity, listenerOptions));
      window.removeEventListener("focus", timer.check);
      document.removeEventListener("visibilitychange", checkVisibility);
    };
  }, [authenticatedUserId, protectedView, logoutForReason]);

  useEffect(() => {
    idleTimerRef.current?.configure(timeoutMs);
  }, [timeoutMs, authenticatedUserId, protectedView]);

  // Tab-Session Enforcer (Logout on tab close / new tab isolation)
  useEffect(() => {
    if (authenticatedUserId !== undefined && typeof window !== "undefined" && !isPublicPage(window.location.pathname)) {
      const hasTabSession = sessionStorage.getItem("tabSessionActive");

      if (!hasTabSession) {
        // This is a new tab or the session was lost (tab closed previously).
        // We explicitly log out to destroy the persistent cookie session.
        void logoutForReason("tab");
      }
    }
  }, [authenticatedUserId, logoutForReason]);

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission) || user.permissions.includes("admin");
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    if (user.permissions.includes("admin")) return true;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const isAdmin = (): boolean => {
    return hasPermission("admin") || hasPermission("admin_operational_officer");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loggingOut,
        logout,
        refreshSession: checkSession,
        hasPermission,
        hasAnyPermission,
        isAdmin,
      }}
    >
      {children}
      {protectedView && authenticatedUserId !== undefined && (
        <IdleLogoutWarning
          remainingSeconds={idleRemainingSeconds}
          loggingOut={loggingOut}
          onStaySignedIn={staySignedIn}
          onLogout={logout}
        />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
