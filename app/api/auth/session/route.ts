import { NextResponse } from 'next/server';
import { resolveSession } from '@/lib/auth';

/**
 * Session check used by the browser on load, focus and every 30 s.
 *
 *   200 { authenticated: true,  user }          signed in
 *   200 { authenticated: false, reason }        signed out — reason "none" (never signed in)
 *                                                or "invalid" (expired / revoked / signed out elsewhere)
 *   503 { authenticated: null }                 couldn't check right now; keep the session
 *
 * The 503 case matters: a database blip or dropped connection must never look
 * like a sign-out to the client.
 */
export async function GET() {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    const result = await resolveSession();

    if (result.status === 'unavailable') {
      return NextResponse.json(
        { success: false, authenticated: null, error: 'Session service temporarily unavailable' },
        { status: 503, headers }
      );
    }

    if (result.status !== 'valid') {
      return NextResponse.json(
        { success: false, authenticated: false, reason: result.status, user: null },
        { status: 200, headers }
      );
    }

    const { session } = result;
    return NextResponse.json(
      {
        success: true,
        authenticated: true,
        user: {
          id: session.userId,
          accountNumber: session.accountNumber,
          email: session.email ?? null,
          fullName: session.fullName,
          permissions: session.permissions,
          mustChangePassword: session.mustChangePassword,
          defaultLandingPage: session.defaultLandingPage,
          autoLogoutTimer: session.autoLogoutTimer,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { success: false, authenticated: null, error: 'Internal server error' },
      { status: 503, headers }
    );
  }
}
