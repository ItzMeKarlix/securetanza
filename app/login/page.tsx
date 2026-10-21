"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Clock, Lock, Mail, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, ShieldOff, WifiOff } from "lucide-react";
import {
  AUTH_ERROR,
  AUTH_FINE,
  AUTH_ICON,
  AUTH_INPUT,
  AUTH_LABEL,
  AUTH_LINK,
  AUTH_PRIMARY,
  AUTH_SUCCESS,
  AuthShell,
} from "@/components/auth/auth-shell";
import { useAuth } from "@/context/AuthContext";
import { ForceChangePasswordModal } from "@/components/modals/ForceChangePasswordModal";
import { getDefaultRouteForUser } from "@/lib/auth-routes";
import { MfaChallenge, type SignInResult } from "@/components/auth/mfa-challenge";
import { MfaEnroll } from "@/components/auth/mfa-enroll";

type SignedOutReason = "idle" | "expired" | "tab" | "offline";

const SIGNED_OUT_COPY: Record<SignedOutReason, { title: string; message: string; icon: typeof Clock }> = {
  idle: {
    title: "You've been signed out",
    message: "You were inactive for a while, so we signed you out to keep your account secure. Sign in again to continue.",
    icon: Clock,
  },
  expired: {
    title: "Session expired",
    message: "Your session has expired or is no longer valid. Please sign in again.",
    icon: ShieldOff,
  },
  tab: {
    title: "Signed out",
    message: "This account was opened in another tab, which ended your session here. Please sign in again.",
    icon: ShieldOff,
  },
  offline: {
    title: "Signed out",
    message: "This device couldn't reach the server for 12 hours, so we signed you out. Sign in again once you're back online.",
    icon: WifiOff,
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { refreshSession, user, loading: authLoading } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [notice, setNotice] = useState("");
  // Set once the password is accepted and a second step is needed.
  const [mfa, setMfa] = useState<{
    stage: "challenge" | "enroll";
    fullName: string;
    emailFallback: boolean;
    trustDays: number;
  } | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForceChange, setShowForceChange] = useState(false);
  const [signedOutReason, setSignedOutReason] = useState<SignedOutReason | null>(null);

  // Picked up once on mount, then scrubbed from the URL so a refresh of the
  // login page doesn't keep re-showing the same "you were signed out" modal.
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reason = params.get("reason");
    let scrub = false;
    if (reason === "idle" || reason === "expired" || reason === "tab" || reason === "offline") {
      setSignedOutReason(reason);
      params.delete("reason");
      scrub = true;
    }
    // Arriving from the set-password page.
    const done = params.get("done");
    if (done === "invite" || done === "reset") {
      setNotice(
        done === "invite"
          ? "Your password is set. Sign in with your email address."
          : "Your password was reset. Sign in with your new password."
      );
      params.delete("done");
      scrub = true;
    }
    if (scrub) {
      const rest = params.toString();
      window.history.replaceState({}, "", `/login${rest ? `?${rest}` : ""}`);
    }
  }, []);

  // If user is already logged in but needs to change password, show modal
  React.useEffect(() => {
    if (user && user.mustChangePassword) {
      setShowForceChange(true);
    } else if (user && !user.mustChangePassword && !authLoading) {
      sessionStorage.setItem("tabSessionActive", "true");
      const target = getDefaultRouteForUser(user);
      router.push(target);
    }
  }, [user, authLoading, router]);

  /** Runs once a full session exists (trusted browser, or after the second step). */
  const finishSignIn = async (data: SignInResult) => {
    await refreshSession();
    sessionStorage.setItem("tabSessionActive", "true");
    if (data.mustChangePassword) {
      setMfa(null);
      setShowForceChange(true);
      setLoading(false);
    } else {
      router.push(getDefaultRouteForUser(data.user ?? null));
      router.refresh();
    }
  };

  const restartSignIn = (message: string) => {
    setMfa(null);
    setError(message);
    setNotice("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (data.mfa) {
        // Password accepted; the session only starts after the second step.
        setPassword("");
        setMfa({
          stage: data.mfa,
          fullName: data.fullName ?? "",
          emailFallback: Boolean(data.emailFallback),
          trustDays: data.trustDays ?? 30,
        });
        setLoading(false);
        return;
      }

      await finishSignIn(data);
    } catch (error) {
      console.error("Login error:", error);
      setError(
        typeof navigator !== "undefined" && !navigator.onLine
          ? "You're offline. Signing in needs an internet connection."
          : "Couldn't reach the server. Check your connection and try again."
      );
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title={mfa ? undefined : "Sign in"}
      subtitle={mfa ? undefined : "Use the account your system administrator set up for you."}
    >
          {mfa ? (
            mfa.stage === "enroll" ? (
              <MfaEnroll fullName={mfa.fullName} onSuccess={(r) => void finishSignIn(r)} onRestart={restartSignIn} />
            ) : (
              <MfaChallenge
                fullName={mfa.fullName}
                emailFallback={mfa.emailFallback}
                trustDays={mfa.trustDays}
                onSuccess={(r) => void finishSignIn(r)}
                onRestart={restartSignIn}
              />
            )
          ) : (
          <>
          {notice && !error && (
            <div className={`${AUTH_SUCCESS} mb-6`} role="status">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{notice}</p>
            </div>
          )}

          {error && (
            <div className={`${AUTH_ERROR} mb-6`} role="alert">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="identifier" className={AUTH_LABEL}>
                Email
              </label>
              <div className="relative">
                <div className={AUTH_ICON}>
                  <Mail className="h-[1.125rem] w-[1.125rem]" />
                </div>
                {/* type="text" (not "email") during the transition, so an older
                    account's ACC- number is still accepted. */}
                <input
                  id="identifier"
                  type="text"
                  inputMode="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={`${AUTH_INPUT} pl-10`}
                  placeholder="name@example.gov.ph"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading}
                  aria-describedby="identifier-hint"
                />
              </div>
              <p id="identifier-hint" className={AUTH_FINE}>
                No email on your account yet? Use your account number (ACC-…).
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className={AUTH_LABEL}>
                  Password
                </label>
                {/* Phones give links a 44px tap height; the negative margin keeps that
                    target without pushing the field down. */}
                <Link href="/forgot-password" className={`-my-3 inline-flex items-center text-sm ${AUTH_LINK}`}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className={AUTH_ICON}>
                  <Lock className="h-[1.125rem] w-[1.125rem]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${AUTH_INPUT} pl-10 pr-12`}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute inset-y-0 right-0 flex cursor-pointer items-center rounded-r-lg px-3.5 text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600 dark:text-slate-400 dark:hover:text-white"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-[1.125rem] w-[1.125rem]" /> : <Eye className="h-[1.125rem] w-[1.125rem]" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className={AUTH_PRIMARY}>
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
          </>
          )}

      {signedOutReason && (() => {
        const { title, message, icon: Icon } = SIGNED_OUT_COPY[signedOutReason];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 dark:bg-black/60"
            onClick={() => setSignedOutReason(null)}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="signed-out-title"
              className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/20 dark:border-white/10 dark:bg-slate-900 dark:shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400">
                <Icon className="h-5 w-5" />
              </div>
              <h2 id="signed-out-title" className="mt-4 font-heading text-lg font-bold text-slate-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{message}</p>
              <button type="button" onClick={() => setSignedOutReason(null)} autoFocus className={`${AUTH_PRIMARY} mt-6 h-11`}>
                Got it
              </button>
            </div>
          </div>
        );
      })()}

      {showForceChange && (
        <ForceChangePasswordModal
          onSuccess={() => {
            setShowForceChange(false);
            sessionStorage.setItem("tabSessionActive", "true");
            const target = getDefaultRouteForUser(user);
            router.push(target);
            router.refresh();
          }}
        />
      )}
    </AuthShell>
  );
}
