import { createServerSupabaseClient } from '@/lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'My Ads | Dashboard',
  robots: { index: false, follow: false },
};

export default async function AdsPage() {
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  // Get user's therapist profiles/ads
  const { data: ads, error } = await supabase
    .from('therapists')
    .select('user_id, slug, display_name, headline, city, state, status, plan, created_at, updated_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="ads-page">
      <div className="page-header">
        <h1>My Ads</h1>
        <Link href="/dashboard/ads/new" className="btn-primary">
          + Create New Ad
        </Link>
      </div>

      {error && (
        <div className="error-message">
          Error loading ads: {error.message}
        </div>
      )}

      {!ads || ads.length === 0 ? (
        <div className="empty-state">
          <p>You don't have any ads yet.</p>
          <Link href="/dashboard/ads/new" className="btn-primary">
            Create Your First Ad
          </Link>
        </div>
      ) : (
        <div className="ads-list">
          {ads.map((ad) => (
            <div key={ad.user_id} className="ad-card">
              <div className="ad-header">
                <h3>{ad.display_name}</h3>
                <span className={`status-badge status-${ad.status}`}>
                  {ad.status}
                </span>
              </div>

              <p className="ad-headline">{ad.headline}</p>

              <div className="ad-meta">
                <span>📍 {ad.city}, {ad.state}</span>
                <span>📦 {ad.plan || 'free'}</span>
                <span>🕒 Updated: {new Date(ad.updated_at).toLocaleDateString()}</span>
              </div>

              <div className="ad-actions">
                <Link href={`/therapist/${ad.slug}`} target="_blank">
                  👁️ View Public Profile
                </Link>
                <Link href={`/dashboard/ads/${ad.user_id}/edit`}>
                  ✏️ Edit
                </Link>
                <Link href={`/dashboard/ads/${ad.user_id}/edit/basic`}>
                  ⚙️ Edit Sections
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
