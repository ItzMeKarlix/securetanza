import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { BackupService, XLSX_MIME } from '@/backend/services/backup.service';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_LABEL } from '@/components/upload/upload-meta';
import { isoDateParam, optionalSafeText, queryText, safeFileName } from '@/lib/input-sanitize';

const PDF_MIME = 'application/pdf';

const metaText = optionalSafeText({ max: 120, label: 'Archive details' });
/** A form or JSON value as clean text, or null when absent, blank or unsafe. */
function meta(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const parsed = metaText.safeParse(value);
  return parsed.success ? parsed.data ?? null : null;
}

function isAdmin(permissions: string[]) {
  return permissions.includes('admin_operational_officer') || permissions.includes('admin');
}

// GET /api/backups - List archived backups (metadata only, never the file bytes)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.permissions)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Administrative access required' },
        { status: 403 }
      );
    }

    const kind = request.nextUrl.searchParams.get('kind');
    const backups = await BackupService.list(kind);

    return NextResponse.json({
      success: true,
      data: backups,
      meta: {
        count: backups.length,
        totalBytes: backups.reduce((sum, backup) => sum + backup.sizeBytes, 0),
      },
    });
  } catch (error) {
    console.error('Error listing backups:', error);
    return NextResponse.json({ success: false, error: 'Failed to list backups' }, { status: 500 });
  }
}

/**
 * POST /api/backups - Archive something.
 *
 * Two shapes: a multipart body carries a finished file (the PDF the report page
 * generated in the browser), while a JSON body asks the server to build a fresh
 * snapshot of the register.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isAdmin(session.permissions)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Administrative access required' },
        { status: 403 }
      );
    }

    const contentType = request.headers.get('content-type') || '';
    let created;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
      }
      if (file.type && file.type !== PDF_MIME) {
        return NextResponse.json(
          { success: false, error: 'Only PDF reports can be archived this way.' },
          { status: 400 }
        );
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        return NextResponse.json(
          { success: false, error: `File is over the ${MAX_UPLOAD_LABEL} limit.` },
          { status: 413 }
        );
      }
      // The declared type comes from the browser; the bytes have to agree.
      const content = new Uint8Array(await file.arrayBuffer());
      if (new TextDecoder().decode(content.subarray(0, 5)) !== '%PDF-') {
        return NextResponse.json(
          { success: false, error: 'Only PDF reports can be archived this way.' },
          { status: 400 }
        );
      }

      created = await BackupService.create({
        kind: 'report',
        fileName: safeFileName(file.name || 'report', '.pdf'),
        mimeType: PDF_MIME,
        content,
        label: meta(formData.get('label')),
        barangay: meta(formData.get('barangay')),
        periodLabel: meta(formData.get('periodLabel')),
        createdBy: session.accountNumber,
      });
    } else {
      const body = await request.json().catch(() => ({}));
      const requested = queryText(typeof body.barangay === 'string' ? body.barangay : null);
      const barangay = requested && requested !== 'General Dashboard' ? requested : null;
      const startDate = body.startDate == null ? null : isoDateParam(body.startDate);
      const endDate = body.endDate == null ? null : isoDateParam(body.endDate);
      if ((body.startDate != null && !startDate) || (body.endDate != null && !endDate)) {
        return NextResponse.json({ success: false, error: 'Invalid date range' }, { status: 400 });
      }

      const snapshot = await BackupService.buildCrimeDataWorkbook({ barangay, startDate, endDate });

      const stamp = new Date().toISOString().split('T')[0];
      const scope = safeFileName(barangay || 'All-Barangays', '.xlsx').replace(/\.xlsx$/, '').replace(/\s+/g, '-');

      created = await BackupService.create({
        kind: 'crime_data',
        fileName: `Crime-Data-${scope}-${stamp}.xlsx`,
        mimeType: XLSX_MIME,
        content: snapshot.buffer,
        label: barangay ? `Brgy. ${barangay}` : 'All barangays',
        barangay,
        periodLabel: meta(body.periodLabel) || snapshot.periodLabel,
        rowCount: snapshot.rowCount,
        createdBy: session.accountNumber,
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'Export',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `Backup:${created.id}`,
        details: `Archived ${created.kind === 'report' ? 'PDF report' : 'crime data snapshot'} ${created.fileName}`,
        fileName: created.fileName,
        fileSize: created.sizeBytes,
        recordsImported: created.rowCount ?? undefined,
        outcome: 'success',
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json({ success: false, error: 'Failed to create backup' }, { status: 500 });
  }
}
