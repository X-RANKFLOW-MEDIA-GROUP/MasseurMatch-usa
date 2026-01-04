// AI-powered profile optimization tips
// Analyzes profile data and provides actionable suggestions

export type OptimizationTip = {
  id: string;
  category: "headline" | "about" | "photo" | "pricing" | "services" | "availability";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action: string;
  impact: string;
};

export type ProfileData = {
  display_name?: string;
  headline?: string;
  about?: string;
  profile_photo?: string;
  intro_video?: string;
  gallery?: string[];
  services?: string[];
  rate_60?: string;
  rate_90?: string;
  rate_outcall?: string;
  city?: string;
  state?: string;
  years_experience?: number;
  available_now?: boolean;
  incall_available?: boolean;
  outcall_available?: boolean;
};

// City-based pricing benchmarks (example data)
const CITY_PRICING: Record<string, { low: number; mid: number; high: number }> = {
  "New York": { low: 120, mid: 180, high: 250 },
  "Los Angeles": { low: 100, mid: 150, high: 220 },
  "San Francisco": { low: 120, mid: 170, high: 240 },
  "Miami": { low: 90, mid: 140, high: 200 },
  "Chicago": { low: 80, mid: 130, high: 180 },
  default: { low: 70, mid: 120, high: 170 },
};

const priorityOrder = { high: 0, medium: 1, low: 2 };

function evaluateHeadline(profile: ProfileData): OptimizationTip[] {
  if (!profile.headline) {
    return [{
      id: "headline-missing",
      category: "headline",
      priority: "high",
      title: "Add a headline",
      description: "Profiles with headlines get 3x more views",
      action: "Write a compelling 5-10 word headline",
      impact: "+200% visibility",
    }];
  }

  if (profile.headline.length < 20) {
    return [{
      id: "headline-short",
      category: "headline",
      priority: "medium",
      title: "Expand your headline",
      description: "Your headline is too brief. Add more detail about your specialty.",
      action: "Mention your specialty, experience, or unique approach",
      impact: "+50% click rate",
    }];
  }

  if (!profile.headline.match(/\d+|years?|certified|licensed|specialist/i)) {
    return [{
      id: "headline-credentials",
      category: "headline",
      priority: "low",
      title: "Add credentials to headline",
      description: "Including experience or certifications builds trust",
      action: 'Try: "Certified Deep Tissue Specialist - 10 Years Experience"',
      impact: "+30% inquiries",
    }];
  }

  return [];
}

function evaluateAbout(profile: ProfileData): OptimizationTip[] {
  if (!profile.about) {
    return [{
      id: "about-missing",
      category: "about",
      priority: "high",
      title: "Write your bio",
      description: "Clients want to know about you before booking",
      action: "Write 100-200 words about your background and approach",
      impact: "+150% booking rate",
    }];
  }

  if (profile.about.length < 100) {
    return [{
      id: "about-short",
      category: "about",
      priority: "medium",
      title: "Expand your bio",
      description: "Longer, detailed bios build more trust",
      action: "Add information about your training, philosophy, and what clients can expect",
      impact: "+40% trust score",
    }];
  }

  return [];
}

function evaluateMedia(profile: ProfileData): OptimizationTip[] {
  const tips: OptimizationTip[] = [];

  if (!profile.profile_photo) {
    tips.push({
      id: "photo-missing",
      category: "photo",
      priority: "high",
      title: "Add a profile photo",
      description: "Profiles without photos are skipped by 90% of users",
      action: "Upload a clear, professional headshot",
      impact: "+400% views",
    });
  }

  if (!profile.intro_video) {
    tips.push({
      id: "video-missing",
      category: "photo",
      priority: "medium",
      title: "Add an intro video",
      description: "Video profiles get 2x more inquiries",
      action: "Record a 30-60 second introduction",
      impact: "+100% inquiries",
    });
  }

  if (!profile.gallery || profile.gallery.length < 3) {
    tips.push({
      id: "gallery-low",
      category: "photo",
      priority: "medium",
      title: "Add more gallery photos",
      description: "Profiles with 5+ photos get more engagement",
      action: "Add photos of your studio, equipment, or you at work",
      impact: "+60% engagement",
    });
  }

  return tips;
}

