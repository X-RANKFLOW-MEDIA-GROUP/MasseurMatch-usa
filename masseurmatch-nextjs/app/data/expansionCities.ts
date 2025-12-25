export type ExpansionCity = {
  name: string;
  state: string;
  population: string;
  region: string;
};

export const expansionCities = {
  // Major metros
  "new-york": { name: "New York", state: "NY", population: "8.3M", region: "Northeast" },
  "los-angeles": { name: "Los Angeles", state: "CA", population: "3.9M", region: "West Coast" },
  chicago: { name: "Chicago", state: "IL", population: "2.7M", region: "Midwest" },
  houston: { name: "Houston", state: "TX", population: "2.3M", region: "South" },
  phoenix: { name: "Phoenix", state: "AZ", population: "1.7M", region: "Southwest" },
  philadelphia: { name: "Philadelphia", state: "PA", population: "1.6M", region: "Northeast" },
  "san-antonio": { name: "San Antonio", state: "TX", population: "1.5M", region: "South" },
  "san-diego": { name: "San Diego", state: "CA", population: "1.4M", region: "West Coast" },
  dallas: { name: "Dallas", state: "TX", population: "1.3M", region: "South" },
  "san-jose": { name: "San Jose", state: "CA", population: "1.0M", region: "West Coast" },

  // LGBT-friendly cities
  "san-francisco": { name: "San Francisco", state: "CA", population: "874K", region: "West Coast" },
  seattle: { name: "Seattle", state: "WA", population: "750K", region: "Pacific Northwest" },
  miami: { name: "Miami", state: "FL", population: "470K", region: "Southeast" },
  atlanta: { name: "Atlanta", state: "GA", population: "500K", region: "Southeast" },
  boston: { name: "Boston", state: "MA", population: "690K", region: "Northeast" },
  "washington-dc": { name: "Washington", state: "DC", population: "700K", region: "Mid-Atlantic" },
  denver: { name: "Denver", state: "CO", population: "715K", region: "Mountain West" },
  portland: { name: "Portland", state: "OR", population: "650K", region: "Pacific Northwest" },
  austin: { name: "Austin", state: "TX", population: "970K", region: "South" },
  "las-vegas": { name: "Las Vegas", state: "NV", population: "650K", region: "Southwest" },

  // Additional major cities
  "fort-worth": { name: "Fort Worth", state: "TX", population: "920K", region: "South" },
  columbus: { name: "Columbus", state: "OH", population: "900K", region: "Midwest" },
  charlotte: { name: "Charlotte", state: "NC", population: "880K", region: "Southeast" },
  indianapolis: { name: "Indianapolis", state: "IN", population: "880K", region: "Midwest" },
  "san-bernardino": { name: "San Bernardino", state: "CA", population: "220K", region: "West Coast" },
  jacksonville: { name: "Jacksonville", state: "FL", population: "950K", region: "Southeast" },
  nashville: { name: "Nashville", state: "TN", population: "690K", region: "South" },
  detroit: { name: "Detroit", state: "MI", population: "640K", region: "Midwest" },
  memphis: { name: "Memphis", state: "TN", population: "630K", region: "South" },
  "oklahoma-city": { name: "Oklahoma City", state: "OK", population: "680K", region: "South" },
  louisville: { name: "Louisville", state: "KY", population: "630K", region: "South" },
  baltimore: { name: "Baltimore", state: "MD", population: "580K", region: "Mid-Atlantic" },
  milwaukee: { name: "Milwaukee", state: "WI", population: "580K", region: "Midwest" },
  albuquerque: { name: "Albuquerque", state: "NM", population: "560K", region: "Southwest" },
  tucson: { name: "Tucson", state: "AZ", population: "550K", region: "Southwest" },
  fresno: { name: "Fresno", state: "CA", population: "540K", region: "West Coast" },
  mesa: { name: "Mesa", state: "AZ", population: "510K", region: "Southwest" },
  sacramento: { name: "Sacramento", state: "CA", population: "520K", region: "West Coast" },
  "kansas-city": { name: "Kansas City", state: "MO", population: "510K", region: "Midwest" },
  "long-beach": { name: "Long Beach", state: "CA", population: "470K", region: "West Coast" },

  // Resort & vacation cities
  "palm-springs": { name: "Palm Springs", state: "CA", population: "48K", region: "Southwest" },
  "key-west": { name: "Key West", state: "FL", population: "25K", region: "Southeast" },
  "fort-lauderdale": { name: "Fort Lauderdale", state: "FL", population: "182K", region: "Southeast" },
  "west-hollywood": { name: "West Hollywood", state: "CA", population: "35K", region: "West Coast" },
  provincetown: { name: "Provincetown", state: "MA", population: "3K", region: "Northeast" },

  // Additional metro areas
  raleigh: { name: "Raleigh", state: "NC", population: "470K", region: "Southeast" },
  omaha: { name: "Omaha", state: "NE", population: "480K", region: "Midwest" },
  "colorado-springs": { name: "Colorado Springs", state: "CO", population: "480K", region: "Mountain West" },
  minneapolis: { name: "Minneapolis", state: "MN", population: "430K", region: "Midwest" },
  tampa: { name: "Tampa", state: "FL", population: "400K", region: "Southeast" },
} as const;

export type ExpansionCitySlug = keyof typeof expansionCities;

export function getExpansionCity(slug: string): ExpansionCity | undefined {
  return expansionCities[slug as ExpansionCitySlug];
}
