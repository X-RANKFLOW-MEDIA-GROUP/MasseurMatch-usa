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
  Trash2,
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
  Helper badges
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
          - until <strong>{dateText}</strong>
        </span>
      )}
    </div>
  );
}

/* =====================
  Helpers to normalize payload
===================== */

function normalizeTherapistPayload(
  payload: Record<string, any>
): Record<string, any> {
  const normalized: Record<string, any> = { ...payload };

  const dateFields = ["birthdate", "massage_start_date"];
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

  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === "undefined") {
      delete normalized[key];
    }
  });

  return normalized;
}

/* =====================
  Review modal (profile edits)
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
            <strong>New:</strong>
            <pre>{newStr}</pre>
          </div>
        </div>
      </div>
    );
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }
    if (confirm("Reject these edits?")) {
      onReject(edit.id, rejectReason);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Review Edits</h2>
          <p className="modal-subtitle">
            Therapist: {edit.therapist?.full_name || "N/A"}
          </p>
          <button className="modal-close" onClick={onClose}>
            X
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
              <h4>Photo Gallery</h4>
              <div style={{ padding: "1rem" }}>
                <strong>New photos:</strong>
                <div className="gallery-comparison">
                  {edit.pending_gallery.map((url: string, i: number) => (
                    <img key={i} src={url} alt={`Gallery ${i + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="reject-section">
            <label>Reason for rejection (if applicable):</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Describe the reason for rejection..."
              rows={4}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-approve"
            onClick={() =>
              confirm("Approve these edits?") && onApprove(edit.id)
            }
            disabled={processing}
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button
            className="btn btn-reject"
            onClick={handleReject}
            disabled={processing || !rejectReason.trim()}
          >
            <XCircle size={16} />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================
  Documents modal
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
    const profileId = therapist.user_id || therapist.id;
    window.open(`/therapist/${profileId}`, "_blank");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Verification Documents</h2>
          <p className="modal-subtitle">
            {full_name || "No name"} | {email || "no email"}
          </p>
          <button className="modal-close" onClick={onClose}>
            X
          </button>
        </div>

        <div className="modal-body">
          <div className="info-row">
            <span className="label">Location:</span>
            <span className="value">{location || "N/A"}</span>
          </div>

          <div className="docs-grid">
            {document_url && (
              <div className="doc-card">
                <h4>Document (ID)</h4>
                <img src={document_url} alt="Document" />
                <a
                  href={document_url}
                  target="_blank"
                  rel="noreferrer"
                  className="doc-link"
                >
                  <ExternalLink size={14} />
                  Open in new tab
                </a>
              </div>
            )}

            {selfie_url && (
              <div className="doc-card">
                <h4>Selfie with Document</h4>
                <img src={selfie_url} alt="Selfie with document" />
                <a
                  href={selfie_url}
                  target="_blank"
                  rel="noreferrer"
                  className="doc-link"
                >
                  <ExternalLink size={14} />
                  Open in new tab
                </a>
              </div>
            )}

            {card_url && (
              <div className="doc-card">
                <h4>Card Photo</h4>
                <img src={card_url} alt="Card" />
                <a
                  href={card_url}
                  target="_blank"
                  rel="noreferrer"
                  className="doc-link"
                >
                  <ExternalLink size={14} />
                  Open in new tab
                </a>
              </div>
            )}
          </div>

          {signed_term_url && (
            <div className="field-comparison" style={{ marginTop: "1.5rem" }}>
              <h4>Signed Terms (PDF)</h4>
              <div className="pdf-preview-wrapper">
                <iframe
                  src={signed_term_url}
                  title="Signed terms"
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
                Open PDF in new tab
              </a>
            </div>
          )}

          {!document_url && !selfie_url && !card_url && !signed_term_url && (
            <p className="muted">
              No documents were found for this registration.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
          <button className="btn" onClick={openProfile}>
            <ExternalLink size={16} />
            View public profile
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
  const [rows, setRows] = useState<TherapistRow[]>([]);
  const [allRows, setAllRows] = useState<TherapistRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [deleteBusyId, setDeleteBusyId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("approvals");
  const [profileEdits, setProfileEdits] = useState<ProfileEdit[]>([]);
  const [selectedEdit, setSelectedEdit] = useState<ProfileEdit | null>(null);
  const [processingEdit, setProcessingEdit] = useState(false);
  const [adminId, setAdminId] = useState<string>("");

  const [selectedTherapist, setSelectedTherapist] =
    useState<TherapistRow | null>(null);

  /* ---- Gate: admin only ---- */
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

  /* ---- Buscar TODOS os profissionais ---- */
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

  /* ---- Fetch pending edits ---- */
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

  /* ---- Carregar dados ao trocar de aba ---- */
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

  /* ---- Realtime profile_edits ---- */
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

    await supabase.from("therapists").update({ status }).eq("id", id);
  }

  async function moderate(id: string, action: "approve" | "reject") {
    const status = action === "approve" ? "active" : "rejected";
    const reason =
      action === "reject"
        ? prompt("Reason for rejection (optional):", "") ?? ""
        : null;

    setBusy(id);
    try {
      await safeUpdateStatus(id, status, reason);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e: any) {
      alert("Error updating: " + (e?.message || "please try again."));
    } finally {
      setBusy(null);
    }
  }

  /* ---- Approve profile edit ---- */
  async function approveProfileEdit(editId: string) {
    setProcessingEdit(true);
    try {
      const edit = profileEdits.find((e) => e.id === editId);
      if (!edit) throw new Error("Edit not found");

      const edited = edit.edited_data || {};
      const original = edit.original_data || {};
      const pendingGallery = edit.pending_gallery || null;
      const originalGallery = edit.original_gallery || null;

      const mergedData: Record<string, any> = {
        ...original,
        ...edited,
      };

      if (pendingGallery && pendingGallery.length > 0) {
        mergedData.gallery = pendingGallery;
      } else if (originalGallery) {
        mergedData.gallery = originalGallery;
      }

      const finalData = normalizeTherapistPayload(mergedData);

      const { error: updateError } = await supabase
        .from("therapists")
        .update(finalData)
        .eq("id", edit.therapist_id);

      if (updateError) throw updateError;

      const { error: statusError } = await supabase
        .from("profile_edits")
        .update({
          status: "approved",
          admin_notes: edit.admin_notes || null,
          reviewed_by: adminId || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", editId);

      if (statusError) throw statusError;

      await supabase.from("edit_notifications").insert({
        therapist_id: edit.therapist_id,
        edit_id: editId,
        type: "approved",
        message: "Your edits were approved and published on your profile!",
      });

      setProfileEdits((prev) => prev.filter((e) => e.id !== editId));
      setSelectedEdit(null);
      alert("Edits approved successfully!");
    } catch (err: any) {
      console.error("Error approving edit:", err, JSON.stringify(err || {}));
      const msg =
        err?.message ||
        err?.error_description ||
        "Unknown error approving edits.";
      alert("Error approving edits: " + msg);
    } finally {
      setProcessingEdit(false);
    }
  }

  /* ---- Reject profile edit ---- */
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
        message: `Your edits were rejected. Reason: ${reason}`,
      });

      setProfileEdits((prev) => prev.filter((e) => e.id !== editId));
      setSelectedEdit(null);
      alert("Edits rejected.");
    } catch (err: any) {
      console.error("Error rejecting edit:", err, JSON.stringify(err || {}));
      const msg =
        err?.message ||
        err?.error_description ||
        "Unknown error rejecting edits.";
      alert("Error rejecting edits: " + msg);
    } finally {
      setProcessingEdit(false);
    }
  }

  /* ---- FULL DELETE OF THERAPIST / USER ---- */
  async function handleDeleteTherapist(row: TherapistRow) {
    if (!row.user_id || !row.id) {
      alert("Error: record missing user_id or therapistId.");
      return;
    }

    const confirmMessage = `WARNING: This action is irreversible.\n\nYou are about to permanently delete:\n\n- User: ${
      row.full_name || row.email || "unknown"
    }\n- Email: ${row.email || "not provided"}\n- ID: ${row.user_id}\n\nThis will remove:\n- Authentication account\n- Therapist profile\n- Personal data\n- Payment history\n- Pending edits\n- All notifications\n\nAre you absolutely sure?`;

    if (!confirm(confirmMessage)) return;

    // Second confirmation
    if (!confirm("Confirm again? This action cannot be undone!"))
      return;

    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");

    if (!backendUrl) {
      console.error("BACKEND_URL not configured");
      alert(
        "Configuration error: backend URL is not set.\n\nSet VITE_BACKEND_URL or NEXT_PUBLIC_BACKEND_URL in environment variables."
      );
      return;
    }

    console.log("Starting user deletion:", {
      userId: row.user_id,
      therapistId: row.id,
      backendUrl,
    });

    setDeleteBusyId(row.id);

    try {
      const res = await fetch(`${backendUrl}/admin/delete-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: row.user_id,
          therapistId: row.id,
        }),
      });

      console.log("Server response:", {
        status: res.status,
        ok: res.ok,
        statusText: res.statusText,
      });

      const contentType = res.headers.get("content-type") || "";
      let payload: any = null;

      if (contentType.includes("application/json")) {
        try {
          payload = await res.json();
          console.log("Payload received:", payload);
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
      } else {
        const text = await res.text().catch(() => "");
        console.warn("Non-JSON response received:", text.substring(0, 200));
      }

      if (!res.ok) {
        const errorMsg =
          payload?.error ||
          `HTTP error ${res.status}: ${res.statusText}`;
        console.error("Request failed:", errorMsg);
        alert(`Error deleting user:\n\n${errorMsg}`);
        return;
      }

      if (payload && payload.ok === false) {
        console.error("Backend returned ok=false:", payload.error);
        alert(`Error deleting:\n\n${payload.error || "Unknown error"}`);
        return;
      }

      // Success - remove from local list
      console.log("User deleted successfully");
      setAllRows((prev) => prev.filter((u) => u.id !== row.id));
      setRows((prev) => prev.filter((u) => u.id !== row.id));

      alert(
        `User ${row.full_name || row.email} was permanently deleted from the system.`
      );
    } catch (err: any) {
      console.error("Delete request error:", err);
      alert(
        `Error deleting user:\n\n${err.message || "Server connection error"}`
      );
    } finally {
      setDeleteBusyId(null);
    }
  }

  /* ---- Empty states ---- */

  const emptyState = useMemo(
    () =>
      !loading &&
      !error &&
      rows.length === 0 &&
      activeTab === "approvals" && (
        <p className="muted">No pending approvals.</p>
      ),
    [loading, error, rows.length, activeTab]
  );

  const emptyAllState = useMemo(
    () =>
      !loading &&
      !error &&
      allRows.length === 0 &&
      activeTab === "all" && (
        <p className="muted">No professionals registered yet.</p>
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
          <p className="muted">No pending edits at the moment.</p>
        </div>
      ),
    [loading, error, profileEdits.length, activeTab]
  );

  if (isAdmin === false) {
    return (
      <div className="admin-shell">
        <h1 className="title">Admin Panel</h1>
        <p className="muted">You do not have permission to access this page.</p>
      </div>
    );
  }

  const openProfile = (row: TherapistRow) => {
    const profileId = row.user_id || row.id;
    window.open(`/therapist/${profileId}`, "_blank");
  };

  return (
    <div className="admin-shell">
      <h1 className="title">Admin Dashboard</h1>
      <p className="subtitle">
        Manage approvals, edits, profiles, and deletions.
      </p>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "approvals" ? "active" : ""}`}
          onClick={() => setActiveTab("approvals")}
        >
          <User size={18} />
          New Registrations
          {rows.length > 0 && <span className="badge">{rows.length}</span>}
        </button>
        <button
          className={`admin-tab ${activeTab === "edits" ? "active" : ""}`}
          onClick={() => setActiveTab("edits")}
        >
          <Edit size={18} />
          Profile Edits
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

      {/* Update button */}
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

      {/* APPROVALS */}
      {activeTab === "approvals" && (
        <>
          {loading ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
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
                    <th>Email</th>
                    <th>Location</th>
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
                        : "N/A";
                    const nome = r.full_name || "N/A";
                    const loc = r.location || "N/A";
                    const isBusy = busy === r.id;
                    const isDeleting = deleteBusyId === r.id;

                    return (
                      <tr key={r.id}>
                        <td className="bold">{nome}</td>
                        <td className="muted">{r.email || "N/A"}</td>
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
                              View docs
                            </button>
                          )}
                        </td>
                        <td className="actions">
                          <button
                            className="btn"
                            onClick={() => openProfile(r)}
                            disabled={isBusy || isDeleting}
                          >
                            <ExternalLink size={14} />
                            Profile
                          </button>
                          <button
                            className="btn btn-approve"
                            onClick={() => moderate(r.id, "approve")}
                            disabled={isBusy || isDeleting}
                            aria-busy={isBusy}
                          >
                            {isBusy ? "..." : "Approve"}
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => moderate(r.id, "reject")}
                            disabled={isBusy || isDeleting}
                          >
                            Reject
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => handleDeleteTherapist(r)}
                            disabled={isDeleting || isBusy}
                          >
                            <Trash2 size={14} />
                            {isDeleting ? "Deleting..." : "Delete"}
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

      {/* ALL PROFESSIONALS */}
      {activeTab === "all" && (
        <>
          {loading ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Location</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Created</th>
                    <th className="col-actions">Actions</th>
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
                    <th>Email</th>
                    <th>Location</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Created</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allRows.map((r) => {
                    const when =
                      r.created_at || r.updated_at
                        ? new Date(
                            r.created_at || (r.updated_at as string)
                          ).toLocaleString()
                        : "N/A";
                    const nome = r.full_name || "N/A";
                    const loc = r.location || "N/A";
                    const isDeleting = deleteBusyId === r.id;

                    return (
                      <tr key={r.id}>
                        <td className="bold">{nome}</td>
                        <td className="muted">{r.email || "N/A"}</td>
                        <td className="muted">{loc}</td>
                        <td>
                          <PlanBadge plan={r.plan} planName={r.plan_name} />
                        </td>
                        <td>
                          <span className={`status-pill status-${r.status}`}>
                            {r.status || "N/A"}
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
                            disabled={isDeleting}
                          >
                            <ExternalLink size={14} />
                            View profile
                          </button>
                          <button
                            className="btn btn-reject"
                            onClick={() => handleDeleteTherapist(r)}
                            disabled={isDeleting}
                          >
                            <Trash2 size={14} />
                            {isDeleting ? "Deleting..." : "Delete"}
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

      {/* PROFILE EDITS */}
      {activeTab === "edits" && (
        <>
          {loading ? (
            <div className="edits-loading">
              <Clock size={32} style={{ opacity: 0.3 }} />
              <p>Loading edits...</p>
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
                        {edit.therapist?.full_name || "Therapist"}
                      </h3>
                      <p className="edit-meta">
                        <span>
                          Submitted:{" "}
                          {new Date(edit.submitted_at).toLocaleString("en-US")}
                        </span>
                        <span>ID: {edit.therapist_id.slice(0, 8)}...</span>
                      </p>
                    </div>
                    <span className="status-badge pending">
                      <Clock size={14} />
                      Pending
                    </span>
                  </div>
                  <div className="edit-card-actions">
                    <button
                      className="btn btn-ghost"
                      onClick={() => setSelectedEdit(edit)}
                    >
                      <Eye size={16} />
                      Review
                    </button>
                    <button
                      className="btn btn-approve"
                      onClick={() =>
                        confirm("Approve these edits?") &&
                        approveProfileEdit(edit.id)
                      }
                      disabled={processingEdit}
                    >
                      <CheckCircle size={16} />
                      Approve
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => setSelectedEdit(edit)}
                      disabled={processingEdit}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Edit review modal */}
      {selectedEdit && (
        <EditReviewModal
          edit={selectedEdit}
          onClose={() => setSelectedEdit(null)}
          onApprove={approveProfileEdit}
          onReject={rejectProfileEdit}
          processing={processingEdit}
        />
      )}

      {/* Documents modal */}
      {selectedTherapist && (
        <ApprovalDocsModal
          therapist={selectedTherapist}
          onClose={() => setSelectedTherapist(null)}
        />
      )}
    </div>
  );
}




