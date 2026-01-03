"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Zap, Calendar, MapPin, Loader2, Check, AlertCircle } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { PLANS, SubscriptionPlan, canUseAvailableNow } from "@/src/lib/subscription-limits";
import Link from "next/link";

const timeSlots = [
  "6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM",
  "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM",
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AvailabilityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activatingNow, setActivatingNow] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [availableNowCount, setAvailableNowCount] = useState(0);
  const [isAvailableNow, setIsAvailableNow] = useState(false);
  const [availableNowExpires, setAvailableNowExpires] = useState<Date | null>(null);
  const [schedule, setSchedule] = useState<Record<string, { enabled: boolean; start: string; end: string }>>({
    Monday: { enabled: true, start: "9:00 AM", end: "6:00 PM" },
    Tuesday: { enabled: true, start: "9:00 AM", end: "6:00 PM" },
    Wednesday: { enabled: true, start: "9:00 AM", end: "6:00 PM" },
    Thursday: { enabled: true, start: "9:00 AM", end: "6:00 PM" },
    Friday: { enabled: true, start: "9:00 AM", end: "6:00 PM" },
    Saturday: { enabled: false, start: "10:00 AM", end: "4:00 PM" },
    Sunday: { enabled: false, start: "10:00 AM", end: "4:00 PM" },
  });
  const [incall, setIncall] = useState(true);
  const [outcall, setOutcall] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/availability");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan, schedule, incall_available, outcall_available, available_now_until, available_now_count_today")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      setPlan((profile.subscription_plan as SubscriptionPlan) || "free");
      if (profile.schedule) setSchedule(profile.schedule);
      setIncall(profile.incall_available ?? true);
      setOutcall(profile.outcall_available ?? true);
      setAvailableNowCount(profile.available_now_count_today || 0);

      if (profile.available_now_until) {
        const expires = new Date(profile.available_now_until);
        if (expires > new Date()) {
          setIsAvailableNow(true);
          setAvailableNowExpires(expires);
        }
      }
    }

    setLoading(false);
  };

  const handleSaveSchedule = async () => {
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        schedule,
        incall_available: incall,
        outcall_available: outcall,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      alert("Failed to save schedule");
    } else {
      alert("Schedule saved!");
    }
  };

  const handleAvailableNow = async () => {
    const check = canUseAvailableNow(plan, availableNowCount);

    if (!check.allowed) {
      alert(`You've used all your "Available Now" slots for today (${check.limit}). Upgrade for more.`);
      return;
    }

    setActivatingNow(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 2); // 2 hours from now

    const { error } = await supabase
      .from("profiles")
      .update({
        available_now_until: expiresAt.toISOString(),
        available_now_count_today: availableNowCount + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setActivatingNow(false);

    if (error) {
      alert("Failed to activate");
    } else {
      setIsAvailableNow(true);
      setAvailableNowExpires(expiresAt);
      setAvailableNowCount((prev) => prev + 1);
    }
  };

  const planInfo = PLANS[plan];
  const availableNowLimit = planInfo.available_now_daily;
  const availableNowCheck = canUseAvailableNow(plan, availableNowCount);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Availability</h1>
      <p className="text-slate-400 mb-8">Set your schedule and availability</p>

      {/* Available Now */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 p-6 mb-8"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${isAvailableNow ? "bg-green-500/20" : "bg-white/10"}`}>
              <Zap className={`h-6 w-6 ${isAvailableNow ? "text-green-400" : "text-violet-400"}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Available Now</h2>
              {isAvailableNow ? (
                <div className="flex items-center gap-2 text-green-400">
                  <Check className="h-4 w-4" />
                  <span>Active until {availableNowExpires?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
              ) : (
                <p className="text-slate-400">
                  Show clients you&apos;re available right now
                </p>
              )}
              <p className="text-sm text-slate-500 mt-1">
                {availableNowLimit === -1 ? (
                  "Unlimited uses"
                ) : (
                  `${availableNowCheck.remaining} of ${availableNowLimit} uses remaining today`
                )}
              </p>
            </div>
          </div>
          {!isAvailableNow && (
            <button
              onClick={handleAvailableNow}
              disabled={activatingNow || !availableNowCheck.allowed}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
            >
              {activatingNow ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              Activate
            </button>
          )}
        </div>

        {plan === "elite" && planInfo.auto_available && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-violet-300">
            <Check className="h-4 w-4" />
            Auto-refresh every 2 hours (Elite perk)
          </div>
        )}
      </motion.div>

      {/* Location Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-violet-400" />
          Service Location
        </h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              onClick={() => setIncall(!incall)}
              className={`relative w-12 h-6 rounded-full transition-colors ${incall ? "bg-violet-600" : "bg-white/20"}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${incall ? "translate-x-6" : ""}`} />
            </button>
            <span className="text-white">Incall (At my location)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <button
              type="button"
              onClick={() => setOutcall(!outcall)}
              className={`relative w-12 h-6 rounded-full transition-colors ${outcall ? "bg-violet-600" : "bg-white/20"}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${outcall ? "translate-x-6" : ""}`} />
            </button>
            <span className="text-white">Outcall (Travel to client)</span>
          </label>
        </div>
      </motion.div>

      {/* Weekly Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-violet-400" />
          Weekly Schedule
        </h2>
        <div className="space-y-4">
          {weekDays.map((day) => (
            <div key={day} className="flex items-center gap-4">
              <label className="flex items-center gap-3 w-32 cursor-pointer">
                <button
                  type="button"
                  onClick={() => setSchedule({
                    ...schedule,
                    [day]: { ...schedule[day], enabled: !schedule[day].enabled }
                  })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${schedule[day].enabled ? "bg-violet-600" : "bg-white/20"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${schedule[day].enabled ? "translate-x-5" : ""}`} />
                </button>
                <span className={schedule[day].enabled ? "text-white" : "text-slate-500"}>{day}</span>
              </label>
              {schedule[day].enabled && (
                <div className="flex items-center gap-2">
                  <select
                    value={schedule[day].start}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      [day]: { ...schedule[day], start: e.target.value }
                    })}
                    className="rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-white text-sm focus:border-violet-500 focus:outline-none"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time} className="bg-slate-900">{time}</option>
                    ))}
                  </select>
                  <span className="text-slate-400">to</span>
                  <select
                    value={schedule[day].end}
                    onChange={(e) => setSchedule({
                      ...schedule,
                      [day]: { ...schedule[day], end: e.target.value }
                    })}
                    className="rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-white text-sm focus:border-violet-500 focus:outline-none"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time} className="bg-slate-900">{time}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={handleSaveSchedule}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-500 disabled:opacity-50 transition-colors"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Clock className="h-5 w-5" />
              Save Schedule
            </>
          )}
        </button>
      </motion.div>

      {/* Upgrade Prompt */}
      {plan === "free" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium">Upgrade for more availability features</p>
              <p className="text-sm text-slate-400 mt-1">
                Pro and Elite plans include unlimited &quot;Available Now&quot; activations and auto-refresh.
              </p>
              <Link href="/pricing" className="text-violet-400 hover:text-violet-300 text-sm font-medium mt-2 inline-block">
                View plans →
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
