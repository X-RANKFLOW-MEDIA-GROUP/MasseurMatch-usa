"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function saveAdSection(adId: string, section: string, payload: Record<string, any>) {
  const supabase = await supabaseServer();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");

  const profileRes = await supabase
    .from("therapists")
    .select("user_id")
    .eq("user_id", adId)
    .maybeSingle();

  if (!profileRes.data) throw new Error("Profile not found");
  if (profileRes.data.user_id !== auth.user.id) throw new Error("Forbidden");

  const updates = {
    ...payload,
    updated_at: new Date().toISOString(),
  };

  const upd = await supabase.from("therapists").update(updates).eq("user_id", adId);
  if (upd.error) throw upd.error;

  revalidatePath(`/dashboard/ads/${adId}/edit/${section}`);
}
