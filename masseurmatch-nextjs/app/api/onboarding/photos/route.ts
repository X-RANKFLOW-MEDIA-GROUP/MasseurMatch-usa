import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { moderatePhoto } from "@/lib/sightengine";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from "@/lib/onboarding/validators";
import type { Database, Json } from "@/types/supabase";

const PHOTO_LIMITS = {
  free: 1,
  standard: 4,
  pro: 8,
  elite: 12,
} as const;

const formSchema = z.object({
  is_cover: z.string().transform((value) => value === "true").optional(),
});

const deleteSchema = z.object({
  photo_id: z.string().uuid(),
});

function normalizePlan(plan: string | null | undefined) {
  if (!plan) return "free";
  if (plan in PHOTO_LIMITS) {
    return plan as keyof typeof PHOTO_LIMITS;
  }
  return "free";
}

type MediaStatus = Database["public"]["Tables"]["media_assets"]["Row"]["status"];

function mapModerationStatus(status: string): MediaStatus {
  if (status === "auto_passed") return "approved";
  if (status === "auto_blocked") return "rejected";
  return "pending";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const parsed = formSchema.safeParse({
      is_cover: formData.get("is_cover")?.toString(),
    });
    const isCover = parsed.success ? parsed.data.is_cover ?? false : false;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_IMAGE_SIZE_BYTES} bytes.` },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .in("status", ["trialing", "active", "past_due"])
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    const planKey = normalizePlan(subscription?.plan);
    const limit = PHOTO_LIMITS[planKey];

    const { count: existingCount, error: countError } = await supabase
      .from("media_assets")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", profile.id)
      .eq("type", "photo")
      .neq("status", "rejected");

    if (countError) {
      return NextResponse.json({ error: "Failed to count existing photos" }, { status: 500 });
    }

    if ((existingCount ?? 0) >= limit) {
      return NextResponse.json(
        {
          error: `Photo limit reached. Your ${planKey} plan allows ${limit} photos.`,
          current: existingCount,
          limit,
        },
        { status: 403 }
      );
    }

    const fileExt = file.name.split(".").pop() ?? "jpg";
    const fileName = `${profile.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-photos")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload photo", details: uploadError.message },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(fileName);

    const publicUrl = urlData.publicUrl;

    const moderationResult = await moderatePhoto(publicUrl);
    const status = mapModerationStatus(moderationResult.status);

    if (status === "rejected") {
      await supabase.storage.from("profile-photos").remove([fileName]);
      return NextResponse.json(
        {
          error: "Photo rejected by moderation",
          reason: moderationResult.reason,
          score: moderationResult.score,
        },
        { status: 400 }
      );
    }

    const shouldBeCover = isCover || (existingCount ?? 0) === 0;

    const sightengineResponse: Json = {
      score: moderationResult.score,
      reason: moderationResult.reason ?? null,
      flags: {
        nudity: moderationResult.flags?.nudity ?? null,
        weapon: moderationResult.flags?.weapon ?? null,
        drug: moderationResult.flags?.drug ?? null,
        gore: moderationResult.flags?.gore ?? null,
        offensive: moderationResult.flags?.offensive ?? null,
      },
    };

    const insertPayload: Database["public"]["Tables"]["media_assets"]["Insert"] = {
      profile_id: profile.id,
      type: "photo",
      status,
      storage_path: fileName,
      public_url: publicUrl,
      thumbnail_url: null,
      position: existingCount ?? 0,
      is_cover: shouldBeCover,
      sightengine_response: sightengineResponse,
      sightengine_score: moderationResult.score,
    };

    const { data: asset, error: insertError } = await supabase
      .from("media_assets")
      .insert(insertPayload)
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      await supabase.storage.from("profile-photos").remove([fileName]);
      return NextResponse.json(
        { error: "Failed to create photo record", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      photo: asset,
      moderation: {
        status: moderationResult.status,
        score: moderationResult.score,
        flags: moderationResult.flags,
        reason: moderationResult.reason,
      },
      message:
        status === "approved"
          ? "Photo uploaded and approved"
          : "Photo uploaded and pending review",
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: photos, error: photosError } = await supabase
      .from("media_assets")
      .select(
        "id, public_url, thumbnail_url, status, type, position, is_cover, sightengine_score, sightengine_response, created_at"
      )
      .eq("profile_id", profile.id)
      .eq("type", "photo")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });

    if (photosError) {
      return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
    }

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .in("status", ["trialing", "active", "past_due"])
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    const planKey = normalizePlan(subscription?.plan);
    const limit = PHOTO_LIMITS[planKey];
    const approvedCount = (photos ?? []).filter((photo) => photo.status === "approved").length;

    return NextResponse.json({
      success: true,
      photos,
      stats: {
        total: photos?.length ?? 0,
        approved: approvedCount,
        pending: (photos ?? []).filter((photo) => photo.status === "pending").length,
        rejected: (photos ?? []).filter((photo) => photo.status === "rejected").length,
        limit,
        remaining: Math.max(0, limit - approvedCount),
      },
    });
  } catch (error) {
    console.error("Photos list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = deleteSchema.safeParse({
      photo_id: _request.nextUrl.searchParams.get("photo_id") ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "photo_id is required" }, { status: 400 });
    }

    const { photo_id } = parsed.data;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: photo, error: photoError } = await supabase
      .from("media_assets")
      .select("storage_path")
      .eq("id", photo_id)
      .eq("profile_id", profile.id)
      .single();

    if (photoError || !photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    if (photo.storage_path) {
      await supabase.storage.from("profile-photos").remove([photo.storage_path]);
    }

    const { error: deleteError } = await supabase
      .from("media_assets")
      .delete()
      .eq("id", photo_id)
      .eq("profile_id", profile.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Photo deleted" });
  } catch (error) {
    console.error("Photo deletion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
