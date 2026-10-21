import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { BackupService } from '@/backend/services/backup.service';

// POST /api/backups/[id]/restore - Bring a backup back from Recently deleted (admin only).
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session || !(session.permissions.includes('admin_operational_officer') || session.permissions.includes('admin'))) {
      return NextResponse.json({ success: false, error: 'Unauthorized - Administrative access required' }, { status: 403 });
    }

    const { id } = await params;
    if (!/^[a-z0-9]{20,40}$/.test(id)) {
      return NextResponse.json({ success: false, error: 'Backup not found' }, { status: 404 });
    }
    const restored = await BackupService.restore(id);
    if (!restored) {
      return NextResponse.json({ success: false, error: 'No deleted backup with that id' }, { status: 404 });
    }

    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `Backup:${restored.id}`,
        details: `Restored archived backup ${restored.fileName}`,
        severity: 'medium',
        outcome: 'success',
      },
    });

    return NextResponse.json({ success: true, data: restored });
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json({ success: false, error: 'Failed to restore backup' }, { status: 500 });
  }
}
