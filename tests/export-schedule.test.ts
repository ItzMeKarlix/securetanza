import { test } from "node:test";
import assert from "node:assert/strict";
import { dueOccurrence, latestOccurrence, nextOccurrence, periodFor, RETRY_AFTER_MS } from "../lib/export-schedule";

// Station time is UTC+8: "2026-10-21T10:00+08:00" is 02:00Z.
const at = (stationIso: string) => new Date(`${stationIso}+08:00`);

test("daily runs at the station time, today or yesterday", () => {
	const daily = { frequency: "daily", timeOfDay: "08:30" };
	assert.deepEqual(latestOccurrence(daily, at("2026-10-21T10:00")), at("2026-10-21T08:30"));
	assert.deepEqual(latestOccurrence(daily, at("2026-10-21T08:00")), at("2026-10-20T08:30"));
	assert.deepEqual(nextOccurrence(daily, at("2026-10-21T10:00")), at("2026-10-22T08:30"));
});

test("weekly runs on the chosen weekday", () => {
	// 2026-10-21 is a Wednesday.
	const weekly = { frequency: "weekly", dayOfWeek: "Monday", timeOfDay: "07:00" };
	assert.deepEqual(latestOccurrence(weekly, at("2026-10-21T10:00")), at("2026-10-19T07:00"));
	assert.deepEqual(nextOccurrence(weekly, at("2026-10-21T10:00")), at("2026-10-26T07:00"));
	const wednesday = { frequency: "weekly", dayOfWeek: "Wednesday", timeOfDay: "12:00" };
	assert.deepEqual(latestOccurrence(wednesday, at("2026-10-21T10:00")), at("2026-10-14T12:00"));
});

test("monthly runs on the chosen day, across year boundaries", () => {
	const monthly = { frequency: "monthly", dayOfMonth: "5", timeOfDay: "00:00" };
	assert.deepEqual(latestOccurrence(monthly, at("2026-10-21T10:00")), at("2026-10-05T00:00"));
	assert.deepEqual(latestOccurrence(monthly, at("2027-01-03T10:00")), at("2026-12-05T00:00"));
	assert.deepEqual(nextOccurrence(monthly, at("2026-12-21T10:00")), at("2027-01-05T00:00"));
});

test("each run covers the complete period before its day", () => {
	const daily = periodFor("daily", at("2026-10-21T08:30"));
	assert.deepEqual([daily.start, daily.end, daily.label], [at("2026-10-20T00:00"), at("2026-10-21T00:00"), "October 20, 2026"]);
	const weekly = periodFor("weekly", at("2026-10-19T07:00"));
	assert.deepEqual([weekly.start, weekly.end, weekly.label], [at("2026-10-12T00:00"), at("2026-10-19T00:00"), "October 12–18, 2026"]);
	const monthly = periodFor("monthly", at("2026-01-05T00:00"));
	assert.deepEqual([monthly.start, monthly.end, monthly.label, monthly.stamp], [at("2025-12-01T00:00"), at("2026-01-01T00:00"), "December 2025", "2025-12"]);
	assert.equal(periodFor("weekly", at("2026-11-02T07:00")).label, "October 26 – November 1, 2026");
});

test("a saved schedule doesn't fire for a time that already passed", () => {
	const schedule = { enabled: true, frequency: "daily", timeOfDay: "08:30", savedAt: at("2026-10-21T09:00") };
	assert.equal(dueOccurrence(schedule, at("2026-10-21T09:01")), null);
	assert.deepEqual(dueOccurrence(schedule, at("2026-10-22T08:30")), at("2026-10-22T08:30"));
});

test("a missed run catches up once, and a finished run isn't repeated", () => {
	const base = { enabled: true, frequency: "daily", timeOfDay: "08:30", savedAt: at("2026-10-01T00:00") };
	// The app was off at 08:30; it comes back at 13:00.
	assert.deepEqual(dueOccurrence({ ...base, lastRunAt: at("2026-10-20T08:30") }, at("2026-10-21T13:00")), at("2026-10-21T08:30"));
	// Off for a week: only the latest run is due, not all seven.
	assert.deepEqual(dueOccurrence({ ...base, lastRunAt: at("2026-10-14T08:30") }, at("2026-10-21T13:00")), at("2026-10-21T08:30"));
	assert.equal(dueOccurrence({ ...base, lastRunAt: at("2026-10-21T08:31") }, at("2026-10-21T13:00")), null);
	assert.equal(dueOccurrence({ ...base, enabled: false }, at("2026-10-21T13:00")), null);
});

test("a failed run is retried after the back-off", () => {
	const failed = { enabled: true, frequency: "daily", timeOfDay: "08:30", savedAt: at("2026-10-01T00:00"), lastRunAt: at("2026-10-20T08:30"), lastAttemptAt: at("2026-10-21T08:30") };
	assert.equal(dueOccurrence(failed, at("2026-10-21T08:31")), null);
	assert.deepEqual(dueOccurrence(failed, new Date(at("2026-10-21T08:30").getTime() + RETRY_AFTER_MS)), at("2026-10-21T08:30"));
});
