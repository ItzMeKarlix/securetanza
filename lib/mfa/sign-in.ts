import type { NextRequest } from "next/server";
import { prisma } from "@/backend/lib/prisma";
import { createSession, primeSessionCache } from "@/lib/auth";
import { getClientIp, getUserAgent } from "@/lib/request-context";

/** The user shape every sign-in step loads (one joined query). */
export const signInInclude = { permissions: { include: { permission: true } } } as const;

export function loadSignInUser(userId: number) {
	return prisma.user.findUnique({ where: { id: userId }, relationLoadStrategy: "join", include: signInInclude });
}

export type SignInUser = NonNullable<Awaited<ReturnType<typeof loadSignInUser>>>;

/** Second factor is required for every account; "enroll" until one is set up. */
export function mfaStage(user: { totpEnabledAt: Date | null; totpSecretEnc: string | null }) {
	return user.totpEnabledAt && user.totpSecretEnc ? "challenge" : "enroll";
}

/**
 * The single place a full session is created: after the password *and* the
 * second factor (or a trusted browser). Writes the success audit entry.
 */
export async function completeSignIn(user: SignInUser, request: NextRequest, how: string) {
	const permissions = user.permissions.map((up) => up.permission.permissionName);
	const sessionId = await createSession({
		id: user.id,
		accountNumber: user.accountNumber,
		email: user.email,
		sessionVersion: user.sessionVersion,
		fullName: user.fullName,
		permissions,
		mustChangePassword: user.mustChangePassword,
		defaultLandingPage: user.defaultLandingPage,
		autoLogoutTimer: user.autoLogoutTimer,
	});

	await Promise.all([
		user.failedLoginAttempts > 0 || user.mfaFailedAttempts > 0
			? prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0, mfaFailedAttempts: 0 } })
			: null,
		prisma.auditLog.create({
			data: {
				action: "Auth",
				user: user.accountNumber,
				ip: getClientIp(request) || "unknown",
				session: sessionId,
				userAgent: getUserAgent(request),
				details: `User logged in successfully (${how})`,
				outcome: "success",
			},
		}),
		primeSessionCache(user.id, {
			fullName: user.fullName,
			permissions,
			mustChangePassword: user.mustChangePassword,
			defaultLandingPage: user.defaultLandingPage,
			autoLogoutTimer: user.autoLogoutTimer,
			accountNumber: user.accountNumber,
			email: user.email,
			sessionVersion: user.sessionVersion,
		}),
	]);

	return {
		success: true,
		mustChangePassword: user.mustChangePassword,
		user: {
			id: user.id,
			accountNumber: user.accountNumber,
			email: user.email,
			fullName: user.fullName,
			permissions,
			defaultLandingPage: user.defaultLandingPage,
		},
	};
}

export async function auditAuth(request: NextRequest, accountNumber: string, details: string, outcome: "success" | "failed", severity: "low" | "medium" | "high" = "medium") {
	await prisma.auditLog.create({
		data: {
			action: "Auth",
			user: accountNumber,
			ip: getClientIp(request) || "unknown",
			userAgent: getUserAgent(request),
			details,
			outcome,
			severity,
		},
	});
}
