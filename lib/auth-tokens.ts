import { createHash, randomBytes } from "crypto";
import { hash } from "bcryptjs";
import { prisma } from "@/backend/lib/prisma";

/**
 * One-time links for invites and password resets. The raw token lives only in
 * the emailed URL; the database keeps its SHA-256, so a leaked table can't be
 * replayed. Issuing a new token voids that user's earlier unused ones.
 */

export type TokenPurpose = "invite" | "reset";

export const TOKEN_TTL_MS = {
	invite: 48 * 60 * 60 * 1000,
	/** Self-service "forgot password". */
	reset: 60 * 60 * 1000,
	/** Reset link sent when an administrator unlocks an account. */
	unlock: 24 * 60 * 60 * 1000,
} as const;

function sha256(value: string) {
	return createHash("sha256").update(value).digest("hex");
}

export async function issueToken(
	userId: number,
	purpose: TokenPurpose,
	ttlMs: number,
	createdById?: number
): Promise<string> {
	const raw = randomBytes(32).toString("base64url");
	await prisma.$transaction([
		prisma.authToken.updateMany({
			where: { userId, purpose, usedAt: null },
			data: { usedAt: new Date() },
		}),
		prisma.authToken.create({
			data: {
				userId,
				purpose,
				tokenHash: sha256(raw),
				expiresAt: new Date(Date.now() + ttlMs),
				createdById,
			},
		}),
	]);
	return raw;
}

export type TokenProblem = "invalid" | "used" | "expired";

const tokenInclude = { user: { select: { id: true, fullName: true, email: true, lockedAt: true } } } as const;
type TokenWithUser = NonNullable<Awaited<ReturnType<typeof findByRaw>>>;

export type TokenLookup =
	| { problem: TokenProblem; token?: undefined }
	| { problem?: undefined; token: TokenWithUser };

function findByRaw(raw: string) {
	return prisma.authToken.findUnique({ where: { tokenHash: sha256(raw) }, include: tokenInclude });
}

/** Looks a token up without using it (for the set-password page). */
export async function peekToken(raw: string): Promise<TokenLookup> {
	if (!raw) return { problem: "invalid" };
	const token = await findByRaw(raw);
	if (!token) return { problem: "invalid" };
	if (token.usedAt) return { problem: "used" };
	if (token.expiresAt.getTime() <= Date.now()) return { problem: "expired" };
	return { token };
}

/**
 * Marks the token used, atomically: the conditional update succeeds for exactly
 * one caller even if the same link is submitted twice at once.
 */
export async function consumeToken(raw: string): Promise<TokenLookup> {
	const peeked = await peekToken(raw);
	if (peeked.problem) return peeked;
	const claimed = await prisma.authToken.updateMany({
		where: { id: peeked.token.id, usedAt: null, expiresAt: { gt: new Date() } },
		data: { usedAt: new Date() },
	});
	if (claimed.count !== 1) return { problem: "used" };
	return { token: peeked.token };
}

/** How many tokens of this purpose were issued to the user in the last `windowMs`. */
export async function recentTokenCount(userId: number, purpose: TokenPurpose, windowMs: number) {
	return prisma.authToken.count({
		where: { userId, purpose, createdAt: { gt: new Date(Date.now() - windowMs) } },
	});
}

/**
 * A bcrypt hash of random bytes nobody knows — for accounts that must not be
 * signed into until a link sets a real password (new invites, unlocked accounts).
 */
export async function unusablePasswordHash() {
	return hash(randomBytes(32).toString("hex"), 10);
}
