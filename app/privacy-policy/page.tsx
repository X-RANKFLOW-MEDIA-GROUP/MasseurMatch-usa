import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | MasseurMatch",
  description: "Learn how MasseurMatch collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
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
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-400 mb-8">Last updated: January 1, 2025</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="text-slate-300 leading-relaxed mb-4">We collect information you provide directly:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Account information (name, email, phone)</li>
              <li>Profile information (photos, bio, services)</li>
              <li>Payment information (processed securely by Stripe)</li>
              <li>Communications through our platform</li>
              <li>Location data (with your permission)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>To provide and improve our services</li>
              <li>To process payments and transactions</li>
              <li>To communicate with you about your account</li>
              <li>To ensure safety and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
            <p className="text-slate-300 leading-relaxed">
              We share your information only as necessary to provide our services:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 mt-4">
              <li>With therapists/clients for booking purposes</li>
              <li>With payment processors for transactions</li>
              <li>With service providers who assist our operations</li>
              <li>When required by law or to protect rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We implement industry-standard security measures to protect your data, including
              encryption, secure servers, and regular security audits. However, no method is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p className="text-slate-300 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-slate-300 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">6. Cookies</h2>
            <p className="text-slate-300 leading-relaxed">
              We use cookies and similar technologies to improve your experience, analyze usage,
              and personalize content. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">7. Children&apos;s Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Our services are not intended for users under 18. We do not knowingly collect
              information from children under 18.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">8. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              For privacy-related questions, contact us at privacy@masseurmatch.com
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
