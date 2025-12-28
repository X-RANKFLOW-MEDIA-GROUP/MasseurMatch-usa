export type SectionField = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "email" | "number";
  placeholder?: string;
  helper?: string;
  rows?: number;
};

export type SectionDefinition = {
  key: string;
  label: string;
  description: string;
  fields: SectionField[];
};

export const sectionDefinitions: SectionDefinition[] = [
  {
    key: "basic",
    label: "Basic Settings",
    description: "Define how your profile shows up in search results and what you offer up front.",
    fields: [
      {
        name: "appointment_types",
        label: "Appointment types (comma separated)",
        placeholder: "in-studio, mobile, hotel",
        helper: "Comma-separated types help match requests.",
      },
      {
        name: "session_length_options",
        label: "Session length options",
        type: "textarea",
        placeholder: "60 min, 90 min, 120 min",
        helper: "Give clients an idea of how long they can book.",
        rows: 3,
      },
      {
        name: "timezone",
        label: "Timezone / city reference",
        placeholder: "America/Los_Angeles",
        helper: "Used to align your availability with clients.",
      },
    ],
  },
  {
    key: "location",
    label: "Location Details",
    description: "Share your studio location, neighborhood, and mobile radius.",
    fields: [
      { name: "address", label: "Studio address", placeholder: "123 Wellness Street" },
      { name: "city", label: "City", placeholder: "Los Angeles" },
      { name: "state", label: "State/region", placeholder: "CA" },
      {
        name: "mobile_radius",
        label: "Mobile service radius (miles)",
        type: "number",
        placeholder: "15",
      },
    ],
  },
  {
    key: "services",
    label: "Services Offered",
    description: "Highlight your most requested services and techniques.",
    fields: [
      {
        name: "services",
        label: "Services summary",
        type: "textarea",
        placeholder: "Deep tissue, sports massage, hot stone",
        helper: "List the services you want clients to see first.",
        rows: 4,
      },
      {
        name: "massage_techniques",
        label: "Massage techniques",
        type: "textarea",
        placeholder: "Swedish, trigger point, lymphatic drainage",
        rows: 3,
      },
    ],
  },
  {
    key: "text",
    label: "Name / Headline / Bio",
    description: "Polish the intro that shows on your public profile.",
    fields: [
      {
        name: "display_name",
        label: "Display name",
        placeholder: "Alex Santos — Deep Tissue Therapist",
      },
      {
        name: "headline",
        label: "Headline",
        placeholder: "Mindful deep tissue massage in Hollywood",
      },
      {
        name: "bio",
        label: "Bio",
        type: "textarea",
        placeholder: "Share what drives your practice and what clients can expect.",
        rows: 5,
      },
    ],
  },
  {
    key: "rates",
    label: "Rates & Payment",
    description: "Show your pricing bands, discounts, and accepted payment methods.",
    fields: [
      { name: "rate_60", label: "60-minute rate", placeholder: "$120" },
      { name: "rate_90", label: "90-minute rate", placeholder: "$160" },
      { name: "rate_outcall", label: "Outcall rate", placeholder: "$180 + travel" },
      {
        name: "payment_methods",
        label: "Payment methods",
        type: "textarea",
        placeholder: "Cash, credit card, Venmo, Zelle",
        rows: 3,
      },
    ],
  },
  {
    key: "hours",
    label: "Hours",
    description: "Describe your weekly rhythm and any special booking windows.",
    fields: [
      {
        name: "hours_summary",
        label: "Availability summary",
        type: "textarea",
        placeholder: "Mon–Thu: 9a–8p, Fri: 9a–6p, Sat: 10a–4p",
        rows: 3,
      },
      {
        name: "appointment_window",
        label: "Preferred appointment notice",
        placeholder: "24 hours notice for weekends",
      },
    ],
  },
  {
    key: "contact",
    label: "Contact Info",
    description: "Update the phone numbers, email, and chat channels central to booking.",
    fields: [
      { name: "phone", label: "Phone", placeholder: "+15551234567" },
      { name: "email", label: "Email", type: "email", placeholder: "alex@masseurmatch.com" },
      {
        name: "whatsapp",
        label: "WhatsApp",
        placeholder: "+1555 123 4567",
        helper: "Optional channel for fast replies.",
      },
    ],
  },
  {
    key: "links",
    label: "Links",
    description: "Provide verified links so visitors can connect beyond the profile.",
    fields: [
      {
        name: "website",
        label: "Website",
        placeholder: "https://alexsantosmassage.com",
      },
      {
        name: "instagram",
        label: "Instagram handle",
        placeholder: "@alexsantosmassage",
      },
      {
        name: "booking_url",
        label: "External booking URL",
        placeholder: "https://book.alexsantosmassage.com",
      },
    ],
  },
  {
    key: "professional",
    label: "Professional Background",
    description: "Share degrees, certifications, languages, and affiliations.",
    fields: [
      {
        name: "degrees",
        label: "Degrees / certifications",
        type: "textarea",
        placeholder: "Certified Massage Therapist — Pacific College",
        rows: 3,
      },
      {
        name: "affiliations",
        label: "Affiliations / memberships",
        type: "textarea",
        placeholder: "AMTA, NCBTMB",
        rows: 2,
      },
      {
        name: "languages",
        label: "Languages spoken",
        placeholder: "English, Spanish, Portuguese",
      },
    ],
  },
  {
    key: "misc",
    label: "Additional Notes",
    description: "Any other information clients should see before messaging.",
    fields: [
      {
        name: "special_notes",
        label: "Special notes",
        type: "textarea",
        placeholder: "Hotel-friendly, CBD-friendly, trained in trauma-informed care.",
        rows: 4,
      },
    ],
  },
  {
    key: "photos",
    label: "Photos",
    description: "Manage your gallery by listing URLs here (one per line).",
    fields: [
      {
        name: "gallery_urls",
        label: "Gallery URLs",
        type: "textarea",
        placeholder: "https://images.example.com/1.jpg",
        helper: "One URL per line. We will show the first few photos.",
        rows: 4,
      },
    ],
  },
];

export const sectionMap: Record<string, SectionDefinition> = sectionDefinitions.reduce(
  (acc, def) => {
    acc[def.key] = def;
    return acc;
  },
  {} as Record<string, SectionDefinition>
);
