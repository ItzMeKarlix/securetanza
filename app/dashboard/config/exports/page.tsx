"use client";

import React, { useCallback, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { OperatorOnly } from "../_components/settings-shell";
import {
	DataRow,
	EmptyState,
	Field,
	Notice,
	PageHeader,
	Panel,
	Row,
	Rows,
	SaveState,
	Section,
	PAGE_FORM,
	SplitLayout,
	SkeletonRows,
	btnOutline,
} from "../_components/settings-ui";
import { cn } from "@/lib/utils";
import { UnsavedChangesBar } from "../_components/unsaved-changes";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAYS_OF_MONTH = Array.from({ length: 28 }, (_, i) => i + 1);

interface ExportFile {
	id: string;
	fileName: string;
	label: string | null;
	periodLabel: string | null;
	sizeBytes: number;
	createdAt: string;
}

interface RunStatus {
	nextRunAt: string | null;
	lastRunAt: string | null;
	lastRunError: string | null;
}

/** Schedule times are station time, so show them in station time whatever the browser's zone. */
function stationTime(iso: string) {
	return new Date(iso).toLocaleString("en-PH", {
		timeZone: "Asia/Manila",
		weekday: "short",
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
	});
}

function fileSize(bytes: number) {
	return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DataExportsPage() {
	return (
		<OperatorOnly>
			<DataExports />
		</OperatorOnly>
	);
}

function DataExports() {
	const [enabled, setEnabled] = useState(false);
	const [frequency, setFrequency] = useState("weekly");
	const [dayOfWeek, setDayOfWeek] = useState("Monday");
	const [dayOfMonth, setDayOfMonth] = useState("1");
	const [monthlyOn, setMonthlyOn] = useState("1"); // day of year for annually
	const [timeOfDay, setTimeOfDay] = useState("00:00");
	const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const { user } = useAuth();
	const [status, setStatus] = useState<RunStatus | null>(null);
	const [files, setFiles] = useState<ExportFile[] | null>(null);
	const [exporting, setExporting] = useState(false);

	const loadStatus = useCallback(() => {
		fetch("/api/exports/schedule")
			.then((res) => res.json())
			.then((data) =>
				setStatus({
					nextRunAt: data.nextRunAt ?? null,
					lastRunAt: data.schedule?.lastRunAt ?? null,
					lastRunError: data.schedule?.lastRunError ?? null,
				})
			)
			.catch(() => {});
		fetch("/api/exports/history")
			.then((res) => res.json())
			.then((data) => setFiles(Array.isArray(data.data) ? data.data : []))
			.catch(() => setFiles([]));
	}, []);

	React.useEffect(() => {
		loadStatus();
	}, [loadStatus]);

	const exportNow = async () => {
		setExporting(true);
		try {
			const res = await fetch("/api/exports/run", { method: "POST" });
			const data = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(data.error || "The export failed. Please try again.");
			toast.success(
				data.emailed
					? `Report for ${data.periodLabel} sent to ${user?.email} (${data.offenses} offenses).`
					: `Report for ${data.periodLabel} is ready below (${data.offenses} offenses).`
			);
			loadStatus();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "The export failed. Please try again.");
		} finally {
			setExporting(false);
		}
	};

	React.useEffect(() => {
		fetch("/api/exports/schedule")
			.then((res) => res.json())
			.then((data) => {
				if (data.schedule) {
					setEnabled(data.schedule.enabled);
					setFrequency(data.schedule.frequency);
					setDayOfWeek(data.schedule.dayOfWeek || "Monday");
					setDayOfMonth(data.schedule.dayOfMonth || "1");
					setMonthlyOn(data.schedule.monthlyOn || "1");
					setTimeOfDay(data.schedule.timeOfDay || "00:00");
				}
			})
			.catch((err) => console.error("Failed to load schedule:", err));
	}, []);

	const handleSave = async () => {
		setSaveState("saving");
		try {
			const res = await fetch("/api/exports/schedule", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ enabled, frequency, dayOfWeek, dayOfMonth, monthlyOn, timeOfDay }),
			});
			if (!res.ok) throw new Error("Failed to save schedule");
			setSaveState("saved");
			setHasUnsavedChanges(false);
			loadStatus();
			setTimeout(() => setSaveState((s) => (s === "saved" ? "idle" : s)), 3000);
		} catch (error) {
			console.error("Error saving schedule:", error);
			setSaveState("error");
		}
	};

	return (
		<div className={cn(PAGE_FORM, "space-y-12")}>
			<PageHeader title="Data Exports" />

			<SplitLayout>
			<Section
				title="Scheduled Exports"
				description="Automatically generate an offense report on a recurring schedule. Each report covers the complete day, week or month before it runs."
			>
				<Rows>
					<Row
						label="Enable Scheduled Exports"
						description="Turn on to activate automatic report generation."
						htmlFor="exports-enabled"
					>
						<Switch id="exports-enabled" checked={enabled} onCheckedChange={(val) => { setEnabled(val); setHasUnsavedChanges(true); }} />
					</Row>
				</Rows>

				<fieldset
					disabled={!enabled}
					className={`transition-opacity duration-200 ${enabled ? "" : "opacity-45"}`}
				>
					<legend className="sr-only">Export schedule</legend>

										<div className="space-y-5 pt-6">
						<Field label="Frequency">
							<div className="flex max-w-[23.75rem] gap-1.5">
								{["daily", "weekly", "monthly"].map((f) => (
									<button
										key={f}
										type="button"
										aria-pressed={frequency === f}
										onClick={() => { setFrequency(f); setHasUnsavedChanges(true); }}
										className={`h-9 flex-1 rounded-md border text-[0.8125rem] font-medium capitalize transition-colors ${
											frequency === f
												? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900"
												: "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-white/[0.12] dark:text-slate-300 dark:hover:border-white/25"
										}`}
									>
										{f}
									</button>
								))}
							</div>
						</Field>

						{frequency === "weekly" && (
							<Field label="Generate every" htmlFor="day-of-week">
								<div className="max-w-[23.75rem]">
									<Select value={dayOfWeek} onValueChange={(val) => { setDayOfWeek(val); setHasUnsavedChanges(true); }}>
										<SelectTrigger
											id="day-of-week"
											className="h-9 border-slate-200 bg-white text-[0.875rem] dark:border-white/[0.12] dark:bg-white/[0.03]"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{DAYS_OF_WEEK.map((d) => (
												<SelectItem key={d} value={d}>
													{d}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</Field>
						)}

						{frequency === "monthly" && (
							<Field label="Generate on day" htmlFor="day-of-month">
								<div className="max-w-[23.75rem]">
									<Select value={dayOfMonth} onValueChange={(val) => { setDayOfMonth(val); setHasUnsavedChanges(true); }}>
										<SelectTrigger
											id="day-of-month"
											className="h-9 border-slate-200 bg-white text-[0.875rem] dark:border-white/[0.12] dark:bg-white/[0.03]"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{DAYS_OF_MONTH.map((d) => (
												<SelectItem key={d} value={String(d)}>
													{d === 1 ? "1st" : d === 2 ? "2nd" : d === 3 ? "3rd" : `${d}th`} of the
													month
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</Field>
						)}

						<Field label="Generate at" description="Station time (Philippine Standard Time, UTC+8)." htmlFor="time-of-day">
							<div className="max-w-[23.75rem]">
								<input
									id="time-of-day"
									type="time"
									value={timeOfDay}
									onChange={(e) => { setTimeOfDay(e.target.value); setHasUnsavedChanges(true); }}
									// [color-scheme] themes the native clock picker itself, not just this
									// field's own chrome — without it the popup ignores dark mode.
									className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-[0.875rem] text-slate-900 [color-scheme:light] focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-white/[0.12] dark:bg-white/[0.03] dark:text-slate-100 dark:[color-scheme:dark]"
								/>
							</div>
						</Field>
					</div>

					<p className="pt-8 text-[0.8125rem] leading-relaxed text-slate-500 dark:text-slate-400">
						{user?.email
							? `Each report is emailed to ${user.email} as an Excel file, and kept under Your reports for 14 days.`
							: "Your account has no email address, so reports are only kept under Your reports (for 14 days)."}
					</p>
				</fieldset>
			</Section>

			<Section
				title="Your reports"
				description="What has run, what runs next, and the reports you can download."
			>
				<Rows>
					<DataRow label="Next report" value={status?.nextRunAt ? stationTime(status.nextRunAt) : "Scheduled exports are off"} />
					<DataRow label="Last scheduled report" value={status?.lastRunAt ? stationTime(status.lastRunAt) : "None yet"} />
					<Row
						label="Export now"
						description={`Makes the ${frequency} report for the latest complete period right away${user?.email ? " and emails it to you" : ""}.`}
					>
						<button type="button" onClick={() => void exportNow()} disabled={exporting} className={btnOutline}>
							{exporting && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
							{exporting ? "Exporting…" : "Export now"}
						</button>
					</Row>
				</Rows>

				{status?.lastRunError && (
					<div className="pt-4">
						<Notice tone="error">{status.lastRunError}</Notice>
					</div>
				)}

				<div className="pt-6">
					{files === null ? (
						<SkeletonRows count={2} />
					) : files.length === 0 ? (
						<Panel>
							<EmptyState title="No reports yet" hint="Reports appear here when the schedule runs, or when you use Export now." />
						</Panel>
					) : (
						<Panel>
							<ul className="divide-y divide-slate-200 dark:divide-white/[0.08]">
								{files.map((file) => (
									<li key={file.id} className="flex items-center justify-between gap-4 px-4 py-3">
										<div className="min-w-0">
											<p className="truncate text-[0.875rem] font-medium text-slate-900 dark:text-slate-100">
												{file.periodLabel ?? file.fileName}
											</p>
											<p className="truncate text-[0.78rem] tabular-nums text-slate-500 dark:text-slate-400">
												{file.label} · {fileSize(file.sizeBytes)} · made {stationTime(file.createdAt)}
											</p>
										</div>
										<a href={`/api/exports/${file.id}`} className={btnOutline} download>
											<Download className="h-3.5 w-3.5" aria-hidden="true" />
											<span className="sr-only">Download report for {file.periodLabel ?? file.fileName}</span>
											<span aria-hidden="true">Download</span>
										</a>
									</li>
								))}
							</ul>
						</Panel>
					)}
				</div>
			</Section>
			</SplitLayout>

			<UnsavedChangesBar
				show={hasUnsavedChanges}
				saving={saveState === "saving"}
				onSave={handleSave}
			/>
		</div>
	);
}
