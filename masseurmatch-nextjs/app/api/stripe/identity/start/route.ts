import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createIdentityVerificationSession } from '@/lib/stripe';

interface StartIdentityRequest {
  return_url?: string;
}

/**
 * POST /api/stripe/identity/start
 * Start a Stripe Identity verification session
 */
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
    const body: StartIdentityRequest = await request.json();
    const returnUrl = body.return_url || `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`;

    // Check if user already has verified identity
    const { data: userData } = await supabase
      .from('users')
      .select('identity_status')
      .eq('id', user.id)
      .single();

    if (userData?.identity_status === 'verified') {
      return NextResponse.json(
        {
          success: false,
          error: 'Identity already verified',
          status: 'verified',
        },
        { status: 400 }
      );
    }

    // Create Stripe Identity verification session
    const verificationSession = await createIdentityVerificationSession({
      userId: user.id,
      email: user.email || '',
      returnUrl,
    });

    // Update user's identity verification session ID
    const { error: updateError } = await supabase
      .from('users')
      .update({
        identity_verification_session_id: verificationSession.id,
        identity_status: 'pending',
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Failed to update user with verification session ID:', updateError);
      // Continue anyway - the session was created
    }

    return NextResponse.json({
      success: true,
      session_id: verificationSession.id,
      client_secret: verificationSession.client_secret,
      url: verificationSession.url,
      message: 'Identity verification session created',
    });
  } catch (error) {
    console.error('Identity verification start error:', error);
    return NextResponse.json(
      { error: 'Failed to start identity verification' },
      { status: 500 }
    );
  }
}
