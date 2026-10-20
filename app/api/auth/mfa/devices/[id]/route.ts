import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { signedInUser } from '@/lib/mfa/actor';
import { auditAuth } from '@/lib/mfa/sign-in';
import { currentTrustedDeviceId, forgetThisBrowser } from '@/lib/mfa/trusted-device';

// DELETE /api/auth/mfa/devices/[id] - stop trusting one browser. Revoking only
// ever makes the account safer, so no step-up code is asked for.
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const signed = await signedInUser();
    if ('error' in signed) return NextResponse.json({ error: signed.error }, { status: signed.status });
    const { user } = signed;

    const id = parseInt((await params).id);
    if (isNaN(id)) return NextResponse.json({ error: 'Invalid device' }, { status: 400 });

    const thisDevice = await currentTrustedDeviceId();
    const { count } = await prisma.trustedDevice.deleteMany({ where: { id, userId: user.id } });
    if (count === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (thisDevice === id) await forgetThisBrowser();

    await auditAuth(request, user.accountNumber, 'Revoked a trusted browser', 'success', 'low');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('MFA device revoke error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
