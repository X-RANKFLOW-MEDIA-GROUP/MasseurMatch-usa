export type CityContent = {
  label: string;
  state: string;
  description: string;
  lgbtContext: string;
  neighborhoods: Array<{ name: string; vibe: string }>;
  events: Array<{ name: string; detail: string }>;
  weather: string;
  tourism: string;
  culture: string;
  massageReasons: string[];
  faqs: Array<{ question: string; answer: string }>;
};

const fallbackCityContent = (slug: string): CityContent => {
  const label = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  return {
    label,
    state: "",
    description: `${label} mixes business districts and residential areas where travelers split their time between work, meals with friends, and last-minute errands. Visitors and locals alike look for wellness options that respect their schedule and privacy.`,
    lgbtContext: `The city has an active LGBT community that values clear communication, privacy, and respectful service. Inclusive venues and small events give queer visitors safe places to recharge after long days.`,
    neighborhoods: [
      { name: "Downtown core", vibe: "Walkable offices, hotels, and entertainment blocks that attract conference visitors." },
      { name: "Arts district", vibe: "Galleries, indie venues, and cafes where creative workers meet between projects." },
      { name: "Historic quarter", vibe: "Tree-lined streets, local restaurants, and calmer stays that still sit close to transit." },
    ],
    events: [
      { name: "Local Pride festival", detail: "Seasonal pride celebrations that boost demand near bars, hotels, and venues." },
      { name: "Food and arts weekends", detail: "Street fairs and gallery walks that draw visitors who want to decompress after full days outside." },
      { name: "Sports and concerts", detail: "Arena events and rivalry games that fill hotels and lead to late travel arrivals." },
    ],
    weather: "Weather shifts with the seasons, so visitors often prefer flexible scheduling and indoor-friendly options during heat waves, cold snaps, or stormy afternoons.",
    tourism: "Tourism flows in waves tied to conferences, nearby universities, and weekend getaways. Demand spikes around central hotels and neighborhoods served by rideshare and light rail.",
    culture: "Locals balance work, live music, sports, and food culture. Service expectations emphasize punctuality, friendliness, and the ability to tailor sessions to different comfort levels.",
    massageReasons: [
      "Jet lag and tight shoulders after flights or long drives.",
      "Desk strain from working out of hotels or coworking hubs.",
      "Foot and calf relief after walking museums and downtown blocks.",
      "Stress management for visitors who want discreet, LGBT-welcoming care.",
      "Athletic recovery for runners and gym-goers training while on the road.",
    ],
    faqs: [
      {
        question: `Where do visitors usually stay in ${label}?`,
        answer: "Most guests split time between the central hotel corridor and nearby arts or dining districts, so look for therapists who can meet in those areas or offer mobile visits.",
      },
      {
        question: `What should LGBT clients ask before booking in ${label}?`,
        answer: "Confirm inclusivity, comfort with pronouns, and any building check-in rules. Profiles on MasseurMatch highlight boundaries, payment methods, and mobility radius to simplify planning.",
      },
    ],
  };
};

