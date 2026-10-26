import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, invalidateSessionCache } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { unusablePasswordHash } from '@/lib/auth-tokens';
import { sendUnlockReset } from '@/lib/account-emails';
import { idParam } from '@/lib/input-sanitize';

// POST /api/users/[id]/unlock - Clear a lockout and email a reset link (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = idParam(id);
    if (userId === null) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user id' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser || existingUser.deletedAt) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!(await allowRequest(`user-email:${existingUser.id}`, 5, 60 * 60))) {
      return NextResponse.json({ error: 'Too many emails sent to this account recently. Try again later.' }, { status: 429 });
    }

    if (!existingUser.lockedAt) {
      return NextResponse.json(
        { error: 'This account is not locked.' },
        { status: 400 }
      );
    }

    if (!existingUser.email) {
      return NextResponse.json(
        { error: 'Add an email address to this account first, so the reset link has somewhere to go.' },
        { status: 400 }
      );
    }

    // The old password stops working the moment the lock is cleared: whoever ran the
    // account into the lock may have been guessing at it. Nobody — the admin included —
    // learns a new one; the owner sets it from the emailed link.
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: await unusablePasswordHash(),
        mustChangePassword: false,
        failedLoginAttempts: 0,
        mfaFailedAttempts: 0,
        lockedAt: null,
        sessionVersion: { increment: 1 },
      },
    });

    invalidateSessionCache(userId);

    const emailSent = await sendUnlockReset(user, session.userId);

    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `User:${existingUser.accountNumber}`,
        details: `Unlocked account ${existingUser.accountNumber} and emailed a reset link to ${user.email}${emailSent ? '' : ' (email delivery failed)'}`,
        severity: 'high',
        outcome: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account unlocked',
      data: {
        id: user.id,
        accountNumber: user.accountNumber,
        email: user.email,
        fullName: user.fullName,
        emailSent,
      },
    });
  } catch (error) {
    console.error('Error unlocking user:', error);
    return NextResponse.json(
      { error: 'Failed to unlock account' },
      { status: 500 }
    );
  }
}
