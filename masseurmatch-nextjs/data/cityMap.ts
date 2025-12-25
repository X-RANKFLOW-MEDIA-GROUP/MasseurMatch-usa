export type CityInfo = {
  slug: string;
  name: string;
  state?: string;
  country?: string;
  neighbors?: string[];
  population?: string;
  region?: string;
};

export const cityMap: Record<string, CityInfo> = {
  "los-angeles": {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "CA",
    country: "US",
    neighbors: ["glendale", "burbank", "pasadena"],
  },
  miami: {
    slug: "miami",
    name: "Miami",
    state: "FL",
    country: "US",
    neighbors: ["miami-beach", "coral-gables"],
  },
  "new-york": {
    slug: "new-york",
    name: "New York",
    state: "NY",
    country: "US",
    neighbors: ["brooklyn", "queens", "manhattan"],
  },
  dallas: {
    slug: "dallas",
    name: "Dallas",
    state: "TX",
    country: "US",
    neighbors: ["irving", "plano", "arlington"],
  },
  // Add more cities...
};
