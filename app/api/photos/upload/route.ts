import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { moderateImage } from "@/src/lib/sightengine";
import { canUploadPhoto, getUpgradeMessage, SubscriptionPlan } from "@/src/lib/subscription-limits";
import { createClient } from "@supabase/supabase-js";

// Use service role for storage operations
const supabaseAdmin = process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as "profile" | "gallery") || "gallery";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    // Get user's subscription plan
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("user_id", user.id)
      .single();

    const plan: SubscriptionPlan = (profile?.subscription_plan as SubscriptionPlan) || "free";

    // Count existing photos
    const { count } = await supabase
      .from("photos")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("type", type)
      .eq("status", "approved");

    const currentCount = count || 0;

    // Check subscription limits
    const uploadCheck = canUploadPhoto(plan, type, currentCount);

    if (!uploadCheck.allowed) {
      return NextResponse.json({
        error: "Photo limit reached",
        limit: uploadCheck.limit,
        current: currentCount,
        upgrade: getUpgradeMessage(plan, type),
      }, { status: 403 });
    }

    // Generate unique filename
    const ext = file.name.split(".").pop();
    const filename = `${user.id}/${type}/${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const storage = supabaseAdmin?.storage || supabase.storage;
    const { error: uploadError } = await storage
      .from("photos")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = storage
      .from("photos")
      .getPublicUrl(filename);

    // Run moderation with Sightengine
    const moderation = await moderateImage(publicUrl);

    // Save photo record to database
    const photoRecord = {
      user_id: user.id,
      url: publicUrl,
      storage_path: filename,
      type,
      status: moderation.approved ? "approved" : "rejected",
      moderation_result: moderation,
      created_at: new Date().toISOString(),
    };

    const { data: photo, error: dbError } = await supabase
      .from("photos")
      .insert(photoRecord)
      .select()
      .single();

    if (dbError) {
      console.error("DB error:", dbError);
    }

    // If it's a profile photo and approved, update profile
    if (type === "profile" && moderation.approved) {
      await supabase
        .from("profiles")
        .update({ profile_photo: publicUrl })
        .eq("user_id", user.id);
    }

    // If approved and gallery, add to gallery array
    if (type === "gallery" && moderation.approved) {
      const { data: currentProfile } = await supabase
        .from("profiles")
        .select("gallery")
        .eq("user_id", user.id)
        .single();

      const currentGallery = currentProfile?.gallery || [];
      await supabase
        .from("profiles")
        .update({ gallery: [...currentGallery, publicUrl] })
        .eq("user_id", user.id);
    }

    // If rejected, delete from storage
    if (!moderation.approved) {
      await storage.from("photos").remove([filename]);
    }

    return NextResponse.json({
      success: true,
      approved: moderation.approved,
      reasons: moderation.reasons,
      photo: moderation.approved ? {
        id: photo?.id,
        url: publicUrl,
        type,
      } : null,
      limits: {
        plan,
        current: currentCount + (moderation.approved ? 1 : 0),
        limit: uploadCheck.limit,
        remaining: uploadCheck.remaining - (moderation.approved ? 1 : 0),
      },
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
