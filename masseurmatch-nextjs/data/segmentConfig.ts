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
      `Find professional deep tissue massage therapists in ${city}${state ? `, ${state}` : ""}. Compare verified profiles and book targeted pain relief.`,
    narrative: (city) =>
      `Deep tissue massage in ${city} targets stubborn tension, knots, and overworked muscles with focused, therapeutic pressure.`,
  },
  "gay-massage": {
    slug: "gay-massage",
    titleTemplate: (city, state) =>
      `Gay Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Explore gay massage therapists in ${city}${state ? `, ${state}` : ""} with verified professionals. Review specialties and availability.`,
    narrative: (city) =>
      `Professional gay massage in ${city} with personalized, discreet services focused on your well-being.`,
  },
  "gay-bodywork": {
    slug: "gay-bodywork",
    titleTemplate: (city, state) =>
      `Gay Bodywork in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find gay bodywork professionals in ${city}${state ? `, ${state}` : ""} offering respectful, client-focused sessions.`,
    narrative: (city) =>
      `Gay bodywork in ${city} connects you with therapists who prioritize comfort, clear boundaries, and professional care.`,
  },
  "gay-friendly-massage": {
    slug: "gay-friendly-massage",
    titleTemplate: (city, state) =>
      `Gay-Friendly Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Discover gay-friendly massage therapists in ${city}${state ? `, ${state}` : ""} who emphasize inclusive, respectful service.`,
    narrative: (city) =>
      `Gay-friendly massage in ${city} highlights providers who welcome LGBT clients with clear communication and safe environments.`,
  },
  "gay-spa": {
    slug: "gay-spa",
    titleTemplate: (city, state) =>
      `Gay Spa Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Browse gay spa-style massage in ${city}${state ? `, ${state}` : ""} for a calm, upscale experience.`,
    narrative: (city) =>
      `Gay spa massage in ${city} focuses on relaxing, high-comfort sessions with professional, discreet service.`,
  },
  "hotel-massage": {
    slug: "hotel-massage",
    titleTemplate: (city, state) =>
      `Hotel Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Book hotel-friendly massage therapists in ${city}${state ? `, ${state}` : ""} for convenient in-room sessions.`,
    narrative: (city) =>
      `Hotel massage in ${city} helps travelers recover fast with therapists who understand hotel check-in policies and timing.`,
  },
  "hot-stone": {
    slug: "hot-stone",
    titleTemplate: (city, state) =>
      `Hot Stone Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find hot stone massage in ${city}${state ? `, ${state}` : ""} for deep relaxation and muscle comfort.`,
    narrative: (city) =>
      `Hot stone massage in ${city} uses gentle heat to relax muscles and enhance stress relief.`,
  },
  "late-night-massage": {
    slug: "late-night-massage",
    titleTemplate: (city, state) =>
      `Late Night Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Browse late-night massage availability in ${city}${state ? `, ${state}` : ""} for after-hours recovery and relaxation.`,
    narrative: (city) =>
      `Late night massage in ${city} helps busy schedules with flexible evening and night appointments.`,
  },
  "lgbt-massage": {
    slug: "lgbt-massage",
    titleTemplate: (city, state) =>
      `LGBT Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Connect with LGBT-friendly massage therapists in ${city}${state ? `, ${state}` : ""} who prioritize inclusivity.`,
    narrative: (city) =>
      `LGBT massage in ${city} focuses on affirming, client-centered care with clear boundaries.`,
  },
  "lymphatic-drainage": {
    slug: "lymphatic-drainage",
    titleTemplate: (city, state) =>
      `Lymphatic Drainage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find lymphatic drainage specialists in ${city}${state ? `, ${state}` : ""} for gentle, restorative sessions.`,
    narrative: (city) =>
      `Lymphatic drainage in ${city} offers light-pressure techniques aimed at recovery and wellness.`,
  },
  "m4m-massage": {
    slug: "m4m-massage",
    titleTemplate: (city, state) =>
      `M4M Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Explore M4M massage providers in ${city}${state ? `, ${state}` : ""} offering professional, discreet sessions.`,
    narrative: (city) =>
      `M4M massage in ${city} connects clients with male therapists focused on comfort and professionalism.`,
  },
  "male-massage": {
    slug: "male-massage",
    titleTemplate: (city, state) =>
      `Male Massage Therapists in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find male massage therapists in ${city}${state ? `, ${state}` : ""} with verified profiles and clear availability.`,
    narrative: (city) =>
      `Male massage therapists in ${city} provide skilled bodywork tailored to your goals.`,
  },
  "men-only-massage": {
    slug: "men-only-massage",
    titleTemplate: (city, state) =>
      `Men-Only Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Browse men-only massage options in ${city}${state ? `, ${state}` : ""} with clear boundaries and professional care.`,
    narrative: (city) =>
      `Men-only massage in ${city} highlights therapists who focus on men’s wellness needs and comfort.`,
  },
  "mobile-massage": {
    slug: "mobile-massage",
    titleTemplate: (city, state) =>
      `Mobile Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Book mobile massage therapists in ${city}${state ? `, ${state}` : ""} who travel to hotels, homes, or offices.`,
    narrative: (city) =>
      `Mobile massage in ${city} delivers convenient sessions wherever you are, with transparent travel details.`,
  },
  "myofascial-release": {
    slug: "myofascial-release",
    titleTemplate: (city, state) =>
      `Myofascial Release in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find myofascial release specialists in ${city}${state ? `, ${state}` : ""} for slow, targeted relief.`,
    narrative: (city) =>
      `Myofascial release in ${city} focuses on connective tissue to improve mobility and ease chronic tension.`,
  },
  "neck-pain": {
    slug: "neck-pain",
    titleTemplate: (city, state) =>
      `Neck Pain Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find massage therapists in ${city}${state ? `, ${state}` : ""} who specialize in neck and shoulder relief.`,
    narrative: (city) =>
      `Neck pain massage in ${city} targets stiffness from desk work, travel, and stress.`,
  },
  "prenatal-massage": {
    slug: "prenatal-massage",
    titleTemplate: (city, state) =>
      `Prenatal Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Browse prenatal massage providers in ${city}${state ? `, ${state}` : ""} focused on comfort and safety.`,
    narrative: (city) =>
      `Prenatal massage in ${city} offers gentle, supportive care designed for each stage of pregnancy.`,
  },
  "relaxation": {
    slug: "relaxation",
    titleTemplate: (city, state) =>
      `Relaxation Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find relaxation massage therapists in ${city}${state ? `, ${state}` : ""} for calming, low-stress sessions.`,
    narrative: (city) =>
      `Relaxation massage in ${city} helps clients unwind with gentle, steady pressure and a quiet reset.`,
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
  "stress-relief": {
    slug: "stress-relief",
    titleTemplate: (city, state) =>
      `Stress Relief Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Discover stress relief massage in ${city}${state ? `, ${state}` : ""} with therapists who focus on calming techniques.`,
    narrative: (city) =>
      `Stress relief massage in ${city} helps reset the nervous system and restore balance.`,
  },
  "swedish-massage": {
    slug: "swedish-massage",
    titleTemplate: (city, state) =>
      `Swedish Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find Swedish massage therapists in ${city}${state ? `, ${state}` : ""} for classic relaxation and comfort.`,
    narrative: (city) =>
      `Swedish massage in ${city} uses flowing strokes to ease tension and promote overall wellness.`,
  },
  "thai-massage": {
    slug: "thai-massage",
    titleTemplate: (city, state) =>
      `Thai Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Explore Thai massage in ${city}${state ? `, ${state}` : ""} for stretching, mobility, and energy work.`,
    narrative: (city) =>
      `Thai massage in ${city} combines assisted stretching and pressure techniques to improve flexibility.`,
  },
  "back-pain": {
    slug: "back-pain",
    titleTemplate: (city, state) =>
      `Back Pain Massage in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Find massage therapists in ${city}${state ? `, ${state}` : ""} who focus on back pain relief and recovery.`,
    narrative: (city) =>
      `Back pain massage in ${city} targets tight hips, lower back strain, and posture-related discomfort.`,
  },
  "trigger-point": {
    slug: "trigger-point",
    titleTemplate: (city, state) =>
      `Trigger Point Therapy in ${city}${state ? `, ${state}` : ""} | MasseurMatch`,
    descriptionTemplate: (city, state) =>
      `Book trigger point therapy in ${city}${state ? `, ${state}` : ""} for precise relief of referred pain.`,
    narrative: (city) =>
      `Trigger point therapy in ${city} addresses tight knots to ease pain and restore mobility.`,
  },
};
