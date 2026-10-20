import { randomInt } from "crypto";
import { prisma } from "@/backend/lib/prisma";
import { decryptSecret, hmac } from "./crypto";
import { verifyTotp } from "./totp";
import { consumeBackupCode } from "./backup-codes";

export type FactorMethod = "totp" | "backup" | "email";

/** Consecutive wrong codes before the account locks (password lockout is separate, at 3). */
export const MAX_MFA_FAILURES = 5;
export const EMAIL_CODE_TTL_MS = 10 * 60_000;
const EMAIL_FALLBACK_BLOCK_MS = 7 * 86_400_000;
const EMAIL_CODES_PER_WINDOW = 3;
const EMAIL_WINDOW_MS = 15 * 60_000;
const EMAIL_COOLDOWN_MS = 60_000;

export const MFA_LOCKED_MESSAGE =
	"This account is locked after too many wrong verification codes. Contact your system administrator to have it unlocked.";

type FactorUser = {
	id: number;
	totpSecretEnc: string | null;
	totpLastStep: number | null;
	mfaFailedAttempts: number;
};

const emailCodeHash = (userId: number, code: string) => hmac(`mfa-email:${userId}:${code}`);

/**
 * Checks a second-factor code without side effects on failure counting —
 * callers decide (sign-in counts failures; step-up inside the app does too).
 * TOTP success records the step so the same code can't be replayed.
 */
async function checkCode(user: FactorUser, method: FactorMethod, code: string): Promise<boolean> {
	if (method === "totp") {
		if (!user.totpSecretEnc) return false;
		const step = verifyTotp(decryptSecret(user.totpSecretEnc), code, user.totpLastStep);
		if (step === null) return false;
		// Conditional write: two requests with the same code can't both pass.
		const claimed = await prisma.user.updateMany({
			where: { id: user.id, OR: [{ totpLastStep: null }, { totpLastStep: { lt: step } }] },
			data: { totpLastStep: step },
		});
		return claimed.count === 1;
	}
	if (method === "backup") return consumeBackupCode(user.id, code);

	const digits = code.replace(/\s+/g, "");
	if (!/^\d{6}$/.test(digits)) return false;
	const claimed = await prisma.authToken.updateMany({
		where: {
			userId: user.id,
			purpose: "mfa_email",
			tokenHash: emailCodeHash(user.id, digits),
			usedAt: null,
			expiresAt: { gt: new Date() },
		},
		data: { usedAt: new Date() },
	});
	return claimed.count === 1;
}

export type VerifyOutcome = { ok: true } | { ok: false; locked: boolean; remaining: number };

/**
 * Verify a code and keep the failure counter: success resets it, the fifth
 * consecutive failure locks the account (same lock as wrong passwords).
 */
export async function verifySecondFactor(user: FactorUser, method: FactorMethod, code: string): Promise<VerifyOutcome> {
	const ok = await checkCode(user, method, code);
	if (ok) {
		if (user.mfaFailedAttempts > 0) {
			await prisma.user.update({ where: { id: user.id }, data: { mfaFailedAttempts: 0 } });
		}
		return { ok: true };
	}
	const updated = await prisma.user.update({
		where: { id: user.id },
		data: { mfaFailedAttempts: { increment: 1 } },
		select: { mfaFailedAttempts: true },
	});
	const locked = updated.mfaFailedAttempts >= MAX_MFA_FAILURES;
	if (locked) {
		await prisma.user.update({
			where: { id: user.id },
			data: { lockedAt: new Date(), sessionVersion: { increment: 1 } },
		});
	}
	return { ok: false, locked, remaining: Math.max(0, MAX_MFA_FAILURES - updated.mfaFailedAttempts) };
}

export type EmailCodeRefusal = "recent-reset" | "cooldown" | "too-many" | "no-email";

/**
 * Whether an emailed code may be sent now. Refused for 7 days after a
 * password reset done through an emailed link: otherwise inbox access alone
 * would be enough to reset the password *and* pass 2FA.
 */
export async function emailCodeRefusal(user: {
	id: number;
	email: string | null;
	passwordResetViaEmailAt: Date | null;
}): Promise<EmailCodeRefusal | null> {
	if (!user.email) return "no-email";
	if (user.passwordResetViaEmailAt && Date.now() - user.passwordResetViaEmailAt.getTime() < EMAIL_FALLBACK_BLOCK_MS) {
		return "recent-reset";
	}
	const recent = await prisma.authToken.findMany({
		where: { userId: user.id, purpose: "mfa_email", createdAt: { gt: new Date(Date.now() - EMAIL_WINDOW_MS) } },
		orderBy: { createdAt: "desc" },
		select: { createdAt: true },
	});
	if (recent[0] && Date.now() - recent[0].createdAt.getTime() < EMAIL_COOLDOWN_MS) return "cooldown";
	if (recent.length >= EMAIL_CODES_PER_WINDOW) return "too-many";
	return null;
}

/** Creates a fresh 6-digit emailed code (voiding earlier unused ones) and returns it for sending. */
export async function issueEmailCode(userId: number): Promise<string> {
	const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
	const tokenHash = emailCodeHash(userId, code);
	await prisma.$transaction([
		prisma.authToken.updateMany({
			where: { userId, purpose: "mfa_email", usedAt: null },
			data: { usedAt: new Date() },
		}),
		// token_hash is unique and the hash is deterministic per (user, code): drop an
		// old, already-voided row that happens to share this code before inserting.
		prisma.authToken.deleteMany({ where: { tokenHash } }),
		prisma.authToken.create({
			data: {
				userId,
				purpose: "mfa_email",
				tokenHash,
				expiresAt: new Date(Date.now() + EMAIL_CODE_TTL_MS),
			},
		}),
	]);
	return code;
}
