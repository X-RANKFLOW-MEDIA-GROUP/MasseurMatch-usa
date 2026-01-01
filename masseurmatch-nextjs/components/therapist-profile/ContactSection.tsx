"use client";

import { Phone, Mail, Globe, Instagram, MessageCircle, MapPin, Clock } from "lucide-react";

interface ContactSectionProps {
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  businessHours?: {
    monday?: { open: string; close: string };
    tuesday?: { open: string; close: string };
    wednesday?: { open: string; close: string };
    thursday?: { open: string; close: string };
    friday?: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
}

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DAY_LABELS: Record<typeof DAYS[number], string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export function ContactSection({
  phone,
  email,
  website,
  instagram,
  whatsapp,
  address,
  city,
  state,
  zipCode,
  latitude,
  longitude,
  businessHours,
}: ContactSectionProps) {
  const hasContactInfo = phone || email || website || instagram || whatsapp;
  const hasLocationInfo = address || (city && state);
  const hasBusinessHours = businessHours && Object.keys(businessHours).length > 0;

  if (!hasContactInfo && !hasLocationInfo && !hasBusinessHours) {
    return null;
  }

  const fullAddress = [address, city, state, zipCode].filter(Boolean).join(", ");

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Book your session or ask any questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Methods & Location */}
          <div className="space-y-6">
            {/* Contact Methods */}
            {hasContactInfo && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Contact Methods
                </h3>
                <div className="space-y-4">
                  {phone && (
                    <ContactButton
                      icon={<Phone className="w-5 h-5" />}
                      label="Call or Text"
                      value={phone}
                      href={`tel:${phone}`}
                      color="green"
                    />
                  )}
                  {whatsapp && (
                    <ContactButton
                      icon={<MessageCircle className="w-5 h-5" />}
                      label="WhatsApp"
                      value={whatsapp}
                      href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                      color="green"
                    />
                  )}
                  {email && (
                    <ContactButton
                      icon={<Mail className="w-5 h-5" />}
                      label="Email"
                      value={email}
                      href={`mailto:${email}`}
                      color="blue"
                    />
                  )}
                  {website && (
                    <ContactButton
                      icon={<Globe className="w-5 h-5" />}
                      label="Website"
                      value={website}
                      href={website}
                      color="purple"
                    />
                  )}
                  {instagram && (
                    <ContactButton
                      icon={<Instagram className="w-5 h-5" />}
                      label="Instagram"
                      value={`@${instagram.replace("@", "")}`}
                      href={`https://instagram.com/${instagram.replace("@", "")}`}
                      color="pink"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {hasLocationInfo && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Location
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {fullAddress}
                </p>
                {latitude && longitude && (
                  <a
                    href={`https://maps.google.com/?q=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Business Hours */}
          {hasBusinessHours && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Business Hours
              </h3>
              <div className="space-y-3">
                {DAYS.map((day) => {
                  const hours = businessHours?.[day];
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {DAY_LABELS[day]}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {hours ? `${hours.open} - ${hours.close}` : "Closed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-3">
              Ready to Book Your Session?
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Experience professional massage therapy tailored to your needs
            </p>
            {phone && (
              <a
                href={`tel:${phone}`}
                className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-lg"
              >
                Book Now - {phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface ContactButtonProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  color: "green" | "blue" | "purple" | "pink";
}

function ContactButton({ icon, label, value, href, color }: ContactButtonProps) {
  const colorClasses = {
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800",
    pink: "bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 border-pink-200 dark:border-pink-800",
  };

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${colorClasses[color]}`}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium opacity-75">{label}</div>
        <div className="font-semibold truncate">{value}</div>
      </div>
    </a>
  );
}
