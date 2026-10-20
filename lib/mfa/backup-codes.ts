import { compare, hash } from "bcryptjs";
import { prisma } from "@/backend/lib/prisma";
import { BACKUP_CODE_COUNT, newBackupCode, normalizeBackupCode } from "./policy";

export { normalizeBackupCode };

/** Replaces the user's whole set and returns the new plain codes (shown once). */
export async function regenerateBackupCodes(userId: number): Promise<string[]> {
	const codes = Array.from({ length: BACKUP_CODE_COUNT }, newBackupCode);
	const hashes = await Promise.all(codes.map((c) => hash(c, 10)));
	await prisma.$transaction([
		prisma.mfaBackupCode.deleteMany({ where: { userId } }),
		prisma.mfaBackupCode.createMany({ data: hashes.map((codeHash) => ({ userId, codeHash })) }),
	]);
	return codes;
}

/** Uses up a backup code if it matches one of the user's unused codes. */
export async function consumeBackupCode(userId: number, input: string): Promise<boolean> {
	const code = normalizeBackupCode(input);
	if (!code) return false;
	const unused = await prisma.mfaBackupCode.findMany({ where: { userId, usedAt: null } });
	for (const row of unused) {
		if (await compare(code, row.codeHash)) {
			// Conditional update: a code submitted twice at once is only accepted once.
			const claimed = await prisma.mfaBackupCode.updateMany({
				where: { id: row.id, usedAt: null },
				data: { usedAt: new Date() },
			});
			return claimed.count === 1;
		}
	}
	return false;
}

export function remainingBackupCodes(userId: number) {
	return prisma.mfaBackupCode.count({ where: { userId, usedAt: null } });
}
