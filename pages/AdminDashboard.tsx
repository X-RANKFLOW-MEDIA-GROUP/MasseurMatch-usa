"use client";

// src/pages/AdminDashboard.tsx
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../src/lib/supabase";
import "./admin.css";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Edit,
  ExternalLink,
  FileText,
} from "lucide-react";

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
  subscription_status: string | null;
  paid_until: string | null;
  // 🔐 Novos campos de verificação / documentos
  document_url?: string | null;
  selfie_url?: string | null;
  card_url?: string | null;
  signed_term_url?: string | null;
};

type ProfileEdit = {
  id: string;
  therapist_id: string;
  edited_data: Record<string, any>;
  pending_profile_photo?: string | null;
  pending_gallery?: string[] | null;
  original_data: Record<string, any>;
  original_profile_photo?: string | null;
  original_gallery?: string[] | null;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string | null;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  submitted_at: string;
  therapist?: {
    full_name: string;
    email: string;
  };
};

type TabType = "approvals" | "edits" | "all";

/* =====================
  Badges auxiliares
===================== */

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

/* =====================
  Helpers para normalizar payload
===================== */

function normalizeTherapistPayload(
  payload: Record<string, any>
): Record<string, any> {
  const normalized: Record<string, any> = { ...payload };

  // Campos date no Postgres – não podem receber ""
  const dateFields = ["birthdate", "massage_start_date"];

  // Campos numéricos opcionais: se vierem como "", mandamos null
  const numericFields = [
    "mobile_service_radius",
    "years_experience",
    "override_reviews_count",
    "rating",
    "travel_radius",
  ];

  for (const field of dateFields) {
    if (normalized[field] === "" || typeof normalized[field] === "undefined") {
      normalized[field] = null;
    }
  }

  for (const field of numericFields) {
    if (normalized[field] === "" || typeof normalized[field] === "undefined") {
      normalized[field] = null;
    }
  }

  // Remover chaves undefined para evitar ruído no update
  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === "undefined") {
      delete normalized[key];
    }
  });

  return normalized;
}

/* =====================
  Modal de revisão (edições de perfil)
===================== */

