import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: 'Edit Ad | Dashboard',
  robots: { index: false, follow: false },
};

export default async function EditAdPage({
  params,
}: {
  params: { adId: string };
}) {
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Get therapist profile
  const { data: therapist, error } = await supabase
    .from('therapists')
    .select('*')
    .eq('user_id', params.adId)
    .single();

  // Check authorization
  if (!therapist || therapist.user_id !== session.user.id) {
    redirect('/dashboard/ads');
  }

  // Define sections matching MasseurFinder structure
  const sections = [
    { slug: 'basic', name: 'Basic Settings', icon: '⚙️' },
    { slug: 'location', name: 'Location', icon: '📍' },
    { slug: 'services', name: 'Your Services', icon: '💆' },
    { slug: 'text', name: 'Name / Headline / Text', icon: '📝' },
    { slug: 'rates', name: 'Rates & Payment', icon: '💰' },
    { slug: 'hours', name: 'Hours', icon: '🕐' },
    { slug: 'contact', name: 'Contact Info', icon: '📞' },
    { slug: 'links', name: 'Links', icon: '🔗' },
    { slug: 'misc', name: 'Professional Development / Misc', icon: '🎓' },
    { slug: 'photos', name: 'Photos', icon: '📸' },
  ];

  return (
    <div className="edit-ad-page">
      <div className="page-header">
        <h1>Edit Ad: {therapist.display_name}</h1>
        <div className="header-actions">
          <Link href={`/therapist/${therapist.slug}`} target="_blank">
            👁️ View Public Profile
          </Link>
          <Link href="/dashboard/ads">← Back to Ads</Link>
        </div>
      </div>

      <div className="ad-status">
        <span className={`status-badge status-${therapist.status}`}>
          {therapist.status}
        </span>
        {therapist.status === 'pending' && (
          <p className="status-message">
            Your ad is pending review. It will be visible once approved.
          </p>
        )}
      </div>

      <div className="edit-sections">
        <h2>Edit Sections</h2>
        <p className="section-description">
          Click on any section below to edit that part of your profile.
        </p>

        <div className="sections-grid">
          {sections.map((section) => (
            <Link
              key={section.slug}
              href={`/dashboard/ads/${params.adId}/edit/${section.slug}`}
              className="section-card"
            >
              <span className="section-icon">{section.icon}</span>
              <span className="section-name">{section.name}</span>
              <span className="section-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn">
            📤 Publish Ad
          </button>
          <button className="action-btn">
            ⏸️ Pause Ad
          </button>
          <button className="action-btn danger">
            🗑️ Delete Ad
          </button>
        </div>
      </div>
    </div>
  );
}
