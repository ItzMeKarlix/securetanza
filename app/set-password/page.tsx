"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
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
		<Suspense fallback={<AuthCard title="Set your password"><Spinner /></AuthCard>}>
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
			<AuthCard title="Set your password">
				<Spinner />
			</AuthCard>
		);
	}

	if (info.state === "invalid") {
		const copy = PROBLEM_COPY[info.problem];
		return (
			<AuthCard title={copy.title} subtitle={copy.body}>
				<div className="space-y-4">
					{info.problem !== "locked" && (
						<Link
							href="/forgot-password"
							className="flex h-12 w-full items-center justify-center rounded-lg bg-[#0EA5E9] font-semibold text-white transition-colors hover:bg-[#0EA5E9]/90"
						>
							Request a new link
						</Link>
					)}
					<p className="text-center text-xs leading-relaxed text-slate-500">
						Invited and the link expired? Ask your administrator to re-send the invite.
					</p>
					<Link href="/login" className="block text-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
						Back to sign in
					</Link>
				</div>
			</AuthCard>
		);
	}

	const isInvite = info.purpose === "invite";
	return (
		<AuthCard
			title={isInvite ? `Welcome, ${info.fullName.split(" ")[0]}` : "Choose a new password"}
			subtitle={
				<>
					{isInvite ? "Set a password to finish creating your account" : "Set a new password for"}
					{info.email && (
						<>
							{isInvite ? " — you'll sign in as " : " "}
							<span className="font-medium text-slate-200">{info.email}</span>
						</>
					)}
					.
				</>
			}
		>
			<form onSubmit={handleSubmit} className="space-y-5">
				{error && (
					<div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
						<AlertCircle className="w-4 h-4 shrink-0" />
						<p className="font-medium">{error}</p>
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
				<Button
					type="submit"
					disabled={!canSubmit}
					className="w-full h-12 mt-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-semibold flex items-center justify-center gap-2"
				>
					{submitting ? (
						<Loader2 className="h-5 w-5 animate-spin" />
					) : (
						<>
							<CheckCircle2 className="w-4 h-4" />
							{isInvite ? "Set password & continue" : "Save new password"}
						</>
					)}
				</Button>
			</form>
		</AuthCard>
	);
}

function Spinner() {
	return (
		<div className="flex justify-center py-6">
			<Loader2 className="h-6 w-6 animate-spin text-[#0EA5E9]" />
		</div>
	);
}