export const cityMap: Record<string, CityContent> = {
  miami: {
    label: "Miami",
    state: "FL",
    description:
      "Miami sits between Biscayne Bay and the Atlantic, mixing art deco coastlines, cruise passengers, bilingual street life, and year-round outdoor plans. Visitors hop between beach mornings, Wynwood murals, and late-night food halls, so the city moves almost around the clock.",
    lgbtContext:
      "South Beach has long been an anchor for queer nightlife, with rainbow crosswalks near Ocean Drive and clubs that stay open late. Wynwood and Edgewater add quieter lounges and brunch spots, and city policy promotes inclusive events and anti-discrimination protections for LGBT locals and travelers.",
    neighborhoods: [
      { name: "South Beach", vibe: "Art deco hotels, boardwalk workouts, and beachfront resorts that welcome in-room massage." },
      { name: "Wynwood", vibe: "Murals, breweries, and loft studios where visitors mix gallery walks with slower appointments." },
      { name: "Downtown & Brickell", vibe: "High-rise hotels, offices, and conference traffic looking for post-meeting recovery." },
      { name: "Little Havana", vibe: "Cuban cafecitos, live salsa, and family shops that slow the pace away from the sand." },
    ],
    events: [
      { name: "Miami Beach Pride", detail: "Parades, pool parties, and health fairs that raise demand around hotels in April." },
      { name: "Art Basel Miami Beach", detail: "December art week packs Wynwood and South Beach with collectors seeking recovery work." },
      { name: "Winter Music Conference and Ultra", detail: "March nightlife keeps therapists busy with late bookings near the beach." },
    ],
    weather:
      "Tropical heat, humid summers, and quick afternoon storms shape the schedule. Hurricane season runs June through November; December through April is breezier with ideal post-beach evenings.",
    tourism:
      "Cruise departures, Latin American flights, and snowbird travel keep hotels full most months. Brickell, the airport corridor, and the beach zones see constant last-minute requests.",
    culture:
      "Music leans toward reggaeton, Afro-Caribbean percussion, and DJ nights. Food swings from stone crab to Cuban sandwiches, and bilingual service is an expectation, not a bonus.",
    massageReasons: [
      "Post-flight decompression for cruise arrivals and conference guests in Brickell.",
      "Sports recovery for boardwalk runners and gym-goers in hotel fitness centers.",
      "Stress relief after nightlife in South Beach and Wynwood.",
      "Hotel-friendly sessions for visitors without cars or with tight parking options.",
      "Discreet, LGBT-welcoming bodywork where clients choose aromatherapy or lighter touch.",
    ],
    faqs: [
      {
        question: "Where do visitors usually book in Miami?",
        answer: "Most travelers request in-hotel sessions in South Beach and Brickell or prefer short-trip studios near the Metromover for predictable timing between meetings.",
      },
      {
        question: "Is in-hotel massage common in South Beach?",
        answer: "Yes. Many beachfront hotels allow registered guests to host therapists, but you should confirm front-desk check-in rules and elevator access when you message.",
      },
      {
        question: "How does weather change scheduling in Miami?",
        answer: "Afternoon storms can slow traffic across causeways, so early-evening appointments tend to be the safest bet for on-time arrivals.",
      },
    ],
  },
  "fort-lauderdale": {
    label: "Fort Lauderdale",
    state: "FL",
    description:
      "Fort Lauderdale blends canals, cruise terminals, and relaxed beaches. Visitors split time between the Riverwalk, Las Olas dining, and short drives to Wilton Manors, so the pace is more laid back than Miami yet still busy on weekends.",
    lgbtContext:
      "Wilton Manors is one of the most visible LGBT districts in the U.S., with bars, community centers, and Pride events that keep the scene active year-round. The city is used to queer travelers and values privacy and respectful service.",
    neighborhoods: [
      { name: "Wilton Manors", vibe: "Walkable gay bars, cafes, and galleries that favor discreet, LGBT-owned services." },
      { name: "Las Olas", vibe: "Riverfront restaurants, boutiques, and hotels that attract couples and business travelers." },
      { name: "Victoria Park", vibe: "Residential streets with short drives to downtown and Wilton Manors nightlife." },
      { name: "Harbordale & Port area", vibe: "Cruise passengers and flight crews looking for recovery before or after sailing." },
    ],
    events: [
      { name: "Pride Fort Lauderdale", detail: "Beachside pride festival with concerts and community programming in February." },
      { name: "Wilton Manors Stonewall Parade", detail: "June parade that fills nearby hotels and raises demand for mobile sessions." },
      { name: "Tortuga Music Festival", detail: "Spring festival on the beach draws long days in the sun and sore backs." },
    ],
    weather:
      "Subtropical weather brings warm winters and steamy summers with afternoon showers. Sea breezes help in winter; summer bookings work best indoors or in shaded, air-conditioned spaces.",
    tourism:
      "Cruise traffic, boating culture, and drive-in visitors from South Florida keep weekends lively. Airport crews and snowbirds often request early morning or late-night sessions near hotels.",
    culture:
      "Waterways dominate the city experience, from sunrise paddles to dinner cruises. Locals value friendly, on-time service and clear communication about parking and building access.",
    massageReasons: [
      "Pre- and post-cruise recovery for guests staying near the port.",
      "Foot and shoulder relief after walking Las Olas and the beach.",
      "Couples sessions for visitors enjoying Wilton Manors nightlife.",
      "Mobile massage for guests without cars or with limited parking.",
      "Cooling, calming work after long days in the subtropical sun.",
    ],
    faqs: [
      {
        question: "Where do LGBT visitors stay in Fort Lauderdale?",
        answer: "Many pick Wilton Manors guesthouses or Las Olas hotels. Mobile therapists often cover both areas plus the port hotels for travelers boarding cruises.",
      },
      {
        question: "Do hotels allow outside therapists near the port?",
        answer: "Most port hotels allow it with front-desk check-in. Message your therapist with room details and ID requirements to avoid delays.",
      },
      {
        question: "When is demand highest in Fort Lauderdale?",
        answer: "Cruise turnover weekends and Pride events create spikes. Booking a day ahead helps secure preferred times, especially on Saturdays.",
      },
    ],
  },
  orlando: {
    label: "Orlando",
    state: "FL",
    description:
      "Orlando is built around theme parks, conventions, and resort corridors like International Drive and Lake Buena Vista. Days start early, end late, and often involve miles of walking between attractions, hotels, and shuttle stops.",
    lgbtContext:
      "The city has a strong queer community centered around Mills 50, Ivanhoe, and Thornton Park. Pride events, GayDays at the parks, and inclusive policies make visitors feel welcome when they want a calm reset away from crowds.",
    neighborhoods: [
      { name: "International Drive", vibe: "Resorts, convention centers, and family attractions with guests craving recovery work." },
      { name: "Lake Buena Vista", vibe: "Park hotels and vacation rentals where mobile therapists help guests avoid traffic." },
      { name: "Mills 50 & Ivanhoe", vibe: "LGBT-friendly bars, diners, and vintage shops with locals seeking trusted providers." },
      { name: "Winter Park", vibe: "Tree-lined avenues, museums, and college events that bring steady weekend demand." },
    ],
    events: [
      { name: "GayDays & One Magical Weekend", detail: "June events at the parks that fill hotels and late-night venues." },
      { name: "Orlando Pride", detail: "October parade and festival around Lake Eola, driving bookings near downtown." },
      { name: "MegaCon & convention season", detail: "Spring and fall conferences create last-minute evening requests along I-Drive." },
    ],
    weather:
      "Hot, humid summers with daily storms; mild winters with comfortable evenings. Afternoon lightning can slow traffic between parks and resorts, so timing matters for mobile sessions.",
    tourism:
      "Year-round tourism keeps therapists busy. Families, hospitality workers, and flight crews rotate through, and many prefer in-room sessions to avoid parking fees or shuttle delays.",
    culture:
      "Hospitality runs deep here. Service is expected to be upbeat, punctual, and kid-friendly in resorts while still offering privacy and calm for adult guests.",
    massageReasons: [
      "Leg and back relief after theme-park miles and long queues.",
      "Travel fatigue for families juggling early shuttles and late fireworks.",
      "Stress reduction for hospitality staff working extended shifts.",
      "Quiet, LGBT-welcoming sessions away from crowded hotel pools.",
      "Pre-flight reset for guests heading home after packed itineraries.",
    ],
    faqs: [
      {
        question: "Where do most guests book in Orlando?",
        answer: "International Drive and Lake Buena Vista dominate requests. Mobile therapists often coordinate around shuttle schedules to keep visits on time.",
      },
      {
        question: "Is same-day booking realistic near the parks?",
        answer: "It is possible, but fireworks traffic creates delays. Early afternoon or late-night slots are the easiest to secure and keep on schedule.",
      },
      {
        question: "Are LGBT visitors comfortable booking in Orlando?",
        answer: "Yes. Mills 50, Ivanhoe, and downtown venues are openly queer-friendly, and many therapists highlight inclusivity and privacy policies in their profiles.",
      },
    ],
  },
  tampa: {
    label: "Tampa",
    state: "FL",
    description:
      "Tampa mixes waterfront offices, port traffic, and historic districts like Ybor City. The Riverwalk connects museums, arenas, and hotels, so visitors often explore on foot before heading to the beaches or St. Pete.",
    lgbtContext:
      "Ybor City and Seminole Heights host queer bars, inclusive restaurants, and arts spaces. Tampa Pride and a steady calendar of nightlife events make the city familiar with LGBT travelers seeking low-key, respectful service.",
    neighborhoods: [
      { name: "Ybor City", vibe: "Brick streets, cigar history, and late-night venues that drive next-day recovery sessions." },
      { name: "Downtown & Channel District", vibe: "Cruise port, Amalie Arena events, and hotels along the Riverwalk." },
      { name: "Seminole Heights", vibe: "Craft breweries, coffee shops, and bungalow homes with local, loyal clients." },
      { name: "Hyde Park & SoHo", vibe: "Upscale dining and boutiques with guests who prefer polished, in-studio experiences." },
    ],
    events: [
      { name: "Tampa Pride", detail: "Spring pride parade and festival centered around Ybor City." },
      { name: "Gasparilla Season", detail: "Parades and road races in January create waves of hotel demand." },
      { name: "Concerts and NHL games", detail: "Amalie Arena and Raymond James events keep weeknights lively and last-minute." },
    ],
    weather:
      "Humid summers with afternoon storms; drier, pleasant winters. Hurricane season needs monitoring, but most evenings are comfortable for post-event visits.",
    tourism:
      "Cruise passengers, military families, and sports fans rotate through. Many guests prefer short travel times between the port, downtown hotels, and the airport.",
    culture:
      "Food, craft beer, and sports drive social plans. Service expectations emphasize reliability and clear arrival times because parking and bridge traffic can fluctuate.",
    massageReasons: [
      "Calf and shoulder relief after Riverwalk miles and arena events.",
      "Recovery for cruise passengers with early boarding times.",
      "De-stress sessions for business travelers attending port or banking meetings.",
      "Cooling, calming work during humid summer afternoons.",
      "Discreet, LGBT-welcoming care around Ybor City nightlife weekends.",
    ],
    faqs: [
      {
        question: "Where do visitors request sessions in Tampa?",
        answer: "Downtown hotels, Ybor City rentals, and the Channel District are common. Mobile therapists often plan routes to avoid bridge delays and stadium traffic.",
      },
      {
        question: "Is Tampa friendly to LGBT clients?",
        answer: "Yes. Ybor City, Seminole Heights, and downtown venues are openly queer-friendly, and many therapists highlight inclusive policies and privacy steps.",
      },
      {
        question: "How early should I book during Gasparilla?",
        answer: "Parade weekends fill quickly. Booking one to two days in advance secures better times and avoids road closures.",
      },
    ],
  },
  jacksonville: {
    label: "Jacksonville",
    state: "FL",
    description:
      "Jacksonville stretches from riverfront towers to wide beaches, so travel time can add up. Visitors split time between Downtown meetings, Riverside dining, and waves at Jacksonville Beach or Neptune Beach.",
    lgbtContext:
      "Five Points and Riverside host queer-owned coffee shops, bars, and arts venues. Pride events and community groups prioritize privacy and safe spaces, and locals expect direct communication about policies.",
    neighborhoods: [
      { name: "Downtown & Southbank", vibe: "Offices, stadiums, and hotels serving business and sports travelers." },
      { name: "Riverside & Five Points", vibe: "Indie shops, galleries, and LGBT-friendly nightlife with loyal regulars." },
      { name: "San Marco", vibe: "Walkable square, dining, and historic homes with calmer evening schedules." },
      { name: "Jacksonville Beach", vibe: "Surf, bars, and vacation rentals where guests prefer mobile visits." },
    ],
    events: [
      { name: "River City Pride", detail: "October pride parade and festival centered in Riverside and Five Points." },
      { name: "Florida-Georgia Weekend", detail: "College rivalry game floods hotels and raises post-tailgate demand." },
      { name: "Jacksonville Jazz Festival", detail: "Spring music crowds increase evening bookings downtown." },
    ],
    weather:
      "Hot summers with thunderstorms; mild winters with cool mornings. Beach winds help, but rain can slow bridges between downtown and the coast.",
    tourism:
      "Military travel, port traffic, and drive-in visitors keep weekends steady. Guests often look for therapists willing to cover both downtown and the beaches.",
    culture:
      "River life, football, and live music shape the calendar. Locals value punctuality because distances across the metro can be long during rush hour.",
    massageReasons: [
      "Back and leg relief after long drives along I-95 or A1A.",
      "Post-beach recovery for surfers and joggers at Jacksonville Beach.",
      "Stress management for military families and medical travelers.",
      "Shoulder relief for tailgaters and stadium visitors.",
      "Quiet, LGBT-aware sessions around Riverside and Five Points.",
    ],
    faqs: [
      {
        question: "Which areas are easiest for mobile massage in Jacksonville?",
        answer: "Downtown, Riverside, and San Marco have quicker routes. Beach visits work best when planned outside rush hour to avoid bridge delays.",
      },
      {
        question: "Is LGBT-friendly service available near the beaches?",
        answer: "Yes. Many therapists travel to Jacksonville Beach and Neptune Beach with advance notice, and Riverside providers often note inclusive policies in their profiles.",
      },
      {
        question: "How does game day affect scheduling?",
        answer: "Stadium traffic and tailgates slow downtown on Saturdays. Book earlier in the day or after crowds clear to keep arrivals on time.",
      },
    ],
  },
  houston: {
    label: "Houston",
    state: "TX",
    description:
      "Houston is vast and driven by energy, medical, and aerospace industries. Neighborhoods feel like distinct cities, so clients favor therapists who understand traffic patterns between the Galleria, Downtown, and the Medical Center.",
    lgbtContext:
      "Montrose anchors Houston's queer history with bars, galleries, and community centers. Pride celebrations, inclusive churches, and city ordinances make the area welcoming while still valuing discretion for business travelers.",
    neighborhoods: [
      { name: "Montrose", vibe: "Historic LGBT core with cafes, nightlife, and clients who prefer inclusive providers." },
      { name: "Downtown & Midtown", vibe: "Offices, hotels, and arena events that create late-evening requests." },
      { name: "The Heights", vibe: "Bungalows, restaurants, and bike trails where locals book regular recovery sessions." },
      { name: "Galleria & Uptown", vibe: "Luxury hotels and shopping that attract conference travelers seeking in-room visits." },
    ],
    events: [
      { name: "Houston Pride", detail: "Summer parade and festival centered around downtown and Montrose." },
      { name: "Houston Livestock Show and Rodeo", detail: "March crowds and concerts fill hotels for weeks." },
      { name: "Art Car Parade and NBA/MLB seasons", detail: "Weekend events and game nights keep therapists busy near the arenas." },
    ],
    weather:
      "Hot, humid summers and sudden downpours mean traffic can change quickly. Air-conditioned spaces and flexible timing help keep sessions smooth year-round.",
    tourism:
      "Conventions, medical center visits, and energy travel create steady demand. Many guests rely on rideshare, so proximity and clear parking notes are key.",
    culture:
      "Houston blends global food, museum districts, and a strong work ethic. Service expectations center on reliability, professionalism, and clear boundaries that respect diverse clients.",
    massageReasons: [
      "Neck and shoulder strain after flights into IAH or Hobby.",
      "Recovery for medical visitors and caregivers staying near the Med Center.",
      "Stress relief for conference and energy-sector travelers in Uptown.",
      "Cooling sessions to offset heat and humidity in summer months.",
      "Quiet, inclusive care around Montrose and Heights residences.",
    ],
    faqs: [
      {
        question: "Where is demand highest in Houston?",
        answer: "Montrose, Galleria hotels, Downtown, and the Med Center. Therapists often group visits by zone to avoid rush-hour snarls.",
      },
      {
        question: "Is Houston LGBT-friendly for massage clients?",
        answer: "Montrose and many central neighborhoods are openly inclusive. Look for profiles mentioning pronoun awareness and clear privacy steps.",
      },
      {
        question: "How does weather change scheduling in Houston?",
        answer: "Storms can slow highways fast. Booking slightly off-peak and sharing parking details keeps arrivals predictable.",
      },
    ],
  },
  dallas: {
    label: "Dallas",
    state: "TX",
    description:
      "Dallas combines corporate towers, design districts, and leafy neighborhoods. Travelers split time between downtown meetings, Oak Lawn nightlife, and restaurants in Bishop Arts or Uptown, so the day can swing from formal to casual quickly.",
    lgbtContext:
      "Oak Lawn and Cedar Springs host one of the strongest LGBT scenes in Texas, with bars, drag shows, and community centers. Pride events and year-round programming make inclusive service the norm for many providers.",
    neighborhoods: [
      { name: "Oak Lawn & Cedar Springs", vibe: "LGBT nightlife, drag shows, and welcoming studios." },
      { name: "Downtown & Uptown", vibe: "Corporate offices, hotels, and Klyde Warren Park visitors needing stress relief." },
      { name: "Deep Ellum", vibe: "Live music, murals, and late-night crowds who recover the next day." },
      { name: "Bishop Arts", vibe: "Independent shops and restaurants with a slower, creative pace." },
    ],
    events: [
      { name: "Dallas Pride", detail: "June parade and festival boosting bookings near Oak Lawn." },
      { name: "State Fair of Texas", detail: "Fall crowds at Fair Park create heavy traffic and long walking days." },
      { name: "Sports and concerts", detail: "Cowboys, Mavericks, Stars, and touring acts keep weekends and nights busy." },
    ],
    weather:
      "Hot summers, occasional ice in winter, and spring storms. Early evening appointments often dodge heat and traffic.",
    tourism:
      "Business travel, conventions, and sports tourism drive steady demand. Many guests prefer short commutes or mobile visits to avoid parking hassles.",
    culture:
      "Dallas blends Southern hospitality with big-city pace. Clients appreciate punctuality, clear rates, and calm, professional conversation after eventful days.",
    massageReasons: [
      "Shoulder and neck relief for laptop-heavy business trips.",
      "Leg recovery after walking the State Fair or Klyde Warren Park.",
      "De-stress sessions after late nights in Deep Ellum or Uptown.",
      "Discreet, LGBT-aware care near Oak Lawn hotels and rentals.",
      "Game-day recovery for football and basketball fans.",
    ],
    faqs: [
      {
        question: "Where do most clients book in Dallas?",
        answer: "Oak Lawn, Uptown, and Downtown hotels lead requests. Mobile therapists often plan routes around 75 and the Tollway to stay on time.",
      },
      {
        question: "Is Dallas welcoming for LGBT visitors?",
        answer: "Oak Lawn has a long-standing queer community with inclusive venues. Many therapists note pronoun awareness and boundaries to keep sessions comfortable.",
      },
      {
        question: "How does weather affect bookings in Dallas?",
        answer: "Heat and sudden storms can slow traffic. Off-peak slots and clear parking guidance help avoid delays.",
      },
    ],
  },
  austin: {
    label: "Austin",
    state: "TX",
    description:
      "Austin blends tech campuses, live music, and outdoor trails. Days swing from downtown meetings and Capitol visits to Barton Springs swims and food trucks, so routines stay flexible and informal.",
    lgbtContext:
      "The city is widely LGBT-friendly, with a scene spread across downtown, East Austin, and the Warehouse District. Pride, Queerbomb, and year-round shows make inclusive service expected in most hospitality settings.",
    neighborhoods: [
      { name: "Downtown & Warehouse District", vibe: "Hotels, music venues, and convention traffic seeking recovery after long nights." },
      { name: "South Congress", vibe: "Boutiques, cafes, and walkable hotels with guests who value design-forward studios." },
      { name: "East Austin", vibe: "Murals, coffee shops, and creative spaces where locals book regular bodywork." },
      { name: "Domain & North Burnet", vibe: "Tech offices and shopping that generate lunchtime or after-work requests." },
    ],
    events: [
      { name: "SXSW", detail: "March tech and music conference that fills every hotel and rental." },
      { name: "Austin City Limits", detail: "Fall festival weekends in Zilker bring sore feet and sun-weary guests." },
      { name: "Pride and Formula 1", detail: "Summer Pride and October races add spikes in upscale hotels." },
    ],
    weather:
      "Long, hot summers and mild winters. Afternoon heat makes indoor or evening sessions the most comfortable choice.",
    tourism:
      "Festivals, university life, and tech relocations keep demand constant. Many visitors rely on rideshare, so proximity and parking clarity help keep schedules smooth.",
    culture:
      "Music, food trucks, and outdoor runs around Lady Bird Lake define the vibe. Service is expected to be relaxed, punctual, and respectful of individual boundaries.",
    massageReasons: [
      "Recovery after festival days and late-night shows.",
      "Relief for runners and cyclists training around the lake or hills.",
      "Desk and neck strain from co-working and laptop-heavy work trips.",
      "Cooling sessions to offset triple-digit summer afternoons.",
      "LGBT-affirming care that matches Austin's inclusive hospitality culture.",
    ],
    faqs: [
      {
        question: "Where do visitors book most often in Austin?",
        answer: "Downtown hotels, South Congress boutiques, and Domain tech corridors. Mobile therapists plan around I-35 and Mopac to stay punctual.",
      },
      {
        question: "How early should I book during SXSW?",
        answer: "At least 24-48 hours ahead. Traffic and full calendars make last-minute requests harder during the conference.",
      },
      {
        question: "Is Austin safe for LGBT travelers booking massage?",
        answer: "Yes. The city is broadly inclusive, and many providers highlight pronoun awareness and privacy practices in their profiles.",
      },
    ],
  },
  "san-antonio": {
    label: "San Antonio",
    state: "TX",
    description:
      "San Antonio mixes mission history with a fast-growing downtown. Visitors stroll the River Walk, tour the Alamo, and head north to newer neighborhoods, so days include plenty of walking in warm weather.",
    lgbtContext:
      "The city hosts Pride San Antonio and maintains welcoming pockets around the Strip on Main and downtown arts venues. Visitors look for clear communication and respectful, discreet service near hotels.",
    neighborhoods: [
      { name: "Downtown & River Walk", vibe: "Hotels, conventions, and steady foot traffic needing relief after long walks." },
      { name: "Pearl District", vibe: "Food halls, boutiques, and weekend markets with guests who favor design-forward experiences." },
      { name: "King William & Southtown", vibe: "Historic homes, galleries, and LGBTQ-friendly spots south of downtown." },
      { name: "Stone Oak & Northside", vibe: "Suburban offices and families seeking reliable scheduling away from downtown crowds." },
    ],
    events: [
      { name: "Fiesta San Antonio", detail: "Citywide spring celebration with parades and long days on foot." },
      { name: "Pride San Antonio", detail: "Summer festival and parade centered downtown and on the Strip." },
      { name: "Rodeo San Antonio", detail: "February rodeo and concerts that fill hotels around the AT&T Center." },
    ],
    weather:
      "Hot, dry summers and mild winters. Shade and hydration matter after river walks; evenings are often the most comfortable time to book.",
    tourism:
      "Military families, conventions, and weekend tourists fuel steady demand. Many prefer mobile visits to avoid parking along the River Walk.",
    culture:
      "Tex-Mex cuisine, mariachi, and mission history shape the city. Service expectations center on friendliness, punctuality, and clear boundaries.",
    massageReasons: [
      "Foot and calf relief after walking the River Walk and missions.",
      "Cooling, calming sessions in peak summer heat.",
      "Stress reduction for military and medical visitors.",
      "Discreet, LGBT-aware care near downtown hotels and the Strip.",
      "Family-friendly scheduling for guests traveling with kids.",
    ],
    faqs: [
      {
        question: "Where do visitors request sessions in San Antonio?",
        answer: "Downtown hotels, the Pearl, and Northside stays. Mobile providers often plan routes to avoid River Walk parking delays.",
      },
      {
        question: "How busy is Fiesta season?",
        answer: "Very. Parades and street closures slow traffic, so booking a day ahead helps keep appointments on time.",
      },
      {
        question: "Is San Antonio inclusive for LGBT clients?",
        answer: "Yes. The Strip on Main, downtown venues, and many providers emphasize inclusive service and privacy.",
      },
    ],
  },
  "kansas-city": {
    label: "Kansas City",
    state: "MO",
    description:
      "Kansas City spans the Missouri and Kansas state lines, linking downtown arts with suburban campuses. Visitors split time between the Crossroads, the Plaza, and sports venues, often walking or riding the streetcar between stops.",
    lgbtContext:
      "Westport, Midtown, and the Crossroads have longstanding queer bars, coffee shops, and galleries. PrideFest and local nonprofits make inclusivity visible, with providers attentive to privacy and respectful conversation.",
    neighborhoods: [
      { name: "Crossroads Arts District", vibe: "Studios, galleries, and First Fridays that draw creative crowds." },
      { name: "Power & Light", vibe: "Arenas, concerts, and downtown hotels with late-night energy." },
      { name: "Westport", vibe: "Bars, brunch, and LGBT-friendly venues near residential streets." },
      { name: "Country Club Plaza", vibe: "Spanish-style shopping district with hotels and walkable dining." },
    ],
    events: [
      { name: "Kansas City PrideFest", detail: "Summer pride at Theis Park with concerts and community booths." },
      { name: "Boulevardia and Plaza Art Fair", detail: "Beer and art festivals that keep sidewalks busy all weekend." },
      { name: "Chiefs and Royals seasons", detail: "Game days drive traffic and post-event recovery requests." },
    ],
    weather:
      "Four true seasons: humid summers, cold snaps in winter, and spring storms. Indoor sessions stay popular when humidity or icy roads hit.",
    tourism:
      "Barbecue trails, jazz history, and pro sports attract visitors. Many rely on the streetcar downtown, so nearby studios and concise parking instructions help.",
    culture:
      "Kansas City blends Midwestern friendliness with a strong arts identity. Punctuality, clear expectations, and relaxed conversation go a long way.",
    massageReasons: [
      "Leg relief after walking the Plaza or museum districts.",
      "Neck and back recovery for road warriors driving I-70 and I-35.",
      "Stress relief after game days and late-night concerts.",
      "Inclusive care near Westport and Crossroads venues.",
      "Winter-friendly indoor sessions when temps drop.",
    ],
    faqs: [
      {
        question: "Where are sessions most common in Kansas City?",
        answer: "Downtown hotels, the Plaza, and Westport rentals. Providers often group visits around streetcar stops to stay on schedule.",
      },
      {
        question: "Is the city welcoming for LGBT clients?",
        answer: "Yes. Westport and the Crossroads have visible queer venues, and many therapists state pronoun awareness and privacy practices.",
      },
      {
        question: "How does weather affect bookings?",
        answer: "Summer heat and winter ice can slow travel. Flexing start times by 10-15 minutes keeps arrivals predictable.",
      },
    ],
  },
  "oklahoma-city": {
    label: "Oklahoma City",
    state: "OK",
    description:
      "Oklahoma City is a fast-growing metro with districts that each feel distinct. Visitors bounce between Bricktown entertainment, Midtown dining, and the Boathouse District, often by car or scooter.",
    lgbtContext:
      "The 39th Street District hosts queer bars and community spaces, with Pride events expanding downtown. Visitors appreciate direct, respectful communication and clear expectations on privacy.",
    neighborhoods: [
      { name: "Bricktown", vibe: "Canals, ballpark, and hotels that fuel evening requests after games or dinners." },
      { name: "Midtown", vibe: "Restaurants, bars, and boutique hotels with walkable streets." },
      { name: "Plaza District & Paseo", vibe: "Galleries, murals, and creative venues that attract locals year-round." },
      { name: "Boathouse District", vibe: "Rowing, zip lines, and outdoor workouts along the river." },
    ],
    events: [
      { name: "OKC Pride", detail: "Summer parade and festival centered on 39th Street and downtown." },
      { name: "Festival of the Arts", detail: "Spring event in Bicentennial Park drawing heavy foot traffic." },
      { name: "NBA and baseball seasons", detail: "Thunder games and Bricktown ballpark nights generate late bookings." },
    ],
    weather:
      "Hot summers, windy springs, and the possibility of severe storms. Quick communication on timing keeps everyone comfortable when weather shifts.",
    tourism:
      "Sports, stockyards history, and a growing food scene draw visitors. Most rely on cars, so parking details help avoid delays.",
    culture:
      "Hospitality is direct and friendly. Clients value punctuality, transparent pricing, and respectful boundaries.",
    massageReasons: [
      "Recovery for travelers attending games or conventions in Bricktown.",
      "Leg and back relief after exploring outdoor trails and river workouts.",
      "Stress reduction for business trips tied to energy and aviation industries.",
      "LGBT-affirming sessions near 39th Street venues.",
      "Weather-safe indoor care during stormy weeks.",
    ],
    faqs: [
      {
        question: "Where do visitors book most often in OKC?",
        answer: "Bricktown hotels, Midtown boutiques, and Plaza District rentals. Providers often plan for parking and pre-clear building access.",
      },
      {
        question: "Is mobile massage common in Oklahoma City?",
        answer: "Yes. Driving is standard here, and many therapists note their radius so clients know if they cover the suburbs.",
      },
      {
        question: "How do storms affect scheduling?",
        answer: "Severe weather can delay travel. Staying flexible by 15 minutes and confirming indoor parking keeps sessions predictable.",
      },
    ],
  },
  tulsa: {
    label: "Tulsa",
    state: "OK",
    description:
      "Tulsa blends Art Deco towers downtown with creative districts and river parks. Visitors split time between Blue Dome nightlife, Guthrie Green events, and upscale shopping south of the city.",
    lgbtContext:
      "Downtown hosts Equality Center programming and Pride events that center inclusivity. The community values privacy, straightforward boundaries, and friendly service.",
    neighborhoods: [
      { name: "Blue Dome & Arts District", vibe: "Bars, music venues, and lofts with guests needing next-day recovery." },
      { name: "Cherry Street & Brookside", vibe: "Restaurants and boutiques with locals booking regular maintenance sessions." },
      { name: "Deco District", vibe: "Historic towers, hotels, and galleries attracting business travelers." },
      { name: "Riverside", vibe: "Running trails and parks that encourage athletic-focused bodywork." },
    ],
    events: [
      { name: "Tulsa Pride", detail: "June parade and festival around downtown." },
      { name: "Mayfest and Oktoberfest", detail: "Spring and fall festivals that fill hotels and riverfront areas." },
      { name: "Concerts at BOK Center", detail: "Touring acts create late-night energy and next-day demand." },
    ],
    weather:
      "Humid summers, cold snaps in winter, and spring storms. Evening bookings often avoid heat and wind.",
    tourism:
      "Energy, aerospace, and arts bring steady visitors. Many drive in from across Oklahoma and prefer clear parking and entry notes.",
    culture:
      "Tulsa leans into music history and new arts growth. Clients expect considerate, on-time service with a laid-back tone.",
    massageReasons: [
      "Leg and back relief after concerts and festival days downtown.",
      "Recovery for runners and cyclists along Riverside trails.",
      "Desk-related strain for workers in Deco District offices.",
      "Inclusive care for LGBT clients near the Equality Center.",
      "Cozy indoor sessions during stormy or cold evenings.",
    ],
    faqs: [
      {
        question: "Which areas are easiest for booking in Tulsa?",
        answer: "Downtown hotels, Cherry Street, and Brookside rentals. Traffic is light but festivals can close streets, so confirm routes.",
      },
      {
        question: "Are providers LGBT-friendly in Tulsa?",
        answer: "Yes. Downtown venues and many therapists note inclusive practices; asking about pronouns and comfort levels is welcomed.",
      },
      {
        question: "How do weather swings impact timing?",
        answer: "Storms and winter cold can slow arrivals. Evening slots with flexible buffers keep things predictable.",
      },
    ],
  },
  wichita: {
    label: "Wichita",
    state: "KS",
    description:
      "Wichita combines aviation campuses with a growing downtown. Visitors move between Old Town entertainment, Delano shops, and the Keeper of the Plains, often by car but with short, walkable clusters.",
    lgbtContext:
      "Pride events and downtown bars make the queer scene visible and tight-knit. Clients value privacy, respect, and straightforward expectations with local providers.",
    neighborhoods: [
      { name: "Old Town", vibe: "Brick warehouses, bars, and hotels that create late-evening requests." },
      { name: "Delano", vibe: "Shops and coffeehouses with a calmer pace near the river." },
      { name: "College Hill", vibe: "Historic homes and parks with regular local clients." },
      { name: "Downtown core", vibe: "Offices and theaters attracting business travelers and concertgoers." },
    ],
    events: [
      { name: "Wichita Pride", detail: "Summer festival and parade downtown." },
      { name: "Riverfest", detail: "Riverfront concerts and fireworks driving long walking days." },
      { name: "Tallgrass Film Festival", detail: "Fall event that draws creatives and late-night screenings." },
    ],
    weather:
      "Hot summers, cold winters, and windy springs. Indoor settings and clear parking help keep visits smooth year-round.",
    tourism:
      "Aviation, manufacturing, and university life fuel steady travel. Most guests drive, so mobile options work well with short notice.",
    culture:
      "Wichita feels friendly and pragmatic. Service expectations focus on reliability, professionalism, and relaxed conversation.",
    massageReasons: [
      "Back and neck relief for aviation and office workers.",
      "Foot recovery after Riverfest and Old Town nights.",
      "Stress reduction for travelers juggling meetings across campuses.",
      "LGBT-affirming care in a scene that values discretion.",
      "Warm, indoor sessions during winter cold snaps.",
    ],
    faqs: [
      {
        question: "Where do most bookings happen in Wichita?",
        answer: "Old Town hotels, Delano rentals, and downtown theaters. Mobile therapists often outline their radius to keep timing reliable.",
      },
      {
        question: "Is Wichita comfortable for LGBT clients?",
        answer: "Yes. Pride events and downtown venues are welcoming, and many therapists note inclusive practices in their bios.",
      },
      {
        question: "How does weather affect timing?",
        answer: "Wind and winter ice can slow traffic. Sharing parking details and adding a small buffer keeps arrivals on schedule.",
      },
    ],
  },
  // ========================
  // UK CITIES
  // ========================
  london: {
    label: "London",
    state: "UK",
    description:
      "London blends historic landmarks with modern districts, from Westminster and the West End to Shoreditch and Canary Wharf. Visitors split time between museums, theatre shows, business meetings, and late-night venues, so the city moves around the clock across its diverse zones.",
    lgbtContext:
      "Soho remains the historic heart of London's queer scene, with bars, clubs, and inclusive venues stretching into Vauxhall and East London. Pride in London draws massive crowds each summer, and the city's policies and culture strongly support LGBT visibility and safety.",
    neighborhoods: [
      { name: "Soho & West End", vibe: "Theatre district, gay bars, and hotels where visitors seek post-show recovery sessions." },
      { name: "Shoreditch & East London", vibe: "Creative hubs, street art, and late-night venues with next-day wellness demand." },
      { name: "Canary Wharf", vibe: "Financial district with corporate travellers needing stress relief after meetings." },
      { name: "Camden & King's Cross", vibe: "Music venues, markets, and Eurostar arrivals seeking mobile massage options." },
    ],
    events: [
      { name: "Pride in London", detail: "June parade through central London with massive hotel demand in Soho and Westminster." },
      { name: "West End theatre season", detail: "Year-round shows keep tourists walking miles between venues and restaurants." },
      { name: "Notting Hill Carnival", detail: "August street festival creating waves of demand in West London." },
    ],
    weather:
      "Mild, damp climate with frequent rain year-round. Indoor sessions are popular, and winter evenings make cosy studio visits appealing.",
    tourism:
      "Global business hub with constant international arrivals at Heathrow and City Airport. Hotels in Kensington, Westminster, and Shoreditch see steady wellness requests.",
    culture:
      "Fast-paced and cosmopolitan. Clients value punctuality, professionalism, and clear communication, especially around Tube accessibility and building entry protocols.",
    massageReasons: [
      "Post-flight tension after long-haul arrivals into Heathrow or Gatwick.",
      "Desk and shoulder strain from corporate work in the City and Canary Wharf.",
      "Foot and leg relief after walking between museums, markets, and West End shows.",
      "Stress management for visitors navigating the Tube and packed schedules.",
      "Discreet, LGBT-welcoming care near Soho, Vauxhall, and East London venues.",
    ],
    faqs: [
      {
        question: "Where do visitors usually book massage in London?",
        answer: "Central areas like Soho, Westminster, and Shoreditch are most popular. Mobile therapists often plan routes around Tube zones to stay punctual.",
      },
      {
        question: "Is hotel massage common in London?",
        answer: "Yes. Many hotels in Kensington, Bloomsbury, and the West End allow registered guests to host therapists, though front desk policies vary.",
      },
      {
        question: "How does London's size affect scheduling?",
        answer: "Traffic and Tube delays can add time. Booking therapists within 2-3 Tube zones of your location keeps arrivals predictable.",
      },
    ],
  },
  manchester: {
    label: "Manchester",
    state: "UK",
    description:
      "Manchester mixes industrial heritage with modern culture, from the Northern Quarter's indie shops to Deansgate's high-rises. Visitors balance football matches, live music, and business in Spinningfields, keeping the city lively most nights.",
    lgbtContext:
      "Canal Street anchors one of the UK's most vibrant LGBT scenes, with bars, clubs, and community spaces. Manchester Pride is a major annual event, and the city's inclusive culture makes queer visitors feel welcomed across most districts.",
    neighborhoods: [
      { name: "Canal Street & Village", vibe: "Heart of LGBT nightlife with hotels and bars where recovery sessions are in demand." },
      { name: "Northern Quarter", vibe: "Creative district with vintage shops, cafes, and guests who favour unique, design-led studios." },
      { name: "Spinningfields", vibe: "Business district with corporate travellers seeking stress relief near the office." },
      { name: "Deansgate & Castlefield", vibe: "Waterside dining and apartments with steady local wellness bookings." },
    ],
    events: [
      { name: "Manchester Pride", detail: "August bank holiday festival filling Canal Street hotels and driving demand citywide." },
      { name: "Football matches", detail: "United and City games bring matchday crowds and post-match recovery requests." },
      { name: "Parklife Festival", detail: "June music festival creates waves of bookings near Heaton Park." },
    ],
    weather:
      "Rainy and overcast much of the year, with mild winters. Indoor sessions are year-round favourites, especially on damp evenings.",
    tourism:
      "Music history, football culture, and northern business travel keep hotels full. Visitors often rely on trams, so proximity to stops helps.",
    culture:
      "Friendly, down-to-earth, and proud of its working-class roots. Service expectations centre on warmth, reliability, and no-nonsense communication.",
    massageReasons: [
      "Recovery after football matches and live music at the Arena.",
      "Stress relief for corporate visitors in Spinningfields and MediaCityUK.",
      "Post-night-out sessions near Canal Street and the Northern Quarter.",
      "Cooling, calming work after walking between tram stops and venues.",
      "LGBT-affirming care that matches Manchester's inclusive reputation.",
    ],
    faqs: [
      {
        question: "Where do most visitors book in Manchester?",
        answer: "Canal Street, the Northern Quarter, and city centre hotels. Mobile therapists often plan around tram routes to avoid traffic delays.",
      },
      {
        question: "Is Manchester LGBT-friendly for massage?",
        answer: "Absolutely. Canal Street is openly queer, and many therapists highlight inclusive practices and pronoun awareness.",
      },
      {
        question: "How busy is Pride weekend?",
        answer: "Extremely. Book 48 hours ahead to secure slots, as therapists fill up fast around the August bank holiday.",
      },
    ],
  },
  birmingham: {
    label: "Birmingham",
    state: "UK",
    description:
      "Birmingham is the UK's second city, blending canals, corporate districts, and creative quarters like Digbeth. Visitors split time between business meetings, the Bullring shopping, and live events at arenas and theatres.",
    lgbtContext:
      "The Gay Village around Hurst Street hosts bars, clubs, and community events. Birmingham Pride draws huge crowds each May, and the city's diverse, welcoming culture supports inclusive service providers.",
    neighborhoods: [
      { name: "Gay Village & Hurst Street", vibe: "Nightlife hub with hotels and recovery demand after late events." },
      { name: "Digbeth", vibe: "Warehouse venues, street art, and creative spaces with regular local clients." },
      { name: "City Centre & Bullring", vibe: "Shopping and business district with foot traffic needing relief after long days." },
      { name: "Jewellery Quarter", vibe: "Historic quarter with boutique hotels and quieter wellness bookings." },
    ],
    events: [
      { name: "Birmingham Pride", detail: "May bank holiday festival centred on the Gay Village with parades and concerts." },
      { name: "Crufts and NEC events", detail: "Convention centre events drive hotel bookings and mobile massage requests." },
      { name: "Arena concerts", detail: "Touring acts at Utilita Arena create post-event demand citywide." },
    ],
    weather:
      "Mild and rainy, with grey skies common. Indoor sessions are popular, especially in autumn and winter months.",
    tourism:
      "Convention travel, shopping weekends, and Midlands business keep demand steady. Visitors often arrive via New Street station and rely on local trams.",
    culture:
      "Diverse, multicultural, and hardworking. Clients appreciate punctuality, clear rates, and friendly, respectful conversation.",
    massageReasons: [
      "Foot and leg relief after shopping the Bullring and walking the canals.",
      "Stress reduction for convention and NEC visitors.",
      "Post-night-out recovery near the Gay Village and Broad Street.",
      "Desk strain for corporate travellers staying near New Street.",
      "LGBT-welcoming care in a city known for its inclusive Pride events.",
    ],
    faqs: [
      {
        question: "Where do visitors usually book in Birmingham?",
        answer: "City centre hotels, the Gay Village, and Jewellery Quarter. Mobile therapists often plan routes to avoid peak-hour traffic on the ring road.",
      },
      {
        question: "Is Birmingham inclusive for LGBT massage clients?",
        answer: "Yes. The Gay Village is highly visible, and Pride's scale reflects the city's welcoming approach to queer visitors.",
      },
      {
        question: "How does convention season affect bookings?",
        answer: "NEC events fill hotels fast. Booking a day ahead helps secure preferred times, especially mid-week.",
      },
    ],
  },
  edinburgh: {
    label: "Edinburgh",
    state: "UK",
    description:
      "Edinburgh blends medieval Old Town cobbles with Georgian New Town elegance. Visitors climb to the Castle, stroll the Royal Mile, and explore Princes Street, often walking miles between historic sites and cultural venues.",
    lgbtContext:
      "The Pink Triangle around Broughton Street hosts LGBT bars and community spaces. Edinburgh's Fringe and Pride events celebrate inclusivity, and the city's culture is welcoming to queer visitors seeking respectful, discreet service.",
    neighborhoods: [
      { name: "Old Town & Royal Mile", vibe: "Tourist heart with hotels and guests needing relief after climbing hills." },
      { name: "New Town & Princes Street", vibe: "Georgian architecture, shopping, and business travellers seeking calm sessions." },
      { name: "Broughton Street & Pink Triangle", vibe: "LGBT quarter with bars, cafes, and regular wellness bookings." },
      { name: "Leith", vibe: "Waterfront dining and creative spaces with locals favouring trusted providers." },
    ],
    events: [
      { name: "Edinburgh Fringe", detail: "August arts festival flooding the city with performers and visitors needing recovery work." },
      { name: "Edinburgh Pride", detail: "June celebration with parades and parties centred on Broughton Street." },
      { name: "Hogmanay", detail: "New Year's street party creating waves of demand for post-celebration sessions." },
    ],
    weather:
      "Cool and windy year-round, with chilly winters. Indoor, warm sessions are especially appealing after outdoor sightseeing.",
    tourism:
      "Year-round tourism peaks during Fringe and Hogmanay. Visitors often stay near Waverley station and rely on buses or walk the compact city centre.",
    culture:
      "Polite, cultured, and proud of heritage. Service expectations emphasise professionalism, punctuality, and respectful conversation.",
    massageReasons: [
      "Leg and foot relief after climbing Castle Hill and walking the Royal Mile.",
      "Stress management during the hectic Fringe festival season.",
      "Post-flight recovery for arrivals via Edinburgh Airport.",
      "Warming, calming sessions after windy walks along Princes Street.",
      "LGBT-affirming care near Broughton Street and the Pink Triangle.",
    ],
    faqs: [
      {
        question: "Where do visitors book most often in Edinburgh?",
        answer: "Old Town hotels, New Town apartments, and Broughton Street. Hilly streets mean mobile therapists plan carefully for parking and access.",
      },
      {
        question: "How busy is Fringe season for massage?",
        answer: "Extremely. August bookings should be made 48-72 hours ahead to avoid sold-out schedules.",
      },
      {
        question: "Is Edinburgh welcoming for LGBT clients?",
        answer: "Yes. The Pink Triangle is openly queer, and many providers note inclusive policies and pronoun awareness.",
      },
    ],
  },
  glasgow: {
    label: "Glasgow",
    state: "UK",
    description:
      "Glasgow is Scotland's largest city, known for Victorian architecture, live music, and a thriving arts scene. Visitors move between the Style Mile shopping, West End culture, and the Merchant City's bars and restaurants.",
    lgbtContext:
      "The Merchant City and surrounding areas host LGBT bars, clubs, and community hubs. Glasgow Pride is a major event, and the city's friendly, unpretentious culture makes inclusive service the norm for most providers.",
    neighborhoods: [
      { name: "Merchant City", vibe: "Historic quarter with bars, hotels, and recovery demand after nightlife." },
      { name: "West End", vibe: "University area with cafes, galleries, and locals booking regular wellness sessions." },
      { name: "City Centre & Style Mile", vibe: "Shopping and business district with foot traffic needing relief after long days." },
      { name: "Finnieston", vibe: "Trendy dining and nightlife strip attracting younger, design-conscious clients." },
    ],
    events: [
      { name: "Glasgow Pride", detail: "July celebration with parades and events centred on the Merchant City." },
      { name: "Celtic Connections", detail: "January music festival drawing crowds for late-night concerts and sessions." },
      { name: "Football matches", detail: "Rangers and Celtic games create matchday energy and post-game demand." },
    ],
    weather:
      "Damp and cool most of the year, with frequent rain. Indoor sessions are popular, especially on grey winter evenings.",
    tourism:
      "Music, football, and arts tourism keep hotels steady. Visitors often arrive via Central or Queen Street stations and rely on the Subway for short trips.",
    culture:
      "Warm, humorous, and no-nonsense. Clients value friendliness, punctuality, and straightforward communication.",
    massageReasons: [
      "Recovery after football matches and live music at the Hydro.",
      "Stress relief for business travellers in the City Centre.",
      "Post-night-out sessions near the Merchant City and Finnieston.",
      "Foot and leg relief after walking the West End and Style Mile.",
      "LGBT-welcoming care that reflects Glasgow's inclusive Pride culture.",
    ],
    faqs: [
      {
        question: "Where do most bookings happen in Glasgow?",
        answer: "City Centre hotels, the Merchant City, and West End apartments. The Subway makes short trips easy, so proximity to stations helps.",
      },
      {
        question: "Is Glasgow LGBT-friendly for massage clients?",
        answer: "Yes. Pride and the Merchant City scene are highly visible, and many therapists highlight inclusive practices.",
      },
      {
        question: "How do football matches affect scheduling?",
        answer: "Matchdays bring crowds and traffic. Booking early in the day or after crowds clear keeps arrivals on time.",
      },
    ],
  },
  bristol: {
    label: "Bristol",
    state: "UK",
    description:
      "Bristol blends maritime history with modern creativity, from the harbourside to Clifton's Georgian terraces. Visitors explore street art, independent shops, and live music venues, often walking or cycling between districts.",
    lgbtContext:
      "Old Market and Stokes Croft host LGBT bars and community spaces, with Bristol Pride drawing large summer crowds. The city's progressive culture makes inclusive, respectful service widely expected.",
    neighborhoods: [
      { name: "Harbourside", vibe: "Waterfront dining and hotels with tourists seeking post-walk recovery." },
      { name: "Clifton", vibe: "Georgian elegance and the Suspension Bridge, attracting upscale wellness bookings." },
      { name: "Stokes Croft & Old Market", vibe: "Street art, LGBT venues, and creative spaces with regular local clients." },
      { name: "Broadmead & City Centre", vibe: "Shopping and business district with steady foot traffic and stress relief demand." },
    ],
    events: [
      { name: "Bristol Pride", detail: "July festival with parades and events centred on Old Market and the city centre." },
      { name: "Harbour Festival", detail: "Summer waterfront celebration creating waves of demand along the docks." },
      { name: "Balloon Fiesta", detail: "August hot air balloon event drawing crowds to Ashton Court and citywide hotels." },
    ],
    weather:
      "Mild and rainy, with southwest winds. Indoor sessions are popular, especially in autumn and winter months.",
    tourism:
      "Arts, university life, and harbourside tourism keep demand steady. Visitors often rely on buses and cycling, so clear directions help.",
    culture:
      "Independent, creative, and environmentally conscious. Clients value authenticity, punctuality, and friendly, relaxed conversation.",
    massageReasons: [
      "Leg relief after walking the harbourside and climbing to Clifton.",
      "Stress management for university visitors and business travellers.",
      "Post-festival recovery near Stokes Croft and Old Market venues.",
      "Cooling, calming work after cycling around the city's hilly terrain.",
      "LGBT-affirming care that matches Bristol's progressive reputation.",
    ],
    faqs: [
      {
        question: "Where do visitors book most often in Bristol?",
        answer: "Harbourside hotels, Clifton apartments, and Old Market. Mobile therapists often plan around bus routes and parking restrictions.",
      },
      {
        question: "Is Bristol welcoming for LGBT massage clients?",
        answer: "Yes. Pride and Old Market venues are highly visible, and many providers note inclusive policies.",
      },
      {
        question: "How does the hilly terrain affect mobile sessions?",
        answer: "Clifton and other hills can slow parking. Sharing exact addresses and stairwell access keeps arrivals smooth.",
      },
    ],
  },
  liverpool: {
    label: "Liverpool",
    state: "UK",
    description:
      "Liverpool blends Beatles heritage with a vibrant waterfront. Visitors explore Albert Dock, Baltic Triangle creativity, and football culture, often walking between museums, venues, and the iconic Cavern Club.",
    lgbtContext:
      "The Stanley Street Quarter hosts LGBT bars and community events, with LiverpoolPride drawing summer crowds. The city's friendly, welcoming culture supports inclusive service across most districts.",
    neighborhoods: [
      { name: "Stanley Street Quarter", vibe: "LGBT nightlife hub with bars, hotels, and recovery demand after late events." },
      { name: "Albert Dock & Waterfront", vibe: "Tourist centre with museums, dining, and guests seeking post-walk sessions." },
      { name: "Baltic Triangle", vibe: "Creative warehouses, street food, and design-conscious wellness bookings." },
      { name: "City Centre & Liverpool One", vibe: "Shopping district with foot traffic and stress relief demand." },
    ],
    events: [
      { name: "LiverpoolPride", detail: "July festival centred on Stanley Street with parades and community events." },
      { name: "Liverpool International Music Festival", detail: "Summer concerts at Sefton Park creating post-event demand." },
      { name: "Football matches", detail: "Liverpool FC and Everton games drive matchday energy and recovery requests." },
    ],
    weather:
      "Rainy and windy, with mild winters. Indoor sessions are popular year-round, especially on grey Atlantic days.",
    tourism:
      "Music tourism, football, and waterfront culture keep hotels busy. Visitors often arrive via Lime Street station and rely on buses or walk the compact centre.",
    culture:
      "Warm, humorous, and fiercely proud. Service expectations centre on friendliness, reliability, and down-to-earth conversation.",
    massageReasons: [
      "Foot and leg relief after walking Albert Dock and the waterfront.",
      "Recovery after football matches and nights out near Stanley Street.",
      "Stress reduction for music tourists and conference visitors.",
      "Post-travel sessions for arrivals via Lime Street or John Lennon Airport.",
      "LGBT-welcoming care in a city known for its inclusive Pride scene.",
    ],
    faqs: [
      {
        question: "Where do visitors book most often in Liverpool?",
        answer: "City centre hotels, Stanley Street, and Albert Dock. Mobile therapists often plan around matchday traffic and pedestrian zones.",
      },
      {
        question: "Is Liverpool LGBT-friendly for massage?",
        answer: "Yes. Stanley Street is openly queer, and Pride's scale reflects the city's welcoming culture.",
      },
      {
        question: "How do football matches affect timing?",
        answer: "Matchdays bring heavy crowds. Booking early in the day or after kick-off keeps arrivals predictable.",
      },
    ],
  },
  leeds: {
    label: "Leeds",
    state: "UK",
    description:
      "Leeds is a northern powerhouse blending Victorian arcades with modern shopping and business districts. Visitors split time between Leeds Dock, the Calls, and corporate meetings, often walking or using the city's compact layout.",
    lgbtContext:
      "The Lower Briggate area and surrounding venues host LGBT bars and community spaces. Leeds Pride is a growing event, and the city's culture is increasingly inclusive and welcoming to queer visitors.",
    neighborhoods: [
      { name: "Lower Briggate & Call Lane", vibe: "Nightlife and LGBT venues with recovery demand after late events." },
      { name: "Leeds Dock", vibe: "Waterfront dining and apartments with steady wellness bookings." },
      { name: "City Centre & Victoria Quarter", vibe: "Shopping arcades and business district with foot traffic and stress relief demand." },
      { name: "Headingley", vibe: "Student area with locals booking regular maintenance sessions near the university." },
    ],
    events: [
      { name: "Leeds Pride", detail: "August celebration centred on Lower Briggate with parades and community events." },
      { name: "Leeds Festival", detail: "August music festival at Bramham Park creating waves of demand citywide." },
      { name: "First Direct Arena concerts", detail: "Touring acts and events driving post-show recovery requests." },
    ],
    weather:
      "Cool and rainy, with cold winters. Indoor sessions are popular, especially during grey autumn and winter months.",
    tourism:
      "Business travel, university life, and shopping weekends keep hotels steady. Visitors often arrive via Leeds station and rely on buses or walk.",
    culture:
      "Friendly, hardworking, and down-to-earth. Clients value punctuality, clear communication, and no-nonsense service.",
    massageReasons: [
      "Desk and shoulder strain for corporate travellers in the business district.",
      "Foot relief after shopping Victoria Quarter and walking the city centre.",
      "Recovery after concerts and festivals near the Arena and Bramham Park.",
      "Stress management for university visitors and student locals.",
      "LGBT-affirming care that matches Leeds' growing inclusive reputation.",
    ],
    faqs: [
      {
        question: "Where do most bookings happen in Leeds?",
        answer: "City centre hotels, Lower Briggate, and Leeds Dock. Mobile therapists often plan around peak shopping hours and student areas.",
      },
      {
        question: "Is Leeds LGBT-friendly for massage clients?",
        answer: "Yes. Pride and Lower Briggate venues are increasingly visible, and many therapists note inclusive practices.",
      },
      {
        question: "How does festival season affect bookings?",
        answer: "Leeds Festival weekend fills hotels fast. Booking 48 hours ahead helps secure slots.",
      },
    ],
  },
  newcastle: {
    label: "Newcastle",
    state: "UK",
    description:
      "Newcastle blends Tyneside heritage with modern culture, from the Quayside to Northumberland Street shopping. Visitors explore bridges, nightlife, and the Baltic arts centre, often walking steep hills between districts.",
    lgbtContext:
      "The Times Square area and surrounding venues host LGBT bars and community events. Newcastle Pride is a major summer celebration, and the city's welcoming, unpretentious culture supports inclusive service.",
    neighborhoods: [
      { name: "Times Square & Pink Triangle", vibe: "LGBT nightlife hub with bars and recovery demand after events." },
      { name: "Quayside", vibe: "Riverside dining, galleries, and guests seeking post-walk sessions." },
      { name: "City Centre & Northumberland Street", vibe: "Shopping district with foot traffic and stress relief demand." },
      { name: "Jesmond", vibe: "Leafy residential area with regular local wellness bookings." },
    ],
    events: [
      { name: "Northern Pride", detail: "July celebration centred on Town Moor with parades and festivals." },
      { name: "Great North Run", detail: "September half-marathon bringing runners and supporters citywide." },
      { name: "Utilita Arena concerts", detail: "Touring acts creating post-event demand near the Quayside." },
    ],
    weather:
      "Cool and windy, with cold winters. Indoor sessions are popular, especially after outdoor sightseeing or events.",
    tourism:
      "Nightlife, football, and arts tourism keep hotels steady. Visitors often arrive via Central Station and rely on the Metro for short trips.",
    culture:
      "Warm, funny, and fiercely loyal. Service expectations centre on friendliness, punctuality, and straightforward conversation.",
    massageReasons: [
      "Leg and foot relief after climbing Newcastle's steep hills and bridges.",
      "Recovery after football matches and nights out near Times Square.",
      "Stress management for business travellers and Great North Run participants.",
      "Post-travel sessions for arrivals via Central Station or Newcastle Airport.",
      "LGBT-welcoming care that reflects Northern Pride's inclusive culture.",
    ],
    faqs: [
      {
        question: "Where do visitors book most often in Newcastle?",
        answer: "City centre hotels, Quayside apartments, and Times Square. The Metro makes short trips easy, so proximity to stations helps.",
      },
      {
        question: "Is Newcastle LGBT-friendly for massage?",
        answer: "Yes. Northern Pride and Times Square are highly visible, and many therapists highlight inclusive practices.",
      },
      {
        question: "How do the hills affect mobile sessions?",
        answer: "Steep streets can slow parking and access. Sharing exact addresses and stairwell details keeps arrivals smooth.",
      },
    ],
  },
  brighton: {
    label: "Brighton",
    state: "UK",
    description:
      "Brighton is the UK's seaside capital of bohemian culture, blending pebble beaches with pier amusements and the vibrant Lanes. Visitors walk the seafront, explore independent shops, and enjoy one of Europe's most visible LGBT scenes.",
    lgbtContext:
      "Brighton is famously queer-friendly, with LGBT venues throughout the city centre, Kemptown, and St James's Street. Pride is huge here, and inclusive service is the default expectation across hospitality and wellness providers.",
    neighborhoods: [
      { name: "Kemptown & St James's Street", vibe: "Heart of LGBT nightlife with bars, clubs, and regular wellness bookings." },
      { name: "The Lanes & North Laine", vibe: "Independent shops, cafes, and design-conscious visitors seeking unique studios." },
      { name: "Seafront & Palace Pier", vibe: "Tourist hub with hotels and guests needing relief after long beach walks." },
      { name: "Hanover & Seven Dials", vibe: "Residential hills with locals booking trusted, regular providers." },
    ],
    events: [
      { name: "Brighton Pride", detail: "August festival with parades, park events, and massive hotel demand citywide." },
      { name: "Brighton Festival", detail: "May arts festival creating waves of cultural tourism and wellness requests." },
      { name: "Burning the Clocks", detail: "Winter solstice parade bringing crowds to the seafront and city centre." },
    ],
    weather:
      "Mild coastal climate with sea breezes. Winters are cool but not harsh, and summer afternoons make beachside sessions appealing.",
    tourism:
      "Year-round tourism peaks during Pride and summer weekends. Visitors often arrive via Brighton station and walk or use buses along the coast.",
    culture:
      "Creative, bohemian, and fiercely inclusive. Service expectations emphasise authenticity, respect for diversity, and relaxed professionalism.",
    massageReasons: [
      "Foot and leg relief after walking the seafront, pier, and Lanes.",
      "Recovery after Pride festivities and late-night Kemptown events.",
      "Stress management for creative professionals and festival visitors.",
      "Post-travel sessions for arrivals from London and Gatwick Airport.",
      "LGBT-affirming care in the UK's most openly queer city.",
    ],
    faqs: [
      {
        question: "Where do visitors book most often in Brighton?",
        answer: "Seafront hotels, Kemptown, and the Lanes. Mobile therapists often plan around seafront traffic and Pride road closures.",
      },
      {
        question: "Is Brighton the best UK city for LGBT massage clients?",
        answer: "It's among the most visible and inclusive. Many therapists are queer themselves and explicitly welcome LGBT clients.",
      },
      {
        question: "How busy is Pride weekend for bookings?",
        answer: "Extremely. Book at least 72 hours ahead, as therapists fill up fast during August Pride.",
      },
    ],
  },
};

export const getCityContent = (slug: string): CityContent =>
  cityMap[slug.toLowerCase()] ?? fallbackCityContent(slug);
