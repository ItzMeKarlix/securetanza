import { NextRequest, NextResponse } from 'next/server';
import { getClientIp } from '@/lib/request-context';
import { allowRequest } from '@/lib/rate-limit';
import { peekToken } from '@/lib/auth-tokens';
import { linkTokenParam } from '@/lib/input-sanitize';

// GET /api/auth/token?token= - Describe an invite/reset link without using it (public)
export async function GET(request: NextRequest) {
  const ip = getClientIp(request) || 'unknown';
  if (!(await allowRequest(`token-peek:${ip}`, 30, 15 * 60))) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const raw = linkTokenParam(request.nextUrl.searchParams.get('token'));
  try {
    const result = await peekToken(raw);
    if (result.problem) {
      return NextResponse.json({ valid: false, problem: result.problem });
    }
    const { token } = result;
    return NextResponse.json({
      valid: true,
      purpose: token.purpose,
      fullName: token.user.fullName,
      email: token.user.email,
      expiresAt: token.expiresAt.toISOString(),
    });
  } catch (error) {
    console.error('Token lookup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
