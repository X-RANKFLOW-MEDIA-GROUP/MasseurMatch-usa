import { Metadata } from "next";
import Link from "next/link";
import { Shield, AlertTriangle, Phone, Eye, Users, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Anti-Trafficking Policy | MasseurMatch",
  description: "MasseurMatch's commitment to preventing human trafficking and exploitation.",
};

export default function AntiTraffickingPage() {
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
          <h1 className="text-4xl font-bold text-white mb-4">Anti-Trafficking Policy</h1>
          <p className="text-xl text-slate-400">Our commitment to preventing exploitation</p>
        </div>

        <div className="space-y-8">
          {/* Zero Tolerance */}
          <section className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Zero Tolerance Policy
            </h2>
            <p className="text-slate-300 leading-relaxed">
              MasseurMatch has a zero-tolerance policy for human trafficking, exploitation,
              and any form of forced labor. We are committed to maintaining a safe platform
              that protects vulnerable individuals.
            </p>
          </section>

          {/* Our Efforts */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">What We Do</h2>
            <div className="space-y-4">
              {[
                {
                  icon: Eye,
                  title: "Active Monitoring",
                  desc: "Our team uses advanced technology and manual review to detect suspicious activity.",
                },
                {
                  icon: Users,
                  title: "Training",
                  desc: "All staff receive training on recognizing signs of trafficking.",
                },
                {
                  icon: Shield,
                  title: "Law Enforcement Cooperation",
                  desc: "We work closely with authorities to report and investigate concerns.",
                },
                {
                  icon: Heart,
                  title: "Survivor Support",
                  desc: "We connect survivors with resources and support organizations.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start gap-4">
                    <item.icon className="h-6 w-6 text-white shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Signs to Watch */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Signs to Watch For</h2>
            <p className="text-slate-300 mb-4">If you notice any of these warning signs, please report:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Person appears fearful, anxious, or submissive</li>
              <li>Signs of physical abuse or malnourishment</li>
              <li>Inconsistencies in their story or background</li>
              <li>Someone else controls their money or documents</li>
              <li>They seem unable to speak freely or alone</li>
              <li>Living and working in the same location</li>
            </ul>
          </section>

          {/* Resources */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Resources & Hotlines</h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-white" />
                  National Human Trafficking Hotline
                </h3>
                <p className="text-2xl font-bold text-white mb-2">1-888-373-7888</p>
                <p className="text-sm text-slate-400">Available 24/7, confidential</p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="font-semibold text-white mb-2">Text Line</h3>
                <p className="text-lg font-bold text-white mb-2">Text &quot;HELP&quot; to 233733</p>
              </div>
            </div>
          </section>

          {/* Report */}
          <section className="rounded-2xl border border-neutral-300/30 bg-neutral-200/10 p-6 text-center">
            <h2 className="text-xl font-semibold text-white mb-4">Report Suspicious Activity</h2>
            <p className="text-slate-300 mb-4">
              If you suspect trafficking or exploitation on our platform, report it immediately.
            </p>
            <Link
              href="/dashboard/support"
              className="inline-block rounded-xl bg-white px-8 py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
            >
              Report Now
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
