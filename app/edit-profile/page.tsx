"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Camera, Save, Loader2, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { supabase } from "@/src/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

// Comprehensive profile data type
interface ProfileData {
  // Basic Information
  full_name: string;
  display_name: string;
  professional_title: string;
  about: string;
  philosophy: string;

  // Location & Service Area
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  service_radius: string;
  in_studio: boolean;
  mobile_service: boolean;
  hotel_visits: boolean;

  // Service Offerings
  massage_techniques: string[];
  studio_amenities: string[];
  mobile_extras: string[];
  product_sales: string[];

  // Rates & Pricing
  rate_60: string;
  rate_90: string;
  rate_120: string;
  payment_methods: string[];
  discount_new_client: string;
  discount_multiple_sessions: string;
  discount_referrals: string;
  discount_group: string;

  // Weekly Availability
  weekly_schedule: {
    [key: string]: {
      studio_start: string;
      studio_end: string;
      mobile_start: string;
      mobile_end: string;
    };
  };

  // Professional Credentials
  degrees_certifications: string;
  years_experience: string;
  professional_affiliations: string;
  languages: string[];

  // Business Travel
  travel_schedule: string;

  // Social Media & Contact
  website: string;
  instagram: string;
  whatsapp: string;

  // Client Preferences
  preference_lgbtq_only: boolean;
  preference_men_only: boolean;
}

// Constants for options
const MASSAGE_TECHNIQUES = [
  "Swedish Massage",
  "Deep Tissue",
  "Sports Massage",
  "Hot Stone",
  "Thai Massage",
  "Prenatal Massage",
  "Reflexology",
  "Aromatherapy",
  "Trigger Point Therapy",
  "Shiatsu",
  "Myofascial Release",
  "Lymphatic Drainage",
];

const STUDIO_AMENITIES = [
  "Shower Available",
  "Hot Tub",
  "Sauna",
  "Steam Room",
  "Private Parking",
  "Music Selection",
  "Temperature Control",
  "Essential Oils",
];

const MOBILE_EXTRAS = [
  "Portable Table",
  "Linens Provided",
  "Music System",
  "Aromatherapy Kit",
  "Hot Stones",
  "Massage Chair",
];

const PRODUCT_SALES = [
  "Essential Oils",
  "Massage Oils",
  "CBD Products",
  "Stretching Tools",
  "Self-Care Products",
];

const PAYMENT_METHODS = [
  "Cash",
  "Credit/Debit Card",
  "Venmo",
  "Zelle",
  "PayPal",
  "Apple Pay",
];

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Italian",
  "Mandarin",
  "Japanese",
  "Korean",
  "Russian",
];

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Reusable Components
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-neutral-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-neutral-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none transition-colors"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-neutral-500 focus:border-white/30 focus:outline-none resize-none transition-colors"
      />
    </div>
  );
}

