import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { moderateImage } from '@/lib/sightengine';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Photo limits by plan
const PHOTO_LIMITS = {
  free: 1,
  standard: 4,
  pro: 8,
  elite: 12,
};

interface UploadPhotoRequest {
  file: File;
  is_cover?: boolean;
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

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const isCover = formData.get('is_cover') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Get profile and subscription
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get subscription to check photo limit
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const plan = subscription?.plan || 'free';
    const photoLimit = PHOTO_LIMITS[plan as keyof typeof PHOTO_LIMITS];

    // Count existing approved photos
    const { data: existingPhotos, error: countError } = await supabase
      .from('media_assets')
      .select('id')
      .eq('profile_id', profile.id)
      .eq('media_type', 'photo')
      .eq('status', 'approved');

    if (countError) {
      return NextResponse.json(
        { error: 'Failed to count existing photos' },
        { status: 500 }
      );
    }

    if (existingPhotos && existingPhotos.length >= photoLimit) {
      return NextResponse.json(
        {
          error: `Photo limit reached. Your ${plan} plan allows ${photoLimit} photos.`,
          current: existingPhotos.length,
          limit: photoLimit,
        },
        { status: 403 }
      );
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload photo', details: uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    // Moderate the image with Sightengine
    let moderationStatus: 'pending' | 'approved' | 'flagged' | 'rejected' = 'pending';
    let moderationReason: string | undefined;

    try {
      const moderationResult = await moderateImage(publicUrl);

      if (moderationResult.status === 'auto_passed') {
        moderationStatus = 'approved';
      } else if (moderationResult.status === 'auto_flagged') {
        moderationStatus = 'flagged';
        moderationReason = moderationResult.reason;
      } else if (moderationResult.status === 'auto_blocked') {
        moderationStatus = 'rejected';
        moderationReason = moderationResult.reason;

        // Delete the uploaded file
        await supabase.storage
          .from('profile-photos')
          .remove([fileName]);

        return NextResponse.json(
          {
            error: 'Photo rejected by moderation',
            reason: moderationReason,
            scores: {
              nudity: moderationResult.nudity_score,
              weapon: moderationResult.weapon_score,
              drug: moderationResult.drug_score,
              gore: moderationResult.gore_score,
              offensive: moderationResult.offensive_score,
            },
          },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Moderation error:', error);
      // Continue with flagged status if moderation fails
      moderationStatus = 'flagged';
      moderationReason = 'Moderation service error - requires manual review';
    }

    // If this is the first photo or explicitly set as cover, mark it as cover
    const shouldBeCover = isCover || (existingPhotos?.length === 0);

    // Create media asset record
    const { data: mediaAsset, error: insertError } = await supabase
      .from('media_assets')
      .insert({
        profile_id: profile.id,
        media_type: 'photo',
        url: publicUrl,
        storage_path: fileName,
        status: moderationStatus,
        moderation_notes: moderationReason,
        is_cover_photo: shouldBeCover,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      // Cleanup uploaded file
      await supabase.storage
        .from('profile-photos')
        .remove([fileName]);

      return NextResponse.json(
        { error: 'Failed to create photo record', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      photo: mediaAsset,
      moderation: {
        status: moderationStatus,
        reason: moderationReason,
      },
      message:
        moderationStatus === 'approved'
          ? 'Photo uploaded and approved'
          : moderationStatus === 'flagged'
          ? 'Photo uploaded but flagged for review'
          : 'Photo uploaded and pending review',
    });
  } catch (error) {
    console.error('Photo upload error:', error);
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

    // Get all photos
    const { data: photos, error: photosError } = await supabase
      .from('media_assets')
      .select('*')
      .eq('profile_id', profile.id)
      .eq('media_type', 'photo')
      .order('is_cover_photo', { ascending: false })
      .order('created_at', { ascending: false });

    if (photosError) {
      return NextResponse.json(
        { error: 'Failed to fetch photos' },
        { status: 500 }
      );
    }

    // Get subscription to include photo limit info
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    const plan = subscription?.plan || 'free';
    const photoLimit = PHOTO_LIMITS[plan as keyof typeof PHOTO_LIMITS];
    const approvedCount = photos?.filter(p => p.status === 'approved').length || 0;

    return NextResponse.json({
      success: true,
      photos,
      stats: {
        total: photos?.length || 0,
        approved: approvedCount,
        pending: photos?.filter(p => p.status === 'pending').length || 0,
        flagged: photos?.filter(p => p.status === 'flagged').length || 0,
        rejected: photos?.filter(p => p.status === 'rejected').length || 0,
        limit: photoLimit,
        remaining: Math.max(0, photoLimit - approvedCount),
      },
    });
  } catch (error) {
    console.error('Photos fetch error:', error);
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

    // Get photo_id from query params
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('photo_id');

    if (!photoId) {
      return NextResponse.json(
        { error: 'Missing photo_id parameter' },
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

    // Get photo to verify ownership and get storage path
    const { data: photo, error: photoError } = await supabase
      .from('media_assets')
      .select('*')
      .eq('id', photoId)
      .eq('profile_id', profile.id)
      .single();

    if (photoError || !photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Delete from storage
    if (photo.storage_path) {
      const { error: storageError } = await supabase.storage
        .from('profile-photos')
        .remove([photo.storage_path]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
        // Continue anyway to delete the database record
      }
    }

    // Delete database record
    const { error: deleteError } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', photoId)
      .eq('profile_id', profile.id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to delete photo' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully',
    });
  } catch (error) {
    console.error('Photo deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
