"use client";

import React, { useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";
import {
	Check,
	CheckCircle2,
	Copy,
	Edit,
	Eye,
	EyeOff,
	Lock,
	Trash2,
	Unlock,
	UserPlus,
	X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminOnly } from "../_components/settings-shell";
import {
	EmptyState,
	Field,
	PageHeader,
	Panel,
	Section,
	btnDanger,
	btnOutline,
	btnPrimary,
	inputBase,
	td,
	th,
	PAGE_TABLE,
} from "../_components/settings-ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
	ACCESS_ROLES,
	MEMBER_PERMISSION,
	MODULE_PRIVILEGES,
	getAccessRole,
	type AccessRole,
} from "@/lib/auth-routes";

const ADMIN_PERMISSION = "admin_operational_officer";
const ROLE_ORDER: AccessRole[] = ["admin", "member", "privileged"];

interface AccessForm {
	fullName: string;
	role: AccessRole;
	/** Module privilege permission ids - only used when role is "privileged". */
	privilegeIds: number[];
}

const EMPTY_FORM: AccessForm = { fullName: "", role: "privileged", privilegeIds: [] };

interface Permission {
	id: number;
	name: string;
	description: string | null;
}

interface User {
	id: number;
	accountNumber: string;
	fullName: string;
	permissions: Permission[];
	createdAt: string;
	updatedAt: string;
	/** Set when three consecutive failed sign-ins locked the account. */
	lockedAt: string | null;
	failedLoginAttempts: number;
}

interface AvailablePermission {
	id: number;
	permissionName: string;
	description: string | null;
}

export default function AccessSecurityPage() {
	return (
		<AdminOnly>
			<AccessSecurity />
		</AdminOnly>
	);
}

