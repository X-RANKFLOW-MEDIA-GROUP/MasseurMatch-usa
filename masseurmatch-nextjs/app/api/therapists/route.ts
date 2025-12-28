import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/therapists
 * Get all active therapists with optional filters
 * Query params: city, services, limit, offset
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const services = searchParams.get('services');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabaseAdmin
      .from('therapists')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add city filter if provided
    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    // Add services filter if provided
    if (services) {
      query = query.contains('services', [services]);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        {
          error: 'Failed to fetch therapists',
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      therapists: data || [],
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('❌ Error fetching therapists:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
