import Link from "next/link";
import { cityMap } from "@/data/cityMap";
import { SITE_NAME } from "@/lib/site";

const highlights = [
  { title: "Profiles with depth", copy: "Every therapist page uses JSON-LD, canonical metadata, and evergreen SEO content tailored to the city." },
  { title: "City filters", copy: "City + segment pages (deep tissue, gay massage, sports massage) surface qualified therapists with curated narratives." },
  { title: "Dashboard wizard", copy: "Ten-section ad editing, billing insights, and favorites live inside a protected Supabase flow." },
];

export default function Home() {
  const featuredCities = Object.values(cityMap).slice(0, 4);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
        <section className="space-y-4">
          <p className="text-sm uppercase tracking-[0.5em] text-slate-400">Massagetherapy marketing</p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            Built for inclusive massage communities with spotlight SEO and an admin wizard that feels premium.
          </h1>
          <p className="max-w-3xl text-lg text-slate-300">
            {SITE_NAME} pairs city landing pages, therapist profiles, and segment filters with a Supabase-powered dashboard that keeps payments, editing, and favorites in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/city/los-angeles"
              className="rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Explore Los Angeles
            </Link>
            <Link
              href="/dashboard/ads"
              className="rounded-2xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              View dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-800 bg-white/5 p-6"
            >
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{item.copy}</p>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Launch cities</h2>
            <Link href="/city/los-angeles" className="text-sm font-semibold text-slate-300 hover:text-white">
              See all → 
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                className="group flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-5 transition hover:border-white/40 hover:bg-white/10"
              >
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-slate-400">
                    City landing
                  </p>
                  <h3 className="text-2xl font-semibold text-white">{city.name}</h3>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
                  {city.state ?? "US"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
