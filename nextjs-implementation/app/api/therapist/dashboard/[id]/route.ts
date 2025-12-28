import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/therapist/dashboard/[id]
 * Get therapist's own profile for editing (includes private fields)
 * Requires authentication (add auth check in production)
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication middleware
    // Verify user owns this profile
    // const session = await getSession(request);
    // if (!session || session.user.id !== params.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Fetch therapist profile (including non-public fields)
    const { data: therapist, error } = await supabaseAdmin
      .from('therapists')
      .select('*')
      .eq('user_id', params.id)
      .single();

    if (error || !therapist) {
      return NextResponse.json(
        {
          error: 'Profile not found',
          details: error?.message || 'No profile found with this ID',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      therapist,
    });
  } catch (error) {
    console.error('❌ Error fetching dashboard profile:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
