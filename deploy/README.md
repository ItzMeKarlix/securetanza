# Running SecureTanza on the Debian VM

`securetanza.service` runs `npm start`, which is `next start` (the built app)
and the scheduled-export cron worker (`backend/cron/worker.ts`) together —
the same pair that `npm run dev` runs locally, just supervised so it survives
crashes and VM reboots instead of depending on a terminal staying open.

## One-time setup

```bash
# 1. Dedicated, unprivileged user to run the service as
sudo useradd --system --create-home --shell /usr/sbin/nologin securetanza

# 2. Put the app where the unit expects it (or edit WorkingDirectory/paths
#    in securetanza.service to match wherever you actually clone it)
sudo mkdir -p /opt/securetanza
sudo chown securetanza:securetanza /opt/securetanza
#   ...clone/copy the repo into /opt/securetanza as that user...

# 3. Install deps and build (as the securetanza user, or chown afterwards)
cd /opt/securetanza
npm install
npm run build
npm run db:generate   # regenerates the Prisma client against DATABASE_URL

# 4. Production secrets — DATABASE_URL, JWT secret, anything else read via
#    process.env. Not committed; the app's own dotenv calls only look for
#    .env.local / .env, so name this whatever you point EnvironmentFile at.
sudo -u securetanza cp .env.example .env.production   # if one exists, else create by hand
sudo chmod 600 /opt/securetanza/.env.production

# 5. Install and enable the unit
sudo cp deploy/securetanza.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now securetanza
```

## Checking it's actually working

```bash
# Service status, and whether it's restarted unexpectedly
sudo systemctl status securetanza

# Live logs from both next start and the cron worker (they share one unit,
# so [CRON]-prefixed lines are the worker, the rest is Next.js)
sudo journalctl -u securetanza -f

# Cron ticks every minute regardless of whether anything's scheduled to run,
# but you can confirm a schedule actually fired by checking the archive:
# Settings → Backups → filter to "Scheduled", or:
sudo -u securetanza npx tsx -e "
  import('./backend/lib/prisma').then(async ({ prisma, disconnectPrisma }) => {
    const rows = await prisma.backup.findMany({ where: { kind: 'scheduled_export' }, orderBy: { createdAt: 'desc' }, take: 5 });
    console.log(rows);
    await disconnectPrisma();
  });
"
```

## Notes specific to this VM

- No Cloudflare tunnel, no port forwarding — this is LAN-only. `next start`
  binds `0.0.0.0:3000` by default, which is fine for that; nothing here
  needs a reverse proxy or TLS termination unless you decide you want one
  later for LAN HTTPS. If you do put nginx/Caddy in front of it, this unit
  doesn't change — just point the proxy at `127.0.0.1:3000`.
- The unit's `NoNewPrivileges=true` is the only hardening turned on by
  default. If you want tighter sandboxing (`ProtectSystem=strict`,
  `ReadWritePaths=`, etc.), add it once the base setup is confirmed working —
  it wasn't included here because getting it wrong silently breaks startup,
  and there was no way to verify the exact paths Next.js/Prisma need to
  write to on your actual VM from here.
- `Restart=on-failure` restarts the *whole* unit (both processes) if either
  one dies, because `concurrently --kill-others-on-fail` (already set in
  `package.json`'s `start` script) makes one process dying take the other
  down with it — otherwise a crashed cron worker could sit dead indefinitely
  while Next.js kept serving requests, and systemd would have no way to know.

## Cloud deployment: email sign-in

Staff sign in with their email address. Invites, password resets and unlock
links are sent by email, so a cloud deployment needs these set (see
`.env.example` at the repo root for the full list):

- `APP_BASE_URL` — the public origin, e.g. `https://securetanza.example.gov.ph`.
  Every emailed link is built from this, never from the request's Host header.
  Required in production; the app refuses to build links without it.
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`,
  `MAIL_FROM` — any SMTP provider works (Google Workspace, Microsoft 365,
  Brevo, Mailgun, SES SMTP…). Set up SPF and DKIM for the `MAIL_FROM`
  domain, or invites will land in spam.
- `ALLOWED_EMAIL_DOMAINS` (optional) — restrict staff addresses to your
  agency's domains.
- `JWT_SECRET` — a long random value; the built-in fallback is not safe.

The server also calls `https://api.pwnedpasswords.com` when someone sets a
password (only a 5-character hash prefix is sent). If outbound HTTPS is
blocked, the breach check is skipped and the offline checks still apply.

### Moving existing accounts to email

1. Apply migrations (`pnpm db:migrate:deploy`, or run
   `backend/prisma/migrations/20261021000000_email_auth/migration.sql`
   directly if the migration history is out of sync).
2. Existing accounts keep signing in with their account number until an
   administrator adds an email in Access & Security (the table marks them
   **No email**). From then on that account signs in with the email only.
3. Optionally use **Send reset link** on each account so people pick a new
   password through the emailed link.
4. Once no account is left without an email, remove the account-number
   fallback in `app/api/auth/login/route.ts` (marked TRANSITION).

## Two-step verification

Every account must use an authenticator app (with an emailed-code fallback)
in addition to the password. Set up once per deployment:

- `MFA_ENCRYPTION_KEY` — `openssl rand -base64 32`. Encrypts the
  authenticator secrets in the database. **Back it up with the database
  credentials.** If it's lost or changed, nobody's authenticator code will
  verify and every account has to be reset.
- Optional: `MFA_TRUST_DAYS_ADMIN` (default 30) and `MFA_TRUST_DAYS_STAFF`
  (default 60) — how long "Trust this browser" lasts.
- Apply the migration `backend/prisma/migrations/20261021120000_mfa`.

### Break-glass reset

If the only administrator loses their phone *and* their backup codes, nobody
can reset them from the app. From the server, with the app's environment:

```bash
pnpm mfa:reset admin@agency.gov.ph      # or an account number, e.g. ACC-000001
```

This removes their authenticator, backup codes and trusted browsers, clears
any lockout, and writes a high-severity audit entry. They sign in with their
password and set up a new authenticator.
