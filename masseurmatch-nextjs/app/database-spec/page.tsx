import { LegalPage } from "@/app/legal/LegalPage";

export async function generateMetadata() {
  const url = "https://www.masseurmatch.com/database-spec";

  return {
    title: "Database Complete Specification | MasseurMatch",
    description:
      "Complete technical specification of the MasseurMatch database architecture, schemas, tables, relationships, and business rules.",
    alternates: {
      canonical: url,
    },
    robots: {
      index: false, // Internal documentation, no need to index
      follow: false,
    },
    openGraph: {
      title: "Database Complete Specification | MasseurMatch",
      description:
        "Complete technical specification of the MasseurMatch database architecture, schemas, tables, relationships, and business rules.",
      url,
      siteName: "MasseurMatch",
      type: "article",
    },
  };
}

export default function DatabaseSpecPage() {
  return (
    <LegalPage
      title="Database Complete Specification"
      description="Complete technical specification of the MasseurMatch database architecture, schemas, tables, relationships, and business rules."
      slug="/database-spec"
      lastUpdated="Version 1.0 - December 25, 2025"
      sections={[
        {
          heading: "1. Architecture Overview",
          body: (
            <>
              <p>
                The MasseurMatch database is built on Supabase (PostgreSQL) with three main schemas:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>auth</strong> - Managed by Supabase for authentication</li>
                <li><strong>public</strong> - Application data (profiles, subscriptions, media)</li>
                <li><strong>storage</strong> - File storage (photos, videos, documents)</li>
              </ul>
              <p className="mt-3">
                <strong>Design Principles:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Security in layers: RLS on all public tables</li>
                <li>Complete audit trail: created_at and updated_at on all tables</li>
                <li>Soft deletes: use flags instead of delete operations</li>
                <li>Normalization: junction tables for N:N relationships</li>
                <li>Validation: triggers for complex business rules</li>
              </ul>
            </>
          ),
        },
        {
          heading: "2. Core Enums (Custom Types)",
          body: (
            <>
              <p>
                The database uses PostgreSQL enums for type safety and consistency:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><code>identity_status_enum</code> - pending | verified | failed</li>
                <li><code>user_role_enum</code> - user | admin</li>
                <li><code>subscription_plan_enum</code> - free | standard | pro | elite</li>
                <li><code>subscription_status_enum</code> - trialing | active | past_due | canceled</li>
                <li><code>onboarding_stage_enum</code> - 11 stages from start to live</li>
                <li><code>auto_moderation_enum</code> - draft | auto_passed | auto_flagged | auto_blocked</li>
                <li><code>admin_status_enum</code> - pending_admin | approved | rejected | changes_requested</li>
                <li><code>publication_status_enum</code> - private | public</li>
                <li><code>media_status_enum</code> - pending | approved | rejected</li>
                <li><code>media_type_enum</code> - photo | video</li>
                <li><code>rate_context_enum</code> - incall | outcall</li>
              </ul>
            </>
          ),
        },
        {
          heading: "3. Core Tables",
          body: (
            <>
              <p><strong>auth.users</strong> (Supabase managed)</p>
              <p className="text-sm">Base authentication table - do not modify directly</p>

              <p className="mt-4"><strong>public.users</strong> (Extension of auth.users)</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Identity verification: identity_status, stripe_identity_session_id</li>
                <li>Access control: role (user | admin)</li>
                <li>Stripe integration: stripe_customer_id</li>
              </ul>

              <p className="mt-4"><strong>public.profiles</strong> (Therapist profiles - core)</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Onboarding flow: onboarding_stage</li>
                <li>Moderation: auto_moderation, admin_status, publication_status</li>
                <li>Basic info: display_name, bio, date_of_birth</li>
                <li>Location: city_slug, address, coordinates</li>
                <li>Contact: phone_public_e164, phone_whatsapp_e164, email_public, website_url</li>
                <li>Service settings: incall_enabled, outcall_enabled</li>
                <li>SEO: slug (unique)</li>
              </ul>

              <p className="mt-4"><strong>public.subscriptions</strong> (Stripe subscriptions)</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Plan info: plan, status</li>
                <li>Stripe IDs: stripe_subscription_id, stripe_payment_method_id</li>
                <li>Trial period: trial_start, trial_end</li>
                <li>Billing cycle: current_period_start, current_period_end</li>
                <li>Constraint: only ONE active subscription per user</li>
              </ul>

              <p className="mt-4"><strong>public.media_assets</strong> (Photos/videos)</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Type & status: type, status</li>
                <li>Storage: storage_path, public_url, thumbnail_url</li>
                <li>Display: position, is_cover (only one cover per profile)</li>
                <li>Sightengine moderation: sightengine_response, sightengine_score</li>
                <li>Photo limits: free=1, standard=4, pro=8, elite=12</li>
              </ul>

              <p className="mt-4"><strong>public.profile_rates</strong> (Service pricing)</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Context: incall | outcall</li>
                <li>Pricing: duration_minutes, price_cents, currency</li>
                <li>33% Rule: price per minute cannot exceed 133% of base rate</li>
              </ul>

              <p className="mt-4"><strong>public.profile_hours</strong> (Operating hours)</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Day of week: 0 (Sunday) to 6 (Saturday)</li>
                <li>Hours: open_time, close_time</li>
                <li>Break: break_start, break_end (optional)</li>
              </ul>
            </>
          ),
        },
        {
          heading: "4. Relationship Tables",
          body: (
            <>
              <p><strong>public.profile_languages</strong> - Languages spoken by therapist</p>
              <p><strong>public.profile_services</strong> - Types of massage offered</p>
              <p><strong>public.profile_setups</strong> - Service configurations (portable table, office, etc.)</p>
              <p><strong>public.users_preferences</strong> - Client search preferences</p>
              <p><strong>public.explore_swipe_events</strong> - Analytics for swipe actions</p>
            </>
          ),
        },
        {
          heading: "5. Business Rules",
          body: (
            <>
              <p><strong>Profile Publication Requirements:</strong></p>
              <p className="text-sm mt-2">For a profile to be published (publication_status = 'public'), it must have:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>✅ identity_status = 'verified'</li>
                <li>✅ auto_moderation = 'auto_passed'</li>
                <li>✅ admin_status = 'approved'</li>
                <li>✅ Active subscription OR free plan</li>
                <li>✅ At least 1 approved photo</li>
                <li>✅ Required fields: display_name, city_slug, phone_public_e164</li>
                <li>✅ At least 1 language, 1 service, 1 setup</li>
                <li>✅ If incall_enabled: at least 1 incall rate</li>
                <li>✅ If outcall_enabled: at least 1 outcall rate</li>
              </ul>

              <p className="mt-4"><strong>Photo Limits by Plan:</strong></p>
              <table className="w-full mt-2 text-sm border">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Plan</th>
                    <th className="p-2 text-left">Max Photos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b"><td className="p-2">Free</td><td className="p-2">1</td></tr>
                  <tr className="border-b"><td className="p-2">Standard</td><td className="p-2">4</td></tr>
                  <tr className="border-b"><td className="p-2">Pro</td><td className="p-2">8</td></tr>
                  <tr><td className="p-2">Elite</td><td className="p-2">12</td></tr>
                </tbody>
              </table>

              <p className="mt-4"><strong>Pricing Rule (33%):</strong></p>
              <p className="text-sm">
                Price per minute cannot exceed 133% of the base rate. Example: If base rate is 60min @ $120 ($2.00/min),
                then 30min cannot exceed $80 ($2.66/min = 133% of $2.00).
              </p>
            </>
          ),
        },
        {
          heading: "6. Row Level Security (RLS)",
          body: (
            <>
              <p>All public tables have RLS enabled with three policy patterns:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><strong>Own Data:</strong> Users can view/edit their own records</li>
                <li><strong>Public Read:</strong> Anyone can view approved, public profiles</li>
                <li><strong>Admin All:</strong> Admins have full access to everything</li>
              </ul>

              <p className="mt-4"><strong>Storage Policies (profiles bucket):</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>INSERT: Users can upload to their folder ({"{user_id}/"})</li>
                <li>SELECT (own): Users see their own files</li>
                <li>SELECT (public): Everyone sees public photos</li>
                <li>UPDATE/DELETE: Users manage their own files</li>
              </ul>
            </>
          ),
        },
        {
          heading: "7. Triggers & Automation",
          body: (
            <>
              <p><strong>Auto-update updated_at:</strong> Trigger on all tables to set updated_at = NOW()</p>
              <p className="mt-2"><strong>Validate 33% Rule:</strong> Trigger validates pricing on profile_rates INSERT/UPDATE</p>
              <p className="mt-2"><strong>Photo Limit:</strong> Trigger enforces plan limits on media_assets INSERT</p>
              <p className="mt-2"><strong>Auto-set Cover Photo:</strong> First approved photo becomes cover automatically</p>
            </>
          ),
        },
        {
          heading: "8. Onboarding Flow",
          body: (
            <>
              <p>The onboarding_stage enum tracks user progression through 11 stages:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
                <li>start - Initial signup</li>
                <li>needs_plan - Must choose subscription plan</li>
                <li>needs_payment - Must add payment method (if not free)</li>
                <li>needs_identity - Must verify identity via Stripe</li>
                <li>build_profile - Complete profile fields</li>
                <li>upload_photos - Upload and moderate photos</li>
                <li>fix_moderation - Photos rejected, need fixing</li>
                <li>submit_admin - Ready to submit for admin review</li>
                <li>waiting_admin - Awaiting admin approval</li>
                <li>live - Profile published and public</li>
                <li>blocked - Account blocked for violations</li>
              </ol>
            </>
          ),
        },
        {
          heading: "9. Stripe Integration",
          body: (
            <>
              <p><strong>Customer Creation:</strong> On signup, create Stripe customer and save stripe_customer_id</p>
              <p className="mt-2"><strong>Subscription Creation:</strong> Create subscription with trial, save to subscriptions table</p>
              <p className="mt-2"><strong>Identity Verification:</strong> Create Stripe Identity VerificationSession after subscription</p>
              <p className="mt-2"><strong>Webhooks:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>customer.subscription.updated - Update subscription status</li>
                <li>customer.subscription.deleted - Mark as canceled</li>
                <li>identity.verification_session.verified - Set identity_status = verified</li>
                <li>identity.verification_session.requires_input - Set identity_status = failed</li>
              </ul>
            </>
          ),
        },
        {
          heading: "10. Sightengine Integration",
          body: (
            <>
              <p>Photo moderation workflow:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
                <li>Upload photo to storage</li>
                <li>Create media_assets record with status = pending</li>
                <li>Call Sightengine API to check for nudity/offensive content</li>
                <li>Score photos: if score {">"} 0.7, reject; otherwise approve</li>
                <li>Update media_assets with status and sightengine_response</li>
                <li>If rejected: set profile.auto_moderation = auto_blocked</li>
                <li>If all approved: set profile.auto_moderation = auto_passed</li>
              </ol>
            </>
          ),
        },
        {
          heading: "11. Helper Functions",
          body: (
            <>
              <p><strong>can_submit_for_review(profile_uuid):</strong> Check if profile meets submission requirements</p>
              <p className="mt-2"><strong>can_publish_profile(profile_uuid):</strong> Check if profile meets publication requirements</p>
              <p className="text-sm mt-2">
                Both functions verify identity status, moderation, required fields, photos, languages, services, setups, and rates.
              </p>
            </>
          ),
        },
        {
          heading: "12. Indexes & Performance",
          body: (
            <>
              <p>Critical indexes for performance:</p>
              <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                <li>idx_users_stripe_customer - Stripe lookups</li>
                <li>idx_profiles_city_slug - Profile discovery by city</li>
                <li>idx_profiles_public_approved - Public profile feed</li>
                <li>idx_profiles_pending_review - Admin queue</li>
                <li>idx_media_approved_by_profile - Approved media queries</li>
                <li>idx_rates_active_by_profile - Active rates lookup</li>
              </ul>
            </>
          ),
        },
        {
          heading: "13. Common Queries",
          body: (
            <>
              <p><strong>Fetch Public Profiles (Explore):</strong></p>
              <pre className="text-xs mt-2 p-3 rounded bg-slate-100 overflow-x-auto">
{`SELECT p.*, json_agg(m.public_url) as photos
FROM profiles p
LEFT JOIN media_assets m ON p.id = m.profile_id
WHERE p.publication_status = 'public'
  AND p.admin_status = 'approved'
  AND p.city_slug = $1
GROUP BY p.id
ORDER BY p.created_at DESC
LIMIT 20;`}
              </pre>

              <p className="mt-4"><strong>Admin Queue (Pending Profiles):</strong></p>
              <pre className="text-xs mt-2 p-3 rounded bg-slate-100 overflow-x-auto">
{`SELECT p.*, u.email, COUNT(m.id) as photo_count
FROM profiles p
JOIN users u ON p.user_id = u.id
LEFT JOIN media_assets m ON p.id = m.profile_id
WHERE p.admin_status = 'pending_admin'
  AND p.auto_moderation = 'auto_passed'
GROUP BY p.id, u.email
ORDER BY p.submitted_at ASC;`}
              </pre>
            </>
          ),
        },
        {
          heading: "14. Maintenance & Data Integrity",
          body: (
            <>
              <p><strong>Backup Strategy:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Daily: Full database dump via Supabase dashboard</li>
                <li>Weekly: Validation queries for data integrity</li>
              </ul>

              <p className="mt-4"><strong>Data Integrity Checks:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Orphaned profiles (no auth.users match)</li>
                <li>Orphaned media (no profile match)</li>
                <li>Invalid subscription states</li>
                <li>Duplicate cover photos</li>
              </ul>

              <p className="mt-4"><strong>Cleanup Scripts:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Delete rejected media older than 90 days</li>
                <li>Delete swipe events older than 1 year</li>
              </ul>
            </>
          ),
        },
        {
          heading: "15. Related Documentation",
          body: (
            <>
              <p>For more details, see:</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li><a href="/database-spec/migrations" className="underline" style={{ color: "var(--violet)" }}>Database Migrations</a></li>
                <li><a href="/database-spec/schema-consistency" className="underline" style={{ color: "var(--violet)" }}>Schema Consistency Report</a></li>
                <li><a href="/database-spec/storage-policies" className="underline" style={{ color: "var(--violet)" }}>Storage Policies Audit</a></li>
              </ul>
            </>
          ),
        },
      ]}
    />
  );
}
