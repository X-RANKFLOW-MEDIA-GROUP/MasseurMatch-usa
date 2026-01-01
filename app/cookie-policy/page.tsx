import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | MasseurMatch",
  description: "Learn about how MasseurMatch uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            MasseurMatch
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold text-white mb-4">Cookie Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: January 1, 2025</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">What Are Cookies?</h2>
            <p className="text-slate-300 leading-relaxed">
              Cookies are small text files stored on your device when you visit a website.
              They help us remember your preferences and improve your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Types of Cookies We Use</h2>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white mb-2">Essential Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Required for the website to function. Cannot be disabled.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white mb-2">Analytics Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Help us understand how visitors interact with our site.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white mb-2">Preference Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Remember your settings and preferences.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold text-white mb-2">Marketing Cookies</h3>
                <p className="text-slate-400 text-sm">
                  Used to deliver relevant advertisements.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="text-slate-300 leading-relaxed">
              You can control cookies through your browser settings. Note that disabling
              certain cookies may affect the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
            <p className="text-slate-300 leading-relaxed">
              Questions? Email us at privacy@masseurmatch.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
