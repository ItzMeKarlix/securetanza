import { test } from "node:test";
import assert from "node:assert/strict";
import { decryptSecret, encryptSecret, hmac } from "../lib/mfa/crypto";
import { currentStep, generateTotp, newTotpSecret, verifyTotp, enrollmentDetails } from "../lib/mfa/totp";
import { deviceLabel, normalizeBackupCode, trustDays } from "../lib/mfa/policy";

test("TOTP secrets survive encryption and every ciphertext is unique", () => {
	const secret = newTotpSecret();
	const a = encryptSecret(secret);
	const b = encryptSecret(secret);
	assert.notEqual(a, b, "random IV per encryption");
	assert.equal(decryptSecret(a), secret);
	assert.equal(decryptSecret(b), secret);
	assert.ok(!a.includes(secret), "ciphertext does not contain the secret");
});

test("tampered ciphertext is rejected, not silently decrypted", () => {
	const enc = encryptSecret(newTotpSecret());
	const parts = enc.split(":");
	const flipped = parts[3][0] === "A" ? "B" + parts[3].slice(1) : "A" + parts[3].slice(1);
	assert.throws(() => decryptSecret([parts[0], parts[1], parts[2], flipped].join(":")));
});

test("email-code HMAC is deterministic and keyed", () => {
	assert.equal(hmac("x"), hmac("x"));
	assert.notEqual(hmac("mfa-email:1:123456"), hmac("mfa-email:2:123456"));
});

test("TOTP accepts the current code and one step of clock drift either way", () => {
	const secret = newTotpSecret();
	const now = Date.UTC(2026, 9, 21, 12, 0, 10);
	assert.equal(verifyTotp(secret, generateTotp(secret, now), null, now), currentStep(now));
	assert.notEqual(verifyTotp(secret, generateTotp(secret, now - 30_000), null, now), null, "previous step");
	assert.notEqual(verifyTotp(secret, generateTotp(secret, now + 30_000), null, now), null, "next step");
});

test("TOTP rejects codes outside the window, wrong codes and malformed input", () => {
	const secret = newTotpSecret();
	const now = Date.UTC(2026, 9, 21, 12, 0, 10);
	assert.equal(verifyTotp(secret, generateTotp(secret, now - 90_000), null, now), null, "3 steps old");
	assert.equal(verifyTotp(newTotpSecret(), generateTotp(secret, now), null, now), null, "another secret");
	assert.equal(verifyTotp(secret, "12345", null, now), null);
	assert.equal(verifyTotp(secret, "abcdef", null, now), null);
	assert.notEqual(verifyTotp(secret, generateTotp(secret, now).replace(/(\d{3})/, "$1 "), null, now), null, "spaces allowed");
});

test("TOTP refuses a replayed code and anything older than the last accepted step", () => {
	const secret = newTotpSecret();
	const now = Date.UTC(2026, 9, 21, 12, 0, 10);
	const code = generateTotp(secret, now);
	const step = verifyTotp(secret, code, null, now);
	assert.notEqual(step, null);
	assert.equal(verifyTotp(secret, code, step, now), null, "same code again");
	assert.equal(verifyTotp(secret, generateTotp(secret, now - 30_000), step, now), null, "earlier step");
	assert.notEqual(verifyTotp(secret, generateTotp(secret, now + 30_000), step, now + 30_000), null, "next step still fine");
});

test("enrollment produces a scannable otpauth URI, a QR image and a grouped manual key", async () => {
	const secret = newTotpSecret();
	const d = await enrollmentDetails(secret, "juan@example.gov.ph");
	assert.match(d.uri, /^otpauth:\/\/totp\/Secure%20Tanza:juan%40example\.gov\.ph\?/);
	assert.match(d.uri, /issuer=Secure%20Tanza/);
	assert.match(d.qrDataUrl, /^data:image\/png;base64,/);
	assert.equal(d.manualKey.replace(/ /g, ""), secret);
});

test("backup codes are normalised from however people type them", () => {
	assert.equal(normalizeBackupCode("abcd-2345"), "ABCD-2345");
	assert.equal(normalizeBackupCode(" ABCD 2345 "), "ABCD-2345");
	assert.equal(normalizeBackupCode("abcd2345"), "ABCD-2345");
	assert.equal(normalizeBackupCode("abc"), null);
});

test("trusted-browser windows: 30 days for admins, 60 for staff, env-overridable within bounds", () => {
	delete process.env.MFA_TRUST_DAYS_ADMIN;
	delete process.env.MFA_TRUST_DAYS_STAFF;
	assert.equal(trustDays(true), 30);
	assert.equal(trustDays(false), 60);
	process.env.MFA_TRUST_DAYS_STAFF = "90";
	assert.equal(trustDays(false), 90);
	process.env.MFA_TRUST_DAYS_STAFF = "9999";
	assert.equal(trustDays(false), 60, "out-of-range values fall back");
	delete process.env.MFA_TRUST_DAYS_STAFF;
});

test("device labels are recognisable", () => {
	assert.equal(
		deviceLabel("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36"),
		"Chrome on Windows"
	);
	assert.equal(
		deviceLabel("Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36 Edg/141.0"),
		"Edge on Windows"
	);
	assert.equal(deviceLabel("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1"), "Safari on iOS");
	assert.equal(deviceLabel(null), "Browser on unknown device");
});
