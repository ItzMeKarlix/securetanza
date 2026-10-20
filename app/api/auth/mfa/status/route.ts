import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { isAdminUser } from '@/lib/auth-routes';
import { signedInUser } from '@/lib/mfa/actor';
import { remainingBackupCodes } from '@/lib/mfa/backup-codes';
import { currentTrustedDeviceId, trustDays } from '@/lib/mfa/trusted-device';

// GET /api/auth/mfa/status - the signed-in user's 2FA state for Settings → Profile
export async function GET() {
  try {
    const signed = await signedInUser();
    if ('error' in signed) return NextResponse.json({ error: signed.error }, { status: signed.status });
    const { user } = signed;

    const [backupCodesLeft, devices, thisDevice] = await Promise.all([
      remainingBackupCodes(user.id),
      prisma.trustedDevice.findMany({
        where: { userId: user.id, expiresAt: { gt: new Date() }, sessionVersion: user.sessionVersion },
        orderBy: { createdAt: 'desc' },
        select: { id: true, label: true, createdAt: true, expiresAt: true, lastUsedAt: true },
      }),
      currentTrustedDeviceId(),
    ]);

    const permissions = user.permissions.map((up) => up.permission.permissionName);
    return NextResponse.json({
      enabled: Boolean(user.totpEnabledAt),
      enabledAt: user.totpEnabledAt,
      backupCodesLeft,
      trustDays: trustDays(isAdminUser(permissions)),
      devices: devices.map((d) => ({ ...d, current: d.id === thisDevice })),
    });
  } catch (error) {
    console.error('MFA status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
