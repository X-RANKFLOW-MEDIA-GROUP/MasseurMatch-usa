"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Plus, X, Search, Loader2, AlertCircle, Check, Home, Plane, Calendar, Edit2 } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { PLANS, SubscriptionPlan, getVisitorCitiesLimit } from "@/src/lib/subscription-limits";
import Link from "next/link";

const allCities = [
  { city: "Los Angeles", state: "CA" },
  { city: "New York", state: "NY" },
  { city: "San Francisco", state: "CA" },
  { city: "Chicago", state: "IL" },
  { city: "Miami", state: "FL" },
  { city: "Houston", state: "TX" },
  { city: "Seattle", state: "WA" },
  { city: "Denver", state: "CO" },
  { city: "Atlanta", state: "GA" },
  { city: "Boston", state: "MA" },
  { city: "Phoenix", state: "AZ" },
  { city: "San Diego", state: "CA" },
  { city: "Dallas", state: "TX" },
  { city: "Austin", state: "TX" },
  { city: "Portland", state: "OR" },
  { city: "Las Vegas", state: "NV" },
  { city: "Nashville", state: "TN" },
  { city: "New Orleans", state: "LA" },
  { city: "Philadelphia", state: "PA" },
  { city: "Washington", state: "DC" },
  { city: "Palm Springs", state: "CA" },
  { city: "Fort Lauderdale", state: "FL" },
  { city: "San Juan", state: "PR" },
  { city: "Honolulu", state: "HI" },
];

type CityEntry = {
  city: string;
  state: string;
  is_primary: boolean;
  added_at?: string;
  start_date?: string;
  end_date?: string;
};

