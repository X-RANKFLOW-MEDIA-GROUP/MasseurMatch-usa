import { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle, Shield, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Professional Standards | MasseurMatch",
  description: "Learn about the professional standards and requirements for massage therapists on MasseurMatch.",
};

export default function ProfessionalStandardsPage() {
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
        <h1 className="text-4xl font-bold text-white mb-4">Professional Standards</h1>
        <p className="text-slate-400 mb-8">Our commitment to quality and professionalism</p>

        <div className="space-y-8">
          {/* Expectations */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-violet-400" />
              What We Expect From Therapists
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Professional Conduct",
                  desc: "We expect all therapists to conduct themselves professionally and ethically.",
                },
                {
                  title: "Accurate Information",
                  desc: "Therapists must provide accurate information about their services and qualifications.",
                },
                {
                  title: "Identity Verification",
                  desc: "Therapists can verify their identity through our optional verification process.",
                },
                {
                  title: "Quality Service",
                  desc: "We expect therapists to provide high-quality service to all clients.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Code of Conduct */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-400" />
              Code of Conduct
            </h2>
            <ul className="space-y-3">
              {[
                "Maintain professional boundaries at all times",
                "Respect client privacy and confidentiality",
                "Obtain informed consent before each session",
                "Provide services within scope of training",
                "Maintain a clean and safe environment",
                "Communicate clearly about services and pricing",
                "Honor booking commitments",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Our Review Process */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-400" />
              Our Review Process
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              When you join MasseurMatch, our process includes:
            </p>
            <ol className="list-decimal list-inside text-slate-300 space-y-2">
              <li>Profile content review by our team</li>
              <li>Photo moderation for appropriateness</li>
              <li>Optional identity verification with government ID</li>
              <li>Ongoing community reporting and review</li>
            </ol>
            <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-200">
                <strong>Important:</strong> MasseurMatch does not verify professional licenses, certifications,
                insurance, or conduct background checks. Clients should independently verify any credentials
                important to them before booking.
              </p>
            </div>
          </section>

          {/* Join CTA */}
          <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Join Our Network</h2>
            <p className="text-slate-300 mb-6">
              If you meet our professional standards, we&apos;d love to have you on MasseurMatch.
            </p>
            <Link
              href="/join"
              className="inline-block rounded-xl bg-violet-600 px-8 py-3 font-semibold text-white hover:bg-violet-500 transition-colors"
            >
              Apply Now
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
