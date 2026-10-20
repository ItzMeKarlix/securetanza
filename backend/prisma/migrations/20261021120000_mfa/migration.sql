-- Two-factor authentication.
ALTER TABLE "users" ADD COLUMN "totp_secret_enc" TEXT,
ADD COLUMN "totp_enabled_at" TIMESTAMP(3),
ADD COLUMN "totp_last_step" INTEGER,
ADD COLUMN "mfa_failed_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "password_reset_via_email_at" TIMESTAMP(3);

CREATE TABLE "mfa_backup_codes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "code_hash" TEXT NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "mfa_backup_codes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "mfa_backup_codes_user_id_idx" ON "mfa_backup_codes"("user_id");
ALTER TABLE "mfa_backup_codes" ADD CONSTRAINT "mfa_backup_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "trusted_devices" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" TEXT NOT NULL,
    "session_version" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_used_at" TIMESTAMP(3),
    CONSTRAINT "trusted_devices_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "trusted_devices_token_hash_key" ON "trusted_devices"("token_hash");
CREATE INDEX "trusted_devices_user_id_idx" ON "trusted_devices"("user_id");
ALTER TABLE "trusted_devices" ADD CONSTRAINT "trusted_devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
