"use client";

import { useState } from "react";
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { DashboardStatsSkeleton } from "@/components/ui/loading-skeleton";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const { data, isLoading, error, refetch } = useAnalytics(period);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gradient mb-2">Analytics</h1>
              <p className="text-slate-400">Track your profile performance and insights</p>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg">
              {["week", "month", "year"].map((p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={period === p ? "default" : "ghost"}
                  onClick={() => setPeriod(p as typeof period)}
                  className={
                    period === p
                      ? "bg-gradient-to-r from-purple-500 to-pink-500"
                      : ""
                  }
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : error ? (
          <ErrorState
            title="Failed to Load Analytics"
            description="We couldn't load your analytics data. Please try again."
            onRetry={refetch}
          />
        ) : data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnalyticsDashboard data={data} period={period} />
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Data Yet
            </h3>
            <p className="text-slate-400">
              Analytics will appear once your profile is live and receiving views
            </p>
          </div>
        )}

        {/* Quick Tips */}
        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid md:grid-cols-2 gap-4"
          >
            <div className="glass-effect border-slate-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Boost Your Visibility
                  </h4>
                  <p className="text-sm text-slate-400">
                    Update your photos regularly and keep your availability current to
                    increase profile views and bookings.
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-effect border-slate-800 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-pink-500/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">
                    Peak Times
                  </h4>
                  <p className="text-sm text-slate-400">
                    Most views happen during weekday evenings. Make sure your
                    profile is up-to-date during these times.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
