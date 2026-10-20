"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { IdleSessionTimer, idleTimeoutMs, isIdleProtectedPath, onceAsync } from "@/lib/idle-session";
import { IdleLogoutWarning } from "@/components/layout/idle-logout-warning";

interface User {
  id: number;
  accountNumber: string;
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
  refreshSession: () => Promise<void>;
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
  const logoutForReason = useMemo(() => onceAsync(async (reason?: "idle" | "tab") => {
    loggingOutRef.current = true;
    setLoggingOut(true);
    idleTimerRef.current?.dispose();
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

  const checkSession = useCallback(async () => {
    if (loggingOutRef.current) return null;
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (loggingOutRef.current) return null;
        if (data.success && data.user && Array.isArray(data.user.permissions) && data.user.permissions.length > 0) {
          setUser(data.user);
          return data.user;
        }
      }

      // If user session is invalid, account was deleted, or all permissions were revoked
      if (loggingOutRef.current) return null;
      const hadPriorSession = userRef.current !== null;
      setUser(null);

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;
        // If user was logged in previously OR is currently on any protected page:
        if (hadPriorSession || isIdleProtectedPath(currentPath)) {
          if (currentPath !== "/login") {
            console.warn("🔒 User access revoked or account removed. Automatically redirecting to auth page...");
            window.location.replace("/login?reason=expired");
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Session check error:", error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial check on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Check session on window focus and visibility change only when authenticated and not on login page
  useEffect(() => {
    if (pathname === "/login") return;

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
    if (authenticatedUserId === undefined || pathname === "/login") {
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
    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    events.forEach((event) => window.addEventListener(event, updateActivity, { passive: true }));
    window.addEventListener("focus", timer.check);
    document.addEventListener("visibilitychange", checkVisibility);

    return () => {
      timer.dispose();
      idleTimerRef.current = null;
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      window.removeEventListener("focus", timer.check);
      document.removeEventListener("visibilitychange", checkVisibility);
    };
  }, [authenticatedUserId, protectedView, logoutForReason]);

  useEffect(() => {
    idleTimerRef.current?.configure(timeoutMs);
  }, [timeoutMs, authenticatedUserId, protectedView]);

  // Tab-Session Enforcer (Logout on tab close / new tab isolation)
  useEffect(() => {
    if (authenticatedUserId !== undefined && typeof window !== "undefined" && window.location.pathname !== "/login") {
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
