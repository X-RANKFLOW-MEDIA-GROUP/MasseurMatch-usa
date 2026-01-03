// Travel Auto-Boost System
// Automatically promotes therapists when they're traveling to a city

export type TravelCity = {
  city: string;
  state: string;
  start_date: string;
  end_date: string;
  is_primary?: boolean;
};

export type BoostType = "travel" | "completion" | "featured" | "promo";

export type ProfileBoost = {
  id: string;
  user_id: string;
  boost_type: BoostType;
  city?: string;
  state?: string;
  start_date: string;
  end_date: string;
  priority: number; // Higher = more visibility
  created_at: string;
};

// Boost priority levels
export const BOOST_PRIORITIES = {
  featured: 100, // Paid featured placement
  travel: 80, // Traveling to city
  completion: 60, // Profile completion reward
  promo: 40, // Promotional boost
};

// Calculate days until travel
export function getDaysUntilTravel(startDate: string): number {
  const now = new Date();
  const start = new Date(startDate);
  const diff = start.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Check if currently visiting
export function isCurrentlyVisiting(city: TravelCity): boolean {
  const now = new Date();
  const start = new Date(city.start_date);
  const end = new Date(city.end_date);
  return now >= start && now <= end;
}

// Check if upcoming visit (within 7 days)
export function isUpcomingVisit(city: TravelCity, daysAhead: number = 7): boolean {
  const daysUntil = getDaysUntilTravel(city.start_date);
  return daysUntil > 0 && daysUntil <= daysAhead;
}

// Get active travel boosts for a therapist
export function getActiveTravelBoosts(travelCities: TravelCity[]): TravelCity[] {
  return travelCities.filter(
    (city) => isCurrentlyVisiting(city) || isUpcomingVisit(city)
  );
}

// SQL schema for boosts table
export const BOOSTS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS profile_boosts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  boost_type TEXT NOT NULL,
  city TEXT,
  state TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  priority INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT, -- 'travel', 'completion', 'purchase', etc.
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_boosts_user ON profile_boosts(user_id);
CREATE INDEX idx_boosts_dates ON profile_boosts(start_date, end_date);
CREATE INDEX idx_boosts_city ON profile_boosts(city, state);
CREATE INDEX idx_boosts_active ON profile_boosts(is_active, end_date);
`;

// Auto-create boost when travel dates are added
export async function createTravelBoost(
  supabase: any,
  userId: string,
  city: TravelCity
): Promise<void> {
  // Check if boost already exists for this trip
  const { data: existing } = await supabase
    .from("profile_boosts")
    .select("id")
    .eq("user_id", userId)
    .eq("boost_type", "travel")
    .eq("city", city.city)
    .eq("start_date", city.start_date)
    .single();

  if (existing) return; // Already exists

  // Create new boost
  await supabase.from("profile_boosts").insert({
    user_id: userId,
    boost_type: "travel",
    city: city.city,
    state: city.state,
    start_date: city.start_date,
    end_date: city.end_date,
    priority: BOOST_PRIORITIES.travel,
    source: "travel",
  });
}

// Create completion reward boost
export async function createCompletionBoost(
  supabase: any,
  userId: string,
  days: number
): Promise<void> {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  await supabase.from("profile_boosts").insert({
    user_id: userId,
    boost_type: "completion",
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    priority: BOOST_PRIORITIES.completion,
    source: "profile_completion",
  });
}

// Get boosted therapists for a city
export async function getBoostedTherapistsForCity(
  supabase: any,
  city: string,
  state: string,
  limit: number = 10
): Promise<string[]> {
  const now = new Date().toISOString();

  const { data } = await supabase
    .from("profile_boosts")
    .select("user_id, priority")
    .eq("is_active", true)
    .eq("city", city)
    .eq("state", state)
    .lte("start_date", now)
    .gte("end_date", now)
    .order("priority", { ascending: false })
    .limit(limit);

  return (data || []).map((b: { user_id: string }) => b.user_id);
}

// Send notification to clients who favorited this therapist
export async function notifyFavoritesOfTravel(
  supabase: any,
  userId: string,
  city: TravelCity
): Promise<number> {
  // Get clients who favorited this therapist
  const { data: favorites } = await supabase
    .from("favorites")
    .select("user_id")
    .eq("therapist_id", userId);

  if (!favorites || favorites.length === 0) return 0;

  // Get therapist name
  const { data: therapist } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", userId)
    .single();

  const therapistName = therapist?.display_name || "A therapist you follow";

  // Create notifications for each favorite
  const notifications = favorites.map((fav: { user_id: string }) => ({
    user_id: fav.user_id,
    type: "therapist_traveling",
    title: "Traveling Soon",
    message: `${therapistName} will be visiting ${city.city}, ${city.state} from ${new Date(
      city.start_date
    ).toLocaleDateString()} to ${new Date(city.end_date).toLocaleDateString()}`,
    data: {
      therapist_id: userId,
      city: city.city,
      state: city.state,
      start_date: city.start_date,
      end_date: city.end_date,
    },
  }));

  const { data: inserted } = await supabase
    .from("notifications")
    .insert(notifications)
    .select("id");

  return inserted?.length || 0;
}
