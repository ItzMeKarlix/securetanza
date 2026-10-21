import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { hashPassword, invalidateSessionCache } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { consumeToken, peekToken } from '@/lib/auth-tokens';
import { validateNewPassword } from '@/lib/password-policy.server';
import { sendMail } from '@/lib/email/mailer';
import { passwordChangedEmail } from '@/lib/email/templates';
import { appUrl } from '@/lib/app-url';
import { MAX_PASSWORD_LENGTH, linkTokenParam } from '@/lib/input-sanitize';

const PROBLEM_MESSAGES = {
  invalid: 'This link is not valid. Request a new one.',
  used: 'This link has already been used. Request a new one if you still need it.',
  expired: 'This link has expired. Request a new one.',
} as const;

// POST /api/auth/reset-password - Set a password from an invite or reset link (public)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || 'unknown';
    if (!(await allowRequest(`reset:${ip}`, 20, 15 * 60))) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const raw = linkTokenParam(body.token);
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
    if (newPassword.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json({ error: `Use a password of ${MAX_PASSWORD_LENGTH} characters or fewer.` }, { status: 400 });
    }

    // Check the link first, but only use it up once the password is acceptable,
    // so a rejected password doesn't burn the link.
    const peeked = await peekToken(raw);
    if (peeked.problem) {
      return NextResponse.json({ error: PROBLEM_MESSAGES[peeked.problem], problem: peeked.problem }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: peeked.token.userId } });
    if (!user || user.deletedAt) {
      return NextResponse.json({ error: PROBLEM_MESSAGES.invalid, problem: 'invalid' }, { status: 400 });
    }

    // A link issued before the account locked can't be used to get around the
    // lock; an administrator unlock clears it and sends a fresh link.
    if (user.lockedAt) {
      return NextResponse.json(
        { error: 'This account is locked. Ask your system administrator to unlock it.', problem: 'locked' },
        { status: 403 }
      );
    }

    const policyError = await validateNewPassword(newPassword, user);
    if (policyError) {
      return NextResponse.json({ error: policyError }, { status: 400 });
    }

    const consumed = await consumeToken(raw);
    if (consumed.problem) {
      return NextResponse.json({ error: PROBLEM_MESSAGES[consumed.problem], problem: consumed.problem }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(newPassword),
        // Following the emailed link proves the address belongs to them.
        emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        mustChangePassword: false,
        failedLoginAttempts: 0,
        mfaFailedAttempts: 0,
        // Emailed 2FA codes stay off for 7 days after an emailed reset, so inbox
        // access alone can't both reset the password and pass the second factor.
        ...(peeked.token.purpose === 'reset' ? { passwordResetViaEmailAt: new Date() } : {}),
        lockedAt: null,
        sessionVersion: { increment: 1 },
      },
    });
    invalidateSessionCache(user.id);

    const isInvite = consumed.token.purpose === 'invite';
    await prisma.auditLog.create({
      data: {
        action: 'Auth',
        user: updated.accountNumber,
        ip,
        userAgent: getUserAgent(request),
        details: isInvite ? 'Accepted invite and set first password' : 'Password reset via emailed link',
        outcome: 'success',
      },
    });

    if (!isInvite && updated.email) {
      await sendMail(passwordChangedEmail(updated.email, updated.fullName, appUrl('/login')));
    }

    return NextResponse.json({ success: true, purpose: consumed.token.purpose });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
