import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { isAdminUser } from '@/lib/auth-routes';
import { endChallenge, readChallenge } from '@/lib/mfa/challenge';
import { MFA_LOCKED_MESSAGE, verifySecondFactor, type FactorMethod } from '@/lib/mfa/second-factor';
import { auditAuth, completeSignIn, loadSignInUser } from '@/lib/mfa/sign-in';
import { deviceLabel, trustThisBrowser } from '@/lib/mfa/trusted-device';
import { sendMail } from '@/lib/email/mailer';
import { mfaEmailUsedEmail } from '@/lib/email/templates';
import { codeParam } from '@/lib/input-sanitize';

const METHODS: FactorMethod[] = ['totp', 'backup', 'email'];
const LABEL: Record<FactorMethod, string> = { totp: 'authenticator app', backup: 'backup code', email: 'emailed code' };

// POST /api/auth/mfa/verify - second step of sign-in (authorized by the challenge cookie)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || 'unknown';
    if (!(await allowRequest(`mfa-verify:${ip}`, 30, 15 * 60))) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 });
    }

    const challenge = await readChallenge();
    if (!challenge || challenge.stage !== 'challenge') {
      return NextResponse.json({ error: 'Your sign-in timed out. Enter your password again.', restart: true }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const method: FactorMethod = METHODS.includes(body.method) ? body.method : 'totp';
    const code = codeParam(body.code);

    const user = await loadSignInUser(challenge.userId);
    // A password change, unlock or 2FA reset since the password step voids the challenge.
    if (!user || user.sessionVersion !== challenge.sessionVersion) {
      await endChallenge();
      return NextResponse.json({ error: 'Your sign-in timed out. Enter your password again.', restart: true }, { status: 401 });
    }
    if (user.lockedAt) {
      await endChallenge();
      return NextResponse.json({ error: MFA_LOCKED_MESSAGE, locked: true }, { status: 403 });
    }

    const outcome = await verifySecondFactor(user, method, code);
    if (!outcome.ok) {
      await auditAuth(
        request,
        user.accountNumber,
        outcome.locked
          ? `Account locked after repeated wrong verification codes (${LABEL[method]})`
          : `Wrong verification code (${LABEL[method]}); ${outcome.remaining} attempt(s) left`,
        'failed',
        outcome.locked ? 'high' : 'medium'
      );
      if (outcome.locked) {
        await endChallenge();
        return NextResponse.json({ error: MFA_LOCKED_MESSAGE, locked: true }, { status: 403 });
      }
      const what = method === 'backup' ? 'backup code' : 'code';
      return NextResponse.json(
        {
          error: `That ${what} isn't right. ${outcome.remaining} attempt${outcome.remaining === 1 ? '' : 's'} left before the account locks.`,
          attemptsRemaining: outcome.remaining,
        },
        { status: 401 }
      );
    }

    await endChallenge();

    let trusted: { ttlDays: number } | null = null;
    if (body.trustDevice === true) {
      const permissions = user.permissions.map((up) => up.permission.permissionName);
      trusted = await trustThisBrowser(user, isAdminUser(permissions), getUserAgent(request));
    }

    if (method === 'email' && user.email) {
      await sendMail(mfaEmailUsedEmail(user.email, user.fullName, new Date(), deviceLabel(getUserAgent(request))));
    }

    const result = await completeSignIn(
      user,
      request,
      `password + ${LABEL[method]}${trusted ? `; browser trusted for ${trusted.ttlDays} days` : ''}`
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('MFA verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
