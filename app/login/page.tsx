"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, Lock, Mail, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff, ShieldOff, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="h-screen overflow-y-auto flex bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-4 py-8">
      {/* The body never scrolls in this app, so this page scrolls itself; my-auto on the card
          centres it when it fits and lets it scroll from the top when it does not. */}
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md mx-auto my-auto">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          {/* Logo and Title */}
          <div className={mfa ? "text-center mb-4" : "text-center mb-8"}>
            <div className={mfa ? "hidden" : "flex justify-center mb-4"}>
              <div className="w-20 h-20 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center">
                <Image
                  src="/SC LOGO W 1.png"
                  alt="SecureTanza Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h1 className={mfa ? "text-xl font-bold text-white" : "text-3xl font-bold text-white mb-2"}>
              SecureTanza
            </h1>
            <p className={mfa ? "hidden" : "text-slate-400 text-sm"}>
              Crime Mapping & Analytics System
            </p>
          </div>

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
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm text-emerald-300">{notice}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                {/* type="text" (not "email") during the transition, so an older
                    account's ACC- number is still accepted. */}
                <input
                  id="identifier"
                  type="text"
                  inputMode="email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                  placeholder="name@example.gov.ph"
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  disabled={loading}
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">
                No email on your account yet? Use your account number (ACC-…).
              </p>
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#38BDF8] hover:text-[#7DD3FC] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          </>
          )}

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-slate-500">
              Tanza Municipal Police Station
            </p>
            <p className="text-center text-xs text-slate-600 mt-1">
              Authorized personnel only
            </p>
          </div>
        </div>

        {/* Version Info */}
        <p className="text-center text-xs text-slate-600 mt-4">
          SecureTanza v1.0.0 • © 2026
        </p>
      </div>

      {signedOutReason && (() => {
        const { title, message, icon: Icon } = SIGNED_OUT_COPY[signedOutReason];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSignedOutReason(null)}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="signed-out-title"
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Icon className="h-6 w-6 text-amber-400" />
              </div>
              <h2 id="signed-out-title" className="mt-4 text-lg font-bold text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{message}</p>
              <Button
                onClick={() => setSignedOutReason(null)}
                autoFocus
                className="mt-6 w-full h-11 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold rounded-lg"
              >
                Got it
              </Button>
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
    </div>
  );
}
