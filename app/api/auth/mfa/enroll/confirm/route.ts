import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { createSession, invalidateSessionCache } from '@/lib/auth';
import { getClientIp } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { readChallenge, readPendingSecret, clearPendingSecret, endChallenge } from '@/lib/mfa/challenge';
import { decryptSecret } from '@/lib/mfa/crypto';
import { verifyTotp } from '@/lib/mfa/totp';
import { regenerateBackupCodes } from '@/lib/mfa/backup-codes';
import { auditAuth, completeSignIn, loadSignInUser } from '@/lib/mfa/sign-in';
import { signedInUser } from '@/lib/mfa/actor';
import { sendMail } from '@/lib/email/mailer';
import { mfaChangedEmail } from '@/lib/email/templates';

// POST /api/auth/mfa/enroll/confirm - first code from the app turns 2FA on; returns backup codes once
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || 'unknown';
    if (!(await allowRequest(`mfa-enroll:${ip}`, 20, 15 * 60))) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const code = typeof body.code === 'string' ? body.code : '';

    // Same two callers as /enroll/start. Step-up already happened at start; the
    // pending-secret cookie is bound to this user and only lives 10 minutes.
    const challenge = await readChallenge();
    let via: 'sign-in' | 'settings';
    let userId: number;
    if (challenge?.stage === 'enroll') {
      via = 'sign-in';
      userId = challenge.userId;
    } else {
      const signed = await signedInUser();
      if ('error' in signed) {
        return NextResponse.json({ error: 'Your sign-in timed out. Enter your password again.', restart: true }, { status: 401 });
      }
      via = 'settings';
      userId = signed.user.id;
    }

    const user = await loadSignInUser(userId);
    if (!user || (via === 'sign-in' && user.sessionVersion !== challenge!.sessionVersion)) {
      return NextResponse.json({ error: 'Your sign-in timed out. Enter your password again.', restart: true }, { status: 401 });
    }
    if (via === 'sign-in' && user.totpEnabledAt) {
      return NextResponse.json({ error: 'Two-factor authentication is already set up.', restart: true }, { status: 400 });
    }

    const pending = await readPendingSecret(user.id);
    if (!pending) {
      return NextResponse.json({ error: 'Setup timed out. Start again to get a new QR code.', expired: true }, { status: 400 });
    }

    const step = verifyTotp(decryptSecret(pending), code, null);
    if (step === null) {
      return NextResponse.json(
        { error: "That code doesn't match. Check the app is showing Secure Tanza and try the newest code." },
        { status: 400 }
      );
    }

    // Activate. Re-enrolling from Settings also signs out other sessions and
    // forgets every trusted browser — the old authenticator is gone.
    const reenroll = via === 'settings';
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        totpSecretEnc: pending,
        totpEnabledAt: new Date(),
        totpLastStep: step,
        mfaFailedAttempts: 0,
        ...(reenroll ? { sessionVersion: { increment: 1 } } : {}),
      },
      relationLoadStrategy: 'join',
      include: { permissions: { include: { permission: true } } },
    });
    if (reenroll) await prisma.trustedDevice.deleteMany({ where: { userId: user.id } });
    const backupCodes = await regenerateBackupCodes(user.id);
    await clearPendingSecret();

    await auditAuth(
      request,
      user.accountNumber,
      reenroll ? 'Replaced authenticator app (two-factor re-enrolled)' : 'Set up two-factor authentication',
      'success',
      reenroll ? 'medium' : 'low'
    );
    if (updated.email) await sendMail(mfaChangedEmail(updated.email, updated.fullName, 'enrolled'));

    if (via === 'sign-in') {
      await endChallenge();
      const result = await completeSignIn(updated, request, 'password + new authenticator');
      return NextResponse.json({ ...result, backupCodes });
    }

    // Settings: keep this browser signed in on the new session version.
    invalidateSessionCache(user.id);
    await createSession({
      id: updated.id,
      accountNumber: updated.accountNumber,
      email: updated.email,
      sessionVersion: updated.sessionVersion,
      fullName: updated.fullName,
      permissions: updated.permissions.map((up) => up.permission.permissionName),
      mustChangePassword: updated.mustChangePassword,
      defaultLandingPage: updated.defaultLandingPage,
      autoLogoutTimer: updated.autoLogoutTimer,
    });
    return NextResponse.json({ success: true, backupCodes });
  } catch (error) {
    console.error('MFA enroll confirm error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
