"use server";

import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function saveAdSection(adId: string, section: string, payload: Record<string, any>) {
  const supabase = await supabaseServer();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not authenticated");

  const adRes = await supabase.from("ads").select("id,owner_id,data").eq("id", adId).maybeSingle();
  if (!adRes.data) throw new Error("Ad not found");
  if (adRes.data.owner_id !== auth.user.id) throw new Error("Forbidden");

  const nextData = { ...(adRes.data.data ?? {}), [section]: payload };

  const upd = await supabase.from("ads").update({ data: nextData }).eq("id", adId);
  if (upd.error) throw upd.error;

  revalidatePath(`/dashboard/ads/${adId}/edit/${section}`);
}
