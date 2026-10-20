import { NextRequest, NextResponse } from 'next/server';
import { requireStepUp, signedInUser } from '@/lib/mfa/actor';
import { regenerateBackupCodes } from '@/lib/mfa/backup-codes';
import { auditAuth } from '@/lib/mfa/sign-in';
import { sendMail } from '@/lib/email/mailer';
import { mfaChangedEmail } from '@/lib/email/templates';

// POST /api/auth/mfa/backup-codes - replace the backup-code set (step-up required); returns the new codes once
export async function POST(request: NextRequest) {
  try {
    const signed = await signedInUser();
    if ('error' in signed) return NextResponse.json({ error: signed.error }, { status: signed.status });
    const { user } = signed;
    if (!user.totpEnabledAt) {
      return NextResponse.json({ error: 'Set up two-factor authentication first.' }, { status: 400 });
    }

    const body = await request.json().catch(() => ({}));
    const stepUp = await requireStepUp(user, body);
    if (stepUp) return NextResponse.json({ error: stepUp.error, locked: stepUp.locked }, { status: stepUp.status });

    const backupCodes = await regenerateBackupCodes(user.id);
    await auditAuth(request, user.accountNumber, 'Regenerated two-factor backup codes', 'success', 'medium');
    if (user.email) await sendMail(mfaChangedEmail(user.email, user.fullName, 'backup-codes'));

    return NextResponse.json({ success: true, backupCodes });
  } catch (error) {
    console.error('MFA backup codes error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
