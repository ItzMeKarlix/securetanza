import { prisma } from "@/backend/lib/prisma";

/**
 * Removes a user's second factor entirely: authenticator, backup codes,
 * trusted browsers, pending emailed codes. Bumps sessionVersion so every
 * session ends; the person enrolls again at their next sign-in.
 * Used by the admin reset and the break-glass script.
 */
export async function resetMfa(userId: number) {
	await prisma.$transaction([
		prisma.user.update({
			where: { id: userId },
			data: {
				totpSecretEnc: null,
				totpEnabledAt: null,
				totpLastStep: null,
				mfaFailedAttempts: 0,
				sessionVersion: { increment: 1 },
			},
		}),
		prisma.mfaBackupCode.deleteMany({ where: { userId } }),
		prisma.trustedDevice.deleteMany({ where: { userId } }),
		prisma.authToken.deleteMany({ where: { userId, purpose: "mfa_email" } }),
	]);
}
