import { NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, canOperateSession } from '@/lib/auth';
import { produceScheduledExport } from '@/backend/services/scheduled-export.service';

/** One manual export per person per minute: each one builds a workbook and sends an email. */
const lastManualRun = new Map<number, number>();
const COOLDOWN_MS = 60_000;

// POST /api/exports/run — produce the report for the latest complete period now,
// with the frequency of the person's saved schedule (weekly if they have none).
export async function POST() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!canOperateSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const now = Date.now();
    if (now - (lastManualRun.get(session.userId) ?? 0) < COOLDOWN_MS) {
      return NextResponse.json({ error: 'An export was just made. Try again in a minute.' }, { status: 429 });
    }
    lastManualRun.set(session.userId, now);

    const [user, schedule] = await Promise.all([
      prisma.user.findFirst({
        where: { id: session.userId, deletedAt: null },
        select: { id: true, accountNumber: true, fullName: true, email: true },
      }),
      prisma.exportSchedule.findFirst({ where: { userId: session.userId }, select: { frequency: true } }),
    ]);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await produceScheduledExport(user, schedule?.frequency ?? 'weekly', new Date(now), 'manual');
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Error running export:', error);
    return NextResponse.json({ error: 'The export failed. Please try again.' }, { status: 500 });
  }
}
