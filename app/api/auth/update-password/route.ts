import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, hashPassword, verifyPassword } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { validateNewPassword } from '@/lib/password-policy.server';
import { z } from 'zod';

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(1, 'New password is required'),
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password cannot be the same as your current password",
  path: ["newPassword"],
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = updatePasswordSchema.parse(body);

    // Fetch the current user to get their password hash
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isPasswordCorrect = await verifyPassword(currentPassword, user.passwordHash);

    if (!isPasswordCorrect) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
    }

    // Composition rules, common/guessable passwords, known breaches
    const policyError = await validateNewPassword(newPassword, user);
    if (policyError) {
      return NextResponse.json({ error: policyError }, { status: 400 });
    }

    // Hash the new password
    const passwordHash = await hashPassword(newPassword);

    // Update the user
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        passwordHash,
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Auth',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        details: 'User successfully updated their password from settings',
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

    console.error('Update password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