function AccessSecurity() {
	const { user: currentUser } = useAuth();

	const [users, setUsers] = useState<User[]>([]);
	const [availablePermissions, setAvailablePermissions] = useState<AvailablePermission[]>([]);
	const [usersLoading, setUsersLoading] = useState(true);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isCopied, setIsCopied] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [newAccount, setNewAccount] = useState<{
		kind: "created" | "unlocked";
		fullName: string;
		accountNumber: string;
		tempPassword?: string;
	} | null>(null);

	const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
		};
	}, []);

	const closeCredentialsModal = () => {
		if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
		setNewAccount(null);
		setIsCopied(false);
		setShowPassword(false);
	};

	const [userToUnlock, setUserToUnlock] = useState<User | null>(null);
	const [isUnlocking, setIsUnlocking] = useState(false);

	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const [formData, setFormData] = useState<AccessForm>(EMPTY_FORM);

	/** Turn the role + module picks into the permission ids the API stores. */
	const resolvePermissionIds = (): number[] | null => {
		const idFor = (name: string) => availablePermissions.find((p) => p.permissionName === name)?.id;
		if (formData.role === "admin" || formData.role === "member") {
			const id = idFor(formData.role === "admin" ? ADMIN_PERMISSION : MEMBER_PERMISSION);
			if (id === undefined) {
				toast.error(
					`The ${ACCESS_ROLES[formData.role].label} role is not available yet. Ask a developer to run the latest database migration.`
				);
				return null;
			}
			return [id];
		}
		if (formData.privilegeIds.length === 0) {
			toast.error("Select at least one module for a Privileged account.");
			return null;
		}
		return formData.privilegeIds;
	};

	const fetchUsers = async () => {
		setUsersLoading(true);
		try {
			const response = await fetch("/api/users");
			if (!response.ok) {
				toast.error("Failed to fetch users (unauthorized or network error)");
				return;
			}
			const data = await response.json();
			if (data.success) setUsers(data.data);
			else toast.error(data.error || "Failed to fetch users");
		} catch {
			toast.error("Failed to fetch users");
		} finally {
			setUsersLoading(false);
		}
	};

	const fetchPermissions = async () => {
		try {
			const response = await fetch("/api/permissions");
			if (!response.ok) return;
			const data = await response.json();
			if (data.success) setAvailablePermissions(data.data);
		} catch (err) {
			console.error("Failed to fetch permissions:", err);
		}
	};

	useEffect(() => {
		fetchUsers();
		fetchPermissions();
	}, []);

	const handleCreateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;


		const permissionIds = resolvePermissionIds();
		if (!permissionIds) return;

		setIsSubmitting(true);
		try {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName: formData.fullName, permissionIds }),
			});
			const data = await response.json();
			if (data.success) {
				toast.success("Account created");
				setShowCreateModal(false);
				setFormData(EMPTY_FORM);
				if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
				setIsCopied(false);
				setShowPassword(false);
				fetchUsers();
				setNewAccount({ ...data.data, kind: "created" });
			} else toast.error(data.error || "Failed to create account");

		} catch {
			toast.error("Failed to create account");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUser || isSubmitting) return;

		const permissionIds = resolvePermissionIds();
		if (!permissionIds) return;

		setIsSubmitting(true);
		try {
			const response = await fetch(`/api/users/${selectedUser.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName: formData.fullName, permissionIds }),
			});
			if (!response.ok) {
				const errorText = await response.text();
				try {
					const errorJson = JSON.parse(errorText);
					toast.error(errorJson.error || "Failed to update access");
				} catch {
					toast.error("Failed to update access");
				}
				return;
			}
			const data = await response.json();
			if (data.success) {
				toast.success("Access updated");
				setShowEditModal(false);
				setSelectedUser(null);
				fetchUsers();
			} else toast.error(data.error || "Failed to update access");
		} catch {
			toast.error("Failed to update access");
		} finally {
			setIsSubmitting(false);
		}
	};

	const executeDelete = async (userId: number) => {
		setIsDeleting(true);
		try {
			const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
			if (!response.ok) {
				const errorText = await response.text();
				try {
					const errorJson = JSON.parse(errorText);
					toast.error(errorJson.error || "Failed to revoke access");
				} catch {
					toast.error("Failed to revoke access");
				}
				return;
			}
			const data = await response.json();
			if (data.success) {
				toast.success("Access revoked successfully");
				setUserToDelete(null);
				setDeleteConfirmation("");
				fetchUsers();
			} else toast.error(data.error || "Failed to revoke access");
		} catch {
			toast.error("Failed to revoke access");
		} finally {
			setIsDeleting(false);
		}
	};

	const executeUnlock = async (user: User) => {
		if (isUnlocking) return;
		setIsUnlocking(true);
		try {
			const response = await fetch(`/api/users/${user.id}/unlock`, { method: "POST" });
			const data = await response.json();
			if (response.ok && data.success) {
				setUserToUnlock(null);
				if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
				setIsCopied(false);
				setShowPassword(false);
				fetchUsers();
				setNewAccount({ ...data.data, kind: "unlocked" });
			} else toast.error(data.error || "Failed to unlock account");

		} catch {
			toast.error("Failed to unlock account");
		} finally {
			setIsUnlocking(false);
		}
	};

	const openEditModal = (user: User) => {
		setSelectedUser(user);
		setFormData({
			fullName: user.fullName,
			role: getAccessRole(user.permissions.map((p) => p.name)),
			privilegeIds: user.permissions.filter((p) => p.name.startsWith("privileged_")).map((p) => p.id),
		});
		setShowEditModal(true);
	};

	const closeFormModal = () => {
		setShowCreateModal(false);
		setShowEditModal(false);
		setSelectedUser(null);
	};

	const totalPages = Math.ceil(users.length / itemsPerPage);
	const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));
	const paginatedUsers = users.slice(
		(validCurrentPage - 1) * itemsPerPage,
		validCurrentPage * itemsPerPage
	);

	return (
		<div className={cn(PAGE_TABLE, "space-y-10")}>
			<PageHeader title="Access & Security" />

			<Section
				title="Personnel & Access"
				description="Manage who can sign in and what each account can do."
				actions={
					<button
						onClick={() => {
							setFormData(EMPTY_FORM);
							if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
							setIsCopied(false);
							setShowPassword(false);
							setShowCreateModal(true);
						}}
						className={btnPrimary}
					>

						<UserPlus className="h-3.5 w-3.5" />
						Authorize New Officer
					</button>
				}
			>
				<div className="space-y-3">

					<Panel>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[42.5rem] text-left">
								<thead>
									<tr className="border-b border-slate-200 dark:border-white/[0.07]">
										<th className={th}>Account No.</th>
										<th className={th}>Full Name</th>
										<th className={th}>Role</th>
										<th className={cn(th, "text-right")}>Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-200 dark:divide-white/[0.07]">
									{usersLoading ? (
										Array.from({ length: 5 }).map((_, i) => (
											<tr key={i} aria-hidden="true">
												<td colSpan={4} className="px-4 py-3">
													<div className="h-[0.6875rem] w-full rounded-full bg-slate-100 dark:bg-white/[0.06]" />
												</td>
											</tr>
										))
									) : users.length === 0 ? (
										<tr>
											<td colSpan={4}>
												<EmptyState title="No accounts found" />
											</td>
										</tr>
									) : (
										paginatedUsers.map((user) => {
											const isSelf = user.id === currentUser?.id;
											return (
												<tr
													key={user.id}
													className="transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]"
												>
													<td className={cn(td, "font-mono text-[0.7812rem] whitespace-nowrap")}>
														{user.accountNumber}
													</td>
													<td className={td}>
														<div className="flex items-center gap-2">
															<span className="font-medium text-slate-900 dark:text-white">
																{user.fullName}
															</span>
															{user.lockedAt && (
																<span
																	title={`Locked ${new Date(user.lockedAt).toLocaleString()} after ${user.failedLoginAttempts} failed sign-in attempts`}
																	className="inline-flex items-center gap-1 rounded border border-red-200 px-1.5 py-0.5 text-[0.7188rem] font-medium text-red-600 dark:border-red-500/25 dark:text-red-400"
																>
																	<Lock className="h-3 w-3" /> Locked
																</span>
															)}
														</div>
													</td>
													<td className={td}>
															<RoleCell permissions={user.permissions} />
														</td>
													<td className={cn(td, "text-right")}>
														<div className="flex justify-end gap-0.5">
															{user.lockedAt && (
																<button
																	onClick={() => setUserToUnlock(user)}
																	title="Unlock account and issue a temporary password"
																	className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-white/[0.06] dark:hover:text-amber-400"
																>
																	<Unlock className="h-4 w-4" />
																	<span className="sr-only">Unlock {user.fullName}</span>
																</button>
															)}
															<button
																onClick={() => openEditModal(user)}
																disabled={isSelf}
																title={
																	isSelf ? "Cannot modify your own access level" : "Edit access"
																}
																className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0369A1] disabled:pointer-events-none disabled:opacity-35 dark:hover:bg-white/[0.06] dark:hover:text-[#7DD3FC]"
															>
																<Edit className="h-4 w-4" />
																<span className="sr-only">Edit access for {user.fullName}</span>
															</button>
															<button
																onClick={() => setUserToDelete(user)}
																disabled={isSelf}
																title={
																	isSelf ? "Cannot remove your own account" : "Remove access"
																}
																className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-red-600 disabled:pointer-events-none disabled:opacity-35 dark:hover:bg-white/[0.06] dark:hover:text-red-400"
															>
																<Trash2 className="h-4 w-4" />
																<span className="sr-only">Revoke access for {user.fullName}</span>
															</button>
														</div>
													</td>
												</tr>
											);
										})
									)}
								</tbody>
							</table>
						</div>

						{users.length > 0 && (
							<div className="flex items-center justify-between border-t border-slate-200 px-4 py-2.5 dark:border-white/[0.07]">
								<span className="text-[0.7812rem] tabular-nums text-slate-500 dark:text-slate-400">
									Showing {(validCurrentPage - 1) * itemsPerPage + 1} to{" "}
									{Math.min(validCurrentPage * itemsPerPage, users.length)} of {users.length} accounts
								</span>
								<div className="flex gap-1.5">
									<button
										onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
										disabled={validCurrentPage === 1}
										className={cn(btnOutline, "h-7 px-2.5 text-[0.7812rem]")}
									>
										Previous
									</button>
									<button
										onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
										disabled={validCurrentPage === totalPages}
										className={cn(btnOutline, "h-7 px-2.5 text-[0.7812rem]")}
									>
										Next
									</button>
								</div>
							</div>
						)}
					</Panel>
				</div>
			</Section>

			{/* ── Credentials handoff ── */}
			{newAccount && (
				<Modal
					title={newAccount.kind === "unlocked" ? "Account Unlocked" : "Account Created"}
					onClose={closeCredentialsModal}
				>
					<dl className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-white/[0.07] dark:border-white/[0.07]">
						<div className="flex items-center justify-between gap-4 py-3">
							<dt className="text-[0.8125rem] text-slate-500 dark:text-slate-400">Full Name</dt>
							<dd className="text-[0.875rem] font-medium text-slate-900 dark:text-white">
								{newAccount.fullName}
							</dd>
						</div>
						<div className="flex items-center justify-between gap-4 py-3">
							<dt className="text-[0.8125rem] text-slate-500 dark:text-slate-400">Account Number</dt>
							<dd className="font-mono text-[0.8125rem] font-medium text-slate-900 dark:text-white">
								{newAccount.accountNumber}
							</dd>
						</div>
						<div className="flex items-center justify-between gap-4 py-3">
							<dt className="text-[0.8125rem] text-slate-500 dark:text-slate-400">Temporary Password</dt>
							<dd className="flex items-center gap-1.5">
								<span className="font-mono text-[0.8125rem] font-medium text-slate-900 dark:text-white">
									{showPassword ? newAccount.tempPassword : "••••••••••"}
								</span>
								<button
									onClick={() => setShowPassword(!showPassword)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
								>
									{showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
								</button>
							</dd>
						</div>
					</dl>

					<p className="mt-4 text-[0.8125rem] leading-relaxed text-slate-500 dark:text-slate-400">
						{newAccount.kind === "unlocked"
							? "The previous password no longer works. Hand these over — the officer must set a new password on their next sign-in."
							: "Please sign in and change your password."}
					</p>

					<button
						onClick={() => {
							navigator.clipboard.writeText(
								`Secure Tanza Account ${
									newAccount.kind === "unlocked" ? "Unlocked" : "Created"
								}\nFull Name: ${newAccount.fullName}\nAccount Number: ${
									newAccount.accountNumber
								}\nTemporary Password: ${newAccount.tempPassword}\n\nPlease sign in and change your password.`
							);
							if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
							setIsCopied(true);
							copyTimeoutRef.current = setTimeout(() => {
								setIsCopied(false);
							}, 4000);
						}}
						className={cn(btnPrimary, "mt-5 w-full")}
					>
						{isCopied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
						{isCopied ? "Credentials Copied!" : "Copy Credentials"}
					</button>
				</Modal>
			)}

			{/* ── Create / edit ── */}
			{(showCreateModal || showEditModal) && !newAccount && (
				<Modal
					title={showCreateModal ? "Add Account" : "Edit Access"}
					width="max-w-lg"
					onClose={closeFormModal}
				>
					<form onSubmit={showCreateModal ? handleCreateUser : handleUpdateUser} className="space-y-5">
						<Field label="Full Name" htmlFor="account-name">
							<input
								id="account-name"
								className={inputBase}
								placeholder="Full name"
								value={formData.fullName}
								onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
								required
							/>
						</Field>

						<Field label="Role">
								<div role="radiogroup" aria-label="Role" className="space-y-1.5">
									{ROLE_ORDER.map((role) => {
										const meta = ACCESS_ROLES[role];
										const isSelected = formData.role === role;
										return (
											<button
												key={role}
												type="button"
												role="radio"
												aria-checked={isSelected}
												onClick={() => setFormData((prev) => ({ ...prev, role }))}
												className={cn(
													"flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
													isSelected
														? "border-[#0EA5E9] bg-[#0EA5E9]/[0.045] dark:bg-[#0EA5E9]/[0.07]"
														: "border-slate-200 hover:border-slate-300 dark:border-white/[0.12] dark:hover:border-white/25"
												)}
											>
												<span
													aria-hidden="true"
													className={cn(
														"mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
														isSelected
															? "border-[#0EA5E9]"
															: "border-slate-300 dark:border-white/25"
													)}
												>
													{isSelected && <span className="h-2 w-2 rounded-full bg-[#0EA5E9]" />}
												</span>
												<span className="min-w-0">
													<span
														className={cn(
															"block text-[0.8438rem] font-medium",
															isSelected
																? "text-[#0369A1] dark:text-[#7DD3FC]"
																: "text-slate-900 dark:text-white"
														)}
													>
														{meta.label}
													</span>
													<span className="mt-0.5 block text-[0.7812rem] leading-snug text-slate-500 dark:text-slate-400">
														{meta.description}
													</span>
												</span>
											</button>
										);
									})}
								</div>
							</Field>

							{formData.role === "privileged" && (
								<Field label="Module access">
									<div className="space-y-1.5">
										{MODULE_PRIVILEGES.map((module) => {
											const permission = availablePermissions.find(
												(p) => p.permissionName === module.permissionName
											);
											if (!permission) return null;
											const isChecked = formData.privilegeIds.includes(permission.id);
											return (
												<button
													key={permission.id}
													type="button"
													role="checkbox"
													aria-checked={isChecked}
													onClick={() =>
														setFormData((prev) => ({
															...prev,
															privilegeIds: isChecked
																? prev.privilegeIds.filter((id) => id !== permission.id)
																: [...prev.privilegeIds, permission.id],
														}))
													}
													className={cn(
														"flex w-full items-start gap-3 rounded-md border px-3 py-2 text-left transition-colors",
														isChecked
															? "border-[#0EA5E9] bg-[#0EA5E9]/[0.045] dark:bg-[#0EA5E9]/[0.07]"
															: "border-slate-200 hover:border-slate-300 dark:border-white/[0.12] dark:hover:border-white/25"
													)}
												>
													<span
														aria-hidden="true"
														className={cn(
															"mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border",
															isChecked
																? "border-[#0EA5E9] bg-[#0EA5E9] text-white"
																: "border-slate-300 dark:border-white/25"
														)}
													>
														{isChecked && <Check className="h-3 w-3" strokeWidth={3} />}
													</span>
													<span className="min-w-0">
														<span className="block text-[0.8125rem] font-medium text-slate-900 dark:text-white">
															{module.label}
														</span>
														<span className="mt-0.5 block text-[0.7812rem] leading-snug text-slate-500 dark:text-slate-400">
															{module.description}
														</span>
													</span>
												</button>
											);
										})}
									</div>
								</Field>
							)}

						<div className="flex justify-end gap-2 pt-1">
							<button type="button" onClick={closeFormModal} className={btnOutline}>
								Cancel
							</button>
							<button type="submit" disabled={isSubmitting} className={btnPrimary}>
								{showCreateModal ? "Create Account" : "Save Changes"}
							</button>
						</div>
					</form>
				</Modal>
			)}

			{/* ── Unlock ── */}
			{userToUnlock && (
				<Modal title="Unlock Account" onClose={() => setUserToUnlock(null)}>
					<p className="text-[0.8125rem] leading-relaxed text-slate-600 dark:text-slate-300">
						<span className="font-medium text-slate-900 dark:text-white">
							{userToUnlock.fullName}
						</span>{" "}
						<span className="font-mono text-[0.7812rem] text-slate-500 dark:text-slate-400">
							({userToUnlock.accountNumber})
						</span>{" "}
						was locked out after {userToUnlock.failedLoginAttempts} failed sign-in attempts.
						Unlocking replaces their password with a new temporary one — the old password stops
						working, and they must set a new password on their next sign-in.
					</p>
					<div className="mt-6 flex justify-end gap-2">
						<button onClick={() => setUserToUnlock(null)} className={btnOutline}>
							Cancel
						</button>
						<button
							disabled={isUnlocking}
							onClick={() => executeUnlock(userToUnlock)}
							className={cn(btnPrimary, "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:text-white dark:hover:bg-amber-600")}
						>
							{isUnlocking ? "Unlocking…" : "Unlock & Issue Password"}
						</button>
					</div>
				</Modal>
			)}

			{/* ── Revoke ── */}
			{userToDelete && (
				<Modal
					title="Revoke Access"
					onClose={() => {
						setUserToDelete(null);
						setDeleteConfirmation("");
					}}
				>
					<p className="text-[0.8125rem] leading-relaxed text-slate-600 dark:text-slate-300">
						<span className="font-medium text-red-600 dark:text-red-400">
							This action is permanent and cannot be undone.
						</span>
						<br />
						All administrative privileges will be revoked immediately. To confirm, please type{" "}
						<code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.7812rem] text-slate-900 dark:bg-white/[0.07] dark:text-white">
							{userToDelete.accountNumber}
						</code>{" "}
						below.
					</p>
					<input
						value={deleteConfirmation}
						onChange={(e) => setDeleteConfirmation(e.target.value)}
						placeholder={`Type ${userToDelete.accountNumber} to confirm`}
						aria-label="Confirm account number"
						className={cn(inputBase, "mt-4 font-mono focus-visible:border-red-500")}
					/>
					<div className="mt-6 flex justify-end gap-2">
						<button
							onClick={() => {
								setUserToDelete(null);
								setDeleteConfirmation("");
							}}
							className={btnOutline}
						>
							Cancel
						</button>
						<button
							disabled={deleteConfirmation !== userToDelete.accountNumber || isDeleting}
							onClick={() => executeDelete(userToDelete.id)}
							className={btnDanger}
						>
							{isDeleting ? "Revoking…" : "Revoke Access"}
						</button>
					</div>
				</Modal>
			)}
		</div>
	);
}

/** Role badge, plus the chosen modules when the account is Privileged. */
function RoleCell({ permissions }: { permissions: Permission[] }) {
	const names = permissions.map((p) => p.name);

	if (names.length === 0) {
		return <span className="text-[0.7812rem] text-slate-500 dark:text-slate-400">No role</span>;
	}

	const role = getAccessRole(names);
	const meta = ACCESS_ROLES[role];
	const modules = MODULE_PRIVILEGES.filter((m) => names.includes(m.permissionName));

	return (
		<div className="flex flex-col items-start gap-1">
			<span
				className={cn(
					"inline-flex items-center rounded border px-1.5 py-0.5 text-[0.7188rem] font-medium",
					meta.badgeClass
				)}
			>
				{meta.label}
			</span>
			{role === "privileged" && (
				<span className="text-[0.7812rem] text-slate-500 dark:text-slate-400">
					{modules.length > 0 ? modules.map((m) => m.label).join(" · ") : "No modules"}
				</span>
			)}
		</div>
	);
}

/** One modal chrome for every dialog on this surface. */
function Modal({
	title,
	width = "max-w-md",
	onClose,
	children,
}: {
	title: string;
	width?: string;
	onClose: () => void;
	children: React.ReactNode;
}) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [onClose]);

	if (typeof document === "undefined") return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px] dark:bg-black/60"
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				onClick={(e) => e.stopPropagation()}
				className={`settings-surface w-full ${width} settings-dialog rounded-[10px] border border-slate-200 bg-white p-6 shadow-[0_16px_48px_-12px_rgba(15,23,42,0.28)] dark:border-white/[0.09] dark:bg-[#0F172A] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)]`}
			>
				<div className="mb-5 flex items-start justify-between gap-4">
					<h2 className="text-[0.9375rem] font-semibold tracking-[-0.008em] text-slate-900 dark:text-white">
						{title}
					</h2>
					<button
						onClick={onClose}
						aria-label="Close"
						className="-mt-1 -mr-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/[0.06] dark:hover:text-slate-200"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				{children}
			</div>
		</div>,
		document.body
	);
}