function CheckboxGrid({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-3">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            type="button"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selected.includes(option)
                ? "bg-white text-black"
                : "bg-white/5 text-neutral-400 hover:text-white border border-white/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleSwitch({
  label,
  enabled,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-neutral-300">{label}</label>
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          enabled ? "bg-white" : "bg-white/20"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);

  const [profile, setProfile] = useState<ProfileData>({
    // Basic Information
    full_name: "",
    display_name: "",
    professional_title: "",
    about: "",
    philosophy: "",

    // Location & Service Area
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    service_radius: "",
    in_studio: false,
    mobile_service: false,
    hotel_visits: false,

    // Service Offerings
    massage_techniques: [],
    studio_amenities: [],
    mobile_extras: [],
    product_sales: [],

    // Rates & Pricing
    rate_60: "",
    rate_90: "",
    rate_120: "",
    payment_methods: [],
    discount_new_client: "",
    discount_multiple_sessions: "",
    discount_referrals: "",
    discount_group: "",

    // Weekly Availability
    weekly_schedule: DAYS_OF_WEEK.reduce((acc, day) => ({
      ...acc,
      [day]: {
        studio_start: "",
        studio_end: "",
        mobile_start: "",
        mobile_end: "",
      },
    }), {}),

    // Professional Credentials
    degrees_certifications: "",
    years_experience: "",
    professional_affiliations: "",
    languages: [],

    // Business Travel
    travel_schedule: "",

    // Social Media & Contact
    website: "",
    instagram: "",
    whatsapp: "",

    // Client Preferences
    preference_lgbtq_only: false,
    preference_men_only: false,
  });

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login?redirect=/edit-profile");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setProfile({
          // Basic Information
          full_name: data.full_name || "",
          display_name: data.display_name || "",
          professional_title: data.professional_title || "",
          about: data.about || "",
          philosophy: data.philosophy || "",

          // Location & Service Area
          street_address: data.street_address || "",
          city: data.city || "",
          state: data.state || "",
          zip_code: data.zip_code || "",
          service_radius: data.service_radius || "",
          in_studio: data.in_studio || false,
          mobile_service: data.mobile_service || false,
          hotel_visits: data.hotel_visits || false,

          // Service Offerings
          massage_techniques: data.massage_techniques || [],
          studio_amenities: data.studio_amenities || [],
          mobile_extras: data.mobile_extras || [],
          product_sales: data.product_sales || [],

          // Rates & Pricing
          rate_60: data.rate_60 || "",
          rate_90: data.rate_90 || "",
          rate_120: data.rate_120 || "",
          payment_methods: data.payment_methods || [],
          discount_new_client: data.discount_new_client || "",
          discount_multiple_sessions: data.discount_multiple_sessions || "",
          discount_referrals: data.discount_referrals || "",
          discount_group: data.discount_group || "",

          // Weekly Availability
          weekly_schedule: data.weekly_schedule || DAYS_OF_WEEK.reduce((acc, day) => ({
            ...acc,
            [day]: {
              studio_start: "",
              studio_end: "",
              mobile_start: "",
              mobile_end: "",
            },
          }), {}),

          // Professional Credentials
          degrees_certifications: data.degrees_certifications || "",
          years_experience: data.years_experience || "",
          professional_affiliations: data.professional_affiliations || "",
          languages: data.languages || [],

          // Business Travel
          travel_schedule: data.travel_schedule || "",

          // Social Media & Contact
          website: data.website || "",
          instagram: data.instagram || "",
          whatsapp: data.whatsapp || "",

          // Client Preferences
          preference_lgbtq_only: data.preference_lgbtq_only || false,
          preference_men_only: data.preference_men_only || false,
        });

        setGalleryPhotos(data.gallery_photos || []);
      }
      setLoading(false);
    }
    fetchProfile();
  }, [router]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const updateSchedule = (day: string, field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      weekly_schedule: {
        ...prev.weekly_schedule,
        [day]: {
          ...prev.weekly_schedule[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        ...profile,
        gallery_photos: galleryPhotos,
        updated_at: new Date().toISOString(),
      });

    setSaving(false);
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/5 glass sticky top-0 z-50">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 font-medium text-black hover:bg-neutral-200 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-3">Edit Your Profile</h1>
          <p className="text-neutral-400 mb-12">
            Complete your profile to attract more clients and showcase your expertise
          </p>

          <div className="space-y-6">
            {/* Photo Gallery */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Profile Photo</h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-neutral-100/20 flex items-center justify-center border border-white/10">
                    <span className="text-4xl">👤</span>
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Upload Profile Photo</h3>
                  <p className="text-sm text-neutral-400">Click the camera icon to upload a professional photo</p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <CollapsibleSection title="Basic Information" defaultOpen={true}>
              <InputField
                label="Full Name"
                value={profile.full_name}
                onChange={(value) => updateProfile({ full_name: value })}
                placeholder="John Michael Smith"
              />
              <InputField
                label="Display Name"
                value={profile.display_name}
                onChange={(value) => updateProfile({ display_name: value })}
                placeholder="John Smith"
              />
              <InputField
                label="Professional Title"
                value={profile.professional_title}
                onChange={(value) => updateProfile({ professional_title: value })}
                placeholder="Licensed Massage Therapist, LMT"
              />
              <TextAreaField
                label="About Me"
                value={profile.about}
                onChange={(value) => updateProfile({ about: value })}
                placeholder="Tell clients about your background, experience, and what makes your practice unique..."
                rows={4}
              />
              <TextAreaField
                label="My Philosophy"
                value={profile.philosophy}
                onChange={(value) => updateProfile({ philosophy: value })}
                placeholder="Describe your approach to massage therapy and client care..."
                rows={3}
              />
            </CollapsibleSection>

            {/* Location & Service Area */}
            <CollapsibleSection title="Location & Service Area">
              <InputField
                label="Street Address"
                value={profile.street_address}
                onChange={(value) => updateProfile({ street_address: value })}
                placeholder="123 Main Street, Suite 200"
              />
              <div className="grid md:grid-cols-3 gap-4">
                <InputField
                  label="City"
                  value={profile.city}
                  onChange={(value) => updateProfile({ city: value })}
                  placeholder="Los Angeles"
                />
                <InputField
                  label="State"
                  value={profile.state}
                  onChange={(value) => updateProfile({ state: value })}
                  placeholder="CA"
                />
                <InputField
                  label="ZIP Code"
                  value={profile.zip_code}
                  onChange={(value) => updateProfile({ zip_code: value })}
                  placeholder="90001"
                />
              </div>
              <InputField
                label="Service Radius (miles)"
                value={profile.service_radius}
                onChange={(value) => updateProfile({ service_radius: value })}
                placeholder="15"
                type="number"
              />
              <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-medium text-white mb-2">Service Types Offered</h3>
                <ToggleSwitch
                  label="In-Studio Sessions"
                  enabled={profile.in_studio}
                  onChange={(value) => updateProfile({ in_studio: value })}
                />
                <ToggleSwitch
                  label="Mobile/Outcall Service"
                  enabled={profile.mobile_service}
                  onChange={(value) => updateProfile({ mobile_service: value })}
                />
                <ToggleSwitch
                  label="Hotel/Travel Visits"
                  enabled={profile.hotel_visits}
                  onChange={(value) => updateProfile({ hotel_visits: value })}
                />
              </div>
            </CollapsibleSection>

            {/* Service Offerings & Techniques */}
            <CollapsibleSection title="Service Offerings & Techniques">
              <CheckboxGrid
                label="Massage Techniques"
                options={MASSAGE_TECHNIQUES}
                selected={profile.massage_techniques}
                onChange={(value) => updateProfile({ massage_techniques: value })}
              />
              <CheckboxGrid
                label="Studio Amenities"
                options={STUDIO_AMENITIES}
                selected={profile.studio_amenities}
                onChange={(value) => updateProfile({ studio_amenities: value })}
              />
              <CheckboxGrid
                label="Mobile Service Extras"
                options={MOBILE_EXTRAS}
                selected={profile.mobile_extras}
                onChange={(value) => updateProfile({ mobile_extras: value })}
              />
              <CheckboxGrid
                label="Products for Sale"
                options={PRODUCT_SALES}
                selected={profile.product_sales}
                onChange={(value) => updateProfile({ product_sales: value })}
              />
            </CollapsibleSection>

            {/* Rates, Payment & Discounts */}
            <CollapsibleSection title="Rates, Payment & Discounts">
              <div className="grid md:grid-cols-3 gap-4">
                <InputField
                  label="60 Minutes"
                  value={profile.rate_60}
                  onChange={(value) => updateProfile({ rate_60: value })}
                  placeholder="$80"
                />
                <InputField
                  label="90 Minutes"
                  value={profile.rate_90}
                  onChange={(value) => updateProfile({ rate_90: value })}
                  placeholder="$120"
                />
                <InputField
                  label="120 Minutes"
                  value={profile.rate_120}
                  onChange={(value) => updateProfile({ rate_120: value })}
                  placeholder="$160"
                />
              </div>
              <CheckboxGrid
                label="Accepted Payment Methods"
                options={PAYMENT_METHODS}
                selected={profile.payment_methods}
                onChange={(value) => updateProfile({ payment_methods: value })}
              />
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                <h3 className="text-sm font-medium text-white">Special Discounts & Promotions</h3>
                <InputField
                  label="New Client Discount"
                  value={profile.discount_new_client}
                  onChange={(value) => updateProfile({ discount_new_client: value })}
                  placeholder="e.g., 20% off first session"
                />
                <InputField
                  label="Multiple Sessions Package"
                  value={profile.discount_multiple_sessions}
                  onChange={(value) => updateProfile({ discount_multiple_sessions: value })}
                  placeholder="e.g., Buy 5 sessions, get 1 free"
                />
                <InputField
                  label="Referral Discount"
                  value={profile.discount_referrals}
                  onChange={(value) => updateProfile({ discount_referrals: value })}
                  placeholder="e.g., $10 off for each referral"
                />
                <InputField
                  label="Group/Couples Discount"
                  value={profile.discount_group}
                  onChange={(value) => updateProfile({ discount_group: value })}
                  placeholder="e.g., 15% off couples massage"
                />
              </div>
            </CollapsibleSection>

            {/* Weekly Availability Schedule */}
            <CollapsibleSection title="Weekly Availability Schedule">
              <div className="space-y-6">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="text-sm font-semibold text-white mb-4">{day}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <p className="text-xs text-neutral-400 font-medium">In-Studio Hours</p>
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="Start"
                            value={profile.weekly_schedule[day].studio_start}
                            onChange={(value) => updateSchedule(day, "studio_start", value)}
                            placeholder="9:00 AM"
                          />
                          <InputField
                            label="End"
                            value={profile.weekly_schedule[day].studio_end}
                            onChange={(value) => updateSchedule(day, "studio_end", value)}
                            placeholder="6:00 PM"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs text-neutral-400 font-medium">Mobile Hours</p>
                        <div className="grid grid-cols-2 gap-3">
                          <InputField
                            label="Start"
                            value={profile.weekly_schedule[day].mobile_start}
                            onChange={(value) => updateSchedule(day, "mobile_start", value)}
                            placeholder="10:00 AM"
                          />
                          <InputField
                            label="End"
                            value={profile.weekly_schedule[day].mobile_end}
                            onChange={(value) => updateSchedule(day, "mobile_end", value)}
                            placeholder="8:00 PM"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* Professional Credentials */}
            <CollapsibleSection title="Professional Credentials">
              <TextAreaField
                label="Degrees & Certifications"
                value={profile.degrees_certifications}
                onChange={(value) => updateProfile({ degrees_certifications: value })}
                placeholder="List your degrees, certifications, and licenses..."
                rows={3}
              />
              <InputField
                label="Years of Experience"
                value={profile.years_experience}
                onChange={(value) => updateProfile({ years_experience: value })}
                placeholder="5"
                type="number"
              />
              <TextAreaField
                label="Professional Affiliations"
                value={profile.professional_affiliations}
                onChange={(value) => updateProfile({ professional_affiliations: value })}
                placeholder="e.g., AMTA, ABMP, state massage board..."
                rows={2}
              />
              <CheckboxGrid
                label="Languages Spoken"
                options={LANGUAGES}
                selected={profile.languages}
                onChange={(value) => updateProfile({ languages: value })}
              />
            </CollapsibleSection>

            {/* Business Travel Schedule */}
            <CollapsibleSection title="Business Travel Schedule">
              <TextAreaField
                label="Travel Schedule & Locations"
                value={profile.travel_schedule}
                onChange={(value) => updateProfile({ travel_schedule: value })}
                placeholder="e.g., 'Available in NYC first week of every month' or 'Traveling to Miami quarterly'"
                rows={4}
              />
            </CollapsibleSection>

            {/* Photo Gallery */}
            <CollapsibleSection title="Photo Gallery">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Gallery Photos (Studio, workspace, certifications)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {galleryPhotos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-xl bg-white/5 border border-white/10 overflow-hidden group">
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        📷
                      </div>
                      <button
                        onClick={() => setGalleryPhotos(galleryPhotos.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setGalleryPhotos([...galleryPhotos, "new-photo"])}
                    className="aspect-square rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 flex flex-col items-center justify-center gap-2 transition-colors group"
                  >
                    <Plus className="h-8 w-8 text-neutral-400 group-hover:text-white transition-colors" />
                    <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">
                      Add Photo
                    </span>
                  </button>
                </div>
              </div>
            </CollapsibleSection>

            {/* Social Media & Contact */}
            <CollapsibleSection title="Social Media & Contact">
              <InputField
                label="Website"
                value={profile.website}
                onChange={(value) => updateProfile({ website: value })}
                placeholder="https://yourwebsite.com"
                type="url"
              />
              <InputField
                label="Instagram"
                value={profile.instagram}
                onChange={(value) => updateProfile({ instagram: value })}
                placeholder="@yourusername"
              />
              <InputField
                label="WhatsApp"
                value={profile.whatsapp}
                onChange={(value) => updateProfile({ whatsapp: value })}
                placeholder="+1 (555) 123-4567"
                type="tel"
              />
            </CollapsibleSection>

            {/* Client Preferences */}
            <CollapsibleSection title="Client Preferences">
              <div className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-neutral-400 mb-4">
                  Set your client preferences to help match with the right clients
                </p>
                <ToggleSwitch
                  label="LGBTQ+ Clients Only"
                  enabled={profile.preference_lgbtq_only}
                  onChange={(value) => updateProfile({ preference_lgbtq_only: value })}
                />
                <ToggleSwitch
                  label="Male Clients Only"
                  enabled={profile.preference_men_only}
                  onChange={(value) => updateProfile({ preference_men_only: value })}
                />
              </div>
            </CollapsibleSection>
          </div>

          {/* Bottom Save Button */}
          <div className="mt-12 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-black hover:bg-neutral-200 disabled:opacity-50 transition-all"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
