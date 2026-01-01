import { Metadata } from "next";
import Link from "next/link";
import { Check, Star, Zap, Crown } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | MasseurMatch",
  description: "Choose the perfect plan for your massage therapy business. Affordable pricing with no hidden fees.",
};

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Get started with basic features",
    icon: Star,
    features: [
      "Basic profile listing",
      "Up to 3 photos",
      "Client messaging",
      "Basic analytics",
      "Community support",
    ],
    cta: "Get Started",
    href: "/join",
    popular: false,
  },
  {
    name: "Pro",
    price: 49,
    description: "Everything you need to grow",
    icon: Zap,
    features: [
      "Featured in search results",
      "Unlimited photos",
      "Priority messaging",
      "Advanced analytics",
      "Calendar integration",
      "Booking widget",
      "Priority support",
      "No platform fees",
    ],
    cta: "Start Free Trial",
    href: "/checkout?plan=pro",
    popular: true,
  },
  {
    name: "Premium",
    price: 99,
    description: "For established professionals",
    icon: Crown,
    features: [
      "Everything in Pro",
      "Top placement in city",
      "Custom branding",
      "Multiple locations",
      "Team accounts",
      "API access",
      "Dedicated account manager",
      "White-glove onboarding",
    ],
    cta: "Contact Sales",
    href: "/checkout?plan=premium",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MasseurMatch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link
              href="/join"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
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
            Simple, Transparent{" "}
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the plan that fits your practice. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? "border-2 border-violet-500 bg-gradient-to-br from-violet-600/20 to-indigo-600/20"
                  : "border border-white/10 bg-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-violet-600 text-white text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <plan.icon className={`h-10 w-10 mb-4 ${plan.popular ? "text-violet-400" : "text-slate-400"}`} />
                <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
                <p className="text-slate-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${plan.price}</span>
                <span className="text-slate-400">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-slate-300">
                    <Check className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full text-center rounded-xl py-3 font-semibold transition-colors ${
                  plan.popular
                    ? "bg-violet-600 text-white hover:bg-violet-500"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I switch plans later?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, Pro plans come with a 14-day free trial. No credit card required to start.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. There are no long-term contracts. Cancel anytime from your dashboard.",
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
        <div className="mt-16 text-center rounded-3xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to grow your practice?</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join thousands of massage therapists who are growing their business with MasseurMatch.
          </p>
          <Link
            href="/join"
            className="inline-block rounded-xl bg-violet-600 px-8 py-4 font-semibold text-white hover:bg-violet-500 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </main>
    </div>
  );
}
