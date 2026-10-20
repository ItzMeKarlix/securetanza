import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/backend/lib/prisma";
import { deviceLabel, trustDays } from "./policy";

export { deviceLabel, trustDays };

/**
 * "Trust this browser": skip the second factor on one browser for a fixed
 * period (never sliding). The cookie holds a random token; the database holds
 * its hash plus the user's sessionVersion at the time, so a password change,
 * unlock or 2FA reset revokes every trusted browser at once.
 */

const COOKIE = "trusted_device";

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export async function trustThisBrowser(user: { id: number; sessionVersion: number }, isAdmin: boolean, userAgent: string | null) {
	const token = randomBytes(32).toString("base64url");
	const ttlDays = trustDays(isAdmin);
	const expiresAt = new Date(Date.now() + ttlDays * 86_400_000);
	await prisma.trustedDevice.create({
		data: {
			userId: user.id,
			tokenHash: sha256(token),
			sessionVersion: user.sessionVersion,
			label: deviceLabel(userAgent),
			expiresAt,
		},
	});
	(await cookies()).set(COOKIE, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		expires: expiresAt,
	});
	return { expiresAt, ttlDays };
}

/**
 * True when this browser carries a trust token for this user that is still
 * in date, minted at the user's current sessionVersion, and 2FA is still on.
 */
export async function isTrustedBrowser(user: { id: number; sessionVersion: number; totpEnabledAt: Date | null }) {
	if (!user.totpEnabledAt) return false;
	const token = (await cookies()).get(COOKIE)?.value;
	if (!token) return false;
	const device = await prisma.trustedDevice.findUnique({ where: { tokenHash: sha256(token) } });
	if (
		!device ||
		device.userId !== user.id ||
		device.expiresAt.getTime() <= Date.now() ||
		device.sessionVersion !== user.sessionVersion
	) {
		return false;
	}
	await prisma.trustedDevice.update({ where: { id: device.id }, data: { lastUsedAt: new Date() } }).catch(() => {});
	return true;
}

/** Id of the trusted-device row for the browser making this request, if any (to mark "this browser"). */
export async function currentTrustedDeviceId(): Promise<number | null> {
	const token = (await cookies()).get(COOKIE)?.value;
	if (!token) return null;
	const device = await prisma.trustedDevice.findUnique({ where: { tokenHash: sha256(token) }, select: { id: true } });
	return device?.id ?? null;
}

export async function forgetThisBrowser() {
	(await cookies()).set(COOKIE, "", { path: "/", maxAge: 0 });
}
