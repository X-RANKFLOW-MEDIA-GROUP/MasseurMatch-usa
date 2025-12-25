// app/explore/page.tsx
import { baseSEO } from "@/app/lib/seo";
import UnifiedExplore from "@/components/UnifiedExplore";

export function generateMetadata() {
  return baseSEO({
    title: "Explore massage therapists near you | MasseurMatch",
    description:
      "Browse gay and male massage therapists by city, technique, and focus areas. Use filters to find LGBT-friendly professionals for your next session.",
    keywords: [
      "gay massage",
      "male massage",
      "massage therapist directory",
      "LGBT friendly massage",
      "find massage therapist",
      "massage filters",
    ],
    url: "https://www.masseurmatch.com/explore",
  });
}

export default function ExplorePage() {
  return <UnifiedExplore defaultMode="grid" />;
}
