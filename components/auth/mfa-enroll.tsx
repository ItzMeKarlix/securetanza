"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, ArrowLeft, Check, Copy, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0EA5E9]/10">
					<ShieldCheck className="h-6 w-6 text-[#38BDF8]" />
				</div>
				<p className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
					Step {step === "intro" ? 1 : step === "scan" ? 2 : 3} of 3
				</p>
				<h2 className="mt-1 text-xl font-semibold text-white">
					{step === "intro" ? "Set up two-step verification" : step === "scan" ? "Connect your app" : "Save your backup codes"}
				</h2>
				{step === "intro" && (
					<p className="mt-1.5 text-sm leading-relaxed text-slate-400">
						Hi {fullName.split(" ")[0]}. Every Secure Tanza account now needs a second step at sign-in, so a
						stolen password alone can&apos;t get into case data. It takes about a minute.
					</p>
				)}
			</div>

			{error && (
				<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
					<AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
					<p className="text-sm text-red-400">{error}</p>
				</div>
			)}

			{step === "intro" && (
				<>
					<div className="rounded-xl border border-white/10 bg-slate-950/40 p-4 text-sm text-slate-300 leading-relaxed">
						<p className="font-medium text-white">Install an authenticator app on your phone</p>
						<p className="mt-1 text-slate-400">
							Google Authenticator, Microsoft Authenticator or Authy — free on the App Store and Google Play. If
							you already have one, use it.
						</p>
					</div>
					<Button
						type="button"
						onClick={() => void start()}
						disabled={busy}
						className="w-full h-12 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold rounded-lg"
					>
						{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "I have an authenticator app"}
					</Button>
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
					<ol className="space-y-4 text-sm text-slate-300">
						<li>
							<span className="font-medium text-white">1. In the app, add an account and scan this code.</span>
							<div className="mt-3 flex justify-center">
								<div className="rounded-xl bg-white p-3">
									<Image src={setup.qrDataUrl} alt="QR code for your authenticator app" width={180} height={180} unoptimized />
								</div>
							</div>
							<details className="mt-3 text-slate-400">
								<summary className="cursor-pointer text-xs font-medium text-[#38BDF8] hover:text-[#7DD3FC]">
									Can&apos;t scan? Enter the key instead
								</summary>
								<div className="mt-2 flex items-center gap-2">
									<code className="flex-1 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 font-mono text-xs tracking-wider text-white break-all">
										{setup.manualKey}
									</code>
									<button
										type="button"
										aria-label="Copy key"
										onClick={async () => {
											await navigator.clipboard.writeText(setup.manualKey.replace(/ /g, ""));
											setCopied(true);
											setTimeout(() => setCopied(false), 2000);
										}}
										className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:text-white"
									>
										{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
									</button>
								</div>
								<p className="mt-1.5 text-xs">Account: {setup.account} · Time-based · 6 digits</p>
							</details>
						</li>
						<li>
							<span className="font-medium text-white">2. Enter the 6-digit code the app shows.</span>
						</li>
					</ol>
					<CodeInput value={code} onChange={setCode} onComplete={(c) => void confirm(c)} disabled={busy} autoFocus={false} />
					<Button
						type="submit"
						disabled={busy || code.length !== 6}
						className="w-full h-12 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold rounded-lg disabled:opacity-50"
					>
						{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & turn on"}
					</Button>
				</form>
			)}

			{step === "codes" && result && (
				<BackupCodesPanel codes={result.backupCodes} onContinue={() => onSuccess(result)} continueLabel="Continue to Secure Tanza" />
			)}

			{step !== "codes" && (
				<button
					type="button"
					onClick={() => onRestart("")}
					className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
				>
					<ArrowLeft className="h-4 w-4" /> Back to sign in
				</button>
			)}
		</div>
	);
}
