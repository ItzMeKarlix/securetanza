import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { isValidEmail, normalizeEmail } from '@/lib/email-address';
import { allowRequest } from '@/lib/rate-limit';
import { issueToken, recentTokenCount, TOKEN_TTL_MS } from '@/lib/auth-tokens';
import { sendMail } from '@/lib/email/mailer';
import { resetEmail } from '@/lib/email/templates';
import { appUrl } from '@/lib/app-url';

/** Same reply whether or not the address exists, so this can't be used to probe for accounts. */
const NEUTRAL = {
  success: true,
  message: 'If that address belongs to an active account, a reset link is on its way.',
};

const MAX_RESETS_PER_HOUR = 3;

// POST /api/auth/forgot-password - Self-service reset link (public)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || 'unknown';

    if (!(await allowRequest(`forgot:${ip}`, 10, 15 * 60))) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes and try again.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { _count: { select: { authTokens: { where: { purpose: 'invite' } } } } },
    });

    let outcome: string;
    if (!user || user.deletedAt) {
      outcome = 'No account for this address';
    } else if (!user.emailVerifiedAt && user._count.authTokens > 0) {
      // Pending invites set a first password through the invite, not a reset.
      outcome = 'Account has not accepted its invite';
    } else if (user.lockedAt) {
      outcome = 'Account is locked - administrator unlock required';
    } else if ((await recentTokenCount(user.id, 'reset', 60 * 60 * 1000)) >= MAX_RESETS_PER_HOUR) {
      outcome = 'Hourly reset limit reached';
    } else {
      const token = await issueToken(user.id, 'reset', TOKEN_TTL_MS.reset);
      const sent = await sendMail(
        resetEmail(user.email!, user.fullName, appUrl(`/set-password?token=${token}`), TOKEN_TTL_MS.reset, 'requested')
      );
      outcome = sent ? 'Reset link sent' : 'Reset link could not be emailed';
    }

    await prisma.auditLog.create({
      data: {
        action: 'Auth',
        user: user?.accountNumber ?? email.slice(0, 120),
        ip,
        userAgent: getUserAgent(request),
        details: `Password reset requested: ${outcome}`,
        outcome: outcome === 'Reset link sent' ? 'success' : 'failed',
        severity: 'low',
      },
    });

    return NextResponse.json(NEUTRAL);
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
