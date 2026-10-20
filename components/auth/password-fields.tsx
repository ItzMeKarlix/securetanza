"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { COMMON_PASSWORD_LABEL } from "@/lib/password-policy";
import type { usePasswordCheck } from "@/hooks/usePasswordCheck";

/**
 * New + confirm password fields with the strength meter and policy checklist,
 * for the dark sign-in surfaces (first-sign-in modal, set-password page).
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
			<div className="space-y-1.5">
				<label htmlFor="new-password" className="text-xs font-semibold text-slate-300 ml-1">
					New Password
				</label>
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0EA5E9] transition-colors">
						<Lock className="h-4 w-4" />
					</div>
					<Input
						id="new-password"
						type={showNew ? "text" : "password"}
						value={newPassword}
						onChange={(e) => onNewPassword(e.target.value)}
						className="pl-11 pr-11 h-12 bg-slate-950/50 border-white/10 focus:border-[#0EA5E9] text-white transition-all rounded-xl"
						placeholder="Enter new password"
						autoComplete="new-password"
						required
						disabled={disabled}
					/>
					<button
						type="button"
						onClick={() => setShowNew(!showNew)}
						aria-label={showNew ? "Hide password" : "Show password"}
						className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
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
											: "bg-white/10"
									}`}
								/>
							))}
						</div>
						<div className="space-y-1.5">
							{check.rules.map(({ label, passed }) => (
								<div
									key={label}
									className={`flex items-center gap-2 text-xs transition-colors duration-300 ${passed ? "text-emerald-400" : "text-slate-500"}`}
								>
									<CheckCircle2 className={`w-3.5 h-3.5 ${passed ? "opacity-100" : "opacity-30"}`} />
									<span>{label}</span>
								</div>
							))}
							<div
								className={`flex items-start gap-2 text-xs transition-colors duration-300 ${
									check.common === "ok"
										? "text-emerald-400"
										: check.common === "weak"
										? "text-red-400"
										: "text-slate-500"
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
									{check.warning && <span className="block text-slate-400">{check.warning}</span>}
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="space-y-1.5">
				<label htmlFor="confirm-password" className="text-xs font-semibold text-slate-300 ml-1">
					Confirm Password
				</label>
				<div className="relative group">
					<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-[#0EA5E9] transition-colors">
						<Lock className="h-4 w-4" />
					</div>
					<Input
						id="confirm-password"
						type={showConfirm ? "text" : "password"}
						value={confirmPassword}
						onChange={(e) => onConfirmPassword(e.target.value)}
						className={`pl-11 pr-11 h-12 bg-slate-950/50 text-white transition-all rounded-xl ${
							mismatch ? "border-red-500 focus:border-red-500" : "border-white/10 focus:border-[#0EA5E9]"
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
						className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
					>
						{showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
					</button>
				</div>
			</div>
		</>
	);
}
