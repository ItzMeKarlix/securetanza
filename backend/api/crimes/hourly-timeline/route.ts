import { NextRequest, NextResponse } from 'next/server';
import { CrimeService } from '@/backend/services/crime.service';

// GET /api/crimes/hourly-timeline - Date x hour offense histogram in one aggregate query
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const result = await CrimeService.getHourlyTimeline({
      year: searchParams.get('year'),
      crimeType: searchParams.get('crimeType'),
      barangay: searchParams.get('barangay'),
      offenseCategory: searchParams.get('offenseCategory'),
      stageOfFelony: searchParams.get('stageOfFelony'),
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching hourly crime timeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hourly crime timeline',
        // Surface the cause while developing; the dev server log has the stack.
        details: process.env.NODE_ENV === 'production' ? undefined : (error as Error)?.message,
      },
      { status: 500 }
    );
  }
}
