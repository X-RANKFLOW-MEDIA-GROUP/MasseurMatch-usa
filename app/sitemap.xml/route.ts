import { MetadataRoute } from "next";

const BASE = "https://www.masseurmatch.com";

// Normaliza strings para URL
function slugify(str: string | null): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ------------------------
  // ROTAS ESTÁTICAS (fixas)
  // ------------------------
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${BASE}/waitlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7
    },
    {
      url: `${BASE}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9
    }
  ];

  // ------------------------
  // PERFIS DO SUPABASE
  // ------------------------
  let profileRoutes: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${BASE}/api/profiles`, {
      cache: "no-store"
    });

    if (res.ok) {
      const therapists = await res.json();

      profileRoutes = therapists.map((t: any) => {
        const city = slugify(t.city);
        const state = slugify(t.state);
        const slug = slugify(t.slug);

        return {
          url: `${BASE}/${state}/${city}/therapist/${slug}`,
          lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.85
        };
      });
    }
  } catch (err) {
    console.error("Sitemap error loading /api/profiles:", err);
  }

  // ------------------------
  // ROTAS DE CIDADE (explore/{state}/{city})
  // ------------------------
  const cityRoutes = Array.from(
    new Map(
      profileRoutes.map((p) => {
        const parts = p.url.replace(BASE, "").split("/");
        const state = parts[1];
        const city = parts[2];
        return [`${state}/${city}`, { state, city }];
      })
    ).values()
  ).map(({ state, city }) => ({
    url: `${BASE}/explore/${state}/${city}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8
  }));

  // ------------------------
  // JUNTANDO TUDO
  // ------------------------
  return [...staticRoutes, ...cityRoutes, ...profileRoutes];
}
