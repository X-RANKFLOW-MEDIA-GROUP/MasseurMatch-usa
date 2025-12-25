"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, Heart, Phone, TrendingUp, Users, MapPin, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AnalyticsData {
  views: number;
  viewsChange: number;
  likes: number;
  likesChange: number;
  calls: number;
  callsChange: number;
  messages: number;
  messagesChange: number;
  topCities?: Array<{ city: string; count: number }>;
  weeklyViews?: Array<{ day: string; count: number }>;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  period?: "week" | "month" | "year";
}

export function AnalyticsDashboard({ data, period = "week" }: AnalyticsDashboardProps) {
  const stats = [
    {
      label: "Profile Views",
      value: data.views,
      change: data.viewsChange,
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Favorites",
      value: data.likes,
      change: data.likesChange,
      icon: Heart,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
    },
    {
      label: "Calls",
      value: data.calls,
      change: data.callsChange,
      icon: Phone,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Messages",
      value: data.messages,
      change: data.messagesChange,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  const maxViews = data.weeklyViews ? Math.max(...data.weeklyViews.map((d) => d.count)) : 100;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change >= 0;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass-effect border-slate-800 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <TrendingUp className={`w-4 h-4 ${!isPositive ? "rotate-180" : ""}`} />
                      <span>
                        {isPositive ? "+" : ""}
                        {stat.change}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        {data.weeklyViews && (
          <Card className="glass-effect border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Weekly Activity
              </CardTitle>
              <CardDescription className="text-slate-400">
                Profile views over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.weeklyViews.map((day, index) => {
                  const percentage = (day.count / maxViews) * 100;

                  return (
                    <div key={day.day} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 capitalize">{day.day}</span>
                        <span className="text-white font-medium">{day.count} views</span>
                      </div>
                      <div className="relative">
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Top Cities */}
        {data.topCities && (
          <Card className="glass-effect border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-400" />
                Top Locations
              </CardTitle>
              <CardDescription className="text-slate-400">
                Where your viewers are from
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topCities.map((city, index) => {
                  const totalViews = data.topCities!.reduce((sum, c) => sum + c.count, 0);
                  const percentage = (city.count / totalViews) * 100;

                  return (
                    <div key={city.city} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0
                                ? "bg-yellow-500 text-yellow-950"
                                : index === 1
                                ? "bg-slate-400 text-slate-950"
                                : index === 2
                                ? "bg-amber-600 text-amber-950"
                                : "bg-slate-700 text-slate-300"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="text-slate-300">{city.city}</span>
                        </div>
                        <span className="text-white font-medium">{city.count}</span>
                      </div>
                      <Progress value={percentage} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Insights */}
      <Card className="glass-effect border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Insights & Tips</CardTitle>
          <CardDescription className="text-slate-400">
            Based on your analytics this {period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.viewsChange > 10 && (
              <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-green-400 font-medium">Great momentum!</p>
                  <p className="text-sm text-slate-300">
                    Your profile views are up {data.viewsChange}% this {period}. Keep your profile updated to maintain this growth.
                  </p>
                </div>
              </div>
            )}
            {data.calls > 0 && (
              <div className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <Phone className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-purple-400 font-medium">High engagement</p>
                  <p className="text-sm text-slate-300">
                    You received {data.calls} calls this {period}. Consider adding more photos to boost this number even higher.
                  </p>
                </div>
              </div>
            )}
            {data.viewsChange < 0 && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <Eye className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-yellow-400 font-medium">Tip: Boost your visibility</p>
                  <p className="text-sm text-slate-300">
                    Profile views are down this {period}. Try updating your photos or bio to attract more attention.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
