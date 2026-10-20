import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession, invalidateSessionCache } from '@/lib/auth';
import { validateRolePermissions } from '@/lib/auth-routes';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { z } from 'zod';

const updateUserSchema = z.object({
  fullName: z.string().min(1).optional(),
  permissionIds: z.array(z.number().int().positive()).optional(),
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
    const userId = parseInt(id);
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
    const updateData: any = {};

    if (validatedData.fullName) {
      updateData.fullName = validatedData.fullName;
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
        details: `Updated account/permissions for user ${existingUser.accountNumber}`,
        outcome: 'success',
      },
    });

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
        { error: 'Validation failed', details: error.issues },
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
    const userId = parseInt(id);

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
