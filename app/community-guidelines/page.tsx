import { Metadata } from "next";
import Link from "next/link";
import { Shield, Heart, Users, AlertTriangle, Ban, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Community Guidelines | MasseurMatch",
  description: "Our community guidelines for a safe and respectful experience on MasseurMatch.",
};

export default function CommunityGuidelinesPage() {
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
        <h1 className="text-4xl font-bold text-white mb-4">Community Guidelines</h1>
        <p className="text-slate-400 mb-8">Creating a safe and respectful community for everyone</p>

        <div className="space-y-8">
          {/* Core Values */}
          <section className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Shield, title: "Safety", desc: "Your wellbeing is our priority" },
              { icon: Heart, title: "Respect", desc: "Treat everyone with dignity" },
              { icon: Users, title: "Community", desc: "Support each other" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <item.icon className="h-8 w-8 text-white mx-auto mb-2" />
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </section>

          {/* Do's */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              What We Encourage
            </h2>
            <ul className="space-y-3">
              {[
                "Be professional in all communications",
                "Respect boundaries and consent",
                "Provide accurate information about your services",
                "Respond promptly to messages and bookings",
                "Report any concerning behavior",
                "Maintain appropriate hygiene and cleanliness",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Don'ts */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-400" />
              Prohibited Behavior
            </h2>
            <ul className="space-y-3">
              {[
                "Harassment, discrimination, or hate speech",
                "Soliciting or offering illegal services",
                "Sharing explicit or inappropriate content",
                "Misrepresenting credentials or services",
                "Using the platform for non-massage services",
                "Creating fake profiles or reviews",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span className="text-red-400 mt-1">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Consequences */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Violations
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Violations of these guidelines may result in:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Warning or temporary suspension</li>
              <li>Permanent account termination</li>
              <li>Reporting to law enforcement if applicable</li>
            </ul>
          </section>

          {/* Reporting */}
          <section className="rounded-2xl border border-white/10 bg-white/10 p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Report a Concern</h2>
            <p className="text-slate-300 mb-4">
              If you experience or witness a violation, please report it immediately.
            </p>
            <Link
              href="/dashboard/support"
              className="inline-block rounded-xl bg-white px-6 py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
            >
              Contact Support
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
