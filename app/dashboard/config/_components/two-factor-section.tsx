"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Monitor, ShieldCheck, ShieldAlert } from "lucide-react";
import { Section, Rows, Row, btnOutline, btnPrimary, btnGhost, inputBase } from "./settings-ui";
import { Modal } from "./settings-modal";
import { BackupCodesPanel } from "@/components/auth/backup-codes-panel";
import { cn } from "@/lib/utils";

interface Device {
	id: number;
	label: string;
	createdAt: string;
	expiresAt: string;
	lastUsedAt: string | null;
	current: boolean;
}
interface Status {
	enabled: boolean;
	enabledAt: string | null;
	backupCodesLeft: number;
	trustDays: number;
	devices: Device[];
}

type Action = "replace" | "backup-codes" | "revoke-all";

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

/** Settings → Profile: authenticator, backup codes and trusted browsers. */
export function TwoFactorSection() {
	const [status, setStatus] = useState<Status | null>(null);
	const [loadError, setLoadError] = useState(false);
	// Step-up: which sensitive action is waiting for a fresh code.
	const [pending, setPending] = useState<Action | null>(null);
	const [setup, setSetup] = useState<{ qrDataUrl: string; manualKey: string; account: string } | null>(null);
	const [newCodes, setNewCodes] = useState<string[] | null>(null);

	// Bumping this re-fetches the status.
	const [reloadKey, setReloadKey] = useState(0);
	const load = useCallback(() => setReloadKey((k) => k + 1), []);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const res = await fetch("/api/auth/mfa/status", { cache: "no-store" });
				if (!res.ok) throw new Error();
				const data: Status = await res.json();
				if (!cancelled) {
					setStatus(data);
					setLoadError(false);
				}
			} catch {
				if (!cancelled) setLoadError(true);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [reloadKey]);

	/** Runs the action once the step-up code is accepted (or straight away when 2FA isn't on yet). */
	const run = async (action: Action, factor?: { method: "totp" | "backup"; code: string }): Promise<string | null> => {
		const body = JSON.stringify(factor ?? {});
		const headers = { "Content-Type": "application/json" };
		const req =
			action === "replace"
				? fetch("/api/auth/mfa/enroll/start", { method: "POST", headers, body })
				: action === "backup-codes"
				? fetch("/api/auth/mfa/backup-codes", { method: "POST", headers, body })
				: fetch("/api/auth/mfa/devices", { method: "DELETE", headers, body });
		const res = await req;
		const data = await res.json().catch(() => ({}));
		if (!res.ok) {
			if (data.locked) window.location.replace("/login?reason=expired");
			return data.error || "Something went wrong.";
		}
		setPending(null);
		if (action === "replace") setSetup(data);
		if (action === "backup-codes") setNewCodes(data.backupCodes);
		if (action === "revoke-all") {
			toast.success(data.revoked ? `Stopped trusting ${data.revoked} browser${data.revoked === 1 ? "" : "s"}` : "No trusted browsers");
			load();
		}
		return null;
	};

	const revokeOne = async (device: Device) => {
		const res = await fetch(`/api/auth/mfa/devices/${device.id}`, { method: "DELETE" });
		if (res.ok) {
			toast.success(`${device.label} will ask for a code next time`);
			load();
		} else toast.error("Couldn't revoke that browser");
	};

	return (
		<Section
			title="Two-Step Verification"
			description="A code from your authenticator app is needed at sign-in, on top of your password."
		>
			<Rows>
				{!status ? (
					<p className="py-5 text-[0.8125rem] text-slate-500 dark:text-slate-400">
						{loadError ? "Couldn't load your two-step verification settings." : "Loading…"}
					</p>
				) : (
					<>
						<Row
							label="Authenticator app"
							description={
								status.enabled && status.enabledAt
									? `On since ${fmt(status.enabledAt)}. Replacing it signs out your other sessions.`
									: "Not set up yet. You'll need it to sign in next time."
							}
						>
							<div className="flex items-center gap-3">
								<span
									className={cn(
										"inline-flex items-center gap-1 text-[0.8125rem] font-medium",
										status.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
									)}
								>
									{status.enabled ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
									{status.enabled ? "On" : "Off"}
								</span>
								<button
									type="button"
									className={btnOutline}
									onClick={() => (status.enabled ? setPending("replace") : void run("replace"))}
								>
									{status.enabled ? "Replace app" : "Set up"}
								</button>
							</div>
						</Row>

						{status.enabled && (
							<Row
								label="Backup codes"
								description={`${status.backupCodesLeft} of 10 left. Each signs you in once if you don't have your phone.`}
							>
								<button type="button" className={btnOutline} onClick={() => setPending("backup-codes")}>
									Generate new codes
								</button>
							</Row>
						)}

						{status.enabled && (
							<div className="py-5">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-[0.875rem] font-medium text-slate-900 dark:text-white">Trusted browsers</p>
										<p className="mt-0.5 text-[0.8125rem] leading-relaxed text-slate-500 dark:text-slate-400">
											These skip the code for up to {status.trustDays} days. Your password is still required. Changing
											your password removes them all.
										</p>
									</div>
									{status.devices.length > 0 && (
										<button type="button" className={cn(btnGhost, "shrink-0")} onClick={() => setPending("revoke-all")}>
											Revoke all
										</button>
									)}
								</div>
								{status.devices.length === 0 ? (
									<p className="mt-3 text-[0.8125rem] text-slate-500 dark:text-slate-400">No trusted browsers.</p>
								) : (
									<ul className="mt-3 divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-white/[0.07] dark:border-white/[0.09]">
										{status.devices.map((d) => (
											<li key={d.id} className="flex items-center gap-3 px-3 py-2.5">
												<Monitor className="h-4 w-4 shrink-0 text-slate-400" />
												<div className="min-w-0 flex-1">
													<p className="text-[0.8125rem] font-medium text-slate-900 dark:text-white">
														{d.label}
														{d.current && (
															<span className="ml-2 rounded border border-sky-200 px-1.5 py-0.5 text-[0.6875rem] font-medium text-sky-700 dark:border-sky-500/25 dark:text-sky-300">
																This browser
															</span>
														)}
													</p>
													<p className="text-[0.75rem] text-slate-500 dark:text-slate-400">
														Trusted {fmt(d.createdAt)} · expires {fmt(d.expiresAt)}
													</p>
												</div>
												<button type="button" className={btnGhost} onClick={() => void revokeOne(d)}>
													Revoke
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						)}
					</>
				)}
			</Rows>

			{pending && (
				<StepUpDialog
					action={pending}
					onCancel={() => setPending(null)}
					onSubmit={(factor) => run(pending, factor)}
				/>
			)}

			{setup && (
				<ReplaceAppDialog
					setup={setup}
					onClose={() => setSetup(null)}
					onDone={(codes) => {
						setSetup(null);
						setNewCodes(codes);
						toast.success("New authenticator app is set up");
						load();
					}}
				/>
			)}

			{newCodes && (
				<Modal title="Your new backup codes" onClose={() => undefined}>
					<BackupCodesPanel
						tone="settings"
						codes={newCodes}
						continueLabel="Done"
						onContinue={() => {
							setNewCodes(null);
							load();
						}}
					/>
				</Modal>
			)}
		</Section>
	);
}

const ACTION_COPY: Record<Action, { title: string; body: string; confirm: string }> = {
	replace: {
		title: "Replace authenticator app",
		body: "Enter a code from your current app first. After you scan the new code, the old app stops working.",
		confirm: "Continue",
	},
	"backup-codes": {
		title: "Generate new backup codes",
		body: "Enter a code from your authenticator app. Your current backup codes will stop working.",
		confirm: "Generate",
	},
	"revoke-all": {
		title: "Revoke all trusted browsers",
		body: "Enter a code from your authenticator app. Every browser will ask for a code at its next sign-in.",
		confirm: "Revoke all",
	},
};

function StepUpDialog({
	action,
	onCancel,
	onSubmit,
}: {
	action: Action;
	onCancel: () => void;
	onSubmit: (factor: { method: "totp" | "backup"; code: string }) => Promise<string | null>;
}) {
	const [method, setMethod] = useState<"totp" | "backup">("totp");
	const [code, setCode] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");
	const copy = ACTION_COPY[action];
	const ready = method === "totp" ? code.length === 6 : code.replace(/[^0-9a-z]/gi, "").length === 8;

	return (
		<Modal title={copy.title} onClose={onCancel}>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					if (!ready || busy) return;
					setBusy(true);
					setError((await onSubmit({ method, code })) ?? "");
					setBusy(false);
					setCode("");
				}}
				className="space-y-4"
			>
				<p className="text-[0.8125rem] leading-relaxed text-slate-600 dark:text-slate-300">{copy.body}</p>
				<input
					autoFocus
					aria-label={method === "totp" ? "Authenticator code" : "Backup code"}
					inputMode={method === "totp" ? "numeric" : "text"}
					autoComplete="one-time-code"
					value={code}
					onChange={(e) =>
						setCode(method === "totp" ? e.target.value.replace(/\D/g, "").slice(0, 6) : e.target.value.toUpperCase().slice(0, 9))
					}
					placeholder={method === "totp" ? "000000" : "XXXX-XXXX"}
					className={cn(inputBase, "h-11 text-center font-mono text-lg tracking-[0.35em]")}
				/>
				{error && <p className="text-[0.8125rem] text-red-600 dark:text-red-400">{error}</p>}
				<button
					type="button"
					className="text-[0.8125rem] font-medium text-[#0369A1] hover:underline dark:text-[#7DD3FC]"
					onClick={() => {
						setMethod(method === "totp" ? "backup" : "totp");
						setCode("");
						setError("");
					}}
				>
					{method === "totp" ? "Use a backup code instead" : "Use my authenticator app"}
				</button>
				<div className="flex justify-end gap-2 pt-1">
					<button type="button" onClick={onCancel} className={btnOutline}>
						Cancel
					</button>
					<button type="submit" disabled={!ready || busy} className={btnPrimary}>
						{busy ? "Checking…" : copy.confirm}
					</button>
				</div>
			</form>
		</Modal>
	);
}

function ReplaceAppDialog({
	setup,
	onClose,
	onDone,
}: {
	setup: { qrDataUrl: string; manualKey: string; account: string };
	onClose: () => void;
	onDone: (backupCodes: string[]) => void;
}) {
	const [code, setCode] = useState("");
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState("");

	return (
		<Modal title="Scan with your new app" onClose={onClose}>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					if (code.length !== 6 || busy) return;
					setBusy(true);
					setError("");
					const res = await fetch("/api/auth/mfa/enroll/confirm", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ code }),
					});
					const data = await res.json().catch(() => ({}));
					setBusy(false);
					if (res.ok) onDone(data.backupCodes);
					else {
						setError(data.error || "That code doesn't match.");
						setCode("");
						if (data.expired) onClose();
					}
				}}
				className="space-y-4"
			>
				<div className="flex justify-center">
					<div className="rounded-lg border border-slate-200 bg-white p-2.5 dark:border-white/10">
						<Image src={setup.qrDataUrl} alt="QR code for your authenticator app" width={180} height={180} unoptimized />
					</div>
				</div>
				<p className="text-center font-mono text-[0.75rem] tracking-wider text-slate-500 dark:text-slate-400 break-all">
					{setup.manualKey}
				</p>
				<input
					autoFocus
					aria-label="Code from the new app"
					inputMode="numeric"
					autoComplete="one-time-code"
					value={code}
					onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
					placeholder="000000"
					className={cn(inputBase, "h-11 text-center font-mono text-lg tracking-[0.35em]")}
				/>
				{error && <p className="text-[0.8125rem] text-red-600 dark:text-red-400">{error}</p>}
				<div className="flex justify-end gap-2">
					<button type="button" onClick={onClose} className={btnOutline}>
						Cancel
					</button>
					<button type="submit" disabled={code.length !== 6 || busy} className={btnPrimary}>
						{busy ? "Checking…" : "Verify & switch"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
