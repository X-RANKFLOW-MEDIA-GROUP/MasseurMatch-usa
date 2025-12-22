import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: 'Favorites | Dashboard',
  robots: { index: false, follow: false },
};

export default async function FavoritesPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  // TODO: Create favorites table and fetch user's favorites
  // For now, showing placeholder

  const favorites: any[] = []; // Replace with actual query

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">⭐</p>
          <h2>No favorites yet</h2>
          <p>
            Browse therapist profiles and click the star icon to add them to your favorites.
          </p>
          <Link href="/" className="btn-primary">
            Browse Therapists
          </Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="favorite-card">
              {favorite.profile_photo && (
                <img src={favorite.profile_photo} alt={favorite.display_name} />
              )}
              <h3>{favorite.display_name}</h3>
              <p className="headline">{favorite.headline}</p>
              <div className="meta">
                <span>⭐ {favorite.rating}</span>
                <span>📍 {favorite.city}, {favorite.state}</span>
              </div>
              <div className="actions">
                <Link href={`/therapist/${favorite.slug}`}>View Profile</Link>
                <button className="btn-danger-sm">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="favorites-info">
        <h2>About Favorites</h2>
        <p>
          Save therapists to your favorites list to easily find them later. Your favorites are
          private and only visible to you.
        </p>
      </div>
    </div>
  );
}
