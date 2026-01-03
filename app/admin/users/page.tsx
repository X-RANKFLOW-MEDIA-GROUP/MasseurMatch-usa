"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Ban,
  Check,
  X,
} from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import Link from "next/link";

type User = {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  subscription_plan: string;
  identity_verified: boolean;
  role: string;
  status: string;
  created_at: string;
  city: string;
  state: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchUsers();
    }
  }, [currentPage, filterPlan, filterStatus, searchQuery]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/admin/users");
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
    fetchUsers();
  };

  const fetchUsers = async () => {
    let query = supabase
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filterPlan !== "all") {
      query = query.eq("subscription_plan", filterPlan);
    }

    if (filterStatus === "verified") {
      query = query.eq("identity_verified", true);
    } else if (filterStatus === "unverified") {
      query = query.eq("identity_verified", false);
    } else if (filterStatus === "suspended") {
      query = query.eq("status", "suspended");
    }

    if (searchQuery) {
      query = query.or(`display_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;
    query = query.range(start, end);

    const { data, count, error } = await query;

    if (data) {
      setUsers(data);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    }
  };

  const handleSuspendUser = async (userId: string) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;

    setActionLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ status: "suspended", updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    setActionLoading(false);

    if (!error) {
      fetchUsers();
      setSelectedUser(null);
    }
  };

  const handleReinstateUser = async (userId: string) => {
    setActionLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    setActionLoading(false);

    if (!error) {
      fetchUsers();
      setSelectedUser(null);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    setActionLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ identity_verified: true, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    setActionLoading(false);

    if (!error) {
      fetchUsers();
      setSelectedUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 bg-[#0a0a0f]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
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
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-slate-400">Manage all platform users</p>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-white placeholder:text-slate-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 py-2 px-4 text-white focus:border-violet-500 focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Plans</option>
              <option value="free" className="bg-slate-900">Free</option>
              <option value="standard" className="bg-slate-900">Standard</option>
              <option value="pro" className="bg-slate-900">Pro</option>
              <option value="elite" className="bg-slate-900">Elite</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 py-2 px-4 text-white focus:border-violet-500 focus:outline-none"
            >
              <option value="all" className="bg-slate-900">All Status</option>
              <option value="verified" className="bg-slate-900">Verified</option>
              <option value="unverified" className="bg-slate-900">Unverified</option>
              <option value="suspended" className="bg-slate-900">Suspended</option>
            </select>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-slate-400">Joined</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-violet-400" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.display_name || "No name"}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {user.city && user.state ? `${user.city}, ${user.state}` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.subscription_plan === "elite" ? "bg-amber-500/20 text-amber-400" :
                          user.subscription_plan === "pro" ? "bg-violet-500/20 text-violet-400" :
                          user.subscription_plan === "standard" ? "bg-blue-500/20 text-blue-400" :
                          "bg-slate-500/20 text-slate-400"
                        }`}>
                          {user.subscription_plan || "free"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {user.identity_verified ? (
                            <span className="flex items-center gap-1 text-green-400 text-sm">
                              <UserCheck className="h-4 w-4" />
                              Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-400 text-sm">
                              <UserX className="h-4 w-4" />
                              Unverified
                            </span>
                          )}
                          {user.status === "suspended" && (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
                              Suspended
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
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
        </motion.div>
      </main>

      {/* User Actions Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0a0f] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">User Actions</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-slate-400"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5">
                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{selectedUser.display_name || "No name"}</p>
                  <p className="text-sm text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`mailto:${selectedUser.email}`}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 text-white hover:bg-white/10 transition-colors"
              >
                <Mail className="h-5 w-5 text-slate-400" />
                Send Email
              </a>

              {!selectedUser.identity_verified && (
                <button
                  onClick={() => handleVerifyUser(selectedUser.user_id)}
                  disabled={actionLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Check className="h-5 w-5" />
                  )}
                  Manually Verify
                </button>
              )}

              {selectedUser.status === "suspended" ? (
                <button
                  onClick={() => handleReinstateUser(selectedUser.user_id)}
                  disabled={actionLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <UserCheck className="h-5 w-5" />
                  )}
                  Reinstate User
                </button>
              ) : (
                <button
                  onClick={() => handleSuspendUser(selectedUser.user_id)}
                  disabled={actionLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  {actionLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Ban className="h-5 w-5" />
                  )}
                  Suspend User
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
