import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, canOperateSession } from '@/lib/auth';

// GET /api/exports/history — the signed-in person's own scheduled reports, newest first.
export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!canOperateSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const exports = await prisma.backup.findMany({
      where: { kind: 'scheduled_export', createdBy: session.accountNumber, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, fileName: true, label: true, periodLabel: true, rowCount: true, sizeBytes: true, createdAt: true },
    });
    return NextResponse.json({ success: true, data: exports });
  } catch (error) {
    console.error('Error listing exports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
