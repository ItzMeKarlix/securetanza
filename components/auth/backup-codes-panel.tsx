"use client";

import { useState } from "react";
import { Check, Copy, Download, Printer } from "lucide-react";
import { AUTH_CHECKBOX, AUTH_PRIMARY, AUTH_SECONDARY } from "./auth-shell";

/**
 * Shows freshly generated backup codes exactly once, with copy / download /
 * print, and makes the person confirm they saved them before moving on.
 * `tone` matches the surface: the sign-in pages, or the settings page (both light and dark).
 */
export function BackupCodesPanel({
	codes,
	onContinue,
	continueLabel = "Continue",
	tone = "auth",
}: {
	codes: string[];
	onContinue: () => void;
	continueLabel?: string;
	tone?: "auth" | "settings";
}) {
	const [saved, setSaved] = useState(false);
	const [copied, setCopied] = useState(false);
	const text = `Secure Tanza backup codes\nEach code works once. Keep them somewhere safe.\n\n${codes.join("\n")}\n`;

	const download = () => {
		const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
		const a = document.createElement("a");
		a.href = url;
		a.download = "secure-tanza-backup-codes.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	const print = () => {
		const w = window.open("", "_blank", "width=420,height=560");
		if (!w) return;
		w.document.write(
			`<title>Secure Tanza backup codes</title><body style="font-family:system-ui;padding:24px"><h2>Secure Tanza backup codes</h2><p>Each code works once.</p><pre style="font-size:18px;line-height:1.8">${codes.join("\n")}</pre></body>`
		);
		w.document.close();
		w.focus();
		w.print();
	};

	const auth = tone === "auth";
	const btn = auth
		? `${AUTH_SECONDARY} h-9 flex-1 text-xs`
		: "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-200 text-[0.8125rem] font-medium text-slate-700 hover:bg-slate-50 dark:border-white/[0.12] dark:text-slate-200 dark:hover:bg-white/[0.06] transition-colors";

	return (
		<div className="space-y-4">
			<p className={auth ? "text-sm leading-relaxed text-slate-600 dark:text-slate-400" : "text-[0.8125rem] text-slate-600 dark:text-slate-300 leading-relaxed"}>
				If you lose your phone, each of these codes signs you in once. They won&apos;t be shown again — save them
				somewhere safe, away from your phone.
			</p>
			<ol
				className={
					auth
						? "grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-950 dark:border-white/10 dark:bg-slate-950/50 dark:text-white"
						: "grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-[0.875rem] text-slate-900 dark:border-white/[0.09] dark:bg-white/[0.03] dark:text-white"
				}
			>
				{codes.map((c) => (
					<li key={c} className="tracking-wider">{c}</li>
				))}
			</ol>
			<div className="flex gap-2">
				<button
					type="button"
					className={btn}
					onClick={async () => {
						await navigator.clipboard.writeText(text);
						setCopied(true);
						setTimeout(() => setCopied(false), 2500);
					}}
				>
					{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
					{copied ? "Copied" : "Copy"}
				</button>
				<button type="button" className={btn} onClick={download}>
					<Download className="h-3.5 w-3.5" /> Download
				</button>
				<button type="button" className={btn} onClick={print}>
					<Printer className="h-3.5 w-3.5" /> Print
				</button>
			</div>
			<label className={`flex items-start gap-2.5 cursor-pointer ${auth ? "text-sm text-slate-700 dark:text-slate-300" : "text-[0.8125rem] text-slate-700 dark:text-slate-300"}`}>
				<input
					type="checkbox"
					checked={saved}
					onChange={(e) => setSaved(e.target.checked)}
					className={auth ? AUTH_CHECKBOX : "mt-0.5 h-4 w-4 accent-[#0EA5E9]"}
				/>
				I&apos;ve saved these backup codes
			</label>
			<button
				type="button"
				disabled={!saved}
				onClick={onContinue}
				className={
					auth
						? AUTH_PRIMARY
						: "inline-flex h-9 w-full items-center justify-center rounded-md bg-slate-900 px-3.5 text-[0.8125rem] font-medium text-white hover:bg-slate-700 disabled:opacity-40 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
				}
			>
				{continueLabel}
			</button>
		</div>
	);
}
