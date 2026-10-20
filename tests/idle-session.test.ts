import { test } from "node:test";
import assert from "node:assert/strict";
import { IdleSessionTimer, onceAsync, idleTimeoutMs, isIdleProtectedPath } from "../lib/idle-session";

test("operational map, compare and dashboard routes are protected while public pages are idle-free", () => {
  for (const path of ["/", "/map", "/compare", "/dashboard", "/dashboard/config", "/dashboard/reports"]) {
    assert.equal(isIdleProtectedPath(path), true);
  }
  for (const path of ["/login", "/docs"]) assert.equal(isIdleProtectedPath(path), false);
});

function harness(timeoutMs: number | null = 15 * 60_000) {
  let now = 0;
  let id = 0;
  let expirations = 0;
  const scheduled = new Map<number, { at: number; callback: () => void }>();
  const warnings: Array<number | null> = [];
  const timer = new IdleSessionTimer({
    now: () => now,
    schedule: (callback, delay) => {
      scheduled.set(++id, { at: now + delay, callback });
      return id;
    },
    cancel: (key) => { scheduled.delete(key as number); },
    onWarning: (seconds) => warnings.push(seconds),
    onExpire: () => { expirations++; },
  });
  timer.configure(timeoutMs);
  return {
    timer, warnings, scheduled,
    expirations: () => expirations,
    jump: (time: number) => { now = time; },
    advance: (time: number) => {
      while (true) {
        const next = [...scheduled.entries()].sort((a, b) => a[1].at - b[1].at)[0];
        if (!next || next[1].at > time) break;
        scheduled.delete(next[0]);
        now = next[1].at;
        next[1].callback();
      }
      now = time;
    },
  };
}

test("waits until the final minute, counts exact seconds, and expires once", () => {
  const h = harness();
  assert.equal([...h.scheduled.values()][0].at, 14 * 60_000);
  h.advance(14 * 60_000 - 1);
  assert.deepEqual(h.warnings, []);
  h.advance(14 * 60_000);
  assert.deepEqual(h.warnings, [60]);
  h.advance(14 * 60_000 + 1_000);
  assert.equal(h.warnings.at(-1), 59);
  h.advance(15 * 60_000);
  assert.equal(h.expirations(), 1);
  assert.equal(h.warnings.at(-1), null);
  h.timer.check();
  h.timer.activity();
  assert.equal(h.expirations(), 1);
  assert.equal(h.scheduled.size, 0);
});

test("activity dismisses the warning and renews the actual deadline", () => {
  const h = harness();
  h.advance(850_000);
  h.timer.activity();
  assert.equal(h.warnings.at(-1), null);
  h.advance(900_000);
  assert.equal(h.expirations(), 0);
  h.advance(1_690_000);
  assert.equal(h.warnings.at(-1), 60);
});

test("unchanged heartbeat configuration does not renew inactivity", () => {
  const h = harness();
  for (let t = 30_000; t < 900_000; t += 30_000) {
    h.advance(t);
    h.timer.configure(900_000);
  }
  h.advance(900_000);
  assert.equal(h.expirations(), 1);
});

test("settings changes preserve activity and recompute the deadline safely", () => {
  const h = harness();
  h.advance(100_000);
  h.timer.activity();
  h.advance(200_000);
  h.timer.configure(120_000);
  assert.equal(h.warnings.at(-1), 20);
  h.timer.configure(600_000);
  assert.equal(h.warnings.at(-1), null);
  h.advance(640_000);
  assert.equal(h.warnings.at(-1), 60);
  h.timer.configure(60_000);
  assert.equal(h.expirations(), 1);
});

test("disabled and disposed timers have no warning, scheduled work, or expiry", () => {
  const h = harness(null);
  h.advance(10_000_000);
  h.timer.activity();
  assert.equal(h.scheduled.size, 0);
  assert.equal(h.expirations(), 0);
  h.timer.configure(30_000);
  assert.equal(h.warnings.at(-1), 30);
  h.timer.dispose();
  h.advance(20_000_000);
  assert.equal(h.warnings.at(-1), null);
  assert.equal(h.scheduled.size, 0);
  assert.equal(h.expirations(), 0);
});

test("short timeouts bound the warning and sleeping tabs cannot revive expired sessions", () => {
  const h = harness(10_000);
  assert.equal(h.warnings.at(-1), 10);
  h.jump(10_001);
  h.timer.activity();
  assert.equal(h.expirations(), 1);
  assert.equal(h.scheduled.size, 0);
});

test("resuming a throttled tab derives remaining time from the deadline", () => {
  const h = harness();
  h.jump(899_200);
  h.timer.check();
  assert.equal(h.warnings.at(-1), 1);
  h.advance(900_000);
  assert.equal(h.expirations(), 1);
});

test("invalid saved preferences retain the default timeout", () => {
  for (const value of [undefined, 0, -1, NaN, Infinity]) {
    assert.equal(idleTimeoutMs(value), 900_000);
  }
  assert.equal(idleTimeoutMs(5), 300_000);
});

test("concurrent manual and idle logouts share a single in-flight request", async () => {
  let requests = 0;
  let finish!: () => void;
  const logout = onceAsync(async () => {
    requests++;
    await new Promise<void>((resolve) => { finish = resolve; });
  });
  const first = logout();
  const second = logout();
  assert.equal(first, second);
  assert.equal(requests, 1);
  finish();
  await first;
  await logout();
  assert.equal(requests, 1);
});
