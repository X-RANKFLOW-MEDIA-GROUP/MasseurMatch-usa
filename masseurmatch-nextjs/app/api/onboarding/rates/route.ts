import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validate33PercentRule } from '@/lib/onboarding/validators';

interface CreateRateRequest {
  context: 'incall' | 'outcall' | 'event';
  duration_minutes: number;
  price_cents: number;
  is_base_rate?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreateRateRequest = await request.json();
    const { context, duration_minutes, price_cents, is_base_rate = false } = body;

    // Validate required fields
    if (!context || !duration_minutes || !price_cents) {
      return NextResponse.json(
        { error: 'Missing required fields: context, duration_minutes, price_cents' },
        { status: 400 }
      );
    }

    // Validate context
    if (!['incall', 'outcall', 'event'].includes(context)) {
      return NextResponse.json(
        { error: 'Invalid context. Must be: incall, outcall, or event' },
        { status: 400 }
      );
    }

    // Validate duration
    if (duration_minutes <= 0 || duration_minutes > 480) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 480 minutes (8 hours)' },
        { status: 400 }
      );
    }

    // Validate price
    if (price_cents <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get existing rates for 33% rule validation
    const { data: existingRates, error: ratesError } = await supabase
      .from('profile_rates')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('is_active', true);

    if (ratesError) {
      return NextResponse.json(
        { error: 'Failed to fetch existing rates' },
        { status: 500 }
      );
    }

    // Validate 33% rule (unless this is the first rate for this context)
    const sameContextRates = (existingRates || []).filter(r => r.context === context);

    if (sameContextRates.length > 0 && !is_base_rate) {
      const validation = validate33PercentRule(
        { context, duration_minutes, price_cents },
        existingRates || []
      );

      if (!validation.valid) {
        return NextResponse.json(
          {
            error: '33% rule violation',
            details: validation.errors
          },
          { status: 400 }
        );
      }
    }

    // Create the rate
    const { data: newRate, error: insertError } = await supabase
      .from('profile_rates')
      .insert({
        profile_id: profile.id,
        context,
        duration_minutes,
        price_cents,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create rate', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rate: newRate,
      message: 'Rate created successfully'
    });

  } catch (error) {
    console.error('Rate creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get all active rates
    const { data: rates, error: ratesError } = await supabase
      .from('profile_rates')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('is_active', true)
      .order('context', { ascending: true })
      .order('duration_minutes', { ascending: true });

    if (ratesError) {
      return NextResponse.json(
        { error: 'Failed to fetch rates' },
        { status: 500 }
      );
    }

    // Group by context
    const groupedRates = {
      incall: rates?.filter(r => r.context === 'incall') || [],
      outcall: rates?.filter(r => r.context === 'outcall') || [],
      event: rates?.filter(r => r.context === 'event') || [],
    };

    return NextResponse.json({
      success: true,
      rates: groupedRates,
      total: rates?.length || 0
    });

  } catch (error) {
    console.error('Rates fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get rate_id from query params
    const { searchParams } = new URL(request.url);
    const rateId = searchParams.get('rate_id');

    if (!rateId) {
      return NextResponse.json(
        { error: 'Missing rate_id parameter' },
        { status: 400 }
      );
    }

    // Get profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Soft delete (set is_active = false)
    const { error: deleteError } = await supabase
      .from('profile_rates')
      .update({ is_active: false })
      .eq('id', rateId)
      .eq('profile_id', profile.id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete rate' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rate deleted successfully'
    });

  } catch (error) {
    console.error('Rate deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
