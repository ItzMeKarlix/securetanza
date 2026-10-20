import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { enrollmentActor } from '@/lib/mfa/actor';
import { setPendingSecret } from '@/lib/mfa/challenge';
import { encryptSecret } from '@/lib/mfa/crypto';
import { enrollmentDetails, newTotpSecret } from '@/lib/mfa/totp';

// POST /api/auth/mfa/enroll/start - new authenticator secret + QR code (nothing saved to the account yet)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || 'unknown';
    if (!(await allowRequest(`mfa-enroll:${ip}`, 20, 15 * 60))) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const actor = await enrollmentActor(body);
    if ('error' in actor) {
      return NextResponse.json({ error: actor.error, restart: actor.restart, locked: actor.locked }, { status: actor.status });
    }

    const secret = newTotpSecret();
    await setPendingSecret(actor.user.id, encryptSecret(secret));
    const details = await enrollmentDetails(secret, actor.user.email ?? actor.user.accountNumber);

    return NextResponse.json({
      success: true,
      qrDataUrl: details.qrDataUrl,
      manualKey: details.manualKey,
      otpauthUrl: details.uri,
      account: actor.user.email ?? actor.user.accountNumber,
    });
  } catch (error) {
    console.error('MFA enroll start error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
