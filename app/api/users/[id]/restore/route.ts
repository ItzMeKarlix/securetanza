import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, invalidateSessionCache } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { idParam } from '@/lib/input-sanitize';

// POST /api/users/[id]/restore - Bring back a soft-deleted account (admin only).
// It keeps its role, email and password; its old sessions stay ended.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const userId = idParam((await params).id);
    if (userId === null) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const restored = await prisma.user.updateMany({
      where: { id: userId, deletedAt: { not: null } },
      data: { deletedAt: null, deletedBy: null },
    });
    if (restored.count === 0) {
      return NextResponse.json({ error: 'No deleted account with that id' }, { status: 404 });
    }
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { accountNumber: true, fullName: true } });
    invalidateSessionCache(userId);

    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `User:${user.accountNumber}`,
        details: `Restored deleted user account ${user.accountNumber}`,
        severity: 'medium',
        outcome: 'success',
      },
    });

    return NextResponse.json({ success: true, message: `${user.fullName}'s account is restored.` });
  } catch (error) {
    console.error('Error restoring user:', error);
    return NextResponse.json({ error: 'Failed to restore account' }, { status: 500 });
  }
}
