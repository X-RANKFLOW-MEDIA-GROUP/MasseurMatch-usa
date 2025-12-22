'use client';

type Therapist = {
  user_id: string;
  slug: string;
  display_name: string;
  full_name: string;
  headline: string;
  about: string;
  philosophy?: string;
  city: string;
  state: string;
  neighborhood?: string;
  phone: string;
  email: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  rating: number;
  override_reviews_count?: number;
  profile_photo?: string;
  gallery?: string[];
  services?: string[];
  massage_techniques?: string[];
  studio_amenities?: string[];
  rate_60?: string;
  rate_90?: string;
  rate_outcall?: string;
  payment_methods?: string[];
  availability?: Record<string, { available: boolean; hours: string }>;
  years_experience?: number;
  languages?: string[];
  degrees?: string;
  affiliations?: string[];
};

type Props = {
  therapist: Therapist;
};

export default function TherapistProfile({ therapist }: Props) {
  return (
    <div className="therapist-profile">
      {/* Header Section */}
      <header className="profile-header">
        <div className="profile-photo-container">
          {therapist.profile_photo && (
            <img
              src={therapist.profile_photo}
              alt={therapist.display_name}
              className="profile-photo"
            />
          )}
        </div>

        <div className="header-info">
          <h1>{therapist.headline}</h1>
          <p className="name">{therapist.display_name}</p>

          <div className="factoids">
            <div className="factoid">
              📍 Based in {therapist.city}, {therapist.state}
              {therapist.neighborhood && ` (${therapist.neighborhood})`}
            </div>
            <div className="factoid">
              ⭐ {therapist.rating} ({therapist.override_reviews_count || 0} reviews)
            </div>
            {therapist.years_experience && (
              <div className="factoid">
                🎓 {therapist.years_experience} years experience
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Overview Section */}
      <section className="overview">
        <h2>Overview</h2>
        <p>{therapist.about}</p>
        {therapist.philosophy && (
          <>
            <h3>Philosophy</h3>
            <p>{therapist.philosophy}</p>
          </>
        )}
      </section>

      {/* Services Section */}
      {therapist.services && therapist.services.length > 0 && (
        <section className="services">
          <h2>Services</h2>
          <ul className="service-list">
            {therapist.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Massage Techniques */}
      {therapist.massage_techniques && therapist.massage_techniques.length > 0 && (
        <section className="techniques">
          <h2>Massage Techniques</h2>
          <div className="tag-list">
            {therapist.massage_techniques.map((technique) => (
              <span key={technique} className="tag">
                {technique}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Pricing */}
      {(therapist.rate_60 || therapist.rate_90 || therapist.rate_outcall) && (
        <section className="pricing">
          <h2>Pricing</h2>
          <div className="price-list">
            {therapist.rate_60 && (
              <div className="price-item">
                <span>60 minutes:</span> <strong>{therapist.rate_60}</strong>
              </div>
            )}
            {therapist.rate_90 && (
              <div className="price-item">
                <span>90 minutes:</span> <strong>{therapist.rate_90}</strong>
              </div>
            )}
            {therapist.rate_outcall && (
              <div className="price-item">
                <span>Outcall:</span> <strong>{therapist.rate_outcall}</strong>
              </div>
            )}
          </div>
          {therapist.payment_methods && therapist.payment_methods.length > 0 && (
            <p className="payment-methods">
              Accepts: {therapist.payment_methods.join(', ')}
            </p>
          )}
        </section>
      )}

      {/* Availability */}
      {therapist.availability && (
        <section className="availability">
          <h2>Availability</h2>
          <div className="schedule">
            {Object.entries(therapist.availability).map(([day, info]) => (
              <div key={day} className="schedule-day">
                <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                <span className="hours">
                  {info.available ? info.hours : 'Closed'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Amenities */}
      {therapist.studio_amenities && therapist.studio_amenities.length > 0 && (
        <section className="amenities">
          <h2>Studio Amenities</h2>
          <ul className="amenity-list">
            {therapist.studio_amenities.map((amenity) => (
              <li key={amenity}>✓ {amenity}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Gallery */}
      {therapist.gallery && therapist.gallery.length > 0 && (
        <section className="gallery">
          <h2>Gallery</h2>
          <div className="gallery-grid">
            {therapist.gallery.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`${therapist.display_name} gallery ${index + 1}`}
                className="gallery-photo"
              />
            ))}
          </div>
        </section>
      )}

      {/* Qualifications */}
      {(therapist.degrees || (therapist.affiliations && therapist.affiliations.length > 0)) && (
        <section className="qualifications">
          <h2>Qualifications</h2>
          {therapist.degrees && <p>{therapist.degrees}</p>}
          {therapist.affiliations && therapist.affiliations.length > 0 && (
            <ul className="affiliations">
              {therapist.affiliations.map((affiliation) => (
                <li key={affiliation}>{affiliation}</li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Languages */}
      {therapist.languages && therapist.languages.length > 0 && (
        <section className="languages">
          <h2>Languages</h2>
          <p>{therapist.languages.join(', ')}</p>
        </section>
      )}

      {/* Contact */}
      <section className="contact">
        <h2>Contact</h2>
        <div className="contact-info">
          <div className="contact-item">
            <span>📞 Phone:</span> <a href={`tel:${therapist.phone}`}>{therapist.phone}</a>
          </div>
          <div className="contact-item">
            <span>📧 Email:</span> <a href={`mailto:${therapist.email}`}>{therapist.email}</a>
          </div>
          {therapist.website && (
            <div className="contact-item">
              <span>🌐 Website:</span>{' '}
              <a href={therapist.website} target="_blank" rel="noopener noreferrer">
                {therapist.website}
              </a>
            </div>
          )}
          {therapist.instagram && (
            <div className="contact-item">
              <span>📸 Instagram:</span>{' '}
              <a
                href={`https://instagram.com/${therapist.instagram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {therapist.instagram}
              </a>
            </div>
          )}
          {therapist.whatsapp && (
            <div className="contact-item">
              <span>💬 WhatsApp:</span>{' '}
              <a href={`https://wa.me/${therapist.whatsapp.replace(/\D/g, '')}`}>
                {therapist.whatsapp}
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
