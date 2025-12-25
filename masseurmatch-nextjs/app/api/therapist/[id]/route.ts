import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/supabaseAdmin';

/**
 * GET /api/therapist/[id]
 * Get single therapist by user_id
 * Public endpoint - returns active therapists only
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: therapist, error } = await supabaseAdmin
      .from('therapists')
      .select('*')
      .eq('user_id', params.id)
      .eq('status', 'active')
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
    console.error('❌ Error fetching therapist profile:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/therapist/[id]
 * Update therapist profile
 * Requires authentication (add auth check in production)
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Add authentication check
    // const session = await getSession(request);
    // if (!session || session.user.id !== params.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const updates = await request.json();

    // Whitelist of allowed fields to update
    const allowedFields = [
      'display_name',
      'full_name',
      'headline',
      'about',
      'philosophy',
      'phone',
      'city',
      'state',
      'country',
      'neighborhood',
      'address',
      'zip_code',
      'nearest_intersection',
      'latitude',
      'longitude',
      'mobile_service_radius',
      'services_headline',
      'specialties_headline',
      'promotions_headline',
      'services',
      'massage_techniques',
      'studio_amenities',
      'mobile_extras',
      'additional_services',
      'products_used',
      'rate_60',
      'rate_90',
      'rate_outcall',
      'payment_methods',
      'regular_discounts',
      'day_of_week_discount',
      'weekly_specials',
      'special_discount_groups',
      'availability',
      'degrees',
      'affiliations',
      'massage_start_date',
      'languages',
      'business_trips',
      'website',
      'instagram',
      'whatsapp',
      'birthdate',
      'years_experience',
      'profile_photo',
      'gallery',
    ];

    // Filter updates to only allowed fields
    const filteredUpdates: Record<string, any> = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Add updated_at timestamp
    filteredUpdates.updated_at = new Date().toISOString();

    // Update the profile
    const { data, error } = await supabaseAdmin
      .from('therapists')
      .update(filteredUpdates)
      .eq('user_id', params.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating therapist profile:', error);
      return NextResponse.json(
        {
          error: 'Failed to update profile',
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      therapist: data,
    });
  } catch (error) {
    console.error('❌ Error in profile update:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
