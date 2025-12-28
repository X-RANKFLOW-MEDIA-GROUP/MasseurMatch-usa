import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { PublicProfile } from "@/lib/profile";
import { isIndexable, canonicalUrl, seoTitle, seoDescription } from "@/lib/profile";
import ProfilePage from "@/components/profile/ProfilePage";

export const dynamic = "force-dynamic";

type Params = { city: string; slug: string };

/**
 * Fetch public profile from database view
 */
async function getProfile(city: string, slug: string): Promise<PublicProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("public_therapist_profiles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    console.error("Profile fetch error:", error);
    return null;
  }

  const p = data as unknown as PublicProfile;

  // Redirect to canonical city slug if mismatch
  if (p.city_slug && city !== p.city_slug) {
    redirect(`/${p.city_slug}/therapist/${p.slug}`);
  }

  return p;
}

/**
 * Generate SEO metadata for profile page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const supabase = await createClient();
  const { slug } = await params;

  const { data } = await supabase
    .from("public_therapist_profiles")
    .select(
      "slug, city_slug, city_name, state_code, display_name, short_bio, status, published_at, incall_enabled, outcall_enabled, photos, updated_at, plan_tier"
    )
    .eq("slug", slug)
    .single();

  if (!data) {
    return {
      title: "Profile Not Found | MasseurMatch",
      robots: { index: false, follow: true },
    };
  }

  const p = data as unknown as PublicProfile;
  const canonical = canonicalUrl(p);
  const title = seoTitle(p);
  const description = seoDescription(p);
  const indexable = isIndexable(p);

  // Get first photo for OG image
  const firstPhoto = p.photos?.[0]?.url;

  return {
    title,
    description,
    alternates: { canonical },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "profile",
      images: firstPhoto ? [{ url: firstPhoto, alt: `${p.display_name} profile photo` }] : [],
      siteName: "MasseurMatch",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: firstPhoto ? [firstPhoto] : [],
    },
    // Additional metadata for better SEO
    authors: [{ name: p.display_name }],
    keywords: [
      "massage therapist",
      p.city_name,
      p.state_code,
      ...(p.services || []),
      ...(p.modalities || []),
      p.incall_enabled ? "in-call massage" : "",
      p.outcall_enabled ? "mobile massage" : "",
    ].filter(Boolean),
  };
}

// Revalidate every hour for fresh data
export const revalidate = 3600;

/**
 * Public profile page component
 */
export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { city, slug } = await params;
  const p = await getProfile(city, slug);

  if (!p) {
    return notFound();
  }

  return <ProfilePage profile={p} />;
}
