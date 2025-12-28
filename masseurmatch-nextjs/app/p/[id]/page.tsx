import { redirect, notFound } from 'next/navigation';
import { supabaseAdmin } from '@/server/supabaseAdmin';

/**
 * Short link redirect route
 * /p/[id] → /therapist/[slug]
 *
 * Example: /p/45519 → /therapist/alex-santos-los-angeles
 *
 * This mimics MasseurFinder's short link system for compatibility
 */
export default async function ShortLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Get therapist by numeric ID or UUID
  const { data: therapist, error } = await supabaseAdmin
    .from('therapists')
    .select('slug')
    .eq('user_id', id) // Assuming user_id is UUID
    .eq('status', 'active')
    .single();

  if (error || !therapist) {
    // Try to find by legacy numeric ID if you have one
    // const { data: therapist2 } = await supabaseAdmin
    //   .from('therapists')
    //   .select('slug')
    //   .eq('legacy_id', parseInt(params.id))
    //   .eq('status', 'active')
    //   .single();
    //
    // if (therapist2) {
    //   redirect(`/therapist/${therapist2.slug}`);
    // }

    notFound();
  }

  // 301 permanent redirect to canonical URL
  redirect(`/therapist/${therapist.slug}`);
}

// Optional: Add generateMetadata to set canonical before redirect
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: therapist } = await supabaseAdmin
    .from('therapists')
    .select('slug, display_name')
    .eq('user_id', id)
    .eq('status', 'active')
    .single();

  if (!therapist) {
    return {
      title: 'Profile Not Found',
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${therapist.display_name} | MasseurMatch`,
    alternates: {
      canonical: `/therapist/${therapist.slug}`,
    },
    robots: {
      index: false, // Don't index short links
      follow: true,
    },
  };
}
