import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { requireStepUp, signedInUser } from '@/lib/mfa/actor';
import { auditAuth } from '@/lib/mfa/sign-in';
import { forgetThisBrowser } from '@/lib/mfa/trusted-device';

// DELETE /api/auth/mfa/devices - stop trusting every browser (step-up required)
export async function DELETE(request: NextRequest) {
  try {
    const signed = await signedInUser();
    if ('error' in signed) return NextResponse.json({ error: signed.error }, { status: signed.status });
    const { user } = signed;

    const body = await request.json().catch(() => ({}));
    const stepUp = await requireStepUp(user, body);
    if (stepUp) return NextResponse.json({ error: stepUp.error, locked: stepUp.locked }, { status: stepUp.status });

    const { count } = await prisma.trustedDevice.deleteMany({ where: { userId: user.id } });
    await forgetThisBrowser();
    await auditAuth(request, user.accountNumber, `Revoked all trusted browsers (${count})`, 'success', 'low');
    return NextResponse.json({ success: true, revoked: count });
  } catch (error) {
    console.error('MFA devices error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
