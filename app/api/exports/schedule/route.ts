import { NextRequest, NextResponse } from 'next/server';
import { ConfigService } from '@/backend/services/config.service';
import { getSession, canOperateSession } from '@/lib/auth';
import { z } from 'zod';

const scheduleSchema = z.object({
  enabled: z.boolean(),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).nullish(),
  dayOfMonth: z.string().regex(/^([1-9]|1\d|2[0-8])$/, 'Choose a day from 1 to 28').nullish(),
  monthlyOn: z.string().regex(/^[1-9]\d{0,2}$/, 'Invalid day').nullish(),
  timeOfDay: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a 24-hour time such as 14:30'),
}).strict();

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!canOperateSession(session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const schedule = await ConfigService.getExportSchedule(session.userId);

    return NextResponse.json({ schedule });
  } catch (error) {
    console.error('Error fetching export schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!canOperateSession(session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Only the fields the schedule has, each in the exact form the cron worker compares against.
    const parsed = scheduleSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid schedule' }, { status: 400 });
    }

    const updatedSchedule = await ConfigService.saveExportSchedule(session.userId, parsed.data);

    return NextResponse.json({ success: true, schedule: updatedSchedule });
  } catch (error) {
    console.error('Error saving export schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
