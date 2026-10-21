import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, canOperateSession } from '@/lib/auth';

// GET /api/exports/[id] — download one of your own scheduled reports.
// (Administrators can download any archive entry from Backups.)
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (!canOperateSession(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    if (!/^[a-z0-9]{20,40}$/.test(id)) return NextResponse.json({ error: 'Export not found' }, { status: 404 });

    const file = await prisma.backup.findFirst({
      where: { id, kind: 'scheduled_export', createdBy: session.accountNumber, deletedAt: null },
    });
    if (!file) return NextResponse.json({ error: 'Export not found' }, { status: 404 });

    return new NextResponse(new Uint8Array(file.content), {
      headers: {
        'Content-Type': file.mimeType,
        'Content-Disposition': `attachment; filename="${file.fileName.replace(/[^\w .()-]/g, '_')}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Error downloading export:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
