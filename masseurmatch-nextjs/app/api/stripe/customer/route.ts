import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCustomer } from '@/lib/stripe';

/**
 * POST /api/stripe/customer
 * Create a Stripe customer for the authenticated user
 */
export async function POST() {
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

    // Check if user already has a Stripe customer ID
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    if (profile.stripe_customer_id) {
      return NextResponse.json(
        {
          success: true,
          customer_id: profile.stripe_customer_id,
          message: 'Customer already exists',
        },
        { status: 200 }
      );
    }

    // Create Stripe customer
    const customer = await createCustomer({
      email: user.email || '',
      metadata: {
        user_id: user.id,
      },
    });

    // Update profile with Stripe customer ID
    const { error: updateError } = await supabase
      .from('users')
      .update({ stripe_customer_id: customer.id })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update profile with Stripe customer ID:', updateError);
      return NextResponse.json(
        { error: 'Failed to save customer ID' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      customer_id: customer.id,
      message: 'Stripe customer created successfully',
    });
  } catch (error) {
    console.error('Stripe customer creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe customer' },
      { status: 500 }
    );
  }
}
