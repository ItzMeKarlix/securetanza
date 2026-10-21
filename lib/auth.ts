/**
 * Authentication utilities
 */
import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { canOperate, isAdminUser } from "@/lib/auth-routes";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this-in-production");

export interface User {
	id: number;
	accountNumber: string;
	email?: string | null;
	/** Must match users.session_version for the session to stay valid. */
	sessionVersion?: number;
	fullName: string;
	permissions: string[];
	mustChangePassword?: boolean;
	defaultLandingPage?: string;
	autoLogoutTimer?: number;
}

export interface SessionPayload {
	sessionId: string;
	userId: number;
	accountNumber: string;
	email: string | null;
	sessionVersion: number;
	fullName: string;
	permissions: string[];
	mustChangePassword: boolean;
	defaultLandingPage: string;
	autoLogoutTimer: number;
	expiresAt: Date;
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
	return hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	return compare(password, hashedPassword);
}

/**
 * Create a JWT token
 */
export async function createToken(payload: Omit<SessionPayload, "expiresAt">): Promise<string> {
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

	return new SignJWT({ ...payload, expiresAt: expiresAt.toISOString() })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(JWT_SECRET);
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<SessionPayload | null> {
	try {
		const { payload } = await jwtVerify(token, JWT_SECRET);
		return payload as unknown as SessionPayload;
	} catch (error) {
		return null;
	}
}

/**
 * Create a session cookie
 */
export async function createSession(user: User): Promise<string> {
	const sessionId = crypto.randomUUID();
	const token = await createToken({
		sessionId,
		userId: user.id,
		accountNumber: user.accountNumber,
		email: user.email ?? null,
		sessionVersion: user.sessionVersion ?? 0,
		fullName: user.fullName,
		permissions: user.permissions,
		mustChangePassword: user.mustChangePassword ?? false,
		defaultLandingPage: user.defaultLandingPage ?? "dashboard",
		autoLogoutTimer: user.autoLogoutTimer ?? 15,
	});

	const cookieStore = await cookies();
	cookieStore.set("session", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});

	return sessionId;
}

import { prisma } from '@/backend/lib/prisma';
import { cacheService, CacheKeys, TTL } from '@/backend/cache';

export interface CachedUserValidation {
  fullName: string;
  permissions: string[];
  mustChangePassword: boolean;
  defaultLandingPage: string;
  autoLogoutTimer: number;
  accountNumber: string;
  email: string | null;
  sessionVersion: number;
}

export function invalidateSessionCache(userId?: number): void {
  if (userId) {
    cacheService.delete(CacheKeys.auth.userSession(userId)).catch(() => {});
  } else {
    cacheService.deleteByPattern(CacheKeys.auth.pattern()).catch(() => {});
  }
}

export async function getSessionCacheStats() {
  const stats = await cacheService.getStats();
  return {
    size: stats.activeKeys,
    maxSize: 5000,
    ttlMs: TTL.USER_SESSION * 1000,
    hitRatio: stats.hitRatio,
    queriesSaved: stats.dbQueriesSaved,
  };
}

/** Loads what a session needs from the database; null means the account can no longer sign in. */
async function loadUserValidation(userId: number): Promise<CachedUserValidation | null> {
  // One joined query: with the database a network hop away, the default
  // three-step include (user, links, permissions) tripled the wait.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    relationLoadStrategy: 'join',
    include: { permissions: { include: { permission: true } } },
  });
  // Deleted accounts can't hold a session.
  if (!user || user.deletedAt) return null;

  const activePermissions = user.permissions.map(p => p.permission.permissionName);
  // All permissions revoked: the account is no longer allowed in.
  if (activePermissions.length === 0) return null;

  return {
    fullName: user.fullName,
    permissions: activePermissions,
    mustChangePassword: user.mustChangePassword,
    defaultLandingPage: user.defaultLandingPage,
    autoLogoutTimer: user.autoLogoutTimer,
    accountNumber: user.accountNumber,
    email: user.email,
    sessionVersion: user.sessionVersion,
  };
}

/**
 * Seed the session-validation cache right after sign-in, so the first
 * /api/auth/session call the browser makes doesn't repeat a lookup the login
 * just did.
 */
