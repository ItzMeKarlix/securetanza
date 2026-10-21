import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, invalidateSessionCache } from '@/lib/auth';
import { validateRolePermissions } from '@/lib/auth-routes';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { z } from 'zod';
import { idParam, personNameField } from '@/lib/input-sanitize';
import { emailField, emailTaken } from '@/lib/account-emails';
import { sendMail } from '@/lib/email/mailer';
import { emailChangedEmail } from '@/lib/email/templates';

const updateUserSchema = z.object({
  fullName: personNameField.optional(),
  email: emailField.optional(),
  permissionIds: z.array(z.number().int().positive()).max(20).optional(),
});

// PUT /api/users/[id] - Update user (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = idParam(id);
    if (userId === null) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const emailChanged = validatedData.email !== undefined && validatedData.email !== existingUser.email;
    if (emailChanged && (await emailTaken(validatedData.email!, userId))) {
      return NextResponse.json({ error: 'Another account already uses that email address' }, { status: 409 });
    }

    if (validatedData.permissionIds) {
      const selected = await prisma.permission.findMany({
        where: { id: { in: validatedData.permissionIds } },
      });
      if (selected.length !== new Set(validatedData.permissionIds).size) {
        return NextResponse.json({ error: 'Unknown permission selected' }, { status: 400 });
      }
      const roleError = validateRolePermissions(selected.map(p => p.permissionName));
      if (roleError) {
        return NextResponse.json({ error: roleError }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: { fullName?: string; email?: string; emailVerifiedAt?: null; sessionVersion?: { increment: number } } = {};

    if (validatedData.fullName) {
      updateData.fullName = validatedData.fullName;
    }

    // A new address is unconfirmed until a link sent to it is used, and the
    // person signs in again with it.
    if (emailChanged) {
      updateData.email = validatedData.email;
      updateData.emailVerifiedAt = null;
      updateData.sessionVersion = { increment: 1 };
    }


    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Update permissions if provided
    if (validatedData.permissionIds) {
      // Delete existing permissions
      await prisma.userPermission.deleteMany({
        where: { userId },
      });

      // Assign new permissions via bulk createMany
      await prisma.userPermission.createMany({
        data: validatedData.permissionIds.map(pid => ({
          userId,
          permissionId: pid,
          assignedBy: session.userId,
        })),
      });
    }

    // Invalidate cached session for the updated user
    invalidateSessionCache(userId);

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `User:${existingUser.accountNumber}`,
        details: emailChanged
          ? `Updated account/permissions for user ${existingUser.accountNumber}; sign-in email ${existingUser.email ?? '(none)'} -> ${updatedUser.email}`
          : `Updated account/permissions for user ${existingUser.accountNumber}`,
        outcome: 'success',
      },
    });

    // Tell both addresses, so a change nobody asked for is noticed.
    if (emailChanged && updatedUser.email) {
      const notices = [emailChangedEmail(updatedUser.email, updatedUser.fullName, updatedUser.email)];
      if (existingUser.email) notices.push(emailChangedEmail(existingUser.email, updatedUser.fullName, updatedUser.email));
      await Promise.all(notices.map(sendMail));
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: updatedUser.id,
        accountNumber: updatedUser.accountNumber,
        fullName: updatedUser.fullName,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const userId = idParam(id);
    if (userId === null) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent deleting yourself
    if (userId === session.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user (permissions will be deleted automatically due to CASCADE)
    await prisma.user.delete({
      where: { id: userId },
    });

    invalidateSessionCache(userId);

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `User:${existingUser.accountNumber}`,
        details: `Deleted user account ${existingUser.accountNumber}`,
        severity: 'high',
        outcome: 'success',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
