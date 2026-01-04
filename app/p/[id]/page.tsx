import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProfileByIdPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  // Look up the therapist by user_id and get their slug
  const { data: profile } = await supabase
    .from("profiles")
    .select("slug")
    .eq("user_id", id)
    .single();

  if (profile?.slug) {
    redirect(`/therapist/${profile.slug}`);
  }

  // If not found, redirect to therapist list
  redirect("/therapist");
}
