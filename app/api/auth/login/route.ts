import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { verifyPassword, createSession, primeSessionCache } from '@/lib/auth';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { normalizeEmail } from '@/lib/email-address';

/** Consecutive wrong passwords tolerated before the account is locked. */
const MAX_FAILED_ATTEMPTS = 3;

const LOCKED_MESSAGE =
  'This account is locked after 3 failed sign-in attempts. Contact your system administrator to have it unlocked.';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // `accountNumber` is the field older clients send; same meaning as `identifier`.
    const rawIdentifier: unknown = body.identifier ?? body.email ?? body.accountNumber;
    const password: unknown = body.password;
    const identifier = typeof rawIdentifier === 'string' ? rawIdentifier.trim() : '';
    const ip = getClientIp(request) || 'unknown';
    const userAgent = getUserAgent(request);

    // Validate input
    if (!identifier || typeof password !== 'string' || !password) {
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

    // Create session
    const sessionId = await createSession({
      id: user.id,
      accountNumber: user.accountNumber,
      email: user.email,
      sessionVersion: user.sessionVersion,
      fullName: user.fullName,
      permissions,
      mustChangePassword: user.mustChangePassword,
      defaultLandingPage: user.defaultLandingPage,
      autoLogoutTimer: user.autoLogoutTimer,
    });

    // The password was right, so the run of failures is over. This, the audit
    // entry and priming the session cache are independent — do them together.
    await Promise.all([
      user.failedLoginAttempts > 0
        ? prisma.user.update({ where: { id: user.id }, data: { failedLoginAttempts: 0 } })
        : null,
      prisma.auditLog.create({
        data: {
          action: 'Auth',
          user: user.accountNumber,
          ip,
          session: sessionId,
          userAgent,
          details: 'User logged in successfully',
          outcome: 'success',
        },
      }),
      primeSessionCache(user.id, {
        fullName: user.fullName,
        permissions,
        mustChangePassword: user.mustChangePassword,
        defaultLandingPage: user.defaultLandingPage,
        autoLogoutTimer: user.autoLogoutTimer,
        accountNumber: user.accountNumber,
        email: user.email,
        sessionVersion: user.sessionVersion,
      }),
    ]);

    return NextResponse.json({
      success: true,
      mustChangePassword: user.mustChangePassword,
      user: {
        id: user.id,
        accountNumber: user.accountNumber,
        email: user.email,
        fullName: user.fullName,
        permissions,
        defaultLandingPage: user.defaultLandingPage,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
