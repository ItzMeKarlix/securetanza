import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/backend/lib/prisma';
import { getSession } from '@/lib/auth';
import { validateRolePermissions } from '@/lib/auth-routes';
import { getClientIp, getUserAgent } from '@/lib/request-context';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { unusablePasswordHash } from '@/lib/auth-tokens';
import { accountStatus, emailField, emailTaken, sendInvite } from '@/lib/account-emails';

// Validation schema for user creation/update
const userSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: emailField,
  permissionIds: z.array(z.number().int().positive()).min(1, 'At least one permission is required'),
});

// Helper to generate a random unique account number
async function generateNextAccountNumber() {
  let isUnique = false;
  let accountNum = '';
  while (!isUnique) {
    const randomHex = randomBytes(4).toString('hex').toUpperCase().substring(0, 6);
    accountNum = `ACC-${randomHex}`;
    const existing = await prisma.user.findFirst({ where: { accountNumber: accountNum } });
    if (!existing) {
      isUnique = true;
    }
  }
  return accountNum;
}

// GET /api/users - Fetch all users (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      relationLoadStrategy: 'join',
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: { select: { authTokens: { where: { purpose: 'invite' } } } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      accountNumber: user.accountNumber,
      email: user.email,
      status: accountStatus({ ...user, inviteCount: user._count.authTokens }),
      fullName: user.fullName,
      permissions: user.permissions.map(up => ({
        id: up.permission.id,
        name: up.permission.permissionName,
        description: up.permission.description,
      })),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lockedAt: user.lockedAt,
      failedLoginAttempts: user.failedLoginAttempts,
    }));

    return NextResponse.json({
      success: true,
      data: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session || !session.permissions.includes('admin_operational_officer')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validatedData = userSchema.parse(body);

    if (await emailTaken(validatedData.email)) {
      return NextResponse.json({ error: 'Another account already uses that email address' }, { status: 409 });
    }

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

    // Automatically generate next account number
    const accountNumber = await generateNextAccountNumber();

    // No usable password until the person follows their invite link and sets one.
    const user = await prisma.user.create({
      data: {
        accountNumber,
        email: validatedData.email,
        fullName: validatedData.fullName,
        passwordHash: await unusablePasswordHash(),
        mustChangePassword: false,
      },
    });

    // Assign permissions in bulk
    await prisma.userPermission.createMany({
      data: validatedData.permissionIds.map(pid => ({
        userId: user.id,
        permissionId: pid,
        assignedBy: session.userId,
      })),
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        action: 'Settings',
        user: session.accountNumber,
        ip: getClientIp(request) || 'unknown',
        session: session.sessionId,
        userAgent: getUserAgent(request),
        resource: `User:${user.accountNumber}`,
        details: `Created new user account for ${user.fullName} and invited ${user.email}`,
        outcome: 'success',
      },
    });

    const emailSent = await sendInvite(user, session.userId);

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        accountNumber: user.accountNumber,
        email: user.email,
        fullName: user.fullName,
        emailSent,
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
