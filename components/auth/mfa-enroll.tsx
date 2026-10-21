"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, ArrowLeft, Check, Copy, Loader2, ShieldCheck } from "lucide-react";
import {
	AUTH_BADGE,
	AUTH_ERROR,
	AUTH_LINK,
	AUTH_PRIMARY,
	AUTH_QUIET_LINK,
	AUTH_SECONDARY,
	AUTH_SUBTITLE,
	AUTH_TITLE,
} from "./auth-shell";
import { CodeInput } from "./code-input";
import { BackupCodesPanel } from "./backup-codes-panel";
import type { SignInResult } from "./mfa-challenge";

type Step = "intro" | "scan" | "codes";

/**
 * First-time setup of two-step verification during sign-in:
 * get an app → scan / type the key → confirm a code → save backup codes.
 */
export function MfaEnroll({
	fullName,
	onSuccess,
	onRestart,
}: {
	fullName: string;
	onSuccess: (result: SignInResult) => void;
	onRestart: (message: string) => void;
}) {
	const [step, setStep] = useState<Step>("intro");
	const [setup, setSetup] = useState<{ qrDataUrl: string; manualKey: string; account: string } | null>(null);
	const [code, setCode] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [copied, setCopied] = useState(false);
	const [result, setResult] = useState<(SignInResult & { backupCodes: string[] }) | null>(null);

	const start = async () => {
		setBusy(true);
		setError("");
		try {
			const res = await fetch("/api/auth/mfa/enroll/start", { method: "POST" });
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				if (data.restart || data.locked) return onRestart(data.error || "Please sign in again.");
				setError(data.error || "Couldn't start setup.");
				return;
			}
			setSetup(data);
			setStep("scan");
		} catch {
			setError("Couldn't reach the server. Check your connection and try again.");
		} finally {
			setBusy(false);
		}
	};

	const confirm = async (value = code) => {
		if (busy) return;
		setBusy(true);
		setError("");
		try {
			const res = await fetch("/api/auth/mfa/enroll/confirm", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: value }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				if (data.restart || data.locked) return onRestart(data.error || "Please sign in again.");
				if (data.expired) {
					setStep("intro");
					setSetup(null);
				}
				setError(data.error || "That code doesn't match.");
				setCode("");
				return;
			}
			// The session exists now; show the backup codes before entering the app.
			setResult(data);
			setStep("codes");
		} catch {
			setError("Couldn't reach the server. Check your connection and try again.");
		} finally {
			setBusy(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<div className={AUTH_BADGE}>
					<ShieldCheck className="h-5 w-5" />
				</div>
				<h1 className={AUTH_TITLE}>
					{step === "intro" ? "Set up two-step verification" : step === "scan" ? "Connect your app" : "Save your backup codes"}
				</h1>
				<p className="mt-1.5 text-sm font-medium text-sky-700 dark:text-sky-400">
					Step {step === "intro" ? 1 : step === "scan" ? 2 : 3} of 3
				</p>
				{step === "intro" && (
					<p className={AUTH_SUBTITLE}>
						Hi {fullName.split(" ")[0]}. Every Secure Tanza account now needs a second step at sign-in, so a
						stolen password alone can&apos;t get into case data. It takes about a minute.
					</p>
				)}
			</div>

			{error && (
				<div className={AUTH_ERROR} role="alert">
					<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
					<p>{error}</p>
				</div>
			)}

			{step === "intro" && (
				<>
					<div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed dark:border-white/10 dark:bg-slate-950/40">
						<p className="font-medium text-slate-950 dark:text-white">Install an authenticator app on your phone</p>
						<p className="mt-1 text-slate-600 dark:text-slate-400">
							Google Authenticator, Microsoft Authenticator or Authy — free on the App Store and Google Play. If
							you already have one, use it.
						</p>
					</div>
					<button type="button" onClick={() => void start()} disabled={busy} className={AUTH_PRIMARY}>
						{busy ? <Loader2 className="h-5 w-5 animate-spin" aria-label="Starting setup" /> : "I have an authenticator app"}
					</button>
				</>
			)}

			{step === "scan" && setup && (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						void confirm();
					}}
					className="space-y-5"
				>
					<ol className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
						<li>
							<span className="font-medium text-slate-950 dark:text-white">1. In the app, add an account and scan this code.</span>
							<div className="mt-3 flex justify-center">
								<div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-transparent">
									<Image src={setup.qrDataUrl} alt="QR code for your authenticator app" width={180} height={180} unoptimized />
								</div>
							</div>
							<details className="mt-3 text-slate-600 dark:text-slate-400">
								<summary className={`text-xs ${AUTH_LINK}`}>Can&apos;t scan? Enter the key instead</summary>
								<div className="mt-2 flex items-center gap-2">
									<code className="flex-1 break-all rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs tracking-wider text-slate-950 dark:border-white/10 dark:bg-slate-950/50 dark:text-white">
										{setup.manualKey}
									</code>
									<button
										type="button"
										aria-label={copied ? "Key copied" : "Copy key"}
										onClick={async () => {
											await navigator.clipboard.writeText(setup.manualKey.replace(/ /g, ""));
											setCopied(true);
											setTimeout(() => setCopied(false), 2000);
										}}
										className={`${AUTH_SECONDARY} h-9 w-9 shrink-0 px-0`}
									>
										{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
									</button>
								</div>
								<p className="mt-1.5 text-xs">Account: {setup.account} · Time-based · 6 digits</p>
							</details>
						</li>
						<li>
							<span className="font-medium text-slate-950 dark:text-white">2. Enter the 6-digit code the app shows.</span>
						</li>
					</ol>
					<CodeInput value={code} onChange={setCode} onComplete={(c) => void confirm(c)} disabled={busy} autoFocus={false} />
					<button type="submit" disabled={busy || code.length !== 6} className={AUTH_PRIMARY}>
						{busy ? (
							<>
								<Loader2 className="h-5 w-5 animate-spin" />
								Verifying…
							</>
						) : (
							"Verify & turn on"
						)}
					</button>
				</form>
			)}

			{step === "codes" && result && (
				<BackupCodesPanel codes={result.backupCodes} onContinue={() => onSuccess(result)} continueLabel="Continue to Secure Tanza" />
			)}

			{step !== "codes" && (
				<button type="button" onClick={() => onRestart("")} className={`${AUTH_QUIET_LINK} w-full`}>
					<ArrowLeft className="h-4 w-4" /> Back to sign in
				</button>
			)}
		</div>
	);
}
