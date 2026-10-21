import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { z } from 'zod';
import { intParam, isoDateParam, queryText, safeTextField } from '@/lib/input-sanitize';

/**
 * What a browser may add to the audit trail: only events the server can't see
 * for itself — today, a report generated and downloaded in the browser.
 * Everything else (sign-ins, imports, account changes, backups) is recorded by
 * the route that did it, so a client can't write those or pick a severity.
 */
const clientEventSchema = z.object({
  action: z.literal('Export'),
  resource: safeTextField({ max: 200, min: 1, label: 'Resource' }),
  details: safeTextField({ max: 500, min: 1, label: 'Details' }),
  outcome: z.enum(['success', 'failure']).default('success'),
}).strict();

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (!session.permissions.includes('admin_operational_officer') && !session.permissions.includes('admin'))) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Administrative access required' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = intParam(searchParams.get('limit'), 100, 1, 500);
    const offset = intParam(searchParams.get('offset'), 0, 0, 1_000_000);
    const action = queryText(searchParams.get('action'), 40);
    const startDate = isoDateParam(searchParams.get('startDate'));
    const endDate = isoDateParam(searchParams.get('endDate'));

    const where: { action?: string; createdAt?: { gte?: Date; lte?: Date } } = {};

    if (action) where.action = action;

    // The client sends local start-of-day / end-of-day instants, so the range it
    // asks for is the range the officer sees in their own timezone.
    if (startDate || endDate) {
      const range: { gte?: Date; lte?: Date } = {};
      const from = startDate ? new Date(startDate) : null;
      const to = endDate ? new Date(endDate) : null;
      if (from && !isNaN(from.getTime())) range.gte = from;
      if (to && !isNaN(to.getTime())) range.lte = to;
      if (range.gte || range.lte) where.createdAt = range;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: offset,
      }),
      prisma.auditLog.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      data: logs,
      meta: {
        total,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This had no auth check at all before, and trusted `user`/`ip`/`session`
    // verbatim from the client body — any signed-in caller could forge an
    // entry claiming to be a different user, from a different IP, in a
    // different session. Identity and connection info now come from the
    // authenticated session and the request itself; the body only supplies
    // what the server genuinely can't know on its own (what happened).
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = clientEventSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid audit event' },
        { status: 400 }
      );
    }
    const event = parsed.data;

    const log = await prisma.auditLog.create({
      data: {
        action: event.action,
        details: event.details,
        user: session.fullName || session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: event.resource,
        severity: 'low',
        outcome: event.outcome,
      }
    });

    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}
