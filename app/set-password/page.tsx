"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { AUTH_ERROR, AUTH_FINE, AUTH_PRIMARY, AUTH_QUIET_LINK, AuthShell } from "@/components/auth/auth-shell";
import { PasswordFields } from "@/components/auth/password-fields";
import { usePasswordCheck } from "@/hooks/usePasswordCheck";
import { passwordUserInputs } from "@/lib/password-policy";

type TokenInfo =
	| { state: "loading" }
	| { state: "invalid"; problem: "invalid" | "used" | "expired" | "locked" }
	| { state: "ready"; purpose: "invite" | "reset"; fullName: string; email: string | null };

const PROBLEM_COPY = {
	invalid: { title: "Link not valid", body: "This link is incomplete or was replaced by a newer one." },
	used: { title: "Link already used", body: "This link has already been used to set a password." },
	expired: { title: "Link expired", body: "For your security, these links only work for a limited time." },
	locked: { title: "Account locked", body: "This account is locked. Ask your system administrator to unlock it." },
} as const;

export default function SetPasswordPage() {
	return (
		<Suspense fallback={<AuthShell title="Set your password"><Spinner /></AuthShell>}>
			<SetPassword />
		</Suspense>
	);
}

function SetPassword() {
	const router = useRouter();
	const token = useSearchParams().get("token") ?? "";
	const [info, setInfo] = useState<TokenInfo>({ state: "loading" });
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch(`/api/auth/token?token=${encodeURIComponent(token)}`);
				const data = await res.json();
				if (cancelled) return;
				if (!res.ok) {
					setError(data.error || "Couldn't check this link. Try again in a moment.");
					setInfo({ state: "invalid", problem: "invalid" });
				} else if (!data.valid) {
					setInfo({ state: "invalid", problem: data.problem ?? "invalid" });
				} else {
					setInfo({ state: "ready", purpose: data.purpose, fullName: data.fullName, email: data.email });
				}
			} catch {
				if (!cancelled) setInfo({ state: "invalid", problem: "invalid" });
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [token]);

	const inputs = useMemo(
		() => (info.state === "ready" ? passwordUserInputs({ fullName: info.fullName }).concat(info.email ? [info.email.split("@")[0]] : []) : []),
		[info]
	);
	const check = usePasswordCheck(newPassword, inputs);
	const canSubmit = check.allPassed && confirmPassword.length > 0 && newPassword === confirmPassword && !submitting;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!canSubmit || info.state !== "ready") return;
		setError("");
		setSubmitting(true);
		try {
			const res = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, newPassword }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) {
				if (data.problem) {
					setInfo({ state: "invalid", problem: data.problem });
					return;
				}
				throw new Error(data.error || "Couldn't set your password. Please try again.");
			}
			router.replace(`/login?done=${info.purpose}`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Couldn't set your password. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	if (info.state === "loading") {
		return (
			<AuthShell title="Set your password">
				<Spinner />
			</AuthShell>
		);
	}

	if (info.state === "invalid") {
		const copy = PROBLEM_COPY[info.problem];
		return (
			<AuthShell title={copy.title} subtitle={copy.body}>
				<div className="space-y-6">
					{error && (
						<div className={AUTH_ERROR} role="alert">
							<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
							<p>{error}</p>
						</div>
					)}
					{info.problem !== "locked" && (
						<Link href="/forgot-password" className={AUTH_PRIMARY}>
							Request a new link
						</Link>
					)}
					<p className={AUTH_FINE}>Invited and the link expired? Ask your administrator to re-send the invite.</p>
					<Link href="/login" className={`${AUTH_QUIET_LINK} w-full`}>
						<ArrowLeft className="h-4 w-4" />
						Back to sign in
					</Link>
				</div>
			</AuthShell>
		);
	}

	const isInvite = info.purpose === "invite";
	return (
		<AuthShell
			title={isInvite ? `Welcome, ${info.fullName.split(" ")[0]}` : "Choose a new password"}
			subtitle={
				<>
					{isInvite ? "Set a password to finish creating your account" : "Set a new password for"}
					{info.email && (
						<>
							{isInvite ? " — you'll sign in as " : " "}
							<span className="font-semibold text-slate-950 dark:text-white">{info.email}</span>
						</>
					)}
					.
				</>
			}
		>
			<form onSubmit={handleSubmit} className="space-y-5">
				{error && (
					<div className={AUTH_ERROR} role="alert">
						<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
						<p>{error}</p>
					</div>
				)}
				<PasswordFields
					newPassword={newPassword}
					onNewPassword={setNewPassword}
					confirmPassword={confirmPassword}
					onConfirmPassword={setConfirmPassword}
					check={check}
					disabled={submitting}
				/>
				<button type="submit" disabled={!canSubmit} className={`${AUTH_PRIMARY} mt-2`}>
					{submitting ? (
						<>
							<Loader2 className="h-5 w-5 animate-spin" />
							Saving…
						</>
					) : isInvite ? (
						"Set password & continue"
					) : (
						"Save new password"
					)}
				</button>
			</form>
		</AuthShell>
	);
}

function Spinner() {
	return (
		<div className="flex justify-center py-6">
			<Loader2 className="h-6 w-6 animate-spin text-sky-700 dark:text-sky-400" aria-label="Checking your link" />
		</div>
	);
}
