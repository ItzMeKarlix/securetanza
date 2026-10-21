"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { AUTH_INPUT, AUTH_LABEL } from "./auth-shell";
import { COMMON_PASSWORD_LABEL } from "@/lib/password-policy";
import type { usePasswordCheck } from "@/hooks/usePasswordCheck";

/**
 * New + confirm password fields with the strength meter and policy checklist,
 * for the sign-in surfaces (first-sign-in modal, set-password page), light and dark.
 * The parent owns `usePasswordCheck` so it can gate its own submit button.
 */
export function PasswordFields({
	newPassword,
	onNewPassword,
	confirmPassword,
	onConfirmPassword,
	check,
	disabled,
}: {
	newPassword: string;
	onNewPassword: (value: string) => void;
	confirmPassword: string;
	onConfirmPassword: (value: string) => void;
	check: ReturnType<typeof usePasswordCheck>;
	disabled?: boolean;
}) {
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const { score } = check;
	const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

	return (
		<>
			<div className="space-y-2">
				<label htmlFor="new-password" className={AUTH_LABEL}>
					New password
				</label>
				<div className="relative group">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 transition-colors group-focus-within:text-sky-700 dark:text-slate-400 dark:group-focus-within:text-sky-400">
						<Lock className="h-4 w-4" />
					</div>
					<input
						id="new-password"
						type={showNew ? "text" : "password"}
						value={newPassword}
						onChange={(e) => onNewPassword(e.target.value)}
						className={`${AUTH_INPUT} pl-10 pr-11`}
						placeholder="Enter new password"
						autoComplete="new-password"
						required
						disabled={disabled}
					/>
					<button
						type="button"
						onClick={() => setShowNew(!showNew)}
						aria-label={showNew ? "Hide password" : "Show password"}
						className="absolute inset-y-0 right-0 flex cursor-pointer items-center rounded-r-lg pr-3.5 text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600 dark:text-slate-400 dark:hover:text-white"
					>
						{showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>

				{newPassword.length > 0 && (
					<div className="pt-2 animate-in slide-in-from-top-1 opacity-100 duration-200">
						<div className="flex gap-1.5 h-1.5 w-full rounded-full overflow-hidden mb-3">
							{[1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className={`flex-1 transition-colors duration-300 ${
										score >= i
											? score <= 1
												? "bg-red-500"
												: score <= 2
												? "bg-amber-500"
												: score <= 3
												? "bg-emerald-400"
												: "bg-emerald-500"
											: "bg-slate-200 dark:bg-white/10"
									}`}
								/>
							))}
						</div>
						<div className="space-y-1.5">
							{check.rules.map(({ label, passed }) => (
								<div
									key={label}
									className={`flex items-center gap-2 text-xs transition-colors duration-300 ${passed ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"}`}
								>
									<CheckCircle2 className={`w-3.5 h-3.5 ${passed ? "opacity-100" : "opacity-30"}`} />
									<span>{label}</span>
								</div>
							))}
							<div
								className={`flex items-start gap-2 text-xs transition-colors duration-300 ${
									check.common === "ok"
										? "text-emerald-700 dark:text-emerald-400"
										: check.common === "weak"
										? "text-red-700 dark:text-red-400"
										: "text-slate-600 dark:text-slate-400"
								}`}
							>
								{check.common === "checking" ? (
									<Loader2 className="mt-px w-3.5 h-3.5 shrink-0 animate-spin opacity-60" />
								) : check.common === "weak" ? (
									<XCircle className="mt-px w-3.5 h-3.5 shrink-0" />
								) : (
									<CheckCircle2
										className={`mt-px w-3.5 h-3.5 shrink-0 ${check.common === "ok" ? "opacity-100" : "opacity-30"}`}
									/>
								)}
								<span>
									{COMMON_PASSWORD_LABEL}
									{check.warning && <span className="block text-slate-600 dark:text-slate-400">{check.warning}</span>}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="space-y-2">
				<label htmlFor="confirm-password" className={AUTH_LABEL}>
					Confirm password
				</label>
				<div className="relative group">
					<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500 transition-colors group-focus-within:text-sky-700 dark:text-slate-400 dark:group-focus-within:text-sky-400">
						<Lock className="h-4 w-4" />
					</div>
					<input
						id="confirm-password"
						type={showConfirm ? "text" : "password"}
						value={confirmPassword}
						onChange={(e) => onConfirmPassword(e.target.value)}
						aria-invalid={mismatch}
						aria-describedby={mismatch ? "confirm-password-mismatch" : undefined}
						className={`${AUTH_INPUT} pl-10 pr-11 ${
							mismatch ? "border-red-500 focus:border-red-500 focus:ring-red-500/15 dark:border-red-400 dark:focus:border-red-400" : ""
						}`}
						placeholder="Confirm new password"
						autoComplete="new-password"
						required
						disabled={disabled}
					/>
					<button
						type="button"
						onClick={() => setShowConfirm(!showConfirm)}
						aria-label={showConfirm ? "Hide password" : "Show password"}
						className="absolute inset-y-0 right-0 flex cursor-pointer items-center rounded-r-lg pr-3.5 text-slate-500 transition-colors hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-sky-600 dark:text-slate-400 dark:hover:text-white"
					>
						{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
				{mismatch && (
					<p id="confirm-password-mismatch" className="text-xs text-red-700 dark:text-red-400">
						Passwords don&apos;t match.
					</p>
				)}
			</div>
		</>
	);
}
