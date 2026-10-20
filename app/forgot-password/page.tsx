"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, Mail, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
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
		<AuthCard
			title={sentTo ? "Check your email" : "Reset your password"}
			subtitle={sentTo ? undefined : "Enter the email you sign in with and we'll send you a reset link."}
		>
			{sentTo ? (
				<div className="space-y-6">
					<div className="flex items-start gap-3 rounded-lg border border-[#0EA5E9]/25 bg-[#0EA5E9]/10 p-4">
						<MailCheck className="h-5 w-5 shrink-0 text-[#38BDF8] mt-0.5" />
						<p className="text-sm leading-relaxed text-slate-300">
							If <span className="font-medium text-white">{sentTo}</span> belongs to an active account, a
							reset link is on its way. It expires in 1 hour. Check your spam folder if it doesn&apos;t
							arrive in a few minutes.
						</p>
					</div>
					<p className="text-xs leading-relaxed text-slate-500">
						Account locked after too many sign-in attempts? A reset link won&apos;t be sent — ask your
						system administrator to unlock it.
					</p>
					<BackToSignIn />
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-6">
					{error && (
						<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
							<AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
							<p className="text-sm text-red-400">{error}</p>
						</div>
					)}
					<div>
						<label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
							Email
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Mail className="h-5 w-5 text-slate-500" />
							</div>
							<input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="block w-full pl-10 pr-3 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent transition-all"
								placeholder="name@example.gov.ph"
								autoComplete="username"
								required
								disabled={loading}
							/>
						</div>
					</div>
					<Button
						type="submit"
						disabled={loading}
						className="w-full h-12 bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
					>
						{loading ? (
							<>
								<Loader2 className="h-5 w-5 animate-spin mr-2" />
								Sending…
							</>
						) : (
							"Send reset link"
						)}
					</Button>
					<BackToSignIn />
				</form>
			)}
		</AuthCard>
	);
}

function BackToSignIn() {
	return (
		<Link
			href="/login"
			className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
		>
			<ArrowLeft className="h-4 w-4" />
			Back to sign in
		</Link>
	);
}
