import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { accountStatus } from '@/lib/account-emails';
import { issueToken, TOKEN_TTL_MS } from '@/lib/auth-tokens';
import { sendMail } from '@/lib/email/mailer';
import { resetEmail } from '@/lib/email/templates';
import { appUrl } from '@/lib/app-url';
import { idParam } from '@/lib/input-sanitize';

// POST /api/users/[id]/reset-link - Email a password-reset link to an account (admin only).
// Covers a failed unlock email, and moving legacy accounts onto email sign-in.
// The current password keeps working until the link is used.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { id } = await params;
    const userId = idParam(id);
    if (userId === null) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { authTokens: { where: { purpose: 'invite' } } } } },
    });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const status = accountStatus({ ...user, inviteCount: user._count.authTokens });
    if (status === 'legacy') {
      return NextResponse.json({ error: 'Add an email address to this account first.' }, { status: 400 });
    }
    if (status === 'locked') {
      return NextResponse.json({ error: 'Unlock the account instead — that sends a reset link.' }, { status: 400 });
    }
    if (status === 'invited') {
      return NextResponse.json({ error: 'This account has not accepted its invite yet. Re-send the invite instead.' }, { status: 400 });
    }

    const token = await issueToken(user.id, 'reset', TOKEN_TTL_MS.unlock, session.userId);
    const emailSent = await sendMail(
      resetEmail(user.email!, user.fullName, appUrl(`/set-password?token=${token}`), TOKEN_TTL_MS.unlock, 'requested')
    );

    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `User:${user.accountNumber}`,
        details: `Emailed a password-reset link to ${user.email}${emailSent ? '' : ' (email delivery failed)'}`,
        outcome: emailSent ? 'success' : 'failed',
      },
    });

    if (!emailSent) {
      return NextResponse.json({ error: 'The reset email could not be sent. Check the mail settings and try again.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: { email: user.email } });
  } catch (error) {
    console.error('Error sending reset link:', error);
    return NextResponse.json({ error: 'Failed to send reset link' }, { status: 500 });
  }
}
