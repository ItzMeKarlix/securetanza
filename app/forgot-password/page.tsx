"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";
import {
	AUTH_ERROR,
	AUTH_FINE,
	AUTH_ICON,
	AUTH_INFO,
	AUTH_INPUT,
	AUTH_LABEL,
	AUTH_PRIMARY,
	AUTH_QUIET_LINK,
	AuthShell,
} from "@/components/auth/auth-shell";
import { isValidEmail, normalizeEmail } from "@/lib/email-address";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [sentTo, setSentTo] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		const normalized = normalizeEmail(email);
		if (!isValidEmail(normalized)) {
			setError("Enter a valid email address.");
			return;
		}
		setLoading(true);
		try {
			const res = await fetch("/api/auth/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: normalized }),
			});
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
			setSentTo(normalized);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthShell
			title={sentTo ? "Check your email" : "Reset your password"}
			subtitle={sentTo ? undefined : "Enter the email you sign in with and we'll send you a reset link."}
		>
			{sentTo ? (
				<div className="space-y-6">
					<div className={AUTH_INFO}>
						<MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-400" />
						<p className="leading-relaxed">
							If <span className="font-semibold">{sentTo}</span> belongs to an active account, a reset link is
							on its way. It expires in 1 hour. Check your spam folder if it doesn&apos;t arrive in a few
							minutes.
						</p>
					</div>
					<p className={AUTH_FINE}>
						Account locked after too many sign-in attempts? A reset link won&apos;t be sent — ask your system
						administrator to unlock it.
					</p>
					<BackToSignIn />
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-6">
					{error && (
						<div className={AUTH_ERROR} role="alert">
							<AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
							<p>{error}</p>
						</div>
					)}
					<div className="space-y-2">
						<label htmlFor="email" className={AUTH_LABEL}>
							Email
						</label>
						<div className="relative">
							<div className={AUTH_ICON}>
								<Mail className="h-[1.125rem] w-[1.125rem]" />
							</div>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={`${AUTH_INPUT} pl-10`}
								placeholder="name@example.gov.ph"
								autoComplete="username"
								required
								disabled={loading}
							/>
						</div>
					</div>
					<button type="submit" disabled={loading} className={AUTH_PRIMARY}>
						{loading ? (
							<>
								<Loader2 className="h-5 w-5 animate-spin" />
								Sending…
							</>
						) : (
							"Send reset link"
						)}
					</button>
					<BackToSignIn />
				</form>
			)}
		</AuthShell>
	);
}

function BackToSignIn() {
	return (
		<Link href="/login" className={`${AUTH_QUIET_LINK} w-full`}>
			<ArrowLeft className="h-4 w-4" />
			Back to sign in
		</Link>
	);
}
