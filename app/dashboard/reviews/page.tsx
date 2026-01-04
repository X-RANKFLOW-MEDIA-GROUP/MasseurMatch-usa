"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  MessageSquare,
  TrendingUp,
  Clock,
  Loader2,
  User,
  ThumbsUp,
  AlertCircle,
} from "lucide-react";
import { supabase } from "@/src/lib/supabase";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer: {
    display_name: string;
  } | null;
};

type ReviewStats = {
  totalReviews: number;
  averageRating: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};

export default function ReviewsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/reviews");
      return;
    }

    try {
      const res = await fetch("/api/reviews?my_reviews=true");
      const data = await res.json();

      if (data.reviews) {
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }

    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-amber-400 fill-amber-400" : "text-slate-600"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-200" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">Reviews</h1>
      <p className="text-slate-400 mb-8">See what clients are saying about you</p>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-600/20 to-orange-600/20 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
            <span className="text-4xl font-bold text-white">
              {stats.averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-slate-400">Average Rating</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="h-6 w-6 text-white" />
            <span className="text-4xl font-bold text-white">{stats.totalReviews}</span>
          </div>
          <p className="text-slate-400">Total Reviews</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <ThumbsUp className="h-6 w-6 text-green-400" />
            <span className="text-4xl font-bold text-white">
              {stats.totalReviews > 0
                ? Math.round(
                    ((stats.ratingCounts[4] + stats.ratingCounts[5]) / stats.totalReviews) * 100
                  )
                : 0}
              %
            </span>
          </div>
          <p className="text-slate-400">Positive Reviews</p>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-white" />
          Rating Distribution
        </h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingCounts[rating as keyof typeof stats.ratingCounts];
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-white font-medium">{rating}</span>
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                </div>
                <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                  />
                </div>
                <span className="text-slate-400 w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-white mb-4">All Reviews</h2>

        {reviews.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No reviews yet</h3>
            <p className="text-slate-400">
              Reviews from your clients will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-200/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {review.reviewer?.display_name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-slate-500">
                    <Clock className="h-4 w-4" />
                    {formatDate(review.created_at)}
                  </div>
                </div>

                {review.comment ? (
                  <p className="text-slate-300 leading-relaxed">{review.comment}</p>
                ) : (
                  <p className="text-slate-500 italic">No comment provided</p>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-4 rounded-xl bg-neutral-200/10 border border-neutral-300/20"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium">Tips for more reviews</p>
            <ul className="text-sm text-slate-400 mt-2 space-y-1">
              <li>• Send a follow-up message after sessions asking for feedback</li>
              <li>• Provide excellent service to encourage positive reviews</li>
              <li>• Respond professionally to all client inquiries</li>
              <li>• Keep your profile and photos up to date</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
