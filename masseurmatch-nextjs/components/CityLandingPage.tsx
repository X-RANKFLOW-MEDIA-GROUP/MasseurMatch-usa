import { CityInfo } from "@/data/cityMap";

type Props = {
  city: CityInfo;
  slug: string;
  segment?: string;
};

const CTA_EMAIL = "support@masseurmatch.com";

export default function CityLandingPage({ city, slug }: Props) {
  const { name, state, population, region } = city;
  const therapistMailto = `mailto:${CTA_EMAIL}?subject=${encodeURIComponent(
    `Therapist waitlist for ${name}, ${state}`,
  )}&body=${encodeURIComponent(
    `Hi MasseurMatch team,%0D%0A%0D%0AI'd like to be notified when you launch in ${name}, ${state}.%0D%0A%0D%0AName:%0D%0ALicense (if applicable):%0D%0AServices offered:%0D%0AWebsite/social:%0D%0A`,
  )}`;
  const clientMailto = `mailto:${CTA_EMAIL}?subject=${encodeURIComponent(
    `Client request for ${name}, ${state}`,
  )}&body=${encodeURIComponent(
    `Hello,%0D%0A%0D%0AI want MasseurMatch in ${name}, ${state}. Please keep me updated.%0D%0A%0D%0AWhat I'm looking for:%0D%0A- In-studio or mobile:%0D%0A- Preferred modalities:%0D%0A- Neighborhood/hotel area:%0D%0A`,
  )}`;

  return (
    <div className="bg-slate-950 text-slate-100">
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.12),_transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-14 sm:px-10 sm:pt-18">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-200/90">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_0_6px_rgba(139,92,246,0.2)]" />
            Expansion Preview - {region}
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Massage therapists for {name}, {state} - LGBT-inclusive, discreet,
            and coming soon.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            We are mapping trusted male massage and bodywork providers for{" "}
            {name}. Join the waitlist, request coverage in your neighborhood, or
            tell us you are a therapist ready to serve this city. Early interest
            shapes where we open next.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/join"
              className="inline-flex items-center justify-center rounded-lg bg-violet-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-violet-500/30 transition hover:-translate-y-[1px] hover:shadow-violet-500/40"
            >
              I am a massage therapist - Join waitlist
            </a>
            <a
              href={therapistMailto}
              className="inline-flex items-center justify-center rounded-lg border border-violet-300/60 px-5 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-200 hover:text-white hover:bg-violet-300/10"
            >
              Email the expansion team
            </a>
            <a
              href={clientMailto}
              className="inline-flex items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-violet-300/60 hover:text-violet-100"
            >
              I am a client - Notify me
            </a>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <p className="text-slate-400">City focus</p>
              <p className="text-lg font-semibold text-white">
                {name}, {state}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <p className="text-slate-400">Population</p>
              <p className="text-lg font-semibold text-white">{population}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <p className="text-slate-400">Region</p>
              <p className="text-lg font-semibold text-white">{region}</p>
            </div>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-white">
              Why bring MasseurMatch to {name}?
            </h2>
            <p className="text-slate-300">
              Clients in {name} ask for verified gay massage, male massage, and
              LGBTQ-friendly bodywork that is discreet, transparent, and easy to
              book. We prioritize therapists who communicate clearly about
              boundaries, pressure, travel radius, parking details, and hygiene
              so every session starts with trust.
            </p>
            <ul className="space-y-3 text-slate-200">
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                In-studio, hotel, and mobile options tailored for {name}{" "}
                neighborhoods and visitors.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                Emphasis on respectful, LGBT-affirming experiences for locals
                and travelers.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                Clear rates, travel fees, and availability so clients avoid
                back-and-forth.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-violet-400" />
                SEO-rich coverage so people searching &ldquo;gay massage {name}
                ,&rdquo; &ldquo;male massage {state},&rdquo; and &ldquo;LGBT
                bodywork {name}&rdquo; can find vetted options fast.
              </li>
            </ul>
          </div>

          <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-violet-500/10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
              Ready to list?
            </p>
            <h3 className="text-xl font-semibold text-white">
              Therapists: reserve your spot for {name}
            </h3>
            <p className="text-slate-300">
              Tell us where you work, the modalities you offer (deep tissue,
              sports, relaxation, Thai, mobile), and your availability. Early
              providers get priority placement when we open in {name}.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/join/form"
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-[1px]"
              >
                Complete the therapist intake
              </a>
              <a
                href={therapistMailto}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-violet-300/60"
              >
                Email us your details
              </a>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Fast-track checklist</p>
              <ul className="mt-2 space-y-2">
                <li>- Service area (incall, outcall, hotel-friendly)</li>
                <li>- Top techniques and pressure style</li>
                <li>- Safety/consent practices you follow</li>
                <li>- Links to site, socials, or license (if applicable)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/5 bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-white">
                Clients: stay in the loop for {name}, {state}
              </h2>
              <p className="text-slate-300">
                We are curating male massage therapists who serve busy
                professionals, travelers, and locals seeking discreet, LGBTQ
                friendly sessions. Add yourself to the interest list so we can
                prioritize the neighborhoods and hotel zones you use most.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={clientMailto}
                  className="inline-flex items-center justify-center rounded-lg bg-violet-400 px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-violet-500/30 transition hover:-translate-y-[1px]"
                >
                  Request coverage in my area
                </a>
                <a
                  href="/therapist"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-violet-300/60"
                >
                  Browse active cities
                </a>
              </div>
              <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-white">Popular searches</p>
                  <ul className="mt-2 space-y-1 text-slate-300">
                    <li>- Gay massage in {name}</li>
                    <li>- Male therapist near {state}</li>
                    <li>- Hotel massage for business trips</li>
                    <li>- Mobile deep tissue in {name}</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white">What you can expect</p>
                  <ul className="mt-2 space-y-1 text-slate-300">
                    <li>- Clear communication and boundaries</li>
                    <li>- Travel fees stated upfront</li>
                    <li>- LGBTQ-affirming providers</li>
                    <li>- Secure booking flow when we launch</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-black/30 p-6 text-sm text-slate-200">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200">
                Quick FAQ
              </p>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-white">
                    When will {name} go live?
                  </p>
                  <p className="text-slate-300">
                    We open cities based on therapist availability, demand
                    signals, and safety checks. Joining the waitlist helps us
                    prioritize {name} sooner.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">
                    I am licensed. Do I get priority?
                  </p>
                  <p className="text-slate-300">
                    Licensed or insured therapists who provide complete details
                    get faster onboarding and featured placement when we launch.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">
                    Can clients pre-book?
                  </p>
                  <p className="text-slate-300">
                    Not yet. We will notify interest-list clients in {name} and
                    open booking as soon as the first cohort of therapists is
                    verified.
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-white">
                    How do I suggest another neighborhood?
                  </p>
                  <p className="text-slate-300">
                    Email us with the exact area or hotel corridor you want
                    covered. High-demand zones help us route mobile providers
                    efficiently.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-violet-300/40 bg-violet-400/10 p-4 text-slate-200">
                <p className="font-semibold text-white">
                  Want us somewhere else?
                </p>
                <p className="mt-1 text-slate-100">
                  Send a quick note to{" "}
                  <a
                    className="text-violet-200 underline decoration-violet-300/70 underline-offset-2"
                    href={`mailto:${CTA_EMAIL}?subject=${encodeURIComponent(
                      "Suggest a new city for MasseurMatch",
                    )}&body=${encodeURIComponent(
                      `City suggestion (came from ${slug} page):\n\nCity & State:\nWhy it needs coverage:\nAny therapists you recommend:\n`,
                    )}`}
                  >
                    {CTA_EMAIL}
                  </a>{" "}
                  and we will add it to the roadmap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}




