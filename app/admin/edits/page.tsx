"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, X, Eye, ArrowLeft, Clock } from "lucide-react";

type PendingEdit = {
  id: string;
  user_id: string;
  user_email: string;
  display_name: string;
  field: string;
  old_value: string;
  new_value: string;
  submitted_at: string;
  status: "pending" | "approved" | "rejected";
};

export default function AdminEditsPage() {
  const [edits, setEdits] = useState<PendingEdit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const getStatusConfig = (status: PendingEdit["status"]) => {
    if (status === "approved") {
      return {
        icon: Check,
        label: "Approved",
        className: "bg-green-500/20 text-green-400",
      };
    }

    if (status === "rejected") {
      return {
        icon: X,
        label: "Rejected",
        className: "bg-red-500/20 text-red-400",
      };
    }

    return {
      icon: Clock,
      label: "Pending",
      className: "bg-yellow-500/20 text-yellow-400",
    };
  };

  useEffect(() => {
    async function fetchEdits() {
      // Mock data - in production fetch from Supabase
      const mockEdits: PendingEdit[] = [
        {
          id: "1",
          user_id: "u1",
          user_email: "john@example.com",
          display_name: "John Smith",
          field: "headline",
          old_value: "Licensed Massage Therapist",
          new_value: "Licensed Massage Therapist with 10+ years experience",
          submitted_at: "2025-01-01T10:00:00Z",
          status: "pending",
        },
        {
          id: "2",
          user_id: "u2",
          user_email: "sarah@example.com",
          display_name: "Sarah Johnson",
          field: "bio",
          old_value: "Professional massage services",
          new_value: "Professional massage services specializing in deep tissue and sports massage",
          submitted_at: "2025-01-01T09:30:00Z",
          status: "pending",
        },
        {
          id: "3",
          user_id: "u3",
          user_email: "mike@example.com",
          display_name: "Mike Wilson",
          field: "rate_60",
          old_value: "$80",
          new_value: "$100",
          submitted_at: "2025-01-01T08:00:00Z",
          status: "pending",
        },
      ];
      setEdits(mockEdits);
      setLoading(false);
    }
    fetchEdits();
  }, []);

  const handleAction = async (editId: string, action: "approve" | "reject") => {
    // In production, update via Supabase
    setEdits(edits.map(edit =>
      edit.id === editId
        ? { ...edit, status: action === "approve" ? "approved" : "rejected" }
        : edit
    ));
  };

  const filteredEdits = edits.filter(edit =>
    filter === "all" ? true : edit.status === filter
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 bg-[#0a0a0f]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            MasseurMatch Admin
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Pending Edits</h1>
          <div className="flex gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-white text-white"
                    : "bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredEdits.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-slate-400">No {filter !== "all" ? filter : ""} edits found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEdits.map((edit) => {
              const statusConfig = getStatusConfig(edit.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={edit.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{edit.display_name}</h3>
                      <p className="text-sm text-slate-400">{edit.user_email}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4" />
                      {new Date(edit.submitted_at).toLocaleString()}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white/5 p-4 mb-4">
                    <p className="text-xs text-slate-500 mb-2">Field: <span className="text-white">{edit.field}</span></p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Current Value</p>
                        <p className="text-slate-300 bg-red-500/10 p-2 rounded">{edit.old_value}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">New Value</p>
                        <p className="text-slate-300 bg-green-500/10 p-2 rounded">{edit.new_value}</p>
                      </div>
                    </div>
                  </div>

                  {edit.status === "pending" ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAction(edit.id, "approve")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(edit.id, "reject")}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                      <Link
                        href={`/therapist/${edit.user_id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors ml-auto"
                      >
                        <Eye className="h-4 w-4" />
                        View Profile
                      </Link>
                    </div>
                  ) : (
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusConfig.className}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {statusConfig.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
