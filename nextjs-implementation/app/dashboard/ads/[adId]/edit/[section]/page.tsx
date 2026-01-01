import { redirect, notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase';
import EditSectionForm from '@/components/dashboard/EditSectionForm';

export const metadata = {
  title: 'Edit Section | Dashboard',
  robots: { index: false, follow: false },
};

const validSections = [
  'basic',
  'location',
  'services',
  'text',
  'rates',
  'hours',
  'contact',
  'links',
  'misc',
  'photos',
];

const sectionConfig: Record<string, { title: string; description: string }> = {
  basic: {
    title: 'Basic Settings',
    description: 'Configure appointment types and basic preferences',
  },
  location: {
    title: 'Location',
    description: 'Set your location, address, and service areas',
  },
  services: {
    title: 'Your Services',
    description: 'Define massage techniques, amenities, and services you offer',
  },
  text: {
    title: 'Name / Headline / Text',
    description: 'Write your profile headline and introduction',
  },
  rates: {
    title: 'Rates & Payment',
    description: 'Set your rates, payment methods, and discounts',
  },
  hours: {
    title: 'Hours',
    description: 'Configure your availability schedule',
  },
  contact: {
    title: 'Contact Info',
    description: 'Add your contact information',
  },
  links: {
    title: 'Links',
    description: 'Add your website, social media, and booking links',
  },
  misc: {
    title: 'Professional Development / Miscellaneous',
    description: 'Add certifications, languages, affiliations, and business trips',
  },
  photos: {
    title: 'Photos',
    description: 'Upload and manage your profile photos',
  },
};

export default async function EditSectionPage({
  params,
}: {
  params: { adId: string; section: string };
}) {
  // Validate section
  if (!validSections.includes(params.section)) {
    notFound();
  }

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

  const config = sectionConfig[params.section];

  return (
    <div className="edit-section-page">
      <div className="page-header">
        <div>
          <h1>{config.title}</h1>
          <p className="section-description">{config.description}</p>
        </div>
        <a href={`/dashboard/ads/${params.adId}/edit`} className="btn-secondary">
          ← Back to All Sections
        </a>
      </div>

      <EditSectionForm
        section={params.section}
        therapist={therapist}
        adId={params.adId}
      />
    </div>
  );
}

// Generate static params for all valid sections
export async function generateStaticParams() {
  return validSections.map((section) => ({
    section,
  }));
}
