"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, UserCheck, AlertTriangle, CheckCircle } from "lucide-react";

const features = [
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
];

const verificationSteps = [
  "License verification with state boards",
  "Background checks through certified agencies",
  "Identity verification with government ID",
  "Insurance documentation review",
  "Ongoing monitoring and periodic re-verification",
];

const safetyTips = [
  "Contact therapists directly using provided information",
  "Meet in professional settings only",
  "Trust your instincts - if something feels wrong, leave",
  "Report any inappropriate behavior immediately",
  "Keep a record of your contacts and communications",
];

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
      </div>

      <header className="border-b border-white/5 glass sticky top-0 z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-white hover:text-neutral-200 transition-colors">
            MasseurMatch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/explore" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Explore
            </Link>
            <Link href="/join" className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition-colors">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Shield className="h-16 w-16 text-white mx-auto mb-6" />
          <h1 className="text-5xl font-bold text-white mb-4">Trust & Safety</h1>
          <p className="text-xl text-neutral-400">Your safety is our top priority</p>
        </motion.div>

        <div className="space-y-12">
          {/* Safety Features */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors"
                >
                  <feature.icon className="h-10 w-10 text-white mb-4" />
                  <h3 className="font-semibold text-white mb-2 text-lg">{feature.title}</h3>
                  <p className="text-neutral-400">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Verification Process */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Our Verification Process</h2>
            <div className="space-y-4">
              {verificationSteps.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-black font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-neutral-300">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Safety Tips */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Safety Tips</h2>
            <ul className="space-y-4">
              {safetyTips.map((tip, index) => (
                <motion.li
                  key={tip}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 text-neutral-300"
                >
                  <CheckCircle className="h-5 w-5 text-white shrink-0 mt-0.5" />
                  {tip}
                </motion.li>
              ))}
            </ul>
          </motion.section>

          {/* Report Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Report a Concern
            </h2>
            <p className="text-neutral-300 mb-6 leading-relaxed">
              If you experience harassment, fraud, or any safety concern, please report it immediately.
              Our trust & safety team reviews all reports within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard/support"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-neutral-200 transition-colors text-center"
              >
                Report Now
              </Link>
              <a
                href="tel:911"
                className="rounded-xl border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition-colors text-center"
              >
                Emergency: Call 911
              </a>
            </div>
          </motion.section>

          {/* Additional Resources */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Additional Resources</h2>
            <div className="space-y-4">
              <Link
                href="/community-guidelines"
                className="block p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
              >
                <h3 className="font-semibold text-white mb-1">Community Guidelines</h3>
                <p className="text-sm text-neutral-400">Learn about our community standards and expectations</p>
              </Link>
              <Link
                href="/professional-standards"
                className="block p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
              >
                <h3 className="font-semibold text-white mb-1">Professional Standards</h3>
                <p className="text-sm text-neutral-400">What we expect from massage therapists on our platform</p>
              </Link>
              <Link
                href="/privacy-policy"
                className="block p-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
              >
                <h3 className="font-semibold text-white mb-1">Privacy Policy</h3>
                <p className="text-sm text-neutral-400">How we protect and handle your personal information</p>
              </Link>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}
