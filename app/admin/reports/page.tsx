"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Flag,
  Search,
  AlertTriangle,
  Check,
  X,
  Eye,
  User,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Ban,
  MessageSquare,
} from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";

type Report = {
  id: string;
  reporter_id: string;
  reported_user_id: string;
  reason: string;
  description: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  created_at: string;
  reporter_name?: string;
  reported_name?: string;
};

export default function AdminReportsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchReports();
    }
  }, [currentPage, filterStatus]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/admin/reports");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (profile?.role !== "admin") {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
    fetchReports();
  };

  const fetchReports = async () => {
    let query = supabase
      .from("reports")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;
    query = query.range(start, end);

    const { data, count, error } = await query;

    if (data) {
      setReports(data);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    }
  };

  const handleResolveReport = async (reportId: string, action: "resolved" | "dismissed") => {
    setActionLoading(true);

    const { error } = await supabase
      .from("reports")
      .update({
        status: action,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", reportId);

    setActionLoading(false);

    if (!error) {
      fetchReports();
      setSelectedReport(null);
    }
  };

  const handleSuspendReportedUser = async (userId: string, reportId: string) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;

    setActionLoading(true);

    // Suspend the user
    await supabase
      .from("profiles")
      .update({ status: "suspended", updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    // Resolve the report
    await supabase
      .from("reports")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", reportId);

    setActionLoading(false);
    fetchReports();
    setSelectedReport(null);
  };

  const getReasonLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      spam: "Spam",
      inappropriate: "Inappropriate Content",
      fake: "Fake Profile",
      harassment: "Harassment",
      fraud: "Fraud/Scam",
      other: "Other",
    };
    return reasons[reason] || reason;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      case "reviewed":
        return "bg-blue-500/20 text-blue-400";
      case "resolved":
        return "bg-green-500/20 text-green-400";
      case "dismissed":
        return "bg-slate-500/20 text-slate-400";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-200" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 bg-[#0a0a0f]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            MasseurMatch Admin
          </Link>
          <Link href="/admin" className="text-sm text-slate-400 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
            <p className="text-slate-400">Review and manage user reports</p>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 mb-6"
        >
          {["pending", "reviewed", "resolved", "dismissed", "all"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filterStatus === status
                  ? "bg-white text-white"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Reports List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          {reports.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <Flag className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No reports found</h3>
              <p className="text-slate-400">
                {filterStatus === "pending"
                  ? "No pending reports to review"
                  : `No ${filterStatus} reports`}
              </p>
            </div>
          ) : (
            reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-500/20">
                      <Flag className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {getReasonLabel(report.reason)}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-slate-400 mb-3">{report.description || "No description provided"}</p>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>Reported: {new Date(report.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Review
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Report Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0a0f] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Review Report</h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-slate-400 mb-1">Reason</p>
                <p className="text-white font-medium">{getReasonLabel(selectedReport.reason)}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-slate-400 mb-1">Description</p>
                <p className="text-white">{selectedReport.description || "No description provided"}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-slate-400 mb-1">Reported On</p>
                <p className="text-white">{new Date(selectedReport.created_at).toLocaleString()}</p>
              </div>
            </div>

            {selectedReport.status === "pending" && (
              <div className="space-y-2">
                <button
                  onClick={() => handleSuspendReportedUser(selectedReport.reported_user_id, selectedReport.id)}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Ban className="h-5 w-5" />
                  )}
                  Suspend Reported User
                </button>

                <button
                  onClick={() => handleResolveReport(selectedReport.id, "resolved")}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                  Mark as Resolved
                </button>

                <button
                  onClick={() => handleResolveReport(selectedReport.id, "dismissed")}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 transition-colors"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <X className="h-5 w-5" />
                  )}
                  Dismiss Report
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
