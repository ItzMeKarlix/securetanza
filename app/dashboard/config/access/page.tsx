"use client";

import React, { useEffect, useState } from "react";

import {
	ChevronRight,
	Edit,
	KeyRound,
	RotateCcw,
	ShieldOff,
	Lock,
	Send,
	Trash2,
	Unlock,
	UserPlus,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AdminOnly } from "../_components/settings-shell";
import { Modal } from "../_components/settings-modal";
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
import { isValidEmail, normalizeEmail } from "@/lib/email-address";
import { PERSON_NAME_MAX, cleanText, personNameProblem } from "@/lib/input-sanitize";
import { SOFT_DELETE_RETENTION_DAYS, daysUntilPurge } from "@/lib/soft-delete";
import {
	ACCESS_ROLES,
	MEMBER_PERMISSION,
	MODULE_PRIVILEGES,
	getAccessRole,
	type AccessRole,
} from "@/lib/auth-routes";

const ADMIN_PERMISSION = "admin_operational_officer";
const ROLE_ORDER: AccessRole[] = ["admin", "member", "privileged"];
const FIELD_INVALID = "border-red-500 focus-visible:border-red-500 dark:border-red-400 dark:focus-visible:border-red-400";
const FIELD_ERROR = "text-[0.75rem] leading-snug text-red-700 dark:text-red-400";

interface AccessForm {
	fullName: string;
	email: string;
	role: AccessRole;
	/** Module privilege permission ids - only used when role is "privileged". */
	privilegeIds: number[];
}

const EMPTY_FORM: AccessForm = { fullName: "", email: "", role: "privileged", privilegeIds: [] };

interface Permission {
	id: number;
	name: string;
	description: string | null;
}

interface User {
	id: number;
	accountNumber: string;
	email: string | null;
	/** invited = link not accepted yet; legacy = no email, signs in by account number. */
	status: "locked" | "invited" | "legacy" | "active";
	/** Two-step verification set up. */
	mfaEnabled: boolean;
	fullName: string;
	permissions: Permission[];
	createdAt: string;
	updatedAt: string;
	/** Set when three consecutive failed sign-ins locked the account. */
	lockedAt: string | null;
	failedLoginAttempts: number;
	/** Only on the Recently deleted list. */
	deletedAt?: string | null;
	deletedBy?: string | null;
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
	const [sendingFor, setSendingFor] = useState<number | null>(null);
	const [userToResetMfa, setUserToResetMfa] = useState<User | null>(null);
	const [isResettingMfa, setIsResettingMfa] = useState(false);

	const [userToUnlock, setUserToUnlock] = useState<User | null>(null);
	const [isUnlocking, setIsUnlocking] = useState(false);

	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");
	const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
	const [showDeleted, setShowDeleted] = useState(false);
	const [restoringId, setRestoringId] = useState<number | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const [formData, setFormData] = useState<AccessForm>(EMPTY_FORM);
	// Field errors show once a field has been left (or on submit), not while typing the first letter.
	const [touched, setTouched] = useState({ name: false, email: false });
	const emailRequired = showCreateModal || Boolean(selectedUser?.email);
	const emailProblem = (): string | null => {
		const email = normalizeEmail(formData.email);
		if (!email) return emailRequired ? "Enter the person's email address — their invite is sent there." : null;
		return isValidEmail(email) ? null : "Enter a valid email address, like name@example.gov.ph.";
	};
	const nameError = touched.name ? personNameProblem(formData.fullName) : null;
	const emailError = touched.email ? emailProblem() : null;

	/** Same rules the API applies; on a problem, show it on the field and move focus there. */
	const fieldsValid = (): boolean => {
		setTouched({ name: true, email: true });
		const nameProblem = personNameProblem(formData.fullName);
		const problem = nameProblem ?? emailProblem();
		if (problem) document.getElementById(nameProblem ? "account-name" : "account-email")?.focus();
		return !problem;
	};

	/** Email is required for new accounts; on edit it may stay empty only for legacy accounts. */
	const resolveEmail = (required: boolean): string | null | undefined => {
		const email = normalizeEmail(formData.email);
		if (!email) {
			if (required) {
				toast.error("Enter the person's email address — their invite is sent there.");
				return null;
			}
			return undefined;
		}
		if (!isValidEmail(email)) {
			toast.error("Enter a valid email address.");
			return null;
		}
		return email;
	};

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
		void fetchDeletedUsers();
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
		if (isSubmitting || !fieldsValid()) return;

		const email = resolveEmail(true);
		if (!email) return;
		const permissionIds = resolvePermissionIds();
		if (!permissionIds) return;

