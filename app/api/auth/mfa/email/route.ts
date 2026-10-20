import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { readChallenge } from '@/lib/mfa/challenge';
import { EMAIL_CODE_TTL_MS, emailCodeRefusal, issueEmailCode } from '@/lib/mfa/second-factor';
import { auditAuth, loadSignInUser } from '@/lib/mfa/sign-in';
import { sendMail } from '@/lib/email/mailer';
import { mfaCodeEmail } from '@/lib/email/templates';

const REFUSAL_MESSAGES = {
  'recent-reset':
    "For your security, emailed codes are unavailable for 7 days after a password reset by email. Use your authenticator app or a backup code.",
  cooldown: 'A code was just sent. Wait a minute before asking for another.',
  'too-many': 'Too many codes requested. Wait 15 minutes, or use your authenticator app or a backup code.',
  'no-email': 'This account has no email address. Use your authenticator app or a backup code.',
} as const;

function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  return `${name.slice(0, 2)}${'•'.repeat(Math.max(1, name.length - 2))}@${domain}`;
}

// POST /api/auth/mfa/email - email a one-time sign-in code (fallback for the authenticator app)
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request) || 'unknown';
    if (!(await allowRequest(`mfa-email:${ip}`, 10, 15 * 60))) {
      return NextResponse.json({ error: 'Too many requests. Please wait a few minutes.' }, { status: 429 });
    }

    const challenge = await readChallenge();
    if (!challenge || challenge.stage !== 'challenge') {
      return NextResponse.json({ error: 'Your sign-in timed out. Enter your password again.', restart: true }, { status: 401 });
    }
    const user = await loadSignInUser(challenge.userId);
    if (!user || user.sessionVersion !== challenge.sessionVersion || user.lockedAt) {
      return NextResponse.json({ error: 'Your sign-in timed out. Enter your password again.', restart: true }, { status: 401 });
    }

    const refusal = await emailCodeRefusal(user);
    if (refusal) {
      return NextResponse.json({ error: REFUSAL_MESSAGES[refusal], refusal }, { status: refusal === 'cooldown' || refusal === 'too-many' ? 429 : 403 });
    }

    const code = await issueEmailCode(user.id);
    const sent = await sendMail(mfaCodeEmail(user.email!, user.fullName, code, EMAIL_CODE_TTL_MS / 60_000));
    await auditAuth(request, user.accountNumber, sent ? 'Emailed a sign-in verification code' : 'Sign-in verification code could not be emailed', sent ? 'success' : 'failed', 'low');

    if (!sent) {
      return NextResponse.json({ error: "The code couldn't be emailed right now. Use your authenticator app or a backup code." }, { status: 502 });
    }
    return NextResponse.json({ success: true, sentTo: maskEmail(user.email!) });
  } catch (error) {
    console.error('MFA email error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
