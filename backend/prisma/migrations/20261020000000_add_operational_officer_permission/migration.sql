-- Member role: full operational access without audit, security or backup controls.
INSERT INTO "permissions" ("permission_name", "description")
VALUES ('operational_officer', 'Member: day-to-day operations (map, cases, analytics, uploads, exports) without audit logs, security or backups.')
ON CONFLICT ("permission_name") DO NOTHING;
