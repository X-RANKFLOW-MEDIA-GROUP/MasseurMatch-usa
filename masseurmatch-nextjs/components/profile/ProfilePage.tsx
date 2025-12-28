import type { PublicProfile } from "@/lib/profile";
import { isIndexable, moneyRange } from "@/lib/profile";
import Breadcrumbs from "@/components/profile/parts/Breadcrumbs";
import PhotoGrid from "@/components/profile/parts/PhotoGrid";
import ContactCard from "@/components/profile/parts/ContactCard";
import ServicesList from "@/components/profile/parts/ServicesList";
import FAQBlock from "@/components/profile/parts/FAQBlock";
import SchemaBlocks from "@/components/profile/parts/SchemaBlocks";

export default function ProfilePage({ profile }: { profile: PublicProfile }) {
  const indexable = isIndexable(profile);
  const price = moneyRange(profile);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Schema.org markup for SEO */}
      <SchemaBlocks profile={profile} />

      {/* Breadcrumbs for navigation and SEO */}
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: profile.city_name, href: `/${profile.city_slug}` },
          {
            label: profile.display_name,
            href: `/${profile.city_slug}/therapist/${profile.slug}`,
          },
        ]}
      />

      {/* Draft notice (not indexed) */}
      {!indexable && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-800 dark:bg-amber-950/20">
          <strong>Draft Profile:</strong> This listing is not published yet. It is visible for
          review only and will not appear in search results.
        </div>
      )}

      {/* Hero Section */}
      <header className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            {profile.display_name} - Massage Therapist in {profile.city_name}, {profile.state_code}
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Directory listing only. No bookings or payments are processed on this website.
          </p>

          {/* Service badges */}
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border px-3 py-1 dark:border-gray-700">
              {profile.incall_enabled ? "✓ In-call" : "✗ No in-call"}
            </span>
            <span className="rounded-full border px-3 py-1 dark:border-gray-700">
              {profile.outcall_enabled ? "✓ Out-call" : "✗ No out-call"}
            </span>
            {price && (
              <span className="rounded-full border border-violet-500 bg-violet-50 px-3 py-1 text-violet-700 dark:bg-violet-950/20 dark:text-violet-300">
                {price}
              </span>
            )}
            {profile.languages?.slice(0, 3).map((lang) => (
              <span key={lang} className="rounded-full border px-3 py-1 dark:border-gray-700">
                {lang}
              </span>
            ))}
          </div>

          {/* Short bio */}
          {profile.short_bio && (
            <p className="mt-5 text-base leading-relaxed text-gray-800 dark:text-gray-200">
              {profile.short_bio}
            </p>
          )}
        </div>

        {/* Contact card */}
        <div className="md:col-span-1">
          <ContactCard profile={profile} />
        </div>
      </header>

      {/* Photo gallery */}
      <section className="mt-8">
        <PhotoGrid profile={profile} />
      </section>

      {/* Main content grid */}
      <section className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* Main content column */}
        <div className="space-y-10 md:col-span-2">
          {/* About section */}
          <div>
            <h2 className="text-xl font-semibold">About</h2>
            <div className="mt-3 space-y-4 text-gray-800 dark:text-gray-200">
              {profile.long_bio ? (
                <p className="whitespace-pre-line">{profile.long_bio}</p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  This therapist has not added a detailed bio yet. Contact options may be available
                  above.
                </p>
              )}
            </div>
          </div>

          {/* Services offered */}
          <div>
            <h2 className="text-xl font-semibold">Services Offered</h2>
            <div className="mt-3">
              <ServicesList
                items={profile.services || []}
                emptyText="No services listed yet."
              />
            </div>
          </div>

          {/* Modalities */}
          {profile.modalities && profile.modalities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold">Massage Modalities</h2>
              <div className="mt-3">
                <ServicesList items={profile.modalities} emptyText="No modalities listed." />
              </div>
            </div>
          )}

          {/* Rates and pricing */}
          <div>
            <h2 className="text-xl font-semibold">Rates & Session Options</h2>
            <div className="mt-3 space-y-3 rounded-xl border p-4 dark:border-gray-700">
              {price ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-medium">Typical range:</span>
                  <span className="text-violet-600 dark:text-violet-400">{price}</span>
                </div>
              ) : (
                <div className="text-gray-600 dark:text-gray-400">
                  Rates not listed. Use the contact options to inquire about pricing.
                </div>
              )}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                In-call and out-call availability may vary by location and schedule. Please contact
                the therapist directly to discuss your needs.
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h2 className="text-xl font-semibold">Availability</h2>
            <div className="mt-3 rounded-xl border p-4 dark:border-gray-700">
              {profile.availability_note ? (
                <div className="text-gray-800 dark:text-gray-200">{profile.availability_note}</div>
              ) : (
                <div className="text-gray-600 dark:text-gray-400">
                  Availability not listed. Contact the therapist directly to schedule.
                </div>
              )}
            </div>
          </div>

          {/* Service areas */}
          <div>
            <h2 className="text-xl font-semibold">Service Areas</h2>
            <div className="mt-3 rounded-xl border p-4 dark:border-gray-700">
              {profile.service_areas && profile.service_areas.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.service_areas.slice(0, 20).map((area) => (
                    <a
                      key={`${area.city_slug}:${area.state_code}`}
                      href={`/${area.city_slug}`}
                      className="rounded-full border px-3 py-1 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      {area.city_name}, {area.state_code}
                    </a>
                  ))}
                </div>
              ) : (
                <div>
                  {profile.city_name}, {profile.state_code}
                </div>
              )}
            </div>
          </div>

          {/* Safety and expectations */}
          <div>
            <h2 className="text-xl font-semibold">Safety & Expectations</h2>
            <div className="mt-3 space-y-2 rounded-xl border p-4 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-300">
              <p>
                Profiles are self-managed by providers. MasseurMatch is a directory platform only
                and does not verify credentials or process bookings.
              </p>
              <p>
                Read more in our{" "}
                <a className="underline text-violet-600 dark:text-violet-400" href="/trust">
                  Trust and Safety
                </a>{" "}
                and{" "}
                <a className="underline text-violet-600 dark:text-violet-400" href="/verification-scope">
                  Verification Scope
                </a>{" "}
                pages.
              </p>
            </div>
          </div>

          {/* FAQ section */}
          <FAQBlock profile={profile} />
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 md:col-span-1">
          {/* Quick links */}
          <div className="rounded-xl border p-4 text-sm dark:border-gray-700">
            <div className="font-medium">Quick Links</div>
            <div className="mt-2 flex flex-col gap-2">
              <a
                className="text-violet-600 underline dark:text-violet-400"
                href={`/${profile.city_slug}`}
              >
                Browse {profile.city_name}
              </a>
              <a className="text-violet-600 underline dark:text-violet-400" href="/explore">
                Explore All Therapists
              </a>
              <a className="text-violet-600 underline dark:text-violet-400" href="/join">
                Join as a Therapist
              </a>
            </div>
          </div>

          {/* Report/Support */}
          <div className="rounded-xl border p-4 text-sm dark:border-gray-700">
            <div className="font-medium">Report an Issue</div>
            <div className="mt-2 space-y-1 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Support:</strong>{" "}
                <a
                  className="text-violet-600 underline dark:text-violet-400"
                  href="mailto:support@masseurmatch.com"
                >
                  support@masseurmatch.com
                </a>
              </p>
              <p>
                <strong>Billing:</strong>{" "}
                <a
                  className="text-violet-600 underline dark:text-violet-400"
                  href="mailto:billing@masseurmatch.com"
                >
                  billing@masseurmatch.com
                </a>
              </p>
              <p>
                <strong>Legal:</strong>{" "}
                <a
                  className="text-violet-600 underline dark:text-violet-400"
                  href="mailto:legal@masseurmatch.com"
                >
                  legal@masseurmatch.com
                </a>
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
