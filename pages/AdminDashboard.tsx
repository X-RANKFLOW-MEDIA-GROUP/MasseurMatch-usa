"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminEdits, type ProfileEdit } from "@/src/hooks/useProfileEdits";
import { supabase } from "@/src/lib/supabase";

type TherapistInfo = {
  full_name?: string | null;
  email?: string | null;
};

type AdminEdit = ProfileEdit & {
  therapist?: TherapistInfo | null;
};

export default function AdminDashboard() {
  const { allEdits, loading, approveEdit, rejectEdit } = useAdminEdits();
  const [adminId, setAdminId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const edits = useMemo(() => allEdits as AdminEdit[], [allEdits]);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) return;
        setAdminId(data.user?.id ?? null);
      })
      .catch(() => {
        if (!active) return;
        setAdminId(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleApprove = async (editId: string) => {
    setActionError(null);
    if (!adminId) {
      setActionError("Faça login como administrador para aprovar edições.");
      return;
    }

    try {
      await approveEdit(editId, adminId);
    } catch (error) {
      console.error("Error approving edit:", error);
      setActionError("Não foi possível aprovar esta edição.");
    }
  };

  const handleReject = async (editId: string) => {
    setActionError(null);
    if (!adminId) {
      setActionError("Faça login como administrador para rejeitar edições.");
      return;
    }

    const reason = window.prompt("Motivo da rejeição:");
    if (!reason) return;

    try {
      await rejectEdit(editId, adminId, reason);
    } catch (error) {
      console.error("Error rejecting edit:", error);
      setActionError("Não foi possível rejeitar esta edição.");
    }
  };

  const content = (() => {
    if (loading) {
      return (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-6">
          Carregando edições pendentes...
        </div>
      );
    }

    if (edits.length === 0) {
      return (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-6">
          Nenhuma edição pendente no momento.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {edits.map((edit) => (
          <section
            key={edit.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {edit.therapist?.full_name || "Terapeuta sem nome"}
                </h2>
                <p className="text-sm text-white/70">
                  {edit.therapist?.email || "Email não informado"}
                </p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/80">
                {edit.status}
              </span>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white/80">
                  Dados originais
                </h3>
                <pre className="mt-2 max-h-60 overflow-auto text-xs text-white/70">
                  {JSON.stringify(edit.original_data, null, 2)}
                </pre>
              </div>
              <div className="rounded-lg bg-white/5 p-4">
                <h3 className="text-sm font-semibold text-white/80">
                  Dados propostos
                </h3>
                <pre className="mt-2 max-h-60 overflow-auto text-xs text-white/70">
                  {JSON.stringify(edit.edited_data, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleApprove(edit.id)}
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Aprovar
              </button>
              <button
                type="button"
                onClick={() => handleReject(edit.id)}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Rejeitar
              </button>
            </div>
          </section>
        ))}
      </div>
    );
  })();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 text-white">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Painel de Aprovações</h1>
        <p className="text-sm text-white/70">
          Revise as edições enviadas por terapeutas e aprove ou rejeite as
          alterações.
        </p>
      </header>

      {actionError && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
          {actionError}
        </div>
      )}

      {content}
    </main>
  );
}
