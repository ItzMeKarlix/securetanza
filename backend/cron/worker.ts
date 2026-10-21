import './load-env';

import cron from 'node-cron';
import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { prisma, disconnectPrisma } from '../lib/prisma';
import { runDueExports } from '../services/scheduled-export.service';
import { purgeCutoff } from '../../lib/soft-delete';

console.log("🕒 Starting Scheduled Data Exports background worker...");

const EXPORTS_DIR = path.join(process.cwd(), 'exports');
const RETENTION_DAYS = 14;
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/**
 * Clean up export files older than RETENTION_DAYS to prevent disk bloating.
 *
 * Scheduled exports are archived in the database now, so this only drains what the
 * previous on-disk implementation left behind.
 */
async function cleanOldExports(): Promise<void> {
  try {
    if (!existsSync(EXPORTS_DIR)) return;
    const files = await fs.readdir(EXPORTS_DIR);
    const now = Date.now();

    for (const file of files) {
      if (!file.endsWith('.xlsx')) continue;
      const filePath = path.join(EXPORTS_DIR, file);
      try {
        const stats = await fs.stat(filePath);
        if (now - stats.mtimeMs > RETENTION_MS) {
          await fs.unlink(filePath);
          console.log(`[CLEANUP] Deleted expired export file: ${file}`);
        }
      } catch (err) {
        console.error(`[CLEANUP] Error checking file ${file}:`, err);
      }
    }
  } catch (error) {
    console.error('[CLEANUP] Error cleaning old exports:', error);
  }
}

/**
 * Daily housekeeping. Scheduled reports older than RETENTION_DAYS move to
 * Recently deleted (they were also emailed); backups made by hand are left
 * alone. Accounts and backups deleted more than 30 days ago are removed for good.
 */
async function housekeeping(): Promise<void> {
  try {
    const now = new Date();
    const retired = await prisma.backup.updateMany({
      where: { kind: 'scheduled_export', deletedAt: null, createdAt: { lt: new Date(now.getTime() - RETENTION_MS) } },
      data: { deletedAt: now, deletedBy: 'system' },
    });
    const cutoff = purgeCutoff(now.getTime());
    const purgedBackups = await prisma.backup.deleteMany({ where: { deletedAt: { lt: cutoff } } });
    const purgedUsers = await prisma.user.findMany({ where: { deletedAt: { lt: cutoff } }, select: { id: true, accountNumber: true } });
    if (purgedUsers.length) await prisma.user.deleteMany({ where: { id: { in: purgedUsers.map((u) => u.id) } } });

    if (retired.count || purgedBackups.count || purgedUsers.length) {
      const details = [
        retired.count && `moved ${retired.count} scheduled report(s) older than ${RETENTION_DAYS} days to Recently deleted`,
        purgedBackups.count && `permanently removed ${purgedBackups.count} backup(s) deleted over 30 days ago`,
        purgedUsers.length && `permanently removed account(s) ${purgedUsers.map((u) => u.accountNumber).join(', ')} deleted over 30 days ago`,
      ].filter(Boolean).join('; ');
      console.log(`[CLEANUP] ${details}`);
      await prisma.auditLog.create({
        data: { action: 'Settings', user: 'system', ip: 'server', resource: 'Retention', details: `Retention: ${details}`, severity: 'medium', outcome: 'success' },
      });
    }
  } catch (error) {
    console.error('[CLEANUP] Housekeeping failed:', error);
  }
}

// Initial cleanup on worker boot
cleanOldExports();
housekeeping();

// Schedule daily cleanup at 03:00 AM
const cleanupTask = cron.schedule('0 3 * * *', () => {
  cleanOldExports();
  housekeeping();
});

let isRunning = false;

// Run every minute to check for scheduled exports
const task = cron.schedule('* * * * *', async () => {
  if (isRunning) {
    console.log('⏳ Previous export job still executing, skipping this tick...');
    return;
  }

  isRunning = true;
  try {
    // Due runs, including one catch-up for a run missed while the worker was off.
    await runDueExports(new Date());
  } catch (error) {
    console.error('Error running cron job:', error);
  } finally {
    isRunning = false;
  }
});

// Graceful shutdown
let isShuttingDown = false;
async function handleShutdown(signal: string) {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`\n🛑 Received ${signal}. Gracefully stopping background worker...`);
  task.stop();
  cleanupTask.stop();
  await disconnectPrisma();
  console.log('✅ Background worker stopped cleanly.');
  process.exit(0);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
