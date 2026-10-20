import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

/** Standard authenticator-app settings (Google/Microsoft Authenticator, Authy, 1Password…). */
const ISSUER = "Secure Tanza";
const PERIOD = 30;
const DIGITS = 6;
/** Accept the previous and next 30 s step too, for clock drift. */
const WINDOW = 1;

function totpFor(secretBase32: string, label = "account") {
	return new OTPAuth.TOTP({
		issuer: ISSUER,
		label,
		algorithm: "SHA1",
		digits: DIGITS,
		period: PERIOD,
		secret: OTPAuth.Secret.fromBase32(secretBase32),
	});
}

export function newTotpSecret(): string {
	return new OTPAuth.Secret({ size: 20 }).base32;
}

export function currentStep(now = Date.now()): number {
	return Math.floor(now / 1000 / PERIOD);
}

/**
 * Checks a 6-digit code. Returns the time step it matched (store it as
 * totpLastStep), or null. A step at or before `lastStep` is a replay and is
 * rejected even if the code is otherwise right.
 */
export function verifyTotp(secretBase32: string, code: string, lastStep: number | null, now = Date.now()): number | null {
	const token = code.replace(/\s+/g, "");
	if (!/^\d{6}$/.test(token)) return null;
	const delta = totpFor(secretBase32).validate({ token, timestamp: now, window: WINDOW });
	if (delta === null) return null;
	const step = currentStep(now) + delta;
	if (lastStep !== null && step <= lastStep) return null;
	return step;
}

/** For tests: the code an authenticator app would show. */
export function generateTotp(secretBase32: string, now = Date.now()): string {
	return totpFor(secretBase32).generate({ timestamp: now });
}

export async function enrollmentDetails(secretBase32: string, accountLabel: string) {
	const uri = totpFor(secretBase32, accountLabel).toString();
	const qrDataUrl = await QRCode.toDataURL(uri, { margin: 1, width: 220, errorCorrectionLevel: "M" });
	// Grouped for typing into an app by hand.
	const manualKey = secretBase32.replace(/(.{4})/g, "$1 ").trim();
	return { uri, qrDataUrl, manualKey };
}
