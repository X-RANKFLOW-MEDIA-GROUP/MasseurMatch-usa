// src/pages/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../src/lib/supabase";
import "./admin.css";

type TherapistRow = {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  location: string | null;
  plan: string | null;
  plan_name: string | null;
  status: "pending" | "active" | "rejected" | string;
  created_at: string | null;
  updated_at: string | null;

  // campos de pagamento/acesso
  subscription_status: string | null;
  paid_until: string | null;
};

function PlanBadge({
  plan,
  planName,
}: {
  plan?: string | null;
  planName?: string | null;
}) {
  const label =
    planName || (plan ? plan[0].toUpperCase() + plan.slice(1) : null);
  if (!label) return null;
  const key = (plan || label).toLowerCase();
  return <span className={`plan plan-${key}`}>{label}</span>;
}

/**
 * Componente de status de pagamento só para visualização no painel.
 * Baseado em:
 * - subscription_status
 * - paid_until
 */
function PaymentStatus({ row }: { row: TherapistRow }) {
  const now = Date.now();
  const sub = (row.subscription_status || "").toLowerCase();
  const paidUntilMs = row.paid_until ? Date.parse(row.paid_until) : NaN;
  const hasPaidUntil = !Number.isNaN(paidUntilMs);

  let label = "Not paid";
  let key: "ok" | "expired" | "pending" = "pending";
  let dateText: string | null = null;

  if (hasPaidUntil) {
    const d = new Date(paidUntilMs);
    dateText = d.toLocaleDateString();
  }

  if (sub === "active" && hasPaidUntil && paidUntilMs > now) {
    label = "Paid";
    key = "ok";
  } else if (sub === "active" && !hasPaidUntil) {
    label = "Paid (no expiry set)";
    key = "ok";
  } else if (hasPaidUntil && paidUntilMs <= now) {
    label = "Expired";
    key = "expired";
  } else {
    label = "Not paid";
    key = "pending";
  }

  return (
    <div className={`pill pill-${key}`}>
      <span>{label}</span>
      {dateText && (
        <span className="pill-sub">
          {" "}
          · until <strong>{dateText}</strong>
        </span>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<TherapistRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // ---- Gate: apenas admin
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        if (mounted) setIsAdmin(false);
        return;
      }
      const uid = sessionData.session.user.id;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", uid)
        .single();
      if (mounted) setIsAdmin(!error && !!data?.is_admin);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // ---- Buscar pendentes
  async function fetchPending() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("therapists")
      .select(
        `
        id,
        user_id,
        full_name,
        email,
        location,
        plan,
        plan_name,
        status,
        subscription_status,
        paid_until,
        created_at,
        updated_at
      `
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    setRows((data as TherapistRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    if (isAdmin === true) fetchPending();
  }, [isAdmin]);

  // ---- Atualiza status com fallback se colunas não existirem
  async function safeUpdateStatus(
    id: string,
    status: "active" | "rejected",
    reason?: string | null
  ) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // 1ª tentativa: com campos de revisão
    const fullPayload: any = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: session?.user?.id ?? null,
    };
    if (status === "rejected") {
      fullPayload.rejection_reason = reason ?? null;
    }

    const tryFull = await supabase
      .from("therapists")
      .update(fullPayload)
      .eq("id", id);

    if (!tryFull.error) return;

    // 2ª tentativa: apenas status (para ambientes sem colunas reviewed_*/rejection_reason)
    await supabase.from("therapists").update({ status }).eq("id", id);
  }

  async function moderate(id: string, action: "approve" | "reject") {
    const status = action === "approve" ? "active" : "rejected";
    const reason =
      action === "reject"
        ? prompt("Motivo da rejeição (opcional):", "") ?? ""
        : null;

    setBusy(id);
    try {
      await safeUpdateStatus(id, status, reason);
      // Otimismo no UI
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      alert("Erro ao atualizar: " + (e?.message || "tente novamente."));
    } finally {
      setBusy(null);
    }
  }

  const emptyState = useMemo(
    () =>
      !loading &&
      !error &&
      rows.length === 0 && <p className="muted">No pending approvals 🎉</p>,
    [loading, error, rows.length]
  );

  if (isAdmin === false) {
    return (
      <div className="admin-shell">
        <h1 className="title">Admin Panel</h1>
        <p className="muted">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <h1 className="title">Admin • Pending Profiles</h1>
      <p className="subtitle">Aprove ou rejeite novos cadastros de terapeutas.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button className="btn" onClick={fetchPending} disabled={loading}>
          {loading ? "Atualizando..." : "Atualizar lista"}
        </button>
      </div>

      {error ? (
        <p style={{ color: "tomato" }}>{error}</p>
      ) : loading ? (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-mail</th>
                <th>Local</th>
                <th>Plan</th>
                <th>Payment</th>
                <th>Created</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="skeleton">
                  <td colSpan={7}>
                    <div className="sk" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : emptyState ? (
        emptyState
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>E-mail</th>
                <th>Local</th>
                <th>Plan</th>
                <th>Payment</th>
                <th>Created</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const when =
                  r.created_at || r.updated_at
                    ? new Date(
                        r.created_at || r.updated_at!
                      ).toLocaleString()
                    : "—";
                const nome = r.full_name || "—";
                const loc = r.location || "—";
                const isBusy = busy === r.id;

                return (
                  <tr key={r.id}>
                    <td className="bold">{nome}</td>
                    <td className="muted">{r.email || "—"}</td>
                    <td className="muted">{loc}</td>
                    <td>
                      <PlanBadge plan={r.plan} planName={r.plan_name} />
                    </td>
                    <td>
                      <PaymentStatus row={r} />
                    </td>
                    <td className="muted">{when}</td>
                    <td className="actions">
                      <button
                        className="btn btn-approve"
                        onClick={() => moderate(r.id, "approve")}
                        disabled={isBusy}
                        aria-busy={isBusy}
                      >
                        {isBusy ? "..." : "Approve"}
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => moderate(r.id, "reject")}
                        disabled={isBusy}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}