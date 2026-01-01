export const cityMap: Record<string, { name: string; state?: string }> = {
  "dallas-tx": { name: "Dallas, TX" },
  "los-angeles-ca": { name: "Los Angeles, CA" },
};

export const neighbors: Record<string, string[]> = {
  "dallas-tx": ["fort-worth-tx", "arlington-tx"],
};
