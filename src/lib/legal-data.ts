export interface LegalDocument {
  slug: string;
  title: string;
  lastUpdated: string;
  category: string;
}

export const legalDocuments: LegalDocument[] = [
  {
    slug: "terms-of-service",
    title: "Terms of Service",
    lastUpdated: "2025-01-01",
    category: "legal",
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    lastUpdated: "2025-01-01",
    category: "legal",
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    lastUpdated: "2025-01-01",
    category: "legal",
  },
];
