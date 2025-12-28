'use client';

import { useEffect, useState } from 'react';
import { CityInfo } from '@/data/cityMap';
import { SegmentConfig } from '@/data/segmentConfig';
import { supabase } from '@/lib/supabase';

type Therapist = {
  user_id: string;
  slug: string;
  display_name: string;
  headline: string;
  city: string;
  state: string;
  rating: number;
  profile_photo?: string;
  services?: string[];
};

type Props = {
  city: CityInfo;
  segment: SegmentConfig | null;
};

export default function CityLandingPage({ city, segment }: Props) {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTherapists() {
      setLoading(true);

      // Base query: get therapists in this city
      let query = supabase
        .from('therapists')
        .select('user_id, slug, display_name, headline, city, state, rating, profile_photo, services')
        .ilike('city', city.name) // Case-insensitive match
        .eq('status', 'active')
        .order('rating', { ascending: false })
        .limit(50);

      // If segment filter is provided, filter by service
      if (segment) {
        // This assumes your services column contains the segment name
        // Adjust based on your actual database structure
        const serviceKeyword = segment.slug.replace(/-/g, ' ');
        query = query.contains('services', [serviceKeyword]);
      }

      const { data, error } = await query;

      if (!error && data) {
        setTherapists(data);
      }

      setLoading(false);
    }

    fetchTherapists();
  }, [city, segment]);

  return (
    <div className="city-landing-page">
      {/* Header */}
      <header className="header">
        <h1>
          {segment
            ? `${segment.slug.replace(/-/g, ' ')} in ${city.name}${city.state ? `, ${city.state}` : ''}`
            : `Massage Therapists in ${city.name}${city.state ? `, ${city.state}` : ''}`}
        </h1>
        {segment && (
          <p className="narrative">{segment.narrative(city.name)}</p>
        )}
      </header>

      {/* Stats */}
      <div className="stats">
        <p>
          {loading
            ? 'Loading...'
            : `Found ${therapists.length} therapist${therapists.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Therapist Grid */}
      {loading ? (
        <div className="loading">Loading therapists...</div>
      ) : therapists.length === 0 ? (
        <div className="no-results">
          <p>No therapists found in {city.name}{segment && ` for ${segment.slug.replace(/-/g, ' ')}`}.</p>
        </div>
      ) : (
        <div className="therapist-grid">
          {therapists.map((therapist) => (
            <a
              key={therapist.user_id}
              href={`/therapist/${therapist.slug}`}
              className="therapist-card"
            >
              {therapist.profile_photo && (
                <img
                  src={therapist.profile_photo}
                  alt={therapist.display_name}
                  className="profile-photo"
                />
              )}
              <h3>{therapist.display_name}</h3>
              <p className="headline">{therapist.headline}</p>
              <div className="meta">
                <span>⭐ {therapist.rating}</span>
                <span>📍 {therapist.city}, {therapist.state}</span>
              </div>
              {therapist.services && therapist.services.length > 0 && (
                <div className="services">
                  {therapist.services.slice(0, 3).map((service) => (
                    <span key={service} className="service-badge">
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}

      {/* Neighboring Cities */}
      {city.neighbors && city.neighbors.length > 0 && (
        <div className="neighbors">
          <h2>Nearby Areas</h2>
          <div className="neighbor-links">
            {city.neighbors.map((neighborSlug) => (
              <a key={neighborSlug} href={`/city/${neighborSlug}`}>
                {neighborSlug.replace(/-/g, ' ')}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
