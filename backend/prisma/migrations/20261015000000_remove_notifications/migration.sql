-- Remove the retired notification engine and its delivery preferences.
-- Crime records, audit logs, export schedules, and retained backups are preserved.
DROP TABLE IF EXISTS "notifications";
DROP TABLE IF EXISTS "notification_rules";

DROP TYPE IF EXISTS "NotificationSeverity";
DROP TYPE IF EXISTS "NotificationCategory";
DROP TYPE IF EXISTS "RuleConditionType";

ALTER TABLE IF EXISTS "export_schedules" DROP COLUMN IF EXISTS "delivery_mode";
