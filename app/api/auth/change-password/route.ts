import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, hashPassword, verifyPassword, createSession, invalidateSessionCache } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { validateNewPassword } from '@/lib/password-policy.server';
import { z } from 'zod';
import { MAX_PASSWORD_LENGTH } from '@/lib/input-sanitize';

const changePasswordSchema = z.object({
  newPassword: z.string().min(1, 'New password is required').max(MAX_PASSWORD_LENGTH, `Use a password of ${MAX_PASSWORD_LENGTH} characters or fewer.`),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { newPassword } = changePasswordSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // The temporary password was handed over in plain text — never keep it.
    if (await verifyPassword(newPassword, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Choose a password different from your temporary one.' },
        { status: 400 }
      );
    }

    // Composition rules, common/guessable passwords, known breaches
    const policyError = await validateNewPassword(newPassword, user);
    if (policyError) {
      return NextResponse.json({ error: policyError }, { status: 400 });
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update the user
    const updatedUser = await prisma.user.update({
      relationLoadStrategy: 'join',
      where: { id: session.userId },
      data: {
        passwordHash,
        mustChangePassword: false,
        sessionVersion: { increment: 1 },
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    const permissions = updatedUser.permissions.map(up => up.permission.permissionName);

    // Refresh the session with the new mustChangePassword flag
    invalidateSessionCache(session.userId);
    const sessionId = await createSession({
      id: updatedUser.id,
      accountNumber: updatedUser.accountNumber,
      email: updatedUser.email,
      sessionVersion: updatedUser.sessionVersion,
      fullName: updatedUser.fullName,
      permissions,
      mustChangePassword: false,
      defaultLandingPage: updatedUser.defaultLandingPage,
      autoLogoutTimer: updatedUser.autoLogoutTimer,
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Auth',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: sessionId,
        userAgent: getUserAgent(request),
        details: 'User successfully completed forced password change',
        outcome: 'success',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
