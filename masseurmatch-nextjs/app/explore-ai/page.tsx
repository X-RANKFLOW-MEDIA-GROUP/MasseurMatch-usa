// app/explore-ai/page.tsx
import { baseSEO } from "@/app/lib/seo";
import UnifiedExplore from "@/components/UnifiedExplore";

export function generateMetadata() {
  return baseSEO({
    title: "Discover Your Perfect Massage Match | MasseurMatch AI",
    description:
      "Swipe to find your perfect massage therapist. AI-powered recommendations based on your preferences, location, and massage style.",
    keywords: [
      "massage matching",
      "AI massage recommendations",
      "find massage therapist",
      "massage swipe",
      "personalized massage",
      "massage discovery",
    ],
    url: "https://www.masseurmatch.com/explore-ai",
  });
}

export default function ExploreAIPage() {
  return <UnifiedExplore defaultMode="ai" />;
}
