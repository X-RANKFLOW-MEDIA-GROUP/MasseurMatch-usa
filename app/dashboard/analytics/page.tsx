"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Eye,
  Users,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Calendar,
  Loader2,
  ArrowUp,
  ArrowDown
} from "lucide-react";

type Analytics = {
  totalViews: number;
  uniqueViewers: number;
  dailyViews: Record<string, number>;
  deviceBreakdown: Record<string, number>;
  topReferrers: { source: string; count: number }[];
  period: number;
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [period, setPeriod] = useState(30);
  const [previousPeriodViews, setPreviousPeriodViews] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch current period
      const res = await fetch(`/api/profile/views?days=${period}`);
      const data = await res.json();
      setAnalytics(data);

      // Fetch previous period for comparison
      const prevRes = await fetch(`/api/profile/views?days=${period * 2}`);
      const prevData = await prevRes.json();

      // Calculate previous period views
      const allDailyViews = Object.entries(prevData.dailyViews || {}) as [string, number][];
      const midpoint = Math.floor(allDailyViews.length / 2);
      const previousViews = allDailyViews.slice(0, midpoint).reduce((acc, [, count]) => acc + count, 0);
      setPreviousPeriodViews(previousViews);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPercentChange = () => {
    if (!analytics || previousPeriodViews === 0) return 0;
    return Math.round(((analytics.totalViews - previousPeriodViews) / previousPeriodViews) * 100);
  };

  const percentChange = getPercentChange();

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />;
      case "tablet":
        return <Tablet className="h-4 w-4" />;
      case "desktop":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  // Generate chart data
  const getChartData = () => {
    if (!analytics?.dailyViews) return [];

    const days = Object.keys(analytics.dailyViews).sort();
    const lastDays = days.slice(-Math.min(period, days.length));

    return lastDays.map((day) => ({
      date: new Date(day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: analytics.dailyViews[day] || 0,
    }));
  };

  const chartData = getChartData();
  const maxViews = Math.max(...chartData.map(d => d.views), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile Analytics</h1>
          <p className="text-slate-400">See who&apos;s viewing your profile</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setPeriod(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === days
                  ? "bg-violet-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {days}d
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Total Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-violet-600/20">
              <Eye className="h-5 w-5 text-violet-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Profile Views</span>
          </div>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-white">
              {analytics?.totalViews.toLocaleString() || 0}
            </span>
            {percentChange !== 0 && (
              <div className={`flex items-center gap-1 text-sm ${
                percentChange > 0 ? "text-emerald-400" : "text-red-400"
              }`}>
                {percentChange > 0 ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{Math.abs(percentChange)}%</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Unique Viewers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-indigo-600/20">
              <Users className="h-5 w-5 text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Unique Viewers</span>
          </div>
          <span className="text-4xl font-bold text-white">
            {analytics?.uniqueViewers.toLocaleString() || 0}
          </span>
        </motion.div>

        {/* Avg Daily Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-emerald-600/20">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-slate-400">Avg. Daily Views</span>
          </div>
          <span className="text-4xl font-bold text-white">
            {analytics?.totalViews
              ? Math.round(analytics.totalViews / period)
              : 0}
          </span>
        </motion.div>
      </div>

      {/* Views Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-5 w-5 text-violet-400" />
          <h2 className="text-lg font-semibold text-white">Views Over Time</h2>
        </div>

        {chartData.length > 0 ? (
          <div className="h-64 flex items-end gap-1">
            {chartData.map((item, index) => (
              <div key={item.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-violet-600 rounded-t-sm transition-all hover:bg-violet-500"
                  style={{
                    height: `${(item.views / maxViews) * 100}%`,
                    minHeight: item.views > 0 ? "4px" : "0",
                  }}
                  title={`${item.date}: ${item.views} views`}
                />
                {(index % Math.ceil(chartData.length / 7) === 0 || index === chartData.length - 1) && (
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {item.date}
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-slate-400">
            No view data available for this period
          </div>
        )}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Device Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Monitor className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Device Breakdown</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(analytics?.deviceBreakdown || {}).map(([device, count]) => {
              const total = Object.values(analytics?.deviceBreakdown || {}).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={device}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      {getDeviceIcon(device)}
                      <span className="capitalize">{device}</span>
                    </div>
                    <span className="text-white font-medium">{percentage}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Top Referrers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="h-5 w-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Top Referrers</h2>
          </div>

          {analytics?.topReferrers && analytics.topReferrers.length > 0 ? (
            <div className="space-y-3">
              {analytics.topReferrers.map((referrer, index) => (
                <div
                  key={referrer.source}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 w-6">{index + 1}.</span>
                    <span className="text-slate-300">{referrer.source}</span>
                  </div>
                  <span className="text-white font-medium">{referrer.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No referrer data available</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 p-4 rounded-xl bg-violet-600/10 border border-violet-500/20"
      >
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-white mb-1">About Analytics</h3>
            <p className="text-sm text-slate-400">
              Views are tracked anonymously. Multiple visits from the same viewer within an hour count as one view.
              Upgrade to a paid plan for more detailed analytics and longer history retention.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
