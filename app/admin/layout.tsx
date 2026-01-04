"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/src/lib/supabase";
import {
  LayoutDashboard,
  Users,
  Flag,
  Settings,
  Shield,
  ChevronLeft,
  LogOut,
  Loader2,
} from "lucide-react";

const adminNav = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Reports", href: "/admin/reports", icon: Flag },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login?redirect=/admin");
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

    setIsAdmin(true);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-200" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-neutral-200" />
            <span className="text-xl font-bold text-white">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-white text-white"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
