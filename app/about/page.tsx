import { Metadata } from "next";
import Link from "next/link";
import { Heart, Shield, Users, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | MasseurMatch",
  description: "Learn about MasseurMatch - connecting clients with licensed massage therapists across the USA.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-white/5">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
            MasseurMatch
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About <span className="bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">MasseurMatch</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            We&apos;re on a mission to connect people with the best massage therapists in their area, making wellness accessible to everyone.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-slate-300 leading-relaxed">
            MasseurMatch was founded with a simple goal: to make finding quality massage therapy easy, safe, and accessible.
            We believe everyone deserves access to professional wellness services, and we&apos;re building the platform to make that happen.
          </p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Shield,
                title: "Trust & Safety",
                description: "Every therapist on our platform is verified. We prioritize your safety above all else.",
              },
              {
                icon: Heart,
                title: "Wellness First",
                description: "We believe in the healing power of massage therapy and its role in overall wellness.",
              },
              {
                icon: Users,
                title: "Community",
                description: "We support massage therapists in building their practice and connecting with clients.",
              },
              {
                icon: Award,
                title: "Quality",
                description: "We maintain high standards for all therapists on our platform.",
              },
            ].map((value) => (
              <div key={value.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <value.icon className="h-8 w-8 text-white mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-slate-400">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { value: "10K+", label: "Therapists" },
              { value: "50+", label: "Cities" },
              { value: "100K+", label: "Connections" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold bg-gradient-to-r from-neutral-200 to-white bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/20 to-neutral-100/20 p-12">
          <h2 className="text-2xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-slate-300 mb-6">Whether you&apos;re a therapist or looking for one, we&apos;d love to have you.</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/join"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-white hover:bg-neutral-200 transition-colors"
            >
              Join as Therapist
            </Link>
            <Link
              href="/explore"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Find a Therapist
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