export default function CitiesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<SubscriptionPlan>("free");
  const [primaryCity, setPrimaryCity] = useState<CityEntry | null>(null);
  const [visitorCities, setVisitorCities] = useState<CityEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddCity, setShowAddCity] = useState(false);
  const [editingCity, setEditingCity] = useState<CityEntry | null>(null);
  const [travelDates, setTravelDates] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/dashboard/cities");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_plan, city, state, visitor_cities")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      setPlan((profile.subscription_plan as SubscriptionPlan) || "free");

      if (profile.city && profile.state) {
        setPrimaryCity({
          city: profile.city,
          state: profile.state,
          is_primary: true,
        });
      }

      if (profile.visitor_cities) {
        setVisitorCities(profile.visitor_cities);
      }
    }

    setLoading(false);
  };

  const visitorCitiesLimit = getVisitorCitiesLimit(plan);
  const canAddMore = visitorCitiesLimit === -1 || visitorCities.length < visitorCitiesLimit;

  const handleAddVisitorCity = async (city: string, state: string) => {
    if (!canAddMore) {
      alert("You've reached your visitor cities limit. Upgrade for more.");
      return;
    }

    // Check if already added
    if (visitorCities.some((c) => c.city === city && c.state === state)) {
      alert("This city is already in your list.");
      return;
    }

    // Check if it's the primary city
    if (primaryCity?.city === city && primaryCity?.state === state) {
      alert("This is already your primary city.");
      return;
    }

    const newCity: CityEntry = {
      city,
      state,
      is_primary: false,
      added_at: new Date().toISOString(),
      start_date: travelDates.start || undefined,
      end_date: travelDates.end || undefined,
    };

    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatedCities = [...visitorCities, newCity];

    const { error } = await supabase
      .from("profiles")
      .update({
        visitor_cities: updatedCities,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      alert("Failed to add city");
    } else {
      setVisitorCities(updatedCities);
      setShowAddCity(false);
      setSearchQuery("");
      setTravelDates({ start: "", end: "" });
    }
  };

  const handleUpdateTravelDates = async () => {
    if (!editingCity) return;

    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatedCities = visitorCities.map((c) =>
      c.city === editingCity.city && c.state === editingCity.state
        ? { ...c, start_date: travelDates.start || undefined, end_date: travelDates.end || undefined }
        : c
    );

    const { error } = await supabase
      .from("profiles")
      .update({
        visitor_cities: updatedCities,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      alert("Failed to update dates");
    } else {
      setVisitorCities(updatedCities);
      setEditingCity(null);
      setTravelDates({ start: "", end: "" });
    }
  };

  const handleRemoveVisitorCity = async (city: string, state: string) => {
    if (!confirm(`Remove ${city}, ${state} from your visitor cities?`)) return;

    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updatedCities = visitorCities.filter((c) => !(c.city === city && c.state === state));

    const { error } = await supabase
      .from("profiles")
      .update({
        visitor_cities: updatedCities,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    setSaving(false);

    if (error) {
      alert("Failed to remove city");
    } else {
      setVisitorCities(updatedCities);
    }
  };

  const getTravelStatus = (city: CityEntry) => {
    if (!city.start_date && !city.end_date) return null;

    const now = new Date();
    const start = city.start_date ? new Date(city.start_date) : null;
    const end = city.end_date ? new Date(city.end_date) : null;

    if (start && end) {
      if (now >= start && now <= end) {
        return { status: "visiting", label: "Currently Visiting", color: "text-green-400 bg-green-500/20" };
      } else if (now < start) {
        const days = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { status: "upcoming", label: `Visiting in ${days} days`, color: "text-blue-400 bg-blue-500/20" };
      } else {
        return { status: "past", label: "Visit ended", color: "text-slate-400 bg-slate-500/20" };
      }
    } else if (start && now >= start) {
      return { status: "visiting", label: "Currently Visiting", color: "text-green-400 bg-green-500/20" };
    } else if (start) {
      const days = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { status: "upcoming", label: `Visiting in ${days} days`, color: "text-blue-400 bg-blue-500/20" };
    }

    return null;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const filteredCities = allCities.filter(
    (c) =>
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold text-white mb-2">Cities & Travel</h1>
      <p className="text-slate-400 mb-8">Manage where you appear in search results and announce your travels</p>

      {/* Primary City */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
      >
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Home className="h-5 w-5 text-violet-400" />
          Primary City
        </h2>
        {primaryCity ? (
          <div className="flex items-center justify-between p-4 rounded-xl bg-violet-600/20 border border-violet-500/30">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-violet-400" />
              <div>
                <p className="font-medium text-white">{primaryCity.city}, {primaryCity.state}</p>
                <p className="text-sm text-slate-400">Your main location</p>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs">
              <Check className="h-3 w-3" />
              Primary
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <MapPin className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400 mb-3">No primary city set</p>
            <Link
              href="/dashboard/profile"
              className="text-violet-400 hover:text-violet-300 text-sm font-medium"
            >
              Set your primary city in Profile →
            </Link>
          </div>
        )}
      </motion.div>

      {/* Visitor Cities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plane className="h-5 w-5 text-violet-400" />
            Travel Schedule
          </h2>
          <div className="text-sm text-slate-400">
            {visitorCitiesLimit === -1 ? (
              "Unlimited cities"
            ) : (
              `${visitorCities.length} / ${visitorCitiesLimit} cities`
            )}
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-4">
          Add cities you're visiting and your travel dates. Clients in those cities will see you're coming!
        </p>

        {visitorCitiesLimit === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
            <p className="text-white font-medium mb-2">Travel schedule not available</p>
            <p className="text-slate-400 text-sm mb-4">
              Upgrade to Standard or higher to appear in other cities when traveling.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Upgrade Plan
            </Link>
          </div>
        ) : (
          <>
            {visitorCities.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-xl mb-4">
                <Plane className="h-8 w-8 text-slate-500 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No travel schedule set</p>
                <p className="text-slate-500 text-xs mt-1">Add cities you plan to visit</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {visitorCities.map((city) => {
                  const travelStatus = getTravelStatus(city);

                  return (
                    <div
                      key={`${city.city}-${city.state}`}
                      className="p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-white">{city.city}, {city.state}</p>
                              {travelStatus && (
                                <span className={`px-2 py-0.5 rounded-full text-xs ${travelStatus.color}`}>
                                  {travelStatus.label}
                                </span>
                              )}
                            </div>
                            {(city.start_date || city.end_date) ? (
                              <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                                <Calendar className="h-3.5 w-3.5" />
                                {city.start_date && city.end_date ? (
                                  <span>{formatDate(city.start_date)} - {formatDate(city.end_date)}</span>
                                ) : city.start_date ? (
                                  <span>Starting {formatDate(city.start_date)}</span>
                                ) : (
                                  <span>Until {formatDate(city.end_date!)}</span>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-slate-500 mt-1">No travel dates set</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingCity(city);
                              setTravelDates({
                                start: city.start_date || "",
                                end: city.end_date || "",
                              });
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveVisitorCity(city.city, city.state)}
                            disabled={saving}
                            className="p-2 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {canAddMore && (
              <button
                onClick={() => setShowAddCity(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-white/10 text-slate-400 hover:border-violet-500/50 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Travel Destination
              </button>
            )}
          </>
        )}
      </motion.div>

      {/* Add City Modal */}
      {showAddCity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0f] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Travel Destination</h3>
              <button
                onClick={() => {
                  setShowAddCity(false);
                  setSearchQuery("");
                  setTravelDates({ start: "", end: "" });
                }}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
                autoFocus
              />
            </div>

            {/* Travel Dates */}
            <div className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-slate-400 mb-3">Travel Dates (optional)</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={travelDates.start}
                    onChange={(e) => setTravelDates({ ...travelDates, start: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-white text-sm focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">End Date</label>
                  <input
                    type="date"
                    value={travelDates.end}
                    onChange={(e) => setTravelDates({ ...travelDates, end: e.target.value })}
                    min={travelDates.start}
                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2 px-3 text-white text-sm focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredCities.map((city) => {
                const isAdded = visitorCities.some((c) => c.city === city.city && c.state === city.state);
                const isPrimary = primaryCity?.city === city.city && primaryCity?.state === city.state;

                return (
                  <button
                    key={`${city.city}-${city.state}`}
                    onClick={() => handleAddVisitorCity(city.city, city.state)}
                    disabled={isAdded || isPrimary || saving}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      isAdded || isPrimary
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="text-white">{city.city}, {city.state}</span>
                    </div>
                    {isPrimary && (
                      <span className="text-xs text-violet-400">Primary</span>
                    )}
                    {isAdded && (
                      <Check className="h-4 w-4 text-green-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Dates Modal */}
      {editingCity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a0f] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Edit Travel Dates</h3>
              <button
                onClick={() => {
                  setEditingCity(null);
                  setTravelDates({ start: "", end: "" });
                }}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 mb-4">
              <MapPin className="h-5 w-5 text-violet-400" />
              <span className="text-white font-medium">{editingCity.city}, {editingCity.state}</span>
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="text-sm text-slate-400 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={travelDates.start}
                  onChange={(e) => setTravelDates({ ...travelDates, start: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1">End Date</label>
                <input
                  type="date"
                  value={travelDates.end}
                  onChange={(e) => setTravelDates({ ...travelDates, end: e.target.value })}
                  min={travelDates.start}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setTravelDates({ start: "", end: "" });
                }}
                className="flex-1 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition-colors"
              >
                Clear Dates
              </button>
              <button
                onClick={handleUpdateTravelDates}
                disabled={saving}
                className="flex-1 py-3 rounded-xl bg-violet-600 text-white hover:bg-violet-500 transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Save"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Plan Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl bg-white/5 border border-white/10"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Current Plan</p>
            <p className="text-white font-medium capitalize">{plan}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Visitor Cities Limit</p>
            <p className="text-white font-medium">
              {visitorCitiesLimit === -1 ? "Unlimited" : visitorCitiesLimit === 0 ? "Not available" : visitorCitiesLimit}
            </p>
          </div>
          {plan !== "elite" && (
            <Link
              href="/pricing"
              className="text-sm text-violet-400 hover:text-violet-300"
            >
              Upgrade →
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
