import { Metadata } from "next";
import Link from "next/link";
import { Check, Star, Zap, Crown, Sparkles, MapPin, Camera, Clock, BarChart3, BadgeCheck, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | MasseurMatch",
  description: "Choose the perfect plan for your massage therapy business. From free to elite, find the right fit.",
};

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    description: "Get started and try it out",
    icon: Star,
    features: [
      { text: "Up to 3 photos (1 slide)", icon: Camera },
      { text: "7 days free trial", icon: Clock },
      { text: "1 main city", icon: MapPin },
      { text: '"Available Now" 3×/day', icon: Zap },
      { text: "Basic Explore ranking", icon: BarChart3 },
    ],
    cta: "Start Free",
    href: "/join",
    popular: false,
  },
  {
    id: "standard",
    name: "Standard",
    price: 49,
    description: "For growing professionals",
    icon: Zap,
    features: [
      { text: "Up to 5 photos (2 slides)", icon: Camera },
      { text: "1 visitor city", icon: MapPin },
      { text: '"Available Now" 6×/day', icon: Clock },
      { text: "Verified Badge", icon: BadgeCheck },
      { text: "Standard support", icon: Headphones },
    ],
    cta: "Get Standard",
    href: "/checkout?plan=standard",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 89,
    description: "Most popular choice",
    icon: Crown,
    features: [
      { text: "Up to 6 photos (2 slides)", icon: Camera },
      { text: "Up to 3 visitor cities", icon: MapPin },
      { text: "Analytics + City Heatmap", icon: BarChart3 },
      { text: "1 highlight credit/month", icon: Sparkles },
      { text: "Verified Badge", icon: BadgeCheck },
    ],
    cta: "Get Pro",
    href: "/checkout?plan=pro",
    popular: true,
  },
  {
    id: "elite",
    name: "Elite",
    price: 149,
    description: "Maximum visibility & support",
    icon: Sparkles,
    features: [
      { text: "Up to 8 photos (3 slides)", icon: Camera },
      { text: "Top homepage placement", icon: Star },
      { text: 'Auto "Available" every 2h', icon: Clock },
      { text: "2 highlight credits/month", icon: Sparkles },
      { text: "VIP Support + Concierge", icon: Headphones },
    ],
    cta: "Get Elite",
    href: "/checkout?plan=elite",
    popular: false,
    elite: true,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            MasseurMatch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/join"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-white hover:bg-neutral-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
              Plan
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Start free, upgrade anytime. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 flex flex-col ${
                plan.popular
                  ? "border-2 border-neutral-300 bg-gradient-to-br from-white/20 to-neutral-100/20"
                  : plan.elite
                  ? "border-2 border-amber-500/50 bg-gradient-to-br from-amber-600/10 to-orange-600/10"
                  : "border border-white/10 bg-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-white text-xs font-medium">
                  MOST POPULAR
                </div>
              )}
              {plan.elite && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium">
                  VIP
                </div>
              )}

              <div className="mb-4">
                <plan.icon className={`h-8 w-8 mb-3 ${
                  plan.popular ? "text-white" : plan.elite ? "text-amber-400" : "text-slate-400"
                }`} />
                <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">${plan.price}</span>
                <span className="text-slate-400">/mo</span>
              </div>

              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-2 text-sm text-slate-300">
                    <feature.icon className={`h-4 w-4 shrink-0 mt-0.5 ${
                      plan.popular ? "text-white" : plan.elite ? "text-amber-400" : "text-green-400"
                    }`} />
                    {feature.text}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center rounded-xl py-3 font-semibold transition-colors ${
                  plan.popular
                    ? "bg-white text-white hover:bg-neutral-200"
                    : plan.elite
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Compare All Features</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-4 text-slate-400 font-medium">Feature</th>
                  <th className="py-4 px-4 text-center text-white">Free</th>
                  <th className="py-4 px-4 text-center text-white">Standard</th>
                  <th className="py-4 px-4 text-center text-white">Pro</th>
                  <th className="py-4 px-4 text-center text-amber-400">Elite</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { feature: "Photos", free: "3", standard: "5", pro: "6", elite: "8" },
                  { feature: "Slides", free: "1", standard: "2", pro: "2", elite: "3" },
                  { feature: "Main City", free: "1", standard: "1", pro: "1", elite: "1" },
                  { feature: "Visitor Cities", free: "—", standard: "1", pro: "3", elite: "Unlimited" },
                  { feature: "Available Now / Day", free: "3×", standard: "6×", pro: "Unlimited", elite: "Auto 2h" },
                  { feature: "Verified Badge", free: false, standard: true, pro: true, elite: true },
                  { feature: "Analytics", free: false, standard: false, pro: true, elite: true },
                  { feature: "City Heatmap", free: false, standard: false, pro: true, elite: true },
                  { feature: "Highlight Credits/mo", free: "—", standard: "—", pro: "1", elite: "2" },
                  { feature: "Top Homepage", free: false, standard: false, pro: false, elite: true },
                  { feature: "VIP Support", free: false, standard: false, pro: false, elite: true },
                  { feature: "Concierge", free: false, standard: false, pro: false, elite: true },
                ].map((row) => (
                  <tr key={row.feature} className="border-b border-white/5">
                    <td className="py-3 px-4 text-slate-300">{row.feature}</td>
                    {["free", "standard", "pro", "elite"].map((plan) => {
                      const value = row[plan as keyof typeof row];
                      return (
                        <td key={plan} className="py-3 px-4 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="h-5 w-5 text-green-400 mx-auto" />
                            ) : (
                              <span className="text-slate-600">—</span>
                            )
                          ) : (
                            <span className="text-white">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "What is the 7-day free trial?",
                a: "New users get 7 days to try the platform free. No credit card required to start.",
              },
              {
                q: 'What are "Visitor Cities"?',
                a: "Visitor cities let you appear in other cities when traveling. Great for therapists who travel for work.",
              },
              {
                q: "What are Highlight Credits?",
                a: "Highlight credits boost your profile to the top of search results for 24 hours, increasing visibility.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. No long-term contracts. Cancel anytime from your dashboard with one click.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/20 to-neutral-100/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to grow your practice?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join thousands of massage therapists who are growing their business with MasseurMatch.
          </p>
          <Link
            href="/join"
            className="inline-block rounded-xl bg-white px-8 py-4 font-semibold text-white hover:bg-neutral-200 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </main>
    </div>
  );
}
