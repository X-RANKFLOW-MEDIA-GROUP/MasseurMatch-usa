// src/lib/approveEdit.ts
"use server"; // se você usar em server actions / route handlers (opcional)

import { supabase } from "./supabase";

/**
 * Aprova uma edição de perfil:
 * - Lê o registro em profile_edits
 * - Mescla original_data + edited_data
 * - Trata gallery (pending_gallery vs original_gallery)
 * - Atualiza therapists
 * - Marca profile_edits como approved
 * - Cria notificação
 */
export async function approveEdit(editId: string) {
  // 1) Buscar a edição
  const { data: edit, error } = await supabase
    .from("profile_edits")
    .select("*")
    .eq("id", editId)
    .single();

  if (error || !edit) {
    console.error("Error loading edit", error);
    throw new Error("Could not load edit");
  }

  const edited: Record<string, any> = edit.edited_data || {};
  const original: Record<string, any> = edit.original_data || {};
  const pendingGallery: string[] | null = edit.pending_gallery;
  const originalGallery: string[] | null = edit.original_gallery;

  // 2) Mesclar original + edited
  // edited sobrescreve original
  const finalData: Record<string, any> = {
    ...original,
    ...edited,
  };

  // 3) Tratar gallery
  if (pendingGallery && pendingGallery.length > 0) {
    finalData.gallery = pendingGallery;
  } else if (originalGallery) {
    finalData.gallery = originalGallery;
  }

  // 4) Atualizar therapists
  const { error: updateError } = await supabase
    .from("therapists")
    .update(finalData)
    .eq("id", edit.therapist_id);

  if (updateError) {
    console.error("Error updating therapist", updateError);
    throw new Error(updateError.message);
  }

  // 5) Marcar a edição como aprovada
  const { error: statusError } = await supabase
    .from("profile_edits")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .eq("id", editId);

  if (statusError) {
    console.error("Error updating edit status", statusError);
    throw new Error(statusError.message);
  }

  // 6) Criar notificação (opcional)
  await supabase.from("edit_notifications").insert({
    therapist_id: edit.therapist_id,
    edit_id: edit.id,
    type: "approved",
    message: "Your profile changes have been approved and are now live.",
  });

  return finalData;
}

/**
 * Rejeita uma edição:
 * - Marca como rejected
 * - (Opcional) Cria notificação
 */
export async function rejectEdit(editId: string, reason?: string) {
  const { data: edit, error } = await supabase
    .from("profile_edits")
    .select("*")
    .eq("id", editId)
    .single();

  if (error || !edit) {
    console.error("Error loading edit", error);
    throw new Error("Could not load edit");
  }

  const { error: statusError } = await supabase
    .from("profile_edits")
    .update({
      status: "rejected",
      rejected_at: new Date().toISOString(),
      rejection_reason: reason || null,
    })
    .eq("id", editId);

  if (statusError) {
    console.error("Error updating edit status", statusError);
    throw new Error(statusError.message);
  }

  await supabase.from("edit_notifications").insert({
    therapist_id: edit.therapist_id,
    edit_id: edit.id,
    type: "rejected",
    message:
      reason ||
      "Your profile changes were not approved. Please review and submit again.",
  });
}
