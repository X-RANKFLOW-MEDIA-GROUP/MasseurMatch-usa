import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, UserCheck, AlertTriangle, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Trust & Safety | MasseurMatch",
  description: "Learn about MasseurMatch's commitment to trust, safety, and security.",
};

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            MasseurMatch
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center mb-12">
          <Shield className="h-16 w-16 text-white mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Trust & Safety</h1>
          <p className="text-xl text-slate-400">Your safety is our top priority</p>
        </div>

        <div className="space-y-8">
          {/* Safety Features */}
          <section className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: UserCheck,
                title: "Verified Profiles",
                desc: "All therapists undergo identity and license verification",
              },
              {
                icon: Lock,
                title: "Secure Platform",
                desc: "Your data and privacy are protected with encryption",
              },
              {
                icon: Eye,
                title: "24/7 Monitoring",
                desc: "Our team monitors the platform around the clock",
              },
              {
                icon: AlertTriangle,
                title: "Easy Reporting",
                desc: "Report concerns easily through our app or website",
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <feature.icon className="h-8 w-8 text-white mb-3" />
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </section>

          {/* Verification Process */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Our Verification Process</h2>
            <div className="space-y-4">
              {[
                "License verification with state boards",
                "Background checks through certified agencies",
                "Identity verification with government ID",
                "Insurance documentation review",
                "Ongoing monitoring and periodic re-verification",
              ].map((step, i) => (
                <div key={step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-white font-semibold">
                    {i + 1}
                  </div>
                  <span className="text-slate-300">{step}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Safety Tips */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Safety Tips</h2>
            <ul className="space-y-3">
              {[
                "Contact therapists directly using provided information",
                "Meet in professional settings only",
                "Trust your instincts - if something feels wrong, leave",
                "Report any inappropriate behavior immediately",
                "Keep a record of your contacts and communications",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          {/* Report */}
          <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Report a Concern
            </h2>
            <p className="text-slate-300 mb-4">
              If you experience harassment, fraud, or any safety concern, please report it immediately.
              Our trust & safety team reviews all reports within 24 hours.
            </p>
            <div className="flex gap-4">
              <Link
                href="/dashboard/support"
                className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-500 transition-colors"
              >
                Report Now
              </Link>
              <a
                href="tel:911"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Emergency: Call 911
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
