import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes } from "crypto";

/**
 * AES-256-GCM for TOTP secrets at rest. The key comes from MFA_ENCRYPTION_KEY
 * (32 random bytes, base64 — `openssl rand -base64 32`). Development falls back
 * to a key derived from JWT_SECRET so local setup keeps working; production
 * refuses to run without a real key.
 *
 * Stored format: "v1:<iv b64url>:<tag b64url>:<ciphertext b64url>".
 */

let cachedKey: Buffer | null = null;

function key(): Buffer {
	if (cachedKey) return cachedKey;
	const raw = process.env.MFA_ENCRYPTION_KEY;
	if (raw) {
		const buf = Buffer.from(raw, "base64");
		if (buf.length !== 32) throw new Error("MFA_ENCRYPTION_KEY must be 32 bytes, base64-encoded.");
		cachedKey = buf;
	} else if (process.env.NODE_ENV === "production") {
		throw new Error("MFA_ENCRYPTION_KEY must be set in production.");
	} else {
		cachedKey = createHash("sha256")
			.update(`dev-mfa-key:${process.env.JWT_SECRET || "your-secret-key-change-this-in-production"}`)
			.digest();
	}
	return cachedKey;
}

export function encryptSecret(plain: string): string {
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", key(), iv);
	const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	return ["v1", iv.toString("base64url"), tag.toString("base64url"), enc.toString("base64url")].join(":");
}

export function decryptSecret(stored: string): string {
	const [version, iv, tag, enc] = stored.split(":");
	if (version !== "v1" || !iv || !tag || !enc) throw new Error("Unrecognised encrypted secret format");
	const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(iv, "base64url"));
	decipher.setAuthTag(Buffer.from(tag, "base64url"));
	return Buffer.concat([decipher.update(Buffer.from(enc, "base64url")), decipher.final()]).toString("utf8");
}

/** Keyed hash for short codes (emailed OTPs), so a leaked table can't be brute-forced offline. */
export function hmac(value: string): string {
	return createHmac("sha256", key()).update(value).digest("hex");
}
