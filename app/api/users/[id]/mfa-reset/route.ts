import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, invalidateSessionCache } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { resetMfa } from '@/lib/mfa/reset';
import { sendMail } from '@/lib/email/mailer';
import { mfaChangedEmail } from '@/lib/email/templates';
import { idParam } from '@/lib/input-sanitize';

// POST /api/users/[id]/mfa-reset - clear someone's 2FA so they enroll again at next sign-in (admin only)
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const userId = idParam((await params).id);
    if (userId === null) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (isNaN(userId)) return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    if (userId === session.userId) {
      return NextResponse.json(
        { error: "You can't reset your own two-factor authentication. Use Settings → Profile to set up a new authenticator." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.deletedAt) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!(await allowRequest(`user-email:${userId}`, 5, 60 * 60))) {
      return NextResponse.json({ error: 'Too many emails sent to this account recently. Try again later.' }, { status: 429 });
    }

    await resetMfa(userId);
    invalidateSessionCache(userId);

    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `User:${user.accountNumber}`,
        details: `Reset two-factor authentication for ${user.accountNumber}`,
        severity: 'high',
        outcome: 'success',
      },
    });
    if (user.email) await sendMail(mfaChangedEmail(user.email, user.fullName, 'reset'));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('MFA reset error:', error);
    return NextResponse.json({ error: 'Failed to reset two-factor authentication' }, { status: 500 });
  }
}
