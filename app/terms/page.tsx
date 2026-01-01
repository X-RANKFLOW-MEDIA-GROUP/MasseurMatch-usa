import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | MasseurMatch",
  description: "Read the terms and conditions for using MasseurMatch platform.",
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-slate-400 mb-8">Last updated: January 1, 2025</p>

        <div className="prose prose-invert prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing or using MasseurMatch, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p className="text-slate-300 leading-relaxed">
              MasseurMatch provides a platform connecting clients with licensed massage therapists.
              We are a marketplace and do not directly provide massage services. All services are
              provided by independent contractors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
            <p className="text-slate-300 leading-relaxed">
              You must provide accurate information when creating an account. You are responsible for
              maintaining the security of your account and all activities under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Therapist Requirements</h2>
            <p className="text-slate-300 leading-relaxed">
              All therapists must hold valid licenses and certifications as required by their jurisdiction.
              Therapists must maintain appropriate insurance and comply with all applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Prohibited Conduct</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Providing false or misleading information</li>
              <li>Harassment or discrimination of any kind</li>
              <li>Offering or soliciting illegal services</li>
              <li>Violating intellectual property rights</li>
              <li>Attempting to circumvent our platform for payments</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Payments and Fees</h2>
            <p className="text-slate-300 leading-relaxed">
              All payments are processed through our secure payment system. We charge a platform fee
              on each transaction. Refund policies are determined by individual therapists.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              MasseurMatch is not liable for any damages arising from your use of the platform or
              services provided by therapists. We provide the platform &quot;as is&quot; without warranties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact</h2>
            <p className="text-slate-300 leading-relaxed">
              For questions about these terms, contact us at legal@masseurmatch.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