export async function primeSessionCache(userId: number, data: CachedUserValidation) {
  try {
    await cacheService.set(CacheKeys.auth.userSession(userId), data, TTL.USER_SESSION);
  } catch {}
}

function matchesSession(userData: CachedUserValidation | null, payload: SessionPayload) {
  // A password set/reset/change or an unlock bumps session_version, which signs
  // out every session minted before it. Tokens (and cache entries) from before
  // the column existed carry no version and count as 0.
  return Boolean(
    userData &&
      userData.accountNumber === payload.accountNumber &&
      userData.permissions.length > 0 &&
      (userData.sessionVersion ?? 0) === (payload.sessionVersion ?? 0)
  );
}

export type SessionResult =
  /** Signed in and still allowed. */
  | { status: 'valid'; session: SessionPayload }
  /** No session cookie at all — a visitor, not an expiry. */
  | { status: 'none' }
  /** There was a session, and it is definitively over (expired, revoked, signed out elsewhere). */
  | { status: 'invalid' }
  /** Couldn't check right now (database unreachable…). The session may well be fine — don't sign anyone out. */
  | { status: 'unavailable' };

/**
 * Resolve the current session, telling "you are signed out" apart from
 * "we couldn't check". Only `invalid` clears the cookie.
 */
export async function resolveSession(): Promise<SessionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return { status: 'none' };

  const payload = await verifyToken(token);
  if (!payload) return { status: 'invalid' };

  const cacheKey = CacheKeys.auth.userSession(payload.userId);
  let userData: CachedUserValidation | null;
  try {
    userData = await cacheService.getOrSet<CachedUserValidation | null>(
      cacheKey,
      TTL.USER_SESSION,
      () => loadUserValidation(payload.userId)
    );

    // A cached copy can be older than this token (e.g. another server instance
    // re-issued it after a password change). Re-check the database once before
    // treating a mismatch as a real sign-out.
    if (!matchesSession(userData, payload)) {
      await cacheService.delete(cacheKey);
      userData = await loadUserValidation(payload.userId);
      if (userData) await cacheService.set(cacheKey, userData, TTL.USER_SESSION);
    }
  } catch (error) {
    console.error('Error validating session with database:', error);
    return { status: 'unavailable' };
  }

  if (!matchesSession(userData, payload)) {
    try {
      cookieStore.delete('session');
    } catch {}
    return { status: 'invalid' };
  }

  return {
    status: 'valid',
    session: {
      ...payload,
      fullName: userData!.fullName,
      email: userData!.email,
      permissions: userData!.permissions,
      mustChangePassword: userData!.mustChangePassword,
      defaultLandingPage: userData!.defaultLandingPage,
      autoLogoutTimer: userData!.autoLogoutTimer,
    },
  };
}

/**
 * Get the current session with real-time database validation (cached with single-flight stampede protection).
 * Returns null when signed out *or* when the session couldn't be checked; use
 * resolveSession() where the difference matters.
 */
export async function getSession(validateWithDb: boolean = true): Promise<SessionPayload | null> {
  if (!validateWithDb) {
    const token = (await cookies()).get('session')?.value;
    return token ? verifyToken(token) : null;
  }
  const result = await resolveSession();
  return result.status === 'valid' ? result.session : null;
}

/**
 * Delete the session cookie
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if (token) {
    const payload = await verifyToken(token);
    if (payload?.userId) {
      invalidateSessionCache(payload.userId);
    }
  }
  cookieStore.delete('session');
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(session: SessionPayload | null, permission: string): boolean {
	if (!session) return false;
	return session.permissions.includes(permission) || session.permissions.includes("admin");
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(session: SessionPayload | null, permissions: string[]): boolean {
	if (!session) return false;
	if (session.permissions.includes("admin")) return true;
	return permissions.some((permission) => session.permissions.includes(permission));
}

/**
 * True administrator session (user management, audit logs, backups, monitoring).
 */
export function isAdminSession(session: SessionPayload | null): session is SessionPayload {
	return !!session && isAdminUser(session.permissions);
}

/**
 * Administrator or Member session — allowed to do functional work
 * (uploads, record edits, exports) but not the admin-only controls.
 */
export function canOperateSession(session: SessionPayload | null): session is SessionPayload {
	return !!session && canOperate(session.permissions);
}
