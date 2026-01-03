export type CityInfo = {
  slug: string;
  name: string;
  state: string;
  country?: string;
};

export const cityMap: Record<string, CityInfo> = {
  "los-angeles": {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "CA",
    country: "US",
  },
  "new-york": {
    slug: "new-york",
    name: "New York",
    state: "NY",
    country: "US",
  },
  "san-francisco": {
    slug: "san-francisco",
    name: "San Francisco",
    state: "CA",
    country: "US",
  },
  miami: {
    slug: "miami",
    name: "Miami",
    state: "FL",
    country: "US",
  },
  chicago: {
    slug: "chicago",
    name: "Chicago",
    state: "IL",
    country: "US",
  },
  dallas: {
    slug: "dallas",
    name: "Dallas",
    state: "TX",
    country: "US",
  },
  seattle: {
    slug: "seattle",
    name: "Seattle",
    state: "WA",
    country: "US",
  },
  denver: {
    slug: "denver",
    name: "Denver",
    state: "CO",
    country: "US",
  },
};

export const getAllCities = () => Object.values(cityMap);
export const getCityBySlug = (slug: string) => cityMap[slug];
