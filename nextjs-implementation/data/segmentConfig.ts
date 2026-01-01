export type SegmentConfig = {
  slug: string;
  titleTemplate: (city: string, state?: string) => string;
  descriptionTemplate: (city: string, state?: string) => string;
  narrative: (city: string) => string;
};

export const segmentConfig: Record<string, SegmentConfig> = {
  "deep-tissue": {
    slug: "deep-tissue",
    titleTemplate: (city, state) =>
      `Deep Tissue Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find professional deep tissue therapists in ${city}${state ? `, ${state}` : ""}...`,
    narrative: (city) => `Deep tissue massage in ${city} for targeted pain relief...`,
  },
  "gay-massage": {
    slug: "gay-massage",
    titleTemplate: (city, state) =>
      `Gay Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Explore gay massage therapists in ${city}${state ? `, ${state}` : ""} with verified professionals. Read reviews and book appointments.`,
    narrative: (city) =>
      `Professional gay massage in ${city} with personalized, discreet services focused on your well-being.`,
  },
  "sports-massage": {
    slug: "sports-massage",
    titleTemplate: (city, state) =>
      `Sports Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find sports massage therapists in ${city}${state ? `, ${state}` : ""} specializing in athletic recovery and performance.`,
    narrative: (city) =>
      `Sports massage in ${city} for athletes and active individuals seeking enhanced performance and recovery.`,
  },
  // Add more segments...
};
