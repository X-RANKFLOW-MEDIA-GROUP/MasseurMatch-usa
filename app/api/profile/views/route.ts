import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";

// Track a profile view
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  try {
    const { therapist_id } = await request.json();

    if (!therapist_id) {
      return NextResponse.json(
        { error: "therapist_id is required" },
        { status: 400 }
      );
    }

    // Get viewer info (if logged in)
    const { data: { user } } = await supabase.auth.getUser();
    const viewer_id = user?.id || null;

    // Get IP and user agent for analytics (anonymous tracking)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create a hash of IP + user agent for deduplication (don't store raw IP)
    const viewerHash = Buffer.from(`${ip}-${userAgent}`).toString("base64").slice(0, 32);

    // Check if this viewer has viewed this profile recently (within last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: recentView } = await supabase
      .from("profile_views")
      .select("id")
      .eq("therapist_id", therapist_id)
      .eq("viewer_hash", viewerHash)
      .gte("created_at", oneHourAgo)
      .single();

    if (recentView) {
      // Already viewed recently, don't count again
      return NextResponse.json({ success: true, duplicate: true });
    }

    // Record the view
    const { error } = await supabase.from("profile_views").insert({
      therapist_id,
      viewer_id,
      viewer_hash: viewerHash,
      referrer: request.headers.get("referer") || null,
      device_type: getDeviceType(userAgent),
    });

    if (error) {
      console.error("Error recording view:", error);
      // Don't fail the request if view tracking fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// Get view analytics for a therapist
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get time range from query params
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    // Get total views
    const { count: totalViews } = await supabase
      .from("profile_views")
      .select("*", { count: "exact", head: true })
      .eq("therapist_id", user.id)
      .gte("created_at", startDate);

    // Get unique viewers
    const { data: uniqueViewersData } = await supabase
      .from("profile_views")
      .select("viewer_hash")
      .eq("therapist_id", user.id)
      .gte("created_at", startDate);

    const uniqueViewers = new Set(uniqueViewersData?.map((v: { viewer_hash: string }) => v.viewer_hash)).size;

    // Get views by day for chart
    const { data: viewsByDay } = await supabase
      .from("profile_views")
      .select("created_at")
      .eq("therapist_id", user.id)
      .gte("created_at", startDate)
      .order("created_at", { ascending: true });

    // Group by day
    const dailyViews: Record<string, number> = {};
    viewsByDay?.forEach((view: { created_at: string }) => {
      const day = view.created_at.split("T")[0];
      dailyViews[day] = (dailyViews[day] || 0) + 1;
    });

    // Get device breakdown
    const { data: deviceData } = await supabase
      .from("profile_views")
      .select("device_type")
      .eq("therapist_id", user.id)
      .gte("created_at", startDate);

    const deviceBreakdown: Record<string, number> = {
      mobile: 0,
      desktop: 0,
      tablet: 0,
      other: 0,
    };
    deviceData?.forEach((view: { device_type: string | null }) => {
      const device = view.device_type || "other";
      deviceBreakdown[device] = (deviceBreakdown[device] || 0) + 1;
    });

    // Get top referrers
    const { data: referrerData } = await supabase
      .from("profile_views")
      .select("referrer")
      .eq("therapist_id", user.id)
      .gte("created_at", startDate)
      .not("referrer", "is", null);

    const referrerCounts: Record<string, number> = {};
    referrerData?.forEach((view: { referrer: string }) => {
      try {
        const url = new URL(view.referrer);
        const source = url.hostname;
        referrerCounts[source] = (referrerCounts[source] || 0) + 1;
      } catch {
        // Invalid URL, skip
      }
    });

    const topReferrers = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, count]) => ({ source, count }));

    return NextResponse.json({
      totalViews: totalViews || 0,
      uniqueViewers,
      dailyViews,
      deviceBreakdown,
      topReferrers,
      period: days,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return "mobile";
  }
  if (/ipad|tablet|playbook|silk/i.test(ua)) {
    return "tablet";
  }
  return "desktop";
}
