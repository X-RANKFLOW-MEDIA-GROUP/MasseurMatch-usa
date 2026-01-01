import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ adId: string }>;
}) {
  const { adId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: therapist } = await supabase
    .from('therapists')
    .select('display_name, slug')
    .eq('user_id', adId)
    .single();

  return {
    title: `Edit ${therapist?.display_name || 'Profile'} | MasseurMatch Dashboard`,
    description: `Edit your massage therapist profile on MasseurMatch. Update services, rates, photos, and availability.`,
    robots: { index: false, follow: false },
  };
}

export default async function EditAdPage({
  params,
}: {
  params: Promise<{ adId: string }>;
}) {
  const { adId } = await params;
  const supabase = await createServerSupabaseClient();

  // Get current user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // Get therapist profile with all fields
  const { data: therapist } = await supabase
    .from('therapists')
    .select('*')
    .eq('user_id', adId)
    .single();

  // Check authorization
  if (!therapist || therapist.user_id !== session.user.id) {
    redirect('/dashboard/ads');
  }

  // Define sections matching MasseurFinder structure with field mapping
  const sections = [
    {
      slug: 'basic',
      name: 'Basic Settings',
      icon: '⚙️',
      fields: [
        { key: 'appointment_types', label: 'Appointment Types', value: therapist.appointment_types },
      ],
    },
    {
      slug: 'location',
      name: 'Location',
      icon: '📍',
      fields: [
        { key: 'location', label: 'Nearest Major Street Intersection', value: therapist.location },
        { key: 'city', label: 'City', value: therapist.city },
        { key: 'state', label: 'State', value: therapist.state },
        { key: 'zip_code', label: 'ZIP Code', value: therapist.zip_code },
        { key: 'enable_mapping', label: 'Enable Mapping', value: therapist.enable_mapping ? 'Yes' : 'No' },
      ],
    },
    {
      slug: 'services',
      name: 'Your Services',
      icon: '💆',
      fields: [
        { key: 'services', label: 'Massage Techniques', value: Array.isArray(therapist.services) ? therapist.services.join(', ') : therapist.services },
        { key: 'massage_setup', label: 'Massage Setup', value: therapist.massage_setup },
        { key: 'mobile_extras', label: 'Mobile Extras', value: therapist.mobile_extras },
        { key: 'additional_services', label: 'Additional Services', value: therapist.additional_services },
        { key: 'studio_amenities', label: 'Studio (Incall) Amenities', value: therapist.studio_amenities },
        { key: 'products_used', label: 'Products Used', value: therapist.products_used },
        { key: 'products_sold', label: 'Products Sold', value: therapist.products_sold },
      ],
    },
    {
      slug: 'text',
      name: 'Name / Headline / Text',
      icon: '📝',
      fields: [
        { key: 'display_name', label: 'Display Name', value: therapist.display_name },
        { key: 'full_name', label: 'Full Name', value: therapist.full_name },
        { key: 'headline', label: 'Headline', value: therapist.headline },
        { key: 'bio', label: 'Massage Summary', value: therapist.bio },
      ],
    },
    {
      slug: 'rates',
      name: 'Rates & Payment',
      icon: '💰',
      fields: [
        { key: 'rates', label: 'Rates', value: therapist.rates },
        { key: 'payment_methods', label: 'Payment Methods', value: therapist.payment_methods },
        { key: 'regular_discounts', label: 'Regular Discounts', value: therapist.regular_discounts },
        { key: 'rate_disclaimers', label: 'Rate Disclaimers', value: therapist.rate_disclaimers },
        { key: 'day_of_week_discount', label: 'Day of Week Discount', value: therapist.day_of_week_discount },
        { key: 'weekly_specials', label: 'Weekly Specials', value: therapist.weekly_specials },
      ],
    },
    {
      slug: 'hours',
      name: 'Hours',
      icon: '🕐',
      fields: [
        { key: 'in_studio_hours', label: 'In-Studio Hours', value: therapist.in_studio_hours },
        { key: 'mobile_hours', label: 'Mobile Hours', value: therapist.mobile_hours },
      ],
    },
    {
      slug: 'contact',
      name: 'Contact Info',
      icon: '📞',
      fields: [
        { key: 'phone', label: 'Phone Number', value: therapist.phone },
        { key: 'email', label: 'Email', value: therapist.email },
      ],
    },
    {
      slug: 'links',
      name: 'Links',
      icon: '🔗',
      fields: [
        { key: 'booking_link', label: 'Booking Link', value: therapist.booking_link },
        { key: 'website', label: 'Website', value: therapist.website },
        { key: 'social_links', label: 'Social Media', value: therapist.social_links },
      ],
    },
    {
      slug: 'misc',
      name: 'Professional Development',
      icon: '🎓',
      fields: [
        { key: 'degrees', label: 'Degrees', value: therapist.degrees },
        { key: 'certifications', label: 'Certifications', value: therapist.certifications },
        { key: 'outcall_radius', label: 'Outcall Radius (miles)', value: therapist.outcall_radius },
        { key: 'business_start_date', label: 'Massage Start Date', value: therapist.business_start_date },
        { key: 'languages', label: 'Languages Spoken', value: Array.isArray(therapist.languages) ? therapist.languages.join(', ') : therapist.languages },
        { key: 'affiliations', label: 'Affiliations', value: therapist.affiliations },
        { key: 'business_trips', label: 'Business Trips', value: therapist.business_trips },
      ],
    },
    {
      slug: 'photos',
      name: 'Photos',
      icon: '📸',
      fields: [
        { key: 'profile_photo', label: 'Profile Photo', value: therapist.profile_photo },
        { key: 'photos', label: 'Additional Photos', value: therapist.photos },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                MasseurMatch
              </Link>
              <span className="text-slate-400 text-sm">→</span>
              <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm">
                Dashboard
              </Link>
              <span className="text-slate-400 text-sm">→</span>
              <span className="text-white text-sm">Edit Profile</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/therapist/${therapist.slug}`}
                target="_blank"
                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors text-sm"
              >
                👁️ View Public Profile
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-purple-400 hover:text-purple-300 text-sm mb-4 inline-block">
            « Go back
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">Edit ad</h1>
          <h4 className="text-xl text-slate-400 mb-4">
            masseurmatch.com/{therapist.slug}
          </h4>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                therapist.status === 'active'
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : therapist.status === 'pending'
                  ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {therapist.status === 'active' ? '● Online' : therapist.status === 'pending' ? '● Pending Review' : '● Deactivated'}
            </span>
            <span className="text-slate-400 text-sm">Plan: {therapist.plan || 'Free'}</span>
          </div>
        </div>

        {/* Edit Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.slug}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all"
            >
              {/* Section Header */}
              <div className="px-6 py-4 bg-white/5 border-b border-white/10">
                <h3 className="text-lg font-semibold text-white flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  {section.name}
                </h3>
              </div>

              {/* Section Fields */}
              <div className="px-6 py-4 space-y-4">
                {section.fields.map((field, idx) => {
                  const isEmpty = !field.value || (Array.isArray(field.value) && field.value.length === 0);

                  return (
                    <div key={field.key} className={`${idx > 0 ? 'border-t border-white/5 pt-4' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-2">{field.label}:</div>
                          <div className="text-slate-300">
                            {isEmpty ? (
                              <span className="text-slate-500 italic">[None]</span>
                            ) : section.slug === 'photos' && field.key === 'profile_photo' && field.value ? (
                              <img
                                src={field.value as string}
                                alt="Profile"
                                className="w-32 h-32 rounded-lg object-cover"
                              />
                            ) : section.slug === 'photos' && field.key === 'photos' && Array.isArray(field.value) ? (
                              <div className="grid grid-cols-4 gap-2">
                                {field.value
                                  .filter((photo): photo is string => typeof photo === "string")
                                  .map((photo, i) => (
                                    <img
                                      key={i}
                                      src={photo}
                                      alt={`Photo ${i + 1}`}
                                      className="w-24 h-24 rounded-lg object-cover"
                                    />
                                  ))}
                              </div>
                            ) : typeof field.value === 'object' ? (
                              <pre className="text-sm bg-black/20 p-3 rounded-lg overflow-x-auto">
                                {JSON.stringify(field.value, null, 2)}
                              </pre>
                            ) : (
                              <div className="whitespace-pre-wrap">{String(field.value)}</div>
                            )}
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/ads/${adId}/edit/${section.slug}?field=${field.key}`}
                          className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* SEO Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            SEO Tips for Better Visibility
          </h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Headline:</strong> Include your specialty and location (e.g., "Deep Tissue Massage by John in Miami")</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Summary:</strong> Write 150-300 words describing your unique approach and experience</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Services:</strong> List all techniques you offer - this helps clients find you in searches</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Photos:</strong> Upload high-quality, professional photos (4-8 images recommended)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Complete Profile:</strong> Fill out every section - complete profiles rank higher in search results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span><strong>Keywords:</strong> Naturally mention your city, neighborhood, and massage specialties throughout your text</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
