import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CrimeService } from '@/backend/services/crime.service';
import { getSession, canOperateSession } from '@/lib/auth';

const updateCrimeSchema = z.object({
  barangay: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  time: z.string().min(1).optional(),
  crimeType: z.string().min(1).optional(),
  offense: z.string().min(1).optional(),
  stageOfFelony: z.enum(['CONSUMMATED','FRUSTRATED','ATTEMPTED','UNKNOWN']).optional(),
  section: z.string().optional(),
  blotterNo: z.string().optional(),
  stn: z.string().optional(),
}).refine(value => value.crimeType === undefined, {
  message: 'Crime classification is derived from offense and felony stage; update those fields instead.',
  path: ['crimeType'],
});

// GET /api/crimes/[id] - Get a specific offense (Cached)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const crime = await CrimeService.getById(id);

    if (!crime) {
      return NextResponse.json(
        { success: false, error: 'Offense not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: crime,
    });
  } catch (error) {
    console.error('Error fetching crime:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offense' },
      { status: 500 }
    );
  }
}

// PUT /api/crimes/[id] - Update a offense (with cache invalidation)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canOperateSession(session)) {
      return NextResponse.json({ success: false, error: 'Administrative access required' }, { status: 403 });
    }
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateCrimeSchema.parse(body);

    const updateData: any = {};
    if (validatedData.barangay) updateData.barangay = validatedData.barangay;
    if (validatedData.date) updateData.dateCommitted = new Date(validatedData.date);
    if (validatedData.time) updateData.timeCommitted = validatedData.time;
    for (const field of ['offense','stageOfFelony','section','blotterNo','stn'] as const) {
      if (validatedData[field] !== undefined) updateData[field] = validatedData[field];
    }

    const crime = await CrimeService.updateOffense(id, updateData);

    return NextResponse.json({
      success: true,
      data: crime,
      message: 'Offense updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    console.error('Error updating crime:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update offense' },
      { status: 500 }
    );
  }
}

// DELETE /api/crimes/[id] - Delete a offense (with cache invalidation)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canOperateSession(session)) {
      return NextResponse.json({ success: false, error: 'Administrative access required' }, { status: 403 });
    }
    const { id } = await params;
    await CrimeService.deleteOffense(id);

    return NextResponse.json({
      success: true,
      message: 'Offense deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting crime:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete offense' },
      { status: 500 }
    );
  }
}
