-- Soft delete for accounts and archived backups: rows are hidden and
-- restorable for 30 days, then purged by the background worker.
ALTER TABLE "users" ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" TEXT;
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

ALTER TABLE "backups" ADD COLUMN "deleted_at" TIMESTAMP(3),
ADD COLUMN "deleted_by" TEXT;
CREATE INDEX "backups_deleted_at_idx" ON "backups"("deleted_at");

-- Scheduled export bookkeeping, so a missed run catches up and failures are visible.
ALTER TABLE "export_schedules" ADD COLUMN "saved_at" TIMESTAMP(3),
ADD COLUMN "last_run_at" TIMESTAMP(3),
ADD COLUMN "last_attempt_at" TIMESTAMP(3),
ADD COLUMN "last_run_error" TEXT;
