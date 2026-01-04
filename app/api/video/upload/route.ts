import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_DURATION = 60; // 60 seconds
const ALLOWED_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload MP4, WebM, or MOV." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "Video too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "mp4";
    const filename = `${user.id}/intro-${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("videos")
      .upload(filename, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload video" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(filename);

    const videoUrl = urlData.publicUrl;

    // Update profile with video URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        intro_video: videoUrl,
        intro_video_uploaded_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    // Also update therapists table
    await supabase
      .from("therapists")
      .update({ intro_video: videoUrl })
      .eq("user_id", user.id);

    return NextResponse.json({
      success: true,
      video: {
        url: videoUrl,
        filename: filename,
      },
    });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current video URL to delete from storage
    const { data: profile } = await supabase
      .from("profiles")
      .select("intro_video")
      .eq("user_id", user.id)
      .single();

    if (profile?.intro_video) {
      // Extract path from URL
      const url = new URL(profile.intro_video);
      const path = url.pathname.split("/videos/")[1];

      if (path) {
        await supabase.storage.from("videos").remove([path]);
      }
    }

    // Clear video from profile
    await supabase
      .from("profiles")
      .update({
        intro_video: null,
        intro_video_uploaded_at: null,
      })
      .eq("user_id", user.id);

    await supabase
      .from("therapists")
      .update({ intro_video: null })
      .eq("user_id", user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Video delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
