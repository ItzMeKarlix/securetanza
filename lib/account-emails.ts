import { z } from "zod";
import { prisma } from "@/backend/lib/prisma";
import { isAllowedEmailDomain, isValidEmail, normalizeEmail } from "@/lib/email-address";
import { issueToken, TOKEN_TTL_MS } from "@/lib/auth-tokens";
import { sendMail } from "@/lib/email/mailer";
import { inviteEmail, resetEmail } from "@/lib/email/templates";
import { appUrl } from "@/lib/app-url";

/** Zod field: trims + lowercases, then checks format and the optional domain allow-list. */
export const emailField = z
	.string()
	.max(320, "Enter a valid email address")
	.transform(normalizeEmail)
	.refine(isValidEmail, "Enter a valid email address")
	.refine(isAllowedEmailDomain, "That email domain isn't allowed for Secure Tanza accounts");

/**
 * Why another account can't take this address, or null if it's free. A
 * deleted account keeps its address while it can still be restored.
 */
export async function emailConflict(email: string, exceptUserId?: number): Promise<string | null> {
	const existing = await prisma.user.findUnique({ where: { email }, select: { id: true, deletedAt: true } });
	if (!existing || existing.id === exceptUserId) return null;
	return existing.deletedAt
		? "That email belongs to a deleted account. Restore it from Recently deleted instead."
		: "Another account already uses that email address";
}

type MailableUser = { id: number; email: string | null; fullName: string };

/** Issues a fresh invite link (voiding older ones) and emails it. Returns whether the email went out. */
export async function sendInvite(user: MailableUser, adminId: number) {
	if (!user.email) return false;
	const token = await issueToken(user.id, "invite", TOKEN_TTL_MS.invite, adminId);
	return sendMail(inviteEmail(user.email, user.fullName, appUrl(`/set-password?token=${token}`), TOKEN_TTL_MS.invite));
}

/** Emails the reset link that follows an administrator unlock. */
export async function sendUnlockReset(user: MailableUser, adminId: number) {
	if (!user.email) return false;
	const token = await issueToken(user.id, "reset", TOKEN_TTL_MS.unlock, adminId);
	return sendMail(
		resetEmail(user.email, user.fullName, appUrl(`/set-password?token=${token}`), TOKEN_TTL_MS.unlock, "unlocked")
	);
}

/**
 * Account state for the Access & Security table.
 * - "invited": created by invite and the link hasn't been accepted yet
 * - "legacy": no email yet; still signs in with the account number
 */
export function accountStatus(user: {
	email: string | null;
	emailVerifiedAt: Date | null;
	lockedAt: Date | null;
	inviteCount: number;
}): "locked" | "invited" | "legacy" | "active" {
	if (user.lockedAt) return "locked";
	if (!user.email) return "legacy";
	if (!user.emailVerifiedAt && user.inviteCount > 0) return "invited";
	return "active";
}
