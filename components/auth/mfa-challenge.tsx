"use client";

import { useState } from "react";
import { AlertCircle, ArrowLeft, KeyRound, Loader2, Mail, Smartphone } from "lucide-react";
import {
	AUTH_BADGE,
	AUTH_CHECKBOX,
	AUTH_ERROR,
	AUTH_FINE,
	AUTH_INPUT,
	AUTH_LINK,
	AUTH_PRIMARY,
	AUTH_QUIET_LINK,
	AUTH_SUBTITLE,
	AUTH_TITLE,
} from "./auth-shell";
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
				<div className={AUTH_BADGE}>
					{mode === "backup" ? (
						<KeyRound className="h-5 w-5" />
					) : mode === "email" ? (
						<Mail className="h-5 w-5" />
					) : (
						<Smartphone className="h-5 w-5" />
					)}
				</div>
				<h1 className={AUTH_TITLE}>{heading}</h1>
				<p className={AUTH_SUBTITLE}>
					{mode === "totp" && <>Hi {fullName.split(" ")[0]}. </>}
					{intro}
				</p>
			</div>

			{error && (
				<div className={AUTH_ERROR} role="alert">
					<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
					<p>{error}</p>
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
						className={`${AUTH_INPUT} h-14 text-center font-mono text-xl tracking-[0.25em] uppercase`}
					/>
				) : (
					<CodeInput value={code} onChange={setCode} onComplete={(c) => void submit(c)} disabled={busy} />
				)}

				<label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
					<input type="checkbox" checked={trust} onChange={(e) => setTrust(e.target.checked)} className={AUTH_CHECKBOX} />
					<span>
						Trust this browser for {trustDays} days
						<span className={`block ${AUTH_FINE}`}>
							Only on a device you alone use — never on a shared station PC. You&apos;ll still enter your password.
						</span>
					</span>
				</label>

				<button
					type="submit"
					disabled={busy || (mode === "backup" ? code.replace(/[^0-9a-z]/gi, "").length !== 8 : code.length !== 6)}
					className={AUTH_PRIMARY}
				>
					{busy ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin" />
							Verifying…
						</>
					) : (
						"Verify"
					)}
				</button>
			</form>

			<div className="space-y-2.5 border-t border-slate-200 pt-5 text-sm dark:border-white/10">
				<p className="font-medium text-slate-950 dark:text-white">Can&apos;t use your app?</p>
				{mode !== "totp" && (
					<button type="button" onClick={() => switchTo("totp")} className={`block ${AUTH_LINK}`}>
						Use my authenticator app
					</button>
				)}
				{mode !== "backup" && (
					<button type="button" onClick={() => switchTo("backup")} className={`block ${AUTH_LINK}`}>
						Use a backup code
					</button>
				)}
				{emailFallback && (
					<button type="button" disabled={busy} onClick={() => void sendEmail()} className={`block ${AUTH_LINK}`}>
						{mode === "email" ? "Send a new code" : "Email me a code instead"}
					</button>
				)}
				<p className={`pt-1 ${AUTH_FINE}`}>
					Lost your phone and your backup codes? Ask your system administrator to reset two-step verification.
				</p>
			</div>

			<button type="button" onClick={() => onRestart("")} className={`${AUTH_QUIET_LINK} w-full`}>
				<ArrowLeft className="h-4 w-4" /> Back to sign in
			</button>
		</div>
	);
}
