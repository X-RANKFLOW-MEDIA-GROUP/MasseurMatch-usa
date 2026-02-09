export type NeighborhoodHub = {
  slug: string;
  name: string;
  summary: string;
  highlights: string[];
};

export type CityHub = {
  slug: string;
  name: string;
  state: string;
  stateCode: string;
  region: string;
  hero: string;
  summary: string;
  vibe: string[];
  neighborhoods: NeighborhoodHub[];
  keywords: string[];
};

export const US_CITY_HUBS: CityHub[] = [
  {
    slug: "new-york-city",
    name: "New York City",
    state: "New York",
    stateCode: "NY",
    region: "Northeast",
    hero:
      "Premium gay massage in NYC, curated for discretion, professionalism, and seamless booking.",
    summary:
      "Explore Manhattan, Brooklyn, and Queens with specialists in deep tissue, sports recovery, and luxury wellness.",
    vibe: [
      "High-end studios and in-call suites",
      "Fast-response mobile professionals",
      "Multilingual therapists for international visitors",
    ],
    neighborhoods: [
      {
        slug: "manhattan",
        name: "Manhattan",
        summary:
          "Luxury-focused therapists with private studio access near Midtown and Downtown.",
        highlights: ["Midtown", "Chelsea", "SoHo"],
      },
      {
        slug: "brooklyn",
        name: "Brooklyn",
        summary:
          "Creative, boutique wellness spaces with calm, restorative vibes.",
        highlights: ["Williamsburg", "DUMBO", "Park Slope"],
      },
      {
        slug: "queens",
        name: "Queens",
        summary:
          "Diverse, affordable sessions and highly flexible scheduling.",
        highlights: ["Astoria", "Long Island City", "Flushing"],
      },
    ],
    keywords: [
      "gay massage nyc",
      "male massage nyc",
      "lgbtq massage manhattan",
      "sports massage brooklyn",
    ],
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "Los Angeles gay massage with Hollywood polish, bodywork expertise, and wellness-first service.",
    summary:
      "From West Hollywood to Santa Monica, discover therapists with spa-grade technique and modern amenities.",
    vibe: [
      "Celebrity-level discretion",
      "Luxury in-call studios",
      "Outdoor wellness and recovery focus",
    ],
    neighborhoods: [
      {
        slug: "west-hollywood",
        name: "West Hollywood",
        summary:
          "Flagship destination for LGBTQ+ wellness and premium experiences.",
        highlights: ["Sunset Strip", "Beverly Grove", "Melrose"],
      },
      {
        slug: "santa-monica",
        name: "Santa Monica",
        summary:
          "Beach-adjacent professionals ideal for recovery and relaxation.",
        highlights: ["Ocean Ave", "Main Street", "Palisades"],
      },
      {
        slug: "dtla",
        name: "Downtown LA",
        summary:
          "Urban studios with quick availability and flexible hours.",
        highlights: ["Arts District", "South Park", "Little Tokyo"],
      },
    ],
    keywords: [
      "gay massage los angeles",
      "male massage weho",
      "sports massage santa monica",
      "lgbt massage dtla",
    ],
  },
  {
    slug: "miami",
    name: "Miami",
    state: "Florida",
    stateCode: "FL",
    region: "South",
    hero:
      "Miami gay massage designed for sun-soaked recovery, VIP discretion, and bilingual service.",
    summary:
      "Browse elite therapists across South Beach, Brickell, and Wynwood.",
    vibe: [
      "Bilingual Spanish/English options",
      "High-energy travel-ready pros",
      "Beach wellness and detox focus",
    ],
    neighborhoods: [
      {
        slug: "south-beach",
        name: "South Beach",
        summary:
          "Luxury visits for travelers and locals seeking premium sessions.",
        highlights: ["Ocean Drive", "Lincoln Road", "Flamingo Park"],
      },
      {
        slug: "brickell",
        name: "Brickell",
        summary:
          "Executive-friendly sessions with fast scheduling.",
        highlights: ["Brickell Ave", "Mary Brickell Village", "Financial District"],
      },
      {
        slug: "wynwood",
        name: "Wynwood",
        summary:
          "Art-forward wellness studios and curated experiences.",
        highlights: ["Wynwood Walls", "Design District", "Midtown"],
      },
    ],
    keywords: [
      "gay massage miami",
      "male massage south beach",
      "lgbt massage brickell",
      "bilingual massage miami",
    ],
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    region: "Midwest",
    hero:
      "Chicago gay massage built for deep recovery, winter wellness, and refined professionalism.",
    summary:
      "From Lakeview to West Loop, find specialists in sports, deep tissue, and restorative care.",
    vibe: [
      "Reliable appointment windows",
      "Deep tissue specialists",
      "LGBTQ+ friendly studios",
    ],
    neighborhoods: [
      {
        slug: "lakeview",
        name: "Lakeview",
        summary:
          "Trusted neighborhood for LGBTQ+ wellness and community care.",
        highlights: ["Boystown", "Belmont Harbor", "Halsted"],
      },
      {
        slug: "west-loop",
        name: "West Loop",
        summary:
          "Upscale sessions near restaurants and luxury residences.",
        highlights: ["Fulton Market", "Randolph", "Greektown"],
      },
      {
        slug: "river-north",
        name: "River North",
        summary:
          "Convenient, modern studios with late availability.",
        highlights: ["Merchandise Mart", "Magnificent Mile", "Gold Coast"],
      },
    ],
    keywords: [
      "gay massage chicago",
      "male massage lakeview",
      "lgbt massage west loop",
      "sports massage chicago",
    ],
  },
  {
    slug: "dallas",
    name: "Dallas",
    state: "Texas",
    stateCode: "TX",
    region: "South",
    hero:
      "Dallas gay massage tailored for recovery, comfort, and business-friendly scheduling.",
    summary:
      "Discover trusted therapists in Uptown, Oak Lawn, and Deep Ellum.",
    vibe: [
      "Mobile and in-call flexibility",
      "Professional studios with privacy",
      "Trusted local favorites",
    ],
    neighborhoods: [
      {
        slug: "uptown",
        name: "Uptown",
        summary:
          "High-end, discreet settings with premium amenities.",
        highlights: ["West Village", "State Thomas", "Katy Trail"],
      },
      {
        slug: "oak-lawn",
        name: "Oak Lawn",
        summary:
          "LGBTQ+ hub with strong community trust.",
        highlights: ["Cedar Springs", "Turtle Creek", "Oak Lawn Ave"],
      },
      {
        slug: "deep-ellum",
        name: "Deep Ellum",
        summary:
          "Creative wellness spaces and late-night availability.",
        highlights: ["Main Street", "Good Latimer", "Elm Street"],
      },
    ],
    keywords: [
      "gay massage dallas",
      "male massage oak lawn",
      "lgbt massage uptown dallas",
      "sports massage dallas",
    ],
  },
  {
    slug: "san-francisco",
    name: "San Francisco",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "San Francisco gay massage with mindful bodywork and premium wellness culture.",
    summary:
      "Explore Castro, SoMa, and Mission District for expert therapists.",
    vibe: [
      "Mindfulness and bodywork expertise",
      "Tech-friendly scheduling",
      "Inclusive, verified profiles",
    ],
    neighborhoods: [
      {
        slug: "castro",
        name: "Castro",
        summary:
          "Historic LGBTQ+ neighborhood with trusted wellness pros.",
        highlights: ["Castro Street", "Market Street", "Duboce"],
      },
      {
        slug: "soma",
        name: "SoMa",
        summary:
          "Modern studios with flexible booking windows.",
        highlights: ["Yerba Buena", "South Beach", "Mission Bay"],
      },
      {
        slug: "mission",
        name: "Mission District",
        summary:
          "Boutique services and culturally rich experiences.",
        highlights: ["Valencia", "Dolores Park", "24th Street"],
      },
    ],
    keywords: [
      "gay massage san francisco",
      "male massage castro",
      "lgbt massage soma",
      "sports massage sf",
    ],
  },
  {
    slug: "las-vegas",
    name: "Las Vegas",
    state: "Nevada",
    stateCode: "NV",
    region: "West",
    hero:
      "Las Vegas gay massage for travelers, recovery, and premium hotel visits.",
    summary:
      "Find discreet professionals near The Strip, Downtown, and Summerlin.",
    vibe: [
      "Travel-ready mobile therapists",
      "Hotel-friendly scheduling",
      "Late-night availability",
    ],
    neighborhoods: [
      {
        slug: "the-strip",
        name: "The Strip",
        summary:
          "Luxury and convenience for visitors and conventions.",
        highlights: ["Resort Corridor", "CityCenter", "Paradise"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Boutique settings with flexible appointment windows.",
        highlights: ["Fremont East", "Arts District", "Symphony Park"],
      },
      {
        slug: "summerlin",
        name: "Summerlin",
        summary:
          "Quiet, upscale locations for longer sessions.",
        highlights: ["Downtown Summerlin", "The Ridges", "Red Rock"],
      },
    ],
    keywords: [
      "gay massage las vegas",
      "male massage the strip",
      "lgbt massage vegas",
      "hotel massage vegas",
    ],
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "Georgia",
    stateCode: "GA",
    region: "South",
    hero:
      "Atlanta gay massage with trusted professionals and Southern hospitality.",
    summary:
      "Browse Buckhead, Midtown, and Old Fourth Ward for premium bodywork.",
    vibe: [
      "Warm, professional service",
      "Easy booking for travelers",
      "Wellness-first culture",
    ],
    neighborhoods: [
      {
        slug: "midtown",
        name: "Midtown",
        summary:
          "Central, LGBTQ+ friendly sessions near arts and nightlife.",
        highlights: ["Piedmont", "Ansley Park", "Peachtree"],
      },
      {
        slug: "buckhead",
        name: "Buckhead",
        summary:
          "Luxury appointments in upscale studios.",
        highlights: ["Lenox", "Phipps", "Chastain"],
      },
      {
        slug: "old-fourth-ward",
        name: "Old Fourth Ward",
        summary:
          "Boutique wellness in a creative neighborhood.",
        highlights: ["BeltLine", "Krog Street", "Inman Park"],
      },
    ],
    keywords: [
      "gay massage atlanta",
      "male massage midtown atlanta",
      "lgbt massage buckhead",
      "sports massage atlanta",
    ],
  },
  {
    slug: "seattle",
    name: "Seattle",
    state: "Washington",
    stateCode: "WA",
    region: "West",
    hero:
      "Seattle gay massage for deep recovery, mindfulness, and tech-friendly scheduling.",
    summary:
      "Explore Capitol Hill, Belltown, and Queen Anne for trusted professionals.",
    vibe: [
      "Mindful bodywork",
      "Tech-savvy scheduling",
      "Rainy-day recovery focus",
    ],
    neighborhoods: [
      {
        slug: "capitol-hill",
        name: "Capitol Hill",
        summary:
          "LGBTQ+ hub with progressive wellness studios.",
        highlights: ["Broadway", "Pike/Pine", "Volunteer Park"],
      },
      {
        slug: "belltown",
        name: "Belltown",
        summary:
          "Convenient downtown availability with premium amenities.",
        highlights: ["1st Ave", "Olympic Sculpture Park", "Denny Triangle"],
      },
      {
        slug: "queen-anne",
        name: "Queen Anne",
        summary:
          "Quiet, refined appointments with flexible hours.",
        highlights: ["Lower Queen Anne", "Kerry Park", "Uptown"],
      },
    ],
    keywords: [
      "gay massage seattle",
      "male massage capitol hill",
      "lgbt massage belltown",
      "sports massage seattle",
    ],
  },
  {
    slug: "washington-dc",
    name: "Washington, DC",
    state: "District of Columbia",
    stateCode: "DC",
    region: "Northeast",
    hero:
      "Washington, DC gay massage with discretion for professionals and travelers.",
    summary:
      "Find premium therapists in Dupont Circle, Logan Circle, and Capitol Hill.",
    vibe: [
      "High discretion for busy schedules",
      "Executive-friendly booking windows",
      "Trusted local providers",
    ],
    neighborhoods: [
      {
        slug: "dupont-circle",
        name: "Dupont Circle",
        summary:
          "Classic LGBTQ+ neighborhood with premium wellness.",
        highlights: ["18th Street", "Connecticut Ave", "P Street"],
      },
      {
        slug: "logan-circle",
        name: "Logan Circle",
        summary:
          "Boutique studios with calm, restorative sessions.",
        highlights: ["14th Street", "U Street", "Shaw"],
      },
      {
        slug: "capitol-hill",
        name: "Capitol Hill",
        summary:
          "Convenient appointments near government and business hubs.",
        highlights: ["Eastern Market", "Navy Yard", "Hill East"],
      },
    ],
    keywords: [
      "gay massage dc",
      "male massage dupont circle",
      "lgbt massage washington dc",
      "sports massage dc",
    ],
  },
  {
    slug: "boston",
    name: "Boston",
    state: "Massachusetts",
    stateCode: "MA",
    region: "Northeast",
    hero:
      "Boston gay massage focused on professionalism, recovery, and refined service.",
    summary:
      "Explore Back Bay, South End, and Cambridge for expert therapists.",
    vibe: [
      "Professional standards",
      "Wellness-first studios",
      "Trusted LGBTQ+ community",
    ],
    neighborhoods: [
      {
        slug: "back-bay",
        name: "Back Bay",
        summary:
          "Premium appointments in upscale settings.",
        highlights: ["Newbury Street", "Prudential", "Copley"],
      },
      {
        slug: "south-end",
        name: "South End",
        summary:
          "Boutique wellness in a creative neighborhood.",
        highlights: ["Tremont", "SoWa", "Blackstone Square"],
      },
      {
        slug: "cambridge",
        name: "Cambridge",
        summary:
          "Academic, calm experiences with deep tissue experts.",
        highlights: ["Harvard Square", "Kendall", "Central Square"],
      },
    ],
    keywords: [
      "gay massage boston",
      "male massage back bay",
      "lgbt massage south end",
      "sports massage cambridge",
    ],
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    region: "West",
    hero:
      "Phoenix gay massage built for recovery, heat relief, and travel-friendly sessions.",
    summary:
      "Find trusted professionals in Scottsdale, Downtown, and Tempe.",
    vibe: [
      "Wellness and recovery focus",
      "Warm, professional service",
      "Flexible booking windows",
    ],
    neighborhoods: [
      {
        slug: "scottsdale",
        name: "Scottsdale",
        summary:
          "Luxury experiences with spa-grade amenities.",
        highlights: ["Old Town", "North Scottsdale", "Kierland"],
      },
      {
        slug: "downtown",
        name: "Downtown Phoenix",
        summary:
          "Convenient appointments near arts and nightlife.",
        highlights: ["Roosevelt Row", "Central Avenue", "Warehouse District"],
      },
      {
        slug: "tempe",
        name: "Tempe",
        summary:
          "Accessible wellness for students and professionals.",
        highlights: ["Mill Avenue", "ASU District", "Town Lake"],
      },
    ],
    keywords: [
      "gay massage phoenix",
      "male massage scottsdale",
      "lgbt massage tempe",
      "sports massage phoenix",
    ],
  },
  {
    slug: "denver",
    name: "Denver",
    state: "Colorado",
    stateCode: "CO",
    region: "West",
    hero:
      "Denver gay massage for high-altitude recovery and premium wellness.",
    summary:
      "Browse RiNo, Capitol Hill, and Cherry Creek for trusted professionals.",
    vibe: [
      "Athletic recovery",
      "Outdoor lifestyle focus",
      "Calm, modern studios",
    ],
    neighborhoods: [
      {
        slug: "rino",
        name: "RiNo",
        summary:
          "Creative district with boutique wellness studios.",
        highlights: ["Larimer Street", "Five Points", "Walnut"],
      },
      {
        slug: "capitol-hill",
        name: "Capitol Hill",
        summary:
          "Central access with LGBTQ+ friendly providers.",
        highlights: ["Colfax", "Cheesman Park", "Baker"],
      },
      {
        slug: "cherry-creek",
        name: "Cherry Creek",
        summary:
          "Luxury-focused sessions with premium amenities.",
        highlights: ["Cherry Creek North", "Steele Street", "3rd Avenue"],
      },
    ],
    keywords: [
      "gay massage denver",
      "male massage capitol hill denver",
      "lgbt massage cherry creek",
      "sports massage denver",
    ],
  },
  {
    slug: "houston",
    name: "Houston",
    state: "Texas",
    stateCode: "TX",
    region: "South",
    hero:
      "Houston gay massage for recovery, discreet studios, and flexible scheduling.",
    summary:
      "Explore Montrose, Midtown, and The Heights for trusted therapists.",
    vibe: [
      "Discreet in-call studios",
      "Flexible evening availability",
      "Trusted local reviews",
    ],
    neighborhoods: [
      {
        slug: "montrose",
        name: "Montrose",
        summary:
          "LGBTQ+ friendly wellness with boutique studios and expert care.",
        highlights: ["Westheimer", "Fairview", "Cherryhurst"],
      },
      {
        slug: "midtown",
        name: "Midtown",
        summary:
          "Central access with quick booking windows and modern spaces.",
        highlights: ["Bagby", "Main Street", "Gray Street"],
      },
      {
        slug: "the-heights",
        name: "The Heights",
        summary:
          "Quiet neighborhood with private studios and premium amenities.",
        highlights: ["19th Street", "Yale Street", "Heights Blvd"],
      },
    ],
    keywords: [
      "gay massage houston",
      "male massage montrose",
      "lgbt massage houston",
      "sports massage houston",
    ],
  },
  {
    slug: "austin",
    name: "Austin",
    state: "Texas",
    stateCode: "TX",
    region: "South",
    hero:
      "Austin gay massage with holistic care, modern studios, and easy booking.",
    summary:
      "Find top pros in Downtown, South Congress, and The Domain.",
    vibe: [
      "Wellness-forward studios",
      "Tech-friendly scheduling",
      "Travel-ready therapists",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central sessions with quick availability and upscale amenities.",
        highlights: ["Congress Ave", "Warehouse District", "Seaholm"],
      },
      {
        slug: "south-congress",
        name: "South Congress",
        summary:
          "Boutique bodywork with a relaxed, creative vibe.",
        highlights: ["SoCo", "South 1st", "Oltorf"],
      },
      {
        slug: "the-domain",
        name: "The Domain",
        summary:
          "Modern studios with premium care and flexible hours.",
        highlights: ["Rock Rose", "Braker", "Burnet"],
      },
    ],
    keywords: [
      "gay massage austin",
      "male massage south congress",
      "lgbt massage austin",
      "sports massage austin",
    ],
  },
  {
    slug: "san-diego",
    name: "San Diego",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "San Diego gay massage for beach recovery and premium bodywork.",
    summary:
      "Browse Hillcrest, La Jolla, and Gaslamp for expert sessions.",
    vibe: [
      "Beachside recovery",
      "Luxury in-call options",
      "Experienced therapists",
    ],
    neighborhoods: [
      {
        slug: "hillcrest",
        name: "Hillcrest",
        summary:
          "LGBTQ+ hub with trusted wellness professionals.",
        highlights: ["University Ave", "Uptown", "Balboa Park"],
      },
      {
        slug: "la-jolla",
        name: "La Jolla",
        summary:
          "Upscale studios focused on premium care and relaxation.",
        highlights: ["Village", "UTC", "Torrey Pines"],
      },
      {
        slug: "gaslamp",
        name: "Gaslamp Quarter",
        summary:
          "Convenient downtown access with flexible bookings.",
        highlights: ["5th Ave", "Petco Park", "Marina District"],
      },
    ],
    keywords: [
      "gay massage san diego",
      "male massage hillcrest",
      "lgbt massage la jolla",
      "sports massage san diego",
    ],
  },
  {
    slug: "san-jose",
    name: "San Jose",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "San Jose gay massage designed for tech professionals and recovery.",
    summary:
      "Find trusted providers in Downtown, Santana Row, and Willow Glen.",
    vibe: [
      "Tech-friendly booking",
      "Quiet studio spaces",
      "Flexible hours",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with quick availability and modern amenities.",
        highlights: ["SoFa", "San Pedro", "Diridon"],
      },
      {
        slug: "santana-row",
        name: "Santana Row",
        summary:
          "Luxury appointments in a high-end shopping district.",
        highlights: ["Winchester", "Olin", "Campbell"],
      },
      {
        slug: "willow-glen",
        name: "Willow Glen",
        summary:
          "Boutique studios with calm, neighborhood-focused care.",
        highlights: ["Lincoln Ave", "Minnesota Ave", "Glen Eyrie"],
      },
    ],
    keywords: [
      "gay massage san jose",
      "male massage santana row",
      "lgbt massage san jose",
      "sports massage san jose",
    ],
  },
  {
    slug: "philadelphia",
    name: "Philadelphia",
    state: "Pennsylvania",
    stateCode: "PA",
    region: "Northeast",
    hero:
      "Philadelphia gay massage with classic professionalism and deep recovery.",
    summary:
      "Explore Center City, Rittenhouse, and Fishtown.",
    vibe: [
      "Reliable scheduling",
      "Deep tissue specialists",
      "Urban studio access",
    ],
    neighborhoods: [
      {
        slug: "center-city",
        name: "Center City",
        summary:
          "Convenient downtown sessions with premium care.",
        highlights: ["Rittenhouse", "Logan Square", "Old City"],
      },
      {
        slug: "rittenhouse",
        name: "Rittenhouse",
        summary:
          "Upscale studios with calm, refined experiences.",
        highlights: ["Rittenhouse Square", "Walnut Street", "Locust"],
      },
      {
        slug: "fishtown",
        name: "Fishtown",
        summary:
          "Boutique wellness with creative neighborhood vibes.",
        highlights: ["Frankford Ave", "Girard", "Northern Liberties"],
      },
    ],
    keywords: [
      "gay massage philadelphia",
      "male massage center city",
      "lgbt massage rittenhouse",
      "sports massage philadelphia",
    ],
  },
  {
    slug: "san-antonio",
    name: "San Antonio",
    state: "Texas",
    stateCode: "TX",
    region: "South",
    hero:
      "San Antonio gay massage with warm hospitality and trusted care.",
    summary:
      "Discover sessions in Downtown, Alamo Heights, and Stone Oak.",
    vibe: [
      "Comfort-first service",
      "Flexible appointment slots",
      "Trusted local pros",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central access with quick booking options.",
        highlights: ["River Walk", "Market Square", "Southtown"],
      },
      {
        slug: "alamo-heights",
        name: "Alamo Heights",
        summary:
          "Quiet, upscale sessions with premium amenities.",
        highlights: ["Broadway", "Olmos Park", "Terrell Hills"],
      },
      {
        slug: "stone-oak",
        name: "Stone Oak",
        summary:
          "Modern studios with flexible evening availability.",
        highlights: ["Stone Oak Pkwy", "TPC Pkwy", "Sonterra"],
      },
    ],
    keywords: [
      "gay massage san antonio",
      "male massage alamo heights",
      "lgbt massage san antonio",
      "sports massage san antonio",
    ],
  },
  {
    slug: "orlando",
    name: "Orlando",
    state: "Florida",
    stateCode: "FL",
    region: "South",
    hero:
      "Orlando gay massage for travelers, theme park recovery, and local wellness.",
    summary:
      "Explore Downtown, Lake Eola, and Winter Park.",
    vibe: [
      "Travel-ready therapists",
      "Flexible hotel visits",
      "Relaxation focus",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with quick scheduling options.",
        highlights: ["Church Street", "Amway Center", "Lake Eola"],
      },
      {
        slug: "lake-eola",
        name: "Lake Eola",
        summary:
          "Calm wellness sessions near the heart of the city.",
        highlights: ["Eola Heights", "Thornton Park", "Summerlin"],
      },
      {
        slug: "winter-park",
        name: "Winter Park",
        summary:
          "Boutique care in a quiet, upscale district.",
        highlights: ["Park Ave", "Hannibal Square", "Rollins"],
      },
    ],
    keywords: [
      "gay massage orlando",
      "male massage lake eola",
      "lgbt massage orlando",
      "hotel massage orlando",
    ],
  },
  {
    slug: "tampa",
    name: "Tampa",
    state: "Florida",
    stateCode: "FL",
    region: "South",
    hero:
      "Tampa gay massage with coastal recovery and professional care.",
    summary:
      "Find trusted sessions in South Tampa, Downtown, and Hyde Park.",
    vibe: [
      "Coastal recovery",
      "Discreet studios",
      "Evening availability",
    ],
    neighborhoods: [
      {
        slug: "south-tampa",
        name: "South Tampa",
        summary:
          "Upscale studios with premium amenities and privacy.",
        highlights: ["Hyde Park", "SoHo", "Bayshore"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central access with quick booking windows.",
        highlights: ["Riverwalk", "Channelside", "Water Street"],
      },
      {
        slug: "hyde-park",
        name: "Hyde Park",
        summary:
          "Boutique wellness experiences with refined care.",
        highlights: ["Hyde Park Village", "Platt Street", "Swann"],
      },
    ],
    keywords: [
      "gay massage tampa",
      "male massage south tampa",
      "lgbt massage tampa",
      "sports massage tampa",
    ],
  },
  {
    slug: "minneapolis",
    name: "Minneapolis",
    state: "Minnesota",
    stateCode: "MN",
    region: "Midwest",
    hero:
      "Minneapolis gay massage for deep recovery and winter wellness.",
    summary:
      "Browse North Loop, Uptown, and Northeast.",
    vibe: [
      "Deep tissue focus",
      "Calm studio spaces",
      "Consistent availability",
    ],
    neighborhoods: [
      {
        slug: "north-loop",
        name: "North Loop",
        summary:
          "Modern studios with premium recovery sessions.",
        highlights: ["Washington Ave", "Warehouse District", "Target Field"],
      },
      {
        slug: "uptown",
        name: "Uptown",
        summary:
          "Creative wellness spaces with relaxed vibes.",
        highlights: ["Hennepin Ave", "Lake Street", "Bde Maka Ska"],
      },
      {
        slug: "northeast",
        name: "Northeast",
        summary:
          "Local favorites with flexible booking options.",
        highlights: ["Arts District", "Central Ave", "St Anthony"],
      },
    ],
    keywords: [
      "gay massage minneapolis",
      "male massage north loop",
      "lgbt massage uptown",
      "sports massage minneapolis",
    ],
  },
  {
    slug: "detroit",
    name: "Detroit",
    state: "Michigan",
    stateCode: "MI",
    region: "Midwest",
    hero:
      "Detroit gay massage with focused recovery and trusted professionals.",
    summary:
      "Explore Downtown, Midtown, and Corktown.",
    vibe: [
      "Athletic recovery",
      "Studio privacy",
      "Flexible scheduling",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central sessions with quick booking windows.",
        highlights: ["Campus Martius", "Greektown", "Riverwalk"],
      },
      {
        slug: "midtown",
        name: "Midtown",
        summary:
          "Creative district with boutique wellness studios.",
        highlights: ["Cass Corridor", "Wayne State", "Canfield"],
      },
      {
        slug: "corktown",
        name: "Corktown",
        summary:
          "Historic neighborhood with trusted local therapists.",
        highlights: ["Michigan Ave", "Trumbull", "Rosa Parks Blvd"],
      },
    ],
    keywords: [
      "gay massage detroit",
      "male massage midtown detroit",
      "lgbt massage detroit",
      "sports massage detroit",
    ],
  },
  {
    slug: "portland",
    name: "Portland",
    state: "Oregon",
    stateCode: "OR",
    region: "West",
    hero:
      "Portland gay massage with mindful bodywork and boutique studios.",
    summary:
      "Find pros in Pearl District, Alberta Arts, and Hawthorne.",
    vibe: [
      "Mindful bodywork",
      "Boutique studios",
      "Relaxation focus",
    ],
    neighborhoods: [
      {
        slug: "pearl-district",
        name: "Pearl District",
        summary:
          "Upscale studios with premium wellness care.",
        highlights: ["NW 11th", "Tanner Springs", "Jamison Square"],
      },
      {
        slug: "alberta-arts",
        name: "Alberta Arts",
        summary:
          "Creative district with calm, restorative sessions.",
        highlights: ["Alberta St", "Mississippi Ave", "Northeast 15th"],
      },
      {
        slug: "hawthorne",
        name: "Hawthorne",
        summary:
          "Neighborhood studios with flexible scheduling.",
        highlights: ["SE Hawthorne", "Mount Tabor", "SE 30th"],
      },
    ],
    keywords: [
      "gay massage portland",
      "male massage pearl district",
      "lgbt massage portland",
      "sports massage portland",
    ],
  },
  {
    slug: "nashville",
    name: "Nashville",
    state: "Tennessee",
    stateCode: "TN",
    region: "South",
    hero:
      "Nashville gay massage for touring recovery and local wellness.",
    summary:
      "Explore The Gulch, East Nashville, and Midtown.",
    vibe: [
      "Travel-ready pros",
      "Late appointments",
      "Wellness-first service",
    ],
    neighborhoods: [
      {
        slug: "the-gulch",
        name: "The Gulch",
        summary:
          "Upscale studios with premium amenities and privacy.",
        highlights: ["12th Ave South", "Demonbreun", "Edgehill"],
      },
      {
        slug: "east-nashville",
        name: "East Nashville",
        summary:
          "Creative neighborhood with boutique bodywork.",
        highlights: ["Five Points", "Woodland", "Main Street"],
      },
      {
        slug: "midtown",
        name: "Midtown",
        summary:
          "Central access with flexible booking windows.",
        highlights: ["Music Row", "West End", "Demonbreun"],
      },
    ],
    keywords: [
      "gay massage nashville",
      "male massage the gulch",
      "lgbt massage nashville",
      "sports massage nashville",
    ],
  },
  {
    slug: "charlotte",
    name: "Charlotte",
    state: "North Carolina",
    stateCode: "NC",
    region: "South",
    hero:
      "Charlotte gay massage with professional care and easy booking.",
    summary:
      "Discover sessions in Uptown, South End, and Dilworth.",
    vibe: [
      "Business-friendly scheduling",
      "Discreet studios",
      "Consistent service",
    ],
    neighborhoods: [
      {
        slug: "uptown",
        name: "Uptown",
        summary:
          "Central access with quick appointment windows.",
        highlights: ["Tryon Street", "Trade Street", "Spectrum Center"],
      },
      {
        slug: "south-end",
        name: "South End",
        summary:
          "Modern studios with premium wellness care.",
        highlights: ["Rail Trail", "Camden", "East West Blvd"],
      },
      {
        slug: "dilworth",
        name: "Dilworth",
        summary:
          "Quiet neighborhood with boutique sessions.",
        highlights: ["East Blvd", "Freedom Park", "Park Road"],
      },
    ],
    keywords: [
      "gay massage charlotte",
      "male massage south end charlotte",
      "lgbt massage charlotte",
      "sports massage charlotte",
    ],
  },
  {
    slug: "raleigh",
    name: "Raleigh",
    state: "North Carolina",
    stateCode: "NC",
    region: "South",
    hero:
      "Raleigh gay massage for recovery, relaxation, and trusted care.",
    summary:
      "Find therapists in Downtown, North Hills, and Glenwood South.",
    vibe: [
      "Relaxation focus",
      "Modern studios",
      "Easy booking",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with flexible scheduling options.",
        highlights: ["Fayetteville St", "Warehouse District", "Moore Square"],
      },
      {
        slug: "north-hills",
        name: "North Hills",
        summary:
          "Upscale appointments with premium amenities.",
        highlights: ["Midtown", "Six Forks", "Lassiter"],
      },
      {
        slug: "glenwood-south",
        name: "Glenwood South",
        summary:
          "Neighborhood studios with evening availability.",
        highlights: ["Glenwood Ave", "Peace St", "Boylan Heights"],
      },
    ],
    keywords: [
      "gay massage raleigh",
      "male massage north hills",
      "lgbt massage raleigh",
      "sports massage raleigh",
    ],
  },
  {
    slug: "jacksonville",
    name: "Jacksonville",
    state: "Florida",
    stateCode: "FL",
    region: "South",
    hero:
      "Jacksonville gay massage with calm, coastal recovery and flexible scheduling.",
    summary:
      "Discover trusted therapists in Riverside, San Marco, and Jacksonville Beach.",
    vibe: [
      "Coastal recovery focus",
      "Flexible in-call options",
      "Trusted local professionals",
    ],
    neighborhoods: [
      {
        slug: "riverside",
        name: "Riverside",
        summary:
          "Historic district with boutique studios and relaxed sessions.",
        highlights: ["Five Points", "Memorial Park", "King Street"],
      },
      {
        slug: "san-marco",
        name: "San Marco",
        summary:
          "Upscale, quiet appointments near dining and nightlife.",
        highlights: ["San Marco Square", "River Oaks", "Southbank"],
      },
      {
        slug: "jacksonville-beach",
        name: "Jacksonville Beach",
        summary:
          "Beachside sessions ideal for recovery and relaxation.",
        highlights: ["1st Street", "Neptune Beach", "Ponte Vedra"],
      },
    ],
    keywords: [
      "gay massage jacksonville",
      "male massage riverside",
      "lgbt massage san marco",
      "mobile massage jacksonville",
    ],
  },
  {
    slug: "fort-worth",
    name: "Fort Worth",
    state: "Texas",
    stateCode: "TX",
    region: "South",
    hero:
      "Fort Worth gay massage with discreet studios and professional care.",
    summary:
      "Find trusted therapists in Sundance Square, Near Southside, and West 7th.",
    vibe: [
      "Discreet studio settings",
      "Evening availability",
      "Reliable local favorites",
    ],
    neighborhoods: [
      {
        slug: "sundance-square",
        name: "Sundance Square",
        summary:
          "Central downtown studios with premium amenities.",
        highlights: ["Main Street", "Bass Hall", "Tarrant County"],
      },
      {
        slug: "near-southside",
        name: "Near Southside",
        summary:
          "Creative district with boutique wellness options.",
        highlights: ["Magnolia Ave", "Fairmount", "Medical District"],
      },
      {
        slug: "west-7th",
        name: "West 7th",
        summary:
          "Modern sessions near dining and nightlife.",
        highlights: ["West 7th Street", "Crockett Row", "Cultural District"],
      },
    ],
    keywords: [
      "gay massage fort worth",
      "male massage sundance square",
      "lgbt massage near southside",
      "sports massage fort worth",
    ],
  },
  {
    slug: "columbus",
    name: "Columbus",
    state: "Ohio",
    stateCode: "OH",
    region: "Midwest",
    hero:
      "Columbus gay massage for recovery, comfort, and dependable scheduling.",
    summary:
      "Explore Short North, German Village, and Downtown for verified professionals.",
    vibe: [
      "Relaxation and recovery focus",
      "LGBTQ+ friendly providers",
      "Easy booking windows",
    ],
    neighborhoods: [
      {
        slug: "short-north",
        name: "Short North",
        summary:
          "Arts district with modern studios and flexible hours.",
        highlights: ["High Street", "Goodale Park", "Arena District"],
      },
      {
        slug: "german-village",
        name: "German Village",
        summary:
          "Quiet neighborhood with boutique care.",
        highlights: ["Schiller Park", "South Third", "Mohawk Street"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central access with quick availability.",
        highlights: ["Scioto Mile", "Capitol Square", "Riverfront"],
      },
    ],
    keywords: [
      "gay massage columbus",
      "male massage short north",
      "lgbt massage german village",
      "sports massage columbus",
    ],
  },
  {
    slug: "indianapolis",
    name: "Indianapolis",
    state: "Indiana",
    stateCode: "IN",
    region: "Midwest",
    hero:
      "Indianapolis gay massage with professional service and recovery focus.",
    summary:
      "Discover Broad Ripple, Downtown, and Fountain Square.",
    vibe: [
      "Professional, client-first care",
      "Flexible scheduling",
      "Trusted local studios",
    ],
    neighborhoods: [
      {
        slug: "broad-ripple",
        name: "Broad Ripple",
        summary:
          "Boutique wellness in a lively district.",
        highlights: ["Broad Ripple Ave", "Canal Towpath", "Arts Center"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with quick booking windows.",
        highlights: ["Monument Circle", "Wholesale District", "Mass Ave"],
      },
      {
        slug: "fountain-square",
        name: "Fountain Square",
        summary:
          "Creative neighborhood with relaxed sessions.",
        highlights: ["Virginia Ave", "Fletcher Place", "Garfield Park"],
      },
    ],
    keywords: [
      "gay massage indianapolis",
      "male massage broad ripple",
      "lgbt massage fountain square",
      "sports massage indianapolis",
    ],
  },
  {
    slug: "sacramento",
    name: "Sacramento",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "Sacramento gay massage for capital-city recovery and trusted care.",
    summary:
      "Find specialists in Midtown, Downtown, and East Sacramento.",
    vibe: [
      "Calm, professional studios",
      "Easy booking for travelers",
      "Wellness-first service",
    ],
    neighborhoods: [
      {
        slug: "midtown",
        name: "Midtown",
        summary:
          "Central district with boutique studios.",
        highlights: ["J Street", "Lavender Heights", "Capitol Park"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Convenient sessions near business hubs.",
        highlights: ["K Street", "Old Sacramento", "Golden 1 Center"],
      },
      {
        slug: "east-sacramento",
        name: "East Sacramento",
        summary:
          "Quiet neighborhood with private appointments.",
        highlights: ["Fab 40s", "McKinley Park", "Alhambra"],
      },
    ],
    keywords: [
      "gay massage sacramento",
      "male massage midtown sacramento",
      "lgbt massage east sacramento",
      "sports massage sacramento",
    ],
  },
  {
    slug: "kansas-city",
    name: "Kansas City",
    state: "Missouri",
    stateCode: "MO",
    region: "Midwest",
    hero:
      "Kansas City gay massage with reliable professionals and relaxed care.",
    summary:
      "Explore Power & Light, Westport, and Crossroads.",
    vibe: [
      "Downtown convenience",
      "Flexible appointment times",
      "Local wellness favorites",
    ],
    neighborhoods: [
      {
        slug: "power-light",
        name: "Power & Light District",
        summary:
          "Central studios near downtown energy.",
        highlights: ["Live! Block", "Sprint Center", "Grand Blvd"],
      },
      {
        slug: "westport",
        name: "Westport",
        summary:
          "Historic nightlife area with boutique care.",
        highlights: ["Westport Road", "Mill Street", "Uptown"],
      },
      {
        slug: "crossroads",
        name: "Crossroads",
        summary:
          "Arts district with modern wellness spaces.",
        highlights: ["Crossroads Arts District", "Union Station", "KC Streetcar"],
      },
    ],
    keywords: [
      "gay massage kansas city",
      "male massage westport kc",
      "lgbt massage crossroads",
      "sports massage kansas city",
    ],
  },
  {
    slug: "st-louis",
    name: "St. Louis",
    state: "Missouri",
    stateCode: "MO",
    region: "Midwest",
    hero:
      "St. Louis gay massage with deep recovery and trusted studios.",
    summary:
      "Find sessions in Central West End, Downtown, and The Grove.",
    vibe: [
      "Deep tissue specialists",
      "Consistent availability",
      "Community-friendly providers",
    ],
    neighborhoods: [
      {
        slug: "central-west-end",
        name: "Central West End",
        summary:
          "Upscale studios near parks and dining.",
        highlights: ["Euclid Ave", "Forest Park", "Maryland Plaza"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Convenient sessions near business hubs.",
        highlights: ["Washington Ave", "Gateway Arch", "Ballpark Village"],
      },
      {
        slug: "the-grove",
        name: "The Grove",
        summary:
          "Lively district with boutique wellness.",
        highlights: ["Manchester Ave", "Cortex", "Botanical Garden"],
      },
    ],
    keywords: [
      "gay massage st louis",
      "male massage central west end",
      "lgbt massage the grove",
      "sports massage st louis",
    ],
  },
  {
    slug: "milwaukee",
    name: "Milwaukee",
    state: "Wisconsin",
    stateCode: "WI",
    region: "Midwest",
    hero:
      "Milwaukee gay massage for lakefront recovery and professional care.",
    summary:
      "Explore Third Ward, East Side, and Bay View.",
    vibe: [
      "Lakefront relaxation",
      "Discreet studios",
      "Easy scheduling",
    ],
    neighborhoods: [
      {
        slug: "third-ward",
        name: "Third Ward",
        summary:
          "Upscale studios with modern amenities.",
        highlights: ["Historic Third Ward", "RiverWalk", "Public Market"],
      },
      {
        slug: "east-side",
        name: "East Side",
        summary:
          "Central neighborhood with flexible availability.",
        highlights: ["Brady Street", "Prospect", "Lower East Side"],
      },
      {
        slug: "bay-view",
        name: "Bay View",
        summary:
          "Relaxed, boutique wellness with local charm.",
        highlights: ["Kinnickinnic Ave", "Humboldt Park", "South Shore"],
      },
    ],
    keywords: [
      "gay massage milwaukee",
      "male massage third ward",
      "lgbt massage bay view",
      "sports massage milwaukee",
    ],
  },
  {
    slug: "baltimore",
    name: "Baltimore",
    state: "Maryland",
    stateCode: "MD",
    region: "Northeast",
    hero:
      "Baltimore gay massage with harbor-city professionalism and calm recovery.",
    summary:
      "Find trusted therapists in Mount Vernon, Federal Hill, and Harbor East.",
    vibe: [
      "Harbor city convenience",
      "Discreet in-call options",
      "Reliable local professionals",
    ],
    neighborhoods: [
      {
        slug: "mount-vernon",
        name: "Mount Vernon",
        summary:
          "Historic district with boutique studios.",
        highlights: ["Cathedral Street", "Charles Street", "Washington Monument"],
      },
      {
        slug: "federal-hill",
        name: "Federal Hill",
        summary:
          "Wellness options near the waterfront.",
        highlights: ["Light Street", "Cross Street", "Inner Harbor"],
      },
      {
        slug: "harbor-east",
        name: "Harbor East",
        summary:
          "Upscale appointments with premium amenities.",
        highlights: ["Aliceanna Street", "Harbor Point", "Fells Point"],
      },
    ],
    keywords: [
      "gay massage baltimore",
      "male massage mount vernon",
      "lgbt massage harbor east",
      "sports massage baltimore",
    ],
  },
  {
    slug: "memphis",
    name: "Memphis",
    state: "Tennessee",
    stateCode: "TN",
    region: "South",
    hero:
      "Memphis gay massage focused on recovery, comfort, and trusted care.",
    summary:
      "Explore Downtown, Midtown, and Cooper-Young.",
    vibe: [
      "Relaxation-first sessions",
      "Flexible booking windows",
      "Local favorites",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios near the riverfront.",
        highlights: ["Beale Street", "South Main", "Medical District"],
      },
      {
        slug: "midtown",
        name: "Midtown",
        summary:
          "Creative neighborhood with boutique wellness.",
        highlights: ["Overton Square", "Crosstown", "Cooper Street"],
      },
      {
        slug: "cooper-young",
        name: "Cooper-Young",
        summary:
          "Chill, walkable area with trusted providers.",
        highlights: ["Cooper Street", "Young Ave", "Shelby Farms"],
      },
    ],
    keywords: [
      "gay massage memphis",
      "male massage midtown memphis",
      "lgbt massage cooper young",
      "sports massage memphis",
    ],
  },
  {
    slug: "louisville",
    name: "Louisville",
    state: "Kentucky",
    stateCode: "KY",
    region: "South",
    hero:
      "Louisville gay massage with bourbon city hospitality and expert care.",
    summary:
      "Discover NuLu, The Highlands, and Downtown.",
    vibe: [
      "Warm professional service",
      "Discreet studios",
      "Evening availability",
    ],
    neighborhoods: [
      {
        slug: "nulu",
        name: "NuLu",
        summary:
          "Trendy district with boutique wellness.",
        highlights: ["Market Street", "Butchertown", "East Market"],
      },
      {
        slug: "the-highlands",
        name: "The Highlands",
        summary:
          "Neighborhood favorite for calm sessions.",
        highlights: ["Bardstown Road", "Cherokee Park", "Douglass Loop"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central access with quick bookings.",
        highlights: ["Fourth Street Live", "Riverfront", "Main Street"],
      },
    ],
    keywords: [
      "gay massage louisville",
      "male massage nulu",
      "lgbt massage the highlands",
      "sports massage louisville",
    ],
  },
  {
    slug: "oklahoma-city",
    name: "Oklahoma City",
    state: "Oklahoma",
    stateCode: "OK",
    region: "South",
    hero:
      "Oklahoma City gay massage for recovery, privacy, and easy booking.",
    summary:
      "Find therapists in Bricktown, Midtown, and Plaza District.",
    vibe: [
      "Calm, professional service",
      "Flexible appointment times",
      "Trusted local providers",
    ],
    neighborhoods: [
      {
        slug: "bricktown",
        name: "Bricktown",
        summary:
          "Downtown district with convenient studios.",
        highlights: ["Bricktown Canal", "Scissortail Park", "Chickasaw Bricktown"],
      },
      {
        slug: "midtown",
        name: "Midtown",
        summary:
          "Modern wellness spaces near restaurants.",
        highlights: ["Paseo District", "NW 10th", "Plaza"],
      },
      {
        slug: "plaza-district",
        name: "Plaza District",
        summary:
          "Creative neighborhood with boutique care.",
        highlights: ["16th Street", "Gatewood", "Classen"],
      },
    ],
    keywords: [
      "gay massage oklahoma city",
      "male massage bricktown",
      "lgbt massage plaza district",
      "sports massage okc",
    ],
  },
  {
    slug: "new-orleans",
    name: "New Orleans",
    state: "Louisiana",
    stateCode: "LA",
    region: "South",
    hero:
      "New Orleans gay massage blending recovery with Southern hospitality.",
    summary:
      "Explore French Quarter, Warehouse District, and Garden District.",
    vibe: [
      "Travel-friendly appointments",
      "Discreet in-call options",
      "Relaxation focus",
    ],
    neighborhoods: [
      {
        slug: "french-quarter",
        name: "French Quarter",
        summary:
          "Historic heart of the city with premium sessions.",
        highlights: ["Royal Street", "Bourbon Street", "Jackson Square"],
      },
      {
        slug: "warehouse-district",
        name: "Warehouse District",
        summary:
          "Modern studios near downtown hotels.",
        highlights: ["Arts District", "Convention Center", "St Charles Ave"],
      },
      {
        slug: "garden-district",
        name: "Garden District",
        summary:
          "Quiet, upscale sessions with privacy.",
        highlights: ["Magazine Street", "St Charles", "Audubon Park"],
      },
    ],
    keywords: [
      "gay massage new orleans",
      "male massage french quarter",
      "lgbt massage warehouse district",
      "hotel massage new orleans",
    ],
  },
  {
    slug: "albuquerque",
    name: "Albuquerque",
    state: "New Mexico",
    stateCode: "NM",
    region: "West",
    hero:
      "Albuquerque gay massage for high-desert recovery and calm care.",
    summary:
      "Find trusted professionals in Nob Hill, Downtown, and Old Town.",
    vibe: [
      "Relaxation and recovery",
      "Flexible scheduling",
      "Trusted local studios",
    ],
    neighborhoods: [
      {
        slug: "nob-hill",
        name: "Nob Hill",
        summary:
          "Boutique wellness near local shops.",
        highlights: ["Central Ave", "Nob Hill District", "Carlisle"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central access with quick appointments.",
        highlights: ["Civic Plaza", "Rail Yards", "Tingley"],
      },
      {
        slug: "old-town",
        name: "Old Town",
        summary:
          "Historic district with quiet sessions.",
        highlights: ["Plaza", "Museum Row", "Rio Grande"],
      },
    ],
    keywords: [
      "gay massage albuquerque",
      "male massage nob hill",
      "lgbt massage old town abq",
      "sports massage albuquerque",
    ],
  },
  {
    slug: "tucson",
    name: "Tucson",
    state: "Arizona",
    stateCode: "AZ",
    region: "West",
    hero:
      "Tucson gay massage with desert recovery and professional care.",
    summary:
      "Explore Downtown, Sam Hughes, and Catalina Foothills.",
    vibe: [
      "Relaxed wellness culture",
      "Discreet studios",
      "Easy booking",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with flexible scheduling.",
        highlights: ["Congress St", "4th Avenue", "Presidio"],
      },
      {
        slug: "sam-hughes",
        name: "Sam Hughes",
        summary:
          "Boutique neighborhood with calm sessions.",
        highlights: ["University Blvd", "Himmel Park", "3rd Street"],
      },
      {
        slug: "catalina-foothills",
        name: "Catalina Foothills",
        summary:
          "Upscale appointments with scenic privacy.",
        highlights: ["Foothills", "La Encantada", "Sabino Canyon"],
      },
    ],
    keywords: [
      "gay massage tucson",
      "male massage downtown tucson",
      "lgbt massage sam hughes",
      "sports massage tucson",
    ],
  },
  {
    slug: "fresno",
    name: "Fresno",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "Fresno gay massage for Central Valley recovery and trusted care.",
    summary:
      "Find sessions in Tower District, Downtown, and Fig Garden.",
    vibe: [
      "Professional, calm studios",
      "Easy scheduling",
      "Local wellness focus",
    ],
    neighborhoods: [
      {
        slug: "tower-district",
        name: "Tower District",
        summary:
          "Creative district with boutique bodywork.",
        highlights: ["Tower Theater", "Olive Ave", "Fulton Street"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central access with quick bookings.",
        highlights: ["Fresno Street", "Chukchansi Park", "Courthouse Park"],
      },
      {
        slug: "fig-garden",
        name: "Fig Garden",
        summary:
          "Quiet neighborhood with premium care.",
        highlights: ["Shaw Ave", "Palm Ave", "Fig Garden Village"],
      },
    ],
    keywords: [
      "gay massage fresno",
      "male massage tower district",
      "lgbt massage fig garden",
      "sports massage fresno",
    ],
  },
  {
    slug: "mesa",
    name: "Mesa",
    state: "Arizona",
    stateCode: "AZ",
    region: "West",
    hero:
      "Mesa gay massage for East Valley recovery and flexible appointments.",
    summary:
      "Discover Downtown Mesa, Dobson Ranch, and Eastmark.",
    vibe: [
      "Easy booking windows",
      "Calm studio spaces",
      "Trusted professionals",
    ],
    neighborhoods: [
      {
        slug: "downtown-mesa",
        name: "Downtown Mesa",
        summary:
          "Central studios with modern amenities.",
        highlights: ["Main Street", "Mesa Arts Center", "Civic Center"],
      },
      {
        slug: "dobson-ranch",
        name: "Dobson Ranch",
        summary:
          "Neighborhood sessions with relaxed vibes.",
        highlights: ["Dobson", "Fiesta District", "Rhodes Park"],
      },
      {
        slug: "eastmark",
        name: "Eastmark",
        summary:
          "Newer community with quiet appointments.",
        highlights: ["Ellsworth", "Ray Road", "Eastmark Pkwy"],
      },
    ],
    keywords: [
      "gay massage mesa",
      "male massage downtown mesa",
      "lgbt massage dobson ranch",
      "sports massage mesa",
    ],
  },
  {
    slug: "long-beach",
    name: "Long Beach",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "Long Beach gay massage with coastal recovery and boutique care.",
    summary:
      "Explore Downtown, Belmont Shore, and Bixby Knolls.",
    vibe: [
      "Beachside relaxation",
      "Discreet studios",
      "Easy scheduling",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios near the waterfront.",
        highlights: ["Pine Ave", "Shoreline Village", "East Village"],
      },
      {
        slug: "belmont-shore",
        name: "Belmont Shore",
        summary:
          "Coastal district with calm sessions.",
        highlights: ["2nd Street", "Naples", "Alamitos Bay"],
      },
      {
        slug: "bixby-knolls",
        name: "Bixby Knolls",
        summary:
          "Quiet neighborhood with boutique wellness.",
        highlights: ["Atlantic Ave", "Carson Park", "Los Cerritos"],
      },
    ],
    keywords: [
      "gay massage long beach",
      "male massage belmont shore",
      "lgbt massage bixby knolls",
      "sports massage long beach",
    ],
  },
  {
    slug: "oakland",
    name: "Oakland",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "Oakland gay massage with East Bay professionalism and recovery focus.",
    summary:
      "Find trusted pros in Downtown, Temescal, and Jack London Square.",
    vibe: [
      "Inclusive wellness",
      "Flexible booking",
      "Local favorite studios",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with quick availability.",
        highlights: ["Broadway", "Lakeside", "Uptown"],
      },
      {
        slug: "temescal",
        name: "Temescal",
        summary:
          "Creative district with boutique care.",
        highlights: ["Telegraph Ave", "Temescal Alley", "MacArthur"],
      },
      {
        slug: "jack-london-square",
        name: "Jack London Square",
        summary:
          "Waterfront appointments with premium amenities.",
        highlights: ["Market Street", "Ferry Terminal", "Embarcadero"],
      },
    ],
    keywords: [
      "gay massage oakland",
      "male massage temescal",
      "lgbt massage jack london square",
      "sports massage oakland",
    ],
  },
  {
    slug: "bakersfield",
    name: "Bakersfield",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "Bakersfield gay massage for Central Valley recovery and calm service.",
    summary:
      "Discover Downtown, Westchester, and Seven Oaks.",
    vibe: [
      "Relaxation and recovery",
      "Discreet studios",
      "Flexible booking",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central sessions with quick scheduling.",
        highlights: ["18th Street", "Museum District", "Kern River"],
      },
      {
        slug: "westchester",
        name: "Westchester",
        summary:
          "Quiet neighborhood with boutique care.",
        highlights: ["Stockdale Highway", "Westchester Park", "17th Street"],
      },
      {
        slug: "seven-oaks",
        name: "Seven Oaks",
        summary:
          "Upscale area with private appointments.",
        highlights: ["Buena Vista", "Grand Island", "Haggin Oaks"],
      },
    ],
    keywords: [
      "gay massage bakersfield",
      "male massage westchester",
      "lgbt massage seven oaks",
      "sports massage bakersfield",
    ],
  },
  {
    slug: "anaheim",
    name: "Anaheim",
    state: "California",
    stateCode: "CA",
    region: "West",
    hero:
      "Anaheim gay massage with resort-ready recovery and trusted care.",
    summary:
      "Find therapists in Anaheim Resort, Downtown Anaheim, and Platinum Triangle.",
    vibe: [
      "Travel-friendly sessions",
      "Hotel-ready professionals",
      "Evening availability",
    ],
    neighborhoods: [
      {
        slug: "anaheim-resort",
        name: "Anaheim Resort",
        summary:
          "Ideal for travelers near theme parks.",
        highlights: ["Disneyland", "Harbor Blvd", "Convention Center"],
      },
      {
        slug: "downtown-anaheim",
        name: "Downtown Anaheim",
        summary:
          "Central studios with easy booking.",
        highlights: ["Center Street", "Packing House", "Pearson Park"],
      },
      {
        slug: "platinum-triangle",
        name: "Platinum Triangle",
        summary:
          "Modern district with premium appointments.",
        highlights: ["Angel Stadium", "Honda Center", "Katella"],
      },
    ],
    keywords: [
      "gay massage anaheim",
      "male massage anaheim resort",
      "lgbt massage platinum triangle",
      "hotel massage anaheim",
    ],
  },
  {
    slug: "cleveland",
    name: "Cleveland",
    state: "Ohio",
    stateCode: "OH",
    region: "Midwest",
    hero:
      "Cleveland gay massage with lakefront recovery and professional care.",
    summary:
      "Explore Downtown, Ohio City, and Tremont.",
    vibe: [
      "Professional, calm service",
      "Consistent availability",
      "Local wellness favorites",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central sessions with quick booking.",
        highlights: ["Public Square", "Gateway District", "Warehouse District"],
      },
      {
        slug: "ohio-city",
        name: "Ohio City",
        summary:
          "Trendy neighborhood with boutique care.",
        highlights: ["West 25th", "Market District", "Gordon Square"],
      },
      {
        slug: "tremont",
        name: "Tremont",
        summary:
          "Historic district with relaxed sessions.",
        highlights: ["Professor Ave", "Lincoln Park", "West 14th"],
      },
    ],
    keywords: [
      "gay massage cleveland",
      "male massage ohio city",
      "lgbt massage tremont",
      "sports massage cleveland",
    ],
  },
  {
    slug: "cincinnati",
    name: "Cincinnati",
    state: "Ohio",
    stateCode: "OH",
    region: "Midwest",
    hero:
      "Cincinnati gay massage for recovery, comfort, and reliable booking.",
    summary:
      "Find sessions in Over-the-Rhine, Downtown, and Hyde Park.",
    vibe: [
      "Relaxation-first care",
      "Discreet studios",
      "Local favorites",
    ],
    neighborhoods: [
      {
        slug: "over-the-rhine",
        name: "Over-the-Rhine",
        summary:
          "Historic district with boutique studios.",
        highlights: ["Vine Street", "Washington Park", "Findlay Market"],
      },
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central access with quick scheduling.",
        highlights: ["Fountain Square", "Banks", "Central Business District"],
      },
      {
        slug: "hyde-park",
        name: "Hyde Park",
        summary:
          "Quiet neighborhood with premium appointments.",
        highlights: ["Hyde Park Square", "Erie Ave", "Ault Park"],
      },
    ],
    keywords: [
      "gay massage cincinnati",
      "male massage over the rhine",
      "lgbt massage hyde park",
      "sports massage cincinnati",
    ],
  },
  {
    slug: "pittsburgh",
    name: "Pittsburgh",
    state: "Pennsylvania",
    stateCode: "PA",
    region: "Northeast",
    hero:
      "Pittsburgh gay massage with river-city recovery and trusted care.",
    summary:
      "Explore Downtown, Shadyside, and Lawrenceville.",
    vibe: [
      "Professional studios",
      "Flexible booking",
      "Trusted local therapists",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with quick availability.",
        highlights: ["Market Square", "Cultural District", "Point State Park"],
      },
      {
        slug: "shadyside",
        name: "Shadyside",
        summary:
          "Upscale appointments with boutique care.",
        highlights: ["Walnut Street", "Ellsworth", "Highland Ave"],
      },
      {
        slug: "lawrenceville",
        name: "Lawrenceville",
        summary:
          "Creative district with relaxed sessions.",
        highlights: ["Butler Street", "Lower Lawrenceville", "Arsenal"],
      },
    ],
    keywords: [
      "gay massage pittsburgh",
      "male massage shadyside",
      "lgbt massage lawrenceville",
      "sports massage pittsburgh",
    ],
  },
  {
    slug: "salt-lake-city",
    name: "Salt Lake City",
    state: "Utah",
    stateCode: "UT",
    region: "West",
    hero:
      "Salt Lake City gay massage for mountain recovery and calm wellness.",
    summary:
      "Find trusted therapists in Downtown, Sugar House, and The Avenues.",
    vibe: [
      "Outdoor recovery focus",
      "Discreet studios",
      "Easy scheduling",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with flexible booking.",
        highlights: ["Main Street", "City Creek", "Temple Square"],
      },
      {
        slug: "sugar-house",
        name: "Sugar House",
        summary:
          "Neighborhood favorite for boutique care.",
        highlights: ["Sugar House Park", "2100 South", "Highland Drive"],
      },
      {
        slug: "the-avenues",
        name: "The Avenues",
        summary:
          "Quiet, historic area with private sessions.",
        highlights: ["11th Ave", "6th Ave", "Federal Heights"],
      },
    ],
    keywords: [
      "gay massage salt lake city",
      "male massage sugar house",
      "lgbt massage the avenues",
      "sports massage slc",
    ],
  },
  {
    slug: "virginia-beach",
    name: "Virginia Beach",
    state: "Virginia",
    stateCode: "VA",
    region: "South",
    hero:
      "Virginia Beach gay massage with coastal recovery and discreet care.",
    summary:
      "Explore Oceanfront, Town Center, and Sandbridge.",
    vibe: [
      "Beachside relaxation",
      "Travel-friendly appointments",
      "Evening availability",
    ],
    neighborhoods: [
      {
        slug: "oceanfront",
        name: "Oceanfront",
        summary:
          "Beach access with premium in-call sessions.",
        highlights: ["Boardwalk", "Resort Area", "Atlantic Ave"],
      },
      {
        slug: "town-center",
        name: "Town Center",
        summary:
          "Central studios with easy booking.",
        highlights: ["Pembroke Blvd", "Central Park", "Broad Street"],
      },
      {
        slug: "sandbridge",
        name: "Sandbridge",
        summary:
          "Quiet, upscale sessions near the water.",
        highlights: ["Sandbridge Rd", "Back Bay", "Little Island"],
      },
    ],
    keywords: [
      "gay massage virginia beach",
      "male massage oceanfront",
      "lgbt massage town center",
      "sports massage virginia beach",
    ],
  },
  {
    slug: "providence",
    name: "Providence",
    state: "Rhode Island",
    stateCode: "RI",
    region: "Northeast",
    hero:
      "Providence gay massage with boutique care and easy scheduling.",
    summary:
      "Find sessions in Downtown, College Hill, and Federal Hill.",
    vibe: [
      "Boutique studios",
      "Discreet appointments",
      "Wellness-first service",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central access with quick bookings.",
        highlights: ["Westminster St", "Kennedy Plaza", "Waterplace Park"],
      },
      {
        slug: "college-hill",
        name: "College Hill",
        summary:
          "Quiet neighborhood with refined care.",
        highlights: ["Thayer Street", "Brown University", "Benefit St"],
      },
      {
        slug: "federal-hill",
        name: "Federal Hill",
        summary:
          "Neighborhood favorite with boutique studios.",
        highlights: ["Atwells Ave", "Broadway", "DePasquale Plaza"],
      },
    ],
    keywords: [
      "gay massage providence",
      "male massage college hill",
      "lgbt massage federal hill",
      "sports massage providence",
    ],
  },
  {
    slug: "honolulu",
    name: "Honolulu",
    state: "Hawaii",
    stateCode: "HI",
    region: "West",
    hero:
      "Honolulu gay massage with island recovery and premium care.",
    summary:
      "Explore Waikiki, Kakaako, and Ala Moana.",
    vibe: [
      "Resort-ready sessions",
      "Travel-friendly scheduling",
      "Relaxation focus",
    ],
    neighborhoods: [
      {
        slug: "waikiki",
        name: "Waikiki",
        summary:
          "Hotel-friendly appointments for travelers.",
        highlights: ["Kalakaua Ave", "Royal Hawaiian", "Kapiolani Park"],
      },
      {
        slug: "kakaako",
        name: "Kakaako",
        summary:
          "Modern district with boutique wellness.",
        highlights: ["Ward Village", "Salt Kakaako", "Ala Moana Blvd"],
      },
      {
        slug: "ala-moana",
        name: "Ala Moana",
        summary:
          "Central access near shopping and beaches.",
        highlights: ["Ala Moana Center", "Magic Island", "Keeaumoku"],
      },
    ],
    keywords: [
      "gay massage honolulu",
      "male massage waikiki",
      "lgbt massage kakaako",
      "hotel massage honolulu",
    ],
  },
  {
    slug: "omaha",
    name: "Omaha",
    state: "Nebraska",
    stateCode: "NE",
    region: "Midwest",
    hero:
      "Omaha gay massage for recovery, comfort, and trusted care.",
    summary:
      "Find therapists in Downtown, Old Market, and Benson.",
    vibe: [
      "Easy booking windows",
      "Calm studio spaces",
      "Local favorites",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central sessions with quick booking.",
        highlights: ["Old Market", "Capitol District", "Gene Leahy Mall"],
      },
      {
        slug: "old-market",
        name: "Old Market",
        summary:
          "Historic district with boutique care.",
        highlights: ["Howard Street", "Brick Walks", "Tenth Street"],
      },
      {
        slug: "benson",
        name: "Benson",
        summary:
          "Creative neighborhood with relaxed sessions.",
        highlights: ["Maple Street", "Benson Theater", "60th St"],
      },
    ],
    keywords: [
      "gay massage omaha",
      "male massage old market",
      "lgbt massage benson",
      "sports massage omaha",
    ],
  },
  {
    slug: "colorado-springs",
    name: "Colorado Springs",
    state: "Colorado",
    stateCode: "CO",
    region: "West",
    hero:
      "Colorado Springs gay massage for mountain recovery and trusted care.",
    summary:
      "Explore Downtown, Old Colorado City, and Northgate.",
    vibe: [
      "Outdoor recovery focus",
      "Professional studios",
      "Flexible scheduling",
    ],
    neighborhoods: [
      {
        slug: "downtown",
        name: "Downtown",
        summary:
          "Central studios with quick availability.",
        highlights: ["Tejon Street", "Acacia Park", "Pioneer Museum"],
      },
      {
        slug: "old-colorado-city",
        name: "Old Colorado City",
        summary:
          "Historic area with boutique sessions.",
        highlights: ["Colorado Ave", "Bancroft Park", "Manitou"],
      },
      {
        slug: "northgate",
        name: "Northgate",
        summary:
          "Upscale area with private appointments.",
        highlights: ["InterQuest", "Briargate", "Chapel Hills"],
      },
    ],
    keywords: [
      "gay massage colorado springs",
      "male massage old colorado city",
      "lgbt massage northgate",
      "sports massage colorado springs",
    ],
  },
];

export function getCityHub(slug: string) {
  return US_CITY_HUBS.find((city) => city.slug === slug);
}

export function getNeighborhood(city: CityHub, slug: string) {
  return city.neighborhoods.find((hood) => hood.slug === slug);
}
