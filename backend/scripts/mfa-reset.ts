/**
 * Break-glass: reset two-factor authentication for one account from the
 * server, when no administrator can sign in to do it (e.g. the only admin
 * lost their phone and their backup codes).
 *
 *   pnpm mfa:reset someone@agency.gov.ph
 *   pnpm mfa:reset ACC-000001
 *
 * Runs with the same DATABASE_URL as the app. It also clears a lockout, so the
 * person can sign in with their password and set up a new authenticator.
 */
import { config } from "dotenv";
config({ path: [".env.local", ".env"] });

async function main() {
	const target = process.argv[2]?.trim();
	if (!target) {
		console.error("Usage: pnpm mfa:reset <email | account number>");
		process.exit(1);
	}

	const { prisma, disconnectPrisma } = await import("../lib/prisma");
	const { resetMfa } = await import("../../lib/mfa/reset");

	try {
		const user = target.includes("@")
			? await prisma.user.findUnique({ where: { email: target.toLowerCase() } })
			: await prisma.user.findUnique({ where: { accountNumber: target } });
		if (!user) {
			console.error(`No account found for "${target}".`);
			process.exit(1);
		}

		await resetMfa(user.id);
		await prisma.user.update({
			where: { id: user.id },
			data: { lockedAt: null, failedLoginAttempts: 0, mfaFailedAttempts: 0 },
		});
		await prisma.auditLog.create({
			data: {
				action: "Settings",
				user: "server-console",
				ip: "localhost",
				resource: `User:${user.accountNumber}`,
				details: `Break-glass: reset two-factor authentication and lockout for ${user.accountNumber} from the server console`,
				severity: "high",
				outcome: "success",
			},
		});

		console.log(`Two-factor authentication reset for ${user.fullName} (${user.accountNumber}).`);
		console.log("They sign in with their password and set up a new authenticator app.");
	} finally {
		await disconnectPrisma();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
