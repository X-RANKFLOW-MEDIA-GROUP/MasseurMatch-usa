import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Dashboard | MasseurMatch',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  // Get current user session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login?redirectTo=/dashboard');
  }

  // Get user's therapist profiles/ads
  const { data: ads, error } = await supabase
    .from('therapists')
    .select('user_id, slug, display_name, headline, city, state, status, plan, profile_photo, created_at, updated_at, zip_code')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MasseurMatch
              </Link>
              <span className="text-slate-400 text-sm">Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/explore" className="text-slate-300 hover:text-white transition-colors">
                Explore
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Listings</h1>
                <p className="text-slate-400">Manage your therapist profiles</p>
              </div>
              <Link
                href="/dashboard/ads/new"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all"
              >
                + Create New Listing
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400">Error loading listings: {error.message}</p>
              </div>
            )}

            {/* Empty State */}
            {!ads || ads.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white">No listings yet</h3>
                  <p className="text-slate-400">Create your first listing to start connecting with clients.</p>
                  <Link
                    href="/dashboard/ads/new"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all mt-4"
                  >
                    Create Your First Listing
                  </Link>
                </div>
              </div>
            ) : (
              /* Ads List */
              <div className="space-y-4">
                {ads.map((ad) => (
                  <div
                    key={ad.user_id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {ad.profile_photo && (
                          <img
                            src={ad.profile_photo}
                            alt={ad.display_name ?? "Profile photo"}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{ad.display_name}</h3>
                          <p className="text-slate-400 text-sm">
                            masseurmatch.com/therapist/{ad.slug}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          ad.status === 'active'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : ad.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {ad.status === 'active' ? 'Online' : ad.status === 'pending' ? 'Pending' : 'Deactivated'}
                      </span>
                    </div>

                    {ad.headline && (
                      <p className="text-slate-300 mb-4">{ad.headline}</p>
                    )}

                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <span className="text-slate-400">
                        City: {ad.city}, {ad.state} {ad.zip_code}
                      </span>
                      <span className="text-slate-400">
                        Plan: <span className="text-purple-400 font-semibold">{ad.plan || 'Free'}</span>
                      </span>
                      <span className="text-slate-400">
                        Updated: {ad.updated_at ? new Date(ad.updated_at).toLocaleDateString() : "N/A"}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                      <Link
                        href={`/therapist/${ad.slug}`}
                        target="_blank"
                        className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Public Profile
                      </Link>
                      <Link
                        href={`/dashboard/ads/${ad.user_id}/edit`}
                        className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Listing
                      </Link>
                      <Link
                        href={`/dashboard/ads/${ad.user_id}/edit/photos`}
                        className="px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Manage Photos
                      </Link>
                      <Link
                        href={`/dashboard/ads/${ad.user_id}/stats`}
                        className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        View Stats
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Help</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-purple-400 font-medium mb-2">How do I edit my listing?</h4>
                  <p className="text-slate-400 text-sm">Click the "Edit" button on your listing card to update your information.</p>
                </div>
                <div>
                  <h4 className="text-purple-400 font-medium mb-2">How do I add photos?</h4>
                  <p className="text-slate-400 text-sm">Click the "Photos" button to upload and manage your profile photos.</p>
                </div>
                <div>
                  <h4 className="text-purple-400 font-medium mb-2">What does "Pending" mean?</h4>
                  <p className="text-slate-400 text-sm">Your listing is under review. It will be live once approved by our team.</p>
                </div>
                <div>
                  <h4 className="text-purple-400 font-medium mb-2">How do I upgrade my plan?</h4>
                  <p className="text-slate-400 text-sm">Contact our support team to discuss premium plan options.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

