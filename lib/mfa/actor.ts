import { getSession } from "@/lib/auth";
import { readChallenge } from "./challenge";
import { loadSignInUser, type SignInUser } from "./sign-in";
import { verifySecondFactor, MFA_LOCKED_MESSAGE, type FactorMethod } from "./second-factor";
import { codeParam } from "@/lib/input-sanitize";

type Fail = { error: string; status: number; restart?: boolean; locked?: boolean };

/** The signed-in user, for settings actions. */
export async function signedInUser(): Promise<{ user: SignInUser } | Fail> {
	const session = await getSession();
	if (!session) return { error: "Unauthorized", status: 401 };
	const user = await loadSignInUser(session.userId);
	if (!user) return { error: "Unauthorized", status: 401 };
	return { user };
}

/**
 * Sensitive 2FA changes from Settings ask for a fresh code first, even on a
 * trusted browser: a walked-away-from session must not be able to swap the
 * authenticator or read new backup codes.
 */
export async function requireStepUp(user: SignInUser, body: { method?: unknown; code?: unknown }): Promise<Fail | null> {
	// Accounts created before 2FA existed have nothing to step up with yet.
	if (!user.totpEnabledAt) return null;
	const method: FactorMethod = body.method === "backup" ? "backup" : "totp";
	const code = codeParam(body.code);
	if (!code) return { error: "Enter a code from your authenticator app to continue.", status: 401 };
	const outcome = await verifySecondFactor(user, method, code);
	if (outcome.ok) return null;
	if (outcome.locked) return { error: MFA_LOCKED_MESSAGE, status: 403, locked: true };
	return { error: `That code isn't right. ${outcome.remaining} attempt(s) left before the account locks.`, status: 401 };
}

/**
 * Who is enrolling: someone half-way through sign-in (challenge cookie at the
 * "enroll" stage), or a signed-in user replacing their authenticator (step-up
 * required).
 */
export async function enrollmentActor(body: {
	method?: unknown;
	code?: unknown;
}): Promise<{ user: SignInUser; via: "sign-in" | "settings" } | Fail> {
	const challenge = await readChallenge();
	if (challenge?.stage === "enroll") {
		const user = await loadSignInUser(challenge.userId);
		if (!user || user.sessionVersion !== challenge.sessionVersion) {
			return { error: "Your sign-in timed out. Enter your password again.", status: 401, restart: true };
		}
		if (user.lockedAt) return { error: MFA_LOCKED_MESSAGE, status: 403, locked: true };
		// Someone already enrolled can't use the enroll stage to replace their factor.
		if (user.totpEnabledAt) return { error: "Two-factor authentication is already set up.", status: 400, restart: true };
		return { user, via: "sign-in" };
	}

	const signed = await signedInUser();
	if ("error" in signed) return { error: "Your sign-in timed out. Enter your password again.", status: 401, restart: true };
	const stepUp = await requireStepUp(signed.user, body);
	if (stepUp) return stepUp;
	return { user: signed.user, via: "settings" };
}