function evaluatePricing(profile: ProfileData): OptimizationTip[] {
  const tips: OptimizationTip[] = [];

  if (profile.rate_60 && profile.city) {
    const rate = parseInt(profile.rate_60.replace(/\D/g, ""));
    const cityPricing = CITY_PRICING[profile.city] || CITY_PRICING.default;

    if (rate < cityPricing.low) {
      tips.push({
        id: "pricing-low",
        category: "pricing",
        priority: "medium",
        title: "Consider raising your rates",
        description: `Your rate ($${rate}) is below average for ${profile.city || "your area"} ($${cityPricing.mid})`,
        action: "Consider raising to at least $" + cityPricing.low,
        impact: "Higher perceived value",
      });
    } else if (rate > cityPricing.high && (!profile.years_experience || profile.years_experience < 5)) {
      tips.push({
        id: "pricing-high",
        category: "pricing",
        priority: "low",
        title: "Justify premium pricing",
        description: "Your rate is above average. Make sure your profile reflects this value.",
        action: "Highlight certifications, specialties, or unique offerings",
        impact: "Better conversion",
      });
    }
  }

  if (!profile.rate_60) {
    tips.push({
      id: "pricing-missing",
      category: "pricing",
      priority: "high",
      title: "Add your rates",
      description: "Profiles without pricing get fewer inquiries",
      action: "Add at least your 60-minute rate",
      impact: "+80% inquiries",
    });
  }

  return tips;
}

function evaluateServices(profile: ProfileData): OptimizationTip[] {
  if (!profile.services || profile.services.length === 0) {
    return [{
      id: "services-missing",
      category: "services",
      priority: "high",
      title: "List your services",
      description: "Clients filter by service type",
      action: "Add at least 3 massage types you offer",
      impact: "+120% search visibility",
    }];
  }

  if (profile.services.length < 3) {
    return [{
      id: "services-few",
      category: "services",
      priority: "low",
      title: "Add more services",
      description: "More services = more search visibility",
      action: "List all massage techniques you're trained in",
      impact: "+30% discoverability",
    }];
  }

  return [];
}

function evaluateAvailability(profile: ProfileData): OptimizationTip[] {
  if (profile.incall_available === false && profile.outcall_available === false) {
    return [{
      id: "availability-none",
      category: "availability",
      priority: "high",
      title: "Set service location",
      description: "Clients need to know where you can see them",
      action: "Enable incall, outcall, or both",
      impact: "+100% bookable",
    }];
  }

  if (profile.incall_available && !profile.outcall_available) {
    return [{
      id: "availability-incall-only",
      category: "availability",
      priority: "low",
      title: "Consider offering outcall",
      description: "Outcall services attract hotel and home clients",
      action: "Enable outcall to expand your client base",
      impact: "+40% potential clients",
    }];
  }

  return [];
}

export function generateOptimizationTips(profile: ProfileData): OptimizationTip[] {
  const tips: OptimizationTip[] = [
    ...evaluateHeadline(profile),
    ...evaluateAbout(profile),
    ...evaluateMedia(profile),
    ...evaluatePricing(profile),
    ...evaluateServices(profile),
    ...evaluateAvailability(profile),
  ];

  tips.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return tips;
}

// Get top tips (limited number for display)
export function getTopTips(profile: ProfileData, limit: number = 3): OptimizationTip[] {
  return generateOptimizationTips(profile).slice(0, limit);
}

// Calculate optimization score
export function getOptimizationScore(profile: ProfileData): number {
  const tips = generateOptimizationTips(profile);

  const deductions = tips.reduce((total, tip) => {
    switch (tip.priority) {
      case "high":
        return total + 20;
      case "medium":
        return total + 10;
      case "low":
        return total + 5;
      default:
        return total;
    }
  }, 0);

  return Math.max(0, 100 - deductions);
}
