"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Zap, Clock, TrendingUp, Loader2, AlertCircle, Check, Star } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { PLANS, SubscriptionPlan } from "@/src/lib/subscription-limits";
import Link from "next/link";

type HighlightHistory = {
  id: string;
  used_at: string;
  city: string;
  duration_hours: number;
  views_gained: number;
};

export default function HighlightsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [creditsAvailable, setCreditsAvailable] = useState(0);
  const [creditsUsedThisMonth, setCreditsUsedThisMonth] = useState(0);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [highlightExpires, setHighlightExpires] = useState<Date | null>(null);
  const [history, setHistory] = useState<HighlightHistory[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [userCities, setUserCities] = useState<string[]>([]);

  useEffect(() => {
    fetchHighlights();
  }, []);

  const fetchHighlights = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/highlights");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan, city, state, visitor_cities, highlight_until, highlight_credits_used_this_month")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      const userPlan = (profile.subscription_plan as SubscriptionPlan) || "free";
      setPlan(userPlan);

      const monthlyCredits = PLANS[userPlan].highlight_credits;
      const usedCredits = profile.highlight_credits_used_this_month || 0;
      setCreditsUsedThisMonth(usedCredits);
      setCreditsAvailable(Math.max(0, monthlyCredits - usedCredits));

      // Build user cities list
      const cities: string[] = [];
      if (profile.city && profile.state) {
        cities.push(`${profile.city}, ${profile.state}`);
        setSelectedCity(`${profile.city}, ${profile.state}`);
      }
      if (profile.visitor_cities) {
        profile.visitor_cities.forEach((vc: { city: string; state: string }) => {
          cities.push(`${vc.city}, ${vc.state}`);
        });
      }
      setUserCities(cities);

      // Check if currently highlighted
      if (profile.highlight_until) {
        const expires = new Date(profile.highlight_until);
        if (expires > new Date()) {
          setIsHighlighted(true);
          setHighlightExpires(expires);
        }
      }
    }

    // Mock history
    setHistory([
      {
        id: "1",
        used_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        city: "Los Angeles, CA",
        duration_hours: 24,
        views_gained: 127,
      },
      {
        id: "2",
        used_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        city: "Los Angeles, CA",
        duration_hours: 24,
        views_gained: 98,
      },
    ]);

    setLoading(false);
  };

  const handleActivateHighlight = async () => {
    if (creditsAvailable <= 0) {
      alert("No highlight credits available. Upgrade your plan for more credits.");
      return;
    }

    if (!selectedCity) {
      alert("Please select a city to highlight in.");
      return;
    }

    setActivating(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours

    const { error } = await supabase
      .from("profiles")
      .update({
        highlight_until: expiresAt.toISOString(),
        highlight_city: selectedCity,
        highlight_credits_used_this_month: creditsUsedThisMonth + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setActivating(false);

    if (error) {
      alert("Failed to activate highlight");
    } else {
      setIsHighlighted(true);
      setHighlightExpires(expiresAt);
      setCreditsAvailable((prev) => prev - 1);
      setCreditsUsedThisMonth((prev) => prev + 1);
    }
  };

  const planInfo = PLANS[plan];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-200" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Highlight Credits</h1>
      <p className="text-slate-400 mb-8">Boost your visibility in search results</p>

      {/* Credits Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-600/20 to-orange-600/20 p-6 mb-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Available Credits</h2>
              <p className="text-4xl font-bold text-white mb-1">{creditsAvailable}</p>
              <p className="text-sm text-slate-400">
                {planInfo.highlight_credits} credits/month • Resets on the 1st
              </p>
            </div>
          </div>
          {isHighlighted && (
            <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Active
            </div>
          )}
        </div>
      </motion.div>

      {/* Current Highlight Status */}
      {isHighlighted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Check className="h-6 w-6 text-green-400" />
            <h2 className="text-lg font-semibold text-white">Highlight Active</h2>
          </div>
          <p className="text-slate-300 mb-2">
            Your profile is boosted to the top of search results!
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock className="h-4 w-4" />
            Expires: {highlightExpires?.toLocaleString()}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400" />
            Activate Highlight
          </h2>

          {planInfo.highlight_credits === 0 ? (
            <div className="text-center py-6">
              <AlertCircle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-2">Highlights not available</p>
              <p className="text-slate-400 text-sm mb-4">
                Upgrade to Pro or Elite to get monthly highlight credits.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-white hover:bg-neutral-200 transition-colors"
              >
                Upgrade Plan
              </Link>
            </div>
          ) : creditsAvailable === 0 ? (
            <div className="text-center py-6">
              <AlertCircle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-2">No credits remaining</p>
              <p className="text-slate-400 text-sm">
                Your credits reset on the 1st of each month.
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-400 mb-4">
                Boost your profile to the top of search results for 24 hours.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select City to Highlight In
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-neutral-300 focus:outline-none"
                >
                  {userCities.map((city) => (
                    <option key={city} value={city} className="bg-slate-900">
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleActivateHighlight}
                disabled={activating || creditsAvailable <= 0}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 transition-all"
              >
                {activating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Use 1 Credit to Highlight
                  </>
                )}
              </button>
            </>
          )}
        </motion.div>
      )}

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-white" />
          How Highlights Work
        </h2>
        <div className="space-y-3">
          {[
            { icon: TrendingUp, text: "Your profile appears at the top of search results" },
            { icon: Clock, text: "Highlights last for 24 hours" },
            { icon: Sparkles, text: "Average 40% increase in profile views" },
            { icon: Zap, text: "Stack with Available Now for maximum visibility" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-slate-300">
              <item.icon className="h-4 w-4 text-white" />
              {item.text}
            </div>
          ))}
        </div>
      </motion.div>

      {/* History */}
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Recent Highlights</h2>
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5"
              >
                <div>
                  <p className="font-medium text-white">{item.city}</p>
                  <p className="text-sm text-slate-400">
                    {new Date(item.used_at).toLocaleDateString()} • {item.duration_hours}h
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-400">+{item.views_gained} views</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
