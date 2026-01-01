import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import { Users, FileText, AlertTriangle, DollarSign, TrendingUp, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Dashboard | MasseurMatch",
  robots: { index: false },
};

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login?redirect=/admin");
  }

  // In production, check if user is admin
  // const { data: profile } = await supabase
  //   .from("profiles")
  //   .select("role")
  //   .eq("id", session.user.id)
  //   .single();
  // if (profile?.role !== "admin") redirect("/dashboard");

  const stats = [
    { icon: Users, label: "Total Users", value: "12,453", change: "+12%" },
    { icon: FileText, label: "Active Listings", value: "3,847", change: "+5%" },
    { icon: DollarSign, label: "Revenue (MTD)", value: "$45,320", change: "+18%" },
    { icon: AlertTriangle, label: "Pending Reviews", value: "23", change: "-8%" },
  ];

  const recentActions = [
    { action: "New therapist registration", user: "john@example.com", time: "2 min ago" },
    { action: "Profile approved", user: "sarah@example.com", time: "15 min ago" },
    { action: "Report submitted", user: "mike@example.com", time: "1 hour ago" },
    { action: "Subscription upgraded", user: "lisa@example.com", time: "2 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5 bg-[#0a0a0f]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MasseurMatch Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin/edits" className="text-sm text-slate-400 hover:text-white transition-colors">
              Pending Edits
            </Link>
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
              Exit Admin
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-8 w-8 text-violet-400" />
                <span className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { href: "/admin/edits", label: "Review Edits", count: 23 },
                { href: "/admin/reports", label: "View Reports", count: 5 },
                { href: "/admin/users", label: "Manage Users", count: null },
                { href: "/admin/settings", label: "Settings", count: null },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center justify-between rounded-xl bg-white/5 p-4 hover:bg-white/10 transition-colors"
                >
                  <span className="text-white">{action.label}</span>
                  {action.count !== null && (
                    <span className="px-2 py-1 rounded-full text-xs bg-violet-600 text-white">
                      {action.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActions.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white">{item.action}</p>
                    <p className="text-sm text-slate-400">{item.user}</p>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
