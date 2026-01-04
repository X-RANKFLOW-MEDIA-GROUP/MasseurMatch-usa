import { createServerSupabaseClient } from "@/src/lib/supabase-server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Get therapist profile if exists
  const { data: profile } = await supabase
    .from("therapists")
    .select("*")
    .eq("user_id", session?.user.id)
    .single();

  const hasProfile = !!profile;

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-8">
        Welcome back, {session?.user.email}
      </p>

      {!hasProfile ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 mb-8">
          <h2 className="text-xl font-semibold text-white mb-2">
            Complete Your Profile
          </h2>
          <p className="text-slate-400 mb-6">
            Create your therapist profile to start receiving clients.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex rounded-xl bg-white px-6 py-3 font-medium text-white hover:bg-neutral-200 transition-colors"
          >
            Create Profile
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {profile.display_name || profile.full_name}
                </h3>
                <p className="text-sm text-slate-400">
                  {profile.city}, {profile.state}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profile.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {profile.status || "pending"}
              </span>
              <span className="text-sm text-slate-400">
                ⭐ {profile.rating || "0"} rating
              </span>
            </div>
            <Link
              href="/dashboard/profile"
              className="text-sm text-white hover:text-neutral-300"
            >
              Edit Profile →
            </Link>
          </div>

          {/* Stats Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Profile Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Inquiries</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{profile.plan || "Free"}</p>
                <p className="text-sm text-slate-400">Plan</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/therapist/${profile.slug}`}
                target="_blank"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              >
                👁️ View Public Profile
              </Link>
              <Link
                href="/dashboard/availability"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              >
                📅 Set Availability
              </Link>
              <Link
                href="/dashboard/gallery"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              >
                📸 Upload Photos
              </Link>
              <Link
                href="/dashboard/billing"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
              >
                💳 Upgrade Plan
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