		setIsSubmitting(true);
		try {
			const response = await fetch("/api/users", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName: cleanText(formData.fullName), email, permissionIds }),
			});
			const data = await response.json();
			if (data.success) {
				if (data.data.emailSent) toast.success(`Account created. Invitation sent to ${email}`);
				else toast.error(`Account created, but the invite email to ${email} could not be sent. Use “Resend invite” once mail is working.`);
				setShowCreateModal(false);
				setFormData(EMPTY_FORM);
				fetchUsers();
			} else toast.error(data.error || "Failed to create account");

		} catch {
			toast.error("Failed to create account");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedUser || isSubmitting || !fieldsValid()) return;

		const email = resolveEmail(Boolean(selectedUser.email));
		if (email === null) return;
		const permissionIds = resolvePermissionIds();
		if (!permissionIds) return;

		setIsSubmitting(true);
		try {
			const response = await fetch(`/api/users/${selectedUser.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName: cleanText(formData.fullName), ...(email ? { email } : {}), permissionIds }),
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
				toast.success(
					email && email !== selectedUser.email
						? `Access updated. ${selectedUser.fullName} now signs in with ${email}`
						: "Access updated"
				);
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

	const fetchDeletedUsers = async () => {
		try {
			const response = await fetch("/api/users?deleted=1");
			const data = await response.json();
			if (data.success) setDeletedUsers(data.data);
		} catch {
			// The live list is what matters; this one can wait for the next refresh.
		}
	};

	const restoreUser = async (user: User) => {
		setRestoringId(user.id);
		try {
			const response = await fetch(`/api/users/${user.id}/restore`, { method: "POST" });
			const data = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(data.error || "Failed to restore account");
			toast.success(`${user.fullName}'s account is restored. They can sign in again with their password.`);
			fetchUsers();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to restore account");
		} finally {
			setRestoringId(null);
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
				toast.success(`Account deleted. You can restore it from Recently deleted for ${SOFT_DELETE_RETENTION_DAYS} days.`);
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
				if (data.data.emailSent) toast.success(`Account unlocked. A reset link was emailed to ${data.data.email}`);
				else toast.error("Account unlocked, but the reset email could not be sent. Use “Send reset link” once mail is working.");
				fetchUsers();
			} else toast.error(data.error || "Failed to unlock account");

		} catch {
			toast.error("Failed to unlock account");
		} finally {
			setIsUnlocking(false);
		}
	};

	const executeMfaReset = async (user: User) => {
		if (isResettingMfa) return;
		setIsResettingMfa(true);
		try {
			const response = await fetch(`/api/users/${user.id}/mfa-reset`, { method: "POST" });
			const data = await response.json().catch(() => ({}));
			if (response.ok && data.success) {
				toast.success(`Two-step verification reset. ${user.fullName} will set it up again at next sign-in.`);
				setUserToResetMfa(null);
				fetchUsers();
			} else toast.error(data.error || "Couldn't reset two-step verification");
		} catch {
			toast.error("Couldn't reset two-step verification");
		} finally {
			setIsResettingMfa(false);
		}
	};

	/** Re-sends a pending invite, or emails a reset link to an active account. */
	const sendAccountEmail = async (user: User, kind: "invite" | "reset-link") => {
		if (sendingFor !== null) return;
		setSendingFor(user.id);
		try {
			const response = await fetch(`/api/users/${user.id}/${kind}`, { method: "POST" });
			const data = await response.json().catch(() => ({}));
			if (response.ok && data.success) {
				toast.success(kind === "invite" ? `Invitation re-sent to ${user.email}` : `Reset link sent to ${user.email}`);
			} else toast.error(data.error || "Couldn't send the email");
		} catch {
			toast.error("Couldn't send the email");
		} finally {
			setSendingFor(null);
		}
	};

	const openEditModal = (user: User) => {
		setSelectedUser(user);
		setFormData({
			fullName: user.fullName,
			email: user.email ?? "",
			role: getAccessRole(user.permissions.map((p) => p.name)),
			privilegeIds: user.permissions.filter((p) => p.name.startsWith("privileged_")).map((p) => p.id),
		});
		setShowEditModal(true);
	};

	const closeFormModal = () => {
		setShowCreateModal(false);
		setShowEditModal(false);
		setSelectedUser(null);
		setTouched({ name: false, email: false });
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
							setShowCreateModal(true);
						}}
						className={btnPrimary}
					>
						<UserPlus className="h-3.5 w-3.5" />
						Add Account
					</button>
				}
			>
				<div className="space-y-3">

					<Panel>
						<div className="overflow-x-auto">
							<table className="w-full min-w-[42.5rem] text-left">
								<thead>
									<tr className="border-b border-slate-200 dark:border-white/[0.07]">
										<th className={th}>Staff ID</th>
										<th className={th}>Name & Email</th>
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
														<div className="flex flex-wrap items-center gap-2">
															<span className="font-medium text-slate-900 dark:text-white">
																{user.fullName}
															</span>
															{user.status === "invited" && (
																<span
																	title="Invite sent; waiting for them to set a password"
																	className="inline-flex items-center rounded border border-sky-200 px-1.5 py-0.5 text-[0.7188rem] font-medium text-sky-700 dark:border-sky-500/25 dark:text-sky-300"
																>
																	Invite pending
																</span>
															)}
															{user.status === "legacy" && (
																<span
																	title="Still signs in with the account number. Add an email to move them to email sign-in."
																	className="inline-flex items-center rounded border border-amber-200 px-1.5 py-0.5 text-[0.7188rem] font-medium text-amber-700 dark:border-amber-500/25 dark:text-amber-300"
																>
																	No email
																</span>
															)}
															{user.status === "active" && !user.mfaEnabled && (
																<span
																	title="Two-step verification not set up yet — they will be asked to at their next sign-in."
																	className="inline-flex items-center rounded border border-slate-200 px-1.5 py-0.5 text-[0.7188rem] font-medium text-slate-600 dark:border-white/15 dark:text-slate-300"
																>
																	2FA pending
																</span>
															)}
															{user.lockedAt && (
																<span
																	title={`Locked ${new Date(user.lockedAt).toLocaleString()} after ${user.failedLoginAttempts} failed sign-in attempts`}
																	className="inline-flex items-center gap-1 rounded border border-red-200 px-1.5 py-0.5 text-[0.7188rem] font-medium text-red-600 dark:border-red-500/25 dark:text-red-400"
																>
																	<Lock className="h-3 w-3" /> Locked
																</span>
															)}
														</div>
														<div className="mt-0.5 text-[0.7812rem] text-slate-500 dark:text-slate-400">
															{user.email ?? "—"}
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
																	title="Unlock account and email a reset link"
																	className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-white/[0.06] dark:hover:text-amber-400"
																>
																	<Unlock className="h-4 w-4" />
																	<span className="sr-only">Unlock {user.fullName}</span>
																</button>
															)}
														{user.status === "invited" && (
															<button
																onClick={() => sendAccountEmail(user, "invite")}
																disabled={sendingFor !== null}
																title={`Resend invite to ${user.email}`}
																className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0369A1] disabled:opacity-35 dark:hover:bg-white/[0.06] dark:hover:text-[#7DD3FC]"
															>
																<Send className="h-4 w-4" />
																<span className="sr-only">Resend invite to {user.fullName}</span>
															</button>
														)}
														{user.status === "active" && !isSelf && (
															<button
																onClick={() => sendAccountEmail(user, "reset-link")}
																disabled={sendingFor !== null}
																title={`Email a password-reset link to ${user.email}`}
																className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#0369A1] disabled:opacity-35 dark:hover:bg-white/[0.06] dark:hover:text-[#7DD3FC]"
															>
																<KeyRound className="h-4 w-4" />
																<span className="sr-only">Send reset link to {user.fullName}</span>
															</button>
														)}
														{user.mfaEnabled && !isSelf && (
															<button
																onClick={() => setUserToResetMfa(user)}
																title="Reset two-step verification (lost phone)"
																className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-100 hover:text-amber-600 dark:hover:bg-white/[0.06] dark:hover:text-amber-400"
															>
																<ShieldOff className="h-4 w-4" />
																<span className="sr-only">Reset two-step verification for {user.fullName}</span>
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
																<span className="sr-only">Delete account for {user.fullName}</span>
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

					{deletedUsers.length > 0 && (
						<div>
							<button
								type="button"
								onClick={() => setShowDeleted((v) => !v)}
								aria-expanded={showDeleted}
								aria-controls="recently-deleted-accounts"
								className="inline-flex items-center gap-1.5 rounded-md py-1 text-[0.8125rem] font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
							>
								<ChevronRight className={cn("h-3.5 w-3.5 transition-transform", showDeleted && "rotate-90")} aria-hidden="true" />
								Recently deleted ({deletedUsers.length})
							</button>
							{showDeleted && (
								<Panel className="mt-2">
									<ul id="recently-deleted-accounts" className="divide-y divide-slate-200 dark:divide-white/[0.07]">
										{deletedUsers.map((user) => {
											const left = user.deletedAt ? daysUntilPurge(user.deletedAt) : SOFT_DELETE_RETENTION_DAYS;
											return (
												<li key={user.id} className="flex items-center justify-between gap-4 px-4 py-3">
													<div className="min-w-0">
														<p className="truncate text-[0.8438rem] font-medium text-slate-900 dark:text-white">
															{user.fullName}{" "}
															<span className="font-mono text-[0.75rem] font-normal text-slate-500 dark:text-slate-400">
																{user.accountNumber}
															</span>
														</p>
														<p className="truncate text-[0.75rem] tabular-nums text-slate-500 dark:text-slate-400">
															Deleted {user.deletedAt ? new Date(user.deletedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : ""}
															{user.deletedBy ? ` by ${user.deletedBy}` : ""} ·{" "}
															{left === 0 ? "removed permanently at the next nightly cleanup" : `removed permanently in ${left} day${left === 1 ? "" : "s"}`}
														</p>
													</div>
													<button
														type="button"
														onClick={() => void restoreUser(user)}
														disabled={restoringId === user.id}
														className={cn(btnOutline, "h-8 shrink-0")}
													>
														<RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
														{restoringId === user.id ? "Restoring…" : "Restore"}
													</button>
												</li>
											);
										})}
									</ul>
								</Panel>
							)}
						</div>
					)}
				</div>
			</Section>

			{/* ── Create / edit ── */}
			{(showCreateModal || showEditModal) && (
				<Modal
					title={showCreateModal ? "Add Account" : "Edit Access"}
					width="max-w-lg"
					onClose={closeFormModal}
					footer={
						<>
							<button type="button" onClick={closeFormModal} className={btnOutline}>
								Cancel
							</button>
							<button type="submit" form="account-form" disabled={isSubmitting} className={btnPrimary}>
								{showCreateModal ? "Create & Send Invite" : "Save Changes"}
							</button>
						</>
					}
				>
					<form
						id="account-form"
						noValidate
						onSubmit={showCreateModal ? handleCreateUser : handleUpdateUser}
						className="space-y-5"
					>
						<Field label="Full Name" htmlFor="account-name">
							<input
								id="account-name"
								className={cn(inputBase, nameError && FIELD_INVALID)}
								placeholder="e.g. Juan Dela Cruz"
								autoComplete="off"
								maxLength={PERSON_NAME_MAX}
								value={formData.fullName}
								onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
								onBlur={() => setTouched((t) => ({ ...t, name: true }))}
								aria-invalid={Boolean(nameError)}
								aria-describedby={nameError ? "account-name-error" : undefined}
								required
							/>
							{nameError && (
								<p id="account-name-error" className={FIELD_ERROR}>
									{nameError}
								</p>
							)}
						</Field>

						<Field label="Email" htmlFor="account-email">
							<input
								id="account-email"
								type="email"
								className={cn(inputBase, emailError && FIELD_INVALID)}
								placeholder="name@example.gov.ph"
								autoComplete="off"
								maxLength={254}
								value={formData.email}
								onChange={(e) => setFormData({ ...formData, email: e.target.value })}
								onBlur={() => setTouched((t) => ({ ...t, email: true }))}
								aria-invalid={Boolean(emailError)}
								aria-describedby={emailError ? "account-email-error account-email-hint" : "account-email-hint"}
								required={emailRequired}
							/>
							{emailError && (
								<p id="account-email-error" className={FIELD_ERROR}>
									{emailError}
								</p>
							)}
							<p id="account-email-hint" className="text-[0.75rem] leading-relaxed text-slate-500 dark:text-slate-400">
								{showCreateModal
									? "They sign in with this address. An invite link to set their password is sent here."
									: selectedUser?.email
									? "Changing it signs them out; both the old and new address are notified."
									: "Add an email to move this account from account-number sign-in to email sign-in."}
							</p>
						</Field>

						<Field label="Role">
							<div
								role="radiogroup"
								aria-label="Role"
								aria-describedby="account-role-description"
								className="grid grid-cols-3 gap-1 rounded-md border border-slate-200 bg-slate-50 p-1 dark:border-white/[0.12] dark:bg-white/[0.03]"
								onKeyDown={(e) => {
									const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
									if (!step) return;
									e.preventDefault();
									const next = ROLE_ORDER[(ROLE_ORDER.indexOf(formData.role) + step + ROLE_ORDER.length) % ROLE_ORDER.length];
									setFormData((prev) => ({ ...prev, role: next }));
									document.getElementById(`account-role-${next}`)?.focus();
								}}
							>
								{ROLE_ORDER.map((role) => {
									const isSelected = formData.role === role;
									return (
										<button
											key={role}
											id={`account-role-${role}`}
											type="button"
											role="radio"
											aria-checked={isSelected}
											tabIndex={isSelected ? 0 : -1}
											onClick={() => setFormData((prev) => ({ ...prev, role }))}
											className={cn(
												"h-8 rounded-[5px] px-2 text-[0.8125rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#0EA5E9]",
												isSelected
													? "bg-white text-[#0369A1] shadow-sm ring-1 ring-slate-200 dark:bg-[#0EA5E9]/15 dark:text-[#7DD3FC] dark:shadow-none dark:ring-[#0EA5E9]/40"
													: "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
											)}
										>
											{ACCESS_ROLES[role].label}
										</button>
									);
								})}
							</div>
							<p id="account-role-description" className="text-[0.78rem] leading-snug text-slate-500 dark:text-slate-400">
								{ACCESS_ROLES[formData.role].description}
							</p>
						</Field>

						{formData.role === "privileged" && (
							<Field label="Module access">
								<div className="divide-y divide-slate-200 rounded-md border border-slate-200 dark:divide-white/[0.08] dark:border-white/[0.12]">
									{MODULE_PRIVILEGES.map((module) => {
										const permission = availablePermissions.find(
											(p) => p.permissionName === module.permissionName
										);
										if (!permission) return null;
										const isChecked = formData.privilegeIds.includes(permission.id);
										return (
											<label
												key={permission.id}
												className="flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors first:rounded-t-md last:rounded-b-md hover:bg-slate-50 dark:hover:bg-white/[0.03]"
											>
												<input
													type="checkbox"
													checked={isChecked}
													onChange={() =>
														setFormData((prev) => ({
															...prev,
															privilegeIds: isChecked
																? prev.privilegeIds.filter((id) => id !== permission.id)
																: [...prev.privilegeIds, permission.id],
														}))
													}
													className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#0EA5E9] [color-scheme:light] dark:[color-scheme:dark]"
												/>
												<span className="min-w-0">
													<span className="block text-[0.8125rem] font-medium text-slate-900 dark:text-white">
														{module.label}
													</span>
													<span className="block text-[0.75rem] leading-snug text-slate-500 dark:text-slate-400">
														{module.description}
													</span>
												</span>
											</label>
										);
									})}
								</div>
							</Field>
						)}
					</form>
				</Modal>
			)}

			{/* ── Reset 2FA ── */}
			{userToResetMfa && (
				<Modal title="Reset Two-Step Verification" onClose={() => setUserToResetMfa(null)}>
					<p className="text-[0.8125rem] leading-relaxed text-slate-600 dark:text-slate-300">
						Use this when{" "}
						<span className="font-medium text-slate-900 dark:text-white">{userToResetMfa.fullName}</span> has lost
						their phone and their backup codes. Their authenticator, backup codes and trusted browsers are
						removed and they are signed out everywhere; they set up a new authenticator at their next
						sign-in. Confirm who is asking before you do this — it is how an attacker would try to get in.
					</p>
					<div className="mt-6 flex justify-end gap-2">
						<button onClick={() => setUserToResetMfa(null)} className={btnOutline}>
							Cancel
						</button>
						<button
							disabled={isResettingMfa}
							onClick={() => executeMfaReset(userToResetMfa)}
							className={cn(btnPrimary, "bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:text-white dark:hover:bg-amber-600")}
						>
							{isResettingMfa ? "Resetting…" : "Reset Two-Step Verification"}
						</button>
					</div>
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
						Unlocking cancels their current password and emails a reset link to{" "}
						<span className="font-medium text-slate-900 dark:text-white">{userToUnlock.email ?? "their address"}</span>.
						Nobody else sees the new password.
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
							{isUnlocking ? "Unlocking…" : "Unlock & Email Reset Link"}
						</button>
					</div>
				</Modal>
			)}

			{/* ── Revoke ── */}
			{userToDelete && (
				<Modal
					title="Delete Account"
					onClose={() => {
						setUserToDelete(null);
						setDeleteConfirmation("");
					}}
				>
					<p className="text-[0.8125rem] leading-relaxed text-slate-600 dark:text-slate-300">
						<span className="font-medium text-slate-900 dark:text-white">{userToDelete.fullName}</span> is signed out
						and can&apos;t sign in. You can restore the account from Recently deleted for {SOFT_DELETE_RETENTION_DAYS} days;
						after that it&apos;s removed permanently. To confirm, type{" "}
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
							{isDeleting ? "Deleting…" : "Delete Account"}
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
