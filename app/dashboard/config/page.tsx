"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Eye, EyeOff, Loader2, LogOut, XCircle } from "lucide-react";
import { toast } from "sonner";
import {
	DataRow,
	Field,
	PageHeader,
	Row,
	Rows,
	Section,
	btnOutline,
	inputBase,
	PAGE_FORM,
	SplitLayout,
} from "./_components/settings-ui";
import { cn } from "@/lib/utils";
import { COMMON_PASSWORD_LABEL, passwordUserInputs } from "@/lib/password-policy";
import { usePasswordCheck } from "@/hooks/usePasswordCheck";
import { UnsavedChangesBar } from "./_components/unsaved-changes";
import { getUserRole, getRoleBadge } from "@/components/docs/docs-permissions";

export default function ProfilePage() {
	const { user, logout, refreshSession } = useAuth();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showCurrent, setShowCurrent] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [loading, setLoading] = useState(false);
	const [autoLogoutTimer, setAutoLogoutTimer] = useState<number | "">(user?.autoLogoutTimer ?? 15);
	const [savingTimer, setSavingTimer] = useState(false);
	const [unsavedTimer, setUnsavedTimer] = useState(false);

	const passwordInputs = React.useMemo(() => passwordUserInputs(user), [user]);
	const passwordCheck = usePasswordCheck(newPassword, passwordInputs);
	const { score } = passwordCheck;
	const isStrong = passwordCheck.allPassed;

	const initials = user?.fullName
		? user.fullName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "??";

	const userRole = getUserRole(user);
	const primaryRole = getRoleBadge(userRole).label;

	const handleChangePassword = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();

		if (newPassword === currentPassword) {
			toast.error("New password cannot be the same as your current password.");
			return;
		}
		if (!isStrong) {
			toast.error(
				passwordCheck.common === "checking"
					? "Still checking your new password, try again in a moment."
					: "Please meet all password security requirements."
			);
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("New passwords do not match.");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/auth/update-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ currentPassword, newPassword }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to update password");

			toast.success("Password updated successfully");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to update password");
		} finally {
			setLoading(false);
		}
	};

	const handleUpdateTimer = async (timerValue: number) => {
		setSavingTimer(true);
		try {
			const res = await fetch("/api/users/settings/auto-logout", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ autoLogoutTimer: timerValue }),
			});
			if (!res.ok) throw new Error("Failed to update timer");

			toast.success(`Auto-logout timer set to ${timerValue} minutes`);
			setAutoLogoutTimer(timerValue);
			setUnsavedTimer(false);
			await refreshSession();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to update timer");
			setAutoLogoutTimer(user?.autoLogoutTimer ?? 15);
		} finally {
			setSavingTimer(false);
		}
	};

	const canSubmit =
		!loading &&
		isStrong &&
		confirmPassword.length > 0 &&
		newPassword === confirmPassword &&
		newPassword !== currentPassword;

	const isEditingPassword = currentPassword.length > 0 || newPassword.length > 0 || confirmPassword.length > 0;
	const hasUnsavedChanges = unsavedTimer || isEditingPassword;

	const handleSaveAll = async () => {
		if (isEditingPassword) {
			if (!canSubmit) {
				toast.error("Please complete the password fields correctly to save.");
				return;
			}
			await handleChangePassword();
		}
		if (unsavedTimer) {
			const val = typeof autoLogoutTimer === 'string' ? parseInt(autoLogoutTimer) : autoLogoutTimer;
			if (val && val >= 1 && val <= 1440) {
				await handleUpdateTimer(val);
			} else {
				toast.error("Invalid timer duration. Must be between 1 and 1440 minutes.");
			}
		}
	};

	return (
		<div className={PAGE_FORM}>
			<div className="mb-12">
				<PageHeader title="My Profile" />
			</div>

			<SplitLayout>

			<Section
				title="Account Identity"
				description="Your account information as registered in the system."
			>
				<Rows>
					<div className="flex items-center gap-4 py-5">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0EA5E9] text-[0.875rem] font-semibold text-white">
							{initials}
						</div>
						<div className="min-w-0">
							<p className="truncate text-[0.9375rem] font-medium text-slate-900 dark:text-white">
								{user?.fullName ?? "—"}
							</p>
							<p className="mt-0.5 text-[0.8125rem] text-slate-500 dark:text-slate-400">{primaryRole}</p>
						</div>
					</div>
					<DataRow label="Email" value={user?.email ?? "Not set — ask an administrator to add one"} />
					<DataRow label="Staff ID" value={user?.accountNumber ?? "—"} mono />
				</Rows>
			</Section>

			<Section
				title="Change Password"
				description="Update your login credentials. Common or previously breached passwords are not accepted."
			>
				<form onSubmit={(e) => {
					e.preventDefault();
					if (canSubmit) handleChangePassword();
				}} className="border-t border-slate-200 pt-5 dark:border-white/[0.07]">
					<div className="max-w-[23.75rem] space-y-5">
						<Field label="Current password" htmlFor="current-password">
							<PasswordInput
								id="current-password"
								placeholder="Enter current password"
								value={currentPassword}
								onChange={setCurrentPassword}
								visible={showCurrent}
								onToggle={() => setShowCurrent(!showCurrent)}
							/>
						</Field>

						<Field label="New password" htmlFor="new-password">
							<PasswordInput
								id="new-password"
								placeholder="Minimum 8 characters"
								value={newPassword}
								onChange={setNewPassword}
								visible={showNew}
								onToggle={() => setShowNew(!showNew)}
							/>
							{newPassword.length > 0 && (
								<div className="pt-3">
									<div className="mb-3 flex h-[3px] gap-1">
										{[1, 2, 3, 4].map((i) => (
											<div
												key={i}
												className={`flex-1 rounded-full transition-colors duration-300 ${
													score >= i
														? score <= 1
															? "bg-red-500"
															: score <= 2
															? "bg-amber-500"
															: "bg-emerald-500"
														: "bg-slate-200 dark:bg-white/10"
												}`}
											/>
										))}
									</div>
									<ul className="space-y-1.5">
										{passwordCheck.rules.map(({ label, passed }) => (
											<li
												key={label}
												className={`flex items-center gap-2 text-[0.7812rem] transition-colors duration-200 ${
													passed
														? "text-emerald-600 dark:text-emerald-400"
														: "text-slate-500 dark:text-slate-400"
												}`}
											>
												<CheckCircle2
													className={`h-3.5 w-3.5 shrink-0 ${passed ? "opacity-100" : "opacity-30"}`}
												/>
												{label}
											</li>
										))}
										<li
											className={`flex items-start gap-2 text-[0.7812rem] transition-colors duration-200 ${
												passwordCheck.common === "ok"
													? "text-emerald-600 dark:text-emerald-400"
													: passwordCheck.common === "weak"
													? "text-red-600 dark:text-red-400"
													: "text-slate-500 dark:text-slate-400"
											}`}
										>
											{passwordCheck.common === "checking" ? (
												<Loader2 className="mt-px h-3.5 w-3.5 shrink-0 animate-spin opacity-60" />
											) : passwordCheck.common === "weak" ? (
												<XCircle className="mt-px h-3.5 w-3.5 shrink-0" />
											) : (
												<CheckCircle2
													className={`mt-px h-3.5 w-3.5 shrink-0 ${passwordCheck.common === "ok" ? "opacity-100" : "opacity-30"}`}
												/>
											)}
											<span>
												{COMMON_PASSWORD_LABEL}
												{passwordCheck.warning && (
													<span className="block text-slate-500 dark:text-slate-400">{passwordCheck.warning}</span>
												)}
											</span>
										</li>
									</ul>
								</div>
							)}
						</Field>

						<Field label="Confirm new password" htmlFor="confirm-password">
							<PasswordInput
								id="confirm-password"
								placeholder="Repeat new password"
								value={confirmPassword}
								onChange={setConfirmPassword}
								visible={showConfirm}
								onToggle={() => setShowConfirm(!showConfirm)}
							/>
							{confirmPassword.length > 0 && newPassword !== confirmPassword && (
								<p className="text-[0.7812rem] text-red-600 dark:text-red-400">
									Passwords do not match yet.
								</p>
							)}
						</Field>
					</div>
				</form>
			</Section>

			<Section
				title="Auto Logout"
				description="Configure how long before you are automatically logged out due to inactivity."
			>
				<Rows>
					<Row label="Idle Timeout Duration" description="Choose a preset or enter a custom duration in minutes.">
						<div className="flex flex-wrap items-center gap-3 mt-3 sm:mt-0">
							<div className="flex flex-wrap gap-2">
								{[5, 15, 30, 60].map((preset) => (
									<button
										key={preset}
										type="button"
										onClick={() => {
											setUnsavedTimer(false);
											handleUpdateTimer(preset);
										}}
										disabled={savingTimer}
										className={cn(
											btnOutline,
											"h-8 px-3 text-xs",
											autoLogoutTimer === preset 
												? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200" 
												: ""
										)}
									>
										{preset} min
									</button>
								))}
							</div>
							<div className="flex items-center gap-2">
								<input 
									type="number"
									min={1}
									max={1440}
									placeholder="Custom"
									value={autoLogoutTimer}
									onChange={(e) => {
										setAutoLogoutTimer(e.target.value === "" ? "" : parseInt(e.target.value));
										setUnsavedTimer(true);
									}}
									disabled={savingTimer}
									className={cn(inputBase, "h-8 w-20 text-center px-2")}
								/>
								<span className="text-[0.8125rem] text-slate-500">min</span>
							</div>
						</div>
					</Row>
				</Rows>
			</Section>

			<Section title="Session">
				<Rows>
					<Row
						label="Sign Out"
						description="End your current session and return to the login screen."
					>
						<button
							onClick={logout}
							className={cn(btnOutline, "border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/25 dark:text-red-400 dark:hover:bg-red-500/10")}
						>
							<LogOut className="h-3.5 w-3.5" />
							Sign Out
						</button>
					</Row>
				</Rows>
			</Section>

			</SplitLayout>

			<UnsavedChangesBar
				show={hasUnsavedChanges}
				saving={savingTimer || loading}
				onSave={handleSaveAll}
			/>
		</div>
	);
}

function PasswordInput({
	id,
	placeholder,
	value,
	onChange,
	visible,
	onToggle,
}: {
	id: string;
	placeholder: string;
	value: string;
	onChange: (v: string) => void;
	visible: boolean;
	onToggle: () => void;
}) {
	return (
		<div className="relative">
			<input
				id={id}
				type={visible ? "text" : "password"}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				required
				className={cn(inputBase, "pr-9")}
			/>
			<button
				type="button"
				onClick={onToggle}
				aria-label={visible ? "Hide password" : "Show password"}
				className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-md text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
			>
				{visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
			</button>
		</div>
	);
}
