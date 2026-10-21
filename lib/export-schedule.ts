/**
 * When scheduled exports run, and which offenses each run covers. Pure
 * functions, shared by the worker (backend/cron/worker.ts), the API and the
 * Data Exports page.
 *
 * Schedule times are station time. The Philippines is UTC+8 all year (no
 * daylight saving), so a fixed offset keeps runs on time whatever time zone the
 * server itself is set to.
 */

export const STATION_UTC_OFFSET_MINUTES = 8 * 60;
const OFFSET_MS = STATION_UTC_OFFSET_MINUTES * 60_000;
const DAY_MS = 24 * 60 * 60_000;

export type ExportFrequency = "daily" | "weekly" | "monthly";
export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

export interface ScheduleTiming {
	frequency: string;
	dayOfWeek?: string | null;
	dayOfMonth?: string | null;
	timeOfDay?: string | null;
}

interface StationDate {
	year: number;
	month: number; // 0-11
	day: number;
	weekday: number; // 0 = Sunday
}

function stationDate(instant: Date): StationDate {
	const shifted = new Date(instant.getTime() + OFFSET_MS);
	return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth(), day: shifted.getUTCDate(), weekday: shifted.getUTCDay() };
}

/** The instant of a station wall-clock time. Out-of-range days/months roll over like Date.UTC. */
function stationInstant(year: number, month: number, day: number, hours = 0, minutes = 0): Date {
	return new Date(Date.UTC(year, month, day, hours, minutes) - OFFSET_MS);
}

function timeParts(timeOfDay: string | null | undefined): [number, number] {
	const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeOfDay ?? "");
	return match ? [Number(match[1]), Number(match[2])] : [0, 0];
}

function monthDay(schedule: ScheduleTiming): number {
	const day = Number(schedule.dayOfMonth);
	return Number.isInteger(day) && day >= 1 && day <= 28 ? day : 1;
}

function weekday(schedule: ScheduleTiming): number {
	const index = WEEKDAYS.indexOf((schedule.dayOfWeek ?? "") as (typeof WEEKDAYS)[number]);
	return index === -1 ? 1 : index;
}

/** The most recent scheduled run at or before `now`. */
export function latestOccurrence(schedule: ScheduleTiming, now: Date): Date {
	const [h, m] = timeParts(schedule.timeOfDay);
	const today = stationDate(now);
	if (schedule.frequency === "monthly") {
		const thisMonth = stationInstant(today.year, today.month, monthDay(schedule), h, m);
		return thisMonth <= now ? thisMonth : stationInstant(today.year, today.month - 1, monthDay(schedule), h, m);
	}
	if (schedule.frequency === "weekly") {
		const back = (today.weekday - weekday(schedule) + 7) % 7;
		const candidate = stationInstant(today.year, today.month, today.day - back, h, m);
		return candidate <= now ? candidate : new Date(candidate.getTime() - 7 * DAY_MS);
	}
	const todayRun = stationInstant(today.year, today.month, today.day, h, m);
	return todayRun <= now ? todayRun : new Date(todayRun.getTime() - DAY_MS);
}

/** The first scheduled run strictly after `now`. */
export function nextOccurrence(schedule: ScheduleTiming, now: Date): Date {
	const latest = latestOccurrence(schedule, now);
	if (schedule.frequency === "monthly") {
		const date = stationDate(latest);
		const [h, m] = timeParts(schedule.timeOfDay);
		return stationInstant(date.year, date.month + 1, monthDay(schedule), h, m);
	}
	return new Date(latest.getTime() + (schedule.frequency === "weekly" ? 7 : 1) * DAY_MS);
}

export interface ExportPeriod {
	/** First instant included. */
	start: Date;
	/** First instant after the period (exclusive). */
	end: Date;
	/** "October 20, 2026", "October 13–19, 2026", "September 2026". */
	label: string;
	/** For file names: "2026-10-20", "2026-10-13_to_2026-10-19", "2026-09". */
	stamp: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const iso = (d: StationDate) => `${d.year}-${String(d.month + 1).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;

/**
 * The offenses a run covers: the complete period before the day it runs.
 * Daily → the previous day; weekly → the previous 7 days; monthly → the
 * previous calendar month.
 */
export function periodFor(frequency: string, runAt: Date): ExportPeriod {
	const runDay = stationDate(runAt);
	if (frequency === "monthly") {
		const start = stationInstant(runDay.year, runDay.month - 1, 1);
		const end = stationInstant(runDay.year, runDay.month, 1);
		const first = stationDate(start);
		return { start, end, label: `${MONTHS[first.month]} ${first.year}`, stamp: iso(first).slice(0, 7) };
	}
	const days = frequency === "weekly" ? 7 : 1;
	const end = stationInstant(runDay.year, runDay.month, runDay.day);
	const start = stationInstant(runDay.year, runDay.month, runDay.day - days);
	const first = stationDate(start);
	const last = stationDate(new Date(end.getTime() - 1));
	if (days === 1) return { start, end, label: `${MONTHS[first.month]} ${first.day}, ${first.year}`, stamp: iso(first) };
	const label =
		first.month === last.month
			? `${MONTHS[first.month]} ${first.day}–${last.day}, ${last.year}`
			: first.year === last.year
				? `${MONTHS[first.month]} ${first.day} – ${MONTHS[last.month]} ${last.day}, ${last.year}`
				: `${MONTHS[first.month]} ${first.day}, ${first.year} – ${MONTHS[last.month]} ${last.day}, ${last.year}`;
	return { start, end, label, stamp: `${iso(first)}_to_${iso(last)}` };
}

/** How long a failed run waits before it is tried again. */
export const RETRY_AFTER_MS = 15 * 60_000;

export interface ScheduleState extends ScheduleTiming {
	enabled: boolean;
	savedAt?: Date | null;
	lastRunAt?: Date | null;
	lastAttemptAt?: Date | null;
}

/**
 * The run that is due now, or null. Only the latest missed run is caught up
 * (an app that was off for a week sends one export, not seven), runs from
 * before the schedule was saved never fire, and a failed run is retried after
 * RETRY_AFTER_MS.
 */
export function dueOccurrence(schedule: ScheduleState, now: Date): Date | null {
	if (!schedule.enabled) return null;
	const occurrence = latestOccurrence(schedule, now);
	if (schedule.savedAt && occurrence < schedule.savedAt) return null;
	if (schedule.lastRunAt && schedule.lastRunAt >= occurrence) return null;
	if (schedule.lastAttemptAt && schedule.lastAttemptAt >= occurrence && now.getTime() - schedule.lastAttemptAt.getTime() < RETRY_AFTER_MS) {
		return null;
	}
	return occurrence;
}
