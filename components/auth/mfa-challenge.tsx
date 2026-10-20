"use client";

import { useState } from "react";
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeInput } from "./code-input";

type Mode = "totp" | "backup" | "email";

export interface SignInResult {
	mustChangePassword?: boolean;
	user?: { permissions: string[]; defaultLandingPage?: string };
}

/**
 * Second step of sign-in: code from the authenticator app, with backup-code
 * and emailed-code fallbacks, plus the opt-in "trust this browser".
 */
export function MfaChallenge({
	fullName,
	emailFallback,
	trustDays,
	onSuccess,
	onRestart,
}: {
	fullName: string;
	emailFallback: boolean;
	trustDays: number;
	onSuccess: (result: SignInResult) => void;
	onRestart: (message: string) => void;
}) {
	const [mode, setMode] = useState<Mode>("totp");
	const [code, setCode] = useState("");
	const [trust, setTrust] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const [emailNote, setEmailNote] = useState("");

	const submit = async (value = code) => {
		if (busy) return;
		setBusy(true);
		setError("");
		try {
			const res = await fetch("/api/auth/mfa/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ method: mode, code: value, trustDevice: trust }),
			});
			const data = await res.json().catch(() => ({}));
			if (res.ok) return onSuccess(data);
			if (data.restart || data.locked) return onRestart(data.error || "Please sign in again.");
			setError(data.error || "That code isn't right.");
			setCode("");
		} catch {
			setError("Couldn't reach the server. Check your connection and try again.");
		} finally {
			setBusy(false);
		}
	};

	const sendEmail = async () => {
		setBusy(true);
		setError("");
		setEmailNote("");
		try {
			const res = await fetch("/api/auth/mfa/email", { method: "POST" });
			const data = await res.json().catch(() => ({}));
			if (res.ok) {
				setMode("email");
				setCode("");
				setEmailNote(`We sent a 6-digit code to ${data.sentTo}. It expires in 10 minutes.`);
			} else if (data.restart) {
				onRestart(data.error);
			} else {
				setError(data.error || "Couldn't send the code.");
			}
		} catch {
			setError("Couldn't reach the server. Check your connection and try again.");
		} finally {
			setBusy(false);
		}
	};

	const switchTo = (next: Mode) => {
		setMode(next);
		setCode("");
		setError("");
		setEmailNote("");
	};

	const heading =
		mode === "backup" ? "Use a backup code" : mode === "email" ? "Check your email" : "Two-step verification";
	const intro =
		mode === "backup"
			? "Enter one of the backup codes you saved when you set up two-step verification. Each code works once."
			: mode === "email"
			? emailNote
			: "Open your authenticator app and enter the 6-digit code for Secure Tanza.";

	return (
		<div className="space-y-6">
			<div>
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0EA5E9]/10">
					{mode === "backup" ? (
						<KeyRound className="h-6 w-6 text-[#38BDF8]" />
					) : mode === "email" ? (
						<Mail className="h-6 w-6 text-[#38BDF8]" />
					) : (
						<Smartphone className="h-6 w-6 text-[#38BDF8]" />
					)}
				</div>
				<h2 className="text-xl font-semibold text-white">{heading}</h2>
				<p className="mt-1.5 text-sm leading-relaxed text-slate-400">
					{mode === "totp" && <>Hi {fullName.split(" ")[0]}. </>}
					{intro}
				</p>
			</div>

			{error && (
				<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
					<AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
					<p className="text-sm text-red-400">{error}</p>
				</div>
			)}

			<form
				onSubmit={(e) => {
					e.preventDefault();
					void submit();
				}}
				className="space-y-5"
			>
				{mode === "backup" ? (
					<input
						aria-label="Backup code"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder="XXXX-XXXX"
						autoComplete="off"
						autoCapitalize="characters"
						spellCheck={false}
						autoFocus
						disabled={busy}
						className="block w-full h-14 rounded-xl border border-slate-700 bg-slate-800/50 text-center font-mono text-xl tracking-[0.25em] uppercase text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
					/>
				) : (
					<CodeInput value={code} onChange={setCode} onComplete={(c) => void submit(c)} disabled={busy} />
				)}

				<label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-300">
					<input
						type="checkbox"
						checked={trust}
						onChange={(e) => setTrust(e.target.checked)}
						className="mt-0.5 h-4 w-4 accent-[#0EA5E9]"
					/>
					<span>
						Trust this browser for {trustDays} days
						<span className="block text-xs text-slate-500">
							Only on a device you alone use — never on a shared station PC. You&apos;ll still enter your password.
						</span>
					</span>
				</label>

				<Button
					type="submit"
					disabled={busy || (mode === "backup" ? code.replace(/[^0-9a-z]/gi, "").length !== 8 : code.length !== 6)}
					className="w-full h-12 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold rounded-lg disabled:opacity-50"
				>
					{busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
				</Button>
			</form>

			<div className="space-y-2 border-t border-white/10 pt-5 text-sm">
				<p className="text-xs font-medium uppercase tracking-wider text-slate-500">Can&apos;t use your app?</p>
				{mode !== "totp" && (
					<button type="button" onClick={() => switchTo("totp")} className="block font-medium text-[#38BDF8] hover:text-[#7DD3FC]">
						Use my authenticator app
					</button>
				)}
				{mode !== "backup" && (
					<button type="button" onClick={() => switchTo("backup")} className="block font-medium text-[#38BDF8] hover:text-[#7DD3FC]">
						Use a backup code
					</button>
				)}
				{emailFallback && (
					<button
						type="button"
						disabled={busy}
						onClick={() => void sendEmail()}
						className="block font-medium text-[#38BDF8] hover:text-[#7DD3FC] disabled:opacity-50"
					>
						{mode === "email" ? "Send a new code" : "Email me a code instead"}
					</button>
				)}
				<p className="pt-1 text-xs leading-relaxed text-slate-500">
					Lost your phone and your backup codes? Ask your system administrator to reset two-step verification.
				</p>
			</div>

			<button
				type="button"
				onClick={() => onRestart("")}
				className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
			>
				<ArrowLeft className="h-4 w-4" /> Back to sign in
			</button>
		</div>
	);
}