function EditReviewModal({
  edit,
  onClose,
  onApprove,
  onReject,
  processing,
}: {
  edit: ProfileEdit;
  onClose: () => void;
  onApprove: (editId: string) => void;
  onReject: (editId: string, reason: string) => void;
  processing: boolean;
}) {
  const [rejectReason, setRejectReason] = useState("");

  const renderFieldComparison = (
    field: string,
    oldValue: any,
    newValue: any
  ) => {
    const oldStr = JSON.stringify(oldValue, null, 2);
    const newStr = JSON.stringify(newValue, null, 2);

    if (oldStr === newStr) return null;

    return (
      <div key={field} className="field-comparison">
        <h4>{field}</h4>
        <div className="comparison-columns">
          <div className="old-value">
            <strong>Original:</strong>
            <pre>{oldStr}</pre>
          </div>
          <div className="new-value">
            <strong>Novo:</strong>
            <pre>{newStr}</pre>
          </div>
        </div>
      </div>
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Por favor, forneça um motivo para a rejeição");
      return;
    }
    if (confirm("Rejeitar estas edições?")) {
      onReject(edit.id, rejectReason);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Revisar Edições</h2>
          <p className="modal-subtitle">
            Terapeuta: {edit.therapist?.full_name || "N/A"}
          </p>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {Object.keys(edit.edited_data).map((field) =>
            renderFieldComparison(
              field,
              edit.original_data[field],
              edit.edited_data[field]
            )
          )}

          {edit.pending_gallery && edit.pending_gallery.length > 0 && (
            <div className="field-comparison">
              <h4>Galeria de Fotos</h4>
              <div style={{ padding: "1rem" }}>
                <strong>Novas fotos:</strong>
                <div className="gallery-comparison">
                  {edit.pending_gallery.map((url: string, i: number) => (
                    <img key={i} src={url} alt={`Gallery ${i + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="reject-section">
            <label>Motivo da rejeição (se aplicável):</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Descreva o motivo da rejeição..."
              rows={4}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Fechar
          </button>
          <button
            className="btn btn-approve"
            onClick={() =>
              confirm("Aprovar estas edições?") && onApprove(edit.id)
            }
            disabled={processing}
          >
            <CheckCircle size={16} />
            Aprovar
          </button>
          <button
            className="btn btn-reject"
            onClick={handleReject}
            disabled={processing || !rejectReason.trim()}
          >
            <XCircle size={16} />
            Rejeitar
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================
  Modal de documentos dos novos cadastros
===================== */

function ApprovalDocsModal({
  therapist,
  onClose,
}: {
  therapist: TherapistRow;
  onClose: () => void;
}) {
  const {
    full_name,
    email,
    location,
    document_url,
    selfie_url,
    card_url,
    signed_term_url,
  } = therapist;

  const openProfile = () => {
    // 🔗 Ajuste a rota se o seu perfil público for diferente
    window.open(`/therapist/${therapist.id}`, "_blank");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Documentos de Verificação</h2>
          <p className="modal-subtitle">
            {full_name || "Sem nome"} · {email || "sem e-mail"}
          </p>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="info-row">
            <span className="label">Local:</span>
            <span className="value">{location || "—"}</span>
          </div>

          <div className="docs-grid">
            {document_url && (
              <div className="doc-card">
                <h4>Documento (ID)</h4>
                <img src={document_url} alt="Documento" />
                <a
                  href={document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="doc-link"
                >
                  <ExternalLink size={14} />
                  Abrir em nova aba
                </a>
              </div>
            )}

            {selfie_url && (
              <div className="doc-card">
                <h4>Selfie com Documento</h4>
                <img src={selfie_url} alt="Selfie com documento" />
                <a
                  href={selfie_url}
                  target="_blank"
                  rel="noreferrer"
                  className="doc-link"
                >
                  <ExternalLink size={14} />
                  Abrir em nova aba
                </a>
              </div>
            )}

            {card_url && (
              <div className="doc-card">
                <h4>Foto do Cartão</h4>
                <img src={card_url} alt="Cartão" />
                <a
                  href={card_url}
                  target="_blank"
                  rel="noreferrer"
                  className="doc-link"
                >
                  <ExternalLink size={14} />
                  Abrir em nova aba
                </a>
              </div>
            )}
          </div>

          {signed_term_url && (
            <div className="field-comparison" style={{ marginTop: "1.5rem" }}>
              <h4>Termo Assinado (PDF)</h4>
              <div className="pdf-preview-wrapper">
                {/* Tentativa de embed. Se não funcionar bem, admin usa o link abaixo */}
                <iframe
                  src={signed_term_url}
                  title="Termo assinado"
                  className="pdf-iframe"
                />
              </div>
              <a
                href={signed_term_url}
                target="_blank"
                rel="noreferrer"
                className="doc-link"
                style={{ marginTop: 8 }}
              >
                <FileText size={14} />
                Abrir PDF em nova aba
              </a>
            </div>
          )}

          {!document_url && !selfie_url && !card_url && !signed_term_url && (
            <p className="muted">
              Nenhum documento foi encontrado para este cadastro.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Fechar
          </button>
          <button className="btn" onClick={openProfile}>
            <ExternalLink size={16} />
            Ver perfil público
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================
  Admin Dashboard
===================== */

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<TherapistRow[]>([]); // pendentes
  const [allRows, setAllRows] = useState<TherapistRow[]>([]); // todos
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Edições de perfil
  const [activeTab, setActiveTab] = useState<TabType>("approvals");
  const [profileEdits, setProfileEdits] = useState<ProfileEdit[]>([]);
  const [selectedEdit, setSelectedEdit] = useState<ProfileEdit | null>(null);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [adminId, setAdminId] = useState<string>("");

  // Modal de documentos dos cadastros
  const [selectedTherapist, setSelectedTherapist] =
    useState<TherapistRow | null>(null);

  /* ---- Gate: apenas admin ---- */
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        if (mounted) setIsAdmin(false);
        return;
      }
      const uid = sessionData.session.user.id;
      if (mounted) setAdminId(uid);

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

  /* ---- Buscar novos cadastros pendentes ---- */
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
        updated_at,
        document_url,
        selfie_url,
        card_url,
        signed_term_url
      `
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    setRows((data as TherapistRow[]) || []);
    setLoading(false);
  }

  /* ---- Buscar TODOS os profissionais cadastrados ---- */
  async function fetchAllTherapists() {
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
        updated_at,
        document_url,
        selfie_url,
        card_url,
        signed_term_url
      `
      )
      .order("created_at", { ascending: false });

    if (error) setError(error.message);
    setAllRows((data as TherapistRow[]) || []);
    setLoading(false);
  }

  /* ---- Buscar edições de perfil pendentes ---- */
  async function fetchPendingEdits() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("profile_edits")
      .select(
        `
        *,
        therapist:therapists!profile_edits_therapist_id_fkey (
          full_name,
          email
        )
      `
      )
      .eq("status", "pending")
      .order("submitted_at", { ascending: false });

    if (error) {
      setError(error.message);
      setProfileEdits([]);
    } else {
      setProfileEdits((data as ProfileEdit[]) || []);
    }
    setLoading(false);
  }

  /* ---- Carregar dados ao entrar / trocar de aba ---- */
  useEffect(() => {
    if (isAdmin === true) {
      if (activeTab === "approvals") {
        fetchPending();
      } else if (activeTab === "edits") {
        fetchPendingEdits();
      } else if (activeTab === "all") {
        fetchAllTherapists();
      }
    }
  }, [isAdmin, activeTab]);

  /* ---- Realtime para profile_edits ---- */
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel("admin-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profile_edits",
          filter: "status=eq.pending",
        },
        () => {
          if (activeTab === "edits") fetchPendingEdits();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [isAdmin, activeTab]);

  /* ---- Atualizar status de novos cadastros ---- */
  async function safeUpdateStatus(
    id: string,
    status: "active" | "rejected",
    reason?: string | null
  ) {
    const {
      data: { session },
    } = await supabase.auth.getSession();

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

    // fallback se colunas não existirem
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
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      alert("Erro ao atualizar: " + (e?.message || "tente novamente."));
    } finally {
      setBusy(null);
    }
  }

  /* ---- Aprovar edição de perfil (aplica direto em therapists) ---- */
  async function approveProfileEdit(editId: string) {
    setProcessingEdit(true);
    try {
      const edit = profileEdits.find((e) => e.id === editId);
      if (!edit) throw new Error("Edit not found");

      const edited = edit.edited_data || {};
      const original = edit.original_data || {};
      const pendingGallery = edit.pending_gallery || null;
      const originalGallery = edit.original_gallery || null;

      // Mescla dados originais + editados (editados sobrescrevem)
      const mergedData: Record<string, any> = {
        ...original,
        ...edited,
      };

      // Tratar gallery
      if (pendingGallery && pendingGallery.length > 0) {
        mergedData.gallery = pendingGallery;
      } else if (originalGallery) {
        mergedData.gallery = originalGallery;
      }

      // Normalizar payload (datas, números, undefined, etc.)
      const finalData = normalizeTherapistPayload(mergedData);

      // Atualizar therapists com TODOS os campos de finalData
      const { error: updateError } = await supabase
        .from("therapists")
        .update(finalData)
        .eq("id", edit.therapist_id);

      if (updateError) {
        throw updateError;
      }

      // Atualizar status da edição
      const { error: statusError } = await supabase
        .from("profile_edits")
        .update({
          status: "approved",
          admin_notes: edit.admin_notes || null,
          reviewed_by: adminId || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", editId);

      if (statusError) {
        throw statusError;
      }

      // Notificação para o terapeuta
      await supabase.from("edit_notifications").insert({
        therapist_id: edit.therapist_id,
        edit_id: editId,
        type: "approved",
        message: "Suas edições foram aprovadas e publicadas no seu perfil!",
      });

      // Atualizar estado local
      setProfileEdits((prev) => prev.filter((e) => e.id !== editId));
      setSelectedEdit(null);
      alert("Edições aprovadas com sucesso!");
    } catch (err: any) {
      console.error("Error approving edit:", err, JSON.stringify(err || {}));
      const msg =
        err?.message ||
        err?.error_description ||
        "Erro desconhecido ao aprovar edições.";
      alert("Erro ao aprovar edições: " + msg);
    } finally {
      setProcessingEdit(false);
    }
  }

  /* ---- Rejeitar edição de perfil ---- */
  async function rejectProfileEdit(editId: string, reason: string) {
    setProcessingEdit(true);
    try {
      const edit = profileEdits.find((e) => e.id === editId);
      if (!edit) throw new Error("Edit not found");

      const { error } = await supabase
        .from("profile_edits")
        .update({
          status: "rejected",
          admin_notes: reason,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", editId);

      if (error) throw error;

      await supabase.from("edit_notifications").insert({
        therapist_id: edit.therapist_id,
        edit_id: editId,
        type: "rejected",
        message: `Suas edições foram rejeitadas. Motivo: ${reason}`,
      });

      setProfileEdits((prev) => prev.filter((e) => e.id !== editId));
      setSelectedEdit(null);
      alert("Edições rejeitadas");
    } catch (err: any) {
      console.error("Error rejecting edit:", err, JSON.stringify(err || {}));
      const msg =
        err?.message ||
        err?.error_description ||
        "Erro desconhecido ao rejeitar edições.";
      alert("Erro ao rejeitar edições: " + msg);
    } finally {
      setProcessingEdit(false);
    }
  }

  /* ---- Empty states ---- */

  const emptyState = useMemo(
    () =>
      !loading &&
      !error &&
      rows.length === 0 &&
      activeTab === "approvals" && (
        <p className="muted">No pending approvals 🎉</p>
      ),
    [loading, error, rows.length, activeTab]
  );

  const emptyAllState = useMemo(
    () =>
      !loading &&
      !error &&
      allRows.length === 0 &&
      activeTab === "all" && (
        <p className="muted">Nenhum profissional cadastrado ainda.</p>
      ),
    [loading, error, allRows.length, activeTab]
  );

  const emptyEditsState = useMemo(
    () =>
      !loading &&
      !error &&
      profileEdits.length === 0 &&
      activeTab === "edits" && (
        <div className="empty-state">
          <CheckCircle size={64} style={{ opacity: 0.3, margin: "0 auto" }} />
          <p className="muted">Nenhuma edição pendente no momento 🎉</p>
        </div>
      ),
    [loading, error, profileEdits.length, activeTab]
  );

  if (isAdmin === false) {
    return (
      <div className="admin-shell">
        <h1 className="title">Admin Panel</h1>
        <p className="muted">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  /* ---- Helpers de navegação ---- */

  const openProfile = (row: TherapistRow) => {
    // Ajuste a rota se o path do perfil for diferente
    window.open(`/therapist/${row.id}`, "_blank");
  };

  /* ---- Render ---- */

  return (
    <div className="admin-shell">
      <h1 className="title">Admin Dashboard</h1>
      <p className="subtitle">Gerencie aprovações, edições e perfis.</p>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${
            activeTab === "approvals" ? "active" : ""
          }`}
          onClick={() => setActiveTab("approvals")}
        >
          <User size={18} />
          Novos Cadastros
          {rows.length > 0 && <span className="badge">{rows.length}</span>}
        </button>
        <button
          className={`admin-tab ${activeTab === "edits" ? "active" : ""}`}
          onClick={() => setActiveTab("edits")}
        >
          <Edit size={18} />
          Edições de Perfil
          {profileEdits.length > 0 && (
            <span className="badge">{profileEdits.length}</span>
          )}
        </button>
        <button
          className={`admin-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          <User size={18} />
          Todos os Profissionais
          {allRows.length > 0 && <span className="badge">{allRows.length}</span>}
        </button>
      </div>

      {/* Botão de atualizar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <button
          className="btn"
          onClick={
            activeTab === "approvals"
              ? fetchPending
              : activeTab === "edits"
              ? fetchPendingEdits
              : fetchAllTherapists
          }
          disabled={loading}
        >
          {loading ? "Atualizando..." : "Atualizar lista"}
        </button>
      </div>

      {error && <p style={{ color: "tomato" }}>{error}</p>}

      {/* APROVAÇÕES DE NOVOS CADASTROS */}
      {activeTab === "approvals" && (
        <>
          {loading ? (
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
                    <th>Docs</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="skeleton">
                      <td colSpan={8}>
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
                    <th>Docs</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const when =
                      r.created_at || r.updated_at
                        ? new Date(
                            r.created_at || (r.updated_at as string)
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
                        <td>
                          {(r.document_url ||
                            r.selfie_url ||
                            r.card_url ||
                            r.signed_term_url) && (
                            <button
                              className="btn btn-ghost"
                              onClick={() => setSelectedTherapist(r)}
                            >
                              <Eye size={14} />
                              Ver docs
                            </button>
                          )}
                        </td>
                        <td className="actions">
                          <button
                            className="btn"
                            onClick={() => openProfile(r)}
                            disabled={isBusy}
                          >
                            <ExternalLink size={14} />
                            Perfil
                          </button>
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
        </>
      )}

      {/* TODOS OS PROFISSIONAIS */}
      {activeTab === "all" && (
        <>
          {loading ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-mail</th>
                    <th>Local</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Created</th>
                    <th>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <tr key={`skeleton-all-${i}`} className="skeleton">
                      <td colSpan={8}>
                        <div className="sk" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : emptyAllState ? (
            emptyAllState
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>E-mail</th>
                    <th>Local</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Created</th>
                    <th>Profile</th>
                  </tr>
                </thead>
                <tbody>
                  {allRows.map((r) => {
                    const when =
                      r.created_at || r.updated_at
                        ? new Date(
                            r.created_at || (r.updated_at as string)
                          ).toLocaleString()
                        : "—";
                    const nome = r.full_name || "—";
                    const loc = r.location || "—";

                    return (
                      <tr key={r.id}>
                        <td className="bold">{nome}</td>
                        <td className="muted">{r.email || "—"}</td>
                        <td className="muted">{loc}</td>
                        <td>
                          <PlanBadge plan={r.plan} planName={r.plan_name} />
                        </td>
                        <td>
                          <span className={`status-pill status-${r.status}`}>
                            {r.status || "—"}
                          </span>
                        </td>
                        <td>
                          <PaymentStatus row={r} />
                        </td>
                        <td className="muted">{when}</td>
                        <td className="actions">
                          <button
                            className="btn"
                            onClick={() => openProfile(r)}
                          >
                            <ExternalLink size={14} />
                            Ver perfil
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* EDIÇÕES DE PERFIL */}
      {activeTab === "edits" && (
        <>
          {loading ? (
            <div className="edits-loading">
              <Clock size={32} style={{ opacity: 0.3 }} />
              <p>Carregando edições...</p>
            </div>
          ) : emptyEditsState ? (
            emptyEditsState
          ) : (
            <div className="edits-grid">
              {profileEdits.map((edit) => (
                <div key={edit.id} className="edit-card">
                  <div className="edit-card-header">
                    <div className="edit-info">
                      <h3>
                        <User size={18} />
                        {edit.therapist?.full_name || "Terapeuta"}
                      </h3>
                      <p className="edit-meta">
                        <span>
                          Enviado:{" "}
                          {new Date(edit.submitted_at).toLocaleString("pt-BR")}
                        </span>
                        <span>ID: {edit.therapist_id.slice(0, 8)}...</span>
                      </p>
                    </div>
                    <span className="status-badge pending">
                      <Clock size={14} />
                      Pendente
                    </span>
                  </div>
                  <div className="edit-card-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setSelectedEdit(edit)}
                    >
                      <Eye size={16} />
                      Revisar
                    </button>
                    <button
                      className="btn btn-approve"
                      onClick={() =>
                        confirm("Aprovar estas edições?") &&
                        approveProfileEdit(edit.id)
                      }
                      disabled={processingEdit}
                    >
                      <CheckCircle size={16} />
                      Aprovar
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => setSelectedEdit(edit)}
                      disabled={processingEdit}
                    >
                      <XCircle size={16} />
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de revisão de edições */}
      {selectedEdit && (
        <EditReviewModal
          edit={selectedEdit}
          onClose={() => setSelectedEdit(null)}
          onApprove={approveProfileEdit}
          onReject={rejectProfileEdit}
          processing={processingEdit}
        />
      )}

      {/* Modal de documentos dos novos cadastros */}
      {selectedTherapist && (
        <ApprovalDocsModal
          therapist={selectedTherapist}
          onClose={() => setSelectedTherapist(null)}
        />
      )}
    </div>
  );
}
