import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";

// GET - Fetch reviews for a therapist or by current user
export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  const { searchParams } = new URL(request.url);
  const therapistId = searchParams.get("therapist_id");
  const myReviews = searchParams.get("my_reviews");

  if (myReviews === "true") {
    // Get reviews for the current user (as therapist)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewer:reviewer_id (display_name)
      `)
      .eq("therapist_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate stats
    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalReviews
      : 0;

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach((r: { rating: number }) => {
      ratingCounts[r.rating as keyof typeof ratingCounts]++;
    });

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingCounts,
      },
    });
  }

  if (therapistId) {
    // Get reviews for a specific therapist
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewer:reviewer_id (display_name)
      `)
      .eq("therapist_id", therapistId)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const totalReviews = reviews?.length || 0;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalReviews
      : 0;

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    });
  }

  return NextResponse.json({ error: "therapist_id or my_reviews required" }, { status: 400 });
}

// POST - Create a new review
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { therapist_id, rating, comment } = await request.json();

  if (!therapist_id || !rating) {
    return NextResponse.json({ error: "therapist_id and rating required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  // Check if user already reviewed this therapist
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("reviewer_id", session.user.id)
    .eq("therapist_id", therapist_id)
    .single();

  if (existingReview) {
    return NextResponse.json({ error: "You have already reviewed this therapist" }, { status: 400 });
  }

  // Can't review yourself
  if (session.user.id === therapist_id) {
    return NextResponse.json({ error: "You cannot review yourself" }, { status: 400 });
  }

  // Create the review
  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      reviewer_id: session.user.id,
      therapist_id,
      rating,
      comment: comment || null,
      status: "approved", // Auto-approve for now
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update therapist's average rating
  const { data: allReviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("therapist_id", therapist_id)
    .eq("status", "approved");

  if (allReviews) {
    const avgRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length;

    await supabase
      .from("profiles")
      .update({
        average_rating: Math.round(avgRating * 10) / 10,
        total_reviews: allReviews.length,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", therapist_id);
  }

  return NextResponse.json({ success: true, review });
}

// DELETE - Delete a review (admin only or own review)
export async function DELETE(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reviewId } = await request.json();

  if (!reviewId) {
    return NextResponse.json({ error: "reviewId required" }, { status: 400 });
  }

  // Check if user is admin or review owner
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", session.user.id)
    .single();

  const { data: review } = await supabase
    .from("reviews")
    .select("reviewer_id, therapist_id")
    .eq("id", reviewId)
    .single();

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  const isAdmin = profile?.role === "admin";
  const isOwner = review.reviewer_id === session.user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Not authorized to delete this review" }, { status: 403 });
  }

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update therapist's average rating
  const { data: allReviews } = await supabase
    .from("reviews")
    .select("rating")
    .eq("therapist_id", review.therapist_id)
    .eq("status", "approved");

  const avgRating = allReviews && allReviews.length > 0
    ? allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / allReviews.length
    : 0;

  await supabase
    .from("profiles")
    .update({
      average_rating: Math.round(avgRating * 10) / 10,
      total_reviews: allReviews?.length || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", review.therapist_id);

  return NextResponse.json({ success: true });
}
