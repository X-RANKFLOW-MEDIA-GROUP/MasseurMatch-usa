import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/server/supabaseAdmin';

// --- Helper: safe error formatter ---
const formatSupabaseError = (err: any) => {
  if (!err) return null;
  const { message, details, hint, code, status } = err;
  return { message, details, hint, code, status };
};

// --- Fetch therapists with retry logic ---
async function fetchTherapistsWithRetry(opts: {
  city?: string | null;
  services?: string | null;
  limit?: number;
  offset?: number;
  retry?: number;
}) {
  const { city, services, limit = 50, offset = 0, retry = 2 } = opts;

  const selectColsArray = [
    'user_id',
    'slug',
    'display_name',
    'latitude',
    'longitude',
    'services',
    'profile_photo',
    'zip_code',
    'phone',
    'city',
    'state',
    'status',
    'created_at',
  ];
  const selectCols = selectColsArray.join(', ');

  console.log('>>> using service role?', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('>>> select columns before query:', selectColsArray);

  let attempt = 0;
  let backoff = 300; // ms

  while (attempt <= retry) {
    try {
      // Build query
      let query = supabaseAdmin
        .from('therapists')
        .select(selectCols, { count: 'exact' })
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

      const { data, error, count, status: statusCode } = await query;

      // temporary debug logs
      console.log('>>> supabase raw response status:', statusCode);
      console.log(
        '>>> supabase raw response error:',
        error ? JSON.stringify(error, Object.getOwnPropertyNames(error)) : null
      );
      console.log('>>> supabase raw response data:', JSON.stringify(data));

      if (error) {
        console.error('Supabase error fetching therapists:', formatSupabaseError(error));

        // Retry on server/network errors (500+, 0, or undefined)
        if (attempt < retry && (statusCode >= 500 || statusCode === 0 || !statusCode)) {
          console.warn(`Retrying fetch (attempt ${attempt + 1}/${retry})...`);
          await new Promise((res) => setTimeout(res, backoff));
          attempt += 1;
          backoff *= 2;
          continue;
        }

        return {
          data: [] as any[],
          error: formatSupabaseError(error),
          count: 0,
          status: statusCode || 500,
        };
      }

      console.log(`✅ Therapists loaded: ${data?.length || 0} (total: ${count})`);
      return {
        data: data ?? [],
        error: null,
        count: count ?? 0,
        status: 200,
      };
    } catch (err) {
      console.error('Unexpected error in fetchTherapistsWithRetry:', err);

      if (attempt < retry) {
        console.warn(`Retrying after unexpected error (attempt ${attempt + 1}/${retry})...`);
        await new Promise((res) => setTimeout(res, backoff));
        attempt += 1;
        backoff *= 2;
        continue;
      }

      return {
        data: [] as any[],
        error: { message: String(err), code: 'UNEXPECTED_ERROR' },
        count: 0,
        status: 500,
      };
    }
  }

  // Fallback if loop exits unexpectedly
  return {
    data: [] as any[],
    error: { message: 'Max retries exceeded', code: 'MAX_RETRIES' },
    count: 0,
    status: 500,
  };
}

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

    const { data, error, count, status } = await fetchTherapistsWithRetry({
      city,
      services,
      limit,
      offset,
      retry: 2,
    });

    const devPayload = {
      ok: !error,
      status,
      data,
      error,
    };

    if (process.env.NODE_ENV !== 'production') {
      return new Response(JSON.stringify(devPayload), {
        status: status ?? 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (error) {
      // DEBUG: Return full error details for debugging
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to fetch therapists',
          details: error.message || 'Unknown error',
          code: error.code,
          rawError: error, // TEMP: Full error object for debugging
          statusCode: status,
          therapists: [],
          total: 0,
        },
        { status: status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      therapists: data,
      total: count,
      limit,
      offset,
    });
  } catch (error) {
    console.error('❌ Unhandled error in GET /api/therapists:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: String(error),
        therapists: [],
        total: 0,
      },
      { status: 500 }
    );
  }
}
