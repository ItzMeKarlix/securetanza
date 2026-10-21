/**
 * Scheduled offense reports: build the period's workbook, keep it in the
 * archive, email it to the person who scheduled it, and record it in the audit
 * trail. One code path for the background worker and the "Export now" button.
 */
import { prisma } from '@/backend/lib/prisma';
import { BackupService, XLSX_MIME } from '@/backend/services/backup.service';
import { sendMail } from '@/lib/email/mailer';
import { scheduledExportEmail } from '@/lib/email/templates';
import { appUrl } from '@/lib/app-url';
import { dueOccurrence, periodFor } from '@/lib/export-schedule';

/** Larger reports are only linked from the email; mail servers commonly refuse ~10 MB+. */
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;

export interface ExportOwner {
  id: number;
  accountNumber: string;
  fullName: string;
  email: string | null;
}

export interface ExportResult {
  backupId: string;
  fileName: string;
  periodLabel: string;
  offenses: number;
  emailed: boolean;
}

/**
 * Build and deliver one report. `runAt` decides the period: the complete
 * day / week / month before the day it runs.
 */
export async function produceScheduledExport(
  owner: ExportOwner,
  frequency: string,
  runAt: Date,
  trigger: 'schedule' | 'manual',
): Promise<ExportResult> {
  const period = periodFor(frequency, runAt);
  const snapshot = await BackupService.buildCrimeDataWorkbook({
    startDate: period.start.toISOString(),
    // The workbook filter is inclusive; the period's end is exclusive.
    endDate: new Date(period.end.getTime() - 1).toISOString(),
    periodLabel: period.label,
  });

  const fileName = `Offense-Report-${frequency}-${period.stamp}.xlsx`;
  const backup = await BackupService.create({
    kind: 'scheduled_export',
    fileName,
    mimeType: XLSX_MIME,
    content: snapshot.buffer,
    label: `${frequency[0].toUpperCase()}${frequency.slice(1)} offense report`,
    periodLabel: period.label,
    rowCount: snapshot.rowCount,
    createdBy: owner.accountNumber,
  });

  let emailed = false;
  if (owner.email) {
    emailed = await sendMail(
      scheduledExportEmail(
        owner.email,
        owner.fullName,
        {
          frequency,
          periodLabel: period.label,
          offenses: snapshot.rowCount,
          fileName,
          content: snapshot.buffer.length <= MAX_ATTACHMENT_BYTES ? snapshot.buffer : undefined,
        },
        appUrl('/dashboard/config/exports'),
      ),
    );
  }

  await prisma.auditLog.create({
    data: {
      action: 'Export',
      user: trigger === 'schedule' ? 'system' : owner.accountNumber,
      ip: 'server',
      resource: `Backup:${backup.id}`,
      details: `${trigger === 'schedule' ? 'Scheduled' : 'On-demand'} ${frequency} offense report for ${period.label} (${snapshot.rowCount} offenses) for ${owner.accountNumber}${owner.email ? (emailed ? `, emailed to ${owner.email}` : `; email to ${owner.email} failed`) : ''}`,
      severity: 'low',
      outcome: emailed || !owner.email ? 'success' : 'failure',
    },
  });

  return { backupId: backup.id, fileName, periodLabel: period.label, offenses: snapshot.rowCount, emailed };
}

/**
 * One worker tick: run every enabled schedule whose run is due. Each run is
 * claimed first (an atomic update on lastAttemptAt), so two workers — or a
 * restarted one — never send the same report twice.
 */
export async function runDueExports(now = new Date()): Promise<number> {
  const schedules = await prisma.exportSchedule.findMany({
    where: { enabled: true, user: { deletedAt: null } },
    include: { user: { select: { id: true, accountNumber: true, fullName: true, email: true } } },
  });

  let ran = 0;
  for (const schedule of schedules) {
    const occurrence = dueOccurrence(schedule, now);
    if (!occurrence) continue;

    const claimed = await prisma.exportSchedule.updateMany({
      where: { id: schedule.id, lastAttemptAt: schedule.lastAttemptAt },
      data: { lastAttemptAt: now },
    });
    if (claimed.count === 0) continue;

    try {
      const result = await produceScheduledExport(schedule.user, schedule.frequency, occurrence, 'schedule');
      await prisma.exportSchedule.update({
        where: { id: schedule.id },
        data: { lastRunAt: now, lastRunError: result.emailed || !schedule.user.email ? null : 'The report was saved, but the email could not be sent.' },
      });
      console.log(`[CRON] ${result.fileName} for ${schedule.user.accountNumber}: ${result.offenses} offenses${result.emailed ? ', emailed' : ''}`);
      ran++;
    } catch (error) {
      console.error(`[CRON] Scheduled export failed for ${schedule.user.accountNumber}:`, error);
      await prisma.exportSchedule.update({
        where: { id: schedule.id },
        data: { lastRunError: 'The last scheduled export failed. It will be retried automatically.' },
      });
    }
  }
  return ran;
}
