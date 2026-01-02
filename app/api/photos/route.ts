import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";

// GET - List user's photos
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // profile, gallery, or all

    let query = supabase
      .from("photos")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    const { data: photos, error } = await query;

    if (error) {
      console.error("DB error:", error);
      return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
    }

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Photos fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}

// DELETE - Delete a photo
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoId } = await req.json();

    if (!photoId) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
    }

    // Get photo to check ownership and get storage path
    const { data: photo, error: fetchError } = await supabase
      .from("photos")
      .select("*")
      .eq("id", photoId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    // Delete from storage
    if (photo.storage_path) {
      await supabase.storage.from("photos").remove([photo.storage_path]);
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from("photos")
      .delete()
      .eq("id", photoId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
    }

    // If it was the profile photo, clear it from profile
    if (photo.type === "profile") {
      await supabase
        .from("profiles")
        .update({ profile_photo: null })
        .eq("user_id", user.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Photo delete error:", error);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
