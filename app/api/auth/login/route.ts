import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { verifyPassword } from '@/lib/auth';
import { completeSignIn, mfaStage } from '@/lib/mfa/sign-in';
import { isTrustedBrowser, trustDays } from '@/lib/mfa/trusted-device';
import { isAdminUser } from '@/lib/auth-routes';
import { startChallenge } from '@/lib/mfa/challenge';
import { emailCodeRefusal } from '@/lib/mfa/second-factor';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { normalizeEmail } from '@/lib/email-address';
import { MAX_PASSWORD_LENGTH, cleanText } from '@/lib/input-sanitize';

/** Consecutive wrong passwords tolerated before the account is locked. */
const MAX_FAILED_ATTEMPTS = 3;

const LOCKED_MESSAGE =
  'This account is locked after too many failed sign-in attempts. Contact your system administrator to have it unlocked.';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // `accountNumber` is the field older clients send; same meaning as `identifier`.
    const rawIdentifier: unknown = body.identifier ?? body.email ?? body.accountNumber;
    const password: unknown = body.password;
    const identifier = typeof rawIdentifier === 'string' && rawIdentifier.length <= 320 ? cleanText(rawIdentifier) : '';
    const ip = getClientIp(request) || 'unknown';
    const userAgent = getUserAgent(request);

    // Validate input
    if (!identifier || typeof password !== 'string' || !password || password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // relationLoadStrategy 'join' fetches the user and permissions in one query
    // instead of three sequential ones.
    const include = { permissions: { include: { permission: true } } } as const;
    const relationLoadStrategy = 'join' as const;

    // Email is the sign-in identifier. TRANSITION: an account number still
    // works, but only for accounts that have not been given an email yet —
    // once an administrator sets one, the account number stops signing in.
    // Remove this branch once no users.email IS NULL rows remain.
    const user = identifier.includes('@')
      ? await prisma.user.findUnique({ where: { email: normalizeEmail(identifier) }, include, relationLoadStrategy })
      : await prisma.user.findFirst({ where: { accountNumber: identifier, email: null }, include, relationLoadStrategy });

    if (!user) {
      await prisma.auditLog.create({
        data: {
          action: 'Auth',
          user: identifier.slice(0, 120),
          ip,
          userAgent,
          details: 'Failed login attempt',
          errorMessage: 'Invalid credentials (User not found)',
          outcome: 'failed',
          severity: 'medium',
        },
      });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // A locked account is refused before the password is even checked, so the
    // lock cannot be worn down by further guessing.
    if (user.lockedAt) {
      await prisma.auditLog.create({
        data: {
          action: 'Auth',
          user: user.accountNumber,
          ip,
          userAgent,
          details: 'Sign-in attempt on a locked account',
          errorMessage: 'Account locked - awaiting administrator unlock',
          outcome: 'failed',
          severity: 'high',
        },
      });
      return NextResponse.json({ error: LOCKED_MESSAGE, locked: true }, { status: 403 });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);

    if (!isValidPassword) {
      const attempts = user.failedLoginAttempts + 1;
      const nowLocked = attempts >= MAX_FAILED_ATTEMPTS;

      // Independent writes: run them together rather than one network hop after the other.
      await Promise.all([
        prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: attempts,
            ...(nowLocked ? { lockedAt: new Date() } : {}),
          },
        }),
        prisma.auditLog.create({
          data: {
            action: 'Auth',
            user: user.accountNumber,
            ip,
            userAgent,
            details: nowLocked
              ? `Account locked after ${attempts} consecutive failed sign-in attempts`
              : `Failed login attempt (${attempts} of ${MAX_FAILED_ATTEMPTS})`,
            errorMessage: nowLocked
              ? 'Account locked - administrator unlock required'
              : 'Invalid credentials (Wrong password)',
            outcome: 'failed',
            severity: nowLocked ? 'high' : 'medium',
          },
        }),
      ]);

      if (nowLocked) {
        return NextResponse.json({ error: LOCKED_MESSAGE, locked: true }, { status: 403 });
      }

      const remaining = MAX_FAILED_ATTEMPTS - attempts;
      return NextResponse.json(
        {
          error: `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining before this account is locked.`,
          attemptsRemaining: remaining,
        },
        { status: 401 }
      );
    }

    // Extract permissions
    const permissions = user.permissions.map(up => up.permission.permissionName);

    // If user has zero permissions assigned (access revoked)
    if (permissions.length === 0) {
      await prisma.auditLog.create({
        data: {
          action: 'Auth',
          user: user.accountNumber,
          ip,
          userAgent,
          details: 'Failed login attempt - Access revoked / No permissions assigned',
          errorMessage: 'Account access has been revoked',
          outcome: 'failed',
          severity: 'medium',
        },
      });
      return NextResponse.json(
        { error: 'Your account access has been revoked. Please contact your system administrator.' },
        { status: 403 }
      );
    }

    // Password is right, so the run of password failures is over.
    if (user.failedLoginAttempts > 0) {
      await prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0 } });
      user.failedLoginAttempts = 0;
    }

    // Second factor is required for every account. A browser the person chose
    // to trust skips the code (never the password); everyone else continues to
    // /api/auth/mfa/* with a short-lived challenge cookie — no session yet.
    const stage = mfaStage(user);
    if (stage === 'challenge' && (await isTrustedBrowser(user))) {
      return NextResponse.json(await completeSignIn(user, request, 'password + trusted browser'));
    }

    await startChallenge({ userId: user.id, sessionVersion: user.sessionVersion, stage });
    const emailRefusal = stage === 'challenge' ? await emailCodeRefusal(user) : 'no-email';

    return NextResponse.json({
      success: true,
      mfa: stage,
      fullName: user.fullName,
      // Hide "Email me a code" when it would be refused for policy reasons.
      emailFallback: emailRefusal === null || emailRefusal === 'cooldown' || emailRefusal === 'too-many',
      trustDays: trustDays(isAdminUser(permissions)),
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
