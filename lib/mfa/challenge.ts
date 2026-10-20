import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

/**
 * The half-signed-in state between "password correct" and "second factor
 * done". It's a separate, short-lived cookie: it grants nothing except access
 * to the /api/auth/mfa/* steps for that one user.
 */

const COOKIE = "mfa_challenge";
const TTL_SECONDS = 10 * 60;
const SECRET = new TextEncoder().encode(
	`mfa-challenge:${process.env.JWT_SECRET || "your-secret-key-change-this-in-production"}`
);

export type ChallengeStage = "challenge" | "enroll";

export interface Challenge {
	userId: number;
	sessionVersion: number;
	stage: ChallengeStage;
}

export async function startChallenge(challenge: Challenge) {
	const token = await new SignJWT({ ...challenge })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(`${TTL_SECONDS}s`)
		.sign(SECRET);
	(await cookies()).set(COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/api/auth/mfa",
		maxAge: TTL_SECONDS,
	});
}

export async function readChallenge(): Promise<Challenge | null> {
	const token = (await cookies()).get(COOKIE)?.value;
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, SECRET);
		const { userId, sessionVersion, stage } = payload as unknown as Challenge;
		if (typeof userId !== "number" || (stage !== "challenge" && stage !== "enroll")) return null;
		return { userId, sessionVersion: sessionVersion ?? 0, stage };
	} catch {
		return null;
	}
}

export async function endChallenge() {
	(await cookies()).set(COOKIE, "", { path: "/api/auth/mfa", maxAge: 0 });
}

/* ── Pending enrollment ──
   The new authenticator secret lives in its own short-lived cookie (encrypted,
   then signed) until a first code confirms it. Nothing is written to the
   account until then, so an abandoned setup leaves no trace, and re-enrolling
   while signed in can't break the authenticator that's already working. */

const ENROLL_COOKIE = "mfa_enroll";

export async function setPendingSecret(userId: number, encryptedSecret: string) {
	const token = await new SignJWT({ userId, s: encryptedSecret })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime(`${TTL_SECONDS}s`)
		.sign(SECRET);
	(await cookies()).set(ENROLL_COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/api/auth/mfa",
		maxAge: TTL_SECONDS,
	});
}

export async function readPendingSecret(userId: number): Promise<string | null> {
	const token = (await cookies()).get(ENROLL_COOKIE)?.value;
	if (!token) return null;
	try {
		const { payload } = await jwtVerify(token, SECRET);
		return payload.userId === userId && typeof payload.s === "string" ? payload.s : null;
	} catch {
		return null;
	}
}

export async function clearPendingSecret() {
	(await cookies()).set(ENROLL_COOKIE, "", { path: "/api/auth/mfa", maxAge: 0 });
}
