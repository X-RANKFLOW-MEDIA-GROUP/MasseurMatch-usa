"use client";

import { useMemo } from "react";
import "./TherapistProfile.css";
import type { TherapistRecord } from "@/app/therapist/[slug]/data";

function asArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v) => typeof v === "string") as string[];
  if (val == null) return [];
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed.filter((v) => typeof v === "string");
    } catch {}
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function parseAvailability(av: any): { day: string; incall: string; outcall: string }[] {
  if (!av || typeof av !== "object") return [];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const result: { day: string; incall: string; outcall: string }[] = [];

  for (const day of Object.keys(av)) {
    const info = av[day] || {};
    const incall = info.incall || {};
    const outcall = info.outcall || {};

    const incallStr = incall.start && incall.end ? `${incall.start} - ${incall.end}` : "Closed";
    const outcallStr = outcall.start && outcall.end ? `${outcall.start} - ${outcall.end}` : "Closed";

    result.push({
      day: dayNames[parseInt(day)] || day,
      incall: incallStr,
      outcall: outcallStr,
    });
  }

  return result;
}

export default function PublicTherapistProfile({ therapist }: { therapist: TherapistRecord }) {
  const displayName = therapist.display_name || therapist.full_name || "Therapist";
  const city = therapist.city || "";
  const state = therapist.state || "";
  const locationCityState = [city, state].filter(Boolean).join(", ");
  const headline = therapist.headline || "Professional Massage Therapist";
  const about = therapist.about || "";
  const profilePhoto = therapist.profile_photo || "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1600&auto=format&fit=crop";
  const services = asArray(therapist.services);
  const techniques = asArray(therapist.massage_techniques);
  const languages = asArray(therapist.languages);
  const rating = therapist.rating || 4.5;
  const reviewCount = therapist.override_reviews_count || 0;
  const availability = parseAvailability(therapist.availability);
  const activePromotions = therapist.active_promotions || [];
  const availabilityStatus = therapist.availability_status || 'offline';

  const roundedRating = Math.round(rating);

  // Travel information
  const isVisiting = availabilityStatus === 'visiting_now' || availabilityStatus === 'visiting_soon';
  const travelLocation = isVisiting && therapist.travel_city
    ? `${therapist.travel_city}${therapist.travel_state ? `, ${therapist.travel_state}` : ''}`
    : null;

  // Format travel dates
  const formatTravelDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Availability status configuration
  const statusConfig = {
    available: {
      label: 'Available Now',
      color: '#10b981',
      shadowColor: 'rgba(16, 185, 129, 0.3)',
      icon: '✓'
    },
    visiting_now: {
      label: travelLocation ? `Visiting ${travelLocation}` : 'Visiting Now',
      color: '#3b82f6',
      shadowColor: 'rgba(59, 130, 246, 0.3)',
      icon: '📍'
    },
    visiting_soon: {
      label: travelLocation ? `Visiting ${travelLocation} Soon` : 'Visiting Soon',
      color: '#f59e0b',
      shadowColor: 'rgba(245, 158, 11, 0.3)',
      icon: '🗓️'
    },
    offline: {
      label: 'Currently Offline',
      color: '#6b7280',
      shadowColor: 'rgba(107, 114, 128, 0.3)',
      icon: '○'
    }
  };

  const currentStatus = statusConfig[availabilityStatus];

  const mapQuery = useMemo(() => {
    const parts: string[] = [];
    if (therapist.address) parts.push(therapist.address);
    if (locationCityState) parts.push(locationCityState);
    if (therapist.zip_code) parts.push(therapist.zip_code);
    return parts.join(", ").trim();
  }, [therapist.address, locationCityState, therapist.zip_code]);

  const mapEmbedSrc = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`
    : undefined;

  const mapDirectionsHref = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
    : undefined;

  // Mock stats for now (can be replaced with real data later)
  const stats = {
    years: "15.9",
    profileViews: "166k",
    impressions: "3.8M",
    contactClicks: "89"
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      {/* Hero Section */}
      <section style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "4rem 1.5rem",
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "3rem",
        alignItems: "start"
      }}>
        {/* Left Column - Profile Image & Stats */}
        <div style={{ position: "sticky", top: "2rem" }}>
          {/* Availability Status Badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: currentStatus.color,
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "999px",
            fontSize: "0.875rem",
            fontWeight: "500",
            marginBottom: "1.5rem",
            boxShadow: `0 4px 12px ${currentStatus.shadowColor}`
          }}>
            <span style={{ fontSize: "1rem" }}>{currentStatus.icon}</span>
            {currentStatus.label}
          </div>

          {/* Profile Photo with Availability Border */}
          <div style={{
            position: "relative",
            borderRadius: "1.5rem",
            overflow: "hidden",
            border: `4px solid ${currentStatus.color}`,
            boxShadow: `0 20px 50px ${currentStatus.shadowColor}`,
            marginBottom: "2rem",
            transition: "all 0.3s ease"
          }}>
            <img
              src={profilePhoto}
              alt={`${displayName} profile`}
              style={{
                width: "100%",
                aspectRatio: "3/4",
                objectFit: "cover"
              }}
            />
          </div>

          {/* Rating */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              fontSize: "2rem",
              marginBottom: "0.5rem",
              color: "#fbbf24"
            }}>
              {"★".repeat(roundedRating)}{"☆".repeat(5 - roundedRating)}
            </div>
            <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937" }}>
              {rating.toFixed(1)}/5
            </div>
            {reviewCount > 0 && (
              <div style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.25rem" }}>
                Based on {reviewCount} reviews
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
            marginBottom: "2rem"
          }}>
            {[
              { label: "Years", value: stats.years },
              { label: "Profile Views", value: stats.profileViews },
              { label: "Impressions", value: stats.impressions },
              { label: "Contact Clicks", value: stats.contactClicks }
            ].map((stat) => (
              <div key={stat.label} style={{
                background: "white",
                padding: "1rem",
                borderRadius: "0.75rem",
                border: "1px solid #e5e7eb",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Location & Languages */}
          <div style={{
            background: "white",
            padding: "1.25rem",
            borderRadius: "0.75rem",
            border: "1px solid #e5e7eb",
            marginBottom: "1rem"
          }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
              📍 {locationCityState || "Location not specified"}
            </div>
            {languages.length > 0 && (
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                🗣️ {languages.join(", ")}
              </div>
            )}
          </div>

          {/* Travel Info (when visiting) */}
          {isVisiting && travelLocation && therapist.travel_start_date && therapist.travel_end_date && (
            <div style={{
              background: currentStatus.color,
              color: "white",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              marginBottom: "1rem",
              boxShadow: `0 4px 12px ${currentStatus.shadowColor}`
            }}>
              <div style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "0.5rem", opacity: 0.9 }}>
                {availabilityStatus === 'visiting_now' ? 'Currently In' : 'Visiting Soon'}
              </div>
              <div style={{ fontSize: "1.125rem", fontWeight: "700", marginBottom: "0.75rem" }}>
                {travelLocation}
              </div>
              <div style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                {formatTravelDate(therapist.travel_start_date)} - {formatTravelDate(therapist.travel_end_date)}
              </div>
            </div>
          )}

          {/* Primary CTA */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {therapist.phone && (
              <a
                href={`tel:${therapist.phone}`}
                style={{
                  background: "#000",
                  color: "white",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  textAlign: "center",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Book a Session
              </a>
            )}
            <button
              style={{
                background: "white",
                color: "#000",
                padding: "1rem",
                borderRadius: "0.75rem",
                border: "2px solid #e5e7eb",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f9fafb";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "white";
                e.currentTarget.style.borderColor = "#e5e7eb";
              }}
            >
              View Pricing
            </button>
          </div>
        </div>

        {/* Right Column - Content */}
        <div>
          {/* Header */}
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "#1f2937",
            marginBottom: "0.5rem",
            lineHeight: "1.2"
          }}>
            {displayName}
          </h1>
          <p style={{
            fontSize: "1.5rem",
            color: "#6b7280",
            marginBottom: "2rem",
            fontWeight: "300"
          }}>
            {headline}
          </p>

          {/* Weekly Promotions */}
          {activePromotions.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              {activePromotions.map((promo) => (
                <div
                  key={promo.id}
                  style={{
                    background: `linear-gradient(135deg, ${promo.badge_color || '#ef4444'} 0%, ${promo.badge_color || '#dc2626'} 100%)`,
                    color: "white",
                    padding: "1.5rem 2rem",
                    borderRadius: "1rem",
                    marginBottom: "1rem",
                    boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  {/* Decorative element */}
                  <div style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "100px",
                    height: "100px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%"
                  }}></div>

                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                      <span style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        padding: "0.5rem 1rem",
                        borderRadius: "999px",
                        fontSize: "0.875rem",
                        fontWeight: "700",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                      }}>
                        {promo.discount_text || "SPECIAL OFFER"}
                      </span>
                      <span style={{ fontSize: "0.875rem", opacity: 0.9 }}>
                        ⏰ Ends {new Date(promo.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      marginBottom: "0.5rem"
                    }}>
                      {promo.title}
                    </h3>
                    {promo.description && (
                      <p style={{
                        fontSize: "1rem",
                        opacity: 0.95,
                        lineHeight: "1.5"
                      }}>
                        {promo.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bio */}
          <div style={{
            background: "white",
            padding: "2rem",
            borderRadius: "1rem",
            border: "1px solid #e5e7eb",
            marginBottom: "2rem",
            lineHeight: "1.7",
            color: "#4b5563"
          }}>
            {about || "Passionate about balance and healing. I have over 14 years of experience in massage therapy, specializing in deep tissue and sports recovery."}
          </div>

          {/* Session Types */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem"
            }}>
              Session Types
            </h2>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {["Studio Sessions", "Hotel Sessions", "Client Sessions"].map((type) => (
                <div key={type} style={{
                  background: "#f3f4f6",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "999px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#374151"
                }}>
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Massage Techniques */}
          {techniques.length > 0 && (
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "0.5rem"
              }}>
                Massage Techniques
              </h2>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "1.5rem" }}>
                Specialized techniques tailored to your wellness goals
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {techniques.map((tech) => (
                  <div key={tech} style={{
                    background: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#1f2937",
                    border: "1px solid #e5e7eb"
                  }}>
                    {tech}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {services.length > 0 && (
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem"
              }}>
                Extras
              </h2>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#1f2937", marginBottom: "1rem" }}>
                Available Add-ons
              </h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {services.slice(0, 5).map((service) => (
                  <div key={service} style={{
                    background: "#f9fafb",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "999px",
                    fontSize: "0.875rem",
                    color: "#4b5563"
                  }}>
                    {service}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          {(therapist.rate_60 || therapist.rate_90) && (
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem"
              }}>
                Pricing
              </h2>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "0.5rem" }}>
                Session Rates
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
                Transparent pricing for professional massage therapy
              </p>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem"
              }}>
                {therapist.rate_60 && (
                  <div style={{
                    background: "white",
                    padding: "2rem",
                    borderRadius: "1rem",
                    border: "1px solid #e5e7eb",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                      60 minutes
                    </div>
                    <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "0.5rem" }}>
                      {therapist.rate_60}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>In-call</div>
                    {therapist.rate_outcall && (
                      <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", marginTop: "1rem" }}>
                        {therapist.rate_outcall}
                        <div style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "400" }}>Out-call</div>
                      </div>
                    )}
                  </div>
                )}

                {therapist.rate_90 && (
                  <div style={{
                    background: "white",
                    padding: "2rem",
                    borderRadius: "1rem",
                    border: "1px solid #e5e7eb",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                      90 minutes
                    </div>
                    <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "0.5rem" }}>
                      {therapist.rate_90}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>In-call</div>
                    {therapist.rate_outcall && (
                      <div style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", marginTop: "1rem" }}>
                        {therapist.rate_outcall}
                        <div style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "400" }}>Out-call</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div style={{ marginTop: "2rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", color: "#1f2937", marginBottom: "1rem" }}>
                  Payment Methods
                </h4>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {["Cash", "Zelle", "Venmo", "Apple Pay"].map((method) => (
                    <div key={method} style={{
                      background: "#f9fafb",
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.875rem",
                      color: "#4b5563",
                      border: "1px solid #e5e7eb"
                    }}>
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Business Hours */}
          {availability.length > 0 && (
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#6b7280",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "1rem"
              }}>
                Schedule
              </h2>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "0.5rem" }}>
                Business Hours
              </h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
                Weekly availability
              </p>

              <div style={{
                background: "white",
                padding: "2rem",
                borderRadius: "1rem",
                border: "1px solid #e5e7eb"
              }}>
                {availability.map((day, idx) => (
                  <div
                    key={day.day}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1rem 0",
                      borderBottom: idx < availability.length - 1 ? "1px solid #f3f4f6" : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>🕐</span>
                      <span style={{ fontWeight: "500", color: "#1f2937" }}>{day.day}</span>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6b7280", textAlign: "right" }}>
                      {day.incall !== "Closed" ? day.incall : "Closed"}
                    </div>
                  </div>
                ))}

                <div style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "#f9fafb",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem"
                }}>
                  <span style={{ fontSize: "1.25rem" }}>⏰</span>
                  <div style={{ fontSize: "0.875rem", color: "#4b5563" }}>
                    <strong>Availability:</strong> Available {availability.filter(d => d.incall !== "Closed").map(d => d.day).join(", ")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Map & Location */}
          {mapQuery && (
            <div style={{ marginBottom: "3rem" }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "2rem"
              }}>
                Location & Service Area
              </h2>

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem"
              }}>
                {/* Location Info */}
                <div style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  border: "1px solid #e5e7eb"
                }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", marginBottom: "1rem" }}>
                    Location Details
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem", color: "#4b5563" }}>
                    <div>
                      <strong>City:</strong> {locationCityState}
                    </div>
                    {therapist.zip_code && (
                      <div>
                        <strong>ZIP:</strong> {therapist.zip_code}
                      </div>
                    )}
                    {therapist.address && (
                      <div>
                        <strong>Nearest Intersection:</strong> {therapist.address}
                      </div>
                    )}
                    {therapist.mobile_service_radius && (
                      <div>
                        <strong>Mobile Service Radius:</strong> {therapist.mobile_service_radius} miles
                      </div>
                    )}
                  </div>
                </div>

                {/* Map */}
                <div style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  border: "1px solid #e5e7eb"
                }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1f2937", marginBottom: "1rem" }}>
                    Map
                  </h3>
                  {mapEmbedSrc ? (
                    <>
                      <div style={{
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        height: "200px",
                        marginBottom: "1rem"
                      }}>
                        <iframe
                          title="Location Map"
                          src={mapEmbedSrc}
                          style={{ width: "100%", height: "100%", border: "none" }}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      {mapDirectionsHref && (
                        <a
                          href={mapDirectionsHref}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-block",
                            background: "#f9fafb",
                            color: "#1f2937",
                            padding: "0.75rem 1.5rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #e5e7eb",
                            textDecoration: "none",
                            fontSize: "0.875rem",
                            fontWeight: "500"
                          }}
                        >
                          Get Directions →
                        </a>
                      )}
                    </>
                  ) : (
                    <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>Map not available</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FAQ */}
          <div style={{ marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "0.875rem",
              fontWeight: "600",
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "1rem"
            }}>
              Common Questions
            </h2>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "0.5rem" }}>
              Frequently Asked Questions
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "2rem" }}>
              Everything you need to know about booking a session
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                {
                  q: `What types of massage does ${displayName} offer in ${city}?`,
                  a: `${displayName} specializes in ${techniques.slice(0, 3).join(", ")} massage therapy in ${city}. Each session is customized to your specific needs and wellness goals.`
                },
                {
                  q: `Does ${displayName} offer in-call or out-call massage services in ${city}?`,
                  a: `Yes, I offer both in-call (at my studio) and out-call (I come to your location) in ${city}. For out-call sessions, I bring all necessary equipment to ensure a professional and relaxing experience in the comfort of your space.`
                },
                {
                  q: `What are the rates for massage therapy with ${displayName} in ${city}?`,
                  a: therapist.rate_60
                    ? `My massage therapy rates in ${city} start at ${therapist.rate_60} for a 60-minute session. I offer 3 different session lengths to fit your schedule and needs. Out-call rates include a travel fee. All rates are transparent with no hidden fees.`
                    : "Please contact me directly for current rates and availability."
                },
                {
                  q: `What is ${displayName}'s availability for massage appointments in ${city}?`,
                  a: availability.length > 0
                    ? `I'm available ${availability.filter(d => d.incall !== "Closed").map(d => d.day + "s").join(", ")}. To book a massage appointment in ${city}, you can text or call me directly. I typically respond within a few hours and can often accommodate same-day or next-day bookings based on availability.`
                    : "Please contact me directly to check current availability and schedule your appointment."
                }
              ].map((faq, idx) => (
                <details key={idx} style={{
                  background: "white",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  border: "1px solid #e5e7eb"
                }}>
                  <summary style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#1f2937",
                    cursor: "pointer",
                    listStyle: "none"
                  }}>
                    {faq.q}
                  </summary>
                  <p style={{
                    marginTop: "1rem",
                    fontSize: "0.875rem",
                    color: "#4b5563",
                    lineHeight: "1.6"
                  }}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
            padding: "3rem",
            borderRadius: "1.5rem",
            textAlign: "center",
            color: "white"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📞 ☎️</div>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem" }}>
              Ready to Book?
            </h2>
            <p style={{ fontSize: "1rem", opacity: 0.9, marginBottom: "2rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
              Experience professional massage therapy. Book your session today.
            </p>
            {therapist.phone && (
              <a
                href={`tel:${therapist.phone}`}
                style={{
                  display: "inline-block",
                  background: "white",
                  color: "#1f2937",
                  padding: "1rem 2.5rem",
                  borderRadius: "0.75rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  fontSize: "1.125rem",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                Book Now
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <div style={{
        borderTop: "1px solid #e5e7eb",
        padding: "2rem 1.5rem",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "0.875rem",
        maxWidth: "900px",
        margin: "0 auto",
        lineHeight: "1.6"
      }}>
        <p style={{ fontWeight: "500", color: "#4b5563" }}>
          MasseurMatch is a directory service. All profile information is self reported. We do not verify licenses, conduct background checks, process bookings, or handle payments. Users should independently verify credentials and suitability.
        </p>
      </div>
    </main>
  );
}
