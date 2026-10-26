import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { accountStatus, sendInvite } from '@/lib/account-emails';
import { idParam } from '@/lib/input-sanitize';

// POST /api/users/[id]/invite - Re-send the invite link to a pending account (admin only)
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
    if (!user || user.deletedAt) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (accountStatus({ ...user, inviteCount: user._count.authTokens }) !== 'invited') {
      return NextResponse.json(
        { error: 'This account has already accepted its invite.' },
        { status: 400 }
      );
    }

    if (!(await allowRequest(`user-email:${userId}`, 5, 60 * 60))) {
      return NextResponse.json({ error: 'Too many emails sent to this account recently. Try again later.' }, { status: 429 });
    }

    const emailSent = await sendInvite(user, session.userId);

    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `User:${user.accountNumber}`,
        details: `Re-sent invite to ${user.email}${emailSent ? '' : ' (email delivery failed)'}`,
        outcome: emailSent ? 'success' : 'failed',
      },
    });

    if (!emailSent) {
      return NextResponse.json({ error: 'The invite email could not be sent. Check the mail settings and try again.' }, { status: 502 });
    }
    return NextResponse.json({ success: true, data: { email: user.email } });
  } catch (error) {
    console.error('Error re-sending invite:', error);
    return NextResponse.json({ error: 'Failed to re-send invite' }, { status: 500 });
  }
}
