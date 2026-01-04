// Profile completeness calculation
// Each field has a weight based on importance

const CATEGORIES = ["basic", "media", "services", "contact", "details"] as const;
type Category = (typeof CATEGORIES)[number];

export type ProfileField = {
  key: string;
  label: string;
  weight: number;
  category: Category;
};

export const PROFILE_FIELDS: ProfileField[] = [
  // Basic Info (25%)
  { key: "display_name", label: "Display Name", weight: 8, category: "basic" },
  { key: "headline", label: "Headline", weight: 7, category: "basic" },
  { key: "about", label: "About / Bio", weight: 10, category: "basic" },

  // Media (25%)
  { key: "profile_photo", label: "Profile Photo", weight: 12, category: "media" },
  { key: "intro_video", label: "Intro Video", weight: 8, category: "media" },
  { key: "gallery", label: "Gallery Photos (3+)", weight: 5, category: "media" },

  // Services (25%)
  { key: "services", label: "Services Offered", weight: 10, category: "services" },
  { key: "rate_60", label: "60-min Rate", weight: 8, category: "services" },
  { key: "incall_available", label: "Incall/Outcall Set", weight: 7, category: "services" },

  // Contact (15%)
  { key: "city", label: "City", weight: 5, category: "contact" },
  { key: "state", label: "State", weight: 3, category: "contact" },
  { key: "phone", label: "Phone Number", weight: 7, category: "contact" },

  // Details (10%)
  { key: "years_experience", label: "Years Experience", weight: 4, category: "details" },
  { key: "languages", label: "Languages", weight: 3, category: "details" },
  { key: "philosophy", label: "Massage Philosophy", weight: 3, category: "details" },
];

export const TOTAL_WEIGHT = PROFILE_FIELDS.reduce((sum, f) => sum + f.weight, 0);

export type ProfileData = {
  display_name?: string;
  headline?: string;
  about?: string;
  profile_photo?: string;
  intro_video?: string;
  gallery?: string[];
  services?: string[];
  rate_60?: string;
  incall_available?: boolean;
  outcall_available?: boolean;
  city?: string;
  state?: string;
  phone?: string;
  years_experience?: number;
  languages?: string[];
  philosophy?: string;
};

export type CompletenessResult = {
  percentage: number;
  completedFields: string[];
  missingFields: ProfileField[];
  byCategory: Record<Category, { completed: number; total: number; percentage: number }>;
  isComplete: boolean;
  eligibleForBoost: boolean;
};

export function calculateProfileCompleteness(profile: ProfileData): CompletenessResult {
  let completedWeight = 0;
  const completedFields: string[] = [];
  const missingFields: ProfileField[] = [];
  const byCategory: Record<Category, { completed: number; total: number; percentage: number }> =
    CATEGORIES.reduce((acc, category) => {
      acc[category] = { completed: 0, total: 0, percentage: 0 };
      return acc;
    }, {} as Record<Category, { completed: number; total: number; percentage: number }>);

  for (const field of PROFILE_FIELDS) {
    const categoryKey = field.category;
    // Field categories are predefined in CATEGORIES
    // eslint-disable-next-line security/detect-object-injection
    byCategory[categoryKey].total += field.weight;

    const isComplete = isFieldComplete(profile, field.key);

    if (isComplete) {
      completedWeight += field.weight;
      completedFields.push(field.key);
      // eslint-disable-next-line security/detect-object-injection
      byCategory[categoryKey].completed += field.weight;
    } else {
      missingFields.push(field);
    }
  }

  // Calculate category percentages
  for (const category of CATEGORIES) {
    // eslint-disable-next-line security/detect-object-injection
    const categoryProgress = byCategory[category];
    const { completed, total } = categoryProgress;
    categoryProgress.percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  const percentage = Math.round((completedWeight / TOTAL_WEIGHT) * 100);

  return {
    percentage,
    completedFields,
    missingFields: missingFields.sort((a, b) => b.weight - a.weight), // Highest impact first
    byCategory,
    isComplete: percentage === 100,
    eligibleForBoost: percentage >= 100,
  };
}

function isFieldComplete(profile: ProfileData, key: string): boolean {
  switch (key) {
    case "display_name":
      return !!profile.display_name && profile.display_name.length >= 2;
    case "headline":
      return !!profile.headline && profile.headline.length >= 10;
    case "about":
      return !!profile.about && profile.about.length >= 50;
    case "profile_photo":
      return !!profile.profile_photo;
    case "intro_video":
      return !!profile.intro_video;
    case "gallery":
      return Array.isArray(profile.gallery) && profile.gallery.length >= 3;
    case "services":
      return Array.isArray(profile.services) && profile.services.length >= 1;
    case "rate_60":
      return !!profile.rate_60;
    case "incall_available":
      // Check if either incall or outcall is explicitly set
      return profile.incall_available === true || profile.outcall_available === true;
    case "city":
      return !!profile.city;
    case "state":
      return !!profile.state;
    case "phone":
      return !!profile.phone && profile.phone.length >= 10;
    case "years_experience":
      return typeof profile.years_experience === "number" && profile.years_experience >= 0;
    case "languages":
      return Array.isArray(profile.languages) && profile.languages.length >= 1;
    case "philosophy":
      return !!profile.philosophy && profile.philosophy.length >= 20;
    default:
      return false;
  }
}

// Boost rewards for profile completion
export const COMPLETION_REWARDS = {
  50: { type: "badge", label: "Profile Started", icon: "🌱" },
  75: { type: "boost", label: "3-Day Boost", days: 3, icon: "⚡" },
  100: { type: "boost", label: "7-Day Featured Boost", days: 7, icon: "🚀" },
};

export function getRewardForPercentage(percentage: number) {
  if (percentage >= 100) return COMPLETION_REWARDS[100];
  if (percentage >= 75) return COMPLETION_REWARDS[75];
  if (percentage >= 50) return COMPLETION_REWARDS[50];
  return null;
}
